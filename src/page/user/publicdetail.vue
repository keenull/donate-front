<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-image :src="publichelp.file" lazy style="height: 250px;width: 600px;" fit="fill" />
      </el-col>
      <el-col :span="11" :offset="1">
        <el-row>
          <el-col :span="12">预筹：<el-tag type="danger">{{ publichelp.goal }}</el-tag></el-col>
          <el-col :span="12">已筹：<el-tag type="success">{{ publichelp.completed }}</el-tag></el-col>
        </el-row>
        <el-row style="margin-top: 20px;">
          <el-col :span="12">
            <el-tag type="success" style="cursor: pointer" @click="toPay">我要捐款</el-tag>
          </el-col>
          <el-col :span="12">
            <span>捐款人次：{{ publichelp.appealCount }}</span>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row style="margin-top: 30px;">
      <el-col>
        <div style="font-size: 20px;font-weight: 600;">项目介绍</div>
        <div v-html="content"></div>
      </el-col>
    </el-row>
    <Pay :payshow="payshow" @callPayClose="callPayClose" :appealId="appealId"></Pay>
  </div>
</template>

<script>
  import { getPublicDetailById } from '../../service/api'
  import Pay from '../../components/pay'
  import { getCookie } from '../../utils/util'
  export default {
    name: "publicdetail",
    components: { Pay },
    data () {
      return {
        id : '',
        publichelp: {},
        active: '',
        payshow: false,
        appealId: '',
        content: ''
      }
    },
    created () {
      this.id = this.$route.query.id
      this.detail()
    },
    methods : {
      detail () {
        getPublicDetailById(this.id).then(re => {
          this.visibleSync = true
          this.publichelp = re
          this.content = re.content
        })
      },
      toPay () {
        let flag = getCookie('token')
        if (flag) {
          this.payshow = true
          this.appealId = this.id
        } else {
          this.$router.push({path: '/login'})
        }
      },
      // 关闭我要捐款弹框回调函数
      callPayClose (val) {
        this.payshow = val
      }
    }
  }
</script>

<style scoped>

</style>
