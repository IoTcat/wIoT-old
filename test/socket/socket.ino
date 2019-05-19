#include <ESP8266WiFi.h>
 
const char* ssid = "yimian-ap";
const char* password = "1234567890.";
 
WiFiServer wifiServer(80);
 
void setup() {
 
  Serial.begin(115200);
 
  delay(1000);
 
  WiFi.begin(ssid, password);
 
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting..");
  }
 
  Serial.print("Connected to WiFi. IP:");
  Serial.println(WiFi.localIP());
 
  wifiServer.begin();
}
 
void loop() {
 
  WiFiClient client = wifiServer.available();
 
  if (client) {
 
    while (client.connected()) {
 
      while (client.available()>0) {
        String line = client.readStringUntil('\n');
        Serial.println(line);
        client.print(line);
      }
 
      delay(5);
    }
 
    client.stop();
    Serial.println("Client disconnected");
 
  }
}
