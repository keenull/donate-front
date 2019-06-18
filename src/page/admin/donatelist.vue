<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float:right" type="primary" @click="handleSearchList" size="small">
          查询搜索
        </el-button>
        <el-button style="float:right;margin-right: 15px" @click="handleResetSearch" size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="query" size="small" label-width="140px">
          <el-form-item label="日期范围:">
            <el-date-picker v-model="datetimer" type="datetimerange" range-separator="至"
              start-placeholder="选择开始时间" end-placeholder="选择结束时间" />
          </el-form-item>
          <el-form-item label="类型：">
            <el-select v-model="query.type" placeholder="请选择" clearable class="input-width">
              <el-option v-for="item in projectOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="搜索条件">
            <el-input v-model="query.search" placeholder="搜索"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="newProductTable" :data="donateListData" style="width: 100%;" border>
        <el-table-column label="ID" width="120" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="捐款人" align="center">
          <template slot-scope="scope">{{scope.row.userName}}</template>
        </el-table-column>
        <el-table-column label="受捐用户" align="center">
          <template slot-scope="scope">{{scope.row.receiver}}</template>
        </el-table-column>
        <el-table-column label="捐赠项目" align="center">
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
        <el-table-column label="捐赠金额" align="center">
          <template slot-scope="scope">{{scope.row.money}}</template>
        </el-table-column>
        <el-table-column label="捐赠时间" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.gmtCreated | formatTime }}</template>
        </el-table-column>
      </el-table>
    </div>
    <Pagination :pageSize="this.query.size" :pageIndex="this.query.page" :total="total"
                @pageSizeChange="pageSizeChange" @pageIndexChange="pageIndexChange"></Pagination>
  </div>
</template>
<script>

import Pagination from '../../components/pagination'
import {donateList} from '../../service/api'
import {timeFormat} from '../../utils/util'

const defaultProjectOptions = [
  {
    label: '受捐用户',
    value: 0
  },
  {
    label: '捐赠项目',
    value: 1
  }
]
export default {
  name: 'donatelist_layout',
  components: {Pagination},
  data () {
    return {
      donateListData: [],
      query: {
        page: '1',
        size: '10',
        search: '',
        orderField: 'id',
        isASC: true,
        begin: '',
        end: '',
        type: ''
      },
      datetimer: '',
      total: 0,
      projectOptions: Object.assign({}, defaultProjectOptions),
      pickerOptions2: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClickn (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  created () {
    this.donateListPage()
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
    donateListPage () {
      donateList(this.query).then(re => {
        this.donateListData = re.list
        this.total = re.total
      })
    },
    pageSizeChange (val) {
      this.query.page = 1
      this.query.size = val.size
      this.structTime()
      this.donateListPage()
    },
    pageIndexChange (val) {
      this.query.page = val.page
      this.structTime()
      this.donateListPage()
    },
    handleSearchList () {
      this.structTime()
      this.donateListPage()
    },
    structTime () {
      if (this.datetimer) {
        this.query.begin = timeFormat(this.datetimer[0])
        this.query.end = timeFormat(this.datetimer[1])
      } else {
        this.query.begin = ''
        this.query.end = ''
      }
    },
    handleResetSearch () {
      this.query.type = ''
      this.query.search = ''
      this.datetimer = ''
      this.query.begin = ''
      this.query.end = ''
      this.query.page = 1
      this.query.size = 10
      this.donateListPage()
    }
  }
}
</script>

<style>

</style>
