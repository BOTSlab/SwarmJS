import { Delaunay, Voronoi } from "d3-delaunay";
import Robot from "../../robot";
import { GlobalSensor } from "../sensor";
import { SensorSamplingType } from "../sensorManager";
import { polygonCentroid } from "d3-polygon";

import { weightedVoronoi } from "d3-weighted-voronoi"

type centroid = {
  x: number,
  y: number,
  id: number
}

// export {UnweightedGlobalVoronoiSensor as GlobalVoronoiSensor} from './UnweightedGlobalVoronoiSensor';
export { WeightedGlobalVoronoiSensor as GlobalVoronoiSensor} from './WeightedGlobalVoronoiSensor';
// export { SingleVoronoiCellSensor as GlobalVoronoiSensor} from './SingleVoronoiCellSensor';
