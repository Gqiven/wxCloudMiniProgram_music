//index.js
const app = getApp()

Page({
  data: {
    listData: [],
    words: "",
    activeIndex: 0,
    playing: false,
    poster: '',//默认控件上的音频封面的图片资源地址，如果 controls 属性值为 false 则设置 poster 无效
    name: '',//默认控件上的音频名字，如果 controls 属性值为 false 则设置 name 无效
    author: '',//默认控件上的作者名字，如果 controls 属性值为 false 则设置 author 无效
    src: '',//要播放音频的资源地址
    imgLoaded: false//封面图片是否加载成功
  },
  onReady(e) {
    this.innerAudioContext = wx.createInnerAudioContext()
    this.innerAudioContext.onEnded(()=> {
      console.log(18, 'ended!')
      this.nextPlay();
    });
  },
  onLoad: function() {
    this.getData();
  },
  getData: function() {
    wx.cloud.callFunction({
      name: 'get_music',
      data: {type: 'subscribe'},
      complete: res => {
        let _data = res.result.data;
        console.log(92, _data)
        if(_data) {
          this.setData({
            listData: _data,
            name: _data[0].name,
            poster: _data[0].poster,
            src: _data[0].audio,
            author: _data[0].author,
            words: _data[0].words
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
  },
  pausemusic: function() {
    this.setData({
      playing: false
    })
    this.innerAudioContext.pause();
  },
  nextPlay() {
    let _len = this.data.listData.length;
    let _index = this.data.activeIndex < _len - 1 ? this.data.activeIndex + 1 : 0;
    this.setSongData(_index);
  },
  setSongData(index) {
    //区分是点击列表元素播放，还是点击底部播放组件触发的播放
    let _index = index != undefined ? index : this.data.activeIndex;
    let _data = this.data.listData[_index];
    this.setData({
      activeIndex: _index,
      poster: _data.poster,
      name: _data.name,
      author: _data.author,
      src: _data.audio,
      words: _data.words
    })
    this.innerAudioContext.src = this.data.src;
    this.innerAudioContext.play();
  },
  imgReady() {
    this.setData({
      imgLoaded: true
    })
  }
})
