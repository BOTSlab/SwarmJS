import { AbstractSensor } from '../sensor';
import { SensorSamplingType } from '../sensorManager';
import { normalizeAngle } from '../../../utils/geometry';

const name = 'orientation';

class OrientationSensor extends AbstractSensor<number> {
  constructor(robot, scene) {
    super(robot, scene, name, SensorSamplingType.onUpdate)
  }

  sample() {
    const angle = this.robot.body.angle && typeof this.robot.body.angle === 'number'
      ? this.robot.body.angle : this.robot.sensors.orientation;
    this.value = normalizeAngle(angle);
  }
}

export default {
  name,
  Sensor: OrientationSensor
};
