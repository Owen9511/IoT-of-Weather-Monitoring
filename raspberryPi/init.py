from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
import logging
import time
import argparse
import threading
import publish
import renewStatus
import json
import publishOnce
import ctypes

intervalTime=300
event = threading.Event()
def terminate_thread(thread):
    """Terminates a python thread from another thread.

    :param thread: a threading.Thread instance
    """
    if not thread.isAlive():
        return

    exc = ctypes.py_object(SystemExit)
    res = ctypes.pythonapi.PyThreadState_SetAsyncExc(
        ctypes.c_long(thread.ident), exc)
    if res == 0:
        raise ValueError("nonexistent thread id")
    elif res > 1:
        # """if it returns a number greater than one, you're in trouble,
        # and you should call it again with exc=NULL to revert the effect"""
        ctypes.pythonapi.PyThreadState_SetAsyncExc(thread.ident,None)
        raise SystemError("PyThreadState_SetAsyncExc failed")
    elif res == 1:
        print("Thread stopped successfully")

#Periodically collect and public sensor data thread
class pubThread(threading.Thread):
    def __init__(self,intervalTime=300):
        threading.Thread.__init__(self)
        self.intervalTime=intervalTime

    def run(self):
        global myAWSIoTMQTTClient,pubTopic,event,subthread
        event.wait()
        publish.dataPub(myAWSIoTMQTTClient,pubTopic,self.intervalTime)
        print('Data collect and publish thread stopped')



# Custom MQTT message callback
def customCallback(client, userdata, message):
    print("Received a new message: ")
    print(message.payload)
    print("from topic: ")
    print(message.topic)
    print("--------------\n\n")

    global t1,myAWSIoTMQTTClient,statusTopic,clientId,pubTopic,intervalTime,event

    #Decode json message
    messageBody= json.loads(message.payload)

    #Execute different instruction contained in message
    if(messageBody['instruction']=="start" and (not t1.is_alive())):
        try:
            if(messageBody.has_key('intervalTime')):
                t1= pubThread(int(messageBody['intervalTime']))
            else:
                t1= pubThread()
            t1.setDaemon(True)
            event.clear()
            t1.start()
            renewStatus.renewStatus(myAWSIoTMQTTClient,statusTopic,clientId,t1.is_alive(),int(messageBody['intervalTime']))
            event.set()
        except:
            print("Error: unable to start thread")
    elif(messageBody['instruction']=="end" and t1.is_alive()):
        try:
            terminate_thread(t1)
            t1._Thread__stop()
        except Exception as err:
            print(err)
        renewStatus.renewStatus(myAWSIoTMQTTClient,statusTopic,clientId,t1.is_alive(),intervalTime)
    elif(messageBody['instruction']=='get_data'):
        publishOnce.dataPub(myAWSIoTMQTTClient,pubTopic)
    elif(messageBody['instruction']=='get_status'):
        renewStatus.renewStatus(myAWSIoTMQTTClient,statusTopic,clientId,t1.is_alive(),intervalTime)


# Read in command-line parameters
parser = argparse.ArgumentParser()
parser.add_argument("-e", "--endpoint", action="store", required=True, dest="host", help="Your AWS IoT custom endpoint")
parser.add_argument("-r", "--rootCA", action="store", required=True, dest="rootCAPath", help="Root CA file path")
parser.add_argument("-c", "--cert", action="store", required=True, dest="certificatePath", help="Certificate file path")
parser.add_argument("-k", "--key", action="store", required=True, dest="privateKeyPath", help="Private key file path")
parser.add_argument("-w", "--websocket", action="store_true", dest="useWebsocket", default=False,
                    help="Use MQTT over WebSocket")
parser.add_argument("-id", "--clientId", action="store", required=True, dest="clientId",
                    help="Targeted client id")
parser.add_argument("-st", "--subTopic", action="store", dest="subTopic", required=True, help="Targeted subscribe topic")
parser.add_argument("-pt", "--pubTopic", action="store", dest="pubTopic", default="weatherData", help="Targeted publish topic")
parser.add_argument("-stat", "--statusTopic", action="store", dest="statusTopic", default="renewDevicesStatus", help="Targeted status topic")
#parser.add_argument("-m", "--mode", action="store", dest="mode", default="both",
                    #help="Operation modes: %s"%str(AllowedActions))
#parser.add_argument("-M", "--message", action="store", dest="message", default="Hello World!",
                    #help="Message to publish")

args = parser.parse_args()
host = args.host
rootCAPath = args.rootCAPath
certificatePath = args.certificatePath
privateKeyPath = args.privateKeyPath
useWebsocket = False
clientId = args.clientId
subTopic = args.subTopic
pubTopic = args.pubTopic
statusTopic=args.statusTopic


#if args.mode not in AllowedActions:
#    parser.error("Unknown --mode option %s. Must be one of %s" % (args.mode, str(AllowedActions)))
#    exit(2)

if args.useWebsocket and args.certificatePath and args.privateKeyPath:
    parser.error("X.509 cert authentication and WebSocket are mutual exclusive. Please pick one.")
    exit(2)

if not args.useWebsocket and (not args.certificatePath or not args.privateKeyPath):
    parser.error("Missing credentials for authentication.")
    exit(2)

# Configure logging
logger = logging.getLogger("AWSIoTPythonSDK.core")
logger.setLevel(logging.DEBUG)
streamHandler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
streamHandler.setFormatter(formatter)
logger.addHandler(streamHandler)

# Init AWSIoTMQTTClient
myAWSIoTMQTTClient = None
if useWebsocket:
    myAWSIoTMQTTClient = AWSIoTMQTTClient(clientId, useWebsocket=True)
    myAWSIoTMQTTClient.configureEndpoint(host, 443)
    myAWSIoTMQTTClient.configureCredentials(rootCAPath)
else:
    myAWSIoTMQTTClient = AWSIoTMQTTClient(clientId)
    myAWSIoTMQTTClient.configureEndpoint(host, 8883)
    myAWSIoTMQTTClient.configureCredentials(rootCAPath, privateKeyPath, certificatePath)

# AWSIoTMQTTClient connection configuration
myAWSIoTMQTTClient.configureAutoReconnectBackoffTime(1, 32, 20)
myAWSIoTMQTTClient.configureOfflinePublishQueueing(-1)  # Infinite offline Publish queueing
myAWSIoTMQTTClient.configureDrainingFrequency(2)  # Draining: 2 Hz
myAWSIoTMQTTClient.configureConnectDisconnectTimeout(10)  # 10 sec
myAWSIoTMQTTClient.configureMQTTOperationTimeout(5)  # 5 sec

# Connect and subscribe to AWS IoT
myAWSIoTMQTTClient.connect(200)
myAWSIoTMQTTClient.subscribe(subTopic, 1, customCallback)
print("Subscribe %s success" % (subTopic))

#start collect and
t1 = pubThread()
t1.setDaemon(True)
event.clear()
t1.start()
renewStatus.renewStatus(myAWSIoTMQTTClient,statusTopic,clientId,t1.is_alive(),intervalTime)
event.set()

while True:
    time.sleep(3600)
