import { CompositeLayer } from 'deck.gl'
import PropTypes from 'prop-types'
import SingleDirectionLayer from './SingleDirectionLayer'
import { hex2Rgb, getBounds } from '../../../utils'

const colorMap = [
  hex2Rgb('#F6D6FF'),
  hex2Rgb('#FF048'),
  hex2Rgb('#EAF048'),
  hex2Rgb('#82A6F5'),
]

class DirectionLayer extends CompositeLayer {
  renderLayers() {
    const {
      texData, bbox, textureSize, lightSettings,
    } = this.props
    const textures = []
    texData.forEach(pic => {
      const tex1 = new Float32Array(pic.length * 4)
      const tex2 = new Float32Array(pic.length * 4)
      for (let i = 0; i < pic.length / 4; i++) {
        tex1[i + 0] = pic[i]
        tex1[i + 1] = pic[i + 1]
        tex1[i + 2] = 0
        tex1[i + 3] = 0
        tex2[i + 0] = pic[i + 2]
        tex2[i + 1] = pic[i + 3]
        tex2[i + 2] = 0
        tex2[i + 3] = 0
      }
      textures.push(tex1)
      textures.push(tex2)
    })
    const subLayers = textures.map((tex, index) => new SingleDirectionLayer({
      id: `direction-layer-${index}`,
      fp64: true,
      bbox,
      textureSize,
      bounds: getBounds(tex),
      texData: tex,
      color: colorMap[index],
      lightSettings,
    }))
    return subLayers
  }
}

DirectionLayer.propTypes = {
  bbox: PropTypes.object.isRequired,
  textureSize: PropTypes.object.isRequired,
  texData: PropTypes.arrayOf(PropTypes.array).isRequired,
  lightSettings: PropTypes.object.isRequired,
}
DirectionLayer.layerName = 'ParticleLayer'
DirectionLayer.defaultProps = {
  bbox: null,
  textureSize: null,
  texData: null,
  lightSettings: {
    lightsPosition: [-60, 25, 15000, -140, 0, 400000],
    ambientRatio: 0.8,
    diffuseRatio: 0.6,
    specularRatio: 0.2,
    lightsStrength: [1.0, 0.0, 2.0, 0.0],
    numberOfLights: 2,
  },
}

export default DirectionLayer
