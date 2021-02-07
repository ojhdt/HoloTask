//index.js
var util = require("../../utils/util.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    login: true,
    db:{
      user1:[{
        title: "C语言程序设计",
        admin: "冼广铭",
        timestamp: 1613574395579,
        finished: false,
      },{
        title: "高等数学",
        admin: "翁文",
        timestamp: 1612584395579,
        finished: false,
      },{
        title: "思想道德修养与法律基础",
        admin: "甘培聪",
        timestamp: 1612948723579,
        finished: true,
      },{
        title: "计算机科学技术导论",
        admin: "杨欢",
        timestamp: 1612639135126,
        finished: false,
      },{
        title: "基础英语",
        admin: "郭珊珊",
        timestamp: 1612728437602,
        finished: false,
      }]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(this.data.login)
    this.onPullDownRefresh()
    //设置变量值
    this.setData({

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
    // var time = util.formatTime(new Date());
    // console.log((new Date).getTime());
    let finished = 0, unfinished = 0, dying = 0;
    //排序
    var array_u = [];
    var array_g = [];
    var array_f = [];
    this.data.db.user1.forEach((value,index,array) => {
      if(value.finished) array_f.push(value);
      else
      {
        if(value.timestamp - (new Date).getTime() < 0) array_g.push(value);
        else array_u.push(value);
      }
    });
    array_u.sort((a,b) => {
      return a.timestamp - b.timestamp;
    })
    array_f.sort((a,b) => {
      return a.timestamp - b.timestamp;
    })
    array_g.sort((a,b) => {
      return a.timestamp - b.timestamp;
    })
    this.setData({"db.user1" : (array_u.concat(array_g)).concat(array_f)});
    this.data.db.user1.forEach((element,index) => {
      let timestamp = element.timestamp;
      let timelast = (element.timestamp - (new Date).getTime())/1000;
      // console.log(timelast);
      //写入时间字符串
      let str = 'db.user1['+index+'].time';
      this.setData({
        [str]: util.formatTime(new Date(timestamp))
      })
      //读取完成数及未完成数
      if(element.finished)
      {
        finished++;
        let str2 = 'db.user1['+index+'].unit';
        this.setData({
          [str2]: "已完成"
        })
      }
      else
      {
        unfinished++;
        //计算剩余时间
        if(timelast < 172800 && timelast > 0)
        {
          //如果少于两天，执行
          dying++;
        }
        if(timelast >= 86400)
        {
          //如果多于一天
          let str1 = 'db.user1['+index+'].timelast';
          let str2 = 'db.user1['+index+'].unit';
          this.setData({
            [str1]: Math.round(timelast/86400),
            [str2]: "天"
          })
        }
        else if(timelast < 86400 && timelast > 3600)
        {
          //如果少于一天但多于1小时
          let str1 = 'db.user1['+index+'].timelast';
          let str2 = 'db.user1['+index+'].unit';
          this.setData({
            [str1]: Math.round(timelast/3600),
            [str2]: "时"
          })
        }
        else if(timelast <= 3600 && timelast >= 0)
        {
          //如果少于1小时但未过期
          let str1 = 'db.user1['+index+'].timelast';
          let str2 = 'db.user1['+index+'].unit';
          this.setData({
            [str1]: Math.round(timelast/60),
            [str2]: "分"
          })
        }
        else
        {
          //如果已过期
          let str1 = 'db.user1['+index+'].timelast';
          let str2 = 'db.user1['+index+'].unit';
          this.setData({
            [str1]: '',
            [str2]: "已过期"
          })
        }
      }
    });
    this.setData({
      finished:finished,
      unfinished:unfinished,
      dying: dying
    })
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