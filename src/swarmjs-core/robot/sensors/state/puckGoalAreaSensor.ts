import { AbstractSensor } from '../sensor';
import { AvailableSensors, SensorSamplingType } from '../sensorManager';

const name = 'puckGoalAreaSensor';

class PuckGoalAreaSensor extends AbstractSensor<boolean> {
  constructor(robot, scene) {
    const dependencies = [AvailableSensors.position];
    super(robot, scene, name, SensorSamplingType.onUpdate, dependencies, false);
  }

  sample() {
    let curGoalArea = null;

    this.scene.pucksGroups.forEach((group) => {
      if (this.robot.getDistanceTo(group.goal) < group.goalRadius) {
        curGoalArea = group.color;
      }
    });
    this.value = curGoalArea;
  }
}

export default {
  name,
  Sensor: PuckGoalAreaSensor
};
