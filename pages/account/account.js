// pages/account/account.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{
      name: "Ojhdt",
      description: "个性签名",
    },
    hitokoto: "From small beginnings comes great things.",
    from: "Winston Churchill"
  },

  getImage: function(){
    wx.cloud.getTempFileURL({
      fileList: ["cloud://holotask-1gb3a2qhe28a3262.686f-holotask-1gb3a2qhe28a3262-1304966310/image/account/sajad-nori-i4lvriR96Ek-unsplash.jpg"],
      success: res => {
        this.setData({
          imgUrl: res.fileList[0].tempFileURL
        })
      }
    })
  },

  getMoto: function(){
    wx.request({
      url: 'https://v1.hitokoto.cn/?c=k&encode=json&max_length=30',
      method: 'GET',
      dataType: 'json',
      success: res => {
        this.setData({
          hitokoto: res.data.hitokoto,
          from: res.data.from
        })
        console.log(res.data);
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getImage();
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