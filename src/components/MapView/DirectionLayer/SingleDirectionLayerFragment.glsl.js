// varying: vPosition, vNormal, vColor
export default `\
#define SHADER_NAME direction-layer-fragment-shader

varying vec4 vPosition;
varying vec4 vNormal;
varying vec4 vColor;

void main(void) {
  if (vColor.a == 0.) {
    discard;
  }
  float lightWeight = getLightWeight(vPosition.xyz, vNormal.xzy);
  gl_FragColor = vec4(vColor.xyz * lightWeight, 1);
}
`
