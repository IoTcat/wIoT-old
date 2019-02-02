/* *****************************************************************
 * this is the code for control unit in hallway
 * 
 * *****************************************************************/
 // MQTT auth code and WIFI
#define MQTT_AUTH_CODE "7e62353fa063"
#define WIFI_SSID "yimian-iot"
#define WIFI_PASSWD "1234567890."

// Pins Log ID
#define W_DEVICE_ID "2"
#define W_LIGHT_ID "L1"
#define W_SWI_ID "S1"
#define W_TEMP_ID ""
#define W_HUM_ID ""
#define W_TEL_ID "T"
#define W_R1_ID "R1"
#define W_R2_ID "R2"
#define W_R3_ID "R3"
#define W_R4_ID "R4"
#define W_LED_ID "l1"
#define W_BUZ_ID ""


// Set as WIFI mode
#define BLINKER_WIFI
#define BLINKER_PRINT Serial

// Include Blinker lib
#include <Blinker.h>

// Correspond Pins to Tag
#define lightCtl D5 //Control the light
#define swiIn D4 // Pins for Check the switch state :: signal In
#define swiOut D8 // Pins for Check the switch state :: signal Out
#define rSnsr1 D6 // Pins for searching people
#define rSnsr2 D13 // Pins for searching people
#define rSnsr3 D1
#define rSnsr4 D2
#define uDoorOpenPin D12 // Pins for opening door
#define uDoorVoice D11 // Pins for connecting voice lines
#define uDoorTel D10 // Pins for detecting if Tel is on
#define led D0

// Parameter Define 
#define SWI_TRY_TIMES 300
#define SWI_ACTION_DELAY 30
#define UDOOR_OPEN_DELAY_TIME 800
#define LED_WARNING_FREQUENCY 10
#define MIN_DIRECT_CHANGE_TIME 10000
#define NO_PEOPLE_DELAY 28000
#define SHUTDOWN_LIGHT_DELAY 10000


// Set wifi and MQTT config
char auth[] = MQTT_AUTH_CODE;
char ssid[] = WIFI_SSID;
char pswd[] = WIFI_PASSWD;

// load module
BlinkerButton wIoT("wIoT");
BlinkerButton lightCtlBtn("btn-light");
BlinkerButton uDoorOpenBtn("btn-uDoorOpen");
BlinkerButton ledBtn("led");

BlinkerText txtTel("tex-tel");
BlinkerText txtR1("tex-r1");
BlinkerText txtR2("tex-r2");
BlinkerText txtR3("tex-r3");
BlinkerText txtR4("tex-r4");
BlinkerText txtDir("tex-dir");


// declare global var
int swiStatus = 0;
int uDoorTelStatus = 0;
int rSnsr1Status,rSnsr2Status,rSnsr3Status,rSnsr4Status = 0;
int isPeople = 0;
int noPeople = 0;
int hallDir = 0;
int PeopleChangeTime = 0;

/******** Custom Functions *********/

/*** LightCtl Functions ***/
// function for control light :: 0(shutdown),1(open),2(switch)
int light_ctl(int cmd)
{
  if(cmd == 0)
  {
    digitalWrite(lightCtl, LOW);
    if(digitalRead(lightCtl) == LOW) {BLINKER_LOG("Run Funtion light_ctl :: light Shutdown");update_light_btn();Blinker.delay(SHUTDOWN_LIGHT_DELAY);return 1;}
    else {BLINKER_LOG("ERROR in Funtion light_ctl :: when light Shutdown");return 0;}
  }
  if(cmd == 1)
  {
    digitalWrite(lightCtl, HIGH);
    if(digitalRead(lightCtl) == HIGH) {BLINKER_LOG("Run Funtion light_ctl :: light Open");update_light_btn();return 1;}
    else {BLINKER_LOG("ERROR in Funtion light_ctl :: when light Open");return 0;}
  }
  if(cmd == 2)
  {
    int lightStatus = digitalRead(lightCtl);
    digitalWrite(lightCtl, !lightStatus);
    if(digitalRead(lightCtl) != lightStatus) {BLINKER_LOG("Run Funtion light_ctl :: light Switch");update_light_btn();return 1;}
    else {BLINKER_LOG("ERROR in Funtion light_ctl :: when light Switch");return 0;}
  }
  return 0;
}

//function for get light info :: ::return 0(shutdown),1(open)
int get_light_status()
{
  if(digitalRead(lightCtl) == LOW) return 0;
  else if (digitalRead(lightCtl == HIGH)) return 1;
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
  if(digitalRead(lightCtl) == HIGH)
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

  if(rCnt >= 2) return 1;
  else return 0;
}

int no_People()
{
  if(!rSnsr1Status && !rSnsr2Status && !rSnsr3Status && !rSnsr4Status && PeopleChangeTime < millis()-NO_PEOPLE_DELAY) return 1;
  else return 0;
}

