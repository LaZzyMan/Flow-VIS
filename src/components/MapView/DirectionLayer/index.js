import { Layer } from 'deck.gl'
import {
  GL, Model, Geometry, Texture2D,
} from 'luma.gl'
import PropTypes from 'prop-types'
import vertexShader from './DirectionLayerVertex.glsl'
import fragmentShader from './DirectionLayerFragment.glsl'
import fslighting from '../../../shaderlib/fs-lighting'

const LIGHT_UNIFORMS = {
  lightsPosition: [-70.585, 38.0, 15000],
  lightsStrength: [1.0, 0.0],
  ambientRatio: 0.9,
  diffuseRatio: 0.8,
  specularRatio: 0.9,
  numberOfLights: 2,
}

class DirectionLayer extends Layer {
  initializeState() {
    const { gl } = this.context
    const { textureSize, bbox } = this.props

    const model = this.getModel({
      gl, bbox, nx: 60, ny: 30,
    })

    const { width, height } = textureSize
    const texture = this.createTexture(gl, {})

    this.setState({
      model,
      texture,
      width,
      height,
    })
  }

  getNumInstances() {
    return this.state.numInstances
  }

  draw({ uniforms }) {
    const { gl } = this.context

    const {
      model,
      texture,
      width,
      height,
    } = this.state

    const { bbox, bounds, texData } = this.props
    const pixelStoreParameters = {
      [GL.UNPACK_FLIP_Y_WEBGL]: true,
    }

    texture.setImageData({
      pixels: texData,
      width,
      height,
      format: gl.RGBA32F,
      type: gl.FLOAT,
      dataFormat: gl.RGBA,
      parameters: pixelStoreParameters,
    })

    const parameters = {
      clearDepth: 1.0,
      depthTest: true,
      depthFunc: gl.LEQUAL,
    }

    Object.assign(uniforms, LIGHT_UNIFORMS, {
      bbox: [bbox.minLng, bbox.maxLng, bbox.minLat, bbox.maxLat],
      size: [width, height],
      boundx: [bounds.boundx.min, bounds.boundx.max],
      boundy: [bounds.boundy.min, bounds.boundy.max],
      data: texture,
    })

    model.draw({ uniforms, parameters })

    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  getModel({
    gl, bbox, nx, ny,
  }) {
    this.state.numInstances = nx * ny

    const positions = this.calculatePositions({ nx, ny, bbox })
    const vertices = new Float32Array([0.3, 0, 250, 0, 0.1, 0, 1, 0, 0, 0, -0.1, 0, 0, 0.1, 0])
    const normals = new Float32Array([0, 0, 1, 0, 0.1, 0, 1, 0, 0, 0, -0.1, 0, 0, 0.1, 0])

    const geometry = new Geometry({
      id: 'direction-layer',
      drawMode: GL.TRIANGLE_FAN,
      isInstanced: true,
      instanceCount: 1,
      attributes: {
        positions: {
          size: 3, type: gl.FLOAT, value: positions, instanced: 1,
        },
        vertices: { size: 3, type: gl.FLOAT, value: vertices },
        normals: { size: 3, type: gl.FLOAT, value: normals },
      },
    })

    return new Model(gl, {
      vs: vertexShader,
      fs: fragmentShader,
      modules: [fslighting],
      isIndexed: false,
      isInstanced: true,
      geometry,
    })
  }

  createTexture(gl, opt) {
    const textureOptions = Object.assign(
      {
        format: gl.RGBA32F,
        dataFormat: gl.RGBA,
        type: gl.FLOAT,
        parameters: {
          [gl.TEXTURE_MAG_FILTER]: gl.NEAREST,
          [gl.TEXTURE_MIN_FILTER]: gl.NEAREST,
          [gl.TEXTURE_WRAP_S]: gl.CLAMP_TO_EDGE,
          [gl.TEXTURE_WRAP_T]: gl.CLAMP_TO_EDGE,
        },
        pixelStore: { [gl.UNPACK_FLIP_Y_WEBGL]: true },
      },
      opt,
    )

    return new Texture2D(gl, textureOptions)
  }

  calculatePositions({ nx, ny, bbox }) {
    const diffX = bbox.maxLng - bbox.minLng
    const diffY = bbox.maxLat - bbox.minLat
    const spanX = diffX / (nx - 1)
    const spanY = diffY / (ny - 1)

    const positions = new Float32Array(nx * ny * 3)

    for (let i = 0; i < nx; ++i) {
      for (let j = 0; j < ny; ++j) {
        const index = (i + j * nx) * 3
        positions[index + 0] = i * spanX + bbox.minLng + (j % 2 ? spanX / 2 : 0)
        positions[index + 1] = j * spanY + bbox.minLat
        positions[index + 2] = 0
      }
    }

    return positions
  }
}

DirectionLayer.propTypes = {
  bbox: PropTypes.object.isRequired,
  textureSize: PropTypes.object.isRequired,
  texData: PropTypes.array.isRequired,
  bounds: PropTypes.object.isRequired,
  lightSettings: PropTypes.object.isRequired,
}
DirectionLayer.layerName = 'ParticleLayer'
DirectionLayer.defaultProps = {
  bbox: null,
  textureSize: null,
  texData: null,
  bounds: null,
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
