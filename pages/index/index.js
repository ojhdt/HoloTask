//index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dying: null,
    finished: null,
    unfinished: null,
    db:{
      user1:[{
        title:"C语言程序设计",
        admin:"冼广铭",
        id:"#001",
        dld:"2021-02-05",
        dlt:"23:59",
        finished: false
      },{
        title:"数学",
        admin:"翁文",
        id:"#002",
        dld:"2021-02-06",
        dlt:"00:01",
        finished: true
      }]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var time = new Date()
    console.log(time)
    this.onPullDownRefresh()
    //设置变量值
    this.setData({
      dying: 1,
      finished: 2,
      unfinished: 3
    })
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
    let finished = 0, unfinished = 0;
    console.log(this.data.db.user1)
    this.data.db.user1.forEach(element => {
      if(element.finished == true) finished++;
      else unfinished++;
      this.setData({
        finished:finished,
        unfinished:unfinished
      })
    });
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