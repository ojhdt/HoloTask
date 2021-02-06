//app.js
App({
  onLaunch: function () {
    //获取夜间模式
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.is_dark = res.theme;
      },
    })
  },
  globalData: {
    userInfo: null,
    is_dark: "light"
  }
})