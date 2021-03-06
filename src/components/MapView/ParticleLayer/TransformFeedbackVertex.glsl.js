// uniform: bbox, , flip, dataEW, dataNS, time
// boundex, boundey, boundwx, boundwy, boundnx, boundny, boundsx, boundsy
// attribute: posFrom
// gl_Positon

export default `\
#define SHADER_NAME particle-feedback-vertex-shader

#define PI 3.1415926535
#define PI2 1.5707963267949
#define PI4 0.78539816339745
#define HEIGHT_FACTOR 25.
#define EPSILON 0.000001
#define DELTA 5.
#define FACTOR .05

uniform sampler2D dataEW;
uniform sampler2D dataNS;
uniform sampler2D dataRoad;
uniform float time;

uniform float flip;
uniform vec4 bbox;
uniform vec2 boundex;
uniform vec2 boundey;
uniform vec2 boundwx;
uniform vec2 boundwy;
uniform vec2 boundnx;
uniform vec2 boundny;
uniform vec2 boundsx;
uniform vec2 boundsy;

uniform vec2 boundgravityx;
uniform vec2 boundgravityy;
uniform vec2 boundguidex;
uniform vec2 boundguidey;

uniform float sResistance;
uniform float sRoadGuide;
uniform float sRoadGravity;
uniform float sTrajectoryField;

attribute vec4 posFrom;

float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main(void) {
  // position in texture coords
  float x = (posFrom.x - bbox.x) / (bbox.y - bbox.x);
  float y = (posFrom.y - bbox.z) / (bbox.w - bbox.z);
  vec2 coord = vec2(x, 1. - y);
  vec4 texelEW = texture2D(dataEW, coord);
  vec4 texelNS = texture2D(dataNS, coord);
  vec4 texelRoad = texture2D(dataRoad, coord);

  // calculate speed in direction of x and y
  float fex = 0.05 + 0.95 * (texelEW.x - boundex.x) / (boundex.y - boundex.x);
  float fey = 0.;
  float fwx = 0.05 + 0.95 * (texelEW.z - boundwx.y) / (boundwx.y - boundwx.x);
  float fwy = 0.;
  float fnx = 0.;
  float fny = 0.05 + 0.95 * (texelNS.y - boundny.x) / (boundny.y - boundny.x);
  float fsx = 0.;
  float fsy = 0.05 + 0.95 * (texelNS.w - boundsy.y) / (boundsy.y - boundsy.x);
  if(texelEW.y >= 0.0){
    fey = 0.05 + 0.95 * texelEW.y / boundey.y;
  }else{
    fey = - (0.05 + 0.95 * texelEW.y / boundey.x);
  }
  if(texelEW.w >= 0.0){
    fwy = 0.05 + 0.95 * texelEW.w / boundwy.y;
  }else{
    fwy = - (0.05 + 0.95 * texelEW.w / boundwy.x);
  }
  if(texelNS.x >= 0.0){
    fnx = 0.05 + 0.95 * texelNS.x / boundnx.y;
  }else{
    fnx = - (0.05 + 0.95 * texelNS.x / boundnx.x);
  }
  if(texelNS.z >= 0.0){
    fsx = 0.05 + 0.95 * texelNS.z / boundsx.y;
  }else{
    fsx = - (0.05 + 0.95 * texelNS.z / boundsx.x);
  }
  
  float fe = length(vec2(texelEW.x, texelEW.y));
  float fw = length(vec2(texelEW.z, texelEW.w));
  float fn = length(vec2(texelNS.x, texelNS.y));
  float fs = length(vec2(texelNS.z, texelNS.w));
  float randv = rand(vec2(posFrom.x, time));
  randv = clamp(randv, .1, .9);
  // randv = 1.;
  vec4 prob = vec4(fw, fw + fe, fs + fw + fe, fs + fn + fw + fe) / (fe + fw + fn + fs);
  // prob = vec4(0.25, 0.5, 0.75, 1.);
  vec2 f = vec2(fex, fey);
  if(randv <= prob.x){
    f = vec2(fex, fey) * .9;
  }else if(randv <= prob.y){
    f = vec2(fwx, fwy) * .9;
  }else if(randv <= prob.z){
    f = vec2(fsx, fsy);
  }else{
    f = vec2(fnx, fny);
  }

  // calculate the gravity and guide by the road
  vec2 fGravity = vec2(0., 0.);
  if(boundgravityx.y * boundgravityx.x < 0.){
    if(texelRoad.x >= 0.0){
      fGravity.x = 0.05 + 0.95 * texelRoad.x / boundgravityx.y;
    }else{
      fGravity.x = - (0.05 + 0.95 * texelRoad.x / boundgravityx.x);
    }
  }else{
    fGravity.x = 0.05 + 0.95 * (texelRoad.x - boundgravityx.x) / (boundgravityx.y - boundgravityx.x);
  }
  if(boundgravityy.y * boundgravityy.x < 0.){
    if(texelRoad.y >= 0.0){
      fGravity.y = 0.05 + 0.95 * texelRoad.y / boundgravityy.y;
    }else{
      fGravity.y = - (0.05 + 0.95 * texelRoad.y / boundgravityy.x);
    }
  }else{
    fGravity.y = 0.05 + 0.95 * (texelRoad.y - boundgravityy.x) / (boundgravityy.y - boundgravityy.x);
  }

  vec2 fGuide = vec2(0., 0.);
  if(boundguidex.y * boundguidex.x < 0.){
    if(texelRoad.z >= 0.0){
      fGuide.x = 0.05 + 0.95 * texelRoad.z / boundguidex.y;
    }else{
      fGuide.x = - (0.05 + 0.95 * texelRoad.z / boundguidex.x);
    }
  }else{
    fGuide.x = 0.05 + 0.95 * (texelRoad.z - boundguidex.x) / (boundguidex.y - boundguidex.x);
  }
  if(boundguidey.y * boundguidey.x < 0.){
    if(texelRoad.w >= 0.0){
      fGuide.y = 0.05 + 0.95 * texelRoad.w / boundguidey.y;
    }else{
      fGuide.y = - (0.05 + 0.95 * texelRoad.w / boundguidey.x);
    }
  }else{
    fGuide.y = 0.05 + 0.95 * (texelRoad.w - boundguidey.x) / (boundguidey.y - boundguidey.x);
  }

  // calculate end velority and position t=0.1s m=0.001
  // add a resistance depend on the past v
  f = normalize(f);
  fGravity = normalize(fGravity);
  fGuide = normalize(fGuide);
  vec2 pastv = vec2(posFrom.z, posFrom.w);
  vec2 resistance = normalize(pastv) * pastv * pastv * .5 * 1.293 * .001 * -1.0;
  f = f * sTrajectoryField + resistance * sResistance + fGravity * sRoadGravity + fGuide * sRoadGuide;

  vec2 currentv = pastv + f * 0.1 * 10. * 2.;

  vec2 offset = (pastv * 0.1 + f * 0.005 * 100.) * 0.00001;
  vec2 offsetPos = posFrom.xy + offset;
  vec4 endPos = vec4(offsetPos, currentv.x, currentv.y);

  // if 1. out of bounds 2. movement is too little 3. No f
  // then map to random position
  float r1 = rand(vec2(posFrom.x, offset.x + time));
  float r2 = rand(vec2(posFrom.y, offset.y + time));
  r1 = r1 * (bbox.y - bbox.x) + bbox.x;
  r2 = r2 * (bbox.w - bbox.z) + bbox.z;
  vec2 randValues = vec2(r1, r2);
  if(offsetPos.x < bbox.x || offsetPos.x > bbox.y || offsetPos.y < bbox.z || offsetPos.y > bbox.w) {
    endPos.xy = randValues;
    endPos.zw = vec2(0.5);
  }
  if(length(offset) < EPSILON){
    endPos.xy = randValues;
    endPos.zw = vec2(0.5);
  } 
  // endPos.xy = mix(endPos.xy, randValues, float(length(offset) < EPSILON));
  // endPos.xy = mix(endPos.xy, randValues, float(texel.x == 0. && texel.y == 0.));
  // if (flip > 0.) {
  //   if (abs(abs(fract(endPos.x)) - flip / 10.) < EPSILON) {
  //     endPos.xy = randValues;
  //   }
  // }
  // endPos.xy = mix(endPos.xy, randValues, abs(flip - positions.z) <= DELTA ? 1. : 0.);

  gl_Position = endPos;
}
`
