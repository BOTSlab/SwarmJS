import { Delaunay, Voronoi } from "d3-delaunay";
import Robot from "../../robot";
import { GlobalSensor } from "../sensor";
import { SensorSamplingType } from "../sensorManager";
import { polygonCentroid } from "d3-polygon";

import { weightedVoronoi } from "d3-weighted-voronoi"


export class GlobalVoronoiSensor extends GlobalSensor<Robot, Voronoi<Robot>> {

  private static instance: GlobalVoronoiSensor;
  static readonly SENSOR_NAME = "globalVoronoiJohnTest";

  private voronoi: Voronoi<Robot>

  public centroids: number[][]

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

  getUnweightedValues(): Map<Robot, Voronoi<Robot>> {
    if(!this.scene?.robots || this.scene.robots.length === 0) return new Map();

    if(!this.voronoi) {
      this.centroids = this.scene.robots.map(robot => [robot.body.position.x, robot.body.position.y]);
      
      //Use the center of the environment bounds as the only centroid to have agents share a single cell
      //Also requires change in VoronoiSensor.ts
      //this.centroids = [[400,400]]
    } else {

      this.centroids.forEach((element, index) => {
        //Need to expressly cast Point to [number, number], so polygon is [number, number][]
        const polygon = this.voronoi.cellPolygon(index) as [number, number][]
        const centroid = polygonCentroid(polygon)
        if(this.centroids[index] === centroid) {
          console.log("Centroid is the same")
        } else {
          this.centroids[index] = centroid
        }

      });


    }

    //TODO: Update the existing voronoi rather than create a new one every time this is called
    // this.voronoi.update()
    this.voronoi = Delaunay.from(this.centroids).voronoi([0,0,this.scene.width,this.scene.height]);
      

    const ret = new Map<Robot, Voronoi<Robot>>();
  
    this.scene.robots.forEach(robot => {
      ret.set(robot, this.voronoi)
    });

    return ret
  }

  getWeightedValues(): Map<Robot, Voronoi<Robot>> {
    if(!this.scene?.robots || this.scene.robots.length === 0) return new Map();

    if(!this.voronoi) {
      this.centroids = this.scene.robots.map(robot => [robot.body.position.x, robot.body.position.y]);
    } else {

      this.centroids.forEach((element, index) => {
        //Need to expressly cast Point to [number, number], so polygon is [number, number][]
        // const polygon = this.voronoi.cellPolygon(index) as [number, number][]
        const polygon = this.voronoi[index] as [number, number][]
        const centroid = polygonCentroid(polygon)
        if(this.centroids[index] === centroid) {
          console.log("Centroid is the same")
        } else {
          this.centroids[index] = centroid
        }

      });


    }

    //TODO: Update the existing voronoi rather than create a new one every time this is called
    // this.voronoi.update()
    // this.voronoi = Delaunay.from(this.centroids).voronoi([0,0,this.scene.width,this.scene.height]);

    const weightedVoronoi2 = weightedVoronoi()
      .x((d) => d[0])
      .y((d) => d[1])
      .weight((d) => 1)
      .clip([[0,0], [0, 800], [800, 800], [800, 0]])

    this.voronoi = weightedVoronoi2(this.centroids)

    const ret = new Map<Robot, Voronoi<Robot>>();
  
    this.scene.robots.forEach(robot => {
      ret.set(robot, this.voronoi)
    });

    return ret
  }
  

  getValues(): Map<Robot, Voronoi<Robot>> {
    return this.getUnweightedValues()
  }
}
