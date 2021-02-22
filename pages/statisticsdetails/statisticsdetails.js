// pages/statisticsdetails/statisticsdetails.js
const app = getApp()
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btn: "状态",
    admin: "加载中",
    group: "加载中",
    time: "加载中",
    timelast: "加载中",
    finishedname: [],
    unfinishedname: [],
  },

  process: function () {
    //计算剩余时间
    let timelast = (this.data.timestamp - (new Date).getTime()) / 1000;
    // console.log(timelast)
    if (timelast >= 172800) {
      //如果多于两天
      let str = Math.round(timelast / 86400) + "天"
      this.setData({
        timelast: str,
      })
    } else if (timelast >= 86400 && timelast < 172800) {
      //如果多于一天
      let str = "1天" + Math.floor((timelast - 84400) / 3600) + "时"
      this.setData({
        timelast: str,
      })
    } else if (timelast < 86400 && timelast > 3600) {
      //如果少于一天但多于1小时
      let str = Math.floor(timelast / 3600) + "时" + Math.floor((timelast % 3600) / 60) + "分"
      this.setData({
        timelast: str,
      })
    } else if (timelast <= 3600 && timelast >= 0) {
      //如果少于1小时但未过期
      this.setData({
        timelast: Math.round(timelast / 60) + "分",
      })
    } else {
      //如果已过期
      this.setData({
        timelast: "已过期",
      })
    }
  },

  getData: function () {
    var that = this
    var finishedopenid = []
    var finishednickname = []
    for(let key in that.data.finished){
      if((that.data.finished)[key] == true){
        finishedopenid.push(key)
      }
    }
    console.log(finishedopenid)
    var counter = 0
    finishedopenid.forEach((value,index,array) => {
      wx.cloud.database().collection('user').where({
        _openid: value
      }).get()
      .then(res => {
        finishednickname.push(res.data[0].nickname)
        counter++
        if(counter == finishedopenid.length){
          console.log(finishednickname)
          that.setData({
            finishedname: finishednickname
          })
        }
      })
    })
    wx.cloud.database().collection('group').where({
      groupid: that.data.groupid,
      _openid: that.data.openid
    }).get()
    .then(res => {
      var unfinishedopenid = res.data[0].member
      var unfinishednickname = []
      finishedopenid.forEach((value) => {
        let index = unfinishedopenid.indexOf(value)
        unfinishedopenid.splice(index,1)
      })
      var counterf = 0
      unfinishedopenid.forEach((value,index,array) => {
        wx.cloud.database().collection('user').where({
          _openid: value
        }).get()
        .then(res => {
          unfinishednickname.push(res.data[0].nickname)
          counterf++
          if(counterf == unfinishedopenid.length){
            console.log(unfinishednickname)
            that.setData({
              unfinishedname: unfinishednickname
            })
          }
        })
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
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
    //获取数据
    wx.cloud.database().collection('data').doc(options.id).get()
      .then(res => {
        this.setData({
          _id: res.data._id,
          _openid: res.data._openid,
          admin: res.data.admin,
          groupid: res.data.groupid,
          timestamp: res.data.timestamp,
          title: res.data.title,
          finished: res.data.finished,
          time: util.formatTime(new Date(res.data.timestamp)),
        })
        wx.cloud.database().collection('group').where({
            groupid: res.data.groupid
          }).get()
          .then(res => {
            this.setData({
              group: res.data[0].name
            })
          })
        this.process()
        this.getData()
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获取head高度
    let query = wx.createSelectorQuery();
    query.select('.head').boundingClientRect(rect => {
      let clientHeight = rect.height;
      let clientWidth = rect.width;
      let ratio = 750 / clientWidth;
      let height = clientHeight * ratio;
      this.setData({
        height: height
      })
    }).exec();
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