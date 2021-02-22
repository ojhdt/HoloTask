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
    markdown: false,
    tempImgs: [],
    tempFiles: [],
    file_style: null,
    file_helptext: "可添加一个大小不超过 10 MiB 的附件。",
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

  chooseFile: function () {
    var that = this
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFiles
        if (tempFilePaths[0].size > 10485760) {
          let str = "文件过大（" + (tempFilePaths[0].size / 1048576).toFixed(2) + "MiB），超出 10 MiB 限制，文件未上传"
          that.setData({
            file_helptext: str,
            file_style: "color:#ff8a80;"
          })
        } else {
          that.setData({
            tempFiles: tempFilePaths,
            file_helptext: "可添加一个大小不超过 10 MiB 的附件。",
            file_style: ""
          })
        }
      }
    })
  },

  clearFile: function () {
    this.setData({
      tempFiles: []
    })
  },

  chooseImage: function () {
    var that = this
    wx.chooseImage({
      count: 2,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res)
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        // console.log(tempFilePaths)
        that.setData({
          tempImgs: tempFilePaths
        })
      }
    })
  },

  clearImage: function (e) {
    console.log(e.currentTarget.dataset.index)
    let temp = this.data.tempImgs
    temp.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      tempImgs: temp
    })
  },

  uploadFile: function (cloudpath, filepath) {
    console.log("uploading")
    wx.cloud.uploadFile({
      cloudPath: cloudpath,
      filePath: filepath, // 文件路径
    }).then(res => {
      // get resource ID
      console.log(res.fileID)
      return res.fileID
    }).catch(error => {
      console.log("handle error")
    })
  },

  switch: function (e) {
    let target = e.currentTarget.dataset.name
    if (target == "markdown") {
      var value = !this.data.markdown
    }
    this.setData({
      [target]: value
    })
    this.check()
  },

  check: function () {
    if (this.data.markdown) {
      this.setData({
        markdownbar: "background:#bcddb0;",
        markdowndot: "right:0rpx;background:#07c160;"
      })
    } else {
      this.setData({
        markdownbar: "background:#9e9e9e;",
        markdowndot: "right:34rpx;background:#fff;"
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

  change: function (e) {
    let id = e.currentTarget.dataset.id
    let str1 = "picker[" + id + "].value"
    let str2 = "picker[" + id + "].placeholder"
    let str3 = "picker[" + id + "].style"
    let str4 = "picker[" + id + "].helptext"
    let str5 = "picker[" + id + "].helptext_style"
    if (this.data.theme == 'light') {
      this.setData({
        [str1]: e.detail.value,
        [str2]: "font-size:0.7rem;color:#666;top:0rpx;",
        [str3]: "opacity:1",
        [str4]: e.currentTarget.dataset.helptext,
        [str5]: "color:#666;"
      })
    } else {
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
    if (this.data.theme == 'light') {
      this.setData({
        [str1]: this.data.array[e.detail.value].name,
        [str2]: "font-size:0.7rem;color:#666;top:0rpx;",
        [str3]: "opacity:1",
        [str4]: e.currentTarget.dataset.helptext,
        [str5]: "color:#666;"
      })
    } else {
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
    let str10 = "input[0].number"
    let str11 = "input[1].number"
    let str12 = "input[2].number"
    let str13 = "input[0].placeholder"
    let str14 = "input[1].placeholder"
    let str15 = "input[2].placeholder"

    if (this.data.theme == 'light') {
      this.setData({
        [str1]: '.',
        [str2]: '.',
        [str3]: '.',
        [str4]: "opacity:0;",
        [str5]: "opacity:0;",
        [str6]: "opacity:0;",
        [str7]: "font-size:1rem;color:#666;top:40rpx;",
        [str8]: "font-size:1rem;color:#666;top:40rpx;",
        [str9]: "font-size:1rem;color:#666;top:40rpx;",
        [str10]: 0,
        [str11]: 0,
        [str12]: 0,
        [str13]: "font-size:1rem;color:#666;top:40rpx;",
        [str14]: "font-size:1rem;color:#666;top:40rpx;",
        [str15]: "font-size:1rem;color:#666;top:40rpx;",
      })
    } else {
      this.setData({
        [str1]: '.',
        [str2]: '.',
        [str3]: '.',
        [str4]: "opacity:0;",
        [str5]: "opacity:0;",
        [str6]: "opacity:0;",
        [str7]: "font-size:1rem;color:#ccc;top:40rpx;",
        [str8]: "font-size:1rem;color:#ccc;top:40rpx;",
        [str9]: "font-size:1rem;color:#ccc;top:40rpx;",
        [str10]: 0,
        [str11]: 0,
        [str12]: 0,
        [str13]: "font-size:1rem;color:#ccc;top:40rpx;",
        [str14]: "font-size:1rem;color:#ccc;top:40rpx;",
        [str15]: "font-size:1rem;color:#ccc;top:40rpx;",
      })
    }

  },

  submit: function (e) {
    var that = this
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
      wx.showModal({
        confirmColor: '#07c160',
        title: "发布任务",
        content: "是否要发布该任务",
        success(res) {
          if (res.confirm) {
            console.log("success")
            var filepath = "taskfile/" + that.data.array[0].groupid + "/" + new Date().getTime() + "/"
            console.log(filepath)
            var imgid = []
            var fileid = []
            // let i = 0,
            //   j = 0
            // while (i < that.data.tempImgs.length) {
            //   console.log(i)
            //   imgid.push(await that.uploadFile(filepath + i.toString() + ".jpg", that.data.tempImg[i]))
            //   i++
            // }
            // while (j < that.data.tempFiles.length) {
            //   fileid.push(await that.uploadFile(filepath + that.data.tempFiles[j].name, that.data.tempFiles[j].path))
            //   j++
            // }

            function step1() {
              return new Promise((resolve, reject) => {
                if (that.data.tempImgs.length != 0) {
                  wx.showLoading({
                    title: '图片上传中',
                  })
                  wx.cloud.uploadFile({
                    cloudPath: filepath + "0.jpg",
                    filePath: that.data.tempImgs[0], // 文件路径
                    success: res => {
                      // get resource ID
                      console.log(res.fileID)
                      imgid.push(res.fileID)
                      resolve()
                    },
                    fail: err => {
                      reject()
                    },
                  })
                } else {
                  resolve()
                }
              })
            }

            function step2() {
              return new Promise((resolve, reject) => {
                if (that.data.tempImgs.length == 2) {
                  wx.showLoading({
                    title: '图片上传中',
                  })
                  wx.cloud.uploadFile({
                    cloudPath: filepath + "1.jpg",
                    filePath: that.data.tempImgs[1], // 文件路径
                    success: res => {
                      // get resource ID
                      console.log(res.fileID)
                      imgid.push(res.fileID)
                      resolve()
                    },
                    fail: err => {
                      reject()
                    },
                  })
                } else {
                  resolve()
                }

              })
            }

            function step3() {
              return new Promise((resolve, reject) => {
                if (that.data.tempFiles.length == 1) {
                  wx.showLoading({
                    title: '文件上传中',
                  })
                  wx.cloud.uploadFile({
                    cloudPath: filepath + that.data.tempFiles[0].name,
                    filePath: that.data.tempFiles[0].path, // 文件路径
                    success: res => {
                      // get resource ID
                      console.log(res.fileID)
                      fileid.push(res.fileID)
                      resolve()
                    },
                    fail: err => {
                      reject()
                    },
                  })
                } else {
                  resolve()
                }
              })
            }

            function step4() {
              //正式处理数据
              wx.showLoading({
                title: '任务发布中',
              })
              let time = e.detail.value.date + " " + e.detail.value.time
              let admin = (e.detail.value.admin) ? (e.detail.value.admin) : (that.data.nickname)
              let groupid = that.data.array[e.detail.value.groupid].groupid
              wx.cloud.database().collection('data').add({
                  data: {
                    groupid: groupid,
                    title: e.detail.value.title,
                    admin: admin,
                    timestamp: Date.parse(time.replace(/-/g, '/')),
                    markdown: that.data.markdown,
                    content: e.detail.value.content,
                    fileid: fileid,
                    imgid: imgid,
                    filename: that.data.tempFiles.length == 0 ? "" : that.data.tempFiles[0].name,
                    finished: {
                      [that.data.openid]: false
                    }
                  }
                })
                .then(res => {
                  wx.hideLoading()
                  wx.showToast({
                    title: "任务已发布",
                    duration: 1000
                  })
                  setTimeout(() => {
                    wx.navigateBack({
                      delta: 1,
                    })
                  }, 1000)
                })
                .catch(res => {
                  wx.showToast({
                    title: "发布失败",
                    icon: "error",
                    duration: 1000
                  })
                  // that.reset()
                })
            }

            step1().then(() => {
              step2().then(() => {
                step3().then(() => {
                  step4()
                }).catch(() => {
                  wx.hideLoading()
                  wx.showToast({
                    title: '文件上传失败',
                    icon: "none",
                    duration: 2000
                  })
                })
              }).catch(() => {
                wx.hideLoading()
                wx.showToast({
                  title: '图片上传失败',
                  icon: "none",
                  duration: 2000
                })
              })
            }).catch(() => {
              wx.hideLoading()
              wx.showToast({
                title: '图片上传失败',
                icon: "none",
                duration: 2000
              })
            })

            //async写法
            // async function upload() {
            //   if (that.data.tempImgs != []) {
            //     await step1()
            //   }
            //   console.log("1,", new Date().getTime())
            //   if (that.data.tempImgs != [] && that.data.tempImgs.length == 2) {
            //     await step2()
            //   }
            //   console.log("2,", new Date().getTime())
            //   if (that.data.tempFiles != []) {
            //     await step3()
            //   }
            //   console.log("3,", new Date().getTime())
            //   step4()
            // }
            // upload()

          } else if (res.cancel) {}
        }
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
    if (app.globalData.openid) {
      wx.cloud.database().collection('group').where({
          _openid: app.globalData.openid
        }).get()
        .then(res => {
          // console.log(res)
          this.setData({
            array: res.data
          })
        })
        .catch(err => {
          console.log(err)
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
          wx.cloud.database().collection('group').where({
              _openid: res.result.openid
            }).get()
            .then(res => {
              // console.log(res)
              this.setData({
                array: res.data
              })
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    }
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