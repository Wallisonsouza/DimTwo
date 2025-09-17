import { Vec2 } from "@engine/core/math/Vec2";
import { SAT } from "./SAT";

export interface Contact2D {
  point: Vec2;
  normal: Vec2;
  distance: Vec2;
}

export class OBB2D {
  public readonly vertices: Vec2[] = [new Vec2(), new Vec2(), new Vec2(), new Vec2()];
  public readonly axes: Vec2[] = [new Vec2(), new Vec2()];

  public center: Vec2 = new Vec2();
  public size: Vec2 = new Vec2();
  public rotation: number = 0;

  private dirty: boolean = true;

  // Caches internos
  private readonly _projThis: Vec2 = new Vec2();
  private readonly _projOther: Vec2 = new Vec2();
  private readonly _centerDiff: Vec2 = new Vec2();

  private _cos: number = 1;
  private _sin: number = 0;
  private _lastRotation: number = 0;

  markDirty() { this.dirty = true; }

  update() {
    if (!this.dirty) return;

    if (this.rotation !== this._lastRotation) {
      this._cos = Math.cos(this.rotation);
      this._sin = Math.sin(this.rotation);
      this._lastRotation = this.rotation;
    }

    const hw = this.size.x * 0.5;
    const hh = this.size.y * 0.5;
    const cx = this.center.x;
    const cy = this.center.y;

    this.vertices[0].set(cx + (-hw * this._cos - -hh * this._sin), cy + (-hw * this._sin + -hh * this._cos));
    this.vertices[1].set(cx + (hw * this._cos - -hh * this._sin), cy + (hw * this._sin + -hh * this._cos));
    this.vertices[2].set(cx + (hw * this._cos - hh * this._sin), cy + (hw * this._sin + hh * this._cos));
    this.vertices[3].set(cx + (-hw * this._cos - hh * this._sin), cy + (-hw * this._sin + hh * this._cos));

    this.axes[0].copy(Vec2.sub(this.vertices[1], this.vertices[0], this.axes[0])).normalizeSelf();
    this.axes[1].copy(Vec2.sub(this.vertices[3], this.vertices[0], this.axes[1])).normalizeSelf();

    this.dirty = false;
  }
  private _testAxis(axis: Vec2, other: OBB2D, mtvNormal: Vec2, minPenetration: { value: number }): boolean {

    SAT.project(this.vertices, axis, this._projThis);
    SAT.project(other.vertices, axis, this._projOther);

    const overlap = Math.min(this._projThis.y, this._projOther.y) - Math.max(this._projThis.x, this._projOther.x);
    if (overlap <= 0) return false;

    if (overlap < minPenetration.value) {
      minPenetration.value = overlap;
      mtvNormal.copy(axis);
    }
    return true;
  }


  intersectsFull(other: OBB2D): Contact2D[] | null {
    this.update();
    other.update();

    const mtvNormal = new Vec2();
    const minPenetration = { value: Number.POSITIVE_INFINITY };
    const axesToTest = [this.axes[0], this.axes[1], other.axes[0], other.axes[1]];

    for (const axis of axesToTest) {
      if (!this._testAxis(axis, other, mtvNormal, minPenetration)) return null;
    }

    // Normal aponta de this → other
    this._centerDiff.copy(other.center).subInPlace(this.center);
    if (Vec2.dot(this._centerDiff, mtvNormal) < 0) mtvNormal.negativeInPlace();

    /* const mtvVec = Vec2.scale(mtvNormal, minPenetration.value, new Vec2());

    // Detecta contatos
   const contacts: Contact2D[] = [];

    // 1) Vértices de this dentro de other
   for (const v of this.vertices) {
     if (other.containsPoint(v)) {
       contacts.push({ point: v.clone(), normal: mtvNormal.clone(), distance: mtvVec.clone() });
     }
   }

   // 2) Vértices de other dentro de this
   for (const v of other.vertices) {
     if (this.containsPoint(v)) {
       contacts.push({ point: v.clone(), normal: mtvNormal.clone(), distance: mtvVec.clone() });
     }
   }
  
       // 3) Interseções de arestas
       for (let i = 0; i < 4; i++) {
         const a1 = this.vertices[i];
         const a2 = this.vertices[(i + 1) % 4];
         for (let j = 0; j < 4; j++) {
           const b1 = other.vertices[j];
           const b2 = other.vertices[(j + 1) % 4];
   
           const intersection = OBB2D.segmentIntersection(a1, a2, b1, b2);
           if (intersection) {
             contacts.push({ point: intersection, normal: mtvNormal.clone(), distance: mtvVec.clone() });
           }
         }
       } 

    return contacts.length > 0 ? contacts : null;*/
  }


  // Função auxiliar
  static segmentIntersection(p1: Vec2, p2: Vec2, q1: Vec2, q2: Vec2): Vec2 | null {
    const r = Vec2.sub(p2, p1, new Vec2());
    const s = Vec2.sub(q2, q1, new Vec2());
    const rxs = r.x * s.y - r.y * s.x;
    const q_p = Vec2.sub(q1, p1, new Vec2());
    const qpxr = q_p.x * r.y - q_p.y * r.x;

    if (rxs === 0 && qpxr === 0) return null; // colineares
    if (rxs === 0 && qpxr !== 0) return null; // paralelos

    const t = (q_p.x * s.y - q_p.y * s.x) / rxs;
    const u = (q_p.x * r.y - q_p.y * r.x) / rxs;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return new Vec2(p1.x + t * r.x, p1.y + t * r.y);
    }
    return null;
  }

  public updateCenter(offset: Vec2) {
    this.center.set(this.center.x + offset.x, this.center.y + offset.y);
  }

  containsPoint(point: Vec2): boolean {
    this.update();
    for (let i = 0; i < 2; i++) {
      const axis = this.axes[i];
      this.project(axis, this._projThis);
      const proj = Vec2.dot(point, axis);
      if (proj < this._projThis.x || proj > this._projThis.y) return false;
    }
    return true;
  }

  getVertices(): Vec2[] { this.update(); return this.vertices; }
  getAxes(): Vec2[] { this.update(); return this.axes; }
}

