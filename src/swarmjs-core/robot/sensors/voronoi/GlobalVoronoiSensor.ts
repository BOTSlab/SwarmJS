import { Global } from "@emotion/react";
import { Delaunay, Voronoi } from "d3-delaunay";
import Scene from "../../../scene";
import Robot from "../../robot";
import { AbstractSensor, GlobalSensor, Sensor } from "../sensor";
import { SensorSamplingType } from "../sensorManager";


export class GlobalVoronoiSensor extends GlobalSensor<Robot, Voronoi<Robot>> {

  private static instance: GlobalVoronoiSensor;
  static readonly SENSOR_NAME = "globalVoronoiJohnTest";

  private voronoi: Voronoi<Robot>

  private constructor(scene) {
    super(scene, GlobalVoronoiSensor.SENSOR_NAME, SensorSamplingType.onUpdate);
  }

  // Get instance of singleton
  static getInstance(scene?) {
    if(!this.instance) {
      if (!scene) throw new Error("Scene is required to create GlobalVoronoiSensor");
      this.instance = new this(scene);
    }
    return this.instance;
  }

  getValues(): Map<Robot, Voronoi<Robot>> {

    if(!this.scene?.robots || this.scene.robots.length === 0) return new Map();

    //TODO: Update the existing voronoi rather than create a new one
    this.voronoi = Delaunay.from(this.scene.robots,
      (robot) => robot.body.position.x,
      (robot) => robot.body.position.y)
      .voronoi([0,0,this.scene.width,this.scene.height]);

    if(!this.voronoi) {
      this.voronoi = Delaunay.from(this.scene.robots,
        (robot) => robot.body.position.x,
        (robot) => robot.body.position.y)
        .voronoi([0,0,this.scene.width,this.scene.height]);
    } else {
      this.voronoi.update()
    }

    const ret = new Map<Robot, Voronoi<Robot>>();
  
    this.scene.robots.forEach(robot => {
      ret.set(robot, this.voronoi)
    });

    return ret
  }
}
