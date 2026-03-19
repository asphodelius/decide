import type {
  CurrencyCode,
  DecisionDraft,
  DecisionRecord,
  DecisionReminder,
  DecisionVerdict,
  EmotionTag,
  RealityCheckCode,
  ReminderOption,
  VerdictKind,
} from "@/store/types";
import { clamp, normalizeTitle, parsePrice, uid } from "@/lib/utils";

const DAILY_RATE_BASELINE: Record<CurrencyCode, number> = {
  RUB: 8000,
  USD: 180,
  EUR: 170,
};
const COST_EQUIVALENTS: Record<CurrencyCode, Array<{ key: string; unit: number }>> = {
  RUB: [
    { key: "result.reframes.coffeeRuns", unit: 250 },
    { key: "result.reframes.metroTrips", unit: 70 },
    { key: "result.reframes.streamingMonths", unit: 799 },
  ],
  USD: [
    { key: "result.reframes.coffeeRuns", unit: 5 },
    { key: "result.reframes.rideShares", unit: 18 },
    { key: "result.reframes.streamingMonths", unit: 16 },
  ],
  EUR: [
    { key: "result.reframes.coffeeRuns", unit: 4 },
    { key: "result.reframes.rideShares", unit: 16 },
    { key: "result.reframes.streamingMonths", unit: 14 },
  ],
};
const PRESSURE_WORDS = ["save", "saving", "budget", "debt", "rent", "mortgage", "econom", "коп", "долг", "ипот", "эконом"];
const IMPULSE_WORDS = ["now", "today", "urgent", "sale", "limited", "drop", "need it", "сроч", "скид", "распрод", "сейчас"];

function scoreFactors(items: DecisionDraft["pros"] | DecisionDraft["cons"]) {
  return items.reduce((sum, item) => sum + item.weight, 0);
}

function tagWeight(items: Array<{ tag?: EmotionTag | null; weight: number }>, tag: EmotionTag) {
  return items.reduce((sum, item) => sum + (item.tag === tag ? item.weight : 0), 0);
}

function containsAny(value: string, words: string[]) {
  const lowered = value.toLowerCase();
  return words.some((word) => lowered.includes(word));
}

function getAllFactors(decision: Pick<DecisionRecord, "pros" | "cons">) {
  return [...decision.pros, ...decision.cons];
}

function findSimilarDecision(title: string, history: DecisionRecord[]) {
  const normalized = normalizeTitle(title);

  return history.find((item) => {
    const candidate = normalizeTitle(item.title);
    return candidate === normalized || candidate.includes(normalized) || normalized.includes(candidate);
  });
}

function buildChecks(draft: DecisionDraft, history: DecisionRecord[], price: number | null) {
  const checks: RealityCheckCode[] = [];
  const totalFactors = draft.pros.length + draft.cons.length;
  const combinedText = [draft.title, draft.note, ...draft.cons.map((item) => item.text)].join(" ");
  const allFactors = [...draft.pros, ...draft.cons];
  const desireBias = tagWeight(allFactors, "desire") + tagWeight(allFactors, "status");
  const logicBias = tagWeight(allFactors, "logic") + tagWeight(allFactors, "growth");
  const prosScore = scoreFactors(draft.pros);
  const consScore = scoreFactors(draft.cons);

  if (totalFactors <= 2) {
    checks.push("thin_evidence");
  }

  if (price && (containsAny(combinedText, PRESSURE_WORDS) || draft.cons.some((item) => containsAny(item.text, PRESSURE_WORDS)))) {
    checks.push("price_vs_pressure");
  }

  if (price && containsAny([draft.title, draft.note, ...draft.pros.map((item) => item.text)].join(" "), IMPULSE_WORDS)) {
    checks.push("impulse_bias");
  }

  const similarDecision = findSimilarDecision(draft.title, history);
  if (similarDecision && similarDecision.outcome !== "worth_it") {
    checks.push("history_repeat");
  }

  if (desireBias > logicBias + 2) {
    checks.push("desire_over_logic");
  }

  if (consScore >= prosScore + 4) {
    checks.push("cons_heavy");
  }

  return checks;
}

function buildNarrative(kind: VerdictKind, checks: RealityCheckCode[]) {
  if (checks.includes("history_repeat")) {
    return "verdict.narratives.historyRepeat";
  }

  if (checks.includes("price_vs_pressure")) {
    return "verdict.narratives.moneyConflict";
  }

  if (checks.includes("impulse_bias")) {
    return "verdict.narratives.impulse";
  }

  if (kind === "yes") {
    return "verdict.narratives.commit";
  }

  if (kind === "no") {
    return "verdict.narratives.release";
  }

  return "verdict.narratives.pause";
}

