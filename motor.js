const {Board, Stepper} = require("johnny-five");
const board = new Board();

board.on("ready", () => {

  const stepper1 = new Stepper({
    type: Stepper.TYPE.DRIVER,
    stepsPerRev: 200,
    pins: {
      step: 12,
      dir: 11
    }
  });
  const stepper2 = new Stepper({
    type: Stepper.TYPE.DRIVER,
    stepsPerRev: 200,
    pins: {
      step: 9,
      dir: 8
    }
  });

  // Set stepper to 180 RPM, counter-clockwise with acceleration and deceleration
  stepper1.rpm(30).ccw().accel(1600).decel(1600);
  stepper2.rpm(30).ccw().accel(1600).decel(1600);

  stepper1.step({
    steps: 2000,
    direction: Stepper.DIRECTION.CW
  }, () => console.log("Done moving CW1"));

  stepper2.step({
    steps: 2000,
    direction: Stepper.DIRECTION.CW
  }, () => console.log("Done moving CW2"));
    
  



});