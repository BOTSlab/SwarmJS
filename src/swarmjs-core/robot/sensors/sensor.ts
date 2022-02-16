import Scene from "../../scene";
import Robot from "../robot";


export interface Sensor<T> {
  sample(): void;
  read(): T;
}

export abstract class AbstractSensor<T> implements Sensor<T> {
  protected robot: Robot;
  protected scene: Scene;
  name: string;
  private type: any;
  private dependencies: Sensor<any>[];
  protected value: T;  
  
  protected constructor(robot, scene, name, samplingType, dependencies = [], initialValue: T = undefined) {
    this.robot = robot;
    this.scene = scene;
    this.name = name;
    this.type = samplingType;
    this.dependencies = dependencies;
    this.value = initialValue;

    // dependencies.forEach(dependency => {
    //   if(!this.robot.sensors[dependency]) {
    //     throw new Error(`Dependency ${dependency} is not registered for sensor ${name}`);
    //   }
    // });
  }

  sample(): void {
    // Must be overridden
  }

  read() {
    return this.value;
  }
}
