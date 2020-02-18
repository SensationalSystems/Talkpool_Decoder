/* 
 * Decoder function for The Things Network to unpack the payload of Talkpool's OY1310 sensor
 * More info on the sensors/buy online:
 * https://connectedthings.store/gb/talkpool-oy1310-single-jet-lorawan-smart-water-meter.html
 * This function was created by Cameron Sharp at Sensational Systems - cameron@sensational.systems
 */

function Decoder(bytes, port) {

    var params = {
        "bytes": bytes
    }

    if (bytes[1] === 0x21) {
        // Handle volume 

        vol = (((bytes[2] << 24) | (bytes[3] << 16)) | (bytes[4] << 8)) | bytes[5];
        params.current_volume = vol;

        if (bytes.length > 6) {
            // Handle alarm

            alarm = bytes[8];
            
            flow_exceed = 0x80;
            magnet_fraud = 0x20;
            module_remove = 0x08;
            leakage = 0x01;

            if ((alarm & flow_exceed) == flow_exceed) {
                params.flow_exceed = true;
            }
            
            if ((alarm & magnet_fraud) == magnet_fraud) {
                params.magnet_fraud = true;
            }
            
            if ((alarm & module_remove) == module_remove) {
                params.module_removed = true;
            }
            
            if ((alarm & leakage) == leakage) {
                params.leakage = true;
            }
        }

    } else if (bytes[1] === 0x27) {
        // Handle back flow volume

        back_vol = (((bytes[2] << 24) | (bytes[3] << 16)) | (bytes[4] << 8)) | bytes[5];
        params.backflow_volume = back_vol;

    } else if (bytes[1] === 0x06) {
        // Handle CPU Voltage

        raw_volt = bytes[2];
        params.voltage = raw_volt * 25;

    } else if (bytes[1] === 0x0a) {
        // Handle CPU Temperature

        raw_temp = (bytes[2] << 8) | bytes[3];
        params.temperature = (raw_temp * 0.01) - 50;
    }

    return params
}