<!-- 导航栏子路由页面-->
<template>
  <div style="background: #334157;">
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="20">
        <el-menu :default-active="$route.path"
                 mode="horizontal"
                 background-color="#334157" text-color="#fff" active-text-color="#ffd04b"
                 style="margin-left: 15%"
                 router>
          <el-menu-item index="/home">首页</el-menu-item>
          <el-menu-item index="/personhelp">个人求助</el-menu-item>
          <el-menu-item index="/publicproject">公益项目</el-menu-item>
          <el-menu-item index="/record">捐款记录</el-menu-item>
          <el-submenu index="">
            <template slot="title">已完成捐赠</template>
            <el-menu-item index="/publicfinished">公益</el-menu-item>
            <el-menu-item index="/personfinished">个人</el-menu-item>
          </el-submenu>
          <el-menu-item index="/forhelp">申请求助</el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="4">
        <div class="otherMenu">
          <el-menu mode="horizontal" background-color="#334157" v-show="isLogin" router>
            <el-menu-item v-for="menu in notLoginMenu" :key="menu.id" :index="menu.url">{{ menu.name }}</el-menu-item>
          </el-menu>
          <el-menu mode="horizontal" background-color="#334157" v-show="!isLogin">
            <el-menu-item index="21" @click="logout">退出</el-menu-item>
            <el-dropdown>
              <span class="el-dropdown-link">
                <el-menu-item index="1">欢迎您：{{ userName }}</el-menu-item>
              </span>
              <el-dropdown-menu slot="dropdown">
                <router-link to="/personapply"><el-dropdown-item>求助记录</el-dropdown-item></router-link>
                <router-link to="/persondonate"><el-dropdown-item>捐赠记录</el-dropdown-item></router-link>
                <div @click="toQualificate"><el-dropdown-item>资质审核</el-dropdown-item></div>
              </el-dropdown-menu>
            </el-dropdown>
          </el-menu>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { menus, notLogin } from '../constant/data'
  import { getCookie } from '../utils/util'
  export default {
    name: 'headnav',
    inject: ['reload'],
    data () {
      return {
        // 导航栏菜单
        menus: [],
        // 未登录菜单
        notLoginMenu: [],
        isLogin: false
      }
    },
    created () {
      this.menus = menus
      this.notLoginMenu = notLogin
      this.init()
    },
    computed: {
      // 计算userName的值
      userName () {
        if (this.$store.state.user) {
          if (typeof (this.$store.state.user) === 'object') {
            return this.$store.state.user.username
          } else {
            return JSON.parse(this.$store.state.user).username
          }
        } else {
          // this.$message('请重新登录')
        }
      }
    },
    methods: {
      init () {
        let flag = getCookie('token')
        flag === null ? this.isLogin = true : this.isLogin = false
      },
      // 退出登录
      logout () {
        // delCookie('token')
        // this.reload()
        this.$store.commit('logout')
        this.isLogin = true
        this.$router.push("/home")
      },
      toQualificate () {
        let flag = this.$store.state.user.passed
        if (flag === 0) {
          this.$router.push({path: '/qualificate'})
        } else if(flag === 1){
          this.$message.warning('您已通过审核')
        }else{
          this.$message.warning('审核中！')
        }
      }
    }
  }
</script>
<style scoped>
  .otherMenu .el-menu--horizontal>.el-menu-item{
    color: rgb(255, 255, 255);
    border-bottom: solid 0px #e6e6e6;
  }
  /* 导航栏border设置为0px*/
  .row-bg .el-menu.el-menu--horizontal {
    border-bottom: solid 0px #e6e6e6;
  }
</style>
