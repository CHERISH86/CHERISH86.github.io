<!--
 * @Description: 用户端——红包雨界面
 * @Autor: 王均祥
 * @Date: 2020-12-09 15:42:29
 * @LastEditors: 王均祥
 * @LastEditTime: 2020-12-15 16:45:49
-->
<template>
  <div>
  <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">
    <div id="redzone">
      <el-button @click="getAllEnvelope">测试各方法</el-button>
    </div>
    <div>
      <el-dialog
        :visible.sync="dialogVisible"
        width="17%"
        center
        @close="handleDialogClose">
        <img src="../assets/红包(3).png" @click="handleOpenEnve">
        <span slot="footer" class="dialog-footer">
          <!-- <el-button @click="centerDialogVisible = false">取 消</el-button> -->
          <span v-show="moneyVisible">抢到金额：{{envelopeMoney}}</span>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'hongbao',
  data () {
    return {
      envelope: {
        list: [
          {
            rid: 1,
            totalMoney: 1,
            count: 1,
            createTime: '--',
            status: 0
          }
        ], // 所有红包列表，包括已抢完的和未抢的
        idList: [1, 2, 3, 1, 5, 6] // 所有未抢红包id，根据envelope.list筛选得出
      },
      envelopeMoney: 0,
      dialogVisible: false,
      moneyVisible: false
    }
  },
  computed: {},
  methods: {
    addBao: function (left, height, src, id) {
      var div = document.createElement('div')
      var img = document.createElement('img')
      div.appendChild(img)
      img.className = 'roll'
      img.src = src
      div.style.left = left + 'px'
      // 不设置div的高度
      // div.style.height = height + 'px'
      div.className = 'redBox'
      div.id = id
      div.onclick = this.handleEnvelopeClick
      document.getElementById('redzone').appendChild(div)
      console.log('红包ID：' + div.id)
      // setTimeout(function () {
      //   // 滑落到底部时，删除元素
      //   // console.log((window.innerHeight - div.getBoundingClientRect().bottom) / window.innerHeight)
      //   // if ((window.innerHeight - div.getBoundingClientRect().bottom) / window.innerHeight < 0.1) {
      //   // // 避免不是该节点的子元素
      //   //   if (document.body.contains(div)) {
      //   //     document.getElementById('redzone').removeChild(div)
      //   //   }
      //   // }
      //   // 避免不是该节点的子元素
      //   if (document.body.contains(div)) {
      //     console.log('销毁前divid：')
      //     console.log(div.id)
      //     document.getElementById('redzone').removeChild(div)
      //   }
      // }, 4500)
    },
    /**
     * @description: 获取所有红包信息方法，同BasixMes接口调用
     * @param {*}
     * @return {envelopeList}
     * @author: 王均祥
     */
    getAllEnvelope () {
      var envelopeList = [
        { rid: 1,
          totalMoney: 1,
          count: 1,
          createTime: '--',
          status: 0
        }
      ]
      axios({
        method: 'post',
        url: '/api/getpageallred',
        data: {
          currentPage: 1,
          pageSize: 10
        }
      }).then(res => {
        envelopeList = res.data.data.pageRecode
        var totalPage = res.data.data.totalPage
        for (let i = 2; i < totalPage + 1; i++) {
          axios({
            method: 'post',
            url: '/api/getpageallred',
            data: {
              currentPage: i,
              pageSize: 10
            }
          }).then(function (res) {
            envelopeList = envelopeList.concat(res.data.data.pageRecode)
          }).catch(function (error) {
            console.log(error)
          })
        }
        setTimeout(function () {
          console.log('SET：' + envelopeList.length)
          return envelopeList
        }, 800)
      }).catch(function (error) {
        console.log(error)
      })
    },
    handleEnvelopeClick () {
      console.log(event.currentTarget)
      this.envelopeMoney++
      this.dialogVisible = true
      // var oDiv = document.getElementsByClassName('box-out')[0]
      // 开红包后删除该元素
      // document.getElementById('redzone').removeChild(event.currentTarget)
    },
    handleOpenEnve () {
      console.log(this.removeByIndex(this.envelope.idList, 1))
      this.moneyVisible = true
      console.log('抢到了')
    },
    handleDialogClose () {
      this.envelopeMoney = 0
      this.moneyVisible = false
      console.log(this.envelopeMoney)
    },
    // 根据数组元素 寻找下标
    indexOfList (list, item) {
      for (let i = 0; i < list.length; i++) {
        if (list[i] === item) {
          return i
        }
      }
      return -1
    },
    // 根据数组下标 删除对应位置元素
    removeByIndex (list, item) {
      var index = this.indexOfList(list, item)
      if (index > -1) {
        list.splice(index, 1)
        return '删除成功'
      }
      return -1
    }
  },
  mounted () {
    let vueObject = this
    var divIdList = vueObject.envelope.idList
    // 定时器 循环执行 每隔1500ms
    var intervalId = setInterval(function () {
      console.log('执行setInterval')
      // console.log('mounted:' + vueObject.envelope.idList)
      if (divIdList.length === 0) {
        clearInterval(intervalId)
        return
      }
      var left = Math.random() * document.body.scrollWidth
      var height = Math.random() * document.body.scrollHeight
      // 根据后台红包ID设置红包雨divID
      var id = divIdList.shift()
      console.log('分配红包ID：' + divIdList.length)
      // assets中的资源，在js中使用，路径要经过webpack中的file-loader编译，故路径不能直接写
      var src = require('../assets/redpacket.png')
      // static下的文件不会被webpack处理，会被直接复制到最终的打包目录下面，所以必须使用绝对路径来引用这些文件
      // var src = '/static/img/redpacket.png'

      vueObject.addBao(left, height, src, id)
    }, 1500)
  }
}
</script>

<style>
@keyframes redImgRain {
  /* 使用百分比比from-to能够获得最佳的浏览器支持 */
  0% {
    top:0;
  }
  100% {
    top: 100%;
  }
}
.redBox {
  position: absolute;
  /* opacity: 0;*/
  /* z-index: 10000; */
  animation: redImgRain 6s infinite linear;
  /* 适配各浏览器 */
  -webkit-animation: redImgRain 6s infinite linear;
  -moz-animation: redImgRain 6s infinite linear;
  -ms-animation: redImgRain 6s infinite linear;
  -o-animation: redImgRain 6s infinite linear;
}
.redBox img {
  display: block;
  /* width: 1rem;
  height: 1.3rem; */
  width: 80px;
  height: 80px;
}
.redBox:hover{
  transform: scale(1.1);
  animation-play-state: paused;
}
</style>
