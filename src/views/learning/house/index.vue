<template>
  <div>
    <div id="container"></div>
  </div>
</template>
<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'
export default {
  name: 'house',
  data() {
    return {}
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const scene = new THREE.Scene()
      const camera = this.initCamera()
      scene.add(camera)
      // 房间立方体
      const livingRoom = new CreateRoom('客厅', 4, './textures/house/living')
      scene.add(livingRoom.cube)
      const kitchenPosition = new THREE.Vector3(0, 0, -10)
      const kitchen = new CreateRoom(
        '厨房',
        2,
        './textures/house/kitchen',
        kitchenPosition
      )
      scene.add(kitchen.cube)
      const kitchenLabel = new CreateLabel(
        '厨房',
        new THREE.Vector3(4.5, 0, -3)
      )
      scene.add(kitchenLabel.sprite)
      kitchenLabel.AddClick(camera, kitchenLabel.sprite)
      kitchenLabel.onClick(() => {
        // 移动相机位置
        gsap.to(camera.position, {
          duration: 1,
          x: kitchenPosition.x,
          y: kitchenPosition.y,
          z: kitchenPosition.z,
        })
      })
      // 添加世界坐标辅助器,坐标系长度为5
      const axesHelper = new THREE.AxesHelper(5)
      scene.add(axesHelper)
      // 渲染
      const renderer = this.initRenderer()
      // 轨道控制器
      //   const controls = this.initControls(camera, renderer)
      let isMouseDown = false
      window.addEventListener('mousedown', () => {
        isMouseDown = true
      })
      window.addEventListener('mouseup', () => {
        isMouseDown = false
      })
      window.addEventListener('mouseout', () => {
        isMouseDown = false
      })
      window.addEventListener('mousemove', (event) => {
        if (isMouseDown) {
          camera.rotation.y += event.movementX * 0.01
          camera.rotation.x += event.movementY * 0.01
          // 修改默认的旋转顺序
          camera.rotation.order = 'YXZ'
        }
      })
      // 旋转
      this.animate(null, renderer, scene, camera)
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
      //   controls.update()
      requestAnimationFrame(() => {
        this.animate(controls, renderer, scene, camera, cube)
      })
      renderer.render(scene, camera)
    },
    initCamera() {
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
      // 设置相机位置
      camera.position.z = 0.1
      camera.lookAt(0, 0, 0)
      return camera
    },
    initRenderer() {
      const renderer = new THREE.WebGLRenderer()
      renderer.setSize(window.innerWidth, window.innerHeight)
      document.getElementById('container').appendChild(renderer.domElement)
      return renderer
    },
    initControls(camera, renderer) {
      const controls = new OrbitControls(camera, renderer.domElement)
      // 设置带阻尼的惯性
      controls.enableDamping = true
      // 设置阻尼系数
      controls.dampingFactor = 0.05
      // 设置自动旋转
      //   controls.autoRotate = true
      return controls
    },
  },
}
class CreateRoom {
  constructor(
    name,
    roomIndex,
    textureUrl,
    position = new THREE.Vector3(),
    euler = new THREE.Euler(0, 0, 0)
  ) {
    this.name = name
    this.roomIndex = roomIndex
    this.textureUrl = textureUrl
    this.position = position
    this.euler = euler
    this.cube = null
    this.initRoom()
  }
  initRoom() {
    const geometry = new THREE.BoxGeometry(10, 10, 10)
    const arr = [
      `${this.roomIndex}_l`,
      `${this.roomIndex}_r`,
      `${this.roomIndex}_u`,
      `${this.roomIndex}_d`,
      `${this.roomIndex}_b`,
      `${this.roomIndex}_f`,
    ]
    const boxMaterials = []
    arr.forEach((item) => {
      // 纹理加载
      let texture = new THREE.TextureLoader().load(
        `${this.textureUrl}/${item}.jpg`
      )
      // 创建材质
      if (item === `${this.roomIndex}_u` || item === `${this.roomIndex}_d`) {
        texture.rotation = Math.PI
        texture.center = new THREE.Vector2(0.5, 0.5)
        boxMaterials.push(new THREE.MeshBasicMaterial({ map: texture }))
      } else {
        boxMaterials.push(new THREE.MeshBasicMaterial({ map: texture }))
      }
    })
    const cube = new THREE.Mesh(geometry, boxMaterials)
    cube.position.copy(this.position)
    cube.rotation.copy(this.euler)
    cube.geometry.scale(1, 1, -1)
    this.cube = cube
  }
}
class CreateLabel {
  constructor(label, position = new THREE.Vector3()) {
    this.label = label
    this.sprite = null
    this.init(position)
    this.callbacks = []
  }
  // 创建精灵文字
  init(position) {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 1024
    const context = canvas.getContext('2d')
    context.fillStyle = 'rgba(100,100,100,0.7)'
    context.fillRect(0, 256, 1024, 512) // 位置尺寸
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.font = 'bold 200px Arial'
    context.fillStyle = 'white'
    context.fillText(this.label, 512, 512)
    const texture = new THREE.CanvasTexture(canvas)
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
    })
    const sprite = new THREE.Sprite(material)
    sprite.position.copy(position)
    this.sprite = sprite
  }
  // 添加投射光线
  AddClick(camera, sprite) {
    const mouse = new THREE.Vector2() // 二维向量
    const raycaster = new THREE.Raycaster() // 投射光线器
    window.addEventListener('click', (event) => {
      console.log('11111111111111', event.clientX)
      console.log('11111111111111', event.clientY)
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1 // 归一化-1 ~ 1
      mouse.y = (event.clientY / window.innerHeight) * 2 - 1
      raycaster.setFromCamera(mouse, camera)
      // 检测精灵
      const intersects = raycaster.intersectObject(sprite)
      console.log('intersects', intersects)
      if (intersects.length > 0) {
        this.callbacks.forEach((callback) => {
          callback()
        })
      }
    })
  }
  onClick(callback) {
    this.callbacks.push(callback)
  }
}
</script>
<style lang="scss" scoped></style>
