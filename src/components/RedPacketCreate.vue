<template>
  <div style="width:30%; margin:150px auto">
    <el-form :model="submitRedPacket" ref="submitRedPacketForm" label-width="100px" class="demo-ruleForm">
      <el-form-item
        label="红包金额："
        prop="totalMoney"
        :rules="[
          { required: true, trigger: 'blur', message:'红包金额不能为空'},
          { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确金额格式'}
        ]"
      >
      <el-input type="string" v-model="submitRedPacket.totalMoney" autocomplete="off" placeholder="金额可保留两位小数"></el-input>
      </el-form-item>

      <el-form-item
        label="红包个数："
        prop="count"
        :rules="[
          { required: true, message: '个数不能为空'},
          { type: 'number', message: '个数须为数字'}
        ]"
      >
      <el-input v-model.number="submitRedPacket.count" autocomplete="off" placeholder="请输入整数"></el-input>
      </el-form-item>

      <el-form-item
        label="红包类型：">
        <el-radio v-model="submitRedPacket.typeRadio" label="1">普通红包</el-radio>
        <el-radio v-model="submitRedPacket.typeRadio" label="2">拼手气红包</el-radio>
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
    return {
      submitRedPacket: {
        totalMoney: '',
        count: '',
        typeRadio: '1',
        info: null
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
              totalMoney: this.submitRedPacket.totalMoney,
              count: this.submitRedPacket.count,
              // 创建者id为假数据！！！
              sendid: 2
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
