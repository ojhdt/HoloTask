// pages/account/account.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openid: null,
    theme: null,
    login: false,
    avatarUrl: "/source/img/account/avatar.png",
    nickName: "未登录",
    description: "欢迎使用 HoloTask",
    motto: "From small beginnings comes great things.",
    motto_from: "Winston Churchill",
    imgUrl: "",
    hitokoto: false,
    bing: true
  },

  joinGroup: function () {
    wx.showModal({
      title: "加入群组",
      content: "请输入群组八位唯一ID",
      editable: true,
      confirmColor: "#07c160",
      success: (res => {
        if (res.confirm) {
          console.log(res.content.length)
          if (res.content.length == 8) {
            wx.cloud.database().collection('group').where({
                groupid: res.content
              }).get()
              .then(res => {
                if (res.data.length == 0) {
                  wx.showModal({
                    title: "错误",
                    content: "未检索到群组信息，请检查群组ID",
                    confirmColor: "#07c160",
                    confirmText: "重试",
                    success: (res => {
                      if (res.confirm) {
                        this.joinGroup()
                      }
                    })
                  })
                }
              })
          } else {
            wx.showModal({
              title: "错误",
              content: "输入格式有误",
              confirmColor: "#07c160",
              confirmText: "重试",
              success: (res => {
                if (res.confirm) {
                  this.joinGroup()
                }
              })
            })
          }
        }
      }),
    })
  },

  addTask: function() {
    wx.navigateTo({
      url: '/pages/add/add',
    })
  },

  refreshData: function () {
    if (this.data.login) {
      this.setData({
        nickName: this.data.userInfo.nickName,
        avatarUrl: this.data.userInfo.avatarUrl
      })
    } else {
      console.log("failed")
    }
    wx.cloud.database().collection('user').where({
        _openid: this.data.openid
      }).get()
      .then(res => {
        let timestamp = res.data[0].timestamp
        let days = Math.ceil((new Date().getTime() - timestamp) / 86400000)
        this.setData({
          description: "HoloTask 已陪伴您 " + days + " 天"
        })
      })
      .catch(err => {
        console.log(err)
      })
  },

  refreshUserInfo: function () {
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
  },

  getImage: function () {
    if (this.data.bing) {
      wx.request({
        url: 'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1',
        method: 'GET',
        dataType: 'json',
        success: res => {
          let url = 'https://s.cn.bing.net/' + res.data.images[0].url;
          this.setData({
            imgUrl: url
          })
        }
      })
    } else {
      wx.cloud.getTempFileURL({
        fileList: ["cloud://holotask-1gb3a2qhe28a3262.686f-holotask-1gb3a2qhe28a3262-1304966310/image/account/sajad-nori-i4lvriR96Ek-unsplash.jpg"],
        success: res => {
          this.setData({
            imgUrl: res.fileList[0].tempFileURL
          })
        },
        fail: res => {
          console.log("Failed to request img.")
        }
      })
    }
  },

  getMoto: function () {
    if (this.data.hitokoto) {
      wx.request({
        url: 'https://v1.hitokoto.cn/?c=a&c=b&c=c&c=d&c=i&encode=json&max_length=30',
        method: 'GET',
        dataType: 'json',
        success: res => {
          this.setData({
            motto: res.data.hitokoto,
            motto_from: res.data.from
          })
          // console.log(res.data);
        }
      })
    }
  },

  animation: function () {
    this.animate('#motto_container', [{
      opacity: 1.0,
      offset: 0
    }, {
      opacity: 0.0,
      offset: 1
    }, ], 2000, {
      scrollSource: '#scroller',
      timeRange: 2000,
      startScrollOffset: 50,
      endScrollOffset: 280
    })

    this.animate('#header', [{
      height: '100%',
    }, {
      height: '120%',
    }, ], 2000, {
      scrollSource: '#scroller',
      timeRange: 2000,
      startScrollOffset: 0,
      endScrollOffset: 280
    })

    this.animate('#motto_setting', [{
      opacity: 1.0,
      transform: 'rotate(0deg)',
      offset: 0
    }, {
      opacity: 1.0,
      transform: 'rotate(32deg)',
      offset: .18
    }, {
      opacity: 0.0,
      transform: 'rotate(180deg)',
      offset: 1
    }, ], 2000, {
      scrollSource: '#scroller',
      timeRange: 2000,
      startScrollOffset: 0,
      endScrollOffset: 280
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
    this.refreshUserInfo();
    this.getImage();
    this.getMoto();
    this.animation();
    this.refreshData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //this.getMoto();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.refreshUserInfo()
    this.refreshData()
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