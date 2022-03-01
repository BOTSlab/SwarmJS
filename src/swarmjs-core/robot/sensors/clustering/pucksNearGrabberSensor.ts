import { AbstractSensor } from '../sensor';
import { SensorSamplingType, AvailableSensors } from '../sensorManager';
import { getDistance } from '../../../utils/geometry';
import Puck from '../../../puck';

const name = 'pucksNearGrabber';

class PucksNearGrabberSensor extends AbstractSensor<Puck[]> {
  MAX_NEARBY_DISTANCE: number;
  public constructor(robot, scene) {
    const dependencies = [
      AvailableSensors.position,
      AvailableSensors.heading,
      AvailableSensors.nearbyPucks
    ];
    super(robot, scene, name, SensorSamplingType.onUpdate, dependencies, []);

    this.MAX_NEARBY_DISTANCE = robot.radius * 4;
  }

  sample() {
    this.value = this.robot.sensors.nearbyPucks?.filter((puck) => {
      const robotToPuck = this.robot.getDistanceTo(puck.position);
      const grabberToPuck = getDistance(this.robot.sensors.heading, puck.position);
      const isCloseEnough = grabberToPuck < this.MAX_NEARBY_DISTANCE;
      return grabberToPuck < robotToPuck && isCloseEnough;
    });
  }

}

const test2 = (): void => {
  return
}

export default {
  name,
  Sensor: PucksNearGrabberSensor,
  test2
};
