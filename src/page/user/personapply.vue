<template>
  <div>
    <el-table :data="personApplyData" stripe style="width: 100%">
      <el-table-column prop="title" label="求助项目" sortable>
      </el-table-column>
      <el-table-column prop="goal" label="求助金额" sortable>
      </el-table-column>
      <el-table-column prop="completed" label="已完成金额" sortable>
      </el-table-column>
      <el-table-column prop="gmtCreated" label="求助时间" sortable>
        <template slot-scope="scope">{{scope.row.gmtCreated | formatTime}}</template>
      </el-table-column>
      <el-table-column prop="state" label="状态" sortable>
        <template slot-scope='scope'>
          {{ scope.row.state === 1 ? '完成' : '' }}
          {{ scope.row.state === 0 ? '进行中' : '' }}
        </template>
      </el-table-column>
    </el-table>
    <Pagination :pageSize="this.query.size" :pageIndex="this.query.page" :total="total"
                @pageSizeChange="pageSizeChange" @pageIndexChange="pageIndexChange"></Pagination>
  </div>
</template>

<script>
  import { getApplyByUser } from '../../service/api'
  import Pagination from '../../components/pagination'
  import {timeFormat} from '../../utils/util';

  export default {
    name: 'personapply',
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
        personApplyData: [],
        total: 0
      }
    },
    created () {
      this.getPersonApplyPage()
    },
    filters: {
      formatTime(time) {
        if(time==null||time===''){
          return 'N/A';
        }
        let date = new Date(time);
        return timeFormat(date, 'yyyy-MM-dd hh:mm:ss')
      }
    },
    methods: {
      getPersonApplyPage () {
        getApplyByUser(this.query).then(re => {
          this.personApplyData = re.list
          this.total = re.total
        })
      },
      pageSizeChange (val) {
        this.query.page = 1
        this.query.size = val.size
        this.getPersonApplyPage()
      },
      pageIndexChange (val) {
        this.query.page = val.page
        this.getPersonApplyPage()
      }
    }
  }
</script>

<style scoped>

</style>
