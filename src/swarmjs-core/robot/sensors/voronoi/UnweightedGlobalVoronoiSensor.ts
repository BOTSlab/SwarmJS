import { Delaunay, Voronoi } from "d3-delaunay";
import Robot from "../../robot";
import { GlobalSensor } from "../sensor";
import { SensorSamplingType } from "../sensorManager";
import { polygonCentroid } from "d3-polygon";



type centroid = {
  x: number,
  y: number,
  id: number
}

export class UnweightedGlobalVoronoiSensor extends GlobalSensor<Robot, Voronoi<Robot>> {

  private static instance: UnweightedGlobalVoronoiSensor;
  static readonly SENSOR_NAME = "unweightedGlobalVoronoiSensor";

  private voronoi: Voronoi<Robot>

  public centroids: centroid[]

  private constructor(scene) {
    super(scene, UnweightedGlobalVoronoiSensor.SENSOR_NAME, SensorSamplingType.onUpdate);
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

    if(!this.voronoi) {
      this.centroids = this.scene.robots.map(robot => {return {x: robot.body.position.x, y: robot.body.position.y, id: robot.id}});
      
      //Use the center of the environment bounds as the only centroid to have agents share a single cell
      //Also requires change in VoronoiSensor.ts
      //this.centroids = [[400,400]]
    } else {

      this.centroids.forEach((element, index) => {
        //Need to expressly cast Point to [number, number], so polygon is [number, number][]
        const polygon = this.voronoi.cellPolygon(index) as [number, number][]
        const polyCentroid = polygonCentroid(polygon)
        this.centroids[index] = {x: polyCentroid[0], y: polyCentroid[1], id: this.centroids[index].id}
      });
    }

    //TODO: Update the existing voronoi rather than create a new one every time this is called
    // this.voronoi.update()
    this.voronoi = Delaunay.from(this.centroids.map(centroid => [centroid.x, centroid.y])).voronoi([0,0,this.scene.width,this.scene.height]);
      
    const ret = new Map<Robot, Voronoi<Robot>>();
  
    this.scene.robots.forEach(robot => {
      ret.set(robot, this.voronoi)
    });

    return ret
  
  }
}
