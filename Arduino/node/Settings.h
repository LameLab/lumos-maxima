/* Mesh Network */
const String MESH_SSID = "LumosMaxima";
const String MESH_PASSWORD = "somethingReallySneaky"; //Replace this
const int MESH_PORT = 5555;

/* Master Node */
// TODO: Get master Node ID automatically
uint32_t C_MASTER_NODE_ID = 2144583103; //Replace this with your master

// Globals
bool selected = false;
String role = "SLAVE";

/* LEDs */
#define DEFAULT_BRIGHTNESS 80  // 0-255, higher number is brighter.
static const uint8_t FASTLED_DATA_PIN = 13; // White Wire | D7
static const uint8_t FASTLED_CLOCK_PIN = 12; // Green Wire | D6
static const int FASTLED_NUM_LEDS = 1; 
CRGB leds[FASTLED_NUM_LEDS]; // How many LEDs
int currentVariable = 0;
String currentDisplayMode = "OFF"; // Which mode do we start with
