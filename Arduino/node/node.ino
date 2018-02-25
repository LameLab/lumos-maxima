#define TIME_SYNC_INTERVAL  60000000  // Mesh time resync period, in us. 1 minute
#define FASTLED_ALLOW_INTERRUPTS 0

#include <Arduino.h>
#include <painlessMesh.h>
#include <FastLED.h>
#include "Settings.h"

painlessMesh mesh;
#include <list>
using namespace std;
#include "NodeData.h"


#include "Tasks.h"
#include "Master.h"





void setup() {
    // Serial
    Serial.begin(115200);
    while (!Serial) {} // Wait till Serial is up and running (this is really only needed for USB)

    // FastLED 
    FastLED.addLeds<WS2801, FASTLED_DATA_PIN, FASTLED_CLOCK_PIN, RGB>(leds, FASTLED_NUM_LEDS);
    FastLED.setBrightness(maxBright);
    set_max_power_in_volts_and_milliamps(5, 500); // FastLED Power management set at 5V, 500mA.

    // Mesh
    //mesh.setDebugMsgTypes( ERROR | MESH_STATUS | CONNECTION | SYNC | COMMUNICATION | GENERAL | MSG_TYPES | REMOTE );
    mesh.init(MESH_SSID, MESH_PASSWORD, MESH_PORT);
    mesh.onReceive(&receivedCallback);
    mesh.onNewConnection(&newConnectionCallback);

    // Tasks
    mesh.scheduler.addTask(taskAnimationFrame);
    mesh.scheduler.addTask(taskStatusChange);
    taskAnimationFrame.enable();

    checkIfMaster();

}

void loop() {
    yield(); //Resolves flicking of LEDs...
    mesh.update();
    
}