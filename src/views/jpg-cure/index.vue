<template>
  <div>
    <div id="container"></div>
  </div>
</template>
<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
export default {
  name: 'jpg-cure',
  data() {
    return {}
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      let container = document.getElementById('container')
      const renderer = new THREE.WebGLRenderer()
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      container.appendChild(renderer.domElement)

      const scene = new THREE.Scene()

      const camera = new THREE.PerspectiveCamera(
        90,
        window.innerWidth / window.innerHeight,
        0.1,
        100
      )
      camera.position.z = 0.01

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableZoom = false
      controls.enablePan = false
      controls.enableDamping = true
      controls.rotateSpeed = -0.25
      const textures = this.getTexturesFromAtlasFile(
        '/sun_temple_stripe.jpg',
        6
      )

      const materials = []

      for (let i = 0; i < 6; i++) {
        materials.push(new THREE.MeshBasicMaterial({ map: textures[i] }))
      }

      const skyBox = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materials)
      skyBox.geometry.scale(1, 1, -1)
      scene.add(skyBox)
      this.animate(controls, renderer, scene, camera)
      window.addEventListener('resize', () => {
        this.onWindowResize(camera, renderer)
      })
    },
    onWindowResize(camera, renderer) {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()

      renderer.setSize(window.innerWidth, window.innerHeight)
    },
    getTexturesFromAtlasFile(atlasImgUrl, tilesNum) {
      const textures = []

      for (let i = 0; i < tilesNum; i++) {
        textures[i] = new THREE.Texture()
      }

      new THREE.ImageLoader().load(atlasImgUrl, (image) => {
        let canvas, context
        const tileWidth = image.height

        for (let i = 0; i < textures.length; i++) {
          canvas = document.createElement('canvas')
          context = canvas.getContext('2d')
          canvas.height = tileWidth
          canvas.width = tileWidth
          context.drawImage(
            image,
            tileWidth * i,
            0,
            tileWidth,
            tileWidth,
            0,
            0,
            tileWidth,
            tileWidth
          )
          textures[i].colorSpace = THREE.SRGBColorSpace
          textures[i].image = canvas
          textures[i].needsUpdate = true
        }
      })

      return textures
    },
    animate(controls, renderer, scene, camera) {
      requestAnimationFrame(() => {
        this.animate(controls, renderer, scene, camera)
      })

      controls.update() // required when damping is enabled

      renderer.render(scene, camera)
    },
  },
}
</script>
<style lang="scss" scoped></style>
