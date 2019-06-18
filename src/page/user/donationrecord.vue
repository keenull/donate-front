<template>
  <div>
    <el-table :data="donateBoardData" stripe style="width: 100%">
      <el-table-column prop="donater" label="捐款人" sortable>
      </el-table-column>
      <el-table-column prop="money" label="捐款金额" sortable>
      </el-table-column>
      <el-table-column prop="projectName" label="捐款项目" sortable>
      </el-table-column>
      <el-table-column prop="receiver" label="受助人" sortable>
      </el-table-column>
      <el-table-column prop="gmtCreated" label="捐款时间" sortable>
        <template slot-scope="scope">{{scope.row.gmtCreated | formatTime}}</template>
      </el-table-column>
    </el-table>
    <Pagination :pageSize="this.query.size" :pageIndex="this.query.page" :total="total"
                @pageSizeChange="pageSizeChange" @pageIndexChange="pageIndexChange"></Pagination>
  </div>
</template>

<script>
import { getLatestDontateList } from '../../service/api'
import Pagination from '../../components/pagination'
import {timeFormat} from '../../utils/util';

export default {
  name: 'record',
  components: { Pagination },
  data () {
    return {
      query: {
        page: '1',
        size: '10',
        search: '',
        orderField: 'id',
        orderDirection: ''
      },
      donateBoardData: [],
      total: 0
    }
  },
  created () {
    this.getLatestDontateListPage()
  },
  filters: {
    formatTime (time) {
      if (time == null || time === '') {
        return 'N/A'
      }
      let date = new Date(time)
      return timeFormat(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  methods: {
    getLatestDontateListPage () {
      getLatestDontateList(this.query).then(re => {
        this.donateBoardData = re.list
        this.total = re.total
      })
    },
    pageSizeChange (val) {
      this.query.page = 1
      this.query.size = val.size
      this.getLatestDontateListPage()
    },
    pageIndexChange (val) {
      this.query.page = val.page
      this.getLatestDontateListPage()
    }
  }
}
</script>

<style scoped>

</style>
