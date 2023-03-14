// Module to generate random initial positions for robots and pucks
// TODO: replace with a js generator

import { getDistance } from '../geometry';

// const positions = [];

const puckPositions = [];
const robotPositions = [];

// const getPos = () => {
//   if (positions.length === 0) {
//     throw new Error('No positions available!');
//   }
//   return positions.pop();
// };


const getPuckPosition = () => {
  if (puckPositions.length === 0) {
    throw new Error('No positions available!');
  }
  return puckPositions.pop();
}

const getRobotPosition = () => {
  if (robotPositions.length === 0) {
    throw new Error('No positions available!');
  }
  return robotPositions.pop();
}

export default function uniformSquareRobotsAndPucksSep(
  numOfRobots, numOfPucks, radius, envWidth, envHeight, staticObjects
) {

  const puckPositionsCount = parseInt(numOfPucks, 10);
  const robotPositionsCount = parseInt(numOfRobots, 10);

  const puckRoot = Math.sqrt(puckPositionsCount)
  if(!Number.isInteger(puckRoot)) {
    throw new Error('Number of puck positions must be a perfect square');
  }

  const robotRoot = Math.sqrt(robotPositionsCount)
  if(!Number.isInteger(robotRoot)) {
    throw new Error('Number of robot positions must be a perfect square');
  }

  getSquarePositions(envWidth, robotRoot, envHeight, radius, staticObjects, robotPositions);
  getSquarePositions(envWidth, puckRoot, envHeight, radius, staticObjects, puckPositions);

  return { getRobotPos: getRobotPosition, getPuckPos: getPuckPosition };
}
function getSquarePositions(envWidth: any, rootPositions: number, envHeight: any, radius: any, staticObjects: any, positions: any) {
  const xDist = envWidth / (rootPositions);
  const yDist = envHeight / (rootPositions);

  for (let i = 0; i < rootPositions; i++) {
    for (let j = 0; j < rootPositions; j++) {
      const newX = xDist/2 + (xDist * i);
      const newY = yDist/2 + (yDist * j);
      const newPos = { x: newX, y: newY };
      const doesNotCollideWithRobots = positions
        .findIndex((x) => getDistance(x, newPos) < radius * 2.2) === -1;
        const doesNotCollideWithPucks = positions
        .findIndex((x) => getDistance(x, newPos) < radius * 2.2) === -1;
      const doesNotCollideWithObstacles = staticObjects
        .reduce((acc, cur) => !cur.containsPoint(newPos)
          && cur.getDistanceToBorder(newPos) > radius && acc, true);

      if (doesNotCollideWithRobots && doesNotCollideWithPucks && doesNotCollideWithObstacles) {
        positions.push(newPos);
      }
    }
  }
}
