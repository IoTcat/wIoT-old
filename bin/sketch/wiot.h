/*
 * @Author: IoTcat (https://iotcat.me) 
 * @Date: 2019-05-02 21:20:48 
 * @Last Modified by: 
 * @Last Modified time: 2019-05-03 00:12:37
 */

#include <EEPROM.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <ESP8266HTTPUpdateServer.h>


#ifndef WEB_PORT
#define WEB_PORT 80
#endif


#ifndef WIFI_STA_SSID
#define WIFI_STA_SSID "wiot"
#define WIFI_STA_PSK  "1234567890"
#endif

const char* ssid = WIFI_STA_SSID;
const char* password = WIFI_STA_PSK;
const char* wiot_version = "v0.0.1";

enum ModeType{AP, STA};
ModeType Mode;

//void(* resetFunc) (void) = 0;

/********** Web Server ***********/
ESP8266WebServer httpServer(WEB_PORT);
ESP8266HTTPUpdateServer httpUpdater;



void serial_setup(){

    Serial.begin(115200);
    Serial.setTimeout(12); 
}


void eeprom_setup(){

    EEPROM.begin(5000);
    EEPROM.write(64, 0);
    EEPROM.commit();
}

void eeprom_insertStr(int start, int end, const String& s){
Serial.println("Write");
    const char *c = s.c_str();
    int i, t;
    for(i = 0; c[i] != '\0' && i < end - start - 1; i++){

        t = *(c+i);
        EEPROM.write(start + i, t);
        Serial.println(t);
    }
    EEPROM.write(start + i, 0x00);
    EEPROM.commit();
}

String eeprom_readStr(int start, int end){

    Serial.println("Read");
    int t[end-start];
    int i;
    for(i = 0; i < end - start - 1; i++){
        
        t[i] = EEPROM.read(start + i);
         Serial.println(t[i]);
    }
    t[i] = 0;

    return "";
}

void wifi_setup(){

    //check the mode
    if(!EEPROM.read(64)){
        //set wifi mode as AP
        WiFi.mode(WIFI_AP);
        WiFi.softAPConfig(IPAddress(192,168,0,1), IPAddress(192,168,0,1), IPAddress(255,255,255,0));
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

void http_ap_root(){

    httpServer.send(200, "text/html", "<html><head><title>wIoT Config</title></head><body><h3>wIoT Client</h3><p>MAC Address: "+WiFi.macAddress()+"</p><p>wIoT Version: "+wiot_version+"</p><form action=\"/cmd\" method=\"get\"><p>Please Input the SSID of your WIFI:</p><input type=\"text\" name=\"ssid\"/><br/><p>Please Input the Password of your WIFI:</p><input type=\"text\" name=\"passwd\"/><br/><br/><input type=\"submit\" value=\"Submit\"/></form><p><font color=\"red\">You Only have ONE chance!! Please be Careful!!</font></p></body></html>");
}


void http_ap_cmd(){

    String t_ssid = httpServer.arg("ssid");
    String t_psk = httpServer.arg("passwd");

    eeprom_insertStr(255, 355, t_ssid);
    eeprom_insertStr(355, 455, t_psk);
    String s = eeprom_readStr(255,270);
    //if(s == "reset") ESP.restart();
    httpServer.send(200, "text/html", "<html><head><title>wIoT Config</title></head><body>"+t_ssid+"||"+t_psk+"||"+s+"</body></html>");
}

void http_setup(){

    if(Mode == STA){
        //OTA setup
        httpUpdater.setup(&httpServer);
    }

    if(Mode == AP){
        //mini dns
        //MDNS.begin("wiot");
        //MDNS.addService("http", "tcp", WEB_PORT);
        httpServer.on("/", http_ap_root);
        httpServer.on("/cmd", http_ap_cmd);
    }

    //httpserver begin
    httpServer.begin();
}






int address = 4000;
int value = 55;

void setup() {

    serial_setup();
    wifi_setup();
    http_setup();


}




void loop() {
httpServer.handleClient();

 EEPROM.write(address, 1+EEPROM.read(address));
 value = EEPROM.read(address);
 EEPROM.commit();
Serial.print(value,DEC);
Serial.print("\n");
delay(1000);






/*
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
