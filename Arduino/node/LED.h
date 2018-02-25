#ifndef LED_H // stops duplicate reference errors
#define LED_H

uint8_t maxBright = DEFAULT_BRIGHTNESS;


/**
 * The colours are a transition r - g - b - back to r.
 * @param {WheelPos} Input a byte value 0 to 255 to get a color value.
 * @returns {CRGB}
 */
CRGB Wheel (byte WheelPos) {
    
    WheelPos = 255 - WheelPos;
    if(WheelPos < 85) {
        return CRGB(255 - WheelPos * 3, 0, WheelPos * 3);
    }

    if(WheelPos < 170) {
        WheelPos -= 85;
        return CRGB(0, WheelPos * 3, 255 - WheelPos * 3);
    }

    WheelPos -= 170;
    return CRGB(WheelPos * 3, 255 - WheelPos * 3, 0);
}

#endif