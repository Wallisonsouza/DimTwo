#version 300 es
precision highp float;
precision highp int;

in vec2 ENGINE_UV;
out vec4 outColor;

uniform float ENGINE_TIME;
uniform vec2 ENGINE_SCREEN;

// --- RNG ---
struct RNG { uint state; };
void rngSeed(inout RNG rng, uint seed) { rng.state = seed; }
float rngNext(inout RNG rng) {
  rng.state += 0x6D2B79F5u;
  uint z = rng.state;
  z = (z ^ (z >> 15u)) * (z | 1u);
  z ^= z + (z ^ (z >> 7u)) * (z | 61u);
  z ^= z >> 14u;
  return float(z) / 4294967296.0;
}

// --- Constantes ---
const float PIXEL_SIZE = 1.0 / 100.0;
const float ROTATION_SPEED = -0.1;
const vec3 LIGHT_DIR = normalize(vec3(-0.4, 0.3, 1.0));

const uint SEED = 3932543615u;
const int TERRAIN_OCTAVES = 8;
const float TERRAIN_PERSISTENCE = 0.5;
const float TERRAIN_LACUNARITY = 2.1;
const float NOISE_SCALE = 0.6;

// --- Gradientes ---
const vec3 grad3[12] = vec3[](
  vec3(1,1,0), vec3(-1,1,0), vec3(1,-1,0), vec3(-1,-1,0),
  vec3(1,0,1), vec3(-1,0,1), vec3(1,0,-1), vec3(-1,0,-1),
  vec3(0,1,1), vec3(0,-1,1), vec3(0,1,-1), vec3(0,-1,-1)
);

// --- Hash ---
int hash3D(ivec3 p) {
  uint mixed = uint(p.x * 73856093 ^ p.y * 19349663 ^ p.z * 83492791) + SEED;
  RNG rng; rngSeed(rng, mixed);
  return int(floor(rngNext(rng) * 256.0)) & 255;
}

// --- Simplex Noise ---
float simplex3D(vec3 v) {
  const float F3 = 1.0/3.0, G3 = 1.0/6.0;
  float s = (v.x+v.y+v.z)*F3;
  vec3 i = floor(v+s);
  float t = (i.x+i.y+i.z)*G3;
  vec3 X0 = i-t;
  vec3 x0 = v-X0;

  vec3 i1, i2;
  if (x0.x >= x0.y) {
    if (x0.y >= x0.z) { i1=vec3(1,0,0); i2=vec3(1,1,0); }
    else if (x0.x >= x0.z) { i1=vec3(1,0,0); i2=vec3(1,0,1); }
    else { i1=vec3(0,0,1); i2=vec3(1,0,1); }
  } else {
    if (x0.y < x0.z) { i1=vec3(0,0,1); i2=vec3(0,1,1); }
    else if (x0.x < x0.z) { i1=vec3(0,1,0); i2=vec3(0,1,1); }
    else { i1=vec3(0,1,0); i2=vec3(1,1,0); }
  }

  vec3 x1 = x0 - i1 + G3;
  vec3 x2 = x0 - i2 + 2.0*G3;
  vec3 x3 = x0 - 1.0 + 3.0*G3;

  ivec3 ii = ivec3(i);
  int gi0 = hash3D(ii) % 12;
  int gi1 = hash3D(ii+ivec3(i1)) % 12;
  int gi2 = hash3D(ii+ivec3(i2)) % 12;
  int gi3 = hash3D(ii+ivec3(1)) % 12;

  float n0=0.0,n1=0.0,n2=0.0,n3=0.0;

  float t0=0.6-dot(x0,x0); if (t0>0.0){ t0*=t0; n0=t0*t0*dot(grad3[gi0],x0);}
  float t1=0.6-dot(x1,x1); if (t1>0.0){ t1*=t1; n1=t1*t1*dot(grad3[gi1],x1);}
  float t2=0.6-dot(x2,x2); if (t2>0.0){ t2*=t2; n2=t2*t2*dot(grad3[gi2],x2);}
  float t3=0.6-dot(x3,x3); if (t3>0.0){ t3*=t3; n3=t3*t3*dot(grad3[gi3],x3);}

  return 32.0*(n0+n1+n2+n3);
}

