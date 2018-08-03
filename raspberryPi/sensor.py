import bme680
import json
import time

#def dataCollection():
def init():
    try:
        #BME680 sensor init
        sensor=bme680.BME680()

        sensor.set_humidity_oversample(bme680.OS_2X)
        sensor.set_pressure_oversample(bme680.OS_4X)
        sensor.set_temperature_oversample(bme680.OS_8X)
        sensor.set_filter(bme680.FILTER_SIZE_3)

        sensor.set_gas_status(bme680.ENABLE_GAS_MEAS)
        sensor.set_gas_heater_temperature(320)
        sensor.set_gas_heater_duration(150)
        sensor.select_gas_heater_profile(0)
        return sensor
    except:
        print("Sensor init failed")
        return False

def dataCollection(sensor):
    #Must call after sensorInit
    #get all data
    if sensor.get_sensor_data() and sensor.data.heat_stable:

        gas_baseline = 179500
        hum_baseline=40
        hum_weighting=0.25

        gas = sensor.data.gas_resistance
        gas_offset = gas_baseline - gas

        hum = sensor.data.humidity
        hum_offset = hum - hum_baseline

        # Calculate hum_score as the distance from the hum_baseline.
        if hum_offset > 0:
            hum_score = (100 - hum_baseline - hum_offset) / (100 - hum_baseline) * (hum_weighting * 100)
        else:
            hum_score = (hum_baseline + hum_offset) / hum_baseline * (hum_weighting * 100)

        # Calculate gas_score as the distance from the gas_baseline.
        if gas_offset > 0:
            gas_score = (gas / gas_baseline) * (100 - (hum_weighting * 100))
        else:
            gas_score = 100 - (hum_weighting * 100)

        # Calculate air_quality_score.
        air_quality_score = hum_score + gas_score

        return json.dumps(dict(temperature=sensor.data.temperature,humidity=sensor.data.humidity,pressure=sensor.data.pressure,quality=air_quality_score,time=time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),source='2'))
    else:
        return False
