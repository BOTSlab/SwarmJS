/*  This module is responsible for managing the sensors,
    sensors are imported and stored in this module,
    all sampling is done through this module.
*/

import EnvironmentBoundsSensor from './env/envBoundsSensor';
import PositionSensor from './pose/positionSensor';
import PrevPositionSensor from './pose/prevPositionSensor';
import OrientationSensor from './pose/orientationSensor';
import HeadingSensor from './pose/headingSensor';
import DirectionsSensor from './pose/directionsSensor';
import NearbyPucksSensor from './nearby/nearbyPucksSensor';
import NearbyObstaclesSensor from './nearby/nearbyObstaclesSensor';
import ClosestObstaclePointSensor from './voronoi/closestObstaclePointSensor';
import NeighborsSensor from './nearby/neighborsSensor';
import ObstaclesAwareVoronoiCellSensor from './voronoi/obstaclesAwareVoronoiCellSensor';
import BufferedVoronoiCellSensor from './voronoi/bufferedVoronoiCellSensor';
import ReachedGoalSensor from './state/reachedGoalSensor';
import ReachedWaypointSensor from './state/reachedWaypointSensor';
import PucksNearGrabberSensor from './clustering/pucksNearGrabberSensor';
import ClosestPuckToGrabberSensor from './clustering/closestPuckToGrabberSensor';
import WallSensor from './env/wallSensor';
import PuckGoalAreaSensor from './state/puckGoalAreaSensor';

import * as toposort from 'toposort'
import Robot from '../robot';
import Scene from '../../scene'
import VoronoiSensor from './voronoi/VoronoiCellSensor';
import { Sensor } from './sensor';

export const enum SensorSamplingType {
  onStart = 'onStart', // Only one sample is taken at the start of the simulation
  onUpdate = 'onUpdate', // Samples are taken every frame
  onDemand = 'onDemand' // Samples are taken when requested
}

const availableSensorDefitions = [
  EnvironmentBoundsSensor,
  WallSensor,
  PuckGoalAreaSensor,
  PositionSensor,
  PrevPositionSensor,
  OrientationSensor,
  HeadingSensor,
  DirectionsSensor,
  NearbyPucksSensor,
  NearbyObstaclesSensor,
  ClosestObstaclePointSensor,
  NeighborsSensor,
  ObstaclesAwareVoronoiCellSensor,
  BufferedVoronoiCellSensor,
  ReachedGoalSensor,
  ReachedWaypointSensor,
  PucksNearGrabberSensor,
  ClosestPuckToGrabberSensor,
  VoronoiSensor
];


// Sensors are stored in this object allowing other modules to easily reference them
// e.g. in config when defining the enabled sensors, or in other sensors to define a dependency
export const AvailableSensors: any = availableSensorDefitions.reduce((acc, sensorDef) => {
  acc[sensorDef.name] = sensorDef;
  return acc;
}, {});

const orderSensors = (sensorList: Sensor<unknown>[]) => {
  const edges = [];
  sensorList.forEach((sensor) => {
    if (sensor.dependencies && sensor.dependencies.length > 0) {
      sensor.dependencies.forEach((dependency) => {
        edges.push([dependency.name, sensor.name]);
      });
    }
  });
  const sorted = toposort(edges);
  const unsorted = sensorList
    .filter((sensor) => !sorted.includes(sensor.name))
    .map((sensor) => sensor.name);

  return [...unsorted, ...sorted].map((name) => sensorList.find((s) => s.name === name));
};

export default class SensorManager {
  scene: Scene;
  robot: Robot;
  activeSensors: Sensor<unknown>[];
  sensorsOnStart: any;
  sensorsOnUpdate: any;
  values: any;
  constructor(scene, robot, enabledSensors) {
    this.scene = scene;
    this.robot = robot;

    this.activeSensors = orderSensors(
      enabledSensors.map(({ Sensor }) => new Sensor(robot, scene))
    );
    this.sensorsOnStart = this.activeSensors
      .filter((s) => s.type === SensorSamplingType.onStart);
    this.sensorsOnUpdate = this.activeSensors
      .filter((s) => s.type === SensorSamplingType.onUpdate);

    this.values = this.activeSensors.reduce((acc, sensor) => {
      acc[sensor.name] = sensor.read();
      return acc;
    }, {});
  }

  readAll() {
    return this.activeSensors.reduce((acc, sensor) => {
      acc[sensor.name] = sensor.read();
      return acc;
    }, {});
  }

  read(name) {
    const sensor = this.activeSensors.find((s) => s.name === name);
    return sensor.read();
  }

  sense(name) {
    const sensor = this.activeSensors.find((s) => s.name === name);
    return sensor.read();
  }

  sample(name, tick, force = false) {
    const sensor = this.activeSensors.find((s) => s.name === name);
    if (sensor) {
      sensor.sample(tick, force);
    }
    this.values = {
      ...this.values,
      [name]: sensor.read()
    };
  }

  sampleSensors(sensorsList, tick: number, force = false) {
    sensorsList.forEach((sensor) => {
      this.sample(sensor.name, tick, force);
    });
  }

  update(tick?: number, force = false) {
    this.sampleSensors(this.sensorsOnUpdate, tick, force);
  }

  start() {
    this.sampleSensors(this.sensorsOnStart, 0);
  }
}
