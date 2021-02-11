// pages/add/add.js
const app = getApp()
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: null,
    theme: null,
    array: null,
    nickname: null,
    input: [{
      main: "",
      placeholder: "",
      number: 0,
      helptext: "任务标题",
      helptext_style: ""
    }, {
      main: "",
      placeholder: "",
      number: 0,
      helptext: "任务发布者，留空默认为自己"
    }, {
      main: "",
      placeholder: "",
      number: 0,
      helptext: "任务详细内容，支持换行",
      helptext_style: ""
    }],
    picker: [{
      main: "",
      placeholder: "",
      value: ".",
      helptext: "任务对象，可选择自己或管理的群组",
      helptext_style: ""
    }, {
      main: "",
      placeholder: "",
      value: ".",
      helptext: "任务截止日期",
      helptext_style: ""
    }, {
      main: "",
      placeholder: "",
      value: ".",
      helptext: "任务截止时间",
      helptext_style: ""
    }],
  },
  input: function (e) {
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
    if(this.data.theme == 'light'){
      this.setData({
        [str1]: "border-bottom: 1.5px solid #07c160;",
        [str2]: "font-size:0.7rem;color:#07c160;top:0rpx;",
        [str3]: e.currentTarget.dataset.helptext,
        [str4]: "color:#666;"
      })
    }else{
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
    if (e.detail.value == ""){
      if(this.data.theme == 'light'){
        this.setData({
          [str1]: "border-bottom: 1.5px solid #444;",
          [str2]: "top:40rpx;color:#666;font-size:1rem"
        })
      }
      else{
        this.setData({
          [str1]: "border-bottom: 1.5px solid #ccc;",
          [str2]: "top:40rpx;color:#ccc;font-size:1rem"
        })
      }
    }
    else{
      if(this.data.theme == 'light'){
        this.setData({
          [str1]: "border-bottom: 1.5px solid #444;",
          [str2]: "font-size:0.7rem;color:#666;top:0rpx;",
        })
      }else{
        this.setData({
          [str1]: "border-bottom: 1.5px solid #ccc;",
          [str2]: "font-size:0.7rem;color:#ccc;top:0rpx;",
        })
      }
    }
      
  },

  change: function (e) {
    let id = e.currentTarget.dataset.id
    let str1 = "picker[" + id + "].value"
    let str2 = "picker[" + id + "].placeholder"
    let str3 = "picker[" + id + "].style"
    let str4 = "picker[" + id + "].helptext"
    let str5 = "picker[" + id + "].helptext_style"
    if(this.data.theme == 'light'){
      this.setData({
        [str1]: e.detail.value,
        [str2]: "font-size:0.7rem;color:#666;top:0rpx;",
        [str3]: "opacity:1",
        [str4]: e.currentTarget.dataset.helptext,
        [str5]: "color:#666;"
      })
    }else{
      this.setData({
        [str1]: e.detail.value,
        [str2]: "font-size:0.7rem;color:#ccc;top:0rpx;",
        [str3]: "opacity:1",
        [str4]: e.currentTarget.dataset.helptext,
        [str5]: "color:#ccc;"
      })
    }
    
  },

  nchange: function (e) {
    // console.log(e)
    let str1 = "picker[0].value"
    let str2 = "picker[0].placeholder"
    let str3 = "picker[0].style"
    let str4 = "picker[0].helptext"
    let str5 = "picker[0].helptext_style"
    if(this.data.theme == 'light'){
      this.setData({
        [str1]: this.data.array[e.detail.value].name,
        [str2]: "font-size:0.7rem;color:#666;top:0rpx;",
        [str3]: "opacity:1",
        [str4]: e.currentTarget.dataset.helptext,
        [str5]: "color:#666;"
      })
    }else{
      this.setData({
        [str1]: this.data.array[e.detail.value].name,
        [str2]: "font-size:0.7rem;color:#ccc;top:0rpx;",
        [str3]: "opacity:1",
        [str4]: e.currentTarget.dataset.helptext,
        [str5]: "color:#ccc;"
      })
    }
  },

  reset: function (e) {
    let str1 = "picker[0].value"
    let str2 = "picker[1].value"
    let str3 = "picker[2].value"
    let str4 = "picker[0].style"
    let str5 = "picker[1].style"
    let str6 = "picker[2].style"
    let str7 = "picker[0].placeholder"
    let str8 = "picker[1].placeholder"
    let str9 = "picker[2].placeholder"
    if(this.data.theme =='light'){
      this.setData({
        [str1]: '.',
        [str2]: '.',
        [str3]: '.',
        [str4]: "opacity:0;",
        [str5]: "opacity:0;",
        [str6]: "opacity:0;",
        [str7]: "font-size:1rem;color:#666;top:40rpx;",
        [str8]: "font-size:1rem;color:#666;top:40rpx;",
        [str9]: "font-size:1rem;color:#666;top:40rpx;"
      })
    }else{
      this.setData({
        [str1]: '.',
        [str2]: '.',
        [str3]: '.',
        [str4]: "opacity:0;",
        [str5]: "opacity:0;",
        [str6]: "opacity:0;",
        [str7]: "font-size:1rem;color:#ccc;top:40rpx;",
        [str8]: "font-size:1rem;color:#ccc;top:40rpx;",
        [str9]: "font-size:1rem;color:#ccc;top:40rpx;"
      })
    }
    
  },

  submit: function (e) {
    // console.log(e)
    if (e.detail.value.groupid == "") {
      this.setData({
        ["picker[0].helptext"]: "此项不得为空",
        ["picker[0].helptext_style"]: "color:#ff8a80;"
      })
    }
    if (e.detail.value.title == "") {
      this.setData({
        ["input[0].helptext"]: "此项不得为空",
        ["input[0].helptext_style"]: "color:#ff8a80;"
      })
    }
    if (e.detail.value.date == "") {
      this.setData({
        ["picker[1].helptext"]: "此项不得为空",
        ["picker[1].helptext_style"]: "color:#ff8a80;"
      })
    }
    if (e.detail.value.time == "") {
      this.setData({
        ["picker[2].helptext"]: "此项不得为空",
        ["picker[2].helptext_style"]: "color:#ff8a80;"
      })
    }
    if (e.detail.value.content == "") {
      this.setData({
        ["input[2].helptext"]: "此项不得为空",
        ["input[2].helptext_style"]: "color:#ff8a80;"
      })
    }

    if (e.detail.value.groupid != "" && e.detail.value.title != "" && e.detail.value.date != "" && e.detail.value.time != "" && e.detail.value.content != "") {
      console.log("success")
      console.log(this.data.nickname)
      let time = e.detail.value.date + " " + e.detail.value.time
      let admin = (e.detail.value.admin) ? (e.detail.value.admin) : (this.data.nickname)
      wx.cloud.database().collection('data').add({
        data: {
          groupid: e.detail.value.groupid,
          title: e.detail.value.title,
          admin: admin,
          timestamp: Date.parse(time.replace(/-/g, '/')),
          content: e.detail.value.content,
          finished: false
        }
      })
      .then(res => {
        wx.showToast({
          title: "任务已发布",
          duration: 1000
        })
      })
      .catch(res => {
        wx.showToast({
          title: "发布失败",
          icon: "error",
          duration: 1000
        })
      })
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
    //获取群组
    wx.cloud.database().collection('group').get()
      .then(res => {
        // console.log(res)
        this.setData({
          array: res.data
        })
      })
      .catch(err => {
        console.log(err)
      })
    //获取昵称
    if (app.globalData.userInfo) {
      this.setData({
        nickname: app.globalData.userInfo.nickName
      })
    } else {
      wx.cloud.database().collection('user').where({
          _openid: this.data.openid
        }).get()
        .then(res => {
          // console.log(res.data[0].nickname)
          this.setData({
            nickname: res.data[0].nickname
          })
        })
        .catch(err => {})
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