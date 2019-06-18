<!-- 首页 -->
<template>
  <el-container>
    <el-main>
      <el-row>
        <el-col :span="15">
          <el-row>
            <el-carousel indicator-position="outside">
              <el-carousel-item v-for="item in carouseImg" :key="item.id" :name="item.title">

                <div  @click="judgeDetail(item)">
                  <el-tooltip :content="tooltip" placement="top" effect="light">
                    <img :src="item.file" class="image">
                  </el-tooltip>
                </div>
                <div class="carouselTip">{{ item.title }}</div>
              </el-carousel-item>
            </el-carousel>
          </el-row>
          <el-row>
            <el-col class="title">
              <span>公益项目</span>
              <a style="float: right" href="javascript:;" @click="toPublicProject">更多</a>
            </el-col>
            <el-col :span="11" v-for="(pub, index) in publicListData" :key="pub.id" :offset="index % 2 === 1 ? 2 : 0"
                    style="margin-bottom: 10px">
              <el-card :body-style="{ padding: '0px' }" >
                <div @click="publicDetail(pub.id)">
                  <el-tooltip :content="tooltip" placement="top" effect="light">
                    <el-image :src="pub.file" lazy style="height: 179px;width: 319px;" fit="fill"/>
                  </el-tooltip>
                </div>

                <div style="padding: 14px;" @click="publicDetail(pub.id)">
                  <el-tooltip :content="tooltip" placement="top" effect="light">
                    <span> {{ pub.title }} </span>
                  </el-tooltip>

                  <el-row class="cardGyDiv">
                    <el-col :span="16">
                      <p>已筹：{{ pub.completed }} 元</p>
                      <p>捐款人次：{{ pub.appealCount }}</p>
                    </el-col>
                    <el-col :span="8">
                      <div>
                        <el-tag type="success" class="cardTag" @click="toPay(pub.id)">我要捐款</el-tag>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="8" :offset="1">
          <el-row style="margin-bottom: 10px">
            <el-card>
              <div slot="header">
                <span>系统公告</span>
              </div>
              <li v-for="b in bulletinListData" :key="b.id" class="item">
                <span @click="bulletinDetail(b)">{{ b.title }}</span>
                <div style="float: right" @click="bulletinDetail(b)">{{ b.gmtModified | timeFormat }}</div>
              </li>
            </el-card>
          </el-row>
          <el-row style="margin-bottom: 10px;">
            <img src="static/image/gy1.jpg" class="image">
            <div style="position:absolute; z-index:2; bottom:50px;margin-left: 50px">
              <dl>
                <dt>历史善款总额：</dt>
                <dd><span>63,524</span>元</dd>
              </dl>
              <dl>
                <dt>历史爱心总人次：</dt>
                <dd><span>2,316</span>人次</dd>
              </dl>
            </div>
          </el-row>
          <el-row>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>最新捐款</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="toDonationRecord">捐款记录</el-button>
              </div>
              <el-carousel indicator-position="outside" class="carousel">
                <el-carousel-item v-for="(o, index) in latestDontateList" :key="index">
                  <div>捐款人：&nbsp;&nbsp;&nbsp;&nbsp;{{o.donater}}</div>
                  <div>捐款金额：{{o.money}}元</div>
                  <div>捐款项目：{{o.projectName}}</div>
                  <div></div>
                </el-carousel-item>
              </el-carousel>
            </el-card>
          </el-row>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col>
          <el-card :body-style="{ padding: '0px' }">
            <div slot="header" class="title">
              <span>个人求助</span>
              <a style="float: right" href="javascript:;" @click="toPersonHelp">更多</a>
            </div>
            <el-row>
              <el-col :span="5" v-for="person in personListData" :key="person.id" style="margin: 20px">
                <el-card>
                  <div  @click="personDetail(person.id)">
                    <el-tooltip :content="tooltip" placement="top" effect="light">
                      <el-image :src="person.file" lazy style="height: 179px;width: 319px;" fit="fill"/>
                    </el-tooltip>
                  </div>

                  <div style="padding: 14px;">
                    <div @click="personDetail(person.id)">
                      <el-tooltip :content="tooltip" placement="top" effect="light">
                        <span> {{ person.title }}</span>
                      </el-tooltip>
                    </div>

                    <el-row class="cardGyDiv">
                      <el-col :span="16">
                        <p>已筹：{{ person.completed }} 元</p>
                        <p>捐款人次：{{ person.appealCount }}</p>
                      </el-col>
                      <el-col :span="8">
                        <div>
                          <el-tag type="success" class="cardTag" @click="toPay(person.id)">我要捐款</el-tag>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
    <Pay :payshow="payshow" @callPayClose="callPayClose" :appealId="appealId"></Pay>
    <el-dialog :visible.sync="bulletinSync" @close="bulletinDialogClose" width="40%" :close-on-click-modal="false">
      <div class="bulletin-dialog">
        <h1> {{ bulletinDetailData.title }} </h1>
        <p> 发布时间：{{ bulletinDetailData.gmtModified | timeFormat}} </p>
        <div> {{ bulletinDetailData.content }} </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bulletinDialogClose" type="primary">关  闭</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>

import Pay from '../../components/pay'
import { timeFormat } from '../../utils/util'
import { getPersonList, getPublicList, getBulletinList, getLatestDontateList, getDonatedList, getCarouselImg } from '../../service/api'
import { getCookie } from '../../utils/util'

