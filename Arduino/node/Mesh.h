#ifndef MESH_H // stops duplicate reference errors
#define MESH_H


/**
 * Listen for new node connections.
 * @param {nodeId} the node id that connected
 * @returns {void}
 */
void newConnectionCallback( uint32_t nodeId ) {
    
}

/**
 * Every time this node receives a message, this callback routine will the called.
 * @param {from} the id of the original sender of the message
 * @param {msg} a JSON string that contains the message
 * @returns {void}
 */
void receivedCallback( uint32_t from, String &msg ) {

    NodeData data;
    if (deserialize(data, msg)) {
        if(data.stream == "UP") {
            if (role == "MASTER") {
                Serial.print(msg);
            }
        } else if(data.stream == "DOWN") {
            // queue.push_back(data);
            // if(!taskProcessQueue.isEnabled()) {
            //     taskProcessQueue.restartDelayed();
            // }
            displayStep = 0;
            ul_PreviousMillis = 0UL;
            ul_Interval = 20UL;
            if(data.mode == "SHUFFLE") {
                ul_Interval = 30UL;
                currentVariable = data.variable;
            }
            currentDisplayMode = data.mode;
            if(!taskStatusChange.isEnabled()) {
                taskStatusChange.restartDelayed();
            }
        }

        
    }
}


/**
 * Makes each pattern/mode sync across nodes
 * @returns {uint32_t}
 */
uint32_t get_millisecond_timer() {
   return mesh.getNodeTime()/1000 ;
}


/**
 * Sort a list of nodes IDs by smallest
 * @param {SimpleList<uint32_t>} a list of nodes' IDs
 * @returns {uint32_t}
 */
void sortNodeList(SimpleList<uint32_t> &nodes) {
  SimpleList<uint32_t> nodes_sorted;
  SimpleList<uint32_t>::iterator smallest_node;

  while (nodes.size() > 0) {
    // find the smallest one
    smallest_node = nodes.begin();
    for (SimpleList<uint32_t>::iterator node = nodes.begin(); node != nodes.end(); ++node) {
      if (*node < *smallest_node) smallest_node = node;
    }

    // add it to the sorted list and remove it from the old list
    nodes_sorted.push_back(*smallest_node);
    nodes.erase(smallest_node);
  }

  // copy the sorted list back into the now empty nodes list
  for (SimpleList<uint32_t>::iterator node = nodes_sorted.begin(); node != nodes_sorted.end(); ++node) nodes.push_back(*node);
} 

#endif