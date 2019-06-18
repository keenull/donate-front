<template>
  <div class="timeAnalysis-wrapper">
    <div id="meetingRoomUsedAll" class="meetingRoomUsedAll">
      <ve-line :data="chartData" :settings="chartSettings"></ve-line>
    </div>
    <div class="bottom">
      <div id="meetingRoomUsedNear" class="meetingRoomUsedNear">
        <ve-pie :theme-name="name" :data="chartData" :settings="chartSettings"></ve-pie>
      </div>
    </div>
  </div>
</template>

<script>

  import { getLastWeekPay } from '../../service/api'
  import {dateFormate} from "../../utils/util";

  export default {
    data () {
      this.chartSettings = {
        limitShowNum: 7
      }
      return {
        name: "啦啦啦",
        chartData: {
          columns: ['time','count'],
          rows: []
        }
      }
    },
    created() {
      this.getRows();
    },
    methods: {
      getRows() {
        getLastWeekPay(1).then(res =>{
          for (let i = 0; i < res.length; i++){
            res[i].time=dateFormate(res[i].time,"yyyy-MM-dd");
            this.chartData.rows.push(res[i]);
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .timeAnalysis-wrapper {
    height: 100%;
    margin: 10px;
    .meetingRoomUsedAll {
      width: 100%;
      height: 350px;
    }
    .bottom {
      margin-top: 20px;
      width: 100%;
      .meetingRoomUsedNear,
      .meetingRoomUsedNearAnalysic {
        display: inline-block;
        width: 50%;
        height: 350px;
      }
    }
  }
</style>