// --- FBM melhorado ---
float fbm3D(vec3 p, int octaves, float persistence, float lacunarity) {
  float total=0.0, amplitude=1.0, maxValue=0.0;
  for (int i=0; i<octaves; i++) {
    total += simplex3D(p)*amplitude;
    maxValue += amplitude;
    p *= lacunarity;
    amplitude *= persistence;
  }
  return total/maxValue;
}

// --- Rotação ---
vec3 rotateSphereFishEye(vec3 p, float angle) {
  float r = length(p);
  float theta = acos(p.y/r);
  float phi = atan(p.z,p.x);
  phi += angle;
  return vec3(r*sin(theta)*cos(phi), r*cos(theta), r*sin(theta)*sin(phi));
}

// --- Camadas ---
struct Layer { vec3 color; float widthMin; float widthMax; };
const int N_LAYERS = 5;
const Layer LAYERS[N_LAYERS] = Layer[](
    Layer(vec3(0.06, 0.18, 0.55), 0.0, 0.3),   // Oceano profundo (azul escuro)
    Layer(vec3(0.15,0.28,0.63), 0.3, 0.5),   // Oceano raso (azul médio)
    Layer(vec3(0.90, 0.85, 0.40), 0.5, 0.6),   // Praias (amarelo claro)
    Layer(vec3(0.10, 0.60, 0.10), 0.6, 0.8),   // Terras baixas / vegetação (verde vivo)
    Layer(vec3(0.50, 0.50, 0.50), 0.8, 1.0)    // Montanhas / rochas (cinza médio)
);
// --- Cores de nuvem estilizadas ---
const int N_CLOUD_COLORS = 5;
const vec3 CLOUD_COLORS[N_CLOUD_COLORS] = vec3[](
    vec3(0.25, 0.45, 0.85), // azul médio
    vec3(0.50, 0.70, 0.95), // azul claro
    vec3(0.75, 0.85, 1.00), // quase branco azulado
    vec3(0.90, 0.95, 1.00), // branco azulado suave
    vec3(1.00, 1.00, 1.00)  // branco puro
);

// --- Planeta ---
vec3 getPlanet(vec2 uv) {
  uv = floor(uv/PIXEL_SIZE)*PIXEL_SIZE+0.5*PIXEL_SIZE;
  vec2 c = uv*2.0-1.0;
  float r = length(c);
if (r > 1.0) discard;

  vec3 p = vec3(c,sqrt(1.0-r*r));
  vec3 rp = rotateSphereFishEye(p, ENGINE_TIME*ROTATION_SPEED);

  // terreno
  float elev = fbm3D(rp/NOISE_SCALE, TERRAIN_OCTAVES, TERRAIN_PERSISTENCE, TERRAIN_LACUNARITY);
  elev = elev*0.5+0.5;

  // normal e iluminação
  vec3 normal = normalize(p);
  float diffuse = max(dot(normal,LIGHT_DIR),0.0);
  vec3 viewDir = normalize(vec3(0.06,0.31,0.58));
  vec3 halfDir = normalize(LIGHT_DIR+viewDir);
  float spec = pow(max(dot(normal,halfDir),0.0),64.0);

 
vec3 color = vec3(0.0);
for (int i = 0; i < N_LAYERS; i++) {
    if (elev >= LAYERS[i].widthMin && elev < LAYERS[i].widthMax) {
        color = LAYERS[i].color;
        break; // sai do loop na primeira camada correspondente
    }
}


  // luz ambiente + difusa + especular
  color *= (0.3 + 0.7*diffuse);
  color += vec3(1.0)*spec*0.2;
  // --- nuvens cartoon ---
  float t = ENGINE_TIME * 0.1;
  float cloudFactor = fbm3D(rp + vec3(t,t,t), 3, 0.6, 2.0);

  // quantização para blocos duros
  cloudFactor = clamp(cloudFactor, 0.0, 1.0);
  int idx = int(floor(cloudFactor * float(N_CLOUD_COLORS)));
  idx = clamp(idx, 0, N_CLOUD_COLORS-1);
  vec3 cloudColor = CLOUD_COLORS[idx];

  // mistura menos suave -> cartoon
  float blend = step(0.1, cloudFactor) * 0.7; // só mistura forte onde há nuvem
  color = mix(color, cloudColor, blend);

  return clamp(color,0.0,1.0);
}

void main() {
  outColor = vec4(getPlanet(ENGINE_UV),1.0);
}
