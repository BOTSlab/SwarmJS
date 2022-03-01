import { AbstractSensor } from '../sensor';
import { AvailableSensors, SensorSamplingType } from '../sensorManager';

const name = 'reachedGoal';

class ReachedGoalSensor extends AbstractSensor<boolean> {
  constructor(robot, scene) {
    const dependencies = [AvailableSensors.position];
    super(robot, scene, name, SensorSamplingType.onUpdate, dependencies, false);
  }

  sample() {
    this.value = this.robot.reached(this.robot.goal);
  }
}

export default {
  name,
  Sensor: ReachedGoalSensor
};
