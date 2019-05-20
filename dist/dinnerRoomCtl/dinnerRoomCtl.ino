/* *****************************************************************
 * this is the code for control unit in dinner
 * 
 * *****************************************************************/
// MQTT auth code and WIFI
#define MQTT_AUTH_CODE "5ff46d9b46e5"
#define WIFI_SSID "yimian-iot"
#define WIFI_PASSWD "1234567890."

// Pins Log ID
#define W_DEVICE_ID "3"
#define W_LIGHT_ID "L3"
#define W_SWI_ID "S3"
#define W_TEMP_ID ""
#define W_HUM_ID ""
#define W_TEL_ID ""
#define W_R1_ID "R13"
#define W_R2_ID "R14"
#define W_R3_ID "R15"
#define W_R4_ID "R16"
#define W_LED_ID "ll4"



// Set as WIFI mode
#define BLINKER_WIFI
#define BLINKER_PRINT Serial

// Include Blinker lib
#include <Blinker.h>


// Correspond Pins to Tag
#define lightCtl D5 //Control the light
#define swiIn D1 // Pins for Check the switch state :: signal In
#define swiOut D2 // Pins for Check the switch state :: signal Out
#define rSnsr1 D6 // Pins for searching people
#define rSnsr2 D13 // Pins for searching people
#define rSnsr3 D11
#define rSnsr4 D12
#define led D0

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
BlinkerButton lightCtlBtn("btn-light");
BlinkerButton ledBtn("led");
BlinkerButton wledBtn("w-light");


// declare global var
int swiStatus = 0;
int uDoorTelStatus = 0;
int rSnsr1Status,rSnsr2Status,rSnsr3Status,rSnsr4Status = 0;
int isPeople = 0;
int noPeople = 0;
int hallDir = 0;
int PeopleChangeTime = 0;
int ledStatus = -1;
int Mode = 0;
int Ice = 0;
int IceTime = 0;
int LastCnnctTime = 0;
int Alert = 0;

/******** Custom Functions *********/

/*** LightCtl Functions ***/
// function for control light :: 0(shutdown),1(open),2(switch)
int light_ctl(int cmd)
{
  if(cmd == 0)
  {
    digitalWrite(lightCtl, HIGH);
    if(digitalRead(lightCtl) == HIGH) {BLINKER_LOG("Run Funtion light_ctl :: light Shutdown");update_light_btn();/*Blinker.delay(SHUTDOWN_LIGHT_DELAY);*/return 1;}
    else {BLINKER_LOG("ERROR in Funtion light_ctl :: when light Shutdown");return 0;}
  }
  if(cmd == 1)
  {
    digitalWrite(lightCtl, LOW);
    if(digitalRead(lightCtl) == LOW) {BLINKER_LOG("Run Funtion light_ctl :: light Open");update_light_btn();return 1;}
    else {BLINKER_LOG("ERROR in Funtion light_ctl :: when light Open");return 0;}
  }
  if(cmd == 2)
  {
    int lightStatus = digitalRead(lightCtl);
    digitalWrite(lightCtl, !lightStatus);
    if(digitalRead(lightCtl) != lightStatus) {BLINKER_LOG("Run Funtion light_ctl :: light Switch");update_light_btn();ice_set();return 1;}
    else {BLINKER_LOG("ERROR in Funtion light_ctl :: when light Switch");return 0;}
  }
  return 0;
}


//function for get light info :: ::return 0(shutdown),1(open)
int get_light_status()
{
  if(digitalRead(lightCtl) == HIGH) return 0;
  else if (digitalRead(lightCtl == LOW)) return 1;
  else return -1;
}

// function for dealing with light error
int light_err()
{
  BLINKER_LOG("ERROR with LIGHTCTL!!!");
}

// function for update app button state
void update_light_btn()
{
  if(digitalRead(lightCtl) == LOW)
  {
    lightCtlBtn.icon("fas fa-lightbulb");
    lightCtlBtn.color("#00CD00");
    lightCtlBtn.text("戳我关灯~","关灯啦~");
    lightCtlBtn.print("on");
  }
  else
  {
    lightCtlBtn.icon("far fa-lightbulb");
    lightCtlBtn.color("#FF0000");
    lightCtlBtn.text("戳我开灯~","戳我开灯~");
    lightCtlBtn.print("off");
  }
}

/*** Swi Functions ***/
// function for judging swi state :: ::return 0(off),1(on),-1(error)
int get_swi_status()
{
  int swiCount = 0;
  int swiEff = 0;
  for(swiCount = 0; swiCount < SWI_TRY_TIMES; swiCount++)
  {
    digitalWrite(swiOut, HIGH);
    //Blinker.delay(1);
    if(digitalRead(swiIn) == HIGH) swiEff++;
    digitalWrite(swiOut, LOW);
    //Blinker.delay(1);
    if(digitalRead(swiIn) == LOW) swiEff++;
    swiEff--;
  }
  BLINKER_LOG("Parameter in get_swi_status :: swiEff = ",swiEff);
  if(swiEff == SWI_TRY_TIMES) return 1;
  else if(swiEff == 0) return 0;
  else return swiStatus;
}
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

  if(rCnt >= 1) return 1;
  else return 0;
}

