import sys
import logging
import rds_config
import pymysql
#rds settings
rds_host  = "raspberydbinstance.cocmbbw37bwd.eu-west-2.rds.amazonaws.com"
name = rds_config.db_username
password = rds_config.db_password
db_name = rds_config.db_name
db_port=rds_config.db_port

logger = logging.getLogger()
logger.setLevel(logging.INFO)

try:
    conn = pymysql.connect(rds_host, port=db_port, user=name, passwd=password, db=db_name, connect_timeout=5)
except:
    logger.error("ERROR: Unexpected error: Could not connect to MySql instance.")
    sys.exit()

logger.info("SUCCESS: Connection to RDS mysql instance succeeded")

def collectWeatherData(event, context):
    with conn.cursor() as cur:
        try:
            sql="INSERT INTO data (source,time,temperature,humidity,pressure,quality) VALUES (%s,%s,%s,%s,%s,%s);"
            cur.execute(sql,[event['source'],event['time'],event['temperature'],event['humidity'],event['pressure'],event['quality']])
            conn.commit()
            logger.info("success")
        except Exception as e:
            conn.rollback()
            logger.info(e)

    return
