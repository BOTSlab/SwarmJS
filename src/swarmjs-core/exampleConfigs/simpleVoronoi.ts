import {
  AvailableActuators,
  AvailableSensors,
  PositionsGenerators,
  PerformanceTrakers,
  Controllers
} from '..';
import Robot from '../robot/robot';

type envConfig = { width: number, height: number, speed: number };
type controllerConfig = (robot: Robot, params: any) => (goal: any, sensros: any, actuators: any) => any

type paramsControllerConfig = {controller: controllerConfig, params: Record<string, unknown> | null}

type controllersConfig = {
  actuators: controllerConfig,
  goal: controllerConfig,
  waypoint: controllerConfig,
  velocity: paramsControllerConfig}
type robotConfig = { count: number, radius: number, controllers: controllersConfig, sensors: any[], actuators: any[], useVoronoiDiagram: boolean };

type puckGroupConfig = { id: number, count: number, radius: number, goal: { x: number, y: number }, goalRadius: number, color: string};
type puckConfig = { groups: puckGroupConfig[], useGlobalPuckMaps: boolean };


type rectangleConfig = { type: 'rectangle', center: { x: number, y: number}, width: number, height: number};
type circleConfig = { type: 'circle', center: { x: number, y: number}, radius: number, skipOrbit: boolean};

type objectsConfig =  (rectangleConfig | circleConfig)[]


type simConfig2 = {
  env: envConfig,
  robots: robotConfig,
  pucks: puckConfig,
  objects: objectsConfig,
  positionsGenerator: (numOfRobots: any, numOfPucks: any, radius: any, envWidth: any, envHeight: any, staticObjects: any) => { getRobotPos: () => any; getPuckPos: () => any; }
};



const simConfig: simConfig2 = {
  env: {
    width: 800,
    height: 800,
    speed: 15
  },
  robots: { 
    count: 9,
    radius: 7,
    controllers: {
      actuators: Controllers.actuators.simpleVoronoiSortingActuatorController,
      goal: Controllers.goal.voronoiSortingGoalController,
      waypoint: Controllers.waypoint.dummyWaypointController,
      // velocity: Controllers.velocity.omniDirVelocityController
      velocity: {
        controller: Controllers.velocity.diffVelocityController,
        params: { angularVelocityScale: 0.01 }
      }
    },
    sensors: Object.values(AvailableSensors),
    actuators: Object.values(AvailableActuators),
    useVoronoiDiagram: true
  },
  pucks: {
    groups: [
      {
        id: 0,
        count: 50,
        radius: 10,
        goal: { x: 400, y: 400 },
        goalRadius: 7 * 12,
        color: 'red'
      }
      // ,
      // {
      //   id: 1,
      //   count: 10,
      //   radius: 10,
      //   goal: { x: 650, y: 375 },
      //   goalRadius: 7 * 12,
      //   color: 'blue'
      // }
      // {
      //   id: 2,
      //   count: 20,
      //   radius: 10,
      //   goal: { x: 200, y: 150 },
      //   goalRadius: 7 * 12,
      //   color: 'green'
      // },
      // {
      //   id: 3,
      //   count: 20,
      //   radius: 10,
      //   goal: { x: 600, y: 600 },
      //   goalRadius: 7 * 12,
      //   color: 'orange'
      // }
    ],
    useGlobalPuckMaps: false
  },
  objects: [],
  // positionsGenerator: PositionsGenerators.uniformSquareRobotsAndPucksSep
  positionsGenerator: PositionsGenerators.randomCollisionFree
};

const benchmarkConfig = {
  simConfigs: [{
    env: {
      width: 800,
      height: 800,
      speed: 15
    },
    robots: { 
      count: 9,
      radius: 7,
      controllers: {
        actuators: Controllers.actuators.simpleVoronoiSortingActuatorController,
        goal: Controllers.goal.voronoiSortingGoalController,
        waypoint: Controllers.waypoint.dummyWaypointController,
        // velocity: Controllers.velocity.omniDirVelocityController
        velocity: {
          controller: Controllers.velocity.diffVelocityController,
          params: { angularVelocityScale: 0.01 }
        }
      },
      sensors: Object.values(AvailableSensors),
      actuators: Object.values(AvailableActuators),
      useVoronoiDiagram: true
    },
    pucks: {
      groups: [
        {
          id: 0,
          count: 49,
          radius: 10,
          goal: { x: 400, y: 350 },
          goalRadius: 7 * 12,
          color: 'red'
        }
        // ,
        // {
        //   id: 1,
        //   count: 10,
        //   radius: 10,
        //   goal: { x: 650, y: 375 },
        //   goalRadius: 7 * 12,
        //   color: 'blue'
        // }
        // {
        //   id: 2,
        //   count: 20,
        //   radius: 10,
        //   goal: { x: 200, y: 150 },
        //   goalRadius: 7 * 12,
        //   color: 'green'
        // },
        // {
        //   id: 3,
        //   count: 20,
        //   radius: 10,
        //   goal: { x: 600, y: 600 },
        //   goalRadius: 7 * 12,
        //   color: 'orange'
        // }
      ],
      useGlobalPuckMaps: false
    },
    objects: [],
    positionsGenerator: PositionsGenerators.uniformSquareRobotsAndPucksSep
  }
    // {
    //   name: '5 Robots',
    //   simConfig: {
    //     env: {
    //       speed: 50
    //     },
    //     robots: {
    //       count: 5
    //     }
    //   }
    // },
    // {
    //   name: '20 Robots',
    //   simConfig: {
    //     env: {
    //       speed: 50
    //     }
    //   }
    // }
  ],
  trackers: [
    PerformanceTrakers.RobotToGoalDistanceTracker,
    PerformanceTrakers.PucksOutsideGoalTracker,
    PerformanceTrakers.MinRobotRobotDistanceTracker
  ],
  maxTimeStep: 50000,
  timeStep: 1000
};

export default {
  simConfig,
  benchmarkConfig
};
