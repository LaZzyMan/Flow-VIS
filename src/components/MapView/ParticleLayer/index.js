import { Layer } from 'deck.gl'
import GL from 'luma.gl/constants'
import {
  Model, Geometry, Buffer, setParameters, Texture2D, _Transform as Transform,
} from 'luma.gl'
import PropTypes from 'prop-types'
import vertexShader from './ParticleLayerVertex.glsl'
import fragmentShader from './ParticleLayerFragment.glsl'
import vertexShaderTF from './TransformFeedbackVertex.glsl'
import { getBounds, hex2Rgb } from '../../../utils'

class ParticleLayer extends Layer {
  initializeState() {
    const { gl } = this.context
    // const gl = createGLContext({ canvas: 'deckgl-overlay', preserveDrawingBuffer: true })
    // gl.preserveDrawingBuffer = true
    const {
      bbox, texData, textureSize, roadEffect, roadEffectDataSize,
    } = this.props
    const { texWidth, texHeight } = textureSize
    const { redWidth, redHeight } = roadEffectDataSize
    const textureEW = this.createTexture(gl, {})
    const textureNS = this.createTexture(gl, {})
    const roadTexture = this.createTexture(gl, {})
    const texture = this.createTexture(gl, {})
    const avgValue = new Float32Array(texData[0].length).map((value, index) => {
      if (index % 4 !== 0) {
        return 0
      }
      const avg = Math.sqrt(texData[0][index] * texData[0][index]
        + texData[0][index + 1] * texData[0][index + 1])
      + Math.sqrt(texData[0][index + 2] * texData[0][index + 2]
        + texData[0][index + 3] * texData[0][index + 3])
      + Math.sqrt(texData[1][index] * texData[1][index]
        + texData[1][index + 1] * texData[1][index + 1])
      + Math.sqrt(texData[1][index + 2] * texData[1][index + 2]
        + texData[1][index + 3] * texData[1][index + 3])
      return avg
    })

    const model = this.getModel(gl, 800, 400)

    this.setupTransformFeedback(gl, bbox, 800, 400)

    this.setState({
      model,
      texData,
      textureEW,
      textureNS,
      roadTexture,
      texture,
      texWidth,
      texHeight,
      roadEffect,
      redHeight,
      redWidth,
      avgValue,
    })
  }

  // shouldUpdateState(changeFlags) {
  //   changeFlags.somethingChanged
  // }
  // updateState(props) {
  //   const { time } = props
  //   const timeInterval = Math.floor(time)
  //   const delta = time - timeInterval
  //   this.setState({
  //     timeInterval,
  //     delta,
  //   })
  // }

  draw({ uniforms }) {
    const { gl } = this.context
    const { bbox } = this.props

    this.runTransformFeedback({ gl })

    const { model, texture, avgValue } = this.state
    const {
      texWidth, texHeight, bufferTo, bufferFrom,
    } = this.state

    const boundavg = getBounds(avgValue)
    const currentUniforms = {
      bbox: [bbox.minLng, bbox.maxLng, bbox.minLat, bbox.maxLat],
      bound: [boundavg.boundx.min, boundavg.boundx.max],
      data: texture,
      pixelRatio: window.devicePixelRatio || 1,
      color1: hex2Rgb('#12c2e9').map(v => v / 255),
      color2: hex2Rgb('#c471ed').map(v => v / 255),
      color3: hex2Rgb('#f64f59').map(v => v / 255),
    }

    setParameters(gl, {
      blend: true,
      blendFunc: [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA],
      depthTest: true,
      depthFunc: gl.LEQUAL,
    })
    const pixelStoreParameters = {
      [GL.UNPACK_FLIP_Y_WEBGL]: true,
    }

    texture.setImageData({
      pixels: avgValue,
      width: texWidth,
      height: texHeight,
      format: gl.RGBA32F,
      type: gl.FLOAT,
      dataFormat: gl.RGBA,
      parameters: pixelStoreParameters,
    })

    bufferTo.updateAccessor({ instanced: 1 })
    model.setAttributes({
      posFrom: bufferTo,
    })

    model.render(Object.assign({}, currentUniforms, uniforms))

    // Swap the buffers
    this.setState({
      bufferFrom: bufferTo,
      bufferTo: bufferFrom,
    })
  }

  setupTransformFeedback(gl, bbox, nx, ny) {
    const positions4 = this.calculatePositions4({ bbox, nx, ny })

    const bufferFrom = new Buffer(gl, {
      size: 4,
      data: positions4,
      usage: gl.DYNAMIC_COPY,
    })

    const bufferTo = new Buffer(gl, {
      size: 4,
      bytes: 4 * positions4.length,
      usage: gl.DYNAMIC_COPY,
    })

    const transform = new Transform(gl, {
      vs: vertexShaderTF,
      varyings: ['gl_Position'],
      elementCount: positions4.length / 4,
      sourceBuffers: { posFrom: bufferFrom },
      feedbackBuffers: { gl_Position: bufferTo },
      feedbackMap: { posFrom: 'gl_Position' },
    })
    this.setState({
      counter: 0,
      now: Date.now(),
      bufferFrom,
      bufferTo,
      transform,
    })
  }

