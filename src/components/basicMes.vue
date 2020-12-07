<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :row-style="{height: '0px'}"
      :cell-style="{padding: '9px'}">

      <el-table-column
        type="index"
        width="50px"
        label="序号"
        align="center">
      </el-table-column>

      <el-table-column
        prop="rid"
        label="红包ID"
        align="center">
      </el-table-column>

      <el-table-column
        prop="totalMoney"
        label="红包金额"
        align="center">
      </el-table-column>

      <el-table-column
        prop="count"
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

      <el-table-column label="操作" align="center">
        <template slot="header" slot-scope="scope">
           <el-button
            type="primary"
            plain round
            size="small"
            @click="goToCreate">添加红包
          </el-button>
        </template>
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
      updateRedForm: {
        totalMoney: '',
        count: '',
        rid: '',
        typeRadio: '1'
      },
      pagination: {
        total: 1,
        currentPage: 1,
        pageSize: 10
      },
      rules: {
        count: [
          {validator: validateCount, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    handleEdit (index, row) {
      console.log(index, row)
      this.dialogForm.visible = true
      this.updateRedForm.totalMoney = row.totalMoney
      this.updateRedForm.count = row.count
      this.updateRedForm.rid = row.rid
    },
    submitUpdateRedForm(formName){
      console.log(this.updateRedForm.totalMoney,this.updateRedForm.count,this.updateRedForm.rid,this.updateRedForm.type)
      axios({
        method: 'post',
        url: '/api/updatered',
        data: {
          rid: this.updateRedForm.rid,
          count: this.updateRedForm.count,
          totalMoney: this.updateRedForm.totalMoney,
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
  }
})
</script>

<style>
.block  {
/* text-align: center;
margin-top: 12px; */
position: absolute;left: 50%; bottom: 7%;
}
</style>
