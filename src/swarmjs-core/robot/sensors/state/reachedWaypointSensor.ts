import { AbstractSensor } from '../sensor';
import { AvailableSensors, sensorSamplingTypes } from '../sensorManager';

const name = 'reachedWaypoint';

class ReachedWaypointSensor extends AbstractSensor<boolean> {
  constructor(robot, scene) {
    const dependencies = [AvailableSensors.position]
    super(robot, scene, name, sensorSamplingTypes.onUpdate, dependencies, false);
  }

  sample() {
    this.value = this.robot.reached(this.robot.waypoint);
  }
}

export default {
  name,
  Sensor: ReachedWaypointSensor
};
