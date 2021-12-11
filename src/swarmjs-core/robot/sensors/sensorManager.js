/*  This module is responsible for managing the sensors,
    sensors are imported and stored in this module,
    all sampling is done through this module.
*/

import EnvironmentBoundsSensor from './envBoundsSensor';
import PositionSensor from './positionSensor';
import PrevPositionSensor from './prevPositionSensor';
import OrientationSensor from './orientationSensor';
import HeadingSensor from './headingSensor';
import NearbyPucksSensor from './nearbyPucksSensor';
import NeighborsSensor from './neighborsSensor';
import VoronoiCellSensor from './voronoiCellSensor';
import BufferedVoronoiCellSensor from './bufferedVoronoiCellSensor';

const toposort = require('toposort');

export const sensorSamplingTypes = {
  onStart: 'onStart',
  onUpdate: 'onUpdate',
  onRequest: 'onRequest'
};

const availableSensorDefitions = [
  EnvironmentBoundsSensor,
  PositionSensor,
  PrevPositionSensor,
  OrientationSensor,
  HeadingSensor,
  NearbyPucksSensor,
  NeighborsSensor,
  VoronoiCellSensor,
  BufferedVoronoiCellSensor
];

// Sensors are stored in this object allowing other modules to easily reference them
// e.g. in config when defining the enabled sensors, or in other sensors to define a dependency
export const availableSensors = availableSensorDefitions.reduce((acc, sensorDef) => {
  acc[sensorDef.name] = sensorDef;
  return acc;
}, {});

const orderSensors = (sensorList) => {
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
  constructor(scene, robot, enabledSensors) {
    this.scene = scene;
    this.robot = robot;

    this.activeSensors = orderSensors(
      enabledSensors.map(({ Sensor }) => new Sensor(robot, scene))
    );
    this.sensorsOnStart = this.activeSensors
      .filter((s) => s.type === sensorSamplingTypes.onStart);
    this.sensorsOnUpdate = this.activeSensors
      .filter((s) => s.type === sensorSamplingTypes.onUpdate);

    this.values = {};
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

  sense(name, params) {
    const sensor = this.activeSensors.find((s) => s.name === name);
    if (sensor.type === sensorSamplingTypes.onRequest) {
      // No need to add to values, as it is a regular sensor
      // and most likely involves special parameters
      // If it is beneficial to add it to values, change next line to:
      // this.sample(name, params);
      sensor.sample(params);
    }
    return sensor.read();
  }

  sample(name, params) {
    const sensor = this.activeSensors.find((s) => s.name === name);
    if (sensor) {
      sensor.sample(params);
    }
    this.values = {
      ...this.values,
      [name]: sensor.read()
    };
  }

  sampleSensors(sensorsList) {
    sensorsList.forEach((sensor) => {
      this.sample(sensor.name);
    });
  }

  update() {
    this.sampleSensors(this.sensorsOnUpdate);
  }

  start() {
    this.sampleSensors(this.sensorsOnStart);
  }
}
