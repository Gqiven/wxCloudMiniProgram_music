// pages/databaseGuide/databaseGuide.js

const app = getApp()

Page({

  data: {
    images: []
  },

  onLoad: function (options) {
    this.getData();
  },
  getData() {
    wx.cloud.callFunction({
      name: 'get_music',
      data: {type: 'images'},
      complete: res => {
        let _data = res.result.data;
        console.log(20, _data)
        this.setData({
          images: _data[0].images
        })
      }
    })
  }
})