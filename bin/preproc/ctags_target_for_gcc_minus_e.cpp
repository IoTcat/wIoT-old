# 1 "e:\\Arduino_project\\wIoT\\dist\\newWaterSys\\w2\\w2.ino"
# 1 "e:\\Arduino_project\\wIoT\\dist\\newWaterSys\\w2\\w2.ino"



# 5 "e:\\Arduino_project\\wIoT\\dist\\newWaterSys\\w2\\w2.ino" 2
# 6 "e:\\Arduino_project\\wIoT\\dist\\newWaterSys\\w2\\w2.ino" 2
# 7 "e:\\Arduino_project\\wIoT\\dist\\newWaterSys\\w2\\w2.ino" 2
# 8 "e:\\Arduino_project\\wIoT\\dist\\newWaterSys\\w2\\w2.ino" 2
# 9 "e:\\Arduino_project\\wIoT\\dist\\newWaterSys\\w2\\w2.ino" 2
# 10 "e:\\Arduino_project\\wIoT\\dist\\newWaterSys\\w2\\w2.ino" 2







String ssid = "yimian-iot-s";
String password = "1234567890.";

/********** Web Server ***********/
ESP8266WebServer httpServer(80);
ESP8266HTTPUpdateServer httpUpdater;
WiFiServer wifiServer(8848);

void serial_setup() {
    Serial.begin(115200);
    Serial.setTimeout(12);
}

void eeprom_setup() {
    EEPROM.begin(5000);
    // EEPROM.write(64, 0);
    // EEPROM.commit();
}

void eeprom_insertStr(int start, int end, const String& s) {
    Serial.println("Write");
    const char* c = s.c_str();
    int i, t;
    for (i = 0; c[i] != '\0' && i < end - start - 1; i++) {
        t = *(c + i);
        EEPROM.write(start + i, t);
        //Serial.println(t);
    }
    EEPROM.write(start + i, 0x00);
    EEPROM.commit();
}

String eeprom_readStr(int start, int end) {
    Serial.println("Read");
    char c[end - start];
    int i;
    for (i = 0; EEPROM.read(start + i) != 0x00 && i < end - start - 1; i++) {
        c[i] = EEPROM.read(start + i);
        //Serial.println(c[i]);
    }
    c[i] = 0;
    String s = c;
    return s;
}

auto _pin(int i) {
    if (i == 0) return A0;
    if (i == 1) return D1;
    if (i == 2) return D2;
    if (i == 3) return D3;
    if (i == 4) return D4;
    if (i == 5) return D5;
    if (i == 6) return D6;
    if (i == 7) return D7;
    if (i == 8) return D2;
    if (i == 9) return D3;
    if (i == 10) return D4;
    if (i == 11) return D5;
    if (i == 12) return D6;
    if (i == 13) return D7;
}

void pin_setup() {
   pinMode(D5, 0x01);
   digitalWrite(D5, 0x1);
}

void wifi_setup() {
    // check the mode
    int cnt = 0;

    Serial.println("STA Mode");
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid.c_str(), password.c_str());
    // Disconnected
    while (WiFi.status() != WL_CONNECTED) {
        Serial.println("Disconnected!");
        delay(500);
    }

}


void socket_setup() { wifiServer.begin(); }




//define vairable
volatile double waterFlow;

/***waterFlow functions ***/
void pulse() //measure the quantity of square wave
{
  waterFlow += 1.0 / 450.0;
  eeprom_insertStr(2555, 2588, String(waterFlow));
}


void http_sta_reset() {
    httpServer.send(200, "application/json\r\nAccess-Control-Allow-Origin: *",
                    "{\"state\": \"success\",\"msg\": \"Resetting..\"}");

    ESP.restart();
}




//setup function
void setup()
{
    serial_setup();
    eeprom_setup();
    pin_setup();
    wifi_setup();
    httpUpdater.setup(&httpServer);
    httpServer.on("/reset", http_sta_reset);
    httpServer.begin();
    socket_setup();

  waterFlow = atof(eeprom_readStr(2555, 2588).c_str());
  attachInterrupt(0, pulse, 0x01); //DIGITAL Pin 2: Interrupt 0
}

//main loop function
void loop()
{
    httpServer.handleClient();

    WiFiClient client = wifiServer.available();

    if (client) {
        while (client.connected()) {
            httpServer.handleClient();
           // socket_send_on(client);
            if(wifiServer.available()){
                break;
            }
            while (client.available() > 0) {
                String s = client.readStringUntil('\n');
                Serial.println(s);
                // client.print(line);
                if (s == "_wiot_") {
                    // Serial.println(atoi(s.substring(2, 3).c_str()));
                    // Serial.println(atoi(s.substring(3, s.length()).c_str()));
                    client.print("{ \"flow\": " + String(waterFlow) + " }");
                }
            }

            delay(6);
        }

        client.stop();
    }


}
