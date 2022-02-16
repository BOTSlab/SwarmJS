import { AbstractSensor } from '../sensor';
import { sensorSamplingTypes, AvailableSensors } from '../sensorManager';
import { getAbsolutePointFromLengthAndAngle } from '../../../utils/geometry';
import { Vector } from 'matter-js';

const name = 'heading';

class HeadingSensor extends AbstractSensor<Vector> {
  constructor(robot, scene) {
    const dependencies = [
      AvailableSensors.position,
      AvailableSensors.orientation
    ];
    super(robot, scene, name, sensorSamplingTypes.onUpdate, dependencies, {x: null, y: null});
  }

  sample() {
    this.value = getAbsolutePointFromLengthAndAngle(
      this.robot.sensors.position, this.robot.radius * 1.2, this.robot.sensors.orientation
    );
  }
}

export default {
  name,
  Sensor: HeadingSensor
};
