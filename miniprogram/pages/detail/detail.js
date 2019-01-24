// pages/detail/detail.js

const app = getApp()

Page({

  data: {
    id: '',
    type: '',
    poster: '',//默认控件上的音频封面的图片资源地址，如果 controls 属性值为 false 则设置 poster 无效
    name: '',//默认控件上的音频名字，如果 controls 属性值为 false 则设置 name 无效
    author: '',//默认控件上的作者名字，如果 controls 属性值为 false 则设置 author 无效
    src: '',//要播放音频的资源地址
    controls: true,//是否显示默认控件, 默认false
    //loop//是否循环播放, 默认false
    playing: false,
    showPoster: false,
    mywords: '',
    nickname: '',
    album: '',
    desc: '',
    animationData: '',
    angle: 30
  },
  onReady(e) {
    //创建音频对象
    this.innerAudioContext = wx.createInnerAudioContext()
    this.innerAudioContext.onEnded(()=> {
      console.log(20, 'ended!')
      this.endedPlay();
    });
  },
  onLoad: function (options) {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(31, res)
      }
    })
    this.setData({
      id: options.id,
      type: options.type,
      nickname: options.nickname
    })
    //以id搜索指定数据
    this.getData(options.id);
    //获取屏幕宽度
    wx.getSystemInfo({//设备信息
      success: (res) => {
        // 高度,宽度 单位为px
        this.setData({
          screen_width: res.windowWidth
        })
      }
    })
    //动画
    // this.animation = wx.createAnimation({
    //   duration: 24000,
    //   timingFunction: 'ease',
    // })
    // this.angle = 360;
  },
  getData: function(id) {
    wx.cloud.callFunction({
      name: 'get_music',
      data: {type: 'detail', id: id},
      complete: res => {
        console.log(35, res)
        let _data = res.result.data[0];
        console.log(37, _data)
        if(_data) {
          this.setData({
            poster: _data.poster,
            name: _data.name,
            author: _data.author,
            src: _data.audio,
            album: _data.album,
            desc: _data.desc
          })
          this.draw();
        }else {
          wx.showToast({
            title: '获取歌曲失败😭',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  showPoster() {
    this.setData({
      showPoster: true
    })
  },
  draw() {
    this.innerAudioContext.src = this.data.src;
    console.log(76, this.data.src)
    // let analyserNode = this.innerAudioContext.createAnalyser();
    // console.log(62, analyserNode)
  },
  playmusic() {
    this.setData({
      playing: true
    })
    this.innerAudioContext.play();
    // this.startAnimation();
  },
  pausemusic: function() {
    this.setData({
      playing: false
    })
    this.innerAudioContext.pause();
    // this.pauseAnimation();
  },
  endedPlay() {
    this.setData({
      playing: false
    })
  },
  postMyWords() {
    //向数据库提交数据 更新指定字段
    wx.cloud.callFunction({
      name: 'addFunction',
      data: {
        db_name: "userWords",
        info: {
          nickname: this.data.nickname,
          song: this.data.name,
          author: this.data.author,
          mywords: this.data.mywords
        }
      },
      complete: res => {
        console.log(35, res)
        let _data = res.result;
        if(_data._id) {
          wx.showToast({
            title: '你的想法已送达😄',
            icon: 'none',
            duration: 2000
          })
        }else {
          wx.showToast({
            title: '你的想法送达失败😢',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  getText(e) {
    this.setData({
      mywords: e.detail.value
    })
  },
  copy(e) {//长按复制到剪切板
    console.log(149, e)
    let _value = e.currentTarget.dataset.value;
    wx.setClipboardData({
      data: _value,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  // startAnimation() {
  //   let _this = this;
  //   this.animation.rotate(this.angle).step()
  //   this.setData({
  //     animationData: this.animation.export()
  //   })
    
  //   //连续调用
  //   this.animationTime = setInterval(function() {
  //     this.angle += 360;
  //     _this.animation.rotate(this.angle).step()
  //     _this.setData({
  //       animationData: _this.animation.export()
  //     })
  //   }.bind(this), 24000);
  // },
  // pauseAnimation() {
  //   console.log('animation pause')
  //   clearInterval(this.animationTime);
  // }
})