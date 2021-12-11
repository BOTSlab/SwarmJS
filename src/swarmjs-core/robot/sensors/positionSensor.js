/*
  This is an example of a sensor that senses the location of the robot
  Sensors can be implemented as either a class or a function
  Sensors should implement the following interface:
    sample(): calculates the value of the sensor
    read(): returns the latest sampled value of the sensor
    name: used to access (sample and read) the sensor through the sensor manager
    type: determines when the sensor is sampled, possible values: onStart, onUpdate, or onRequest.
    dependencies: optional, a list specifying any other sensors needed for this sensor to work,
                  used by sensorManager to determine the order in which the sensors are sampled

  The name and sensor object should be exposed by default exporting an object with properties:
    name: the name of the sensor
    Sensor: the sensor object (function or class)
  and all sensors should be added to the 'availableSensorDefitions' list in sensorManager
*/

import Sensor from './sensor';
import { sensorSamplingTypes, availableSensors } from './sensorManager';

const name = 'position';

// Class based sensor implementation
class PositionSensor extends Sensor {
  constructor(robot, scene) {
    super(robot, scene, name, sensorSamplingTypes.onUpdate);
    this.dependencies = [availableSensors.prevPosition];
    this.value = { x: null, y: null };
  }

  sample() {
    this.value = this.robot.body?.position ? { ...this.robot.body.position } : { x: null, y: null };
  }
}

// Function based sensor implementation
// const PositionSensor = (robot) => {
//   const type = sensorSamplingTypes.onUpdate;
//   const dependencies = [availableSensors.prevPosition];

//   // private
//   const { body } = robot;
//   let value = { x: null, y: null };

//   const sample = () => {
//     value = body?.position?.x && body?.position?.y
//       ? { ...body.position }
//       : { x: null, y: null };
//   };

//   const read = () => value;

//   return {
//     name,
//     type,
//     dependencies,
//     sample,
//     read
//   };
// };

export default {
  name,
  Sensor: PositionSensor
};
