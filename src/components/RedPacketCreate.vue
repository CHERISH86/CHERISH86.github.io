<template>
  <div style="width:30%">
    <el-form :model="submitRedPacket" ref="submitRedPacketForm" label-width="100px" class="demo-ruleForm">
      <el-form-item
        label="红包金额："
        prop="amount"
        :rules="[
          { required: true, message: '金额不能为空'},
          { type: 'number', message: '金额须为数字'}
        ]"
      >
      <el-input type="age" v-model.number="submitRedPacket.amount" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item
        label="红包个数："
        prop="number"
        :rules="[
          { required: true, message: '个数不能为空'},
          { type: 'number', message: '个数须为数字'}
        ]"
      >
      <el-input type="age" v-model.number="submitRedPacket.number" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item
        label="红包类型：">
        <el-radio v-model="submitRedPacket.typeRadio" label="1">普通红包</el-radio>
        <el-radio v-model="submitRedPacket.typeRadio" label="2">拼手气红包</el-radio>
      </el-form-item>

      <el-form-item>
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
        amount: '',
        number: '',
        typeRadio: '1',
        info: null
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert(this.submitRedPacket.typeRadio)
          axios({
            method: 'post',
            url: 'http://mock-api.com/ZgYLmJzN.mock/redpacketcreate',
            data: {
              // amount: this.submitRedPacket.amount,
              // number: this.submitRedPacket.number
              amount: 1,
              number: 1
            }
          }).then(response => {
            this.info = response
            alert(this.info.data)
          }).catch(error => {
            console.log(error)
          })
        } else {
          alert('error submit!!')
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
