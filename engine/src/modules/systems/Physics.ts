import { CollisionMatrix } from "../physics/collision/CollisionMatrix";
export class Physics {
    public static readonly collisionMatrix: CollisionMatrix = new CollisionMatrix(32);
}