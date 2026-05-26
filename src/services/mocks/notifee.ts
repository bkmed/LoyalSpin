// Mock for @notifee/react-native for Web builds

export const TriggerType = {
  TIMESTAMP: 0,
  INTERVAL: 1,
};

export const AndroidImportance = {
  DEFAULT: 3,
  HIGH: 4,
  MAX: 5,
  LOW: 2,
  MIN: 1,
  NONE: 0,
};

export const EventType = {
  DISMISSED: 0,
  PRESS: 1,
  ACTION_PRESS: 2,
  DELIVERED: 3,
  APP_BLOCKED: 4,
  CHANNEL_BLOCKED: 5,
  CHANNEL_GROUP_BLOCKED: 6,
  TRIGGER_NOTIFICATION_CREATED: 7,
};

const notifee = {
  requestPermission: async () => ({ authorizationStatus: 1 }),
  getNotificationSettings: async () => ({ authorizationStatus: 1 }),
  createChannel: async () => 'channel_id',
  displayNotification: async () => 'notification_id',
  createTriggerNotification: async () => 'trigger_id',
  cancelNotification: async () => {},
  cancelAllNotifications: async () => {},
  onBackgroundEvent: async () => {},
  onForegroundEvent: () => () => {},
};

export default notifee;
