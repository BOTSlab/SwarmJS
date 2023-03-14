import { AbstractSensor } from '../../sensor';
import { SensorSamplingType, AvailableSensors } from '../../sensorManager';
import { getDistance } from '../../../../utils/geometry';
import Puck from '../../../../puck';
import VoronoiCellSensor from '../VoronoiCellSensor';
import { polygonContains } from 'd3';



class PucksInCellSensor extends AbstractSensor<Puck[]> {

  static readonly SENSOR_NAME = 'PucksInCell';

  MAX_NEARBY_DISTANCE: number;
  public constructor(robot, scene) {
    const dependencies = [
      // AvailableSensors.position,
      // AvailableSensors.nearbyPucks,
      AvailableSensors.VoronoiSensor
    ];
    super(robot, scene, PucksInCellSensor.SENSOR_NAME, SensorSamplingType.onUpdate, dependencies, []);

    this.MAX_NEARBY_DISTANCE = robot.radius * 4;
  }

  sample() {

    const sensors = this.robot.sensors
    const voronoiCell = sensors[VoronoiCellSensor.name];

    const pucksInCell = this.scene?.pucks?.filter((p) => {
      return (voronoiCell && voronoiCell.length) ? polygonContains(voronoiCell, [p.position.x, p.position.y]) : false
    })

    return pucksInCell;
  }
}

const test2 = (): void => {
  return
}

export default {
  name: PucksInCellSensor.SENSOR_NAME,
  Sensor: PucksInCellSensor,
  test2
};
