<template>
  <div>
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

    <!-- dialog 组件 -->
    <el-dialog
      title="修改红包"
      :visible.sync="dialogForm.visible"
      width=36%
      :close-on-click-modal='false'>

      <!-- 内嵌表单 用于输入更新后的数据 -->
      <el-form :model="updateRedForm" style="margin: 0 17%">
        <el-form-item
          label='红包金额：'
          prop="totalMoney"
          :label-width="dialogForm.labelWidth"
          :rules="[
            { required: true, trigger: 'blur', message:'红包金额不能为空'},
            { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确金额格式'}
          ]">
          <el-input style="width:208px" v-model="updateRedForm.totalMoney" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label='红包个数：'
          :label-width="dialogForm.labelWidth">
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
        @size-change="handleSizeChange"
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
    return {
      tableData: [{
        rid: 1,
        totalMoney: 1,
        count: 1,
        createTime: 1
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
        params: {
          rid: this.updateRedForm.rid,
          count: this.updateRedForm.count,
          totalMoney: this.updateRedForm.totalMoney
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
          url: '/api/getpageredinfo',
          params: {
            currentPage: this.pagination.currentPage,
            pageSize: 10
          }
          }).then(res => {
          this.tableData = []
          this.tableData = res.data.data.pageRecode
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
    handleSizeChange(size) {
      this.pagination.pageSize = size
      console.log('每页' + this.pagination.pageSize +'条')
    },
    handleCurrentChange(){
      console.log('当前是第' + this.pagination.currentPage +'页')
      axios({
      method: 'post',
      url: '/api/getpageredinfo',
      params: {
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
    }
  },
  mounted: function () {
    var _this = this
    axios({
      method: 'post',
      url: '/api/getpageredinfo',
      params: {
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
text-align: center;
margin-top: 12px;
}
</style>

// beforeClose: (action, instance, done) => {
//           if (action === 'confirm') {
//             instance.confirmButtonLoading = true;
//             instance.confirmButtonText = '执行中...';
//             setTimeout(() => {
//               done();
//               setTimeout(() => {
//                 instance.confirmButtonLoading = false;
//               }, 300);
//             }, 3000);
//           } else {
//             done();
//           }
//         }
//         }).then(action => {
//           this.$message({
//             type: 'info',
//             message: 'action: ' + action
//           });
//         });
