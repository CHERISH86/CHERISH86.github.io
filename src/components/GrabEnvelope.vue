<!--
 * @Description: 测试开红包动画
 * @Autor: 王均祥
 * @Date: 2020-12-08 09:21:37
 * @LastEditors: 王均祥
 * @LastEditTime: 2020-12-15 09:33:57
-->
<template>
  <div id="hongbao" class="hongbao" style="display:block;" onclick="">
   <el-dialog
  title="提示"
  :visible= true
  width="30%"
  center>
  <span>需要注意的是内容是默认不居中的</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
 </div>
</template>

<script>
export default {
  methods: {
    divClick () {
      console.log(1)
      document.getElementbyId('open_back').onclick = function (e) {
        // 屏蔽父层点击事件
        e.stopPropagation()
        // 红包开字图片旋转
        document.getElementbyId('open_back').style.cssText = 'animation: move 3s ease-in-out infinite;'
        setTimeout(function () {
          // 结束凯开字图片旋转
          document.getElementbyId('open_back').style.cssText = 'animation-play-state:paused;'
        }, 3000)
      }
    }
  }
}
</script>

<style>
.hongbao{
  background:url('../assets/红包(1).png');
  /*background:#FFF;*/
  background-size: 100% 100%;
  /*filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#99000000, endColorstr=#99000000);
  /* For IE 8*/
  /*-ms-filter: "progid:DXImageTransform.Microsoft.gradient(startColorstr=#99000000, endColorstr=#99000000)";*/
  width: 75%;
  height: 17.5rem;
  /*line-height: 15rem;*/
  margin-left: 12.5%;
  margin-top: 8rem;
  border-radius:0.5rem;
  /*text-align: center;*/
}
.open_div{
  display:flex;justify-content:center;
}
.open_back{
  background-image:url('../assets/红包(1).png');
  background-size: 100% 100%;
  width:5.6rem;
  height:5.6rem;
  margin-top: 3rem;
  display:flex;
  justify-content:center;
  align-items:center;
  /*transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg);*/
}
@keyframes move {
  0% {
    transform: rotateY(0deg);
    -webkit-transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(360deg);
    -webkit-transform: rotateY(360deg);
  }
}
</style>
