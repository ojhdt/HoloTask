//app.js
App({
  onLaunch: function () {
    //获取夜间模式
    wx.getSystemInfo({
      success: (res) => {
        var is_dark = res.theme
      },
    })
  },
  globalData: {
    userInfo: null
  }
})