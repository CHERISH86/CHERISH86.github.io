<template>
  <div style="width:30%; margin:13% auto">
    <el-form
      :model="submitRedPacket"
      ref="submitRedPacketForm"
      label-width="100px"
      status-icon
      :rules="rules"
    >
      <el-form-item
        label="红包金额："
        prop="totalMoney"
      >
      <el-input
        v-model="submitRedPacket.totalMoney"
        autocomplete="off"
        placeholder="金额可保留两位小数"
        ></el-input>
      </el-form-item>

      <el-form-item
        label="红包个数："
        prop="count"
      >
      <el-input v-model.number="submitRedPacket.count" autocomplete="off" placeholder="请输入整数"></el-input>
      </el-form-item>

      <el-form-item
        label="红包类型：">
        <el-radio v-model="submitRedPacket.typeRadio" label="1">拼手气红包</el-radio>
        <el-radio v-model="submitRedPacket.typeRadio" label="2">普通红包</el-radio>
      </el-form-item>

      <el-form-item class="button_item">
        <el-button type="primary" @click="submitForm('submitRedPacketForm')">提交</el-button>
        <el-button @click="resetForm('submitRedPacketForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  data () {
    const validateCount = (rule, value, callback) => {
      // 非空验证 整数验证 单个红包最小金额为0.01验证
      if (!value) {
        callback(new Error('请输入红包个数'))
      } else if (!Number.isInteger(value)) {
        callback(new Error('请输入整数'))
      } else if ((this.submitRedPacket.totalMoney / value) < 0.01) {
        callback(new Error('单个红包金额最小为0.01'))
      } else {
        this.$refs.submitRedPacketForm.clearValidate('totalMoney')
      }
      callback()
    }
    const validateSingleRed = (rule, value, callback) => {
      if ((this.submitRedPacket.totalMoney / this.submitRedPacket.count) < 0.01) {
        callback(new Error('单个红包金额最小为0.01'))
      } else {
        this.$refs.submitRedPacketForm.clearValidate('totalMoney')
        this.$refs.submitRedPacketForm.clearValidate('count')
      }
      callback()
    }
    return {
      submitRedPacket: {
        totalMoney: '',
        count: '',
        typeRadio: '1',
        info: null
      },
      rules: {
        totalMoney: [
          { required: true, message: '红包金额不能为空', trigger: 'blur' },
          // eslint-disable-next-line standard/object-curly-even-spacing
          { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确金额格式' }, { validator: validateSingleRed}
        ],
        count: [
          {validator: validateCount}
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios({
            method: 'post',
            url: '/api/setred',
            data: {
              totalMoney: parseFloat(this.submitRedPacket.totalMoney).toFixed(2),
              count: this.submitRedPacket.count,
              // 创建者id为假数据！！！
              sendId: 2
            }
          }).then(response => {
            this.$message({
              showClose: true,
              message: response.data.message,
              type: 'success',
              center: true
            })
          }).catch(error => {
            this.$message({
              showClose: true,
              message: error,
              type: 'error',
              center: true
            })
          })
        } else {
          this.$message({
            showClose: true,
            message: 'Sorry 数据有误',
            type: 'error',
            center: true
          })
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style>
.el-form-item {
  margin: 40px 0;
}
.button_item {
  margin: 0;
}
</style>
