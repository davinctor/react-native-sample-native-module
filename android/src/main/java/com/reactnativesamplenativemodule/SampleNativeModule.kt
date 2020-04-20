package com.reactnativesamplenativemodule

import android.app.Activity
import android.content.Intent
import androidx.annotation.Nullable
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import java.util.*


class SampleNativeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  private val activityResultListener = object : ActivityEventListener {
    override fun onNewIntent(intent: Intent?) {
    }

    override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {
      if (requestCode == PICK_MEDIA_REQUEST_CODE) {
        pickMediaPromise?.resolve(Arguments.createMap().apply {
          this.putString(PARAM_MEDIA_URI_KEY, data?.data?.toString())
        })
        pickMediaPromise = null
      }
    }
  }
  private val lifecycleEventListener = object : LifecycleEventListener {
    override fun onHostResume() {
      sendLifecycleEvent(Arguments.createMap().apply {
        this.putString(PARAM_EVENT_NAME_KEY, "resume")
      })
    }

    override fun onHostPause() {
      sendLifecycleEvent(Arguments.createMap().apply {
        this.putString(PARAM_EVENT_NAME_KEY, "pause")
      })
    }

    override fun onHostDestroy() {
      sendLifecycleEvent(Arguments.createMap().apply {
        this.putString(PARAM_EVENT_NAME_KEY, "destroy")
      })
    }
  }
  private var pickMediaPromise: Promise? = null

  init {
    reactContext.addActivityEventListener(activityResultListener)
    reactContext.addLifecycleEventListener(lifecycleEventListener)
  }

  override fun getName() = "SampleNativeModule"

  override fun getConstants(): Map<String, Any>? {
    val constants: MutableMap<String, Any> = HashMap()
    constants[MEDIA_TYPE_PHOTO_KEY] = "image/*"
    constants[MEDIA_TYPE_VIDEO_KEY] = "video/*"
    constants[MEDIA_TYPE_AUDIO_KEY] = "audio/*"
    constants[LIFECYCLE_EVENT_LISTENER_TYPE_KEY] = LIFECYCLE_EVENT_LISTENER_TYPE
    return constants
  }

  // Example method
  // See https://facebook.github.io/react-native/docs/native-modules-android
  @ReactMethod
  fun getDeviceName(promise: Promise) {
    promise.resolve(android.os.Build.MODEL)
  }

  @ReactMethod
  fun sum(a: Int, b: Int, callback: Callback) {
    callback.invoke(a + b)
  }

  @ReactMethod
  fun pickMedia(params: ReadableMap, promise: Promise) {
    val activity = currentActivity
    if (activity == null) {
      promise.reject(ERROR_ACTIVITY_IS_NOT_READY, "Activity is not ready")
      return
    }
    val intent = Intent()
    val mediaType = params.getString(PARAM_MEDIA_TYPE_KEY)
    intent.type = when (mediaType) {
      MEDIA_TYPE_IMAGE,
      MEDIA_TYPE_VIDEO,
      MEDIA_TYPE_AUDIO -> mediaType
      else -> {
        promise.reject(ERROR__UNKNOWN_MEDIA_TYPE, "$mediaType is not supported")
        return
      }
    }
    intent.action = Intent.ACTION_GET_CONTENT
    this.pickMediaPromise = promise
    activity.startActivityForResult(
      Intent.createChooser(intent, params.getString(PARAM_TITLE_KEY)),
      PICK_MEDIA_REQUEST_CODE
    )
  }

  private fun sendLifecycleEvent(@Nullable params: WritableMap) {
    this.reactApplicationContext
      .getJSModule(RCTDeviceEventEmitter::class.java)
      .emit(LIFECYCLE_EVENT_LISTENER_TYPE, params)
  }

  private companion object {
    private const val LIFECYCLE_EVENT_LISTENER_TYPE_KEY = "LIFECYCLE_EVENT_LISTENER_TYPE"
    private const val LIFECYCLE_EVENT_LISTENER_TYPE = "LifecycleEventListener"

    private const val MEDIA_TYPE_PHOTO_KEY = "PHOTO_MEDIA_TYPE"
    private const val MEDIA_TYPE_IMAGE = "image/*"
    private const val MEDIA_TYPE_VIDEO_KEY = "VIDEO_MEDIA_TYPE"
    private const val MEDIA_TYPE_VIDEO = "video/*"
    private const val MEDIA_TYPE_AUDIO_KEY = "AUDIO_MEDIA_TYPE"
    private const val MEDIA_TYPE_AUDIO = "audio/*"

    private const val PARAM_MEDIA_URI_KEY = "mediaUri"
    private const val PARAM_MEDIA_TYPE_KEY = "mediaType"
    private const val PARAM_TITLE_KEY = "title"
    private const val PARAM_EVENT_NAME_KEY = "eventName"

    private const val PICK_MEDIA_REQUEST_CODE = 11

    private const val ERROR_ACTIVITY_IS_NOT_READY = "ERROR_ACTIVITY_IS_NOT_READY"
    private const val ERROR__UNKNOWN_MEDIA_TYPE = "ERROR__UNKNOWN_MEDIA_TYPE"
  }
}
