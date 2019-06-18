<template>
  <div>
    <el-row v-for="person in personListData" :key="person.id" style="margin: 20px">
      <el-badge :value="person.state === 1 ? '完成' : '进行中'" :type="person.state === 1 ? 'success  ' : 'danger'">
        <el-card>
          <div @click="detail(person.id)">
            <el-col :span="4" class="image-div">
              <el-tooltip :content="tooltip" placement="top" effect="light">
                <el-image :src="person.file" lazy style="height: 100px;width: 100px;" fit="fill" />
              </el-tooltip>
            </el-col>
          </div>
          <el-col :span="20">
            <el-row>
              <div @click="detail(person.id)">
                <el-tooltip :content="tooltip" placement="top" effect="light">
                  <el-col class="title"> {{ person.title }}</el-col>
                </el-tooltip>
              </div>
            </el-row>
            <el-row type="flex" justify="space-between" style="margin-top: 40px;">
              <el-col>预筹：<el-tag>{{ person.goal }}</el-tag> 元</el-col>
              <el-col>已筹：<el-tag>{{ person.completed }}</el-tag> 元</el-col>
              <el-col>捐款人次：<el-tag>{{ person.appealCount }}</el-tag></el-col>
              <el-col>
                <div class="div">
                  <el-tag type="success" @click="toPay(person.id)">我要捐款</el-tag>
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-card>
      </el-badge>
    </el-row>

    <Pagination :pageSize="this.query.size" :pageIndex="this.query.page" :total="total"
                @pageSizeChange="pageSizeChange" @pageIndexChange="pageIndexChange"></Pagination>
    <Pay :payshow="payshow" @callPayClose="callPayClose" :appealId="appealId"></Pay>

    <el-dialog title="个人求助详情" :visible.sync="visibleSync" @close="closeDialog" width="40%">
      <el-form size='size' label-position="right" label-width="120px" :model="personhelp">
        <el-form-item label='求助标题：' prop="title">
          <el-input v-model.trim="personhelp.title" disabled></el-input>
        </el-form-item>
        <el-form-item label='预筹金额：' prop="goal">
          <el-input v-model.trim="personhelp.goal" disabled>
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label='已筹金额：' prop="completed">
          <el-input v-model.trim="personhelp.completed" disabled>
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label='捐款人次：' prop="appealCount">
          <el-input v-model.trim="personhelp.appealCount" disabled></el-input>
        </el-form-item>
        <el-form-item label='求助人：' prop="userId">
          <el-input v-model.trim="personhelp.userId" disabled></el-input>
        </el-form-item>
        <el-form-item label='求助内容：' prop="content">
          <el-input v-model.trim="personhelp.content" disabled></el-input>
        </el-form-item>
        <el-form-item label='求助时间：' prop="gmtCreated">
          <el-input v-model.trim="personhelp.gmtCreated" disabled></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getPersonList } from '../../service/api'
import Pay from '../../components/pay'
import Pagination from '../../components/pagination'
import { getCookie } from '../../utils/util'

export default {
  name: 'personhelp',
  components: { Pay, Pagination },
  data () {
    return {
      personListData: [],
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
      personhelp: []
    }
  },
  created () {
    this.getPersonList()
  },
  methods: {
    getPersonList () {
      getPersonList(this.query).then(re => {
        this.personListData = re.list
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
      this.getPersonList()
    },
    pageIndexChange (val) {
      this.query.page = val.page
      this.getPersonList()
    },
    detail (val) {
      this.$router.push({path: '/applydetail', query: {id: val}})
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