export default {
  name: 'home',
  // 我要捐赠子组件
  components: { Pay },
  // 时间日期过滤器
  filters: { timeFormat },
  data () {
    return {
      // 我要捐款弹框
      payshow: false,
      // 个人、公益求助请求参数
      personQuery: {
        page: '1',
        size: '4',
        search: '',
        orderField: 'id',
        orderDirection: ''
      },
      // 轮播图
      carouseImg: [],
      // 个人求助列表
      personListData: [],
      // 公益求助列表
      publicListData: [],
      // 公告列表
      bulletinListData: [],
      // 公告详情弹框
      bulletinSync: false,
      // 公告详情数据
      bulletinDetailData: false,
      // 最新捐款列表
      latestDontateList: [],
      // 已完成捐赠
      donatedListData: [],
      // 捐赠项目id
      appealId: '',
      tooltip: '点击查看求助详情',
    }
  },
  created () {
    // 轮播图赋值(目前是静态前端默认图片)
    this.getCarouselImg()
    // 个人求助列表
    this.getPersonList()
    // 公益求助列表
    this.getPublicList()
    // 公告列表
    this.getBulletinList()
    // 最新捐款列表
    this.getLatestDontateList()
    // 已完成捐赠列表
    this.getDonatedList();
  },
  watch: {},
  mounted () {},
  methods: {
    //轮播图
    getCarouselImg(){
      getCarouselImg('1').then(re =>{
        this.carouseImg = re
      })
    },
    // 关闭公告详情
    bulletinDialogClose () {
      this.bulletinSync = false
      this.bulletinDetailData = []
    },
    // 查看公告详情
    bulletinDetail (b) {
      this.bulletinSync = true
      this.bulletinDetailData = b
    },
    // 获取最新捐款列表
    getLatestDontateList () {
      getLatestDontateList(this.personQuery).then(re => {
        this.latestDontateList = re.list
      })
    },
    // 获取公告列表
    getBulletinList () {
      getBulletinList(this.personQuery).then(re => {
        this.bulletinListData = re.list
      })
    },
    // 获取公益求助列表
    getPublicList () {
      getPublicList(this.personQuery).then(re => {
        this.publicListData = re.list
      })
    },
    // 获取个人求助列表
    getPersonList () {
      getPersonList(this.personQuery).then(re => {
        this.personListData = re.list
      })
    },
    // 获取已完成捐赠列表
    getDonatedList () {
      getDonatedList(this.personQuery).then(re => {
        this.donatedListData = re.list
      })
    },
    //  打开我要捐款弹框
    toPay (val) {
      let flag = getCookie('token')
      if (flag) {
        this.payshow = true
        this.appealId = val
      } else {
        this.$router.push({path: '/login'})
      }
    },
    // 关闭我要捐款弹框回调函数
    callPayClose (val) {
      this.payshow = val
    },
    // 公益项目更多
    toPublicProject () {
      this.$router.push({path: '/publicproject'})
    },
    // 个人项目更多
    toPersonHelp () {
      this.$router.push({path: '/personhelp'})
    },
    // 捐款记录
    toDonationRecord () {
      this.$router.push({path: '/record'})
    },
    publicDetail (val) {
      this.$router.push({path: '/publicdetail', query: {id: val}})
    },
    personDetail (val) {
      this.$router.push({path: '/applydetail', query: {id: val}})
    },
    judgeDetail(val){
      if (val.type === 0){
        this.$router.push({path: '/publicdetail', query: {id: val.id}})
      }else {
        this.$router.push({path: '/applydetail', query: {id: val.id}})
      }
    }
  }
}
</script>

<style scoped>
  /*轮播图*/
  .carouselTip{
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    line-height: 150%;
    font-size: 16px;
    color: #fff;
    padding: 4px;
    background-color: rgba(47,50,56,.6);
  }
  /*公益项目*/
  .cardGyDiv p{
    color: #afafaf;
    font-size: 12px;
  }
  .cardTag{
    position: absolute;
    right: 0;
    bottom: 0;
    cursor: pointer;
  }
  /*card*/
  .item {
    margin-bottom: 15px;
    list-style: none;
    cursor: pointer;
  }
  .item span:hover{
    color: #409eff;
  }
  /*图片*/
  .image{
    width:100%;
    display: block;
  }
  /*标题*/
  .title{
    margin-bottom: 20px;
    font-size: 1.17em;
    font-weight: bold;
  }
  a{
    color: #409eff;
  }
  /*历史纪录*/
  dd{
    margin-left: 0px
  }
  dd span {
    background: url(/static/image/bg1.png) no-repeat;
    color: #579f23;
    display: inline-block;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 30px;
    height: 46px;
    line-height: 46px;
    margin-right: 10px;
    padding-right: 14px;
    text-align: right;
    width: 210px;
  }
  dt {
    font-family: "微软雅黑", "黑体";
    font-size: 16px;
    height: 36px;
    line-height: 36px;
  }
  /*公告详情*/
  .bulletin-dialog h1 {
    font-size: 30px;
    line-height: 36px;
    margin: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #dfdfe1;
    text-align: center;
    font-family: 'microsoft yahei', "黑体";
    font-weight: normal;
  }
  .bulletin-dialog > p{
    line-height: 18px;
    padding-top: 0px;
    color: #93939e;
    font-size: 11px;
    text-align: center;
    margin-top: 0px;
  }
  /* 捐款 */
  .carousel div {
    font-size: 14px;
    margin: 12px;
  }
</style>
