import { EventEmitter, type EventCallback } from "../events/EventEmitter";

export type TimeEvent = 'start' | 'stop' | 'update' | 'fixedUpdate' | 'lateUpdate' | 'render';

export class Time {
  private static events = new EventEmitter();

  public static accumulator = 0;
  private static isRunning = false;
  private static isPaused = false;
  private static readonly maxFrameSkip = 5;

  private static frameCount = 0;
  private static lastFpsTime = 0;
  private static animationFrameId?: number;
  private static initialized = false;

  private static _deltaTime = 0;
  public static get deltaTime() {
    return this._deltaTime;
  }

  private static _time = 0;
  public static readonly fixedDeltaTime = 1 / 50;

  public static timeScale = 1;
  public static realtimeSinceStartup = 0;
  public static fps = 0;

  public static on(event: TimeEvent, callback: EventCallback) {
    this.events.on(event, callback);
  }

  public static off(event: TimeEvent, callback: EventCallback) {
    this.events.off(event, callback);
  }

  public static offAll(event?: TimeEvent) {
    if (event) {
      this.events.clear(event);
    } else {
      this.events.clearAll();
    }
  }

  public static play(): void {
    if (this.isRunning || this.initialized) return;

    this.events.emit('start');

    this.initialized = true;
    this.isRunning = true;
    this.isPaused = false;
    this._time = performance.now();
    this.lastFpsTime = this._time;

    this.loop();
  }

  public static stop(): void {
    this.isRunning = false;
    this.initialized = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }

    this.events.emit("stop");
  }

  public static pause(): void {
    this.isPaused = true;
  }

  public static resume(): void {
    if (!this.isRunning || !this.isPaused) return;
    this.isPaused = false;
    this._time = performance.now();
    this.loop();
  }

  public static step(): void {
    if (!this.isPaused) return;
    this.processFrame();
  }

  private static loop(): void {
    if (!this.isRunning) return;

    if (!this.isPaused) {
      this.processFrame();
    }

    this.animationFrameId = requestAnimationFrame(() => this.loop());
  }

  private static processFrame(): void {
    const now = performance.now();
    const realDelta = (now - this._time) / 1000;

    this._time = now;
    this._deltaTime = realDelta * this.timeScale;
    this.realtimeSinceStartup += realDelta;

    this.accumulator += this._deltaTime;

    if (this.initialized) {
      // Quantos fixed steps executar
      const steps = Math.min(Math.floor(this.accumulator / this.fixedDeltaTime), this.maxFrameSkip);

      for (let i = 0; i < steps; i++) {
        this.events.emit('fixedUpdate');
      }

      this.accumulator -= steps * this.fixedDeltaTime;

      this.events.emit('update');
      this.events.emit('lateUpdate');
      this.events.emit('render');
    }

    this.calculateFPS(now);
  }


  private static calculateFPS(now: number): void {
    this.frameCount++;
    if (now - this.lastFpsTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastFpsTime = now;
    }
  }
}
