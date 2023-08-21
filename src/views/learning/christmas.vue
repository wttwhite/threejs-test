<template>
  <div><div id="container"></div></div>
</template>
<script>
import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader' // 加载模型
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader' // 解压模型
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { Water } from 'three/examples/jsm/objects/Water2'
export default {
  name: 'christmas',
  data() {
    return {
      sceneIndex: 0,
    }
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
      //   camera.position.set(-3.23, 2.98, 4.06)
      camera.position.set(-3.23, 3, 4.06)
      //   camera.updateProjectionMatrix() // 修改宽高比之后要更新投影矩阵
      const renderer = new THREE.WebGLRenderer({
        antialias: true, // 抗锯齿
      })
      renderer.setSize(window.innerWidth, window.innerHeight)
      document.getElementById('container').appendChild(renderer.domElement)
      // 设置色调映射
      //   renderer.outputEncoding = THREE.sRGBEncoding
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 0.5 // 调节亮度
      renderer.shadowMap.enabled = true // 允许阴影
      renderer.physicallyCorrectLights = true

      // 初始化控制器，摄像机和画布
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.target.set(-8, 2, 0) // 摄像头看向的位置
      controls.enableDamping = true // 阻尼

      // 初始化loader
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath('./draco/')
      const gLftLoader = new GLTFLoader()
      gLftLoader.setDRACOLoader(dracoLoader)

      // 加载模型
      gLftLoader.load('./model/christmas/scene.glb', (gLtf) => {
        const model = gLtf.scene
        // 隐藏原本的水面
        // 遍历场景里的所有元素
        model.traverse((child) => {
          if (child.name === 'Plane') {
            child.visible = false
          }
          if (child.isMesh) {
            child.castShadow = true // 允许投射阴影
            child.receiveShadow = true // 允许接收阴影
          }
        })
        scene.add(model)
      })

      // 加载环境纹理, 动态图片文件
      const rgbLoader = new RGBELoader()
      rgbLoader.load('./textures/christmas/sky.hdr', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping // 反射
        // texture.mapping = THREE.EquirectangularRefrectionMapping // 折射
        scene.background = texture
        scene.environment = texture
      })

      // 加载水面效果
      const waterGeometry = new THREE.CircleGeometry(300, 32)
      const water = new Water(waterGeometry, {
        textureWidth: 1024,
        textureHeight: 1024,
        color: 0xeeeeff,
        flowDirection: new THREE.Vector2(1, 1),
        scale: 100,
      })
      water.rotation.x = -Math.PI / 2
      water.position.y = -0.4
      scene.add(water)

      // 添加点光源
      //   const pointLight = new THREE.PointLight(0xffffff, 10)
      //   pointLight.position.set(0.1, 2.4, 0)
      //   pointLight.castShadow = true
      //   scene.add(pointLight)
      const radius = 3
      const pointLightArr = []
      const pointLightGroup = new THREE.Group()
      pointLightGroup.position.set(-8, 2.5, -1.5)
      for (let i = 0; i < 3; i++) {
        // 创建球体当灯泡
        const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32)
        const material = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          emissive: 0xffffff,
          emissiveIntensity: 10,
        })
        const sphere = new THREE.Mesh(sphereGeometry, material)
        sphere.position.set(
          radius * Math.cos((i * 2 * Math.PI) / 3),
          Math.cos((i * 2 * Math.PI) / 3),
          radius * Math.sin((i * 2 * Math.PI) / 3)
        )
        const pointLight = new THREE.PointLight(0xffffff, 50)
        pointLightArr.push(sphere)
        sphere.add(pointLight)
        pointLightGroup.add(sphere)
      }
      scene.add(pointLightGroup)
      // 使用补间函数，从0到2Π，试灯泡旋转
      const options = {
        angle: 0,
      }
      gsap.to(options, {
        angle: Math.PI * 2,
        duration: 10, // 10s转一圈
        repeat: -1,
        ease: 'linear',
        onUpdate: () => {
          pointLightGroup.rotation.y = options.angle
          pointLightArr.forEach((item, i) => {
            item.position.y = Math.cos(
              (i * 2 * Math.PI) / 3 + options.angle * 5
            )
          })
        },
      })

      // 添加光源--平行光 , 没有光，模型一片漆黑
      const light = new THREE.DirectionalLight(0xffffff, 1)
      light.position.set(0, 50, 0)
      scene.add(light)

      let scenes = [
        {
          text: '圣诞快乐',
          callback: () => {
            // 执行函数切换位置
            this.translateCamera(
              new THREE.Vector3(-3.23, 3, 4.06),
              new THREE.Vector3(-8, 2, 0),
              camera,
              controls
            )
          },
        },
        {
          text: '感谢在这么大的世界里遇见了你',
          callback: () => {
            // 执行函数切
            this.translateCamera(
              new THREE.Vector3(7, 0, 23),
              new THREE.Vector3(0, 0, 0),
              camera,
              controls
            )
          },
        },
        {
          text: '愿与你探寻世界的每一个角落',
          callback: () => {
            // 执行函数切
            this.translateCamera(
              new THREE.Vector3(10, 3, 0),
              new THREE.Vector3(5, 2, 0),
              camera,
              controls
            )
          },
        },
        {
          text: '愿将天上的星星送给你',
          callback: () => {
            // 执行函数切
            this.translateCamera(
              new THREE.Vector3(7, 0, 23),
              new THREE.Vector3(0, 0, 0),
              camera,
              controls
            )
            // makeHeart()
          },
        },
        {
          text: '愿疫情结束，大家健康快乐！',
          callback: () => {
            // 执行函数切
            this.translateCamera(
              new THREE.Vector3(-20, 1.3, 6.6),
              new THREE.Vector3(5, 2, 0),
              camera,
              controls
            )
          },
        },
      ]

      let isAnimate = false
      // 监听鼠标滚轮事件
      window.addEventListener(
        'wheel',
        (e) => {
          if (isAnimate) return
          isAnimate = true
          if (e.deltaY > 0) {
            this.sceneIndex++
            if (this.sceneIndex > scenes.length - 1) {
              this.sceneIndex = 0
              //   restoreHeart()
            }
          }
          scenes[this.sceneIndex].callback()
          setTimeout(() => {
            isAnimate = false
          }, 1000)
        },
        false
      )

      // 旋转
      this.animate(controls, renderer, scene, camera)
      window.addEventListener('resize', () => {
        this.onWindowResize(camera, renderer)
      })
    },
    translateCamera(position, target, camera, controls) {
      // 使用补间动画移动相机
      let timeLine1 = gsap.timeline()
      let timeline2 = gsap.timeline()
      timeLine1.to(camera.position, {
        x: position.x,
        y: position.y,
        z: position.z,
        duration: 1,
        ease: 'power2.inOut',
      })

      timeline2.to(controls.target, {
        x: target.x,
        y: target.y,
        z: target.z,
        duration: 1,
        ease: 'power2.inOut',
      })
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
<style lang="scss" scoped></style>
