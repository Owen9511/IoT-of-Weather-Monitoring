import sensor

def dataPub(myAWSIoTMQTTClient,topic):
    #Publish bme680 sensor data to topic once
    sensorInstance=sensor.init()
    for i in range(0,10):
        output=sensor.dataCollection(sensorInstance)
        if output:
            #!!!!!!!!!!!!!!!!!!!!!!!!!!!! CAN NOT SET TO 1
            myAWSIoTMQTTClient.publish(topic, output, 0)
            print('Published topic %s: %s\n' % (topic, output))
            break
