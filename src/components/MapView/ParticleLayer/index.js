import { Layer } from 'deck.gl'
import GL from 'luma.gl/dist/es6/constants'
import {
  Model, Geometry, Buffer, setParameters, Texture2D, experimental,
} from 'luma.gl'
import PropTypes from 'prop-types'
import vertexShader from './ParticleLayerVertex.glsl'
import fragmentShader from './ParticleLayerFragment.glsl'
import vertexShaderTF from './TransformFeedbackVertex.glsl'

const { Transform } = experimental

class ParticleLayer extends Layer {
  initializeState() {
    const { gl } = this.context
    const { bbox, texData, textureSize } = this.props
    const { width, height } = textureSize
    const texture = this.createTexture(gl, {})

    const model = this.getModel(gl, 600, 300)

    this.setupTransformFeedback(gl, bbox, 600, 300)

    this.setState({
      model,
      texData,
      texture,
      width,
      height,
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
    const { bbox, texData, bounds } = this.props

    this.runTransformFeedback({ gl })

    const { model, texture } = this.state
    const {
      width, height, bufferTo, bufferFrom,
    } = this.state

    const currentUniforms = {
      bbox: [bbox.minLng, bbox.maxLng, bbox.minLat, bbox.maxLat],
      boundx: [bounds.boundx.min, bounds.boundx.max],
      boundy: [bounds.boundy.min, bounds.boundy.max],
      data: texture,
      pixelRatio: window.devicePixelRatio || 1,
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
      pixels: texData,
      width,
      height,
      format: gl.RGBA32F,
      type: gl.FLOAT,
      dataFormat: gl.RGBA,
      parameters: pixelStoreParameters,
    })

    bufferTo.updateLayout({ instanced: 1 })
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
      destinationBuffers: { gl_Position: bufferTo },
      sourceDestinationMap: { posFrom: 'gl_Position' },
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
      texture, transform,
    } = this.state
    const {
      bbox, bounds, textureSize, texData,
    } = this.props
    const { width, height } = textureSize
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
    texture.setImageData({
      pixels: texData,
      width,
      height,
      format: gl.RGBA32F,
      type: gl.FLOAT,
      dataFormat: gl.RGBA,
      parameters: pixelStoreParameters,
    })

    const uniforms = {
      bbox: [bbox.minLng, bbox.maxLng, bbox.minLat, bbox.maxLat],
      boundx: [bounds.boundx.min, bounds.boundx.max],
      boundy: [bounds.boundy.min, bounds.boundy.max],
      data: texture,
      time,
      flip,
    }

    bufferFrom.updateLayout({ instanced: 0 })
    bufferTo.updateLayout({ instanced: 0 })

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
        positions4[index4 + 2] = 0
        positions4[index4 + 3] = 0
      }
    }

    return positions4
  }
}

ParticleLayer.propTypes = {
  bbox: PropTypes.object.isRequired,
  textureSize: PropTypes.object.isRequired,
  texData: PropTypes.array.isRequired,
  bounds: PropTypes.object.isRequired,
}
ParticleLayer.layerName = 'ParticleLayer'
ParticleLayer.defaultProps = {
  bbox: null,
  textureSize: null,
  texData: null,
  bounds: null,
}

export default ParticleLayer
