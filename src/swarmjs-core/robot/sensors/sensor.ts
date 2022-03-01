import Scene from "../../scene";
import Robot from "../robot";
import { SensorSamplingType } from "./sensorManager";


export interface Sensor<T> {
  sample(tick?: number, force?: boolean): void
  read(): T;
  type: SensorSamplingType;
  name: string
  dependencies: Sensor<unknown>[]
}

export abstract class AbstractSensor<T> implements Sensor<T> {
  protected robot: Robot;
  protected scene: Scene;
  private _name: string;

  private _type: SensorSamplingType;
  public dependencies: Sensor<unknown>[];
  protected value: T;  
  
  protected constructor(robot: Robot, scene: Scene, name: string, samplingType: SensorSamplingType, dependencies = [], initialValue: T = undefined) {
    this.robot = robot;
    this.scene = scene;
    this._name = name;
    this._type = samplingType;
    this.dependencies = dependencies;
    this.value = initialValue;

    // dependencies.forEach(dependency => {
    //   if(!this.robot.sensors[dependency]) {
    //     throw new Error(`Dependency ${dependency} is not registered for sensor ${name}`);
    //   }
    // });
  }

  public get type(): SensorSamplingType {
    return this._type;
  }

  public get name(): string {
    return this._name;
  }

  abstract sample(tick?: number): void

  read() {
    return this.value;
  }
}

export abstract class GlobalSensor<T, S> implements Sensor<Map<T,S>> {

  protected scene: Scene;
  private _name: string;
  private _type: SensorSamplingType;
  public dependencies: Sensor<unknown>[];
  protected value: Map<T,S>;
  private _lastSampledTick: number;

  protected constructor(scene, name, samplingType: SensorSamplingType, dependencies = [], initialValue: Map<T,S> = undefined) {
    this.scene = scene;
    this._name = name;
    this._type = samplingType;
    this.dependencies = dependencies;
    this.value = initialValue;
  }
  
  public get name(): string {
    return this._name;
  }

  public get type(): SensorSamplingType {
    return this._type;
  }

  sample(tick?: number, force = false): void {
    if(!force) {
      if(tick === this._lastSampledTick) return;
  
      if(tick <= this._lastSampledTick) throw new Error(`Trying to sample sensor ${this.name} with tick ${tick} but last sampled tick is ${this._lastSampledTick}`);
    }

    this.value = this.getValues()
  }

  read() { 
    return this.value
  }

  abstract getValues(): Map<T,S>
}
