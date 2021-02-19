const app = getApp()
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groups: [],
  },

  details: function (e) {
    let url = '/pages/details/details?id=' + e.currentTarget.dataset.id
    wx.navigateTo({
      url: url,
    })
  },

  last: function (e) {
    // console.log(e)
    let str = "groups[" + e.currentTarget.dataset.index + "].taskskip"
    let str1 = "groups[" + e.currentTarget.dataset.index + "].nextcount"
    this.setData({
      [str]: this.data.groups[e.currentTarget.dataset.index].taskskip - 20,
      [str1]: this.data.groups[e.currentTarget.dataset.index].nextcount - 1
    })
    this.refresh(this.data.groups[e.currentTarget.dataset.index],e.currentTarget.dataset.index)
  },

  next: function (e) {
    let str = "groups[" + e.currentTarget.dataset.index + "].taskskip"
    let str1 = "groups[" + e.currentTarget.dataset.index + "].nextcount"
    this.setData({
      [str]: this.data.groups[e.currentTarget.dataset.index].taskskip + 20,
      [str1]: this.data.groups[e.currentTarget.dataset.index].nextcount + 1
    })
    this.refresh(this.data.groups[e.currentTarget.dataset.index],e.currentTarget.dataset.index)
  },

  refreshData: function () {
    var that = this
    wx.cloud.database().collection('user').where({
        _openid: this.data.openid
      }).get()
      .then(res => {
        var groupids = res.data[0].group
        // this.setData({
        //   taskskip: new Array(groupids.length).fill(0)
        // })
        var groups = []
        var counter = 0
        groupids.forEach((value, index, array) => {
          wx.cloud.database().collection('group').where({
              groupid: value
            }).get()
            .then(res => {
              var group = res.data[0]
              // console.log(index,skip)
              wx.cloud.database().collection('data').where({
                  groupid: value
                }).orderBy("timestamp", 'desc').limit(20).skip(0).get()
                .then(res => {
                  res.data.forEach((value, index, array) => {
                    value.time = util.formatTime(new Date(value.timestamp))
                  })
                  group.data = res.data
                  if (res.data.length == 20) {
                    group.next = true
                  } else {
                    group.next = false
                  }
                  group.last = false
                  group.taskskip = 0
                  group.nextcount = 0
                  groups.push(group)
                  counter++
                  if (counter == groupids.length) {
                    that.setData({
                      groups: groups
                    })
                    wx.stopPullDownRefresh({
                      success: (res) => {
                        console.log("success")
                      },
                    })
                  }
                })
            })
        })

      })
  },

  refresh: function (group,index) {
    wx.cloud.database().collection('data').where({
        groupid: group.groupid
      }).orderBy("timestamp", 'desc').limit(20).skip(group.taskskip).get()
      .then(res => {
        res.data.forEach((value, index, array) => {
          value.time = util.formatTime(new Date(value.timestamp))
        })
        let data = "groups["+ index +"].data"
        let next = "groups["+ index +"].next"
        let last = "groups["+ index +"].last"
        // let data = res.data
        // if (res.data.length == 20) {
        //   let next = true
        // } else {
        //   let next = false
        // }
        this.setData({
          [data]: res.data,
          [next]: res.data.length == 20 ? true : false,
          [last]: this.data.groups[index].nextcount == 0 ? false : true,
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
    this.refreshData()
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