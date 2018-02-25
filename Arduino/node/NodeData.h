#ifndef NODEDATA_H // stops duplicate reference errors
#define NODEDATA_H

#define NODEDATA_JSON_SIZE JSON_OBJECT_SIZE(6) + 193
const size_t JSON_SERIAL_BUFFER = 200; 

struct NodeData {
    String stream = "UP"; // UP or DOWN
    uint32_t id; // Node ID
    String mode; // What are lights doing
    int variable = -1;
};

/**
 * Parses JSON data from string then populates a NodeData object
 * @param {data} an empty NodeData object that you want updated
 * @param {json} a JSON string from char/string
 * @returns {bool}
 */
bool deserialize(NodeData& data, char* json) {
    StaticJsonBuffer<NODEDATA_JSON_SIZE> jsonBuffer;
    JsonObject& root = jsonBuffer.parseObject(json);
    
    bool isStreamString = root.is<const char*>("stream");
    bool isModeString = root.is<const char*>("mode");
    bool isVariableInt = root.is<int>("variable");

    data.id = root["id"];

    if(isStreamString) {
        data.stream = root["stream"].as<String>();
    }
    
    if(isModeString) {
        data.mode = root["mode"].as<String>();
    }
    if(isVariableInt) {
        data.variable = root["variable"];
    }
    return root.success();
}

/**
 * Parses JSON data from string then populates a NodeData object
 * @param {data} an empty NodeData object that you want updated
 * @param {json} a JSON string from char/string
 * @returns {bool}
 */
bool deserialize(NodeData& data, String &json) {
    StaticJsonBuffer<NODEDATA_JSON_SIZE> jsonBuffer;
    JsonObject& root = jsonBuffer.parseObject(json);
    
    bool isStreamString = root.is<const char*>("stream");
    bool isModeString = root.is<const char*>("mode");
    bool isVariableInt = root.is<int>("variable");

    data.id = root["id"];

    if(isStreamString) {
        data.stream = root["stream"].as<String>();
    }
    if(isModeString) {
        data.mode = root["mode"].as<String>();
    }
    if(isVariableInt) {
        data.variable = root["variable"];
    }
    return root.success();
}


/**
 * Parses JSON data from Serial then populates a NodeData object
 * @param {data} an empty NodeData object that you want updated
 * @param {json} a JSON string from Serial Stream
 * @returns {bool}
 */
bool deserialize(NodeData& data, Stream &json) {
    StaticJsonBuffer<NODEDATA_JSON_SIZE> jsonBuffer;
    JsonObject& root = jsonBuffer.parseObject(json);
    
    bool isStreamString = root.is<const char*>("stream");
    bool isModeString = root.is<const char*>("mode");
    bool isVariableInt = root.is<int>("variable");

    data.id = root["id"];

    if(isStreamString) {
        data.stream = root["stream"].as<String>();
    }
    if(isModeString) {
        data.mode = root["mode"].as<String>();
    }
    if(isVariableInt) {
        data.variable = root["variable"];
    }
    return root.success();
}

/**
 * Parses NodeData object then outputs string JSON
 * @param {data} a NodeData object that will be used to create JSON string
 * @param {json} an empty JSON char to be populated
 * @param {maxSize} max byte size of json
 * @returns {void}
 */
void serialize(const NodeData& data, char* json, size_t maxSize) {
    StaticJsonBuffer<NODEDATA_JSON_SIZE> jsonBuffer;
    JsonObject& root = jsonBuffer.createObject();
    root["stream"] = data.stream;
    root["id"] = data.id;
    root["mode"] = data.mode;
    root["variable"] = data.variable;
    

    // Alternative to using maxSize
    // https://arduinojson.org/faq/how-to-compute-the-json-length/
    //size_t len = root.measureLength(); 
    //size_t size = len+1;
    root.printTo(json, maxSize);
}

void serialize(const NodeData& data, String &json, size_t maxSize) {
    StaticJsonBuffer<NODEDATA_JSON_SIZE> jsonBuffer;
    JsonObject& root = jsonBuffer.createObject();
    root["stream"] = data.stream;
    root["id"] = data.id;
    root["mode"] = data.mode;
    root["variable"] = data.variable;
    
    root.printTo(json);
}
#endif