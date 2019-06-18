<template>
  <div style="text-align: right; margin-top: 10px;margin-right: 10px">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="query.page" :page-size="query.size" :total="total"
                   layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>
<script>
export default {
  name: 'pagination',
  props: [ 'pageIndex', 'pageSize', 'total' ],
  data () {
    return {
      query: {
        page: this.page,
        size: this.size
      }
    }
  },
  watch: {
    pageIndex (val) {
      this.query.page = val
    },
    pageSize (val) {
      this.query.size = val
    },
    total (val) {
      this.total = val
    }
  },
  created () {},
  methods: {
    handleSizeChange (val) {
      /**
       * 子传父
       * 参数1 父元素方法
       * 参数2 数据
       */
      this.query.size = val
      this.$emit('pageSizeChange', this.query)
    },
    handleCurrentChange (val) {
      /**
       * 子传父
       * 参数1 父元素方法
       * 参数2 数据
       */
      this.query.page = val
      this.$emit('pageIndexChange', this.query)
    }
  }
}
</script>

<style>
</style>
