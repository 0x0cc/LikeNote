// pages/index/index.js
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 设备信息
    statusHeight: getApp().globalData.statusHeight,
    screenHeight: getApp().globalData.screenHeight,
    screenWidth: getApp().globalData.screenWidth,
    // 头像高度
    avatarHeight: null,
    // 添加按钮高度
    fix_button: null,
    // openid
    openid: '',
    // 页面内容
    content: [],
  },

  // 检查登陆状态
  checkLog: function(e) {
    var that = this;
    wx.getStorage({
      key: 'openid',
      success:(res) =>{
        console.log(res);
        if(res.data.length == 0) {
          console.log("empty data");
          that.gotoLog();
          return;
        }
        that.setData({
          openid: res.data
        })
      },
      fail:(res) =>{
        console.log(res)
        that.gotoLog();
        return;
      }
    })
  },
  // 跳转登录
  gotoLog: function(e) {
    wx.navigateTo({
      url: '../login/login',
    })
  },

  // 获取帖子
  getPosts: function(e) {
    var content = [];
    var that = this;
    wx.cloud.callFunction({
      name: 'getPosts',
      success:(res)=> {
        console.log(res.result.data);
        if(res.result.length == 0) {
          wx.showToast({
            title: '没有更多了',
            icon: 'error',
            duration: 800
          })
          return;
        }
        else {
          content = res.result.data;
          content.reverse();
          that.setData({
            content: content
          })
        }
      }
    })
  },

  // 去发言
  navWrite: function(e) {
    wx.navigateTo({
      url: '../write/write',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var avatarHeight = this.data.screenWidth;
    var fix_button = avatarHeight*0.15;
    avatarHeight = avatarHeight*0.9*0.15;
    this.setData({
      avatarHeight: avatarHeight,
      fix_button: fix_button
    })
    this.getPosts();
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
    this.onLoad();
    setTimeout(function(){
      wx.stopPullDownRefresh({
        success: (res) => {
          console.log(res);
        },
      })
    },500);
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