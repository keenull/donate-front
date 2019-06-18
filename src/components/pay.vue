<!-- 点击我要捐款子路由页面 -->
<template>
  <el-dialog title="捐款" :visible.sync="paysncshow" @close="closePayDialog" width="40%">
    <el-form size='size' label-position="right" label-width="120px" :rules="rule" :model="payData" ref="payForm">
      <el-form-item label='捐赠金额:'>
        <el-col :lg="13" :xl="12">
          <el-select v-model="chooseMoney" placeholder="请选择" @change="change">
            <el-option v-for="item in donationAmount" :key="item.id" :label="item.amount" :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label='请输入金额:' prop="money" v-show="chooseMoney === 5">
        <el-col :lg="13" :xl="12">
          <el-input v-model.trim="payData.money" clearable @change="vaildChange"></el-input>
        </el-col>
      </el-form-item>
      <!--<el-form-item label='您的邮箱:' prop="mail">-->
      <!--<el-col>-->
      <!--<el-col :lg="13" :xl="12">-->
      <!--<el-input v-model.trim="payData.mail" clearable></el-input>-->
      <!--</el-col>-->
      <!--<el-col :lg="11" :xl="12">-->
      <!--<span>（项目动态向此邮箱反馈）</span>-->
      <!--</el-col>-->
      <!--</el-col>-->
      <!--</el-form-item>-->
      <el-form-item label='我的祝福:'>
        <el-col :lg="18" :xl="14">
          <el-input type="textarea" :rows="2" v-model="payData.comment">
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item label='支付方式:'>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-menu mode="horizontal" @select="select" :default-active="payActive">
            <el-col :span="8"><el-menu-item index="1"><img src="static/image/alipay@2x.png"></el-menu-item></el-col>
            <!--<el-col :span="8"><el-menu-item index="2"><img src="static/image/weixinpay@2x.png"></el-menu-item></el-col>-->
            <!--<el-col :span="8"><el-menu-item index="3"><img src="static/image/qqpay.png"></el-menu-item></el-col>-->
          </el-menu>
        </el-row>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closePayDialog" size="mini">取 消</el-button>
      <el-button type="primary" @click="pay" size="mini">立即支付</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { donationAmount } from '../constant/data'
  import { getPay } from '../service/api'
  import { setCookie } from '../utils/util'
  // 导出模块
  export default {
    // 模块名字
    name: 'pay',
    // 父路由传过来的参数(控制是否显示本页面、捐款项目id)
    props: ['payshow', 'appealId'],
    // 模块数据
    data () {
      // 数据
      return {
        // 控制本页面是否显示
        paysncshow: this.payshow,
        // 默认选中支付宝为付款方式
        payActive: '',
        // 表单数据model
        payData: {
          money: '',
          comment: '',
          mail: '',
          custom: false,
          appealId: '',
          orderId: '',
        },
        // 捐赠金额下拉框数据
        donationAmount: donationAmount,
        // 默认选择第一个捐赠金额0.10
        chooseMoney: '',
        // 表单校验规则
        rule: {
          money: [],
          mail: [{ pattern: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/, message: '邮箱不符合规则', trigger: 'blur' }]
        }
      }
    },
    create () {},
    methods: {
      init () {
        this.payActive = '1'
        this.chooseMoney = 1
        this.payData.mail = this.getMail()
        this.payData.money = ''
        this.payData.comment = ''
        this.payData.appealId = this.appealId
        this.payData.orderId = new Date().getTime().toString()
      },
      // 获取登录用户的邮箱
      getMail () {
        if (this.$store.state.user) {
          if (typeof (this.$store.state.user) === 'object') {
            return this.$store.state.user.mail
          } else {
            return JSON.parse(this.$store.state.user).mail
          }
        }
      },
      closePayDialog () {
        this.paysncshow = false
        this.$emit('callPayClose', this.paysncshow)
      },
      // 切换捐赠金额
      change (val) {
        if (val === 5) {
          this.rule.money = [{ required: true, message: '请输入捐赠金额', trigger: 'blur' },
            { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确的金额(支持两位小数)', trigger: 'blur' }]
        } else {
          this.rule.money = []
          this.payData.money = ''
          this.$refs.payForm.clearValidate()
        }
      },
      // 切换支付方式
      select (index, indexPath) {
        this.payActive = index
      },
      // 自定义金额变化时触发表单校验
      vaildChange () {
        this.$refs.payForm.validate((valid) => {})
      },
      // 点击立即支付
      pay () {
        this.$refs.payForm.validate((valid) => {
          if (valid) {
            // 构造传入后台参数
            this.constructParam()
            getPay(this.payData).then(re => {
              // 设置cookie
              setCookie('payMoney', this.payData.money, 300)
              setCookie('payTime', 300, 300)
              setCookie('comment', this.payData.comment, 300)
              setCookie('payId', re.id, 300)
              setCookie('qrCode', re.qrCode, 300)
              // 路由跳转
              this.$router.push({path: '/alipay', query: {payId: re.id}})
            })
          }
        })
      },
      // 构造参数
      constructParam () {
        if (this.chooseMoney !== 5) {
          this.payData.custom = false
          this.payData.money = this.donationAmount[this.chooseMoney - 1].amount.replace('￥ ', '')
        } else {
          this.payData.custom = true
        }
      }
    },
    watch: {
      // 监听父路由传到本页面的参数变化
      payshow (val) {
        this.init()
        this.paysncshow = val
      }
    }
  }
</script>
// scoped 样式只在本组件使用
<style scoped>
  /**
   * 导入css样式组件
   * @import '../assets/css/components/index.css';
   */
  .el-menu.el-menu--horizontal {
    border-bottom: solid 0px #e6e6e6;
  }
  /*.el-menu-item.is-active {*/
  /*border: solid 1px #409eff;*/
  /*}*/
</style>
