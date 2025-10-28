import { Component } from "../base/Component";
import { GameEntity } from "../base/GameEntity";
import { ComponentManager } from "../managers/ComponentManager";
import { EntityManager } from "../managers/EntityManager";
import { SceneNotFoundException } from "@engine/exception/SceneNotFoundException";

export class Scene {

  public name: string;
  public components: ComponentManager = new ComponentManager();
  public entities: EntityManager = new EntityManager();


  private static scenes: Map<string, Scene> = new Map();
  private static _internalScene: Scene | null = null;

  public static addScene(scene: Scene): void {
    this.scenes.set(scene.name, scene);
  }

  public static getScene(name: string) {
    return this.scenes.get(name) ?? null;
  }

  public static getLoadedScene(): Scene {
    if (!this._internalScene) {
      throw new SceneNotFoundException("Nenhuma cena está ativa na engine");
    }
    return this._internalScene;
  }


  static loadScene(name: string) {
    const scene = Scene.getScene(name);
    if (!scene) {
      throw new SceneNotFoundException(`[SceneManager.loadScene] Falha ao carregar a cena "${name}". Cena não encontrada.`);
    }

    this._internalScene = scene;
  }

  constructor(name: string) {
    this.name = name;
  }

  public addEntity(entity: GameEntity) {
    this.entities.add(entity);
  }

  public addComponent(entity: GameEntity, component: Component) {
    this.components.addComponent(entity, component);
  }



  public clear(): void {
    this.components.clear();
    this.entities.clear();
  }
}