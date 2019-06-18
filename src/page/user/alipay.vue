<!-- 支付宝支付页面 -->
<template>
  <el-row type="flex" class="row-bg" justify="center">
    <el-col :span="15">
      <el-card :body-style="{ padding: '0px' }">
        <div slot="header">
          <h1>收款方：校园爱心捐赠平台</h1>
        </div>
        <div class="alipay">
          <p class="sao">扫一扫付款(元)</p>
          <p class="money">{{ money }}</p>
          <el-row type="flex" class="row-bg" justify="center">
            <el-col :lg="7" :xl="6">
              <el-card>
                <div slot="header">
                  <el-row type="flex" class="row-bg" justify="space-around">
                    <el-col><QRCode :url="url" :timeout="timeout"></QRCode></el-col>
                  </el-row>
                </div>
                <el-row>
                  <el-col>
                    <img src="static/image/sao.png" style="margin-top: 5px"/>
                  </el-col>
                  <el-col>
                    <span class="open">打开手机支付宝<br/>扫一扫继续付款</span>
                  </el-col>
                </el-row>
              </el-card>
            </el-col>
          </el-row>
          <p>请于 <font style="color: #FF1F40;">{{ time }}</font> 秒 内完成支付</p>
          <div slot="footer" style="margin-bottom: 50px">
            <!--<el-button type="primary" style="margin-bottom: 5%;" :disabled="disable">确认支付完成</el-button>-->
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
  import { getCookie, setCookie } from '../../utils/util'
  import QRCode from '../../components/qrcode'
  import { getPayState } from '../../service/api'

  export default {
    name: 'alipay',
    // 二维码子组件
    components: { QRCode },
    data () {
      return {
        // 金额
        money: '',
        // 倒计时
        time: '',
        // 定时器
        timer: null,
        // 是否禁用
        disable: false,
        // 二维码地址
        url: '',
        // 传到二维码组件的参数
        timeout: 1,
        // 支付id
        payId: '',
        flag: 1
      }
    },
    watch: {
      // 监听倒计时的变化，time每秒变化一次
      time (val) {
        if (val > 0) {
          // 修改payTime的cookie
          setCookie('payTime', val, val)
          // 每秒访问一次后台支付状态是否改变
          getPayState(this.payId).then(re => {
            if (re.code == 1){
              if (this.flag === 1) {
                this.$message({
                  type: 'success',
                  message: '捐赠成功！'
                });
                this.flag = 0
              }
              this.time = 0
              this.$router.push({path: '/home'})
            }
          })
        }
      }
    },
    methods: {
      // 设置定时器
      setTime () {
        this.timer = setInterval(() => {
          this.disable = false
          this.time = this.time - 1
          if (this.time === 0) {
            // 清除定时器
            clearInterval(this.timer)
            this.disable = true
            this.timeout = 2
          }
        }, 1000)
      }
    },
    created () {
      // 从cookie中获取数据
      this.money = getCookie('payMoney')
      this.comment = getCookie('comment')
      // pay页面跳转到本页面带的参数
      this.payId = this.$route.query.payId
      this.setTime()
      this.url = getCookie("qrCode");
      this.time = getCookie('payTime')
      if (this.time === null || this.time < 0) {
        this.$router.push({path: '/home'})
      }
    }
  }
</script>
<style scoped>
  .alipay{
    text-align: center;
  }
  /* 扫一扫图标*/
  .alipay .sao{
    font-size: 14px;
    color: rgba(164, 164, 164, 0.62);
  }
  /* 金额 */
  .alipay .money{
    font-size: 36px;
    font-weight: 700;
    color: rgba(255, 31, 64, 0.67);
    margin: 0px;
  }
  /* 打开支付宝....文字样式*/
  .alipay .open{
    font-size: 14px;
  }
</style>
