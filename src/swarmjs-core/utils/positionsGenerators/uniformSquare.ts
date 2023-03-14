// Module to generate random initial positions for robots and pucks
// TODO: replace with a js generator

import { getDistance } from '../geometry';


const positions = [];

const getPos = () => {
  if (positions.length === 0) {
    throw new Error('No positions available!');
  }
  return positions.pop();
};


export default function uniformSquare(
  numOfPos, radius, envWidth, envHeight, staticObjects
) {

  const positionsCount = parseInt(numOfPos, 10);

  const root = Math.sqrt(positionsCount)
  if(!Number.isInteger(root)) {
    throw new Error('Number of positions must be a perfect square');
  }

  const xDist = envWidth / (root +1);
  const yDist = envHeight / (root +1);

  for (let i = 1; i <= root; i++) {
    for (let j = 1; j <= root; j++) {
      const newX = xDist * i
      const newY = yDist * j
      const newPos = { x: newX, y: newY }
      const doesNotCollideWithRobots = positions
        .findIndex((x) => getDistance(x, newPos) < radius * 2.2) === -1;
      const doesNotCollideWithObstacles = staticObjects
        .reduce((acc, cur) => !cur.containsPoint(newPos)
          && cur.getDistanceToBorder(newPos) > radius && acc, true);

      if (doesNotCollideWithRobots && doesNotCollideWithObstacles) {
        positions.push(newPos);
      }
    }
  }

  return getPos;
}
