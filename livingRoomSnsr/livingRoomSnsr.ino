/* *****************************************************************
 * this is the code for Snsr unit in Living Room
 * 
 * *****************************************************************/
 // MQTT auth code and WIFI
#define MQTT_AUTH_CODE "f60664f86153"
#define WIFI_SSID "yimian-iot"
#define WIFI_PASSWD "1234567890."

// Pins Log ID
#define W_DEVICE_ID "6"
#define W_LIGHT_ID ""
#define W_SWI_ID ""
#define W_TEMP_ID "Tp1"
#define W_HUM_ID ""
#define W_TEL_ID ""
#define W_R1_ID "R5"
#define W_R2_ID "R6"
#define W_R3_ID "R7"
#define W_R4_ID "R8"
#define W_LED_ID "ll2"
#define W_BUZ_ID "B1"
#define W_LS_ID "Ls1"
#define W_SH_ID "Sh1"  //Shake Snsr


// Set as WIFI mode
#define BLINKER_WIFI
#define BLINKER_PRINT Serial

// Include Blinker lib
#include <Blinker.h>


// Correspond Pins to Tag
#define lightSnsr D10 //detect the light
#define Buz D8 // Pins for buzz
#define rSnsr1 D6 // Pins for searching people
#define rSnsr2 D13 // Pins for searching people
#define rSnsr3 D4
#define rSnsr4 D2
#define Shake D9 // Pins for detect shake
#define led D0
#define TempSnsr A0 // Temp Detector

// Parameter Define 
#define SWI_TRY_TIMES 300
#define SWI_ACTION_DELAY 30
#define UDOOR_OPEN_DELAY_TIME 800
#define LED_BLINK_FREQUENCY 10
#define LED_WARNING_FREQUENCY 800
#define MIN_DIRECT_CHANGE_TIME 10000
#define NO_PEOPLE_DELAY 28000
#define SHUTDOWN_LIGHT_DELAY 10000
#define ICE_TIME 300000
#define OFFLINE_TIME_LIMIT 15000


// Set wifi and MQTT config
char auth[] = MQTT_AUTH_CODE;
char ssid[] = WIFI_SSID;
char pswd[] = WIFI_PASSWD;

// load module
BlinkerButton wIoT("wIoT");
BlinkerButton ledBtn("led");
BlinkerButton wledBtn("w-light");
BlinkerButton walert("w-alert");


// declare global var
int rSnsr1Status,rSnsr2Status,rSnsr3Status,rSnsr4Status = 0;
int isPeople = 0;
int noPeople = 0;
int ledStatus = -1;
int LastCnnctTime = 0;
int Mode = 0;
int Alert = 0;

/******** Custom Functions *********/

/*** rSnsr functions ***/
// 
int is_People()
{
  int rCnt=0;
  int change=0;
  int t_rSnsr1Status,t_rSnsr2Status,t_rSnsr3Status,t_rSnsr4Status = 0;
  
  t_rSnsr1Status = digitalRead(rSnsr1);
  t_rSnsr2Status = digitalRead(rSnsr2);
  t_rSnsr3Status = digitalRead(rSnsr3);
  t_rSnsr4Status = digitalRead(rSnsr4);
  
  if(t_rSnsr1Status == HIGH) {if(rSnsr1Status != t_rSnsr1Status)change=1;rCnt++;}
  else if(rSnsr1Status != t_rSnsr1Status)change=1;
  if(t_rSnsr2Status == HIGH) {if(rSnsr2Status != t_rSnsr2Status)change=1;rCnt++;}
  else if(rSnsr2Status != t_rSnsr2Status)change=1;
  if(t_rSnsr3Status == HIGH) {if(rSnsr3Status != t_rSnsr3Status)change=1;rCnt++;}
  else if(rSnsr3Status != t_rSnsr3Status)change=1;
  if(t_rSnsr4Status == HIGH) {if(rSnsr4Status != t_rSnsr4Status)change=1;rCnt++;}
  else if(rSnsr4Status != t_rSnsr4Status)change=1;

  rSnsr1Status = t_rSnsr1Status;
  rSnsr2Status = t_rSnsr2Status;
  rSnsr3Status = t_rSnsr3Status;
  rSnsr4Status = t_rSnsr4Status;

  if(change) rSnsr_data();

  if(rCnt) return 1;
  else return 0;
}


void rSnsr_data()
{
  //static int  t_ice = 0;
  /*if(rSnsr1Status == HIGH) txtR1.print("r1","有人经过");
  else txtR1.print("r1","无人");
  if(rSnsr2Status == HIGH) txtR2.print("r2","有人经过");
  else txtR2.print("r2","无人");
  if(rSnsr3Status == HIGH) txtR3.print("r3","有人经过");
  else txtR3.print("r3","无人");
  if(rSnsr4Status == HIGH) txtR4.print("r4","有人经过");
  else txtR4.print("r4","无人");
  if((rSnsr1Status+rSnsr2Status+rSnsr3Status+rSnsr4Status>=2)&&(rSnsr1Status&&rSnsr2Status)&&(rSnsr3Status||rSnsr4Status)) {if(t_ice < millis()-MIN_DIRECT_CHANGE_TIME || hallDir == 1){txtDir.print("方向","出");hallDir=1;t_ice=millis();}}
  else if((rSnsr1Status+rSnsr2Status+rSnsr3Status+rSnsr4Status>=2)&&(rSnsr1Status||rSnsr2Status)&&(rSnsr3Status&&rSnsr4Status)) {if(t_ice < millis()-MIN_DIRECT_CHANGE_TIME || hallDir == -1){txtDir.print("方向","进");hallDir=-1;t_ice=millis();}}
  else if(!rSnsr1Status&&rSnsr2Status&&!rSnsr3Status&&rSnsr4Status) {txtDir.print("方向","未知");hallDir=0;}
  else hallDir=0;*/
  //PeopleChangeTime = millis();
}

