#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <TaskScheduler.h>
#include <FirebaseArduino.h>
#include "Settings.h"
#include "Tasks.h"


void setup() {
    // Serial
    Serial.begin(115200);
    while (!Serial) {} // Wait till Serial1 is up and running

    // Connect to wifi.
    Serial.printf("Connecting to %s\n", STATION_SSID);
    WiFi.mode(WIFI_STA);
    WiFi.begin(STATION_SSID, STATION_PASSWORD);
    while (WiFi.status() != WL_CONNECTED) {
        Serial.print(".");
        delay(200);
    }
    Serial.printf("\nConntected to %s\n", STATION_SSID);

    // Firebase
    Serial.println("Connecting to Firebase");
    Firebase.begin(FIREBASE_HOST,FIREBASE_AUTH);

    // Tasks
    scheduler.init();
    scheduler.addTask(taskSerialParser);
    scheduler.addTask(taskProcessQueue);
    scheduler.addTask(taskConnectStream);
    scheduler.addTask(taskFirebaseStream);
    taskSerialParser.enableDelayed();
    taskConnectStream.enableDelayed();
    taskFirebaseStream.enableDelayed();

}
void loop() {
    yield();
    scheduler.execute();
}

