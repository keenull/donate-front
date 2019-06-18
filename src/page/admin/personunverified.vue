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
                            start-placeholder="选择开始时间" end-placeholder="选择结束时间"/>
          </el-form-item>
          <el-form-item label="项目名称：">
            <el-input v-model="query.search" class="input-width" placeholder="公益项目名称"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>

    <div class="table-container">
      <el-table ref="newProductTable" :data="personUnVerifiedData" style="width: 100%;" border>
        <el-table-column label="ID" width="120" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="标题" align="center">
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
        <el-table-column label="已筹金额" align="center">
          <template slot-scope="scope">{{scope.row.completed}}</template>
        </el-table-column>
        <el-table-column label="预筹金额" align="center">
          <template slot-scope="scope">{{scope.row.goal}}</template>
        </el-table-column>
        <el-table-column label="更新时间" align="center">
          <template slot-scope="scope">{{ scope.row.gmtModified | formatTime }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="toApprove(scope.row)">审核
            </el-button>
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

      <el-dialog title="公益项目详细信息" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-container>
            <el-form-item label="标题" :label-width="formLabelWidth">
              <el-input v-model="form.title" autocomplete="off"></el-input>
            </el-form-item>
          </el-container>
          <el-form-item label="已筹金额" :label-width="formLabelWidth" style="text-align:left">
              <el-input v-model="form.completed" autocomplete="off" disabled></el-input>
          </el-form-item>
          <el-container>
            <el-form-item label="预筹金额" :label-width="formLabelWidth">
              <el-input v-model="form.goal" autocomplete="off"></el-input>
            </el-form-item>
          </el-container>
          <!--<el-container>-->
            <!--<el-form-item label="状态" :label-width="formLabelWidth">-->
              <!--<el-select v-model="form.appealState" placeholder="请选择" clearable class="input-width">-->
                <!--<el-option label="上线" value="0" />-->
                <!--<el-option label="下线" value="1" />-->
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
  import {getPersonUnVerified, applyUpdate, approve, applyDel, getAppealById} from '../../service/api'
  import {timeFormat} from '../../utils/util';

  export default {
    name: 'personverified_layout',
    components: {Pagination},
    data() {
      return {
        personUnVerifiedData: [],
        query: {
          page: '1',
          size: '10',
          search: '',
          begin: '',
          end: ''
        },
        dialogFormVisible: false,
        datetimer: '',
        form: {},
        total: 0,
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClickn(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        }
      }
    },
    created() {
      this.getPersonUnVerifiedPage()
    },
    filters: {
      formatTime(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return timeFormat(date, 'yyyy-MM-dd hh:mm:ss')
      }
    },
    methods: {
      getPersonUnVerifiedPage() {
        getPersonUnVerified(this.query).then(re => {
          this.personUnVerifiedData = re.list
          this.total = re.total
        })
      },
      handleEdit(index, row) {
        getAppealById(row.id).then(re => {
          this.form = re;
          this.form.appealState = String(re.appealState);
        })
        this.dialogFormVisible = true;
      },
      pageSizeChange(val) {
        this.query.page = 1
        this.query.size = val.size
        this.structTime()
        this.getPersonUnVerifiedPage()
      },
      pageIndexChange(val) {
        this.query.page = val.page
        this.structTime()
        this.getPersonUnVerifiedPage()
      },
      handleSearchList() {
        this.structTime()
        this.getPersonUnVerifiedPage()
      },
      structTime() {
        if (this.datetimer) {
          this.query.begin = timeFormat(this.datetimer[0])
          this.query.end = timeFormat(this.datetimer[1])
        } else {
          this.query.begin = ''
          this.query.end = ''
        }
      },
      handleResetSearch() {
        this.query.search = ''
        this.datetimer = ''
        this.query.begin = ''
        this.query.end = ''
        this.query.page = 1
        this.query.size = 10
        this.getPersonUnVerifiedPage()
      },
      submitForm() {
        applyUpdate(this.form).then(re =>{
          this.dialogFormVisible = false;
          this.getPersonUnVerifiedPage()
        })
      },
      /*approve(row) {
        approve(row.id).then(re => {
          this.getPersonUnVerifiedPage()
        })
      },*/
      toApprove(val) {
        this.$router.push({path: '/adminperson', query: {id: val.id}})
      },
      handleRemove(row){
        this.$confirm('此操作将永久删除该申请, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          applyDel(row.id).then(re => {
            this.getPersonUnVerifiedPage()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
    }
  }
</script>

<style>

</style>
