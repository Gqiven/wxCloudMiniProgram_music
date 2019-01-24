//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })

      wx.login({
        success(res) {
          console.log('login success')
          //console.log(res)
          wx.getUserInfo({
            success(res) {
              // console.log('userInfo success')
              // console.log(res.userInfo)
              // wx.showToast({
              //   title: 'userInfo success',
              //   icon: 'success',
              //   duration: 2000
              // })
            },
            fail(error) {
              // console.log('userInfo fail')
              // console.log(error)
              // wx.showToast({
              //   title: 'userInfo fail',
              //   icon: 'fail',
              //   duration: 2000
              // })
            }
          })
        },
        fail(error) {
          console.log('login fail')
          console.log(error)
        }
      })
      
    }

    this.globalData = {}
  }
})
