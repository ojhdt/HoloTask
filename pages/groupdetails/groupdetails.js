// pages/groupdetails/groupdetails.js
const app = getApp()
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: null,
    theme: null,
    taskskip: 0,
    memberopenid: null,
    adminopenid: null,
    triggered: false,
    name: "群组名称",
    description: "群组描述",
    admin: "群组管理员",
    groupid: "NaN",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  taskDetails: function (e) {
    let url = '/pages/details/details?id=' + e.currentTarget.dataset.id
    wx.navigateTo({
      url: url,
    })
  },

  refreshTask: function () {
    this.setData({
      taskskip: 0
    })
    wx.cloud.database().collection('data').where({
        _openid: this.data.adminopenid,
        groupid: this.data.groupid
      }).orderBy("timestamp", 'desc').limit(5).get()
      .then(res => {
        let newtask = res.data
        newtask.forEach((value, index, array) => {
          newtask[index].time = util.formatTime(new Date(value.timestamp))
        })
        this.setData({
          task: newtask,
          tasktriggered: false,
        })
      })
  },

  taskskipPlus: function () {
    let skip = this.data.taskskip + 5
    this.setData({
      taskskip: skip
    })
    wx.cloud.database().collection('data').where({
        _openid: this.data.adminopenid,
        groupid: this.data.groupid
      }).orderBy("timestamp", 'desc').limit(5).skip(skip).get()
      .then(res => {
        let newtask = res.data
        newtask.forEach((value, index, array) => {
          newtask[index].time = util.formatTime(new Date(value.timestamp))
        })
        this.setData({
          task: (this.data.task).concat(newtask)
        })
      })
  },

  taskOnpulling: function () {
    this.setData({
      tasktriggered: true,
    })
  },

  memberOnpulling: function () {
    this.setData({
      membertriggered: true,
    })
  },

  refreshMember: function () {
    (this.data.memberopenid).forEach((value, index, array) => {
      wx.cloud.database().collection('user').where({
          _openid: value
        }).get()
        .then(res => {
          let str = "member[" + index + "]"
          this.setData({
            [str]: res.data[0].nickname,
            membertriggered: false,
          })
        })
    })
  },

  onLoad: function (options) {
    var that = this
    var id = options.id
    var admin_openid
    wx.cloud.database().collection('group').doc(id).get()
      .then(res => {
        this.setData({
          name: res.data.name,
          groupid: res.data.groupid,
          description: res.data.description,
          memberopenid: res.data.member,
          adminopenid: res.data._openid
        })
        this.refreshMember()
        this.refreshTask()
        admin_openid = res.data._openid
      })
    wx.cloud.database().collection('user').where({
        _openid: admin_openid
      }).get()
      .then(res => {
        // console.log(res)
        this.setData({
          admin: res.data[0].nickname
        })
      })
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
    // this.refreshTask()
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