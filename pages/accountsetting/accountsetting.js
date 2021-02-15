// pages/accountsetting/accountsetting.js
const app = getApp()
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bing: false,
    hitokoto: false
  },

  switch: function(e) {
    let target = e.currentTarget.dataset.name
    if(target == "bing") {var value = !this.data.bing}
    if(target == "hitokoto") {var value = !this.data.hitokoto}
    this.setData({
      [target]: value
    })
    this.check()
  },

  check: function() {
    if(this.data.bing){
      this.setData({
        bingbar: "background:#bcddb0;",
        bingdot: "right:0rpx;background:#07c160;"
      })
    }else{
      this.setData({
        bingbar: "background:#9e9e9e;",
        bingdot: "right:34rpx;background:#fff;"
      })
    }
    if(this.data.hitokoto){
      this.setData({
        hitokotobar: "background:#bcddb0;",
        hitokotodot: "right:0rpx;background:#07c160;"
      })
    }else{
      this.setData({
        hitokotobar: "background:#9e9e9e;",
        hitokotodot: "right:34rpx;background:#fff;"
      })
    }
  },

  submit: function() {
    var that = this
    wx.cloud.database().collection('user').where({
      _openid: this.openid
    }).get()
    .then(res => {
      var id = res.data[0]._id
      wx.cloud.database().collection('user').doc(id)
      .update({
        data:{
          settings: {
            bing: this.data.bing,
            hitokoto: this.data.hitokoto
          }
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取openid
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    } else {
      wx.cloud.callFunction({
        name: 'getOpenid',
        complete: res => {
          app.globalData.openid = res.result.openid
          app.globalData.appid = res.result.appid
          this.setData({
            openid: res.result.openid
          })
        }
      })
    }
    //获取夜间模式
    if (app.globalData.theme) {
      // console.log(app.globalData.theme)
      this.setData({
        theme: app.globalData.theme
      })
    } else {
      wx.getSystemInfo({
        success: (res) => {
          this.setData({
            theme: res.theme
          })
        }
      })
    }
    //获取设置状态
    wx.cloud.database().collection('user').where({
      _openid: this.data.openid
    }).get()
    .then(res => {
      this.setData({
        bing: res.data[0].settings.bing,
        hitokoto: res.data[0].settings.hitokoto
      })
      this.check()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("submit")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.submit()
    console.log("submit")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})