<template>
  <el-container>
      <el-aside width="300px" style="overflow-x: hidden; overflow-y: auto; height: 100vh;">
        <el-menu :default-active="defaultActive" class="el-menu-vertical-demo"
          @open="handleOpen" @close="handleClose" @select="handleSelect" background-color="#3f51b5"
          text-color="#fff" active-text-color="#ffd04b" router>
          <el-submenu :index="index" v-for="(pre, index) in navbar" :key="index">
            <template slot="title">
              <i :class="pre.icon"></i>
              <span>{{ pre.name }}</span>
            </template>
            <el-menu-item-group v-for="(child, val) in pre.children" :key="val">
              <el-menu-item :index="child.path" @click.native.prevent="breadCrumbAdd">{{ child.name }}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container style="height:100%;display: inline-block;">
        <el-header style="height:5%;padding:0;background-color:#9fa8da">
          <el-breadcrumb separator-class="el-icon-arrow-right" style="line-height:5vh;">
            <icon style="float:left;height:5vh" name="bread-logo" split=""></icon>
            <el-breadcrumb-item style="color:white" v-for="nav in navBarName" :key="nav.id">{{nav.name}}</el-breadcrumb-item>
            <img src="@/assets/admin-head.png" alt="头像" style="float:right;height:5vh">
            <el-dropdown style="float:right;line-height:5vh;padding-right:1vw" @command="handleNavCommand">
              <span class="el-dropdown-link" style="color:#303133">
                {{adminName}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item divided command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-breadcrumb>
        </el-header>
        <el-main style="width:100%;height:90%">
          <router-view v-if="isRouterAlive"></router-view>
        </el-main>
      </el-container>

      <el-dialog class="adminRegister" title="管理员用户注册" :visible.sync="dialogFormVisible">
        <el-form :rules="rules" ref="adminRegisterForm" :model="adminRegisterForm">
          <el-form-item label="账号名" :label-width="formLabelWidth" prop="username">
            <el-input v-model="adminRegisterForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
            <el-input v-model="adminRegisterForm.password" autocomplete="off" :type="showPassword">
              <i slot="suffix" class="el-input__icon el-icon-view" @click="shownPassword"></i>
            </el-input>
          </el-form-item>
          <el-form-item label="重复密码" :label-width="formLabelWidth" prop="repeatPassword">
            <el-input v-model="adminRegisterForm.repeatPassword" autocomplete="off" type='password'></el-input>
          </el-form-item>
          <el-form-item label="权限" :label-width="formLabelWidth" prop="permission">
            <el-select v-model="adminRegisterForm.permission" placeholder="请选择管理员权限">
              <el-option label="root" value="root"></el-option>
              <el-option label="normal" value="normal"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitAdminRegisterForm">确 定</el-button>
        </div>
      </el-dialog>
  </el-container>
</template>

<script>
import Icon from 'vue2-svg-icon/Icon.vue'
import { navbar } from '../../constant/data'
import { sysRegist } from '../../service/api'
export default {
  name: 'admin_layout',
  provide () {
    return {
      reload: this.reload
    }
  },
  created () {
    // 设置请求头
    // this.$axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('JWT')
    // this.$router.push('/admin/page/manage/user')
    this.navbar = navbar
    this.$router.push('/manage/system/permission')
  },
  data () {
    var validateEmpty = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('此处不能为空'))
      } else {
        callback()
      }
    }
    var validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('此处不能为空'))
      } else {
        if (value === this.adminRegisterForm.password) callback()
        else {
          callback(new Error('密码不相同'))
        }
      }
    }
    return {
      navbar: [],
      dialogFormVisible: false,
      adminRegisterForm: {
        username: '',
        password: '',
        repeatPassword: '',
        permission: ''
      },
      formLabelWidth: '120px',
      adminName: sessionStorage.getItem('username'),
      isCollapse: true,
      navBarWidth: 15,
      breadcrumb: {},
      navBarName: [{ name: '系统管理' }, { name: '权限管理' }],
      isRouterAlive: true,
      showPassword: 'password',
      rules: {
        username: [{ validator: validateEmpty, trigger: 'blur' }],
        password: [{ validator: validateEmpty, trigger: 'blur' }],
        repeatPassword: [{ validator: validatePassword, trigger: 'blur' }],
        permission: [{ validator: validateEmpty, trigger: 'blur' }]
      },
      defaultActive: '/manage/system/permission'
    }
  },
  methods: {
    shownPassword () {
      if (this.showPassword === 'password') this.showPassword = 'text'
      else this.showPassword = 'password'
    },
    submitAdminRegisterForm () {
      this.$refs['adminRegisterForm'].validate(valid => {
        if (valid) {
        //  this.adminRegisterForm
          sysRegist(this.adminRegisterForm).then(re => {
            this.dialogFormVisible = false
            this.$message.success('注册成功')
          })
        } else {
          this.$message.warning('请填写必填项')
        }
      })
    },
    handleNavCommand (command) {
      if (command === 'register') {
        this.$options.methods.adminRegister.bind(this)()
      }
      if (command === 'logout') {
        this.$store.commit('logout')
        this.$router.push('/')
      }
    },
    adminRegister () {
      this.dialogFormVisible = true
    },
    handleOpen (key, keyPath) {
    },
    handleClose (key, keyPath) {
    },
    handleSelect (key, keyPath) {
      var nav = []
      for (let i of navbar) {
        for (let item of i.children) {
          if (item.path === key) {
            let child = {}
            let pre = {}
            pre.name = i.name
            child.name = item.name
            nav.push(pre)
            nav.push(child)
          }
        }
      }
      this.navBarName = nav
      this.defaultActive = key
      this.$router.push(key)
    },
    breadCrumbAdd () {
      // console.log(document.getElementById("navbar"));
    },
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
    emptyForm (form) {
      for (let property in form) {
        form[property] = ''
      }
    }
  },
  components: {
    Icon
  }
}
</script>

<style scoped>
  .el-submenu {
    text-align: left;
  }
  .el-menu-item {
    text-align: left;
  }
  .el-menu {
    height: 100%;
    border: 0;
  }
  #navBar {
    height: 100%;
    float: left;
  }
  .el-breadcrumb__inner {
    color: white;
  }
  .adminRegister .el-input {
    width: 80%;
    float: left;
  }
  .adminRegister .el-select {
    float: left;
  }
  .adminRegister .dialog-footer {
    text-align: center;
  }
</style>