  runTransformFeedback({ gl }) {
    const {
      textureEW, textureNS, transform, roadEffectDataSize, roadTexture,
    } = this.state
    const {
      bbox, bounds, textureSize, texData, redBounds, roadEffect, strength,
    } = this.props
    const { texWidth, texHeight } = textureSize
    const { redWidth, redHeight } = roadEffectDataSize
    const { bufferFrom, bufferTo, now } = this.state
    let { counter } = this.state
    const time = Date.now() - now
    let flip = time > 500 ? 1 : -1
    if (flip > 0) {
      counter = (counter + 1) % 10
      flip = counter
    }
    const pixelStoreParameters = {
      [GL.UNPACK_FLIP_Y_WEBGL]: true,
    }
    roadTexture.setImageData({
      pixels: roadEffect,
      width: redWidth,
      height: redHeight,
      format: gl.RGBA32F,
      type: gl.FLOAT,
      dataFormat: gl.RGBA,
      parameters: pixelStoreParameters,
    })

    textureEW.setImageData({
      pixels: texData[0],
      width: texWidth,
      height: texHeight,
      format: gl.RGBA32F,
      type: gl.FLOAT,
      dataFormat: gl.RGBA,
      parameters: pixelStoreParameters,
    })

    textureNS.setImageData({
      pixels: texData[1],
      width: texWidth,
      height: texHeight,
      format: gl.RGBA32F,
      type: gl.FLOAT,
      dataFormat: gl.RGBA,
      parameters: pixelStoreParameters,
    })

    const uniforms = {
      bbox: [bbox.minLng, bbox.maxLng, bbox.minLat, bbox.maxLat],
      boundex: [bounds[0].boundx.min, bounds[0].boundx.max],
      boundey: [bounds[0].boundy.min, bounds[0].boundy.max],
      boundwx: [bounds[0].boundz.min, bounds[0].boundz.max],
      boundwy: [bounds[0].boundw.min, bounds[0].boundw.max],
      boundnx: [bounds[1].boundx.min, bounds[1].boundx.max],
      boundny: [bounds[1].boundy.min, bounds[1].boundy.max],
      boundsx: [bounds[1].boundz.min, bounds[1].boundz.max],
      boundsy: [bounds[1].boundw.min, bounds[1].boundw.max],
      dataEW: textureEW,
      dataNS: textureNS,
      dataRoad: roadTexture,
      boundgravityx: [redBounds.boundx.min, redBounds.boundx.max],
      boundgravityy: [redBounds.boundy.min, redBounds.boundy.max],
      boundguidex: [redBounds.boundz.min, redBounds.boundz.max],
      boundguidey: [redBounds.boundw.min, redBounds.boundw.max],
      time,
      flip,
      sResistance: strength.resistance,
      sRoadGuide: strength.roadGuide,
      sRoadGravity: strength.roadGravity,
      sTrajectoryField: strength.trajectoryField,
    }

    bufferFrom.updateAccessor({ instanced: 0 })
    bufferTo.updateAccessor({ instanced: 0 })

    transform.run({ uniforms })
    transform.swapBuffers()

    if (flip > 0) {
      flip = -1
      this.setState({
        now: Date.now(),
      })
    }
    this.setState({
      counter,
    })
  }

  getModel(gl, nx, ny) {
    // This will be a grid of elements
    this.setState({ numInstances: nx * ny })
    const positions3 = new Float32Array([0, 0, 0])
    return new Model(gl, {
      id: 'ParticleLayer-model',
      vs: vertexShader,
      fs: fragmentShader,
      geometry: new Geometry({
        id: 'ParticleLayer',
        drawMode: GL.POINTS,
        vertexCount: 1,
        attributes: {
          positions: {
            size: 3, type: GL.FLOAT, value: positions3, instanced: 0,
          },
        },
      }),
      isInstanced: true,
      instanceCount: nx * ny,
      isIndexed: false,
    })
  }

  getNumInstances() {
    return this.state.numInstances
  }

  getShaders() {
    return {
      vs: vertexShader,
      fs: fragmentShader,
    }
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

  calculatePositions3({ nx, ny }) {
    const positions3 = new Float32Array(nx * ny * 3)

    for (let i = 0; i < nx; ++i) {
      for (let j = 0; j < ny; ++j) {
        const index3 = (i + j * nx) * 3
        positions3[index3 + 0] = 0
        positions3[index3 + 1] = 0
        positions3[index3 + 2] = Math.random() * nx
      }
    }

    return positions3
  }

  calculatePositions4({ bbox, nx, ny }) {
    const diffX = bbox.maxLng - bbox.minLng
    const diffY = bbox.maxLat - bbox.minLat
    const spanX = diffX / (nx - 1)
    const spanY = diffY / (ny - 1)

    const positions4 = new Float32Array(nx * ny * 4)

    for (let i = 0; i < nx; ++i) {
      for (let j = 0; j < ny; ++j) {
        const index4 = (i + j * nx) * 4
        positions4[index4 + 0] = i * spanX + bbox.minLng
        positions4[index4 + 1] = j * spanY + bbox.minLat
        positions4[index4 + 2] = Math.random()
        positions4[index4 + 3] = Math.random()
      }
    }

    return positions4
  }
}

ParticleLayer.propTypes = {
  bbox: PropTypes.object.isRequired,
  textureSize: PropTypes.object.isRequired,
  texData: PropTypes.arrayOf(PropTypes.array).isRequired,
  bounds: PropTypes.arrayOf(PropTypes.object).isRequired,
  strength: PropTypes.object.isRequired,
}
ParticleLayer.layerName = 'ParticleLayer'
ParticleLayer.defaultProps = {
  bbox: null,
  textureSize: null,
  texData: null,
  bounds: null,
  strength: null,
}

export default ParticleLayer
