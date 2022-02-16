import { Vector } from 'matter-js';
import { AbstractSensor } from '../sensor';
import { AvailableSensors, sensorSamplingTypes } from '../sensorManager';

const name = 'prevPosition';

class PrevPositionSensor extends AbstractSensor<Vector> {
  constructor(robot, scene) {
    super(robot, scene, name, sensorSamplingTypes.onUpdate, [AvailableSensors.position], {x: null, y: null});
  }

  sample() {
    this.value = { ...this.robot.sensors.position };
  }
}

export default {
  name,
  Sensor: PrevPositionSensor
};
