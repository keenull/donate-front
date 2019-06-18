<!-- 二维码子路由页面 -->
<template>
  <div>
    <div id="qrcode" v-show="timeout1 === 1"></div>
    <div v-show="timeout1 === 2" class="timeout">二维码已失效</div>
    <div v-show="timeout1 === 3" class="timeout">支付成功</div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
export default {
  name: 'qrcode',
  // 父路由传过来的参数(需要生成二维码的地址，显示哪个图片)
  props: ['url', 'timeout'],
  data () {
    return {
      timeout1: this.timeout
    }
  },
  methods: {
    // 配置二维码信息
    qrcode () {
      /* eslint-disable no-new */
      new QRCode('qrcode', {
        width: 150,
        height: 150,
        text: this.url,
        colorDark: '#000',
        colorLight: '#fff'
      })
    }
  },
  mounted () {
    this.qrcode()
  },
  watch: {
    timeout (val) {
      this.timeout1 = val
    }
  }
}
</script>
<style scoped>
  .timeout{
    height: 150px;
    width: 150px;
    line-height: 150px;
    font-weight: 800;
    color: red;
  }
</style>
