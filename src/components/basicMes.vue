<template>
  <div id="basicMes">
    <el-table
      :data="tableData"
      style="width: 100%">

      <el-table-column
      type="index"
      width="50"
      label="序号"
      align="center">
    </el-table-column>

      <el-table-column
        prop="rid"
        label="红包ID"
        align="center">
      </el-table-column>

      <el-table-column
        prop="totalmoney"
        label="红包金额"
        align="center">
      </el-table-column>

      <el-table-column
        prop="count"
        label="红包个数"
        align="center">
      </el-table-column>

      <el-table-column
        prop="creattime"
        label="创建时间"
        align="center">
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
        <el-button
          size="mini"
          icon="el-icon-edit"
          round
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          icon="el-icon-check"
          round
          @click="handleBegin(scope.$index, scope.row)">开抢</el-button>
      </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script src="https://unpkg.com/vue/dist/vue.js"></script>

<script>
import axios from 'axios'
export default ({
  data (){
    return {
      tableData: [{
        rid: '',
        totalmoney: '',
        count: '',
        creattime: ''
      }
      ]
    }
  },
  methods: {
    handleEdit (index, row) {
      console.log(index, row)
    },
    handleBegin (index, row) {
      console.log(index, row)
    }
  },
  mounted: function () {
    var _this = this
    axios({
      method: 'get',
      url: '/api/getredinfo'
    }).then(function (res) {
      _this.tableData = res.data.data
    }).catch(function (error) {
      console.log(error)
    })
  }
})
</script>

<style>
</style>
