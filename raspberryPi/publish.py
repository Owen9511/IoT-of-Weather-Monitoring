import sensor
import time

def dataPub(myAWSIoTMQTTClient,topic,intervalTime):
    #Publish bme680 sensor data to topic with pointed sleepTime
    sensorInstance=sensor.init()
    while True:
        output=sensor.dataCollection(sensorInstance)
        if output:
            try:
                myAWSIoTMQTTClient.publish(topic, output, 1)
                print('Published topic %s: %s\n' % (topic, output))
                print(intervalTime)
                time.sleep(intervalTime)
            except:
                time.sleep(10)
