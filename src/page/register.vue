<template>
  <el-row style="margin-top: 30px;">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="用户名" prop="username">
        <el-col :span="6">
          <el-input v-model="ruleForm.username"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-col :span="6">
          <el-input v-model="ruleForm.nickname"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-col :span="6">
         <el-input v-model="ruleForm.phone"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="邮箱" prop="mail">
        <el-col :span="6">
          <el-input v-model="ruleForm.mail"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="ruleForm.sex">
          <el-radio :label='0'>男</el-radio>
          <el-radio :label='1'>女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-col :span="6">
          <el-input type="password" v-model="ruleForm.password" auto-complete="off"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-col :span="6">
          <el-input type="password" v-model="ruleForm.checkPass" auto-complete="off"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-row>
</template>
<script>

  import { register } from '../service/api'

  export default {
    name: 'register',
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        activeName: 'second',
        ruleForm: {
          username: '',
          nickname: '',
          password: '',
          phone: '',
          sex: 0,
          mail: ''
        },
        rules: {
          username: [
            { required: true, message: '请输入您的名称', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { required: true, validator: validatePass2, trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入您的手机号', trigger: 'blur' },
            { pattern: /^[1][3,4,5,7,8][0-9]{9}$/,message:'手机号不符合规则', trigger: 'blur' },
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            register(this.ruleForm).then(re =>{
              this.$message({
                type: 'success',
                message: '注册成功'
              });
              this.$router.push({path: '/home'})
            })
            // this.activeName: 'first',
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
