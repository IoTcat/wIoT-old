/* *****************************************************************
 * this is the code for wIoT TEST purpose
 * 
 * *****************************************************************/
// Set as WIFI mode
#define BLINKER_WIFI

// Include Blinker lib
#include <Blinker.h>

char auth[] = "1c9f7cf6bb67";
char ssid[] = "yimian-iot";
char pswd[] = "1234567890.";

// 新建组件对象
BlinkerButton Button1("btn-abc");

int counter = 0;

// 按下按键即会执行该函数
void button1_callback(const String & state)
{
    BLINKER_LOG("get button state: ", state);
    digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));

    if (state == BLINKER_CMD_BUTTON_TAP) {
        BLINKER_LOG("Button tap!");

        // Button1.icon("icon_1");
        Button1.color("#FF0000");
        Button1.text("Your button name or describe");
        Button1.print();
    }
    else if (state == BLINKER_CMD_BUTTON_PRESSED) {
        BLINKER_LOG("Button pressed!");

        // Button1.icon("icon_1");
        Button1.color("#FFFF00");
        Button1.text("Your button name or describe");
        Button1.print();
    }
    else if (state == BLINKER_CMD_BUTTON_RELEASED) {
        BLINKER_LOG("Button released!");

        // Button1.icon("icon_1");
        Button1.color("#FFFFFF");
        //Button1.text("Your button name or describe");
        Button1.text("Your button name", "describe");
        Button1.print();
    }
    else if (state == BLINKER_CMD_ON) {
        BLINKER_LOG("Toggle on!");

        // Button1.icon("icon_1");
        Button1.color("#0000FF");
       // Button1.text("Your button name or describe");
        Button1.text("Your button name", "describe");
        Button1.print("on");
    }
    else if (state == BLINKER_CMD_OFF) {
        BLINKER_LOG("Toggle off!");

         Button1.icon("icon_1");
        Button1.color("#00FFFF");
        //Button1.text("Your button name or describe");
         Button1.text("Your button name", "describe");
        Button1.print("off");
    }
    else {
        BLINKER_LOG("Get user setting: ", state);

         Button1.icon("icon_1");
        Button1.color("#FFFFFF");
        //Button1.text("Your button name or describe");
        Button1.text("Your button name", "describe");
        Button1.print();
    }
}

void setup()
{
    // 初始化串口
    Serial.begin(115200);
    BLINKER_DEBUG.stream(Serial);

    // 初始化有LED的IO
    pinMode(LED_BUILTIN, OUTPUT);
    digitalWrite(LED_BUILTIN, HIGH);
    // 初始化blinker
    Blinker.begin(auth, ssid, pswd);

    Button1.attach(button1_callback);
}

void loop() {
    Blinker.run();
}

