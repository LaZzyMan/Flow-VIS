// uniform: bbox, boundx, boundy, flip, data, time
// attribute: posFrom
// gl_Positon

export default `\
#define SHADER_NAME particle-feedback-vertex-shader

#define PI 3.1415926535
#define PI2 1.5707963267949
#define PI4 0.78539816339745
#define HEIGHT_FACTOR 25.
#define EPSILON 0.01
#define DELTA 5.
#define FACTOR .05

uniform sampler2D data;
uniform float time;

uniform float flip;
uniform vec4 bbox;
uniform vec2 boundx;
uniform vec2 boundy;

attribute vec4 posFrom;

float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main(void) {
  // position in texture coords
  float x = (posFrom.x - bbox.x) / (bbox.y - bbox.x);
  float y = (posFrom.y - bbox.z) / (bbox.w - bbox.z);
  vec2 coord = vec2(x, 1. - y);
  vec4 texel = texture2D(data, coord);

  // calculate speed in direction of x and y
  float currentx = posFrom.z;
  float currenty = posFrom.w;
  float fx = 0.05 + 0.9 * (texel.x - boundx.x) / (boundx.y - boundx.x);
  float fy = 0.05 + 0.9 * (texel.y - boundy.x) / (boundy.y - boundy.x);
  currentx = currentx + fx;
  currenty = currenty + fy;

  // calculate next postion
  vec2 offset = vec2(currentx, currenty) * 0.2;
  vec2 offsetPos = posFrom.xy + offset;
  vec4 endPos = vec4(offsetPos, currentx, currenty);

  // calculate angle
  // float angle = texel.x * PI4;
  // float anglePast = posFrom.z;
  // if (angle < 0.) {
  //   angle += PI * 2.;
  // }
  // if (anglePast > -1.) {
  //   if (angle > anglePast && abs(angle - anglePast) > abs(angle - (anglePast + PI * 2.))) {
  //     anglePast += PI * 2.;
  //   } else if (angle < anglePast && abs(anglePast - angle) > abs(anglePast - (angle + PI * 2.))) {
  //     angle += PI * 2.;
  //   }
  //   angle = angle * FACTOR + anglePast * (1. - FACTOR);
  // }

  // wind speed
  // float wind = 0.05 + 0.9 * (texel.y - bounds1.x) / (bounds1.y - bounds1.x);
  // float windPast = posFrom.w;
  // if (windPast > -1.) {
  //   wind = wind * FACTOR + windPast * (1. - FACTOR);
  // }

  // if 1. out of bounds 2. movement is too little 
  // then map to random position
  float r1 = rand(vec2(posFrom.x, offset.x + time));
  float r2 = rand(vec2(posFrom.y, offset.y + time));
  r1 = r1 * (bbox.y - bbox.x) + bbox.x;
  r2 = r2 * (bbox.w - bbox.z) + bbox.z;
  vec2 randValues = vec2(r1, r2);
  // if(offsetPos.x < bbox.x || offsetPos.x > bbox.y || offsetPos.y < bbox.z || offsetPos.y > bbox.w) {
  //   endPos.xy = randValues;
  // }
  endPos.xy = mix(offsetPos, randValues,
    float(offsetPos.x < bbox.x || offsetPos.x > bbox.y ||
      offsetPos.y < bbox.z || offsetPos.y > bbox.w));
  endPos.xy = mix(endPos.xy, randValues, float(length(offset) < EPSILON));
  // endPos.xy = mix(endPos.xy, randValues, float(texel.x == 0. && texel.y == 0.));
  if (flip > 0.) {
    if (abs(abs(fract(endPos.x)) - flip / 10.) < EPSILON) {
      endPos.xy = randValues;
    }
  }
  // endPos.xy = mix(endPos.xy, randValues, abs(flip - positions.z) <= DELTA ? 1. : 0.);

  gl_Position = endPos;
}
`
