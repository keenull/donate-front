<template>
  <div>
    <el-row  type="flex" class="row-bg" justify="center"style="margin-top: 30px;">
      <el-col :span="6">
        学校名字: {{verifyData.colleague}}
      </el-col>
    </el-row>
    <el-row  type="flex" class="row-bg" justify="center" style="margin-top: 30px;">
      <el-col :span="6">
        学院名称: {{verifyData.school}}
      </el-col>
    </el-row>
    <el-row  type="flex" class="row-bg" justify="center" style="margin-top: 30px;">
      <el-col :span="6">
         学   号   : {{verifyData.studentId}}
      </el-col>
    </el-row>
    <el-row style="margin-top: 30px;"  type="flex" class="row-bg" justify="space-around">
      <el-col :span="10">
        <el-image :src="verifyData.file" lazy style="height: 250px;width: 600px;" fit="fill" />
      </el-col>
      <el-col :span="10">
        <el-image :src="verifyData.img" lazy style="height: 250px;width: 600px;" fit="fill" />
      </el-col>
    </el-row>
    <el-row style="float: right;margin-top: 30px;">
      <el-button type="primary" @click="handleApprove(verifyData.id)">通 过</el-button>
      <el-button type="danger" @click="handleDeny(verifyData.id)">拒 绝</el-button>
    </el-row>
  </div>
</template>

<script>
  import { getQualificate, qualificateSuccess, qualificateFail } from '../../service/api'

  export default {
    name: "adminQualificate",
    data () {
      return {
        id : '',
        verifyData: {},
      }
    },
    created () {
      this.id = this.$route.query.id
      this.detail()
    },
    methods : {
      detail () {
        getQualificate(this.id).then(re => {
          this.visibleSync = true
          this.verifyData = re
        })
      },
      handleApprove (id) {
        this.$confirm('审核是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          qualificateSuccess(id).then(re => {
            this.$router.go(-1)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },
      handleDeny (id) {
        this.$confirm('审核是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          qualificateFail(id).then(re => {
            this.$router.go(-1)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },
    }
  }
</script>

<style scoped>

</style>
