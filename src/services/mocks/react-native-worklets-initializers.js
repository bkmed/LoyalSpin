import { SHOULD_BE_USE_WEB } from 'react-native-worklets/lib/module/PlatformChecker';
import { RuntimeKind } from 'react-native-worklets/lib/module/runtimeKind';

let initialized = false;

function initializeRuntimeOnWeb() {
  globalThis._WORKLET = false;
  globalThis._log = console.log;
  globalThis._getAnimationTimestamp = () => performance.now();
}

export function init() {
  if (initialized) {
    return;
  }
  initialized = true;
  if (globalThis.__RUNTIME_KIND === undefined) {
    globalThis.__RUNTIME_KIND = RuntimeKind.ReactNative;
  }

  if (SHOULD_BE_USE_WEB) {
    initializeRuntimeOnWeb();
  }
}

export function getMemorySafeCapturableConsole() {
  return console;
}

export function setupConsole() {}
