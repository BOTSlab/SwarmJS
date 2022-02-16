/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
export default function simpleSortingActuatorController(robot, params) {
  return (sensors, actuators) => {
    const curGoalArea = sensors.puckGoalAreaSensor;
    const closestPuck = sensors.closestPuckToGrabber;
    const grappedPuck = actuators.grabber.getState();

    if (curGoalArea) {
      if (grappedPuck && curGoalArea === grappedPuck.color) {
        actuators.grabber.deactivate();
      }
    }

    if (!grappedPuck && closestPuck && curGoalArea !== closestPuck.color) {
      actuators.grabber.activate();
    }
  };
}
