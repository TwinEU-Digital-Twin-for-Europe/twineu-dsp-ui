(function (window) {
  window.env = window.env || {};

  // Environment variables
  window["env"]["apiUrl"] = "APP_API_URL";
  window["env"]["appName"] = "APP_NAME";
  window["env"]["isPushEnabled"] = "APP_PUSH_ENABLED";
  window["env"]["basePath"] = "APP_BASE_PATH";
  window["env"]["Nats"] = "APP_NATS_ENABLED";
  window["env"]["Kafka"] = "APP_KAFKA_ENABLED";
  window["env"]["appOnenetSettingsId"] = "APP_ONENET_SETTINGS_ID";
  window["env"]["isNotificationEnabled"] = "APP_NOTIFICATION_ENABLED";
  //window["env"]["dataAppName"] = "${DATA_APP_NAME}";
})(this);


