import { AbstractSensor } from '../sensor';
import { SensorSamplingType, AvailableSensors } from '../sensorManager';
import { Vector } from 'matter-js';

const name = 'closestObstaclePoint';

class ClosestObstaclePointSensor extends AbstractSensor<Vector> {
  constructor(robot, scene) {
    const dependencies = [
      AvailableSensors.position,
      AvailableSensors.nearbyObstacles
    ];
    super(robot, scene, name, SensorSamplingType.onUpdate, dependencies, undefined);
  }

  sample() {
    const pos = this.robot.sensors.position;
    const points = this.robot.sensors.nearbyObstacles
      .map((staticObs) => staticObs.getIntersectionPoint(pos));

    if (points.length === 0) {
      this.value = null;
    }

    this.value = points.reduce((acc, point) => {
      if (acc === null || this.robot.getDistanceTo(point) < this.robot.getDistanceTo(acc)) {
        return point;
      }
      return acc;
    }, null);
  }
}

export default {
  name,
  Sensor: ClosestObstaclePointSensor
};
