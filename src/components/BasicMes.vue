<template>
  <div>
    <div>
      <div style="display: flex; float:left">
        <el-button
          style="background-color: #ECF5FF"
          size="medium"
          plain
          @click="handleAllRedInfo">
          红包总览</el-button>
        <div style="display: flex">
          <transition name="el-zoom-in-center">
              <div v-show="allRedInfoShow" class="transition-box">总红包数：{{allRedInfo.totalRedCount}}</div>
          </transition>
          <transition name="el-zoom-in-center">
              <div v-show="allRedInfoShow" class="transition-box">未开抢：{{allRedInfo.redNotCount}}</div>
          </transition>
          <transition name="el-zoom-in-center">
              <div v-show="allRedInfoShow" class="transition-box">正在抢：{{allRedInfo.redSnatchCount}}</div>
          </transition>
          <transition name="el-zoom-in-center">
              <div v-show="allRedInfoShow" class="transition-box">已抢完：{{allRedInfo.redOverCount}}</div>
          </transition>
          <transition name="el-zoom-in-center">
              <div v-show="allRedInfoShow" class="transition-box">总金额：{{allRedInfo.totalMoney}}</div>
          </transition>
          <transition name="el-zoom-in-center">
              <div v-show="allRedInfoShow" class="transition-box">已抢金额：{{allRedInfo.snatchMoney}}</div>
          </transition>
        </div>
      </div>
      <div style="float: right; padding-bottom: 10px">
        <el-button
          style="background-color: #ECF5FF"
          icon="el-icon-delete"
          plain
          size="medium"
          @click="handleDeleteSearch">清空搜索</el-button>
        <el-input
            v-model="search"
            style="width: 150px"
            size="medium"
            placeholder="输入红包ID搜索"/>
        <el-button
          style="background-color: #ECF5FF"
          icon="el-icon-search"
          plain
          size="medium"
          @click="handleSearch">搜索</el-button>
        <el-button
          style="background-color: #ECF5FF"
          plain
          size="medium"
          @click="goToCreate">添加红包</el-button>
      </div>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :row-style="{height: '0px'}"
      :cell-style="{padding: '7px'}"
      :header-cell-style="headerStyle"
      border>

      <!-- width宽度不够会导致数字垂直排列 -->
      <el-table-column
        type="index"
        width= "100px"
        label="序号"
        text-align="center">
      </el-table-column>

      <el-table-column
        prop="rid"
        width="130px"
        label="红包ID"
        align="center">
      </el-table-column>

      <el-table-column
        prop="totalMoney"
        width="150px"
        label="红包金额（元）"
        align="center">
      </el-table-column>

      <el-table-column
        prop="count"
        width="150px"
        label="红包个数"
        align="center">
      </el-table-column>

      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center">
      </el-table-column>

      <!-- 0-未开抢 1-正在抢 2-已结束 -->
      <el-table-column
        prop="status"
        width="150px"
        label="状态"
        align="center"
        :filters="[{text:'未开抢',value: 0}, {text:'正在抢',value:1}, {text:'已抢完',value:2}]"
        :filter-method="filterType"
        >
        <template slot-scope="scope">
          <el-tag
            :type=getTagType(scope.row)>
            {{getStatus(scope.row)}}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column width="300px" label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-edit"
            round
            :disabled='scope.row.status == 0 ? false : true'
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-check"
            round
            plain
            :disabled='scope.row.status == 0 ? false : true'
            @click="handleBegin(scope.$index, scope.row)">开抢</el-button>
      </template>
      </el-table-column>
    </el-table>

    <!-- dialog 组件 -->
    <el-dialog
      title="修改红包"
      :visible.sync="dialogForm.visible"
      width=36%
      :close-on-click-modal='false'>

      <!-- 内嵌表单 用于输入更新后的数据 -->
      <el-form :model="updateRedForm" style="margin: 0 17%" :rules="rules">
        <el-form-item
          label='红包金额：'
          prop="totalMoney"
          :label-width="dialogForm.labelWidth"
          >
          <el-input-number
            style="width:208px"
            v-model="updateRedForm.totalMoney" auto-complete="off"
            :controls='false'
            :precision='2'
            :min="0.01"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          label='红包个数：'
          :label-width="dialogForm.labelWidth"
          prop="count">
          <el-input-number style="width:208px" v-model="updateRedForm.count" auto-complete="off" :min="1" :precision='0'></el-input-number>
        </el-form-item>
        <el-form-item
          label="红包类型："
          :label-width="dialogForm.labelWidth">
          <el-radio v-model="updateRedForm.typeRadio" label="1">拼手气红包</el-radio>
          <el-radio v-model="updateRedForm.typeRadio" label="2">普通红包</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogForm.visible = false">取 消</el-button>
        <el-button type="primary" @click="submitUpdateRedForm('updateRedForm')">确 定</el-button>
      </div>
    </el-dialog>

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

