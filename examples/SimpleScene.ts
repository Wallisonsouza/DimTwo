import { GameEntity } from "@engine/core/base/GameEntity";
import { Vec2 } from "@engine/core/math/Vec2";
import { Vec3 } from "@engine/core/math/Vec3";
import { Scene } from "@engine/core/scene/scene";
import { BoxCollider2D } from "@engine/modules/2D/BoxCollider2D";
import { RigidBody2D } from "@engine/modules/2D/RigidBody2D";
import { SpriteRender2D } from "@engine/modules/2D/SpriteRender2D";
import { Material } from "@engine/Rendering/Material";
import { Mesh } from "@engine/Rendering/Mesh";
import { configureCamera } from "@game/entities/CameraEntity";
import { configurePlayer } from "@game/entities/PlayerEntity";


export function createAsteroidMesh(name: string, vertexCount = 8, radius = 1): Mesh {
  const vertices: Vec3[] = [];
  const uvs: Vec2[] = [];
  const indices: number[] = [];

  // adiciona o centro do asteroide
  vertices.push(new Vec3(0, 0, 0));
  uvs.push(new Vec2(0.5, 0.5));

  for (let i = 0; i < vertexCount; i++) {
    const angle = (i / vertexCount) * Math.PI * 2;
    // variação aleatória do raio
    const r = radius * (0.8 + Math.random() * 0.4);
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    vertices.push(new Vec3(x, y, 0));

    // UV simples
    uvs.push(new Vec2((x / radius + 1) / 2, (y / radius + 1) / 2));
  }

  // criar índices para formar triângulos do centro para as bordas
  for (let i = 1; i <= vertexCount; i++) {
    const next = i < vertexCount ? i + 1 : 1;
    indices.push(0, i, next);
  }

  // normais 2D para cima
  const normals = vertices.map(() => new Vec3(0, 0, 1));

  return new Mesh(name, vertices, indices, normals, uvs);
}



export function configureAsteroid(scene: Scene, entity: GameEntity) {

  entity.transform.scale.setFromNumber(0.2, 0.2, 0);

  const baseMesh = createAsteroidMesh(entity.name);
  if (!baseMesh) return;


  const spriteRender = new SpriteRender2D({
    mesh: baseMesh,
    layer: 0,
    material: Material.get("asteroid"),
  });

  const rigidBody = new RigidBody2D({
    useGravity: false,


  });


  const boxCollider = new BoxCollider2D();

  scene.addComponent(entity, spriteRender);
  scene.addComponent(entity, rigidBody);
  scene.addComponent(entity, boxCollider);

}
















export class SimpleScene extends Scene {
  constructor() {
    super("SimpleScene");



    const camera = new GameEntity({ name: "Camera", tag: "MainCamera" });

    this.addEntity(camera);
    configureCamera(this, camera);



    const planet = new GameEntity({ name: "Player", tag: "Player" });
    this.addEntity(planet);
    configurePlayer(this, planet);











    const maxObjects = 1000;

    for (let i = 0; i < maxObjects; i++) {
      const object = new GameEntity({ name: `Asteroid_${i}`, tag: "Asteroid" });
      this.addEntity(object);


      configureAsteroid(this, object)
    }

  }
}