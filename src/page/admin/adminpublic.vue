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
      </el-col>
    </el-row>
    <el-row style="margin-top: 30px;">
      <el-col>
        <div style="font-size: 20px;font-weight: 600;">项目介绍</div>
        <div v-html="content"></div>
      </el-col>
    </el-row>
    <el-row style="float: right;margin-top: 30px;">
      <el-button type="primary" @click="handleApprove(publichelp.id)">通 过</el-button>
      <el-button type="danger" @click="handleDeny(publichelp.id)">拒 绝</el-button>
    </el-row>
  </div>
</template>

<script>
  import { getPublicDetailById, approve, deny } from '../../service/api'
  export default {
    name: "adminpublic",
    data () {
      return {
        id : '',
        publichelp: {},
        active: '',
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
      handleApprove (id) {
        this.$confirm('审核是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          approve(id).then(re => {
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
          deny(id).then(re => {
            this.$router.go(-1)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
