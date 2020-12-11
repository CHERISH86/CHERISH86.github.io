<template>
  <div class="">
    <div id="redzone">
      <el-button @click="handleSetEnve()">修改EnvelopeList</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'hongbao',
  data () {
    return {
      envelopeList: [1, 2, 3, 1, 5, 6],
      intervalId: 0
    }
  },
  computed: {},
  methods: {
    // 动态添加红包方法
    addBao: function (left, height, src) {
      var div = document.createElement('div')
      var img = document.createElement('img')
      div.appendChild(img)
      img.className = 'roll'
      img.src = src
      div.style.left = left + 'px'
      // 不设置div的高度
      // div.style.height = height + 'px'
      div.className = 'redBox'
      div.onclick = this.hello
      document.getElementById('redzone').appendChild(div)
      setTimeout(function () {
        // 滑落到底部时，删除元素
        // console.log((window.innerHeight - div.getBoundingClientRect().bottom) / window.innerHeight)
        // if ((window.innerHeight - div.getBoundingClientRect().bottom) / window.innerHeight < 0.1) {
        // // 避免不是该节点的子元素
        //   if (document.body.contains(div)) {
        //     document.getElementById('redzone').removeChild(div)
        //   }
        // }
        // 避免不是该节点的子元素
        if (document.body.contains(div)) {
          document.getElementById('redzone').removeChild(div)
        }
      }, 4500)
    },
    hello () {
      console.log('hello00000')
    },
    handleSetEnve () {
      console.log(this.removeByIndex(this.envelopeList, 1))
      console.log(this.envelopeList)
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
    // 定时器 循环执行 每隔一段时间
    this.intervalId = setInterval(function () {
      console.log('执行setInterval')
      var left = Math.random() * document.body.scrollWidth
      var height = Math.random() * document.body.scrollHeight

      // assets中的资源，在js中使用，路径要经过webpack中的file-loader编译，故路径不能直接写
      var src = require('../assets/redpacket.png')
      // static下的文件不会被webpack处理，会被直接复制到最终的打包目录下面，所以必须使用绝对路径来引用这些文件
      // var src = '/static/img/redpacket.png'

      vueObject.addBao(left, height, src)
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
  z-index: 10000;
  animation: redImgRain 6s infinite linear;
  /* 适配各浏览器 */
  -webkit-animation: redImgRain 6s infinite linear;
  -moz-animation: redImgRain 6s infinite linear;
  -ms-animation: redImgRain 6s infinite linear;
  -o-animation: redImgRain 6s infinite linear;
}

.redBox {
  position: fixed;
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
