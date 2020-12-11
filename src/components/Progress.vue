<template>
  <div>
    <el-row justify="space-around">
      <el-col :span="4" v-for="(item,index) in progressDataList" :key="index" style="margin:15px 20px; text-align:center">
        <el-card :body-style="{ padding: '0px' }">
          <!-- <img src="../assets/logo_RedPacket_gray.png" class="image"> -->
          <!-- 环形进度条 -->
          <div style="margin:10px 0">
            <el-progress
              type="circle"
              :width=120
              :stroke-width=4
              :percentage="setItemProgress(item)"
              :color="setProgressColor(item)"
              v-if="!isNaN(parseInt(((item.count - item.restCount) / item.count).toFixed(4) * 100))"
            >
            </el-progress>
          </div>
          <div>
            <span>红包ID: {{item.rid}}</span>
            <div class="bottom clearfix">
              <p class="time">{{item.sendTime}}</p>
              <p class="time">
                已领
                {{item.count-item.restCount}}/{{item.count}}个,
                {{(item.totalMoney-item.restMoney).toFixed(2)}}/{{item.totalMoney}}元
              </p>
              <el-button style="padding: 10px" type="text" class="button" @click="handleLookRedInfo(item)">查看大家的手气</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- dialog弹出框 用于显示每个红包的具体被抢信息 -->
    <el-dialog
        title="看看大红包都被谁抢啦~"
      :visible.sync="dialogForm.visible"
      width=45%
      >
      <el-table
        :data="dialogTableData"
        style="width: 100%"
        height="350"
        >

        <el-table-column
          type="index"
          width="50"
          label="序号"
          align="center">
        </el-table-column>

        <el-table-column
          prop="receiveId"
          label="抢包人"
          align="center">
        </el-table-column>

        <el-table-column
          prop="getMoney"
          label="抢到金额"
          align="center">
        </el-table-column>

        <el-table-column
          prop="getTime"
          label="抢包时间"
          align="center">
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 分页导航栏 -->
    <div class="block">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="pagination.currentPage"
        :page-size="pagination.pageSize"
        layout="prev, pager, next, jumper"
        :total="pagination.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      progressDataList: [{
        rid: 1,
        totalMoney: 100,
        restMoney: 0,
        count: '10',
        restCount: 0,
        sendTime: '2020-11-16 22:09:09'
      }],
      progress: {
        percentage: 10
      },
      pagination: {
        total: 1,
        currentPage: 1,
        pageSize: 10
      },
      dialogForm: {
        visible: false
      },
      dialogTableData: [{
        receiveId: '1',
        getMoney: '100',
        getTime: '2020-11-16 22:09:09'
      }
      ]
    }
  },
  methods: {
    setItemProgress (item) {
      if (item.restCount === 0) {
        return 100
      } else {
        // 保留两位小数取整
        return parseInt(((item.count - item.restCount) / item.count).toFixed(4) * 100)
      }
    },
    // 根据抢的进度 控制进度条颜色
    setProgressColor (item) {
      if (item.restCount === 0) {
        return '#7db88a'
      } else {
        return '#409eff'
      }
    },
    handleCurrentChange () {
      console.log('当前是第' + this.pagination.currentPage + '页')
      axios({
        method: 'post',
        url: '/api/getpageredenvelop',
        data: {
          currentPage: this.pagination.currentPage,
          pageSize: 10
        }
      }).then(res => {
        this.progressDataList = []
        this.progressDataList = res.data.data.pageRecode
      }).catch(function (error) {
        console.log(error)
      })
    },
    handleLookRedInfo (redInfo) {
      console.log(redInfo.rid)
      this.dialogForm.visible = true
      axios({
        method: 'post',
        url: '/api/getreddetails',
        params: {
          rid: redInfo.rid
        }
      }).then(res => {
        this.dialogTableData = res.data.data
      }).catch(function (error) {
        console.log(error)
      })
    }
  },
  mounted: function () {
    var _this = this
    axios({
      method: 'post',
      url: '/api/getpageredenvelop',
      data: {
        currentPage: 1,
        pageSize: 10
      }
    }).then(function (res) {
      _this.progressDataList = res.data.data.pageRecode
      _this.pagination.total = res.data.data.total
    }).catch(function (error) {
      console.log(error)
    })
  }
}
</script>

<style>
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    line-height: 6px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }

  .clearfix:after {
      clear: both
  }

  .block  {
    text-align: center;
    margin-top: 12px;
    float: bottom;
  }

  .el-card:hover {
    transform: scale(1.02);
  }
</style>
