<template>
  <div class="hello" style="height: 100%">
    <!-- 引入样式 -->
    <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">

    <el-container>
      <el-header>
        <img src="../assets/logo_RedPacket.png" class="logo">
      </el-header>
      <el-container>
        <el-aside width="15%">
          <el-menu
            default-active="2-1"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            @select="handleSelect">

            <el-menu-item index="1">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>创建红包</span>
              </template>
            </el-menu-item>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-setting"></i>
                <span>编辑红包</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="2-1">
                  <span style="margin-left: 13px">基本属性</span>
                </el-menu-item>
                <el-menu-item index="2-2">
                  <span style="margin-left: 13px">修改状态</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item index="3">
              <i class="el-icon-message"></i>
              <span slot="title">查看进度</span>
            </el-menu-item>

          </el-menu>
        </el-aside>
        <el-container>
          <el-main>
            <router-view></router-view>
          </el-main>
          <el-footer class="m-footer">
            鲁ICP备09096283 | © 2000-2020 Haier.com. All rights reserved.
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    handleSelect (key, keyPath) {
      console.log(key)
      switch (key) {
        case '1':
          this.$router.push('/RedPacketCreate')
          break
        case '2-1':
          this.$router.push('/BasicMes')
          break
        case '2-2':
          this.$router.push('/StatusSet')
          break
        case '3':
          this.$router.push('/Progress')
          break
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-header {
    background-color: #bfcddf;
    color: #333;
    line-height: 60px;
  }
  .el-footer {
    background-color: rgb(238, 241, 246);
    text-align: center;
    padding: 13px;
    font-size: 14px;
    height: 40px !important;
  }
  .el-aside, .el-menu, .el-menu-item-group {
    background-color:rgb(238, 241, 246);
    color:  #333;
  }
  .logo, .a {
    margin: 10px 0 10px 8px;
    width: 40px;
    height: 40px;
  }
</style>
