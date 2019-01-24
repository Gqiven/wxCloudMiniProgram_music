//index.js
const app = getApp()

Page({
  data: {
    ready: false,
    banner: [],
    listData: [],
    indicatorDots: true,
    autoplay: false,
    interval: 1000,
    duration: 500,
    current: 0,

    poster: '',//默认控件上的音频封面的图片资源地址，如果 controls 属性值为 false 则设置 poster 无效
    name: '',//默认控件上的音频名字，如果 controls 属性值为 false 则设置 name 无效
    author: '',//默认控件上的作者名字，如果 controls 属性值为 false 则设置 author 无效
    src: '',//要播放音频的资源地址
    controls: true,//是否显示默认控件, 默认false
    playing: false,//是否是正在播放状态
    activeIndex: 0,//当前播放歌曲的索引值
    listData: [],//列表数据
    nickname: ''
  },
  onReady(e) {
    this.innerAudioContext = wx.createInnerAudioContext()
    this.innerAudioContext.onEnded(()=> {
      console.log(141, 'ended!')
      this.nextPlay();
    });
  },
  onLoad: function() {
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        console.log('callFunction test result: ', res)
      },
      success: () => {
        this.adduserInfo();
      },
      fail: console.error
    })

    //获取屏幕宽度
//     wx.getSystemInfo({//设备信息
//       success: (res) => {
//         // 高度,宽度 单位为px
//         this.setData({
//           swiperHeight: res.windowWidth * 0.46
//         })
//       }
//     })


    this.getData();
  },

  adduserInfo: function() {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(63, res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(66, res)
              this.setData({
                nickname: res.userInfo.nickName
              });
              //获取用户信息后先尝试更新用户信息
              this.updateHandler(res.userInfo);
            },
            fail: err => {
              console.log(75, err)
            }
          })
        }
      }
    })
  },
  addHandler: function(data) {
    let _data = data;
    _data.count = 1;
    wx.cloud.callFunction({
      name: 'addFunction',
      data: {
        db_name: "userInfo",
        info: _data
      },
      complete: res => {
        console.log('add:', res)
        this.getData();
      }
    })
  },
  updateHandler: function(data) {
    wx.cloud.callFunction({
      name: 'update_user_info',
      data: data,
      complete: res => {
        //console.log(65, res)
        if(res.result.stats.updated > 0) {
          console.log('update success')
          this.getData()
        }else {
          //console.log('update fail')
          //未查找到可更新的数据 就增加数据
          this.addHandler(data)
        }
      }
    })
  },
  getData: function() {
    wx.cloud.callFunction({
      name: 'get_music',
      data: {type: 'homepage'},
      complete: res => {
        let _data = res.result.data;
        console.log(92, _data)
        if(_data[0]) {
          this.setData({
            ready: true,
            banner: _data[0].banner,
            listData: _data[0].list,
            poster: _data[0].list[0].poster,
            name: _data[0].list[0].name,
            author: _data[0].list[0].author,
            src: _data[0].list[0].audio,
            listData: _data[0].list
          })
        }
      }
    })
  },
  playmusic(e) {
    let click_index = 0, _dom = e.currentTarget;
    if(_dom) {
      click_index = _dom.dataset.index;
      this.setSongData(click_index);
    }
    this.setData({
      playing: true
    })
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
  },
  pausemusic: function() {
    this.setData({
      playing: false
    })
    this.innerAudioContext.pause();
    wx.setKeepScreenOn({
      keepScreenOn: false
    })
  },
  nextPlay() {
    let _len = this.data.listData.length;
    let _index = this.data.activeIndex < _len - 1 ? this.data.activeIndex + 1 : 0;
    this.setSongData(_index);
  },
  setSongData(index) {
    //区分是点击列表元素播放，还是点击底部播放组件触发的播放
    let _index = index != undefined ? index : this.data.activeIndex;
    this.setData({
      activeIndex: _index,
      poster: this.data.listData[_index].poster,
      name: this.data.listData[_index].name,
      author: this.data.listData[_index].author,
      src: this.data.listData[_index].audio
    })
    this.innerAudioContext.src = this.data.src;
    this.innerAudioContext.play();
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
  }
})
