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

def renewDevicesStatus(event, context):
    with conn.cursor() as cur:
        cur.execute("UPDATE devices SET status = '%s', intervalTime = '%s' WHERE id = '%s'" % (event['status'],event['intervalTime'],event['id']))
        conn.commit()
        logger.info(cur)


    return 'Update devices %s status to %s' % (event['status'],event['id'])
