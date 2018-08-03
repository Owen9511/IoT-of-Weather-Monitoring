import sys
import logging
import rds_config
import pymysql
import json
import boto3
import time

#rds settings
rds_host  = "raspberydbinstance.cocmbbw37bwd.eu-west-2.rds.amazonaws.com"
name = rds_config.db_username
password = rds_config.db_password
db_name = rds_config.db_name

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def connect():
    try:
        conn = pymysql.connect(rds_host, port=3297,user=name, passwd=password, db=db_name, connect_timeout=5)
    except:
        logger.error("ERROR: Unexpected error: Could not connect to MySql instance.")
        sys.exit()
    return conn


def pub(id,status,intervalTime):
    #public IoT control data to controlDevicesStatus topic
    client=boto3.client('iot-data')
    if status==0:
        instruction='end'
    else:
        instruction='start'
    message=json.dumps(dict(id=id,instruction=instruction,intervalTime=intervalTime))
    client.publish(topic="controlDevicesStatus",qos=1,payload=message)

def controlDevicesStatus(event, context):
    #get request data
    message=json.loads(event['body'])
    id=message['id']
    status=message['status']
    intervalTime=message['intervalTime']

    #get device's current status
    conn=connect()
    cursor = conn.cursor()
    cursor.execute("SELECT status,intervalTime FROM devices WHERE id = '%s'" % (id))
    if cursor.rowcount==1:
        currentStatus=cursor.fetchone()
        currentSta=currentStatus[0]
        currentIntervalTime=currentStatus[1]
        cursor.close()
        conn.close()
    else:
        return {"statusCode": 400, "headers": {'Access-Control-Allow-Origin': '*','Content-Type': 'application/json' }, "body": "Fail to get current status" }

    def changeStatus():
        if currentSta!= status:
            pub(id,status,intervalTime)
            return 'change status'

        else:
            return 'already in status'

    for i in range(3):
         changeStatus()
         time.sleep(3)
         conn=connect()
         cursor = conn.cursor()
         cursor.execute("SELECT status,intervalTime FROM devices WHERE id = '%s'" % (id))
         changedStatus=cursor.fetchone()
         cursor = cursor.close()
         conn.close()
         if (changedStatus[0]==status and changedStatus[1]==intervalTime) or (changedStatus[0]==status==False):
             break
         else:
             currentSta=changedStatus[0]
             currentIntervalTime=changedStatus[1]
             time.sleep(2)

    if (changedStatus[0]==status and changedStatus[1]==intervalTime) or (changedStatus[0]==status==False):
        body=json.dumps({"result":"success","attempTimes": (i+1)})
        return {"statusCode": 200, "headers": {'Access-Control-Allow-Origin': '*','Content-Type': 'application/json'}, "body": body }
    else:
        body=json.dumps({"result":"failed","attempTimes": (i+1)})
        return {"statusCode": 400, "headers": {'Access-Control-Allow-Origin': '*','Content-Type': 'application/json'}, "body":body }
