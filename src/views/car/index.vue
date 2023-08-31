<template>
  <div>
    <div id="container">
      <div class="select-box">
        <div>车身</div>
        <div
          class="color-bg"
          v-for="color in carBodyColor"
          :key="color"
          :style="{ 'background-color': color }"
          @click="carBodyColorChange(color)"
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader' // 加载模型
export default {
  name: 'learning',
  data() {
    return {
      carBodyColor: [
        'rgba(255,255,255,1)',
        'rgba(255,0,0,1)',
        'rgba(255,255,0,1)',
        'rgba(0,255,0,1)',
        'rgba(255,0,255,1)',
        'rgba(0,255,255,1)',
        'rgba(0,0,255,1)',
      ],
      catchCarBodyMesh: null,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    carBodyColorChange(color) {
      this.catchCarBodyMesh.material.color.set(color)
    },
    init() {
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
      // 设置相机位置
      camera.position.set(3, 2, 6)
      camera.lookAt(0, 2, 0)
      scene.add(camera)
      const gLftLoader = new GLTFLoader()
      // 加载模型
      gLftLoader.load('./model/car/scene.gltf', (gLtf) => {
        const model = gLtf.scene
        model.traverse((child) => {
          console.log('child', child)
          // 车身
          if (child.name === 'Object_6') {
            this.catchCarBodyMesh = child
          }
          if (child.isMesh) {
            child.castShadow = true // 允许投射阴影
            child.receiveShadow = true // 允许接收阴影
          }
        })
        scene.add(model)
      })

      const envLight = new THREE.AmbientLight(0xffffff, 10)
      scene.add(envLight)

      // 创建聚光灯光源
      const lights = [
        [0, 0, 5],
        [0, 5, 5],
        [0, 0, -5],
        [0, 5, -5],
        [-5, 0, -5],
        [0, 5, 0],
        [5, 5, 0],
        [5, 0, 0],
        [5, 0, 5],
        [-5, 0, 0],
        [-5, 5, 0],
        [-5, 0, -5],
      ]
      for (const item of lights) {
        const dirLight = this.InitDirLight(
          new THREE.Vector3(item[0], item[1], item[2])
        )
        scene.add(dirLight)
      }

      // 添加世界坐标辅助器,坐标系长度为5
      const axesHelper = new THREE.AxesHelper(5)
      scene.add(axesHelper)
      // 渲染
      const renderer = new THREE.WebGLRenderer()
      renderer.setSize(window.innerWidth, window.innerHeight)
      document.getElementById('container').appendChild(renderer.domElement)
      // 轨道控制器
      const controls = new OrbitControls(camera, renderer.domElement)
      // 设置带阻尼的惯性
      controls.enableDamping = true
      // 设置阻尼系数
      controls.dampingFactor = 0.05
      // 设置自动旋转
      controls.autoRotate = true
      // 旋转
      this.animate(controls, renderer, scene, camera)
      window.addEventListener('resize', () => {
        this.onWindowResize(camera, renderer)
      })
    },
    InitDirLight(position) {
      const dirLight = new THREE.SpotLight(0xffffff)
      dirLight.position.copy(position)
      dirLight.intensity = 100 // 光源强度
      dirLight.castShadow = true
      return dirLight
    },
    onWindowResize(camera, renderer) {
      // 重置相机宽高比
      camera.aspect = window.innerWidth / window.innerHeight
      // 更新相机投影矩阵
      camera.updateProjectionMatrix()
      // 重置渲染器宽高比
      renderer.setSize(window.innerWidth, window.innerHeight)
    },
    animate(controls, renderer, scene, camera) {
      // 拖动的每一帧重绘
      controls.update()
      requestAnimationFrame(() => {
        this.animate(controls, renderer, scene, camera)
      })
      renderer.render(scene, camera)
    },
  },
}
</script>
<style lang="scss" scoped>
.select-box {
  position: absolute;
  right: 10px;
  top: 0;
  z-index: 99;
  font-size: 18px;
  color: #fff;
}
.color-bg {
  width: 20px;
  height: 20px;
  display: inline-block;
  margin-right: 12px;
  cursor: pointer;
  margin-top: 12px;
}
</style>
