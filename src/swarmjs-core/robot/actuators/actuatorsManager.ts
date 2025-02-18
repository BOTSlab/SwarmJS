import Scene from '../../scene';
import Robot from '../robot';
import GrabberActuator from './grabberActuator';

const availableActuatorsDefitions = [
  GrabberActuator
];

// Actuators are stored in this object allowing other modules to easily reference them
// e.g. in config when defining the enabled sensors, or in other sensors to define a dependency
export const AvailableActuators = availableActuatorsDefitions.reduce((acc, actDef) => {
  acc[actDef.name] = actDef;
  return acc;
}, {});

export default class ActuatorManager {
  scene: Scene;
  robot: Robot;
  activeActuators: any;
  constructor(scene, robot, enabledActuators) {
    this.scene = scene;
    this.robot = robot;

    this.activeActuators = enabledActuators.map(({ Actuator }) => new Actuator(robot, scene));
  }

  get actuators() {
    return this.activeActuators.reduce((acc, a) => ({
      ...acc,
      [a.name]: a
    }), {});
  }
}
