// pages/group/group.js
const app = getApp()
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: null,
    theme: null,
    joined: [],
    manage: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  add: function () {
    wx.navigateTo({
      url: '/pages/addgroup/addgroup',
    })
  },

  tap: function (e) {
    // console.log(e.currentTarget.dataset.id)
    let url = "/pages/groupdetails/groupdetails?id=" + e.currentTarget.dataset.id
    wx.navigateTo({
      url: url,
    })
  },

  refresh: function () {
    //获取群组
    wx.cloud.database().collection('user').where({
        _openid: this.data.openid
      }).get()
      .then(res => {
        var joined = res.data[0].joined
        var manage = res.data[0].manage
        var joineddata = []
        var managedata = []
        var counterj = 0
        var counterm = 0
        console.log(joined,manage)
        //拉取joined
        joined.forEach((value, index, array) => {
          wx.cloud.database().collection('group').where({
              groupid: value
            }).get()
            .then(res => {
              joineddata = joineddata.concat(res.data)
              counterj++
              if (counterj == joined.length) {
                this.setData({
                  joined: joineddata
                })
              }
            })
        })
        //拉取manage
        manage.forEach((value, index, array) => {
          wx.cloud.database().collection('group').where({
              groupid: value,
              _openid: this.data.openid
            }).get()
            .then(res => {
              managedata = managedata.concat(res.data)
              counterm++
              if (counterm == manage.length) {
                this.setData({
                  manage: managedata
                })
              }
            })
        })
      })
  },

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
    this.refresh()
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
    this.refresh()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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