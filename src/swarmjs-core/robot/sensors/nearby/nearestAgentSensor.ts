import Scene from '../../../scene';
import { AbstractSensor } from '../sensor';
import { SensorSamplingType, AvailableSensors } from '../sensorManager';

const name = 'nearestAgent';

export type Neighbor = {
  id: number,
  distance: number,
  loc: [number,number]
}

const getNearestAgent = (scene: Scene, robotId: number): Neighbor => {

  //find the closest other robot/agent in scene
  const robot = scene.robots[robotId]

  const others = scene.robots.filter((r) => r.id !== robotId)

  const testing = others[0]

  const testing2 = testing.sensors

  const othersWithInfo = others
    .map((r) => {

      const sensors = r.sensors
      return {
        id: r.id,
        distance: robot.getDistanceTo(sensors.position),
        loc: sensors.position
      }
    })


    const nearest = othersWithInfo.reduce((prev, curr) => {
      return prev.distance < curr.distance ? prev : curr
    })

  return nearest
}

class NearestAgentSensor extends AbstractSensor<Neighbor | null> {
  constructor(robot, scene) {
    super(robot, scene, name, SensorSamplingType.onUpdate,[AvailableSensors.position] , null);
  }

  sample() {
    this.value = getNearestAgent(this.scene, this.robot.id);
  }
}

export default {
  name,
  Sensor: NearestAgentSensor
};
