import { Vec2 } from "../core/math/Vec2";

export const EngineConfig = {
  PHYSICS: {
    enabled: true,
    gravity: new Vec2(0, 9.81),
    fixedTimeStep: 1 / 60,
    allowSleep: true,
    maxSubSteps: 5,
    debug: false,
  }
};