/*** led functions ***/

// function for control led :: 0(shutdown),1(open)
int led_ctl(int cmd)
{
  if(cmd == 0 && ledStatus == 0)
  {
    digitalWrite(led, LOW);
    if(digitalRead(led) == LOW) {BLINKER_LOG("Run Funtion led_ctl :: led Shutdown");return 1;}
    else {BLINKER_LOG("ERROR in Funtion led_ctl :: when led Shutdown");return 0;}
  }
  if(cmd == 1 && ledStatus == 0)
  {
    digitalWrite(led, HIGH);
    if(digitalRead(led) == HIGH) {BLINKER_LOG("Run Funtion led_ctl :: led Open");ledStatus=1;return 1;}
    else {BLINKER_LOG("ERROR in Funtion led_ctl :: when led Open");return 0;}
  }
  return 0;
}

void led_blink()
{
  if(is_People())
    if(ledStatus == 1)
      {analogWrite(led, (millis()/LED_BLINK_FREQUENCY)%255);}
}

void led_warning()
{
  if(ledStatus == -1)
    if(millis()%LED_WARNING_FREQUENCY>LED_WARNING_FREQUENCY/2) digitalWrite(led, HIGH);
    else digitalWrite(led, LOW);
}

void led_core()
{
  led_blink();
  led_warning();
  if(Mode==1&&ledStatus!=-1) ledStatus = 0;
  if(Mode==0&&ledStatus !=-1) ledStatus = 1;
}

/*** alert function ***/
void alert_core()
{
  if(Alert) tone(Buz, ((int)millis()/100)%399);
  else noTone(Buz);
}

/******** wIoT Functions **************/

void wlight_ctl(int cmd)
{
  if(cmd == 0)
  {
    if(Mode == 1) {led_ctl(0);}
  }
  if(cmd == 1)
  {
    if(Mode == 1) {led_ctl(1);}
  }
}

void wconnect_status()
{
  static int former=0;
  if(millis()>LastCnnctTime+OFFLINE_TIME_LIMIT) {former=ledStatus;ledStatus = -1;}
  else if(ledStatus == -1&&former!=-1)ledStatus=former;
  else ledStatus=1;
}




/******** Blinker Attached Function *********/

void ledBtn_callback(const String & state)
{
  if (state == BLINKER_CMD_ON) digitalWrite(led, HIGH);
  if (state == BLINKER_CMD_OFF) digitalWrite(led, LOW);
  if (state == BLINKER_CMD_BUTTON_TAP) digitalWrite(led, !digitalRead(led));
}

void wledBtn_callback(const String & state)
{
  if (state == "1") wlight_ctl(1);
  if (state == "0") wlight_ctl(0);
}

void walert_callback(const String & state)
{
  if (state == "1") Alert=1;
  if (state == "0") Alert=0;
}

/******* Heartbeat Function ********/
// Heartbeat for wIoT
void heartbeat(const String & state)
{
  Blinker.print("wIoT",1);
  Blinker.print("mode6",Mode);
  Blinker.print(W_R1_ID,digitalRead(rSnsr1));
  Blinker.print(W_R2_ID,digitalRead(rSnsr2));
  Blinker.print(W_R3_ID,digitalRead(rSnsr3));
  Blinker.print(W_R4_ID,digitalRead(rSnsr4));
  Blinker.print(W_BUZ_ID,digitalRead(Buz));
  Blinker.print(W_LS_ID,digitalRead(lightSnsr));
  Blinker.print(W_SH_ID,digitalRead(Shake));
  Blinker.print(W_TEMP_ID,analogRead(TempSnsr));
  Blinker.print(W_LED_ID,ledStatus);
  if(state=="1") Mode=1;
  else if(state=="0") Mode=0;
  LastCnnctTime = millis();
}

/******* Arduino Setup Funstion *******/
void setup()
{
    // Serial ini
    Serial.begin(115200);
    BLINKER_DEBUG.stream(Serial);

    // Pins state declare
    pinMode(rSnsr1, INPUT);
    pinMode(rSnsr2, INPUT);
    pinMode(rSnsr3, INPUT);
    pinMode(rSnsr4, INPUT);
    pinMode(led, OUTPUT);
    pinMode(lightSnsr, INPUT);
    pinMode(Buz, OUTPUT);
    pinMode(Shake, INPUT);
    pinMode(TempSnsr, INPUT);

    // rSnsr ini
    rSnsr1Status = digitalRead(rSnsr1);
    rSnsr2Status = digitalRead(rSnsr2);
    rSnsr3Status = digitalRead(rSnsr3);
    rSnsr4Status = digitalRead(rSnsr4);
    
    
    // Blinker ini
    Blinker.begin(auth, ssid, pswd);
    
    // Blinker attached Functions
    wIoT.attach(heartbeat);
    ledBtn.attach(ledBtn_callback);
    wledBtn.attach(wledBtn_callback);
    walert.attach(walert_callback);
}

/******** Arduino Main loop Function********/
void loop() {
    // Active Blinker
    Blinker.run();

    // wIoT connection check
    wconnect_status();

    // led
    led_core();

    // alert
    alert_core();
}

