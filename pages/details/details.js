// pages/details/details.js
const app = getApp()
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btn: "状态",
    title: "任务标题",
    editable: false,
    admin: "加载中",
    group: "加载中",
    time: "加载中",
    timelast: "加载中"
  },

  edit: function () {
    let url = '/pages/modify/modify?id=' + this.data._id
    wx.navigateTo({
      url: url,
    })
  },

  finish: function () {
    var that = this
    if (this.data.finished == false) {
      if (this.data.timestamp - (new Date).getTime() > 0) {
        wx.showModal({
          confirmColor: '#07c160',
          title: "提交",
          content: "是否要修改完成状态",
          success(res) {
            if (res.confirm) {
              wx.cloud.callFunction({
                name: 'updateFinished',
                data: {
                  id: that.data._id,
                  openid: that.data.openid,
                  value: true
                }
              }).then(res => {
                console.log("调用成功")
                that.setData({
                  finished: true
                })
                that.process()
                wx.showToast({
                  title: '状态已修改',
                })
              })
            }
          }
        })
      } else {
        wx.showToast({
          title: '过期任务无法修改状态',
          icon: "none"
        })
      }
    }
    if (this.data.finished == true) {
      wx.showModal({
        confirmColor: '#07c160',
        title: "修改",
        content: "是否要撤销完成状态",
        success(res) {
          if (res.confirm) {
            wx.cloud.callFunction({
              name: 'updateFinished',
              data: {
                id: that.data._id,
                openid: that.data.openid,
                value: false
              }
            }).then(res => {
              console.log("调用成功")
              that.setData({
                finished: false
              })
              that.process()
              wx.showToast({
                title: '状态已撤销',
              })
            })
          }
        }
      })
    }
  },

  process: function () {
    //检测状态
    if (this.data._openid == this.data.openid) {
      this.setData({
        editable: true
      })
    }
    //计算剩余时间
    let timelast = (this.data.timestamp - (new Date).getTime()) / 1000;
    // console.log(timelast)
    if (timelast >= 172800) {
      //如果多于两天
      let str = Math.round(timelast / 86400) + "天"
      this.setData({
        timelast: str,
        btn: "未完成"
      })
    } else if (timelast >= 86400 && timelast < 172800) {
      //如果多于一天
      let str = "1天" + Math.floor((timelast - 84400) / 3600) + "时"
      this.setData({
        timelast: str,
        btn: "未完成"
      })
    } else if (timelast < 86400 && timelast > 3600) {
      //如果少于一天但多于1小时
      let str = Math.floor(timelast / 3600) + "时" + Math.floor((timelast % 3600) / 60) + "分"
      this.setData({
        timelast: str,
        style: "background:#ff8a80;color:#fff;",
        btn: "即将过期"
      })
    } else if (timelast <= 3600 && timelast >= 0) {
      //如果少于1小时但未过期
      this.setData({
        timelast: Math.round(timelast / 60) + "分",
        style: "background:#ff8a80;color:#fff;",
        btn: "即将过期"
      })
    } else {
      //如果已过期
      this.setData({
        timelast: "已过期",
        btn: "已过期"
      })
    }
    //最后更改按钮状态
    if (this.data.finished) {
      this.setData({
        style: "background:#07c160;color:#fff;",
        btn: "已完成"
      })
    }
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
          content: res.data.content,
          finished: res.data.finished[this.data.openid],
          groupid: res.data.groupid,
          timestamp: res.data.timestamp,
          title: res.data.title,
          time: util.formatTime(new Date(res.data.timestamp))
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