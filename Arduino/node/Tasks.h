#ifndef TASKS_H // stops duplicate reference errors
#define TASKS_H

#include <algorithm>
#include <vector>

std::list<NodeData> queue;

uint16_t displayStep = 0; 
unsigned long ul_PreviousMillis = 0UL;
unsigned long ul_Interval = 20UL; // TODO: see if task schedular can replace this

// Declare Callback methods prototypes
void serialParserTask();
void processQueueTask();
void animationFrameTask();
void statusChangeTask();
void nodeListTask();

// Tasks
// Note: adding the remaining parmaters to Task forces the functions to get called...
Task taskSerialParser(0, TASK_FOREVER, &serialParserTask);
Task taskProcessQueue(0, TASK_ONCE, &processQueueTask);
Task taskAnimationFrame(0, TASK_FOREVER, &animationFrameTask);
Task taskStatusChange(100, TASK_ONCE, &statusChangeTask);

// Mesh
#include "Mesh.h"
#include "LED.h"

/**
 * MASTER ONLY
 * Parse and queue JSON data sent from Controller Serial Stream
 * @returns {void}
 */
void serialParserTask() {
    if (Serial.available() > 0) {
        NodeData data;
        if (deserialize(data, Serial)) {
            data.stream = "DOWN";
            if (data.mode == "SHUFFLE") {
                data.variable = rand() % 75 + 100;
            }
            queue.push_back(data);
            if(!taskProcessQueue.isEnabled()) {
                taskProcessQueue.restartDelayed();
            }
        }
    }
}

/**
 * MASTER ONLY
 * Process tasks in Queue from Controller and broadcast to nodes
 * @returns {void}
 */
void processQueueTask() {
    for (auto const& item : queue) {

        String json;
        serialize(item, json, NODEDATA_JSON_SIZE);

        // Broadcast to all
        if(item.id == 0) {    
            // NOTE: Setting includeSelf to true fails if it is the only node
            // fix would be also send to self: receivedCallback(C_MASTER_NODE_ID, json);
            mesh.sendBroadcast(json, true);
        } else {
            uint32_t nodeID = item.id;
            if (nodeID == C_MASTER_NODE_ID) {
                receivedCallback(nodeID, json);
            } else {
                mesh.sendSingle(nodeID, json);
            }
            
        }
    }
    queue.clear();
}

/**
 * ALL NODES
 * 
 * @returns {void}
 */
void statusChangeTask() {
    NodeData data;
    data.id = mesh.getNodeId();
    data.mode = currentDisplayMode;

    String json;
    serialize(data, json, NODEDATA_JSON_SIZE);

    if (data.id == C_MASTER_NODE_ID) {
        receivedCallback(C_MASTER_NODE_ID, json);
    } else {
        mesh.sendSingle(C_MASTER_NODE_ID, json);
    }
}

/**
 * ALL NODES
 * Task that manages the lights. RAF.
 * @returns {void}
 */
void animationFrameTask() {
    // if the animation delay time has past, run another animation step
    unsigned long ul_CurrentMillis = get_millisecond_timer();
    if (ul_CurrentMillis - ul_PreviousMillis > ul_Interval) {

        ul_PreviousMillis = get_millisecond_timer();
        if (currentDisplayMode == "OFF") {
            
            fadeToBlackBy(leds, FASTLED_NUM_LEDS, 28); //10% 28/256
            FastLED.show();
        
        } else if (currentDisplayMode == "RAINBOW") {
            
            leds[displayStep % FASTLED_NUM_LEDS] = Wheel(displayStep % 255);
            FastLED.show();

        } else if (currentDisplayMode == "SHUFFLE") {
            
            if (displayStep < currentVariable) { 
            
                SimpleList<uint32_t> nodes = mesh.getNodeList();
                int curr_strip_num = (displayStep / 8) % (nodes.size() + 1);
                int node_index = 0;
                uint32_t myNodeID = mesh.getNodeId();

                nodes.push_back(myNodeID);
                sortNodeList(nodes);

                for(uint16_t i=0; i<FASTLED_NUM_LEDS; i++) leds[i] = CRGB(0, 0, 0);
                
                SimpleList<uint32_t>::iterator node = nodes.begin();
                while (node != nodes.end()) {
                    if ((*node == myNodeID) && (node_index == curr_strip_num)) {
                        for(uint16_t i=0; i<FASTLED_NUM_LEDS; i++) leds[i] = CRGB(255, 0, 0);
                    }
                    node_index++;
                    node++;
                }
            }
            FastLED.show();

        }

        displayStep++;
    }

}
#endif