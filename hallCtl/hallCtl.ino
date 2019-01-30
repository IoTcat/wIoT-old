/* *****************************************************************
 * this is the code for control unit in hallway
 * 
 * *****************************************************************/

//declear the moudle is WIFI
#define BLINKER_PRINT Serial
#define BLINKER_WIFI

//include function set
#include <Blinker.h>

//define overal var
char ssid[] = "yimian-iot";
char pswd[] = "1234567890.";
char auth[] = "7e62353fa063";

//announce keyname
BlinkerButton Button1("btn-abc");
BlinkerButton Button2("btn-on");
BlinkerButton Button3("btn-off");

//declear var
int swi,swi1 ,i,a,timer,timer1,b,c= 0;




//button1-function
void button1_callback(const String & state) 
{
    BLINKER_LOG("get button state: ", state);
    if(digitalRead(D5)){ Button1.print("灯正亮！");}else{    Button1.print("灯未亮！");}
    digitalWrite(D5,LOW);
    Button1.print("正在重置！");
    for(i=10;i>0;i--)
    {
      Blinker.print(i);
      digitalWrite(D6,LOW);digitalWrite(D13,LOW);
      digitalRead(D6);digitalRead(D13);
      delay(1000);
     }
    a=0;
    Button1.print("重置完成！");
    timer1=Blinker.time()-249;
    if(digitalRead(D5)){ Button1.print("灯已打开！");}else{    Button1.print("灯已关闭！");}
}


//button2-function
void button2_callback(const String & state) 
{
    BLINKER_LOG("get button state: ", state);
    a=1;
    digitalWrite(D5,HIGH);
    if(digitalRead(D5)){ Button1.print("灯已打开！");}else{    Button1.print("灯已关闭！");}
     timer=Blinker.time();
}  


//button3-function
void button3_callback(const String & state) 
{
    BLINKER_LOG("get button state: ", state);
    a=1;
    digitalWrite(D5,LOW);
    if(digitalRead(D5)){ Button1.print("灯已打开！");}else{    Button1.print("灯已关闭！");}
    timer=Blinker.time();
}   



//main setup function
void setup() 
{
    Serial.begin(115200);
    
    pinMode(D5, OUTPUT);  //control the light
    pinMode(D6, INPUT);  //sensor1
    pinMode(D13, INPUT);  //sensor2
    //D4&D8 are used for checking the switch state
    pinMode(D4, INPUT);
    pinMode(D8, OUTPUT);

    //set the light paraperation
    digitalWrite(D5, HIGH);

    //connect to WIFI
    Blinker.begin(auth ,ssid, pswd);

    //set interrupt
    Button1.attach(button1_callback);
    Button2.attach(button2_callback);
    Button3.attach(button3_callback);
}




//main loop function
void loop() {
    Blinker.run();

    //get time info


    //judge the switch state
    swi1=swi;
    swi=0;
    for(i=0;i<2;i++)
    {
     //change  D8 state 
    digitalWrite(D8,!digitalRead(D8));
    if(digitalRead(D4)!=digitalRead(D8)){ swi++;}
    }

      BLINKER_LOG("get slider value: ", swi);
      if(swi!=swi1){digitalWrite(D5,!digitalRead(D5));a=1;timer=Blinker.time();Blinker.print("已切换至手动控制！");}
      if(timer==(Blinker.time()-300)){a=0;Blinker.print("手动控制结束！");}
      BLINKER_LOG("get slhgggggggggggider value: ",digitalRead(D5) );
    //get sensor info
      BLINKER_LOG("get sensor1: ", digitalRead(D13));
      BLINKER_LOG("get sensor2: ", digitalRead(D6));
      BLINKER_LOG("a= ", a);
      
     //if people light on
    if(digitalRead(D6)==1&&digitalRead(D13)==1&&a!=1){     Blinker.print("探测到人");  if(Blinker.hour()<=7||Blinker.hour()>=17){ digitalWrite(D5,HIGH);Blinker.print("灯已打开！");timer1=Blinker.time();}}else{if(a!=1&&timer1==(Blinker.time()-250)){digitalWrite(D5,LOW);Blinker.print("未探测到人，灯已关闭！");    Button1.print("正在重置！");
    for(i=10;i>0;i--)
    {
      Blinker.print(i);

      digitalRead(D6);digitalRead(D13);
      delay(1000);
     }
    Button1.print("重置完成！");}}

}

