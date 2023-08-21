<template>
  <div>
    <div id="container"></div>
  </div>
</template>
<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
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
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
      cube.position.set(2, 0, 0)
      const cubeMaterial2 = new THREE.MeshBasicMaterial({ color: 0xff0000 })
      const father = new THREE.Mesh(cubeGeometry, cubeMaterial2)
      father.position.set(-2, 0, 0)
      father.add(cube)
      scene.add(father)
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

      // 旋转
      this.animate(controls, renderer, scene, camera, cube)
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