void rSnsr_data()
{
  static int  t_ice = 0;
  if(rSnsr1Status == HIGH) txtR1.print("r1","有人经过");
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
  else hallDir=0;
  PeopleChangeTime = millis();
}


/*** uDoor functions ***/
// function for opening the unit door
void open_uDoor()
{
  digitalWrite(uDoorOpenPin, HIGH);
  Blinker.vibrate();
  txtTel.print("门铃","单元门打开！！");
  Blinker.delay(UDOOR_OPEN_DELAY_TIME);
  digitalWrite(uDoorOpenPin, LOW);
  BLINKER_LOG("open_uDoor :: Under Door Opened!!");
}
// function for controling the unit Door Voice :: 0(disconnected),1(connected)
void voice_uDoor(int cmd)
{
  if(cmd == 0)
    digitalWrite(uDoorVoice, LOW);
  if(cmd == 1)
    digitalWrite(uDoorVoice, HIGH);
}

void uDoor_tel_mode()
{
  if(digitalRead(uDoorTel) == HIGH)
    {voice_uDoor(1);if(digitalRead(uDoorTel) != uDoorTelStatus)txtTel.print("门铃","麦克风已接通！");}
   else 
    {voice_uDoor(0);if(digitalRead(uDoorTel) != uDoorTelStatus)txtTel.print("门铃","未接通");}
   uDoorTelStatus = digitalRead(uDoorTel);
}

void uDoor_data()
{
  if(digitalRead(uDoorTel) == HIGH)txtTel.print("门铃","麦克风已接通！");
  if(digitalRead(uDoorTel) == LOW)txtTel.print("门铃","未接通");
}

/*** led functions ***/
void led_warning()
{
  analogWrite(led, (millis()/LED_WARNING_FREQUENCY)%255);
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

void uDoorOpenBtn_callback(const String & state)
{
  open_uDoor();
}


void ledBtn_callback(const String & state)
{
  if (state == BLINKER_CMD_ON) digitalWrite(led, HIGH);
  if (state == BLINKER_CMD_OFF) digitalWrite(led, LOW);
  if (state == BLINKER_CMD_BUTTON_TAP) digitalWrite(led, !digitalRead(led));
}

/******* Heartbeat Function ********/
// Heartbeat for Blinker app
void heartbeat_app()
{
  update_light_btn();
  rSnsr_data();
  uDoor_data();
}

// Heartbeat for wIoT
void heartbeat(const String & state)
{
  Blinker.print(W_LIGHT_ID,digitalRead(lightCtl));
  Blinker.print(W_SWI_ID,get_swi_status());
  Blinker.print(W_TEL_ID,digitalRead(uDoorTel));
  Blinker.print(W_R1_ID,digitalRead(rSnsr1));
  Blinker.print(W_R2_ID,digitalRead(rSnsr2));
  Blinker.print(W_R3_ID,digitalRead(rSnsr3));
  Blinker.print(W_R4_ID,digitalRead(rSnsr4));
  Blinker.print("hallDir",hallDir);
  Blinker.print(W_LED_ID,digitalRead(led));
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
    pinMode(uDoorOpenPin, OUTPUT);
    pinMode(uDoorVoice, OUTPUT);
    pinMode(uDoorTel, INPUT);
    pinMode(rSnsr1, INPUT);
    pinMode(rSnsr2, INPUT);
    pinMode(rSnsr3, INPUT);
    pinMode(rSnsr4, INPUT);
    pinMode(led, OUTPUT);

    // Pins state ini
    digitalWrite(lightCtl, HIGH);

    // swi ini
    swiStatus = get_swi_status();

    // uDoor Tel ini
    uDoorTelStatus = digitalRead(uDoorTel);

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
    uDoorOpenBtn.attach(uDoorOpenBtn_callback);
    ledBtn.attach(ledBtn_callback);

    // Blinker attached Heartbeat
    Blinker.attachHeartbeat(heartbeat_app);
}

/******** Arduino Main loop Function********/
void loop() {
    // Active Blinker
    Blinker.run();

    // Switch Ctl
    if(swiStatus != get_swi_status()) {Blinker.delay(SWI_ACTION_DELAY);if(swiStatus != get_swi_status()){light_ctl(2);swiStatus = get_swi_status();}}

    // Tel Ctl
    uDoor_tel_mode();

    // If people Light
    if(is_People()&&is_People()!=isPeople) light_ctl(1);
    isPeople = is_People();

    // If no people shutdown Light
    if(no_People()&&no_People()!=noPeople) light_ctl(0);
    noPeople = no_People();
    // led
    if(is_People()) led_warning();
    //digitalWrite(led, HIGH);
}

