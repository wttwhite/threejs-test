<template>
  <div>
    <div id="container"></div>
  </div>
</template>
<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { InitCamera, InitControls, InitRender } from './const'
import {
  CSS2DRenderer,
  CSS2DObject,
} from 'three/examples/jsm/renderers/CSS2DRenderer'
export default {
  name: 'learning',
  data() {
    return {}
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const scene = new THREE.Scene()
      const camera = InitCamera(THREE)
      scene.add(camera)
      // 实例化纹理加载器
      const textureLoader = new THREE.TextureLoader()
      const clock = new THREE.Clock()
      // 添加世界坐标辅助器,坐标系长度为5
      const axesHelper = new THREE.AxesHelper(5)
      scene.add(axesHelper)
      // 创建聚光灯光源
      const dirLight = this.InitDirLight(THREE)
      scene.add(dirLight)
      // 添加环境光
      const envLight = this.InitEnvLight(THREE)
      scene.add(envLight)
      // 添加月球
      const moonGeometry = this.InitMoonGeometry(textureLoader, 0.27)
      const moonLabel = this.InitMoonLabel(0.27)
      moonGeometry.add(moonLabel)
      scene.add(moonGeometry)
      // 添加地球
      const earthGeometry = this.InitEarthGeometry(textureLoader, 2.5)
      scene.add(earthGeometry)
      const earthLabel = this.InitEarthLabel(2.5)
      scene.add(earthLabel)
      // 渲染器
      const renderer = InitRender(THREE)
      // 追加渲染器
      document.getElementById('container').appendChild(renderer.domElement)
      // 标签渲染器
      const labelRenderer = this.InitLabelRenderer()
      // 追加标签渲染器
      document.getElementById('container').appendChild(labelRenderer.domElement)
      // 轨道控制器
      const controls = InitControls(
        OrbitControls,
        camera,
        labelRenderer.domElement
      )
      // 旋转
      function animate() {
        const elapsed = clock.getElapsedTime()
        // 月球公转
        moonGeometry.position.set(
          Math.sin(elapsed) * 5,
          0,
          Math.cos(elapsed) * 5
        )
        // 地球自转
        const axis = new THREE.Vector3(0, 1, 0)
        earthGeometry.rotateOnAxis(axis, (2 * Math.PI) / 1000)
        // 拖动的每一帧重绘
        controls.update()
        requestAnimationFrame(() => {
          animate()
        })
        renderer.render(scene, camera)
        labelRenderer.render(scene, camera)
      }
      animate()
      window.addEventListener('resize', () => {
        this.onWindowResize(camera, renderer)
      })
    },
    InitDirLight() {
      const dirLight = new THREE.SpotLight(0xffffff)
      dirLight.position.set(0, 0, 10)
      dirLight.intensity = 100 // 光源强度
      dirLight.castShadow = true
      return dirLight
    },
    InitEnvLight() {
      const aLight = new THREE.AmbientLight(0xcccccc)
      return aLight
    },
    InitMoonGeometry(textureLoader, r) {
      const moonGeometry = new THREE.SphereGeometry(r, 16, 16)
      // 高光材质
      const material = new THREE.MeshPhongMaterial({
        map: textureLoader.load('textures/moon.jpg'),
      })
      const mesh = new THREE.Mesh(moonGeometry, material)
      mesh.receiveShadow = true
      mesh.castShadow = true
      return mesh
    },
    InitEarthGeometry(textureLoader, r) {
      const earthGeometry = new THREE.SphereGeometry(r, 16, 16)
      // 高光材质
      const material = new THREE.MeshPhongMaterial({
        map: textureLoader.load('textures/map.jpg'),
        // 镜面反射贴图
        specularMap: textureLoader.load('textures/map.jpg'),
        // 法线贴图的纹理, 改变光照
        normalMap: textureLoader.load('textures/map.jpg'),
      })
      const mesh = new THREE.Mesh(earthGeometry, material)
      // 投射阴影
      mesh.receiveShadow = true
      mesh.castShadow = true
      return mesh
    },
    InitLabelRenderer() {
      const labelRenderer = new CSS2DRenderer()
      labelRenderer.setSize(window.innerWidth, window.innerHeight)
      labelRenderer.domElement.style.position = 'absolute'
      labelRenderer.domElement.style.top = '0px'
      return labelRenderer
    },
    InitMoonLabel(r) {
      const earthDiv = document.createElement('div')
      earthDiv.className = 'label'
      earthDiv.textContent = '月球'
      const earthLabel = new CSS2DObject(earthDiv)
      earthLabel.position.set(0, r + 0.5, 0)
      return earthLabel
    },
    InitEarthLabel(r) {
      const earthDiv = document.createElement('div')
      earthDiv.className = 'label'
      earthDiv.textContent = '地球'
      const earthLabel = new CSS2DObject(earthDiv)
      earthLabel.position.set(0, r + 0.5, 0)
      return earthLabel
    },
    onWindowResize(camera, renderer) {
      // 重置相机宽高比
      camera.aspect = window.innerWidth / window.innerHeight
      // 更新相机投影矩阵
      camera.updateProjectionMatrix()
      // 重置渲染器宽高比
      renderer.setSize(window.innerWidth, window.innerHeight)
    },
  },
}
</script>
<style lang="scss" scoped>
#container {
  background: url('@/assets/imgs/star.webp');
  position: relative;
}
</style>
<style lang="scss">
.label {
  font-size: 18px;
  color: #ffffff;
}
</style>
