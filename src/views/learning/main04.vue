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

      const geo = new THREE.BufferGeometry()
      // 创建顶点数据，顶点是有序的，每三个为一个顶点，逆时针为正面
      // const vertices = new Float32Array([
      //   -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0,

      //   1.0, 1.0, 0.0, -1.0, 1.0, 0.0, -1.0, -1.0, 0.0,
      // ])
      // 使用索引绘制
      const vertices = new Float32Array([
        -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0.0,
      ])
      geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
      // 创建索引，共用顶点
      const indices = new Uint16Array([0, 1, 2, 2, 3, 0])
      // 创建索引属性
      geo.setIndex(new THREE.BufferAttribute(indices, 1))

      const material = new THREE.MeshBasicMaterial({
        color: '#ff0000',
        side: THREE.DoubleSide, // 两面都可以看到
      })
      const material1 = new THREE.MeshBasicMaterial({
        color: '#00ff00',
        side: THREE.DoubleSide, // 两面都可以看到
        wireframe: true,
      })
      // 设置两个顶点组，形成两个材质
      geo.addGroup(0, 3, 0) // 从第0个顶点开始，3个顶点，使用第一个材质
      geo.addGroup(3, 3, 1)

      const panel = new THREE.Mesh(geo, [material, material1])
      scene.add(panel)
      // 渲染
      const renderer = new THREE.WebGLRenderer()
      renderer.setSize(window.innerWidth, window.innerHeight)
      document.getElementById('container').appendChild(renderer.domElement)
      const controls = new OrbitControls(camera, renderer.domElement)
      // 旋转
      this.animate(controls, renderer, scene, camera)
    },
    animate(controls, renderer, scene, camera) {
      // 拖动的每一帧重绘
      controls.update()
      requestAnimationFrame(() => {
        this.animate(controls, renderer, scene, camera)
      })
      //   cube.rotation.x += 0.01
      //   cube.rotation.y += 0.01
      renderer.render(scene, camera)
    },
  },
}
</script>
<style lang="scss" scoped></style>
