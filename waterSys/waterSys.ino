/* *****************************************************************
 *
this is the code for the control part of automatic home solar-powered water heated system.
 * 
 * *****************************************************************/

//announce connection moudle
#define BLINKER_PRINT Serial
#define BLINKER_WIFI

//declear the slider on phone
#define Slider_1 "slider"

//include function set
#include <Blinker.h>

//declear overall variable::user, password, identify key
char auth[] = "91431a5e4043";
char ssid[] = "yimian-iot";
char pswd[] = "1234567890.";

//declear Button with certain keyname
BlinkerButton Button1("btn-abc");
BlinkerButton Button2("btn-on");
BlinkerButton Button3("btn-off");
BlinkerButton Button4("btn-start");
//declaer Slider with certain keyname
BlinkerSlider Slider1(Slider_1);
// load module
BlinkerButton wIoT("wIoT");

//define vairable
int counter,timer,time1,time2,a,b = 0;
volatile double waterFlow;
float i=0;

/***waterFlow functions ***/
void pulse()   //measure the quantity of square wave
{
  waterFlow += 1.0 / 450.0;
}


//Button1 function::state check
void button1_callback(const String & state) 
{
    BLINKER_LOG("get button1 state: ", state);
    if(digitalRead(D5)){ Button1.print("未加水");}else{ Button1.print("正在加水..");}   
    if(a==1){        Blinker.print("剩余分钟：");
        Blinker.print((time2-Blinker.time())/60);}
}

//Button2 function::on
void button2_callback(const String & state) 
{
    BLINKER_LOG("get button2 state: ", state);    
    digitalWrite(D5, LOW);
    if(digitalRead(D5)){ Button2.print("停止加水");}else{ Button2.print("开始加水..");}
}

//Button3 function::off
void button3_callback(const String & state) 
{
    BLINKER_LOG("get button3 state: ", state);

    digitalWrite(D5, HIGH);
    
    if(digitalRead(D5)){ Button3.print("加水已停止.");}else{ Button3.print("正在加水..");}
    if(a==1){delay(500);Button3.print("加水已终止！");}

    a=0; //reset key var a
}

//Button4 function::start on
void button4_callback(const String & state) 
{
    BLINKER_LOG("get button4 state: ", state);

    a=1;
    digitalWrite(D5, LOW);
    
    time1=Blinker.time();
    time2=time1+timer*60;
    BLINKER_LOG("get slider value: ", time2-Blinker.time());
    Button4.print("开始计时加水！");
}

//skider function
void slider1_callback(int32_t value)
{
timer=value;
}

// Heartbeat for wIoT
void heartbeat(const String & state)
{
  Blinker.print("wIoT",1);
  Blinker.print("waterAdd",!digitalRead(D5));
  if(waterFlow<10) waterFlow=atof(state.c_str());
  Blinker.print("waterFlow",waterFlow);

}


//setup function
void setup() 
{
    Serial.begin(115200);
    
    pinMode(D5, OUTPUT);
    pinMode(D7, INPUT);
    digitalWrite(D5, HIGH);
    
    Blinker.begin(auth, ssid, pswd);
    Button1.attach(button1_callback);
    Button2.attach(button2_callback);
    Button3.attach(button3_callback);
    Button4.attach(button4_callback);
    Slider1.attach(slider1_callback);
    // Blinker attached Functions
    wIoT.attach(heartbeat);

  waterFlow = 0;
  attachInterrupt(0, pulse, RISING);  //DIGITAL Pin 2: Interrupt 0
}

//main loop function
void loop() 
{
    Blinker.run();
    
    if(a==1&&time2>=Blinker.time())
    {
      if((time2-Blinker.time())/60==0&&b<=(millis()-1000)){ Blinker.print("剩余秒数：");Blinker.print(time2-Blinker.time());b=millis();}

        if((time2-Blinker.time())>60&&b<=(millis()-15000))
        {
        Blinker.print("剩余分钟：");
        Blinker.print((time2-Blinker.time())/60);
        b=millis();
        }

    }
    
    if(a==1&&time2<=Blinker.time())
    {
      delay(500);
      Button4.print("加水结束！！");
      Blinker.notify("计时加水已结束!");
      
      digitalWrite(D5, HIGH);
      a=0;
    }

}

