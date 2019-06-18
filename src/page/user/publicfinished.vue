<template>
  <div>
    <el-row v-for="publicone in publicListData" :key="publicone.id" style="margin: 20px">
      <el-badge :value="publicone.state === 1 ? '完成' : '进行中'" :type="publicone.state === 1 ? 'success  ' : 'danger'">
        <el-card>
          <div @click="detail(publicone.id)">
            <el-col :span="4" class="image-div">
              <el-tooltip :content="tooltip" placement="top" effect="light">
                <el-image :src="publicone.file" lazy style="height: 100px;width: 100px;" fit="fill" />
              </el-tooltip>
            </el-col>
          </div>
          <el-col :span="20">
            <el-row>
              <div @click="detail(publicone.id)">
                <el-tooltip :content="tooltip" placement="top" effect="light">
                  <el-col class="title"> {{ publicone.title }}</el-col>
                </el-tooltip>
              </div>
            </el-row>
            <el-row type="flex" justify="space-between" style="margin-top: 40px;">
              <el-col>预筹：<el-tag>{{ publicone.goal }}</el-tag> 元</el-col>
              <el-col>已筹：<el-tag>{{ publicone.completed }}</el-tag> 元</el-col>
              <el-col>捐款人次：<el-tag>{{ publicone.appealCount }}</el-tag></el-col>
              <el-col>

              </el-col>
            </el-row>
          </el-col>
        </el-card>
      </el-badge>
    </el-row>

    <Pagination :pageSize="this.query.size" :pageIndex="this.query.page" :total="total"
                @pageSizeChange="pageSizeChange" @pageIndexChange="pageIndexChange"></Pagination>

    <el-dialog title="公益求助详情" :visible.sync="visibleSync" @close="closeDialog" width="40%">
      <el-form size='size' label-position="right" label-width="120px" :model="publicDetail">
        <el-form-item label='求助标题：' prop="title">
          <el-input v-model.trim="publicDetail.title" disabled></el-input>
        </el-form-item>
        <el-form-item label='预筹金额：' prop="goal">
          <el-input v-model.trim="publicDetail.goal" disabled>
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label='已筹金额：' prop="completed">
          <el-input v-model.trim="publicDetail.completed" disabled>
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label='捐款人次：' prop="appealCount">
          <el-input v-model.trim="publicDetail.appealCount" disabled></el-input>
        </el-form-item>
        <el-form-item label='求助人：' prop="userId">
          <el-input v-model.trim="publicDetail.userId" disabled></el-input>
        </el-form-item>
        <el-form-item label='求助内容：' prop="content">
          <el-input v-model.trim="publicDetail.content" disabled></el-input>
        </el-form-item>
        <el-form-item label='求助时间：' prop="gmtCreated">
          <el-input v-model.trim="publicDetail.gmtCreated" disabled></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>

  import { getPublicCompletedList } from '../../service/api'
  import Pay from '../../components/pay'
  import Pagination from '../../components/pagination'
  import { getCookie } from '../../utils/util'

  export default {
    name: 'publicfinished',
    components: { Pay, Pagination },
    data () {
      return {
        publicListData: [],
        query: {
          page: '1',
          size: '10',
          search: '',
          orderField: 'id',
          orderDirection: ''
        },
        payshow: false,
        appealId: '',
        tooltip: '点击查看求助详情',
        total: 0,
        visibleSync: false,
        publicDetail: []
      }
    },
    created () {
      this.getPublicCompletedList()
    },
    methods: {
      getPublicCompletedList () {
        getPublicCompletedList(this.query).then(re => {
          this.publicListData = re.list
          this.total = re.total
        })
      },
      toPay (val) {
        let flag = getCookie('token')
        if (flag) {
          this.payshow = true
          this.appealId = val
        } else {
          this.$router.push({path: '/login'})
        }
      },
      callPayClose (val) {
        this.payshow = val
      },
      pageSizeChange (val) {
        this.query.page = 1
        this.query.size = val.size
        this.getPublicCompletedList()
      },
      pageIndexChange (val) {
        this.query.page = val.page
        this.getPublicCompletedList()
      },
      detail (val) {
        this.$router.push({path: '/publicdetail', query: {id: val}})
      },
      closeDialog () {}
    }
  }
</script>

<style scoped>
  .image {
    width: 100px;
    height: 100px;
  }
  .image-div {
    margin-bottom: 15px;
    cursor: pointer;
  }
  .title {
    font-size: 24px;
    font-weight: 600;
    cursor: pointer;
  }
  .el-badge {
    display: block;
  }
  .div {
    cursor: pointer;
    float: right;
    width: 100px;
  }
</style>
