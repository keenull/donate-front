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
            <el-input v-model="query.name" class="input-width" placeholder="角色名"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <span style="float: right; margin-bottom: 10px">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="openAddDialog">添加</el-button>
      </span>
    </el-card>
    <div class="table-container">
      <el-table ref="newProductTable"
                :data="roleListData"
                style="width: 100%;"
                v-loading="listLoading" border>
        <el-table-column label="ID" width="120" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="角色名	" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="修改时间" align="center">
          <template slot-scope="scope">{{scope.row.updateTime | formatTime}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleEdit(scope.$index, scope.row)">修改
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleRemove(scope.row)">删除
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="distributeRole(scope.row.id)">分配权限
            </el-button>
            <!--<el-button size="mini"-->
                       <!--type="text"-->
                       <!--@click="distributeMenu(scope.$index, scope.row)">分配菜单-->
            <!--</el-button>-->
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="角色详细信息" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-container>
            <el-form-item label="code">
              <el-input v-model="form.code" autocomplete="off" disabled></el-input>
            </el-form-item>
          </el-container>
          <el-container>
            <el-form-item label="角色" style="text-align:left">
              <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
          </el-container>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm()">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="编辑角色信息" :visible.sync="editDialogFormVisible">
        <el-form :model="form">
          <el-container>
            <el-form-item label="code">
              <el-input v-model="form.code" autocomplete="off"></el-input>
            </el-form-item>
          </el-container>
          <el-container>
            <el-form-item label="角色" style="text-align:left">
              <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
          </el-container>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoles()">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="分配权限" :visible.sync="distributeRoleDailog" @close="closeDialog">
        <el-row>
          <el-col :span="18" :offset="3">
            <el-transfer
              filterable
              filter-placeholder="请输入权限名称"
              :titles="['Source', 'Target']"
              :button-texts="['到左边', '到右边']"
              v-model="permiss"
              :data="allPermiss" />
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="distributePer">确 定</el-button>
        </span>
      </el-dialog>

    </div>
    <Pagination :pageSize="this.query.size" :pageIndex="this.query.page" :total="total"
                @pageSizeChange="pageSizeChange" @pageIndexChange="pageIndexChange"></Pagination>
  </div>
</template>
<script>

  import Pagination from '../../components/pagination'
  import { roleList, delRole, roleUpdate, findPerByRoleId, permissionList, distribuePer, findRoleById, addRole } from '../../service/api'
  import {timeFormat} from '../../utils/util'
  import ElContainer from "element-ui/packages/container/src/main";

  export default {
    name: 'role_layout',
    components: {
      ElContainer,
      Pagination },
    data () {
      return {
        roleListData: [],
        query: {
          page: '1',
          size: '10',
          name: ''
        },
        total: 0,
        form: {},
        dialogFormVisible: false,
        editDialogFormVisible: false,
        multipleSelection: [],
        distributeRoleDailog: false,
        // 右边
        permiss: [],
        // 全部
        allPermiss: [],
        id: '',
        set: []
      }
    },
    created () {
      this.getRoleListPage()
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
      getRoleListPage () {
        roleList(this.query).then(re => {
          this.roleListData = re.list
          this.total = re.total
        })
      },
      pageSizeChange (val) {
        this.query.page = 1
        this.query.size = val.size
        this.getRoleListPage()
      },
      pageIndexChange (val) {
        this.query.page = val.page
        this.getRoleListPage()
      },
      handleRemove(row){
        this.$confirm('此操作将永久删除角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delRole(row.id).then(re => {
            this.getRoleListPage()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handleEdit(index, row) {
        findRoleById(row.id).then(re => {
          this.form = re;
        })
        this.dialogFormVisible = true;
      },
      distributeRole(id) {
        this.distributeRoleDailog = true;
        this.id = id
        permissionList({page: '1',size: '100000',name: ''}).then(re => {
          re.list.forEach(val => {
            this.allPermiss.push({
              key: val.id,
              label: val.name
            })
          })
        })


        findPerByRoleId(id).then(re =>{
          re.forEach(val => {
            this.permiss.push(val.id)
          })
        })

      },
      closeDialog () {
        this.distributeRoleDailog = false
        // this.permiss传去修改
        this.allPermiss = []
        this.permiss = []
      },
      distributeMenu() {

      },
      handleSearchList () {
        this.getRoleListPage()
      },
      handleResetSearch () {
        this.query.name = ''
        this.query.page = 1
        this.query.size = 10
        this.getRoleListPage()
      },
      submitForm() {
        roleUpdate(this.form).then(re =>{
          this.dialogFormVisible = false;
          this.getRoleListPage()
        })
      },
      addRoles() {
        addRole(this.form).then(re =>{
          this.editDialogFormVisible = false;
          this.getRoleListPage()
        })
      },
      distributePer() {
        let params = {}
        params.id = this.id
        params.set = this.permiss
        distribuePer(params).then(re =>{
          this.distributeRoleDailog = false;
          this.getRoleListPage()
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
