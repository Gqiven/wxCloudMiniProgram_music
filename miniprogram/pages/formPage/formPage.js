// pages/detail/detail.js

const app = getApp()

Page({

  data: {
    nickname: "",
    song: "",
    author: "",
    words: "",
    username: ""
  },
  onReady(e) {
    
  },
  onLoad: function (options) {
    this.setData({
      nickname: options.nickname
    })
  },
  getValue(e) {
    let _data = this.data;
    _data[e.currentTarget.dataset.name] = e.detail.value;
    this.setData(_data);
  },
  submit() {
    if(!this.check()) {
      console.log(29)
      return;
    }
    console.log(31)
    //向数据库提交数据 更新指定字段
    wx.cloud.callFunction({
      name: 'addFunction',
      data: {
        db_name: "userSongs",
        info: {
          song: this.data.song,
          author: this.data.author,
          nickname: this.data.nickname,
          username: this.username,
          words: this.data.words
        }
      },
      complete: res => {
        console.log(35, res)
        let _data = res.result;
        if(_data._id) {
          wx.showToast({
            title: '点歌成功',
            icon: 'none',
            duration: 2000
          })
        }else {
          wx.showToast({
            title: '点歌失败😢',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  check() {
    let _data = this.data;
    for(let key in _data) {
      if(key === 'song' && !_data[key]) {
        wx.showToast({
          title: '没有填写歌曲名称',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
    }
    return true;
  }
})