export function evaluateDecision(draft: DecisionDraft, history: DecisionRecord[]): DecisionVerdict {
  const price = parsePrice(draft.price);
  const prosScore = scoreFactors(draft.pros);
  const consScore = scoreFactors(draft.cons);
  const checks = buildChecks(draft, history, price);
  const pressurePenalty =
    (checks.includes("price_vs_pressure") ? 2.6 : 0) +
    (checks.includes("impulse_bias") ? 1.8 : 0) +
    (checks.includes("history_repeat") ? 2.4 : 0) +
    (checks.includes("thin_evidence") ? 1.2 : 0) +
    (checks.includes("desire_over_logic") ? 1.5 : 0);

  const rawScore = prosScore - consScore - pressurePenalty;
  const spreadBase = Math.max(prosScore + consScore, 1);
  const score = clamp(Math.round((rawScore / spreadBase) * 100), -100, 100);

  let kind: VerdictKind = "pause";

  if (score >= 18) {
    kind = "yes";
  } else if (score <= -12) {
    kind = "no";
  }

  if (kind === "yes" && checks.includes("thin_evidence")) {
    kind = "pause";
  }

  if (Math.abs(score) <= 12 || checks.includes("cons_heavy")) {
    kind = score > 8 ? "pause" : kind;
  }

  return {
    kind,
    score,
    prosScore,
    consScore,
    headlineKey: kind === "yes" ? "verdict.headlines.yes" : kind === "no" ? "verdict.headlines.no" : "verdict.headlines.pause",
    sublineKey: kind === "yes" ? "verdict.sublines.yes" : kind === "no" ? "verdict.sublines.no" : "verdict.sublines.pause",
    narrativeKey: buildNarrative(kind, checks),
    checks: checks.length ? checks : ["need_more_time"],
  };
}

export function buildReminder(option: ReminderOption | null): DecisionReminder | null {
  if (!option) {
    return null;
  }

  const hours = option === "24h" ? 24 : 72;

  return {
    option,
    scheduledFor: new Date(Date.now() + hours * 60 * 60 * 1000).toISOString(),
  };
}

export function getReminderSeconds(option: ReminderOption) {
  return option === "24h" ? 24 * 60 * 60 : 3 * 24 * 60 * 60;
}

export function getWorkdayEstimate(price: number | null, currency: CurrencyCode = "USD") {
  if (!price) {
    return null;
  }

  return Math.max(Math.round((price / DAILY_RATE_BASELINE[currency]) * 10) / 10, 0.5);
}

export function getCostReframes(price: number | null, currency: CurrencyCode = "USD") {
  if (!price) {
    return [];
  }

  return COST_EQUIVALENTS[currency]
    .map((item) => ({
      key: item.key,
      count: Math.max(Math.round((price / item.unit) * 10) / 10, 1),
    }))
    .slice(0, 3);
}

export function getPatternMemoryKeys(decision: DecisionRecord, history: DecisionRecord[]) {
  const previous = history.filter((item) => item.id !== decision.id);
  const patternKeys: string[] = [];
  const similar = findSimilarDecision(decision.title, previous);

  if (similar?.outcome === "regret") {
    patternKeys.push("result.patterns.similarRegret");
  } else if (similar?.outcome === "mixed") {
    patternKeys.push("result.patterns.similarMixed");
  }

  const expensiveRegrets = previous.filter((item) => item.price && decision.price && item.price >= decision.price * 0.8 && item.outcome === "regret").length;
  if (expensiveRegrets >= 2) {
    patternKeys.push("result.patterns.expensiveRegret");
  }

  const desireHeavyMisses = previous.filter((item) => {
    const allFactors = getAllFactors(item);
    const desireBias = tagWeight(allFactors, "desire") + tagWeight(allFactors, "status");
    const logicBias = tagWeight(allFactors, "logic") + tagWeight(allFactors, "growth");
    return desireBias > logicBias && item.outcome !== "worth_it" && item.outcome !== "unknown";
  }).length;

  if (desireHeavyMisses >= 2) {
    patternKeys.push("result.patterns.desireUnderperforms");
  }

  return [...new Set(patternKeys)].slice(0, 2);
}

