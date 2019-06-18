<!-- 申请求助页面-->
<template>
  <div>
    <el-form label-position="right" label-width="120px" :rules="forhelprule" :model="qualificateData" ref="forhelpRef" class="formClass">
      <el-form-item label='学校名字:' prop="colleague">
        <el-col :lg="13" :xl="12">
          <el-input v-model.trim="qualificateData.colleague" clearable></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label='学院名称:' prop="school">
        <el-col :lg="13" :xl="12">
          <el-input v-model.trim="qualificateData.school" clearable></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label='学号:' prop="studentId">
        <el-col :lg="13" :xl="12">
          <el-input v-model.trim="qualificateData.studentId" clearable></el-input>
        </el-col>
      </el-form-item>

      <el-row>
        <el-col :span="12">
          <el-form-item label='学生证正面:' prop="file">
            <el-upload class="upload-demo" :action="uploadUrl" :on-success="uploadFileSuccess"
                       :before-upload="beforeUploadImage" name="upload" :on-remove="removeFileImage"
                       list-type="picture">
              <el-button size="small" type="primary">选择图片</el-button>
              <div slot="tip" class="el-upload__tip">上传学生证正反面</div>
            </el-upload>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label='学生证反面:' prop="img">
            <el-upload class="upload-demo" :action="uploadUrl" :on-success="uploadFileSuccess2"
                       :before-upload="beforeUploadImage" name="upload" :on-remove="removeFileImage2"
                       list-type="picture">
              <el-button size="small" type="primary">选择图片</el-button>
              <div slot="tip" class="el-upload__tip">上传学生证正反面</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item>
        <el-button size="mini" type="primary" style="float: right" @click="qualificate">申请审核</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import QuillEditor from '../../components/quilleditor'
  import { userQualificate } from '../../service/api'
  export default {
    name: 'qualificate',
    // 编辑器子组件
    components: { QuillEditor },
    data () {
      // 校验求助封面是否为空
      var vaildFile = (rule, value, callback) => {
        if (this.filePath) {
          callback()
        } else {
          callback(new Error('学生证照片不能为空'))
        }
      }
      var vaildFile2 = (rule, value, callback) => {
        if (this.filePath2) {
          callback()
        } else {
          callback(new Error('学生证照片不能为空'))
        }
      }
      return {
        // 求助信息数据model
        qualificateData: {},
        // 求助信息校验rule
        forhelprule: {
          school: [{ required: true, message: '学校不能为空', trigger: 'change' }],
          colleague: [{ required: true, message: '学院不能为空', trigger: 'change' }],
          studentId: [{ required: true, message: '学号不能为空', trigger: 'change' }],
          file: [{ required: true, validator: vaildFile }],
          img: [{ required: true, validator: vaildFile2 }]
        },
        // 上传请求接口地址
        uploadUrl: 'http://127.0.0.1:8080/api-a/apply/apply-anon/uploadFiles2',
        // 传到编辑器组件的参数set到编辑器中
        urlPath: '',
        // 求助类型radio 默认选中公益项目
        radio: 0,
        // 封面上传后返回的路径
        filePath: '',
        filePath2: '',
        // 求助内容v-model
        content: ''
      }
    },
    watch: {
      // // 监听封面地址变化
      // filePath (val) {
      //   // 表单校验
      //   this.$refs.forhelpRef.validate()
      // },
      // filePath2 (val) {
      //   // 表单校验
      //   this.$refs.forhelpRef.validate()
      // }
    },
    methods: {
      // 申请求助
      qualificate () {
        // 表单校验
        this.$refs.forhelpRef.validate((valid) => {
          // 如果检验通过
          if (valid) {
            // 绑定数据到forhelpData中传到后台
            this.qualificateData.file = this.filePath
            this.qualificateData.img = this.filePath2
            userQualificate(this.qualificateData).then(re => {
              this.$router.push({path: '/home'})
            })
          }
        })
      },
      // 编辑器子组件进入的方法(val时是编辑器内html代码)
      getContent (val) {
        // 赋值
        this.qualificateData.content = val
        this.content = val
      },
      // 上传成功请求的方法
      uploadSuccess (response, file, fileList) {
        this.urlPath = response.url
      },
      // 上传封面成功请求的方法
      uploadFileSuccess (response) {
        this.filePath = response.url
      },
      uploadFileSuccess2 (response) {
        this.filePath2 = response.url
      },
      // 上传文件之前请求的方法
      beforeUploadImage (file) {
        let name = file.name.split('.')[1].toUpperCase()
        if (name !== 'JPG' && name !== 'JPEG' && name !== 'PNG') {
          this.$message.warning('图片格式不符合要求')
          return false
        }
      },
      // 上传文件个数限制
      handleExceed (files, fileList) {
        this.$message.warning(`当前限制只能选择 1 个文件，请删除原图片后再次选择上传`)
      },
      // 删除封面图片访问的方法
      removeFileImage (file, fileList) {
        this.filePath = ''
      },
      // 删除封面图片访问的方法
      removeFileImage2 (file, fileList) {
        this.filePath2 = ''
      }
    }
  }
</script>

<style>
</style>
