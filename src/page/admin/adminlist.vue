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
            <el-input v-model="query.nickname" class="input-width" placeholder="用户名"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div>
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column prop="id" label="ID" width="120">
        </el-table-column>
        <el-table-column prop="nickname" label="用户名" width="120">
        </el-table-column>
        <el-table-column prop="sex" label="性别" width="120">
          <template slot-scope="scope">
            {{ scope.row.sex === 0 ?  '男': '' }}
            {{ scope.row.sex === 1 ?  '女': '' }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="120">
        </el-table-column>
        <el-table-column prop="mail" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="enabled" label="状态" width="180">
          <template slot-scope="scope">
            {{ scope.row.enabled === true ?  '激活': '' }}
            {{ scope.row.enabled === false ?  '禁用': '' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="distributeRole(scope.row.id)">分配角色</el-button>
            <el-button size="mini" :disabled="scope.row.enabled === false" type="danger" @click="handleBanAccount(scope.row)">封号</el-button>
            <el-button size="mini" :disabled="scope.row.enabled === true" type="danger" @click="handleUnBanAccount(scope.row)">解封</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="用户详细信息" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-container>
            <el-form-item label="用户名" :label-width="formLabelWidth">
              <el-input v-model="form.nickname" autocomplete="off" disabled></el-input>
            </el-form-item>
          </el-container>
          <el-form-item label="性别" :label-width="formLabelWidth" style="text-align:left">
            <el-radio-group v-model="form.sex">
              <el-radio :label='0'>男</el-radio>
              <el-radio :label='1'>女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-container>
            <el-form-item label="电话" :label-width="formLabelWidth">
              <el-input v-model="form.phone" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮件" :label-width="formLabelWidth">
              <el-input v-model="form.mail" autocomplete="off"></el-input>
            </el-form-item>
          </el-container>
          <!--<el-container>-->
            <!--<el-form-item label="状态" :label-width="formLabelWidth">-->
              <!--<el-input v-model="form.enabled" autocomplete="off"></el-input>-->
            <!--</el-form-item>-->
          <!--</el-container>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitUserForm()">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="分配角色" :visible.sync="distributeRoleDailog" @close="closeDialog">
        <el-row>
          <el-col :span="18" :offset="3">
            <el-transfer
              filterable
              filter-placeholder="请输入角色名称"
              :titles="['Source', 'Target']"
              :button-texts="['到左边', '到右边']"
              v-model="roles"
              :data="allRoles" />
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="distributeUserRole">确 定</el-button>
        </span>
      </el-dialog>

    </div>
    <Pagination :pageSize="this.query.size" :pageIndex="this.query.page" :total="total"
                @pageSizeChange="pageSizeChange" @pageIndexChange="pageIndexChange"></Pagination>
  </div>
</template>
<script>

  import Pagination from '../../components/pagination'
  import { adminList, banUser, unbanUser, userUpdate, findUserByIdd, roleList, findRoleByUserId, distributeRoles } from '../../service/api'

  export default {
    name: "adminlist_layout",
    components: { Pagination },
    inject: ["reload"],
    created() {
      this.getAdminList()
    },
    data() {
      return {
        query: {
          page: '1',
          size: '10',
          nickname: '',
          enabled: '',
          type: 'BACKEND'
        },
        dialogFormVisible: false,
        distributeRoleDailog: false,
        formInline: {
          user: ""
        },
        tableData: [],
        form: {},
        adminList: [],
        // 右边
        roles: [],
        // 全部
        allRoles: [],
        id: '',
        set: [],
        total: 0,
        formLabelWidth: "60px"
      };
    },
    methods: {
      getAdminList(){
        adminList(this.query).then(re => {
          this.tableData = re.list
          this.total = re.total
        })
      },
      handleEdit(index, row) {
        findUserByIdd(row.id).then(re => {
          this.form = re;
          re.enabled === true ? this.form.enabled = '激活' : this.form.enabled = '禁用'
        })
        this.dialogFormVisible = true;
      },
      handleSearchList () {
        this.getAdminList()
      },
      handleBanAccount (row) {
        banUser(row.id).then(re => {
          this.getAdminList()
        })
      },
      handleUnBanAccount (row) {
        unbanUser(row.id).then(re => {
          this.getAdminList()
        })
      },
      submitUserForm() {
        userUpdate(this.form).then(re =>{
          this.dialogFormVisible = false;
          this.getAdminList()
        })
      },
      distributeRole(id) {
        this.distributeRoleDailog = true;
        this.id = id
        roleList({page: '1',size: '100000',name: ''}).then(re => {
          re.list.forEach(val => {
            this.allRoles.push({
              key: val.id,
              label: val.name
            })
          })
        })


        findRoleByUserId(id).then(re =>{
          re.forEach(val => {
            this.roles.push(val.id)
          })
        })

      },
      closeDialog () {
        this.distributeRoleDailog = false
        // this.permiss传去修改
        this.allRoles = []
        this.roles = []
      },
      distributeUserRole() {
        let params = {}
        params.id = this.id
        params.set = this.roles
        distributeRoles(params).then(re =>{
          this.distributeRoleDailog = false;
          this.getAdminList()
        })
      }
    }
  };

</script>

<style>
  .el-form-item_label {
    text-align: center;
  }
</style>