export function getPatternMemoryMetrics(decision: DecisionRecord, history: DecisionRecord[]) {
  const previous = history.filter((item) => item.id !== decision.id && item.outcome !== "unknown");
  const metrics: Array<{ titleKey: string; bodyKey: string; values: Record<string, number> }> = [];

  if (previous.length < 2) {
    return metrics;
  }

  if (decision.price) {
    const similarCost = previous.filter((item) => item.price && item.price >= decision.price! * 0.8);
    if (similarCost.length >= 2) {
      const misses = similarCost.filter((item) => item.outcome !== "worth_it").length;
      metrics.push({
        titleKey: "result.patternMetrics.expensiveTitle",
        bodyKey: "result.patternMetrics.expensiveBody",
        values: {
          misses,
          total: similarCost.length,
        },
      });
    }
  }

  const desireDriven = previous.filter((item) => {
    const allFactors = getAllFactors(item);
    const desireBias = tagWeight(allFactors, "desire") + tagWeight(allFactors, "status");
    const logicBias = tagWeight(allFactors, "logic") + tagWeight(allFactors, "growth");
    return desireBias > logicBias;
  });

  if (desireDriven.length >= 2) {
    const worthIt = desireDriven.filter((item) => item.outcome === "worth_it").length;
    metrics.push({
      titleKey: "result.patternMetrics.desireTitle",
      bodyKey: "result.patternMetrics.desireBody",
      values: {
        worthIt,
        total: desireDriven.length,
      },
    });
  }

  const similarTitles = previous.filter((item) => {
    const current = normalizeTitle(decision.title);
    const candidate = normalizeTitle(item.title);
    return candidate === current || candidate.includes(current) || current.includes(candidate);
  });

  if (similarTitles.length >= 2) {
    const misses = similarTitles.filter((item) => item.outcome !== "worth_it").length;
    metrics.push({
      titleKey: "result.patternMetrics.repeatTitle",
      bodyKey: "result.patternMetrics.repeatBody",
      values: {
        misses,
        total: similarTitles.length,
      },
    });
  }

  return metrics.slice(0, 2);
}

export function getOutcomeLoopCandidate(history: DecisionRecord[]) {
  return [...history]
    .filter((item) => item.outcome === "unknown" && getDaysSince(item.createdAt) >= 5)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())[0];
}

export function getDaysSince(value: string) {
  return Math.max(Math.floor((Date.now() - new Date(value).getTime()) / (24 * 60 * 60 * 1000)), 0);
}

export function getPatternSummary(history: DecisionRecord[]) {
  const completed = history.filter((item) => item.outcome !== "unknown");
  if (completed.length < 2) {
    return null;
  }

  const regrets = completed.filter((item) => item.outcome === "regret").length;
  const worthIt = completed.filter((item) => item.outcome === "worth_it").length;
  const mixed = completed.filter((item) => item.outcome === "mixed").length;

  if (regrets >= worthIt && regrets >= mixed) {
    return {
      titleKey: "home.patternSummary.regretTitle",
      bodyKey: "home.patternSummary.regretBody",
      values: { regrets, total: completed.length },
    };
  }

  if (worthIt > regrets && worthIt >= mixed) {
    return {
      titleKey: "home.patternSummary.worthItTitle",
      bodyKey: "home.patternSummary.worthItBody",
      values: { worthIt, total: completed.length },
    };
  }

  return {
    titleKey: "home.patternSummary.mixedTitle",
    bodyKey: "home.patternSummary.mixedBody",
    values: { mixed, total: completed.length },
  };
}

export function getDesireVsLogicStats(history: DecisionRecord[]) {
  const completed = history.filter((item) => item.outcome !== "unknown");

  const desireDriven = completed.filter((item) => {
    const allFactors = getAllFactors(item);
    return tagWeight(allFactors, "desire") + tagWeight(allFactors, "status") > tagWeight(allFactors, "logic") + tagWeight(allFactors, "growth");
  });

  const logicDriven = completed.filter((item) => {
    const allFactors = getAllFactors(item);
    return tagWeight(allFactors, "logic") + tagWeight(allFactors, "growth") >= tagWeight(allFactors, "desire") + tagWeight(allFactors, "status");
  });

  const desireWins = desireDriven.filter((item) => item.outcome === "worth_it").length;
  const logicWins = logicDriven.filter((item) => item.outcome === "worth_it").length;

  return {
    desireCount: desireDriven.length,
    desireRate: desireDriven.length ? Math.round((desireWins / desireDriven.length) * 100) : 0,
    logicCount: logicDriven.length,
    logicRate: logicDriven.length ? Math.round((logicWins / logicDriven.length) * 100) : 0,
  };
}

export function buildDecisionRecord(
  draft: DecisionDraft,
  history: DecisionRecord[],
  notificationId?: string | null,
): DecisionRecord {
  const now = new Date().toISOString();
  const reminder = buildReminder(draft.reminder);

  return {
    id: uid("decision"),
    title: draft.title.trim(),
    price: parsePrice(draft.price),
    currency: draft.currency ?? "USD",
    note: draft.note.trim(),
    pros: draft.pros,
    cons: draft.cons,
    reminder: reminder ? { ...reminder, notificationId } : null,
    verdict: evaluateDecision(draft, history),
    outcome: "unknown",
    createdAt: now,
    updatedAt: now,
  };
}

export function isDraftReady(draft: DecisionDraft) {
  return Boolean(draft.title.trim()) && draft.pros.length > 0 && draft.cons.length > 0;
}
