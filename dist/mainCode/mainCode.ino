#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <FS.h>

ESP8266WebServer server ( 80 );
String ssid = "yimian-iot"; //你的wifi热点名称
String password = "1234567890."; //你的wifi热点密码

int disCntCount=0;

String getContentType(String filename){
  if(server.hasArg("download")) return "application/octet-stream";
  else if(filename.endsWith(".htm")) return "text/html";
  else if(filename.endsWith(".html")) return "text/html";
  else if(filename.endsWith(".css")) return "text/css";
  else if(filename.endsWith(".js")) return "application/javascript";
  else if(filename.endsWith(".png")) return "image/png";
  else if(filename.endsWith(".gif")) return "image/gif";
  else if(filename.endsWith(".jpg")) return "image/jpeg";
  else if(filename.endsWith(".ico")) return "image/x-icon";
  else if(filename.endsWith(".xml")) return "text/xml";
  else if(filename.endsWith(".pdf")) return "application/x-pdf";
  else if(filename.endsWith(".zip")) return "application/x-zip";
  else if(filename.endsWith(".gz")) return "application/x-gzip";
  return "text/plain";
}

/* wifi 连接 */
void wifiCnct()  {
  int connectCount = 0;
  WiFi.begin ( ssid.c_str(), password.c_str() );
  while ( WiFi.status() != WL_CONNECTED ) {
    digitalWrite(2, HIGH);
    delay ( 1000 );
    Serial.print ( "." );
    if(connectCount > 30) {
      Serial.println( "Connect fail!" );
      break;
    }
    connectCount += 1;
  }
  if(WiFi.status() == WL_CONNECTED) {
    Serial.println ( "" );
    Serial.print ( "Connected to " );
    Serial.println ( ssid );
    Serial.print ( "IP address: " );
    Serial.println ( WiFi.localIP() );
    connectCount = 0;
    digitalWrite(2, LOW);
  }
}

/* NotFound处理 */
void handleNotFound() {
  String path = server.uri();
  Serial.print("load url:");
  Serial.println(path);
  String contentType = getContentType(path);
  String pathWithGz = path + ".gz";
  if(SPIFFS.exists(pathWithGz) || SPIFFS.exists(path)){
    if(SPIFFS.exists(pathWithGz))
      path += ".gz";
    File file = SPIFFS.open(path, "r");
    size_t sent = server.streamFile(file, contentType);
    file.close();
    return;
  }
  String message = "File Not Found\n\n";
  message += "URI: ";
  message += server.uri();
  message += "\nMethod: ";
  message += ( server.method() == HTTP_GET ) ? "GET" : "POST";
  message += "\nArguments: ";
  message += server.args();
  message += "\n";
  for ( uint8_t i = 0; i < server.args(); i++ ) {
    message += " " + server.argName ( i ) + ": " + server.arg ( i ) + "\n";
  }
  server.send ( 404, "text/plain", message );
}

/* index提示页面 */
void handleMain() {
  Serial.print("handleMain");
  File file = SPIFFS.open("/index.html", "r");
  size_t sent = server.streamFile(file, "text/html");
  file.close();
  return;
}

/* data提取url */
void handleData() {
  Serial.print("handleData");

  char cmd[135];
  sprintf(cmd,"{\"D0\":\"%d\",\"D1\":\"%d\",\"D2\":\"%d\",\"D3\":\"%d\",\"D4\":\"%d\",\"D5\":\"%d\",\"D6\":\"%d\",\"D7\":\"%d\",\"D8\":\"%d\",\"D9\":\"%d\",\"D10\":\"%d\",\"D11\":\"%d\",\"D12\":\"%d\",\"D13\":\"%d\",\"A0\":\"%f\"}",digitalRead(D0),digitalRead(D1),digitalRead(D2),digitalRead(D3),digitalRead(D4),digitalRead(D5),digitalRead(D6),digitalRead(D7),digitalRead(D8),digitalRead(D9),digitalRead(D10),digitalRead(D11),digitalRead(D12),digitalRead(D13),analogRead(A0));
  
  File file = SPIFFS.open("/data.json","w+");
  if (!file) {
    Serial.println("There was an error opening the file for writing");
    return;
  }
  if (file.print(cmd)) {
    Serial.println("File was written");
  } else {
    Serial.println("File write failed");
  }
  file.close();
  file = SPIFFS.open("/data.json","r");
  size_t sent = server.streamFile(file, "application/json");
  file.close();
  return;
}

/* execute url */
void handlePin() {
  if(server.hasArg("p")) {
    String pin = server.arg("p");
    if(server.hasArg("a")) {
      String action = server.arg("a");
      if(action == "high") { //a=on
        digitalWrite(atoi(pin.c_str()), HIGH); //抬高电平
        server.send ( 200, "application/json", "{\"code\":\"2\",\"state\":\"HIGH\"}"); return; //返回数据
      } else if(action == "low") { // a=off
        digitalWrite(atoi(pin.c_str()), LOW); //拉低电平
        server.send ( 200, "application/json", "{\"code\":\"1\",\"state\":\"LOW\"}"); return;
      }
      server.send ( 200, "application/json", "{\"code\":\"-1\",\"state\":\"UNKNOW ACTION!\"}"); return;
    }
    server.send ( 200, "application/json", "{\"code\":\"-2\",\"state\":\"ACTION NO FOUND!\"}");
  }
}

void setup() { 
  pinMode(2, OUTPUT);
  Serial.begin ( 115200 );
  SPIFFS.begin();
  wifiCnct();
  server.on ("/", handleMain);
  server.on ("/ctl", handlePin);
  server.on ("/data", HTTP_GET, handleData);
  server.onNotFound ( handleNotFound );
  server.begin();
  Serial.println ( "HTTP server started" );
}

void loop() {
  server.handleClient();
  if( WiFi.status() != WL_CONNECTED&&disCntCount++>6)  wifiCnct();
  if( WiFi.status()==WL_CONNECTED ) disCntCount=0;
}
