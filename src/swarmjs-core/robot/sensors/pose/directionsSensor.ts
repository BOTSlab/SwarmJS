// This sensor calculates the points on all directions relative to the robot.
// Usefull for controllers to easily set a heading direction depending on sensor readings.

import { AbstractSensor } from '../sensor';
import { SensorSamplingType, AvailableSensors } from '../sensorManager';
import { getAbsolutePointFromLengthAndAngle } from '../../../utils/geometry';

const name = 'directions';
const directionsDefinitions = {
  forward: 0,
  forwardRight: Math.PI / 4,
  right: Math.PI / 2,
  backwardRight: (3 * Math.PI) / 4,
  backward: Math.PI,
  backwardLeft: -(3 * Math.PI) / 4,
  left: -Math.PI / 2,
  forwardLeft: -Math.PI / 4
};

type coordinate = { x: number, y: number };

type directionType = {
  forward: coordinate,
  forwardRight: coordinate,
  right: coordinate,
  backwardRight: coordinate,
  backward: coordinate,
  backwardLeft: coordinate,
  left: coordinate,
  forwardLeft: coordinate
}

const defaultValue = () => {
  return Object.keys(directionsDefinitions).reduce((acc, direction) => {
    acc[direction] = { x: null, y: null };
    return acc;
  }, {});
}

class DirectionsSensor extends AbstractSensor<directionType | Record<string, unknown>> {
  constructor(robot, scene) {
    const dependencies = [
      AvailableSensors.position,
      AvailableSensors.orientation
    ];
    super(robot, scene, name, SensorSamplingType.onUpdate, dependencies, defaultValue());
  }

  sample() {
    this.value = Object.keys(directionsDefinitions).reduce((acc, direction) => {
      const angle = this.robot.sensors.orientation + directionsDefinitions[direction];
      acc[direction] = getAbsolutePointFromLengthAndAngle(
        this.robot.sensors.position, this.robot.radius * 2, angle
      );
      return acc;
    }, {});
  }
}

export default {
  name,
  Sensor: DirectionsSensor
};
