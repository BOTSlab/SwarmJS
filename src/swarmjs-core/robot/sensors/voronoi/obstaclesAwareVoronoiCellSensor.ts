// This sensor uses the voronoi diagram calculated by the scene to determine the cell
// that the robot is in to avoid recalculating multiple Voronoi diagrams by each robot.
// If local measurements are needed, such as if sensor errors are simulated in
// neighbors measurements; this sensor should be re-implemented to regenerate its own
// Voronoi diagram using the sensed positions of the neighbors.


import * as splitPolygon from 'split-polygon'

import { AbstractSensor } from '../sensor';
import { AvailableSensors, SensorSamplingType } from '../sensorManager';
import {
  shiftPointOfLineSegInDirOfPerpendicularBisector,
  getLineEquationParams,
  pointIsInsidePolygon,
  closePolygon
} from '../../../utils/geometry';
import Robot from '../../robot';
import Scene from '../../../scene';
import VoronoiSensor from './VoronoiCellSensor';
import { Delaunay } from 'd3-delaunay';

const name = 'obstaclesAwareVoronoiCell';

const trimVCwithStaticObstacles = (pos, VC: Delaunay.Polygon, closestPoint) => {
  if (closestPoint == null) {
    return VC;
  }

  const secondLinePoint = shiftPointOfLineSegInDirOfPerpendicularBisector(
    closestPoint.x,
    closestPoint.y,
    closestPoint.x,
    closestPoint.y,
    pos.x,
    pos.y,
    1
  );

  const splittingLineParams = getLineEquationParams(closestPoint, secondLinePoint);

  const splitPolygonRes = VC && VC.length > 2
    ? splitPolygon(VC, splittingLineParams)
    : { positive: VC, negative: [] };
  const splitPolygonParts = [splitPolygonRes.positive, splitPolygonRes.negative];
  splitPolygonParts.map(
    (poly) => closePolygon(poly)
  );

  if (pointIsInsidePolygon(pos, splitPolygonParts[0])) {
    return splitPolygonParts[0];
  }
  return splitPolygonParts[1];
};

class ObstaclesAwareVoronoiCellSensor extends AbstractSensor<Delaunay.Polygon> {
  scene: Scene;
  robot: Robot;

  constructor(robot, scene) {
    const dependencies = [
      AvailableSensors.position,
      AvailableSensors.closestObstaclePoint,
      AvailableSensors[VoronoiSensor.name]
    ];
    super(robot, scene, name, SensorSamplingType.onUpdate, dependencies, [] );
  }

  sample() {
    // const originalVC = (this.robot?.sensors?.get(VoronoiSensor.name) as VoronoiCellSensor).read();
    const sensorValues = this.robot?.sensors
    const originalVC = sensorValues[VoronoiSensor.name]

    if (originalVC == null) {
      this.value = [];
      return;
    }

    const pos = this.robot.sensors?.position;
    const closestPoint = this.robot?.sensors?.closestObstaclePoint;
    this.value = pos && closestPoint
      ? trimVCwithStaticObstacles(pos, originalVC, closestPoint)
      : originalVC;
  }
}

export default {
  name,
  Sensor: ObstaclesAwareVoronoiCellSensor
};
