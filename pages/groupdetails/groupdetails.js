// pages/groupdetails/groupdetails.js
const app = getApp()
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    openid: null,
    theme: null,
    taskskip: 0,
    memberopenid: null,
    adminopenid: null,
    triggered: false,
    is_admin: false,
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
            [str]: res.data[0],
            membertriggered: false,
          })
        })
    })
  },

  remove: function (e) {
    var that = this
    const _ = wx.cloud.database().command
    console.log(e)
    if (e.currentTarget.dataset.openid == this.data.openid) {
      wx.showModal({
        confirmColor: '#ff8a80',
        title: "警告",
        content: "您目前管理该群组，继续操作将解散该群组，是否确认",
        success(res) {
          if (res.confirm) {
            wx.cloud.database().collection('user').doc(e.currentTarget.dataset.id).update({
              data: {
                manage: _.pull(that.data.groupid)
              }
            })
            //删除群组
            wx.cloud.database().collection('group').doc(that.data.id).remove()
            .then(res => {
              console.log("success")
            })
            //批量删除任务
            wx.cloud.callFunction({
              name: 'removeAllData',
              data: {
                groupid: that.data.groupid
              }
            }).then(res => {
              console.log("success")
            }).catch(err => {
              console.log("fail")
            })
            //批量移除用户
            wx.cloud.callFunction({
              name: 'removeAllUserGroup',
              data: {
                groupid: that.data.groupid
              }
            }).then(res => {
              wx.showToast({
                title: '删除成功',
              })
              wx.navigateBack({
                delta: 1,
              })
            }).catch(err => {
              wx.showToast({
                title: '删除失败',
                icon: "none"
              })
            })
          }
        }
      })
    } else {
      wx.showModal({
        confirmColor: '#ff8a80',
        title: "警告",
        content: "是否要将该用户移出群组",
        success(res) {
          if (res.confirm) {
            wx.cloud.database().collection('group').doc(that.data.id).update({
              data: {
                member: _.pull(e.currentTarget.dataset.openid)
              }
            })
            wx.cloud.callFunction({
              name: 'removeUserGroup',
              data: {
                groupid: that.data.groupid,
                id: e.currentTarget.dataset.id
              }
            }).then(res => {
              wx.showToast({
                title: '已移出',
              })
              that.refreshMember()
            })
          }
        }
      })
    }
  },

  onLoad: function (options) {
    var that = this
    var id = options.id
    var admin_openid
    wx.cloud.database().collection('group').doc(id).get()
      .then(res => {
        this.setData({
          id: id,
          name: res.data.name,
          groupid: res.data.groupid,
          description: res.data.description,
          memberopenid: res.data.member,
          adminopenid: res.data._openid
        })
        this.refreshMember()
        this.refreshTask()
        admin_openid = res.data._openid
        if (admin_openid == this.data.openid) {
          this.setData({
            is_admin: true
          })
        }
      })
    wx.cloud.database().collection('user').where({
        _openid: admin_openid
      }).get()
      .then(res => {
        // console.log(res)
        this.setData({
          admin: res.data[0].nickname,
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