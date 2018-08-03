import json

def renewStatus(myAWSIoTMQTTClient,topic,clientId,status,intervalTime):
    #Publish bme680 sensor status to the topic
    #Get devices' database raspberryPi1
    id = clientId[11:]
    if(status):
        #Data collection thread is running
        status = 1
    else:
        #Data collection thread stopped
        status = 0

    message=json.dumps(dict(id=id,status=status,intervalTime=intervalTime))
    #!!!!!!!!!!!!!!!!!!!!!!!!!!!! CAN NOT SET TO 1
    myAWSIoTMQTTClient.publish(topic, message, 0)
    print('Published topic %s: %s\n' % (topic, message))
