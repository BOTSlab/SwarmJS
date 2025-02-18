import Scene from '../../../scene';
import { AbstractSensor } from '../sensor';
import { SensorSamplingType, AvailableSensors } from '../sensorManager';
import Robot from '../../robot';

const name = 'neighbors';

const getNeighbors = (scene: Scene, robotId): Robot[] => {
  const neighbors: Robot[] = [];
  try {
    if (scene.voronoi?.delaunay) {
      Array.from(scene.voronoi?.delaunay.neighbors(robotId))
        .filter((x) => x > -1)
        .forEach((i:number) => neighbors.push(scene.robots[i]));
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`Error Exracting Neighbors for robot ${robotId}: ${error}`);
  }

  return neighbors;
};

class NeighborsSensor extends AbstractSensor<Robot[]> {
  constructor(robot, scene) {
    super(robot, scene, name, SensorSamplingType.onUpdate,[AvailableSensors.position] , []);
  }

  sample() {
    this.value = getNeighbors(this.scene, this.robot.id);
  }
}

export default {
  name,
  Sensor: NeighborsSensor
};
