#define NODEDATA_JSON_SIZE JSON_OBJECT_SIZE(6) + 193 // TODO: reduce this to actual size
const size_t JSON_SERIAL_BUFFER = 200; 

struct NodeData {
    uint32_t id; // Node ID
    String mode; // What are lights doing
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

    bool isModeString = root.is<const char*>("mode");

    data.id = root["id"].as<uint32_t>();
    if(isModeString) {
        data.mode = root["mode"].as<String>();
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

    bool isModeString = root.is<const char*>("mode");

    data.id = root["id"].as<uint32_t>();
    if(isModeString) {
        data.mode = root["mode"].as<String>();
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
    root["id"] = data.id;
    root["mode"] = data.mode;

    // Alternative to using maxSize
    // https://arduinojson.org/faq/how-to-compute-the-json-length/
    //size_t len = root.measureLength(); 
    //size_t size = len+1;
    root.printTo(json, maxSize);
}