import { AbstractSensor } from '../sensor';
import Puck from '../../../puck';
import { SensorSamplingType, AvailableSensors } from '../sensorManager';
import Robot from '../../robot';
import Scene from '../../../scene';

const name = 'nearbyPucks';

class NearbyPucksSensor extends AbstractSensor<Puck[]> {
  private MAX_NEARBY_DISTANCE: number;
  constructor(robot: Robot, scene: Scene) {
    const dependencies = [AvailableSensors.position];
    super(robot, scene, name, SensorSamplingType.onUpdate, dependencies, []);


    this.MAX_NEARBY_DISTANCE = robot.radius * 20;
  }

  sample() {
    this.value = this.scene?.pucks?.filter(
      (p) => !p.held && this.robot.getDistanceTo(p.position) < this.MAX_NEARBY_DISTANCE
    );
  }
}

export default {
  name,
  Sensor: NearbyPucksSensor
};
