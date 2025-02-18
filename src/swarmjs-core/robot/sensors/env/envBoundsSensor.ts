import { AbstractSensor } from '../sensor';
import { SensorSamplingType } from '../sensorManager';

const name = 'envBounds';

class EnvironmentBoundsSensor extends AbstractSensor<{x: number, y: number}[]> {
  constructor(robot, scene) {
    super(robot, scene, name, SensorSamplingType.onStart);
    this.value = [];
  }

  sample() {
    this.value = [
      { x: 0, y: 0 },
      { x: this.scene.width, y: 0 },
      { x: this.scene.width, y: this.scene.height },
      { x: 0, y: this.scene.height },
      { x: 0, y: 0 }
    ];
  }
}

export default {
  name,
  Sensor: EnvironmentBoundsSensor
};
