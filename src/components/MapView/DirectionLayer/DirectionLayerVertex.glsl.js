// uniform: data, bbox, size, boundx, boundy
// attribute: positions, vertices, normals
// varying: vPosition, vNormal, vColor
// gl_Position
export default `\
#define SHADER_NAME wind-layer-vertex-shader

#define PI 3.1415926535
#define PI2 1.5707963267949
#define PI4 0.78539816339745
#define HEIGHT_FACTOR 25.
#define ELEVATION_SCALE 80.

uniform sampler2D data;
uniform vec4 bbox;
uniform vec2 size;
uniform vec2 boundx;
uniform vec2 boundy;

attribute vec3 positions;
attribute vec3 vertices;
attribute vec3 normals;

varying vec4 vPosition;
varying vec4 vNormal;
varying vec4 vColor;

void main(void) {
  // position in texture coords
  float x = (positions.x - bbox.x) / (bbox.y - bbox.x);
  float y = (positions.y - bbox.z) / (bbox.w - bbox.z);
  vec2 coord = vec2(x, 1. - y);
  vec4 texel = texture2D(data, coord);

  // calculate rotation matrix
  float l = sqrt(texel.x * texel.x + texel.y * texel.y);
  mat2 rotation = mat2(texel.x / l, texel.y / l, -texel.y / l, texel.x / l);

  // get v in (0, 1)
  float vx = 0.05 + (texel.x - boundx.x) / (boundx.y - boundx.x) * 0.95;
  float vy = 0.05 + (texel.y - boundy.x) / (boundy.y - boundy.x) * 0.95;
  float v = sqrt((vx * vx + vy * vy) / 2.);

  // rotate normal lines and vertices
  float factor = v * 4.;
  vec2 vertex = rotation * vertices.xy;
  vec2 normal = rotation * normals.xy;
  vec2 pos = project_position(positions.xy + vertex.xy * factor);

  vec3 extrudedPosition = vec3(pos.xy, 1.0);

  vec4 position_worldspace = vec4(extrudedPosition, 1.0);
  gl_Position = project_to_clipspace(position_worldspace);

  // calculate color for icon
  float temp = floor(v * 3.) / 3.;
  vColor = vec4((1. - vec3(3. * temp, 0.25, 0.4)), 1);

  vPosition = position_worldspace;
  vNormal = vec4(normal, normals.z, 1);

  // out of bounds
  if (texel.x == 0. && texel.y == 0. && texel.z == 0.) {
    vColor.a = 0.;
  }
}
`
