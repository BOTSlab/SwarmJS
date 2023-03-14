import { Voronoi } from "d3-delaunay";
import Robot from "../../robot";
import { GlobalSensor } from "../sensor";
import { SensorSamplingType } from "../sensorManager";
import { polygonCentroid } from "d3-polygon";

import { weightedVoronoi } from "d3-weighted-voronoi"


import { polygonContains } from 'd3';
import Scene from "../../../scene";

type centroid = {
  x: number,
  y: number,
  id: number
}
  
type hasWeight = { weight: number }
type hasSite = { site: { x: number, y: number } }

export class WeightedGlobalVoronoiSensor extends GlobalSensor<Robot, Voronoi<Robot>> {

  private static instance: WeightedGlobalVoronoiSensor;
  static readonly SENSOR_NAME = "weightedGlobalVoronoiSensor";

  private voronoi: Voronoi<Robot>

  public centroids: centroid[]

  private oldWeights: Array<number>

  private constructor(scene) {
    super(scene, WeightedGlobalVoronoiSensor.SENSOR_NAME, SensorSamplingType.onUpdate);    
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
    } else {

      const newCentroids = this.centroids.map((element, index) => {
        const polygon = this.voronoi[index] as [number, number][]
        if(polygon){
          const centroid = polygonCentroid(polygon)
          return { x: centroid[0], y: centroid[1], id: element.id }
        } else {
          return { x: null, y: null, id: element.id }
        }
      })

      this.centroids = newCentroids
    }

    this.centroids.sort((a,b) => a.id - b.id)

    
    let newWeights = Array<number>(this.scene.robots.length).fill(1)

    if(this.voronoi) {
      newWeights = getWeights(this.voronoi, this.scene)
    }

    if(!this.oldWeights) {
      this.oldWeights = newWeights
    }

    const finalWeights = adjustWeights(this.oldWeights, newWeights)
    this.oldWeights = finalWeights


    const centroidsWithWeights: (centroid & hasWeight)[] = []

    for(let i = 0; i < this.centroids.length; i++) {
      centroidsWithWeights.push({x: this.centroids[i].x, y: this.centroids[i].y, id: this.centroids[i].id, weight: finalWeights[i] })
    }

    const weightedVoronoi2 = weightedVoronoi()
    .x((d) => d.x)
    .y((d) => d.y)
    .weight((d) => d.weight)
    .clip([[0,0], [0, 800], [800, 800], [800, 0]])


    const newVoronoi: (number[][] & hasSite)[] = weightedVoronoi2(centroidsWithWeights)

    const testing: number[][][] = []

    for (let i = 0; i < this.centroids.length; i++) {
      const element = this.centroids[i];
      const polygon = newVoronoi.find(d => d.site.x === element.x && d.site.y === element.y)
      testing[i] = polygon
    }

    this.voronoi = testing as any

    const ret = new Map<Robot, Voronoi<Robot>>();
  
    this.scene.robots.forEach(robot => {
      ret.set(robot, this.voronoi)
    });

    return ret
  }
}

function getWeights(voronoi: Voronoi<Robot>, scene: Scene): number[] {

  const totalPucks: number = scene?.pucks?.length || 0
  let heldPucks = 0
  let goalPucks = 0
  let unheldNotInGoal = 0;
  const cellScore = scene.robots.map((element, index) => {
    const voronoiCell = voronoi[index]

    const unheldPucksInCellNotInGoal = scene?.pucks?.filter((p) => {
      if(p.held && index === 0) { heldPucks++}
      if(p.reachedGoal() && index === 0) { goalPucks++}
      if(!p.held && !p.reachedGoal() && index === 0 ) { unheldNotInGoal++}


      return (voronoiCell && voronoiCell.length) ? (!p.held && !p.reachedGoal() && polygonContains(voronoiCell, [p.position.x, p.position.y])) : false
    })

    // const unheldPucks = totalPucks - heldPucks
    // const notReachedGoalPucks = totalPucks - goalPucks

    const score = unheldPucksInCellNotInGoal?.length || 0

    return (unheldNotInGoal - score) * 6000
  })

  return cellScore
}
function adjustWeights(oldWeights: number[], newWeights: number[]): number[] {

  const WEIGHT_ADJUSTMENT = .05
  if(oldWeights.length !== newWeights.length) {
    throw new Error("oldWeights and newWeights must be the same length")
  }

  return oldWeights.map((oldWeight, index) => {
    return  oldWeight + ((newWeights[index] - oldWeight) * WEIGHT_ADJUSTMENT)
  })

}
