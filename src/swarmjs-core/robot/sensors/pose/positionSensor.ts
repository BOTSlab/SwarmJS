/*
  This is an example of a sensor that senses the location of the robot
  Sensors can be implemented as either a class or a function
  Sensors should implement the following interface:
    sample(): calculates the value of the sensor
    read(): returns the latest sampled value of the sensor
    name: used to access (sample and read) the sensor through the sensor manager
    type: determines when the sensor is sampled, possible values: onStart, onUpdate.
    dependencies: optional, a list specifying any other sensors needed for this sensor to work,
                  used by sensorManager to determine the order in which the sensors are sampled

  The name and sensor object should be exposed by default exporting an object with properties:
    name: the name of the sensor
    Sensor: the sensor object (function or class)
  and all sensors should be added to the 'availableSensorDefitions' list in sensorManager
*/

import { Vector } from 'matter-js';
import { AbstractSensor } from '../sensor';
import { SensorSamplingType, AvailableSensors } from '../sensorManager';

const name = 'position';

// Class based sensor implementation
class PositionSensor extends AbstractSensor<Vector> {
  constructor(robot, scene) {
    const dependencies = [];
    super(robot, scene, name, SensorSamplingType.onUpdate, dependencies, {x: null, y: null});
  }

  sample() {
    if (!this.robot.body || !this.robot.body.position || this.robot.body.position.x == null) {
      // eslint-disable-next-line no-console
      console.log(`Robot ${this.robot.id} position not detected!`, this.robot);
    }
    this.value = this.robot.body?.position ? { ...this.robot.body.position } : { x: null, y: null };
  }
}

// Function based sensor implementation
// const PositionSensor = (robot) => {
//   const type = sensorSamplingTypes.onUpdate;
//   const dependencies = [AvailableSensors.prevPosition];

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
