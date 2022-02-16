import { AbstractSensor} from '../sensor';
import { sensorSamplingTypes, AvailableSensors } from '../sensorManager';
import { getDistance } from '../../../utils/geometry';
import Puck from '../../../puck';

const name = 'closestPuckToGrabber';

class ClosestPuckToGrabber extends AbstractSensor<Puck> {
  constructor(robot, scene, initialValue = undefined) {
    const dependencies = [
      AvailableSensors.heading,
      AvailableSensors.pucksNearGrabber
    ];
    super(robot, scene, name, sensorSamplingTypes.onUpdate, dependencies, initialValue);
  }

  sample() {
    const pucks = this.robot.sensors.pucksNearGrabber;

    this.value = pucks?.reduce((acc, p) => {
      if (acc === null) {
        return p;
      }

      const pDist = getDistance(this.robot.sensors.heading, p.position);
      const accDist = getDistance(this.robot.sensors.heading, acc.position);
      return pDist < accDist ? p : acc;
    }, null);
  }
}

export default {
  name,
  Sensor: ClosestPuckToGrabber
};
