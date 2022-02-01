import Scene from "../../scene";
import Robot from "../robot";

export default class Sensor {
  robot: Robot;
  scene: Scene;
  name: string;
  type: any;
  dependencies: any[];
  value: any;
  constructor(robot, scene, name, samplingType) {
    this.robot = robot;
    this.scene = scene;
    this.name = name;
    this.type = samplingType;
    this.dependencies = [];
    this.value = null;
  }

  sample() {
    // Should be overridden by each sensor
    this.value = null;
  }

  read() {
    return this.value;
  }
}
