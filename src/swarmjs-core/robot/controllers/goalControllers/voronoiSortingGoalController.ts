import {
  angleBetweenThreePointsDeg,
  closestPointInLineToPoint,
  closestPointInLineSegToPoint,
  getDistance,
  translatePointInDirection,
  shiftPointOfLineSegInDirOfPerpendicularBisector,
  closestPointInPolygonToPoint
} from '../../../utils/geometry';
import VoronoiSensor from '../../sensors/voronoi/VoronoiSensor';

import { polygonContains } from 'd3-polygon';

import * as geometric from 'geometric'
import { Delaunay } from 'd3-delaunay';
import Puck from '../../../puck';

// Available Options that can be passed to the controller from config
// environmentOrbit: true / false

const defaultOptions = {
  environmentOrbit: false
};

export default function voronoiSortingGoalController(robot, params) {
  const algorithmOptions = { ...defaultOptions, ...params };
  const { radius } = robot;

  let lastPosition;
  let durationAtCurPosition = 0;
  let stuck = false;
  let avoidingStuckDuration = 0;

  const MIN_STUCK_MANEUVER_DURATION = 30;
  const SAME_POSITION_DISTANCE_THRESHOLD = radius / 50;
  const STUCK_DURATION_THRESHOLD = 30;

  function goalFromPoint(point: Delaunay.Point): {x: number, y:number} {
    return {x: point[0], y: point[1]};
  }

  function getRandPointInPolygon(polygon){

    let point: [number, number];

    do {
      const bounds = geometric.polygonBounds(polygon)
      const xMin = bounds[0][0]
      const xMax = bounds[1][0]
      const yMin = bounds[0][1]
      const yMax = bounds[1][1]

      const randomX = Math.random() * (xMax - xMin) + xMin
      const randomY = Math.random() * (yMax - yMin) + yMin

      point = [randomX, randomY]

    } while (!polygonContains(polygon, point))

    return point;
  }


  function getGoalFromPuck(puck) {
    return puck.groupGoal;
  }

  function selectClosestPuckInCell(sensors): Puck {
    //Only act on pucks in Voronoi Cell that haven't yet reached the goal
    return sensors.nearbyPucks
      .filter((p) => {
        if (!p.reachedGoal()) {
          return polygonContains(sensors[VoronoiSensor.name], [p.position.x, p.position.y]);
        }
        return false;
      })
      //Grab the closest one
      .sort((a, b) => getDistance(sensors.position, a.position) - getDistance(sensors.position, b.position))[0]


  }

  function checkIfStuck(oldGoal, sensors): {x:number, y:number} {
     // If robot was stuck and is still recovering, do not change robot goal
    if (stuck && avoidingStuckDuration <= MIN_STUCK_MANEUVER_DURATION) {
      avoidingStuckDuration += 1;
      return oldGoal;
    }
    // Else, consider maneuver over, reset counters
    stuck = false;
    avoidingStuckDuration = 0;

    // Calc distance to last recorded position
    const distToLastPos = lastPosition
      ? getDistance(sensors.position, lastPosition)
      : null;

    // If robot is close enough to be considered at same position
    if (distToLastPos != null && distToLastPos <= SAME_POSITION_DISTANCE_THRESHOLD) {
      // Do not change recorded position, increment stuck timer by 1
      durationAtCurPosition += 1;
    }

    // Update last position and continue normal operations
    lastPosition = { ...sensors.position };

    // If stuck timer reaches threshold to be considered stuck
    if (durationAtCurPosition >= STUCK_DURATION_THRESHOLD) {
      // Reset stuck timer, set state to stuck, start stuck maneuver timer and start maneuver
      durationAtCurPosition = 0;
      stuck = true;
      avoidingStuckDuration = 0;
      return goalFromPoint(getRandPointInPolygon(sensors[VoronoiSensor.name]));
    }
  }


  return (oldGoal, sensors, actuators) => {
    //If stuck, use goal from checkIfStuck method
    const goalFromStuck = checkIfStuck(oldGoal, sensors);
    if(goalFromStuck) return goalFromStuck;

    //If holding puck it's goal is agents goal
    const heldPuck = actuators.grabber.getState();
    if (heldPuck) {
      this.wasHoldingPuck = true;
      return getGoalFromPuck(heldPuck);
    }

    //If not holding puck, closest puck in cell is goal
    const closestPuck = selectClosestPuckInCell(sensors);
    if(closestPuck && !closestPuck.held) {
      this.wasHoldingPuck = false;
      return closestPuck.position;
    }

    //Set new goal in cell if reached the old goal OR
    // if not holding puck and outside cell (happens when carrying final puck from cell)
    if(sensors.reachedGoal || (!polygonContains(sensors[VoronoiSensor.name], [sensors.position.x, sensors.position.y]) && this.wasHoldingPuck)) {
      this.wasHoldingPuck = false;
      return goalFromPoint(getRandPointInPolygon(sensors[VoronoiSensor.name]));
    }

    //Keep using the oldGoal if not there yet
    return oldGoal; 
  };
}
