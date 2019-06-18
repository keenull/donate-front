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
        <el-table-column type="selection" width="55">
        </el-table-column>
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
            <el-button size="mini" @click="userVerify(scope.row)">审核</el-button>
            <el-button size="mini" :disabled="scope.row.enabled === false" type="danger" @click="handleBanAccount(scope.row)">封号</el-button>
            <el-button size="mini" :disabled="scope.row.enabled === true" type="danger" @click="handleUnBanAccount(scope.row)">解封</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="用户详细信息" :visible.sync="dialogFormVisible" @close="closeDialog">
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

    </div>
    <Pagination :pageSize="this.query.size" :pageIndex="this.query.page" :total="total"
                @pageSizeChange="pageSizeChange" @pageIndexChange="pageIndexChange"></Pagination>
  </div>
</template>
<script>

  import Pagination from '../../components/pagination'
  import { userList, banUser, unbanUser, userUpdate, findUserByIdd } from '../../service/api'

  export default {
    name: "userlist_layout",
    components: { Pagination },
    inject: ["reload"],
    created() {
      this.getUserList()
    },
    data() {
      return {
        query: {
          page: '1',
          size: '10',
          nickname: '',
          enabled: '',
          type: 'APP'
        },
        dialogFormVisible: false,
        formInline: {
          user: ""
        },
        tableData: [],
        form: {},
        userList: [],
        total: 0,
        formLabelWidth: "60px"
      };
    },
    methods: {
      getUserList(){
        userList(this.query).then(re => {
          this.tableData = re.list
          this.total = re.total
        })
      },
      handleEdit(index, row) {
        findUserByIdd(row.id).then(re => {
          this.form = re;
          // re.enabled === true ? this.form.enabled = '激活' : this.form.enabled = '禁用'
        })
        this.dialogFormVisible = true;
      },
      closeDialog () {
        this.form = []
      },
      handleSearchList () {
        this.getUserList()
      },
      handleBanAccount (row) {
        banUser(row.id).then(re => {
          this.getUserList()
        })
      },
      handleUnBanAccount (row) {
        unbanUser(row.id).then(re => {
          this.getUserList()
        })
      },
      userVerify (val) {
        if (val.passed === 0) {
          this.$router.push({path: '/adminQualificate', query: {id: val.id}})
        } else {
          this.$message.warning('已审核')
        }
      },
      submitUserForm() {
        userUpdate(this.form).then(re =>{
          this.dialogFormVisible = false;
          this.getUserList()
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
