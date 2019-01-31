/* *****************************************************************
 * this is the code for wIoT TEST purpose
 * 
 * *****************************************************************/
// MQTT auth code and WIFI
#define MQTT_AUTH_CODE "1c9f7cf6bb67"
#define WIFI_SSID "yimian-iot"
#define WIFI_PASSWD "1234567890."

// Pins Log ID
#define W_DEVICE_ID ""
#define W_LIGHT_ID "dd"
#define W_SWI_ID ""
#define W_TEMP_ID ""
#define W_HUM_ID ""
#define W_BUZ_ID ""
#define W_R1_ID ""


// Set as WIFI mode
#define BLINKER_WIFI
#define BLINKER_PRINT Serial

// Include Blinker lib
#include <Blinker.h>

// Correspond Pins to Tag
#define lightCtl D5 //Control the light
#define swiIn D4 // Pins for Check the switch state :: signal In
#define swiOut D8 // Pins for Check the switch state :: signal Out

// Parameter Define
#define SWI_TRY_TIMES 100
#define SWI_OK_TIMES 77


// Set wifi and MQTT config
char auth[] = MQTT_AUTH_CODE;
char ssid[] = WIFI_SSID;
char pswd[] = WIFI_PASSWD;

// load module
BlinkerButton wIoT("wIoT");
BlinkerButton lightCtlBtn("btn-light");


// declare global var
int swiStatus=0;

/******** Custom Functions *********/

/*** LightCtl Functions ***/
// function for control light :: 0(shutdown),1(open),2(switch)
int light_ctl(int cmd)
{
  if(cmd == 0)
  {
    digitalWrite(lightCtl, HIGH);
    if(digitalRead(lightCtl) == HIGH) {BLINKER_LOG("Run Funtion light_ctl :: light Shutdown");update_light_btn();return 1;}
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
    if(digitalRead(lightCtl) != lightStatus) {BLINKER_LOG("Run Funtion light_ctl :: light Switch");update_light_btn();return 1;}
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
    if(digitalRead(swiIn) == HIGH) swiEff++;
    digitalWrite(swiOut, LOW);
    if(digitalRead(swiIn) == LOW) swiEff++;
    swiEff--;
  }
  BLINKER_LOG("Parameter in get_swi_status :: swiEff = ",swiEff);
  if(swiEff > SWI_OK_TIMES) return 1;
  else return 0;
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

/******* Heartbeat Function ********/
// Heartbeat for Blinker app
void heartbeat_app()
{
  update_light_btn();
}

// Heartbeat for wIoT
void heartbeat(const String & state)
{
  Blinker.print("W_LIGHT_ID","jj");
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

    // Pins state ini
    digitalWrite(lightCtl, HIGH);

    // swi ini
    swiStatus = get_swi_status();
    
    // Blinker ini
    Blinker.begin(auth, ssid, pswd);
    
    // Blinker attached Functions
    wIoT.attach(heartbeat);
    lightCtlBtn.attach(lightCtlBtn_callback);

    // Blinker attached Heartbeat
    Blinker.attachHeartbeat(heartbeat_app);
}

/******** Arduino Main loop Function********/
void loop() {
    // Active Blinker
    Blinker.run();

    if(swiStatus != get_swi_status()) {light_ctl(2);swiStatus = get_swi_status();}
}

