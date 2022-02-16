import * as Offset from 'polygon-offset';

import { AbstractSensor } from '../sensor';
import { sensorSamplingTypes, AvailableSensors } from '../sensorManager';

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

class BufferedVoronoiCellSensor extends AbstractSensor<number[][]> {
  constructor(robot, scene) {

    const dependencies = [
      AvailableSensors.position,
      AvailableSensors.obstaclesAwareVoronoiCell
    ];
    super(robot, scene, name, sensorSamplingTypes.onUpdate, dependencies);
  }

  sample() {
    const cell = this.robot.sensors.obstaclesAwareVoronoiCell;
    const pos = this.robot.sensors.position;

    if (cell == null || cell.length < 3) {
      return;
    }

    this.value = calculateBVCfromVC(
      cell,
      pos,
      this.robot.radius
    );
  }
}

export default {
  name,
  Sensor: BufferedVoronoiCellSensor
};
