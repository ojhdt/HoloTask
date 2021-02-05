// pages/details/details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    db:{
      user1:{
        task1:{
          title:"C语言程序设计",
          admin:"冼广铭",
          id:"#001",
          dld:"2021-02-05",
          dlt:"23:59",
          finished: false
        },
        task2:{
          title:"数学",
          admin:"翁文",
          id:"#002",
          dld:"2021-02-06",
          dlt:"00:01",
          finished: true
        }
      }
    }
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