<template>
  <div>
    <div id="container"></div>
  </div>
</template>
<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
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
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
      // 设置相机位置
      camera.position.set(2, 2, 5)
      camera.lookAt(0, 0, 0)
      scene.add(camera)
      // 立方体
      const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
      const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 })
      // 线框模式
      cubeMaterial.wireframe = true
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
      // 旋转
      cube.rotation.x = Math.PI / 4
      cube.position.set(2, 0, 0)
      // 缩放
      //   cube.scale.set(2, 4, 2)
      scene.add(cube)
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
      //   controls.autoRotate = true

      let eventObj = {
        Fullscreen: function () {
          document.body.requestFullscreen()
        },
        ExitFullscreen: function () {
          document.exitFullscreen()
        },
      }
      const gui = new GUI()
      gui.add(eventObj, 'Fullscreen').name('全屏')
      gui.add(eventObj, 'ExitFullscreen')
      // 控制立方体位置
      //   gui.add(cube.position, 'x', -5, 5).name('立方体x位置')
      //   gui.add(cube.position, 'x').min(-10).max(10).step(1).name('立方体x位置')
      let folder = gui.addFolder('立方体位置')
      folder
        .add(cube.position, 'x')
        .min(-10)
        .max(10)
        .step(1)
        .name('立方体x位置')
      folder
        .add(cube.position, 'y')
        .min(-10)
        .max(10)
        .step(1)
        .name('立方体y位置')
        .onChange((val) => {
          console.log('立方体位置', val)
        })
        .onFinishChange((val) => {
          // 拖拽完才打印
          console.log('立方体位置11', val)
        })
      gui.add(cubeMaterial, 'wireframe').name('线框模式')
      let colorParams = {
        cubeColor: '#ff0000',
      }
      gui
        .addColor(colorParams, 'cubeColor')
        .name('立方体颜色')
        .onChange((val) => {
          cube.material.color.set(val)
        })

      // 旋转
      this.animate(controls, renderer, scene, camera, cube)
      window.addEventListener('resize', () => {
        this.onWindowResize(camera, renderer)
      })
    },
    onWindowResize(camera, renderer) {
      // 重置相机宽高比
      camera.aspect = window.innerWidth / window.innerHeight
      // 更新相机投影矩阵
      camera.updateProjectionMatrix()
      // 重置渲染器宽高比
      renderer.setSize(window.innerWidth, window.innerHeight)
    },
    animate(controls, renderer, scene, camera, cube) {
      // 拖动的每一帧重绘
      controls.update()
      requestAnimationFrame(() => {
        this.animate(controls, renderer, scene, camera, cube)
      })
      //   cube.rotation.x += 0.01
      //   cube.rotation.y += 0.01
      renderer.render(scene, camera)
    },
  },
}
</script>
<style lang="scss" scoped></style>
