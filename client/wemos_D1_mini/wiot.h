#include <EEPROM.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <ESP8266HTTPUpdateServer.h>


#ifndef WIFI_STA_SSID
#define WIFI_STA_SSID "wiot"
#define WIFI_STA_PSK  "1234567890"
#endif

const char* ssid = WIFI_STA_SSID;
const char* password = WIFI_STA_PSK;

enum ModeType{AP, STA}
ModeType Mode;


/********** Web Server ***********/
ESP8266WebServer httpServer(80);
ESP8266HTTPUpdateServer httpUpdater;




void serial_setup(){

    Serial.begin(115200);
    Serial.setTimeout(12); 
}


void eeprom_setup(){

    EEPROM.begin(5000);
}


void wifi_setup(){

    //check the mode
    if(!EEPROM.read(64)){
        //set wifi mode as AP
        WiFi.mode(WIFI_AP);
        WiFi.softAP(("wiot-" + WiFi.macAddress()).c_str(),password,1);
        WiFi.begin();
        Mode = AP;
    }else{
        //set wifi mode as AP_STA
        WiFi.mode(WIFI_STA);
        WiFi.begin(ssid, password);
        Mode = STA;
    }

    //Disconnected
    while (WiFi.status() != WL_CONNECTED) {
        Serial.println("Disconnected!");
        delay(500);
    }
}


void http_setup(){

    if(Mode == STA){
        //OTA setup
        httpUpdater.setup(&httpServer);
        //httpserver begin
        httpServer.begin();
    }
}








void setup() {

    serial_setup();
    wifi_setup();
    http_setup();
}




void loop() {
httpServer.handleClient();/*
    EEPROM.write(0x01, 0x02);
    static String res = "";
    static String to = "";
    static unsigned long t= millis();

    if(millis() > t + 25){
        if(Serial.available() > 0) to = Serial.readStringUntil('\n');
        Serial.println(res);
        t = millis();
    }

    

    // Check if a client has connected
    WiFiClient client = server.available();
    if (!client) {
        return;
    }


    client.setTimeout(5000); // default is 1000

    // Read the first line of the request
    String req = client.readStringUntil('\r');

    char res_char[8];

    if (req.indexOf(F("/cmd/")) != -1){

        const char *t_req = req.c_str();
        res = "";
        for(int i = 0; i < 8; i++) res_char[i] = t_req[10+i];
        res = res_char;
    }


    while (client.available()) {

        client.read();
    }

    client.print(F("HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nAccess-Control-Allow-Origin: *\r\n\r\n" ));
    client.print(EEPROM.read(0x01));
*/
}
