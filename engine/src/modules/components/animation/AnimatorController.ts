import type { AnimatorState } from "./AnimatorState";

export interface AnimatorController {
  name: string;
  currentState: string | null;
  states: Record<string, AnimatorState>;
  syncCollider?: boolean;
}