int no_People()
{
  if(!rSnsr1Status && !rSnsr2Status && !rSnsr3Status && !rSnsr4Status && PeopleChangeTime < millis()-NO_PEOPLE_DELAY) return 1;
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
  PeopleChangeTime = millis();
  ice_refresh();
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

/*** ICE function ***/
void ice_core()
{
  static int t_ice=0;
  if(Ice==1&&t_ice==0)
  {
    IceTime = millis();
    t_ice=1;
  }
  if(Ice == 0)
    t_ice=0;
  if(Ice==1&&millis()>IceTime+ICE_TIME)
    {
      Ice=0;
      t_ice=0;
      light_ctl(0);
    }
}

void ice_set()
{
  Ice = 1;
  IceTime = millis();
}

void ice_remove()
{
  Ice =0;
}
void ice_refresh()
{
  IceTime = millis();
}



/******** wIoT Functions **************/

void wlight_ctl(int cmd)
{
  if(cmd == 0)
  {
    if(Mode == 0&&Ice == 0) light_ctl(0);
    if(Mode == 1&&Ice == 0) {light_ctl(0);led_ctl(0);}
  }
  if(cmd == 1)
  {
    if(Mode == 0&& Ice == 0) light_ctl(1);
    if(Mode == 1&& Ice == 0) {light_ctl(0);led_ctl(1);}
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
//
void lightCtlBtn_callback(const String & state)
{
    BLINKER_LOG("lightCtlBtn :: get button state: ", state);

    if (state == BLINKER_CMD_BUTTON_TAP) {
        BLINKER_LOG("Button tap!");
        if(!light_ctl(2)) light_err();
    }
    else if (state == BLINKER_CMD_ON) {
        BLINKER_LOG("Toggle on!");
        if(!light_ctl(1)) light_err();
    }
    else if (state == BLINKER_CMD_OFF) {
        BLINKER_LOG("Toggle off!");
        if(!light_ctl(0)) light_err();
    }
}

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


/******* Heartbeat Function ********/
// Heartbeat for Blinker app
void heartbeat_app()
{
  update_light_btn();
}

// Heartbeat for wIoT
void heartbeat(const String & state)
{
  Blinker.print("wIoT",1);
  Blinker.print("ice3",Ice);
  Blinker.print("mode3",Mode);
  Blinker.print(W_LIGHT_ID,!digitalRead(lightCtl));
  Blinker.print(W_SWI_ID,get_swi_status());
  Blinker.print(W_R1_ID,digitalRead(rSnsr1));
  Blinker.print(W_R2_ID,digitalRead(rSnsr2));
  Blinker.print(W_R3_ID,digitalRead(rSnsr3));
  Blinker.print(W_R4_ID,digitalRead(rSnsr4));
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
    pinMode(lightCtl, OUTPUT);
    pinMode(swiIn, INPUT);
    pinMode(swiOut, OUTPUT);
    pinMode(rSnsr1, INPUT);
    pinMode(rSnsr2, INPUT);
    pinMode(rSnsr3, INPUT);
    pinMode(rSnsr4, INPUT);
    pinMode(led, OUTPUT);


    // Pins state ini
    digitalWrite(lightCtl, HIGH);

    // swi ini
    swiStatus = get_swi_status();

    // rSnsr ini
    rSnsr1Status = digitalRead(rSnsr1);
    rSnsr2Status = digitalRead(rSnsr2);
    rSnsr3Status = digitalRead(rSnsr3);
    rSnsr4Status = digitalRead(rSnsr4);
    
    
    // Blinker ini
    Blinker.begin(auth, ssid, pswd);
    
    // Blinker attached Functions
    wIoT.attach(heartbeat);
    lightCtlBtn.attach(lightCtlBtn_callback);
    ledBtn.attach(ledBtn_callback);
    wledBtn.attach(wledBtn_callback);


    // Blinker attached Heartbeat
    Blinker.attachHeartbeat(heartbeat_app);
}

/******** Arduino Main loop Function********/
void loop() {
    // Active Blinker
    Blinker.run();

    // Ice
    ice_core();
    // wIoT connection check
    wconnect_status();

    // Switch Ctl
    if(swiStatus != get_swi_status()) {Blinker.delay(SWI_ACTION_DELAY);if(swiStatus != get_swi_status()){light_ctl(2);swiStatus = get_swi_status();}}
    
    // led
    led_core();


}

