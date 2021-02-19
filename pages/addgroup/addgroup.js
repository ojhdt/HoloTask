// pages/addgroup/addgroup.js
const app = getApp()
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: null,
    theme: null,
    useable: 0,
    idvalue: "",
    style: "",
    input: [{
      main: "",
      placeholder: "",
      number: 0,
      helptext: "群组名称",
      helptext_style: ""
    }, {
      main: "",
      placeholder: "",
      number: 0,
      helptext: "群组简介，留空自动填“无”"
    }, {
      main: "",
      placeholder: "",
      number: 0,
      helptext: "群组八位数字标识ID，建议随机生成",
      value: null,
    }],
  },

  random: function () {
    var random = (Math.floor((Math.random() + Math.floor(Math.random() * 9 + 1)) * Math.pow(10, 8 - 1))).toString();
    wx.cloud.database().collection('group').where({
        groupid: random
      }).get()
      .then(res => {
        if (res.data.length == 0) {
          let str = "input[2].value"
          let str1 = "input[2].number"
          let str2 = "input[2].main"
          let str3 = "input[2].placeholder"
          let str4 = "input[2].helptext_style"
          let str5 = "input[2].helptext"
          this.setData({
            useable: 1,
            style: "width:120rpx",
            [str]: random,
            [str1]: 8,
            [str5]: "群组八位数字标识ID，建议随机生成",
            idvalue: random.toString()
          })
          if (this.data.theme == 'light') {
            this.setData({
              [str3]: "font-size:0.7rem;color:#666;top:0rpx;",
              [str4]: "color:#666;"
            })
          } else {
            this.setData({
              [str3]: "font-size:0.7rem;color:#ccc;top:0rpx;",
              [str4]: "color:#ccc;"
            })
          }
        } else {
          this.random()
        }
      })
  },

  check: function (e) {
    console.log(this.data.idvalue.length)
    if (this.data.idvalue == "" || this.data.idvalue.length != 8) {
      this.setData({
        ["input[2].helptext"]: "输入格式有误",
        ["input[2].helptext_style"]: "color:#ff8a80;"
      })
    } else {
      var id = this.data.idvalue
      wx.cloud.database().collection('group').where({
          groupid: id
        }).get()
        .then(res => {
          if (res.data.length == 0) {
            let str = "input[2].value"
            this.setData({
              useable: 1,
              [str]: id,
              style: "width:120rpx"
            })
          } else {
            this.setData({
              useable: 0,
              style: "width:170rpx"
            })
          }
        })
    }
  },

  input: function (e) {
    let id = e.currentTarget.dataset.id
    let str = "input[" + id + "].number"
    this.setData({
      [str]: e.detail.cursor
    })
  },

  idinput: function (e) {
    // console.log(e.detail.value)
    this.setData({
      idvalue: e.detail.value
    })
    if (e.detail.value == "") {
      this.setData({
        style: "width:0rpx"
      })
    } else if (e.detail.value != "" && e.detail.value.length != 8) {
      this.setData({
        useable: 0,
        style: "width:170rpx",
      })
    } else if (e.detail.value != "" && e.detail.value.length == 8) {
      this.setData({
        useable: 2,
        style: "width:220rpx",
      })
    }
    let id = e.currentTarget.dataset.id
    let str = "input[" + id + "].number"
    this.setData({
      [str]: e.detail.cursor
    })
  },

  focus: function (e) {
    let id = e.currentTarget.dataset.id
    let str1 = "input[" + id + "].main"
    let str2 = "input[" + id + "].placeholder"
    let str3 = "input[" + id + "].helptext"
    let str4 = "input[" + id + "].helptext_style"
    if (this.data.theme == 'light') {
      this.setData({
        [str1]: "border-bottom: 1.5px solid #07c160;",
        [str2]: "font-size:0.7rem;color:#07c160;top:0rpx;",
        [str3]: e.currentTarget.dataset.helptext,
        [str4]: "color:#666;"
      })
    } else {
      this.setData({
        [str1]: "border-bottom: 1.5px solid #07c160;",
        [str2]: "font-size:0.7rem;color:#07c160;top:0rpx;",
        [str3]: e.currentTarget.dataset.helptext,
        [str4]: "color:#ccc;"
      })
    }
  },

  blur: function (e) {
    let id = e.currentTarget.dataset.id
    let str1 = "input[" + id + "].main"
    let str2 = "input[" + id + "].placeholder"
    if (e.detail.value == "") {
      if (this.data.theme == 'light') {
        this.setData({
          [str1]: "border-bottom: 1.5px solid #444;",
          [str2]: "top:40rpx;color:#666;font-size:1rem"
        })
      } else {
        this.setData({
          [str1]: "border-bottom: 1.5px solid #ccc;",
          [str2]: "top:40rpx;color:#ccc;font-size:1rem"
        })
      }
    } else {
      if (this.data.theme == 'light') {
        this.setData({
          [str1]: "border-bottom: 1.5px solid #444;",
          [str2]: "font-size:0.7rem;color:#666;top:0rpx;",
        })
      } else {
        this.setData({
          [str1]: "border-bottom: 1.5px solid #ccc;",
          [str2]: "font-size:0.7rem;color:#ccc;top:0rpx;",
        })
      }
    }
  },

  reset: function (e) {
    let str0 = "input[0].number"
    let str1 = "input[1].number"
    let str2 = "input[2].number"
    let str3 = "input[0].placeholder"
    let str4 = "input[1].placeholder"
    let str5 = "input[2].placeholder"

    if (this.data.theme == 'light') {
      this.setData({
        [str0]: 0,
        [str1]: 0,
        [str2]: 0,
        [str3]: "font-size:1rem;color:#666;top:40rpx;",
        [str4]: "font-size:1rem;color:#666;top:40rpx;",
        [str5]: "font-size:1rem;color:#666;top:40rpx;",
        useable: 0,
        style: "width:0rpx"
      })
    } else {
      this.setData({
        [str0]: 0,
        [str1]: 0,
        [str2]: 0,
        [str3]: "font-size:1rem;color:#ccc;top:40rpx;",
        [str4]: "font-size:1rem;color:#ccc;top:40rpx;",
        [str5]: "font-size:1rem;color:#ccc;top:40rpx;",
        useable: 0,
        style: "width:0rpx"
      })
    }

  },

  submit: function (e) {
    var that = this
    // console.log(e)
    if (this.data.useable == 0) {
      if (e.detail.value.groupid == "") {
        this.setData({
          ["input[2].helptext"]: "此项不得为空",
          ["input[2].helptext_style"]: "color:#ff8a80;"
        })
      } else {
        this.setData({
          ["input[2].helptext"]: "此群组ID不可用，建议随机生成",
          ["input[2].helptext_style"]: "color:#ff8a80;"
        })
      }
    } else if (this.data.useable == 2) {
      this.setData({
        ["input[2].helptext"]: "检查群组ID可用性，或随机生成",
        ["input[2].helptext_style"]: "color:#ff8a80;"
      })
    } else if (this.data.useable == 1) {
      if (this.data.theme == 'light') {
        this.setData({
          ["input[2].helptext"]: "群组八位数字标识ID，建议随机生成",
          ["input[2].helptext_style"]: "color:#666;"
        })
      } else {
        this.setData({
          ["input[2].helptext"]: "群组八位数字标识ID，建议随机生成",
          ["input[2].helptext_style"]: "color:#ccc;"
        })
      }
      if (e.detail.value.title == "") {
        this.setData({
          ["input[0].helptext"]: "此项不得为空",
          ["input[0].helptext_style"]: "color:#ff8a80;"
        })
      }
      if (e.detail.value.title != "" && e.detail.value.groupid != "") {
        wx.showModal({
          cancelColor: '#000000',
          confirmColor: '#07c160',
          title: "新建群组",
          content: "是否要新建该群组",
          success(res) {
            if (res.confirm) {
              console.log("success")
              let groupid = e.detail.value.groupid
              let description = (e.detail.value.description) ? (e.detail.value.description) : "无"
              wx.cloud.database().collection('group').add({
                  data: {
                    groupid: groupid,
                    name: e.detail.value.title,
                    description: description,
                    member: [that.data.openid]
                  }
                })
                .then(res => {
                  that.reset()
                  wx.navigateBack({
                    delta: 1,
                  })
                  wx.showToast({
                    title: "群组已创建",
                    duration: 1000
                  })
                })
                .catch(res => {
                  wx.showToast({
                    title: "群组创建失败",
                    icon: "error",
                    duration: 1000
                  })
                  that.reset()
                })
                const _ = wx.cloud.database().command
                wx.cloud.database().collection('user').where({
                  _openid: that.data.openid
                }).update({
                  data: {
                    'group': _.push(groupid),
                    'joined': _.push(groupid),
                    'manage': _.push(groupid),
                  }
                })
                .then(res => {
                  console.log(res)
                })
                .catch(err => {
                  console.log(err)
                })
            } else if (res.cancel) {}
          }
        })
      }
    }
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