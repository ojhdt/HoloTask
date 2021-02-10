//index.js
const app = getApp()
var util = require("../../utils/util.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openid: null,
    theme: null,
    login: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    db: {
      user1: [{
        title: "C语言程序设计",
        admin: "冼广铭",
        timestamp: 1613574395579,
        finished: false,
      }, {
        title: "高等数学",
        admin: "翁文",
        timestamp: 1612584395579,
        finished: false,
      }, {
        title: "思想道德修养与法律基础",
        admin: "甘培聪",
        timestamp: 1612948723579,
        finished: true,
      }, {
        title: "计算机科学技术导论",
        admin: "杨欢",
        timestamp: 1612639135126,
        finished: false,
      }, {
        title: "基础英语",
        admin: "郭珊珊",
        timestamp: 1612728437602,
        finished: false,
      }]
    }
  },

  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo;
    console.log(e)
    var nickname = e.detail.userInfo.nickName
    console.log(nickname)
    var openid;
    if (app.globalData.openid) {
      openid = app.globalData.openid
    } else {
      if (this.data.openid) {
        openid = this.data.openid
      } else {
        console.log("index.js-getuserinfo从数据库拉取")
        wx.cloud.callFunction({
          name: 'getOpenid',
          complete: res => {
            app.globalData.openid = res.result.openid
            app.globalData.appid = res.result.appid
            openid = res.result.openid
          }
        })
      }
    }
    wx.cloud.database().collection('user').where({
        _openid: openid
      }).get()
      .then(res => {
        console.log(res)
        if (res.data.length == 0) {
          wx.cloud.database().collection('user').add({
            data: {
              group: openid,
              nickname: nickname
            }
          })
          wx.cloud.database().collection('group').add({
            data: {
              groupid: openid,
              name: "个人",
              sub: "个人",
              member: [openid]
            }
          })
          wx.showToast({
            title: "新用户已注册",
            duration: 500
          })
        } else {
          wx.showToast({
            title: "已获取用户数据",
            duration: 500
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
    //首次登陆后刷新一次又何妨
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        login: true,
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          login: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            login: true
          })
        }
      })
    }
  },

  sortData: function () {
    // var time = util.formatTime(new Date());
    // console.log((new Date).getTime());
    let finished = 0,
      unfinished = 0,
      dying = 0;
    //获取夜间模式
    var theme;
    if (this.data.theme) {
      theme = this.data.theme
    } else {
      if (app.globalData.theme) {
        theme = app.globalData.theme
      } else {
        wx.getSystemInfo({
          success: (res) => {
            theme = res.theme;
          }
        })
      }
    }

    //排序
    var array_u = [];
    var array_g = [];
    var array_f = [];
    this.data.db.user1.forEach((value, index, array) => {
      if (value.finished) array_f.push(value);
      else {
        if (value.timestamp - (new Date).getTime() < 0) array_g.push(value);
        else array_u.push(value);
      }
    });
    array_u.sort((a, b) => {
      return a.timestamp - b.timestamp;
    })
    array_f.sort((a, b) => {
      return a.timestamp - b.timestamp;
    })
    array_g.sort((a, b) => {
      return a.timestamp - b.timestamp;
    })
    this.setData({
      "db.user1": (array_u.concat(array_g)).concat(array_f)
    });
    this.data.db.user1.forEach((element, index) => {
      let timestamp = element.timestamp;
      let timelast = (element.timestamp - (new Date).getTime()) / 1000;
      // console.log(timelast);
      //写入时间字符串
      let str = 'db.user1[' + index + '].time';
      this.setData({
        [str]: util.formatTime(new Date(timestamp))
      })
      //读取完成数及未完成数
      if (element.finished) {
        finished++;
        let str1 = 'db.user1[' + index + '].color';
        let str2 = 'db.user1[' + index + '].unit';
        if (theme == "dark") {
          this.setData({
            [str1]: "background-image: linear-gradient(to bottom right, #43a047, #66bb6a)",
            [str2]: "已完成"
          })
        } else {
          this.setData({
            [str1]: "background-image: linear-gradient(to bottom right, #98E165, #74ce34)",
            [str2]: "已完成"
          })
        }
      } else {
        unfinished++;
        //计算剩余时间
        if (timelast < 172800 && timelast > 0) {
          //如果少于两天，执行
          dying++;
          let str1 = 'db.user1[' + index + '].color';
          if (theme == "dark") {
            this.setData({
              [str1]: "background-image: linear-gradient(to bottom right, #e53935, #ef5350)"
            })
          } else {
            this.setData({
              [str1]: "background-image: linear-gradient(to bottom right, #ff8a80, #ff5252)"
            })
          }
        }
        if (timelast >= 86400) {
          //如果多于一天
          let str1 = 'db.user1[' + index + '].timelast';
          let str2 = 'db.user1[' + index + '].unit';
          this.setData({
            [str1]: Math.round(timelast / 86400),
            [str2]: "天"
          })
        } else if (timelast < 86400 && timelast > 3600) {
          //如果少于一天但多于1小时
          let str1 = 'db.user1[' + index + '].timelast';
          let str2 = 'db.user1[' + index + '].unit';
          this.setData({
            [str1]: Math.round(timelast / 3600),
            [str2]: "时"
          })
        } else if (timelast <= 3600 && timelast >= 0) {
          //如果少于1小时但未过期
          let str1 = 'db.user1[' + index + '].timelast';
          let str2 = 'db.user1[' + index + '].unit';
          this.setData({
            [str1]: Math.round(timelast / 60),
            [str2]: "分"
          })
        } else {
          //如果已过期
          let str1 = 'db.user1[' + index + '].timelast';
          let str2 = 'db.user1[' + index + '].unit';
          let str3 = 'db.user1[' + index + '].textcolor';
          if (theme == "dark") {
            this.setData({
              [str3]: "color: #666"
            })
          } else {
            this.setData({
              [str3]: "color: #999"
            })
          }
          this.setData({
            [str1]: '',
            [str2]: "已过期"
          })
        }
      }
    });
    this.setData({
      finished: finished,
      unfinished: unfinished,
      dying: dying
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          this.setData({
            login: true
          })
        } else {
          this.setData({
            login: false
          })
        }
      }
    })
    //拉取userinfo
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        login: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          login: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            login: true
          })
        }
      })
    }
    //已授权自动更新
    if (this.data.login)
      this.sortData()
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
    this.sortData()
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
    this.sortData()
    wx.stopPullDownRefresh({
      success: (res) => {
        wx.showToast({
          title: "数据已更新",
          duration: 500
        })
      },
    })
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