import { AbstractSensor } from '../sensor';
import { sensorSamplingTypes, AvailableSensors } from '../sensorManager';
import generateStaticObject from '../../../staticObjects/staticObjectFactory';

const name = 'nearbyObstacles';

const getNearbyEnvObstacles = (pos, objects, detectionRadius) => {
  const staticObstacles = [...objects.filter(
    (obj) => obj.getDistanceToBorder(pos) < detectionRadius
  )];

  return staticObstacles;
};

type Options = {
  detectionRadius?: number;
};

class NearbyObstaclesSensor extends AbstractSensor<any[]> {
  DETECTION_RADIUS: number;
  constructor(robot, scene, options: Options = {}) {
    const dependencies = [
      AvailableSensors.position,
      AvailableSensors.nearbyPucks
    ];
    super(robot, scene, name, sensorSamplingTypes.onUpdate, dependencies, []);
    
    this.DETECTION_RADIUS = options.detectionRadius == null ? robot.radius * 10 : options.detectionRadius;
  }

  sample() {
    // Nearby obstacles from the environment (static objects)
    const staticObstacles = getNearbyEnvObstacles(
      this.robot.sensors.position,
      this.scene.staticObjects,
      this.DETECTION_RADIUS
    );

    // Nearby obstacles from pucks that reached their goals
    const nearbyPucks = this.robot?.sensors?.nearbyPucks || [];
    const nearbyPucksInsideGoals = nearbyPucks.filter((p) => p.deepInGoal());

    const pucksObstacles = nearbyPucksInsideGoals.map((puck) => {
      const staticObstacleDefinition = puck.generateStaticObjectDefinition();
      return generateStaticObject(staticObstacleDefinition, this.scene, false);
    });

    this.value = [...staticObstacles, ...pucksObstacles];
  }
}

export default {
  name,
  Sensor: NearbyObstaclesSensor
};
