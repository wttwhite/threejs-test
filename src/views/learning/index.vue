<template>
  <div>
    <!-- <main01 /> -->
    <!-- <main02 /> -->
    <!-- <main03 /> -->
    <!-- <main04 /> -->
    <!-- <christmas /> -->
    <!-- <earthVue /> -->
    <houseVue />
  </div>
</template>
<script>
// 基础
import main01 from './main01.vue'
// 父元素与子元素之间的位置
import main02 from './main02.vue'
// 创建GUI
import main03 from './main03.vue'
// 几何体，BufferGeometry
import main04 from './main04.vue'
import christmas from './christmas.vue'
import earthVue from './earth/earth.vue'
import houseVue from './house'
export default {
  name: 'learning',
  components: { main01, main02, main03, main04, christmas, earthVue, houseVue },
  data() {
    return {}
  },
  mounted() {},
  methods: {},
}
</script>
<style lang="scss" scoped></style>
