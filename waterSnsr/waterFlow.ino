volatile double waterFlow;
void setup() {
  Serial.begin(9600);  //baudrate
  waterFlow = 0;
  attachInterrupt(0, pulse, RISING);  //DIGITAL Pin 2: Interrupt 0
}
void loop() {
  Serial.print("waterFlow:");
  Serial.print(waterFlow);
  Serial.println("   L");
  delay(500);
}

void pulse()   //measure the quantity of square wave
{
  waterFlow += 1.0 / 450.0;
}
