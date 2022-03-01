import { Delaunay, Voronoi } from "d3-delaunay";
import Scene from "../../../scene";
import Robot from "../../robot";
import { AbstractSensor } from "../sensor";
import { SensorSamplingType } from "../sensorManager";
import { GlobalVoronoiSensor } from "./GlobalVoronoiSensor";


// const name = "voronoiJohnTest";
export class VoronoiCellSensor extends AbstractSensor<Delaunay.Polygon> {

  static sensorName = "voronoiJohnTest";

  private globalSensor: GlobalVoronoiSensor;


  constructor(robot: Robot, scene: Scene) {
    super(robot, scene, VoronoiCellSensor.sensorName, SensorSamplingType.onUpdate, [], undefined as Delaunay.Polygon);

    this.globalSensor = GlobalVoronoiSensor.getInstance(scene);
  }


  sample(tick?: number): void {

    //Sample the global sensor
    if(!tick && tick !== 0) throw new Error("Simulation Tick required to sample voronoi sensor");

    this.globalSensor.sample(tick)

    //Read the global sensor and filter this sensor's value
    const voronoi = this.globalSensor.read().get(this.robot)

    this.value = voronoi?.cellPolygon(this.robot.id)
  }
}

export default {
  name: VoronoiCellSensor.sensorName,
  Sensor: VoronoiCellSensor
};
