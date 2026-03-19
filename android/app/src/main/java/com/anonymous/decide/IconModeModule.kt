package com.anonymous.decide

import android.content.ComponentName
import android.content.pm.PackageManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class IconModeModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "IconMode"

  @ReactMethod
  fun setDynamicEnabled(enabled: Boolean, promise: Promise) {
    try {
      val packageManager = reactContext.packageManager
      val dynamicAlias = ComponentName(reactContext, "com.anonymous.decide.DynamicIconAlias")
      val staticAlias = ComponentName(reactContext, "com.anonymous.decide.StaticIconAlias")

      packageManager.setComponentEnabledSetting(
        dynamicAlias,
        if (enabled) PackageManager.COMPONENT_ENABLED_STATE_ENABLED else PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
        PackageManager.DONT_KILL_APP
      )

      packageManager.setComponentEnabledSetting(
        staticAlias,
        if (enabled) PackageManager.COMPONENT_ENABLED_STATE_DISABLED else PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
        PackageManager.DONT_KILL_APP
      )

      promise.resolve(null)
    } catch (error: Exception) {
      promise.reject("ICON_MODE_ERROR", error)
    }
  }
}
