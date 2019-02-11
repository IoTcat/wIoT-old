/* *****************************************************************
 *
this is the code for the sensor part of automatic home solar-powered water heated system.
 * 
 * *****************************************************************/

//announce connection moudle
#define BLINKER_PRINT Serial
#define BLINKER_WIFI


//include function set
#include <Blinker.h>

//declear overall variable::user, password, identify key
char auth[] = "03a477a71ffb";
char ssid[] = "yimian-iot-s";
char pswd[] = "1234567890.";

// load module
BlinkerButton wIoT("wIoT");

//define vairable
volatile double waterFlow;
float i=0;

/***waterFlow functions ***/
void pulse()   //measure the quantity of square wave
{
  waterFlow += 1.0 / 450.0;
}



// Heartbeat for wIoT
void heartbeat(const String & state)
{
  Blinker.print("wIoT",1);
  if(waterFlow<10) waterFlow=atof(state.c_str());
  Blinker.print("waterFlow2",waterFlow);

}


//setup function
void setup() 
{
    Serial.begin(115200);
  
    
    Blinker.begin(auth, ssid, pswd);
    // Blinker attached Functions
    wIoT.attach(heartbeat);

  waterFlow = 0;
  attachInterrupt(0, pulse, RISING);  //DIGITAL Pin 2: Interrupt 0
}

//main loop function
void loop() 
{
    Blinker.run();


}

