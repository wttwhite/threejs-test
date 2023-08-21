export const InitCamera = (THREE) => {
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  // 设置相机位置
  camera.position.set(5, 5, 10)
  camera.lookAt(0, 0, 0)
  return camera
}
export const InitRender = (THREE) => {
  const renderer = new THREE.WebGLRenderer({
    alpha: true, // 透明
    antialias: true, // 抗锯齿
    // logarithmicDepthBuffer: true, // 对数深度缓存，两个面靠太近了，避免闪烁
  })
  // 像素比
  renderer.setPixelRatio(window.devicePixelRatio)
  // 尺寸大小
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 渲染阴影
  renderer.shadowMap.enabled = true

  return renderer
}
export const InitControls = (OrbitControls, camera, canvas) => {
  const controls = new OrbitControls(camera, canvas)
  // 设置带阻尼的惯性
  controls.enableDamping = true
  // 设置阻尼系数
  controls.dampingFactor = 0.05
  // 设置自动旋转
  //   controls.autoRotate = true
  return controls
}
