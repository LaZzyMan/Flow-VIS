// uniform: bbox, bound, data, pixelRatio, color1, color2, color3
// attribute: position, posFrom
// varying: vColor
// gl_Positon gl_PointSize

export default `\
#define SHADER_NAME particle-layer-vertex-shader

#define HEIGHT_FACTOR 25.
#define ELEVATION_SCALE 100.

uniform sampler2D data;
uniform float pixelRatio;

uniform vec4 bbox;
uniform vec2 bound;

uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;

attribute vec3 positions;
attribute vec4 posFrom;

varying vec4 vColor;

void main(void) {
  // position in texture coords
  float x = (posFrom.x - bbox.x) / (bbox.y - bbox.x);
  float y = (posFrom.y - bbox.z) / (bbox.w - bbox.z);
  vec2 coord = vec2(x, 1. - y);
  vec2 pos = project_position(posFrom.xy);
  vec3 extrudedPosition = vec3(pos.xy, 1.0) + positions;
  vec4 position_worldspace = vec4(extrudedPosition, 1.0);
  gl_Position = project_to_clipspace(position_worldspace);
  gl_PointSize = 3.5 * pixelRatio / 2.0;

  // calculate color of particle
  vec4 texel = texture2D(data, coord);
  float v = 0.05 + (texel.x - bound.x) / (bound.y - bound.x) * 0.95;
  v = sqrt(v);
  float alpha = mix(0., 1., pow(v, .8));
  if (texel.x == 0) {
    alpha = 0.;
  }
  if(v <= .5){
    vColor = vec4(mix(color1, color2, v * 2.), 1.);
  }else{
    vColor = vec4(mix(color2, color3, (v-.5) * 2.), 1.);
  }
  // vColor = vec4(vec3(0.8), alpha);
  // vColor = vec4(vec3(29./255., 176./255., 184./255.), alpha);
}
`