<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script>

import axios from 'axios'

export default ({
  data (){
    var validateCount = (rule, value, callback) => {
      // 非空验证 整数验证 单个红包最小金额为0.01验证
      if (!value) {
        callback(new Error('请输入红包个数'))
      } else if (!Number.isInteger(value)) {
        callback(new Error('请输入整数'))
      } else if ((this.updateRedForm.totalMoney / value) < 0.01) {
        callback(new Error('单个红包金额最小为0.01'))
      } else {
        callback()
      }
    }
    return {
      allRedInfo: {
        totalRedCount: 600,
        redNotCount: 190,
        redSnatchCount: 320,
        redOverCount: 90,
        totalMoney: 7427.11,
        snatchMoney: 3651.76
      },
      tableData: [
        {
        rid: 1,
        totalMoney: 1,
        count: 1,
        createTime: '--',
        status: 0
        },
        {
        rid: 1,
        totalMoney: 1,
        count: 1,
        createTime: '--',
        status: 1
        },
        {
        rid: 1,
        totalMoney: 1,
        count: 1,
        createTime: '--',
        status: 2
        },
        {
        rid: 1,
        totalMoney: 1,
        count: 1,
        createTime: '--',
        status: 0
        },
        {
        rid: 1,
        totalMoney: 1,
        count: 1,
        createTime: '--',
        status: 0
        },
        {
        rid: 1,
        totalMoney: 1,
        count: 1,
        createTime: '--',
        status: 0
        },
        {
        rid: 1,
        totalMoney: 1,
        count: 1,
        createTime: '--',
        status: 0
        },
        {
        rid: 1,
        totalMoney: 1,
        count: 1,
        createTime: '--',
        status: 0
        },
        {
        rid: 1,
        totalMoney: 1,
        count: 1,
        createTime: '--',
        status: 0
        },
        {
        rid: 1,
        totalMoney: 1,
        count: 1,
        createTime: '--',
        status: 0
        }],
      dialogForm: {
        visible: false,
        labelWidth: '100px'
      },
      headerStyle: {
        'padding': '5px'
      },
      pagination: {
        total: 1,
        currentPage: 1,
        pageSize: 10
      },
      allRedInfoShow: false,
      search: '',
      updateRedForm: {
        totalMoney: '',
        count: '',
        rid: '',
        typeRadio: '1'
      },
      rules: {
        count: [
          {validator: validateCount, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    handleAllRedInfo (){
      this.allRedInfoShow = !this.allRedInfoShow
      axios({
        method: 'get',
        url: '/api/allredinfo',
      }).then(res => {
        this.allRedInfo = res.data.data
      }).catch(function (error) {
        console.log(error)
      })
    },
    handleEdit (index, row) {
      console.log(index, row)
      this.dialogForm.visible = true
      this.updateRedForm.totalMoney = row.totalMoney
      this.updateRedForm.count = row.count
      this.updateRedForm.rid = row.rid
    },
    handleSearch() {
      axios({
        method: 'post',
        url: '/api/query/rid',
        params: {
          rid: this.search,
        }
      }).then(res => {
        this.tableData = []
        this.tableData = res.data.data
        this.pagination.total = res.data.data.length
        this.pagination.currentPage = 1
        setTimeout(function(){
          // 动态设置分页栏的位置 使其居中
          var div = document.getElementsByClassName('block')[0]
          var width = div.clientWidth
          div.style.marginLeft = -width/2 + 'px'
        }, 400)
      }).catch(function (error) {
        console.log(error)
      })
    },
    handleDeleteSearch () {
      this.search = ''
      axios({
        method: 'post',
        url: '/api/getpageallred',
        data: {
          currentPage: 1,
          pageSize: 10
        }
      }).then(res=> {
        this.tableData = res.data.data.pageRecode
        this.pagination.total = res.data.data.total
        setTimeout(function(){
          // 动态设置分页栏的位置 使其居中
          var div = document.getElementsByClassName('block')[0]
          var width = div.clientWidth
          div.style.marginLeft = -width/2 + 'px'
        }, 400)
      }).catch(error=> {
        console.log(error)
      })
    },
    submitUpdateRedForm(formName){
      console.log(this.updateRedForm.totalMoney,this.updateRedForm.count,this.updateRedForm.rid,this.updateRedForm.type)
      axios({
        method: 'post',
        url: '/api/updatered',
        data: {
          rid: this.updateRedForm.rid,
          count: this.updateRedForm.count,
          totalMoney: parseFloat(this.updateRedForm.totalMoney).toFixed(2),
          type: this.updateRedForm.typeRadio
        }
      }).then(response => {
        this.$message({
          showClose: true,
          message: response.data.message,
          type: 'success',
          center: true
        }),
        axios({
          method: 'post',
          url: '/api/getpageallred',
          data: {
            currentPage: this.pagination.currentPage,
            pageSize: 10
          }
        }).then(res => {
          this.tableData = []
          this.tableData = res.data.data.pageRecode
          this.tableData.status = 1
        }).catch(function (error) {
          console.log(error)
        })
      }).catch(error => {
        this.$message({
          showClose: true,
          message: error,
          type: 'error',
          center: true
        })
      })
      this.dialogForm.visible = false
    },
    handleCurrentChange(){
      console.log('当前是第' + this.pagination.currentPage +'页')
      axios({
        method: 'post',
        url: '/api/getpageallred',
        data: {
          currentPage: this.pagination.currentPage,
          pageSize: 10
        }
      }).then(res => {
        this.tableData = []
        this.tableData = res.data.data.pageRecode
      }).catch(function (error) {
        console.log(error)
      })
    },
    handleBegin (index, row) {
      console.log(index, row)
      this.$confirm('确定修改红包状态？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(()=>{
        axios({
          method: 'post',
          url: '/api/sendred',
          params: {
            rid: row.rid
          }
        }).then(res => {
          this.$message({
            showClose: true,
              message: res.data.message,
              type: 'success',
              center: true
          })
          axios({
            method: 'post',
            url: '/api/getpageallred',
            data: {
              currentPage: this.pagination.currentPage,
              pageSize: 10
            }
            }).then(res => {
              this.tableData = []
              this.tableData = res.data.data.pageRecode
            }).catch(error => {
              this.$message({
                showClose: true,
                message: error,
                type: 'error',
                center: true
              })
          })
        }).catch(function (error) {
          console.log(error)
        })
      }).catch(()=>{
        this.$message({
          type: 'info',
          message: '开抢操作已取消！'
        })
      })
    },
    // 对应红包列表 文字状态说明
    getStatus(row) {
      switch(row.status) {
        case 0 :
          return '未开抢'
          break
        case 1 :
          return '正在抢'
          break
        case 2 :
          return '已抢完'
          break
      }
    },
    // 对应红包列表 按钮颜色
    getTagType(row) {
      switch(row.status) {
        case 0 :
          return 'info'
          break
        case 1 :
          return 'danger'
          break
        case 2 :
          return 'primary'
          break
      }
    },
    filterType(value, row){
      return row.status === value
    },
    goToCreate(){
      // 动态设置分页栏的位置 使其居中
      var div = document.getElementsByClassName('block')[0]
      var width = div.clientWidth
      // div.style.marginLeft = '-29px'
      console.log("不是mounted分页栏宽度：" + width)
      this.$router.replace('/RedPacketCreate')
    }
  },
  mounted: function () {
    var _this = this
    axios({
      method: 'post',
      url: '/api/getpageallred',
      data: {
          currentPage: 1,
          pageSize: 10
        }
    }).then(function (res) {
      _this.tableData = res.data.data.pageRecode
      _this.pagination.total = res.data.data.total
    }).catch(function (error) {
      console.log(error)
    })
    setTimeout(function(){
      // 动态设置分页栏的位置 使其居中
      var div = document.getElementsByClassName('block')[0]
      var width = div.clientWidth
      div.style.marginLeft = -width/2 + 'px'
    }, 400)
  }
})
</script>

<style>
.block  {
/* text-align: center;
margin-top: 12px; */
  position: absolute; left: 57%; bottom: 7%;
}
.transition-box {
  padding: 8px 5px;
  margin-left: 5px;
  height: 35px;
  border-radius: 4px;
  background-color: #6abcff;
  text-align: center;
  color: #fff;
  box-sizing: border-box;
  font-size: 14px;
}
.transition-box:nth-child(2n+1){
  background-color: #5db2ff;
}
</style>
