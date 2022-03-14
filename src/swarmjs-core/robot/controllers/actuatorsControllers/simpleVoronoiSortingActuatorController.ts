/* eslint-disable no-unused-vars */

import VoronoiSensor from "../../sensors/voronoi/VoronoiSensor";
import { polygonContains } from 'd3-polygon';
import Puck from "../../../puck";

/* eslint-disable prefer-const */
export default function simpleVoronoiSortingActuatorController(robot, params) {
  return (sensors, actuators) => {    
    const closestPuck = sensors.closestPuckToGrabber;
    const grappedPuck = actuators.grabber.getState() as Puck;
    const voronoiCell = sensors[VoronoiSensor.name]
    const position = sensors.position

    if(grappedPuck) {
      //If either the puck or the robot is outside the vornoi cell, drop the puck
      if(!polygonContains(voronoiCell, [grappedPuck.position.x, grappedPuck.position.y]) || !polygonContains(voronoiCell, [position.x, position.y])) {
        actuators.grabber.deactivate();
      }

      //If the puck is in the goal, drop the puck
      if (grappedPuck.reachedGoal()) {
        actuators.grabber.deactivate();
      }
    } else {
      //If not holding puck, pickup closest puck if not in goal and in cell
      if(closestPuck && !closestPuck.reachedGoal() && voronoiCell?.length && polygonContains(voronoiCell, [closestPuck.position.x, closestPuck.position.y])) {
        actuators.grabber.activate(closestPuck);
      }
    }
  };
}
