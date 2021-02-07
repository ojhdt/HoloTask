//app.js
App({
  onLaunch: function () {
    //获取夜间模式
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.is_dark = res.theme;
      }
    })
    //初始化云开发
    wx.cloud.init({
      env: "holotask-1gb3a2qhe28a3262"
    })
  },
  globalData: {
    userInfo: null,
    is_dark: "light"
  }
})