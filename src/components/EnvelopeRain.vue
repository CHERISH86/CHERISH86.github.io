<!--
 * @Description: 用户端——红包雨界面
 * @Autor: 王均祥
 * @Date: 2020-12-09 15:42:29
 * @LastEditors: 王均祥
 * @LastEditTime: 2020-12-16 18:16:17
-->
<template>
  <div>
  <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">
    <div id="redzone">
      <el-button @click="createEnvelopeList">测试各方法</el-button>
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
          <span v-show="moneyVisible">{{envelopeMoney}}</span>
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
        idList: [1, 2, 3, 1, 5, 6], // 所有未抢红包id，根据envelope.list筛选得出
        page: 1,
        totalPage: 1,
        total: 1
      },
      rid: 0,
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
      img.className = 'roll'
      img.src = src
      div.appendChild(img)
      div.style.left = left + 'px'
      // 不设置div的高度
      // div.style.height = height + 'px'
      div.className = 'redBox'
      div.id = id
      div.onclick = this.handleEnvelopeClick
      document.getElementById('redzone').appendChild(div)
      console.log('红包ID：' + div.id)
      div.addEventListener('animationend', function () {
        if (document.body.contains(div)) {
          console.log('销毁前divid：')
          console.log(div.id)
          document.getElementById('redzone').removeChild(div)
        }
      })
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
      //   // if (document.body.contains(div)) {
      //   //   console.log('销毁前divid：')
      //   //   console.log(div.id)
      //   //   document.getElementById('redzone').removeChild(div)
      //   // }
      // }, 4500)
    },
    /**
     * @description: 获取所有红包信息方法，同BasixMes接口调用
     * @param {*}
     * @return {envelopeList}
     * @author: 王均祥
     */
    getEnvelope (page, size) {
      return new Promise(function (resolve, reject) {
        axios({
          method: 'post',
          url: '/api/getpageallred',
          data: {
            currentPage: page,
            pageSize: size
          }
        }).then(res => {
          if (res.data.code === 200) {
            resolve(res)
          } else {
            reject(res.data.message)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    handleEnvelopeClick () {
      // console.log('点击ID：' + event.currentTarget.id)
      // this.envelopeMoney++
      this.rid = event.currentTarget.id
      this.dialogVisible = true
      // var oDiv = document.getElementsByClassName('box-out')[0]
      // 开红包后删除该元素
      // document.getElementById('redzone').removeChild(event.currentTarget)
    },
    handleOpenEnve () {
      // console.log(this.removeByIndex(this.envelope.idList, 1))
      axios({
        method: 'post',
        url: '/api/getred',
        data: {
          rid: this.rid,
          uid: 1
        }
      }).then(res => {
        if (res.data.code === 20007) {
          this.envelopeMoney = '恭喜您抢到' + res.data.data + '元'
          this.moneyVisible = true
        } else {
          this.envelopeMoney = '啊哦 ' + res.data.message
          this.moneyVisible = true
          console.error(res.data.message)
        }
      }).catch(error => {
        console.error(error)
      })
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
    },
    // 测试在普通函数中 定时生成红包雨
    createEnvelopeList (list) {
      console.log('list长度：' + list.length)
      let envelopeCount = 0
      var that = this
      // 筛选出所有正在抢的红包
      var intervalId = setInterval(function () {
        if (list.length === envelopeCount) {
          clearInterval(intervalId)
          return
        }
        // 状态为正在抢的红包
        console.log('status:' + list[envelopeCount])
        if (list[envelopeCount].status === 1) {
          var left = Math.random() * document.body.scrollWidth
          var height = Math.random() * document.body.scrollHeight
          // 根据后台红包ID设置红包雨divID
          var id = list[envelopeCount].rid
          console.log('分配红包ID：' + id)
          // assets中的资源，在js中使用，路径要经过webpack中的file-loader编译，故路径不能直接写
          var src = require('../assets/redpacket.png')
          // static下的文件不会被webpack处理，会被直接复制到最终的打包目录下面，所以必须使用绝对路径来引用这些文件
          // var src = '/static/img/redpacket.png'
          that.addBao(left, height, src, id)
        }
        envelopeCount++
      }, 1500)
    }
  },
  mounted () {
    // 1.获取所有数据 2.调用定时器
    let that = this
    that.getEnvelope(that.envelope.page, 1).then(function (res) {
      that.envelope.total = res.data.data.total
      // 获取到红包总信息数
      that.getEnvelope(that.envelope.page, that.envelope.total).then(function (res) {
        that.envelope.list = res.data.data.pageRecode
        console.log('mounted阶段：' + that.envelope.list.length)
        // 根据红包列表动态创建红包
        that.createEnvelopeList(that.envelope.list)
      }).catch(function (error) {
        console.error(error)
      })
    }).catch(function (error) {
      console.error(error)
    })
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
  animation: redImgRain 6s linear;
  /* 适配各浏览器 */
  -webkit-animation: redImgRain 6s linear;
  -moz-animation: redImgRain 6s linear;
  -ms-animation: redImgRain 6s linear;
  -o-animation: redImgRain 6s linear;
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
