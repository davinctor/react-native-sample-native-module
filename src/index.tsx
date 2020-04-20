import {
  NativeModules,
  NativeEventEmitter,
  EmitterSubscription,
} from 'react-native';

interface PickMediaOptions {
  mediaType?: string;
  title?: string;
}

type SampleNativeModuleType = {
  AUDIO_MEDIA_TYPE: string;
  VIDEO_MEDIA_TYPE: string;
  PHOTO_MEDIA_TYPE: string;
  sum(a: number, b: number, callback: (sum: number) => any): void;
  getDeviceName(): Promise<string>;
  pickMedia(options: PickMediaOptions): Promise<object>;
  registerActivityLifecycleListener(
    callback: (event: object) => any
  ): EmitterSubscription;
};

const {
  LIFECYCLE_EVENT_LISTENER_TYPE,
  AUDIO_MEDIA_TYPE,
  VIDEO_MEDIA_TYPE,
  PHOTO_MEDIA_TYPE,
  sum,
  getDeviceName,
  pickMedia,
} = NativeModules.SampleNativeModule;

function registerActivityLifecycleListener(
  listener: (...args: any[]) => any
): EmitterSubscription {
  const eventEmitter = new NativeEventEmitter(NativeModules.SampleNativeModule);
  return eventEmitter.addListener(LIFECYCLE_EVENT_LISTENER_TYPE, listener);
}

export default {
  AUDIO_MEDIA_TYPE,
  VIDEO_MEDIA_TYPE,
  PHOTO_MEDIA_TYPE,
  registerActivityLifecycleListener,
  sum,
  getDeviceName,
  pickMedia,
} as SampleNativeModuleType;
