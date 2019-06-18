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
            <el-input v-model="query.name" class="input-width" placeholder="权限名"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <span style="float: right; margin-bottom: 10px">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="openAddDialog">添加角色</el-button>
      </span>
    </el-card>
    <div class="table-container">
      <el-table ref="newProductTable"
                :data="permissionData"
                style="width: 100%;"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="ID" width="120" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="权限名" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="修改时间" align="center">
          <template slot-scope="scope">{{scope.row.updateTime | formatTime}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleRemove(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="权限信息" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-container>
            <el-form-item label="权限名" :label-width="formLabelWidth">
              <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
          </el-container>
          <el-container>
            <el-form-item label="权限标识" :label-width="formLabelWidth">
              <el-input v-model="form.permission" autocomplete="off" disabled></el-input>
            </el-form-item>
          </el-container>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitPermissionForm()">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="权限信息" :visible.sync="editDialogFormVisible">
        <el-form :model="form">
          <el-container>
            <el-form-item label="权限名" :label-width="formLabelWidth">
              <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
          </el-container>
          <el-container>
            <el-form-item label="权限标识" :label-width="formLabelWidth">
              <el-input v-model="form.permission" autocomplete="off"></el-input>
            </el-form-item>
          </el-container>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addPermissionForm()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <Pagination :pageSize="this.query.size" :pageIndex="this.query.page" :total="total"
                @pageSizeChange="pageSizeChange" @pageIndexChange="pageIndexChange"></Pagination>
  </div>
</template>
<script>

  import Pagination from '../../components/pagination'
  import { permissionList, delPermission, permissionSave, findById, permissionAdd } from '../../service/api'
  import {timeFormat} from '../../utils/util'

  export default {
    name: 'permission_layout',
    components: { Pagination },
    data () {
      return {
        permissionData: [],
        query: {
          page: '1',
          size: '10',
          name: ''
        },
        dialogFormVisible: false,
        editDialogFormVisible: false,
        total: 0,
        form: {},
        multipleSelection: [],
        permissionids: []
      }
    },
    created () {
      this.getPermissionListPage()
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
      getPermissionListPage () {
        permissionList(this.query).then(re => {
          this.permissionData = re.list
          this.total = re.total
        })
      },
      pageSizeChange (val) {
        this.query.page = 1
        this.query.size = val.size
        this.getPermissionListPage()
      },
      pageIndexChange (val) {
        this.query.page = val.page
        this.getPermissionListPage()
      },
      handleEdit(index, row) {
        findById(row.id).then(re => {
          this.form = re;
        })
        this.dialogFormVisible = true;
      },
      handleRemove(row){
        this.$confirm('此操作将永久删除权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delPermission(row.id).then(re => {
            this.getPermissionListPage()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handleSearchList () {
        this.getPermissionListPage()
      },
      handleResetSearch () {
        this.query.name = ''
        this.query.page = 1
        this.query.size = 10
        this.getPermissionListPage()
      },
      submitPermissionForm() {
        permissionSave(this.form).then(re =>{
          this.dialogFormVisible = false;
          this.getPermissionListPage()
        })
      },
      addPermissionForm() {
        permissionAdd(this.form).then(re =>{
          this.editDialogFormVisible = false;
          this.getPermissionListPage()
        })
      },
      openAddDialog () {
        this.editDialogFormVisible = true;
      }
    }
  }
</script>

<style>

</style>
