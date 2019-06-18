<!-- 申请求助页面-->
<template>
  <div>
    <el-form label-position="right" label-width="120px" :rules="forhelprule" :model="forhelpData" ref="forhelpRef" class="formClass">
      <el-form-item label='求助标题:' prop="title">
        <el-col :lg="13" :xl="12">
          <el-input v-model.trim="forhelpData.title" clearable></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label='预筹金额:' prop="goal">
        <el-col :lg="13" :xl="12">
          <el-input v-model.trim="forhelpData.goal" clearable placeholder="请输入正确的金额(支持两位小数)">
            <template slot="append">元</template>
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item label='求助类型:'>
        <el-radio-group v-model="radio">
          <el-radio :label="0">公益项目</el-radio>
          <el-radio :label="1">个人求助</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label='求助内容:' prop="content">
        <el-col>
          <QuillEditor @getContent="getContent" :urlPath="urlPath"></QuillEditor>
        </el-col>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item>
            <el-upload class="upload-demo" :action="uploadUrl" :on-success="uploadSuccess"
                       :before-upload="beforeUploadImage" name="upload" list-type="picture-card">
              <el-button size="small" type="primary">插入图片</el-button>
              <div slot="tip" class="el-upload__tip">插入图片到求助内容中，仅支持jpg、jpeg、png格式图片</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <!--<el-col :span="12">-->
          <!--<el-form-item>-->
            <!--<el-upload class="upload-demo" :action="uploadUrl"-->
                       <!--:on-success="uploadSuccess" :before-upload="beforeUploadVideo" name="upload" list-type="picture-card">-->
              <!--<el-button size="small" type="primary">插入视频</el-button>-->
              <!--<div slot="tip" class="el-upload__tip">插入视频到求助内容中，仅支持mp4格式视频</div>-->
            <!--</el-upload>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      </el-row>
      <el-form-item label='求助封面:' prop="file">
        <el-upload class="upload-demo" :action="uploadUrl" :on-success="uploadFileSuccess"
                   :before-upload="beforeUploadImage" name="upload" :on-remove="removeFileImage"
                   list-type="picture" :limit="1" :on-exceed="handleExceed">
          <el-button size="small" type="primary">选择图片</el-button>
          <div slot="tip" class="el-upload__tip">只允许上传一张封面图</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" type="primary" style="float: right" @click="tohelp">申请求助</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import QuillEditor from '../../components/quilleditor'
import { toApply } from '../../service/api'
export default {
  name: 'forhelp',
  // 编辑器子组件
  components: { QuillEditor },
  data () {
    // 校验求助封面是否为空
    var vaildFile = (rule, value, callback) => {
      if (this.filePath) {
        callback()
      } else {
        callback(new Error('求助封面不能为空'))
      }
    }
    // 校验求助内容是否为空
    var vaildContent = (rule, value, callback) => {
      if (this.forhelpData.content) {
        callback()
      } else {
        callback(new Error('求助内容不能为空'))
      }
    }
    return {
      // 求助信息数据model
      forhelpData: {},
      // 求助信息校验rule
      forhelprule: {
        title: [{ required: true, message: '求助标题不能为空', trigger: 'change' }],
        content: [{ required: true, validator: vaildContent }],
        goal: [{ required: true, message: '请输入预筹金额', trigger: 'change' },
          { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确的金额(支持两位小数)', trigger: 'blur' }],
        file: [{ required: true, validator: vaildFile }]
      },
      // 上传请求接口地址
      uploadUrl: 'http://127.0.0.1:8080/api-a/apply/apply-anon/uploadFiles2',
      // 传到编辑器组件的参数set到编辑器中
      urlPath: '',
      // 求助类型radio 默认选中公益项目
      radio: 0,
      // 封面上传后返回的路径
      filePath: '',
      // 求助内容v-model
      content: ''
    }
  },
  watch: {
    // 监听封面地址变化
    filePath (val) {
      // 表单校验
      this.$refs.forhelpRef.validate()
    },
    // 监听求助内容是否变化
    content (val) {
      // 表单校验
      this.$refs.forhelpRef.validate()
    }
  },
  methods: {
    // 申请求助
    tohelp () {
      // 表单校验
      this.$refs.forhelpRef.validate((valid) => {
        // 如果检验通过
        if (valid) {
          // 绑定数据到forhelpData中传到后台
          this.forhelpData.applyType = this.radio
          this.forhelpData.file = this.filePath
          toApply(this.forhelpData).then(re => {
            this.$router.push({path: '/home'})
          })
        }
      })
    },
    // 编辑器子组件进入的方法(val时是编辑器内html代码)
    getContent (val) {
      // 赋值
      this.forhelpData.content = val
      this.content = val
    },
    // 上传成功请求的方法
    uploadSuccess (response, file, fileList) {
      this.urlPath = response.url
    },
    // 上传封面成功请求的方法
    uploadFileSuccess (response, file, fileList) {
      this.filePath = response.url
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
    // 上传视频之前访问的方法
    beforeUploadVideo (file) {
      let name = file.name.split('.')[1].toUpperCase()

      if (name !== 'MP4') {
        this.$message.warning('视频格式不符合要求')
        return false
      }
    },
    // 删除封面图片访问的方法
    removeFileImage (file, fileList) {
      this.filePath = ''
    }
  }
}
</script>

<style>
</style>
