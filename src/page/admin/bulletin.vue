<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float:right" type="primary" @click="handleSearchList" size="small">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="query" size="small" label-width="140px">
          <el-form-item label="筛选：">
            <el-input v-model="query.search" class="input-width" placeholder="输入公告或标题"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <span style="float: right; margin-bottom: 10px">
        <el-button type="danger" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="openAddDialog">添加公告</el-button>
      </span>
    </el-card>
    <div class="table-container">
      <el-table ref="newProductTable"
                :data="bulletListData"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="ID" width="120" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="标题" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
        <el-table-column label="内容" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.content}}</template>
        </el-table-column>
        <el-table-column label="发布时间" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.gmtCreated | formatTime}}</template>
        </el-table-column>
        <el-table-column label="修改时间" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.gmtModified | formatTime}}</template>
        </el-table-column>
        <el-table-column label="发布人" align="center">
          <template slot-scope="scope">{{scope.row.createdUser}}</template>
        </el-table-column>
        <el-table-column label="修改人" align="center">
          <template slot-scope="scope">{{scope.row.modifiedUser}}</template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope='scope'>
            {{ scope.row.state === 0 ?  '可用': '' }}
            {{ scope.row.state === 1 ?  '禁用': '' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini" :disabled="scope.row.state === 0" type="danger" @click="handleUp(scope.row)">上线</el-button>
            <el-button size="mini" :disabled="scope.row.state === 1" type="danger" @click="handleDown(scope.row)">下线</el-button>
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" @click="batchDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="修改公告" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-container>
            <el-form-item label="标题" :label-width="formLabelWidth">
              <el-input v-model="form.title" autocomplete="off"></el-input>
            </el-form-item>
          </el-container>
          <el-container>
            <el-form-item label="内容" :label-width="formLabelWidth">
              <el-input v-model="form.content" autocomplete="off"></el-input>
            </el-form-item>
          </el-container>
          <!--<el-container>-->
            <!--<el-form-item label="状态" :label-width="formLabelWidth">-->
              <!--<el-select v-model="form.state" placeholder="请选择" clearable class="input-width">-->
                <!--<el-option label="可用" value="0" />-->
                <!--<el-option label="禁用" value="1" />-->
              <!--</el-select>-->
            <!--</el-form-item>-->
          <!--</el-container>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <Pagination :pageSize="this.query.size" :pageIndex="this.query.page" :total="total"
                @pageSizeChange="pageSizeChange" @pageIndexChange="pageIndexChange"></Pagination>
  </div>
</template>
<script>

import Pagination from '../../components/pagination'
import { bulletinList, deleteBulletin, bulletinUpdate, bulletinOffline, getBulletinByid, bulletinOnline } from '../../service/api'
import {timeFormat} from '../../utils/util'

export default {
  name: 'bulletin_layout',
  components: { Pagination },
  data () {
    return {
      bulletListData: [],
      query: {
        page: '1',
        size: '10',
        search: ''
      },
      dialogFormVisible: false,
      total: 0,
      form: {},
      multipleSelection: [],
      bulletinids: []
    }
  },
  created () {
    this.getBulletinListPage()
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
    getBulletinListPage () {
      bulletinList(this.query).then(re => {
        this.bulletListData = re.list
        this.total = re.total
      })
    },
    pageSizeChange (val) {
      this.query.page = 1
      this.query.size = val.size
      this.getBulletinListPage()
    },
    pageIndexChange (val) {
      this.query.page = val.page
      this.getBulletinListPage()
    },
    handleEdit(index, row) {
      getBulletinByid(row.id).then(re => {
        this.form = re;
        this.form.state = String(re.state);
      })
      this.dialogFormVisible = true;

    },
    handleSearchList () {
      this.getBulletinListPage()
    },
    handleResetSearch () {
      this.query.search = ''
      this.query.page = 1
      this.query.size = 10
      this.getBulletinListPage()
    },
    handleSelectionChange (rows) {
      this.bulletinids = []
      this.multipleSelection = rows
      if (this.multipleSelection.length) {
        this.multipleSelection.forEach((val, index) => {
          this.bulletinids.push(val.id)
        })
      }
    },
    batchDelete () {
      if (this.bulletinids.length) {
        this.$confirm('此操作将永久删除公告, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let query = {}
          query.bulletinids = this.bulletinids
          deleteBulletin(query).then(re => {
            this.getBulletinListPage()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.$message.warning('请选择要删除的数据')
      }
    },
    submitForm(){
      bulletinUpdate(this.form).then(re =>{
        this.dialogFormVisible = false;
        this.getBulletinListPage()
      })
    },
    handleDown (row) {
      bulletinOffline(row.id).then(re => {
        this.getBulletinListPage()
      })
    },
    handleUp (row) {
      bulletinOnline(row.id).then(re => {
        this.getBulletinListPage()
      })
    },
    openAddDialog () {}
  }
}
</script>

<style>

</style>
