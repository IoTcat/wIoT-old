## 设计理念
 - API-oriented
- stable
- backdoor
- remoteCtl
- gui


## 系统设计

```
WaterSys
|
|---w1
|   |
|   |---Flow1
|   |---ctl
|
|---w2---Flow2
|

```

## 接口设计

### w1:8848


+ `_wiot_`: 返回json`{"flow": 333.33, "ctl": true}`
+ `_wiot_`+`电磁阀ctl`: 返回json`{"flow": 333.33, "ctl": true}`

### w2:8848

+ `_wiot_`: 返回json`{"flow": 333.33}`

## 片上系统设计

 - 流量储存在EEPROM中，重置不清零
 - OTA
 - socket通信
 - 通过API唤起
 - 流量变动主动推送
 - 适应不稳定的网络环境

## node系统设计

 - 心跳设计
 - 提供丰富的参数配置
 - 配置以及输出数据使用数据库缓冲