#include <list>
#include "NodeData.h"
using namespace std;

/* USER */
#define USER "" //TODO: dont hardcode user...

Scheduler scheduler;
std::list<NodeData> queue;

bool isBusyFlag = false;

// Declare Callback methods prototypes
void serialParserTask();
void processQueueTask();
void connectStreamTask();
void firebaseStreamTask();


// Tasks
// Note: adding the remaining parmaters to Task forces the functions to get called...
Task taskSerialParser(0, TASK_FOREVER, &serialParserTask);
Task taskProcessQueue(500, TASK_FOREVER, &processQueueTask);
Task taskConnectStream(0, TASK_ONCE, &connectStreamTask);
Task taskFirebaseStream(0, TASK_FOREVER, &firebaseStreamTask);

/**
 * Connects to Firebase Stream
 * Needs to be restarted anytime https://github.com/firebase/firebase-arduino/pull/294
 * @returns {void}
 */
void connectStreamTask() {
    String path = "/";
    path += USER;
    path += "/input";
    Firebase.stream(path);
    if (Firebase.failed()) {
        Serial.println("streaming error");
        Serial.println(Firebase.error());
    }
}

/**
 * Print to Serial changes from Firebase for nodes to pick up 
 * @returns {void}
 */
void firebaseStreamTask() {
    if (Firebase.failed()) {
        Serial.print("Error Firebase Stream: ");
        Serial.println(Firebase.error());
    }
    if (Firebase.available()) {
        isBusyFlag = true;
        FirebaseObject event = Firebase.readEvent();
        String eventType = event.getString("type");
        eventType.toLowerCase();
        if (eventType == "put") {
            String path = event.getString("path");
            // Respond to: /324132132 etc. but not /
            if(!path.endsWith("/")) {
                JsonVariant json = event.getJsonVariant("data");
                json.printTo(Serial);
            }
        }
    } else {
        isBusyFlag = false;
    }
}

/**
 * Parse and queue JSON data sent from Serial Stream
 * @returns {void}
 */
void serialParserTask() {
    if (Serial.available() > 0) {
        NodeData data;
        if (deserialize(data, Serial)) {
            queue.push_back(data);
            if(!taskProcessQueue.isEnabled()) {
                taskProcessQueue.restartDelayed();
            }
        }
    }
}


/**
 * Process tasks in Up Stream Queue then clear queue
 * @returns {void}
 */
void processQueueTask() {
    bool restartStream = false;

    if (isBusyFlag || queue.size() < 1) {
        return;
    }

    for (auto const& item : queue) {

        String path = "/";
        path += USER;
        path += "/devices/";
        path += item.id;

        // Always update ID
        Firebase.setInt(path + "/id", item.id);
        restartStream = true;
        if (Firebase.failed()) {
            Serial.print("Error Firebase: ");
            Serial.println(path + "/id");
            Serial.println(Firebase.error());
        }

        if (item.mode.length() > 0) {
            Firebase.setString(path + "/mode", item.mode);
            restartStream = true;
            if (Firebase.failed()) {
                Serial.print("Error Firebase: ");
                Serial.println(path + "/mode");
                Serial.println(Firebase.error());
            }
        }
    }
    queue.clear();

    // Restart Stream
    // https://github.com/firebase/firebase-arduino/pull/294
    if (restartStream) {
        taskConnectStream.restart();
    }
}
