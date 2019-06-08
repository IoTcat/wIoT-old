
#include <EEPROM.h>
#include <ESP8266HTTPUpdateServer.h>
#include <ESP8266WebServer.h>
#include <ESP8266WiFi.h>
#include <ESP8266mDNS.h>
#include <WiFiClient.h>


#ifndef WIFI_STA_SSID
#define WIFI_STA_SSID "yimian-iot"
#define WIFI_STA_PSK "1234567890."
#endif

String ssid = WIFI_STA_SSID;
String password = WIFI_STA_PSK;

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
        Serial.println(t);
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
        Serial.println(c[i]);
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
   pinMode(D4, OUTPUT); 
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

void setup(){

    serial_setup();
    eeprom_setup();
    pin_setup();
    wifi_setup();
    socket_setup();
}

void loop(){

    httpServer.handleClient();

    WiFiClient client = wifiServer.available();

    if (client) {
        while (client.connected()) {
            httpServer.handleClient();
           // socket_send_on(client);

            while (client.available() > 0) {
                String s = client.readStringUntil('\n');
                Serial.println(s);
                // client.print(line);
                /*if (s.substring(0, 2) == "_D" &&
                    EEPROM.read(162 + atoi(s.substring(2, 3).c_str()))) {
                    // Serial.println(atoi(s.substring(2, 3).c_str()));
                    // Serial.println(atoi(s.substring(3, s.length()).c_str()));
                    client.print("{\"type\": \"set\"}");
                    analogWrite(_pin(atoi(s.substring(2, 3).c_str())),
                                atoi(s.substring(3, s.length()).c_str()));
                    if (atoi(s.substring(3, s.length()).c_str()) == 0) {
                        data[atoi(s.substring(2, 3).c_str())] = 0;
                    } else {
                        data[atoi(s.substring(2, 3).c_str())] = 1;
                    }
                }
                if (s.substring(0, 4) == "_GET") {
                    socket_send_all(client);
                }*/
            }

            delay(6);
        }

        client.stop();
    }
}
