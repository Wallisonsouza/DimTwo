import { EventEmitter, type EventCallback } from "../events/EventEmitter";

export type TimeEvent = 'start' | 'stop' | 'update' | 'fixedUpdate' | 'lateUpdate' | 'render';

export default class Time {
  private events = new EventEmitter();

  public accumulator = 0;
  private isRunning = false;
  private isPaused = false;
  private readonly maxFrameSkip = 5;

  private frameCount = 0;
  private lastFpsTime = 0;
  private animationFrameId?: number;
  private initialized = false;

  private _deltaTime = 0;
  public get deltaTime() {
    return this._deltaTime;
  }

  private _time = 0;
  public readonly fixedDeltaTime = 1 / 50;

  public timeScale = 1;
  public realtimeSinceStartup = 0;
  public fps = 0;

  constructor() { }

  public on(event: TimeEvent, callback: EventCallback) {
    this.events.on(event, callback);
  }

  public off(event: TimeEvent, callback: EventCallback) {
    this.events.off(event, callback);
  }

  public offAll(event?: TimeEvent) {
    if (event) {
      this.events.clear(event);
    } else {
      this.events.clearAll();
    }
  }

  public play(): void {
    if (this.isRunning || this.initialized) return;

    this.events.emit('start');

    this.initialized = true;
    this.isRunning = true;
    this.isPaused = false;
    this._time = performance.now();
    this.lastFpsTime = this._time;

    this.loop();
  }

  public stop(): void {
    this.isRunning = false;
    this.initialized = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }

    this.events.emit("stop");
  }

  public pause(): void {
    this.isPaused = true;
  }

  public resume(): void {
    if (!this.isRunning || !this.isPaused) return;
    this.isPaused = false;
    this._time = performance.now();
    this.loop();
  }

  public step(): void {
    if (!this.isPaused) return;
    this.processFrame();
  }

  private loop(): void {
    if (!this.isRunning) return;

    if (!this.isPaused) {
      this.processFrame();
    }

    this.animationFrameId = requestAnimationFrame(() => this.loop());
  }

  private processFrame(): void {
    const now = performance.now();
    const realDelta = (now - this._time) / 1000;

    this._time = now;
    this._deltaTime = realDelta * this.timeScale;
    this.realtimeSinceStartup += realDelta;

    this.accumulator += this._deltaTime;
    let steps = 0;

    if (this.initialized) {
     /*  while (this.accumulator >= this.fixedDeltaTime && steps < this.maxFrameSkip) {
        this.events.emit('fixedUpdate');
        this.accumulator -= this.fixedDeltaTime;
        steps++;
      }
 */
      this.events.emit('update');
      this.events.emit('lateUpdate');
      this.events.emit('render');
    }

    this.calculateFPS(now);
  }

  private calculateFPS(now: number): void {
    this.frameCount++;
    if (now - this.lastFpsTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastFpsTime = now;
    }
  }
}
