import { Delaunay } from 'd3-delaunay';
import * as Offset from 'polygon-offset';
import Scene from '../../../scene';
import Robot from '../../robot';

import { AbstractSensor } from '../sensor';
import { SensorSamplingType, AvailableSensors } from '../sensorManager';

const name = 'BVC';

const calculateBVCfromVC = (cell, position, radius) => {
  const offset = new Offset();
  let padding = [];
  try {
    [padding] = offset.data(cell).padding(radius * 1);
  } catch (err) {
    // On collisions, if voronoi cell is too small => BVC is undefined
    // Should not occur in collision-free configurations
    // eslint-disable-next-line no-console
    console.log(`Error calculating BVC:  ${err}`);
    padding = [[position.x, position.y]];
  }

  return padding;
};

class BufferedVoronoiCellSensor extends AbstractSensor<Delaunay.Polygon> {
  constructor(robot: Robot, scene: Scene) {

    const dependencies = [
      AvailableSensors.position,
      AvailableSensors.obstaclesAwareVoronoiCell
    ];
    super(robot, scene, name, SensorSamplingType.onUpdate, dependencies);
  }

  sample() {
    const cell = this.robot.sensors.obstaclesAwareVoronoiCell;
    const pos = this.robot.sensors.position;

    if (cell == null || cell.length < 3) {
      return;
    }

    this.value = this.robot.sensors.obstaclesAwareVoronoiCell;

    // this.value = calculateBVCfromVC(
    //   cell,
    //   pos,
    //   this.robot.radius
    // );
  }
}

export default {
  name,
  Sensor: BufferedVoronoiCellSensor
};
