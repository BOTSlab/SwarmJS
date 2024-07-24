import { Delaunay, Voronoi } from "d3-delaunay";
import Scene from "../../../scene";
import Robot from "../../robot";
import { AbstractSensor, GlobalSensor } from "../sensor";
import { SensorSamplingType } from "../sensorManager";
import { GlobalVoronoiSensor } from "./GlobalVoronoiSensor";


export class VoronoiCellSensor extends AbstractSensor<Delaunay.Polygon> {

  static sensorName = "individualVoronoiSensor";

  private globalSensor: GlobalSensor<Robot, Voronoi<Robot>>;


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
    if (!voronoi) return

    // this.value = voronoi?.cellPolygon(this.robot.id)
    this.value = voronoi[this.robot.id]
    
    //Use this for all agents to share the same cell
    //Requires change in GlobalVornoiSensor.ts as well
    // this.value = voronoi[0]

  }
}

export default {
  name: VoronoiCellSensor.sensorName,
  Sensor: VoronoiCellSensor
};
