<template>
  <div>
    <headnav></headnav>
    <el-container style="margin: 0px auto;width: 1200px;">
      <el-main style="overflow-y: hidden">
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import headnav from '../components/headnav.vue'

export default {
  name: 'index',
  components: { headnav }
}
</script>

<style scoped>

</style>
