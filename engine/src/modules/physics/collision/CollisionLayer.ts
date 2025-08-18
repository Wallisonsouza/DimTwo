export const CollisionLayer = {
    DEFAULT: 0,
    TREE: 1,
    PLAYER: 2,
    ENEMY: 3,
   
} as const;

export type CollisionMask = typeof CollisionLayer[keyof typeof CollisionLayer];