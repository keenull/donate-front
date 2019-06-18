<!-- vue-quill-editor编辑器子路由页面-->
<template>
  <div style="border: 1px solid #ccc">
    <!-- bidirectional data binding（双向数据绑定） -->
    <quill-editor v-model="content"
                  ref="myQuillEditor"
                  :options="editorOption"
                  @blur="onEditorBlur($event)"
                  @focus="onEditorFocus($event)"
                  @ready="onEditorReady($event)"
                  @change="onEditorChange($event)">
    </quill-editor>
  </div>
</template>

<script>
// You can also register quill modules in the component
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import Vue from 'vue'
import { toolbarOptions } from '../constant/data'
Vue.use(VueQuillEditor)

export default {
  name: 'quilleditor',
  // 父路由传过来的参数(需要添加到编辑器里面的内容)
  props: ['urlPath'],
  data () {
    return {
      // 初始化显示的内容
      content: '',
      // 编辑器参数配置
      editorOption: {
        placeholder: '详细填写您要求助的具体内容',
        // some quill options
        modules: {
          toolbar: {
            // 工具栏
            container: toolbarOptions,
            handlers: {}
          }
        },
        theme: 'snow' // or bubble
      },
      urlsncpath: this.urlPath
    }
  },
  // if you need to manually control the data synchronization, parent component needs to explicitly emit an event instead of relying on implicit binding
  // 如果需要手动控制数据同步，父组件需要显式地处理changed事件
  methods: {
    onEditorBlur (editor) {
      // console.log('editor blur!', editor)
    },
    onEditorFocus (editor) {
      // console.log('editor focus!', editor)
    },
    onEditorReady (editor) {
      // console.log('editor ready!', editor)
    },
    onEditorChange ({ editor, html, text }) {
      // console.log('editor change!', editor, html, text)
      this.$emit('getContent', this.content)
    }
  },
  // get the current quill instace object.
  computed: {
    editor () {
      // console.log(this.$refs.myQuillEditor.quill)
      return this.$refs.myQuillEditor.quill
    }
  },
  watch: {
    urlPath (val) {
      let num = val.lastIndexOf('.')
      let str = val.substr(num + 1, val.length)
      let type = ''
      if (str === 'png' || str === 'jpg' || str === 'jpeg') {
        type = 'image'
      }
      if (str === 'mp4') {
        type = 'video'
      }
      this.urlsncpath = val
      let quill = this.$refs.myQuillEditor.quill
      quill.focus()
      let length = quill.getSelection().index
      quill.insertEmbed(length, type, this.urlsncpath)
      quill.setSelection(length + 1)
    }
  },
  mounted () {
    // you can use current editor object to do something(quill methods)
    // console.log('this is current quill instance object', this.editor)
  }
}
</script>
<style>
  .quill-editor{}
  .ql-container.ql-snow{
    border: 0 solid #ccc;
  }
  .ql-toolbar.ql-snow{
    border: 0 solid #ccc;
    border-bottom: 1px solid #ccc;
  }
</style>
