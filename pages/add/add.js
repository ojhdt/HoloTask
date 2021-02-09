// pages/add/add.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    input: [{
      main: "main",
      placeholder: "placeholder",
      number: 0
    }, {
      main: "main",
      placeholder: "placeholder",
      number: 0
    }, {
      main: "main",
      placeholder: "placeholder",
      number: 0
    }],
  },
  input: function (e) {
    let id = e.currentTarget.dataset.id
    let str = "input[" + id + "].number"
    this.setData({
      [str] : e.detail.cursor
    })
  },
  focus: function (e) {
    let id = e.currentTarget.dataset.id
    let str1 = "input[" + id + "].main"
    let str2 = "input[" + id + "].placeholder"
    this.setData({
      [str1]: "border-bottom: 1.5px solid #07c160;",
      [str2]: "font-size:0.7rem;color:#07c160;top:0rpx;",
    })
  },

  blur: function (e) {
    let id = e.currentTarget.dataset.id
    let str1 = "input[" + id + "].main"
    let str2 = "input[" + id + "].placeholder"
    if (e.detail.value == "")
      this.setData({
        [str1]: "border-bottom: 1.5px solid #444;",
        [str2]: "top:37rpx;color:#666;font-size:1rem"
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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