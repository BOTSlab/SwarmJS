import Scene from '../../../scene';
import { AbstractSensor } from '../sensor';
import { SensorSamplingType, AvailableSensors } from '../sensorManager';
import { normalizeAngle } from '../../../utils/geometry';
import Robot from '../../robot';

const name = 'collisionSensor';

export type Neighbor = {
  id: number,
  distance: number,
  loc: {x: number, y: number}
}


class CollisionSensor extends AbstractSensor<boolean> {
  range: number;
  angle: number;

  
  constructor(robot: Robot, scene: Scene, range = robot.radius*10, angle = Math.PI/2) {
    
    super(robot, scene, name, SensorSamplingType.onUpdate, [
      AvailableSensors.position,
      AvailableSensors.orientation
    ], null);

    this.range = range;
    this.angle = angle
    
  }

  sample() {
    const agents = this.getAgentsWithinRange(this.scene, this.robot.id);
    const within = this.within180degreeArc(this.scene, this.robot.id, agents);
    this.value = within;
  }

  getAgentsWithinRange = (scene: Scene, robotId: number): Neighbor[] => {
  
    //find all other robots/agents in scene within range
    const robot = scene.robots[robotId]

    const others = scene.robots.filter((r) => r.id !== robotId)

    return others
      .map((r) => {
          
          const sensors = r.sensors
          return {
            id: r.id,
            distance: robot.getDistanceTo(sensors.position),
            loc: sensors.position
          }
        }
      ).filter((r) => r.distance < this.range)
  }

  within180degreeArc = (scene: Scene, robotId: number, neighbors: Neighbor[]): boolean => {
    //check if any of the neighbors are within 180 degree arc on the front of the robot

    const robot = scene.robots[robotId]

    const orientation = robot.sensors.orientation

    //get angle in radians to each neighbor and check if it is within PI/2 radians either side of orientation where both are normalized to be between 0 and 2PI
    const within = neighbors.some((n) => {

      const nx = n.loc.x
      const ny = n.loc.y
      const ry = robot.sensors.position.y
      const rx = robot.sensors.position.x

      const angle = Math.atan2(ny - ry, nx - rx)
      const angle2 = Math.atan2(ry - ny, rx - nx)


      const normalizedAngle = normalizeAngle(angle)


      // const angle = Math.atan2(n.loc[1] - robot.sensors.position[1], n.loc[0] - robot.sensors.position[0])
      const angleDiff = this.angleDifference(orientation, normalizedAngle)
      return angleDiff < this.angle/2
    })

    //find magnitude of angle between two angles, accounting for the fact that they are normalized to be between 0 and 2PI
    // const angleDiff = (orientation - normalizedAngle + Math.PI) % (2 * Math.PI) - Math.PI

    return within
  }

  angleDifference = (angle1: number, angle2: number): number => {
    const absDiff = Math.abs(angle1 - angle2);
    
    if (absDiff > Math.PI) {
        let shortestAngle = 2 * Math.PI - absDiff;
        
        if (shortestAngle > Math.PI) {
            shortestAngle = 2 * Math.PI - shortestAngle;
        }
        
        return shortestAngle;
    }
    
    return absDiff;
  }
}

export default {
  name,
  Sensor: CollisionSensor
};
  