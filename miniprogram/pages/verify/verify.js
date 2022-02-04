// pages/verify/verify.js

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
    avatarHeight: '',
    // openid
    openid: '',
    // 返回按钮
    back: '<',
    // 待审核内容
    content: [],
  },

  // 点击返回
  navBack: function(e) {
    wx.navigateBack({
      delta: 0,
    })
  },

  // 检查审核员身份
  checkLog: function(e) {
    wx.getStorage({
      key: 'openid',
      success: (res)=> {
        this.setData({
          openid: res.data,
          success: res=> {
            var openid = this.data.openid;
            db.collection('administer').where({
              openid: openid
            }).get({
              success: res=> {
                console.log(res);
                if(res.result.data.length != 0) {
                  return true;
                }
                else {
                  wx.reLaunch({
                    url: '../login/login',
                  })
                }
              },
              fail: res=> {
                wx.reLaunch({
                  url: '../login/login',
                })
              }
            })
          }
        })
      },
      fail:res=> {
        wx.reLaunch({
          url: '../login/login',
        })
      }
    })
  },

  // 获取待审核内容
  getPosts: function(e) {
    var that = this;
    wx.cloud.callFunction({
      name: 'getPosts',
      data: {
        acquire: false
      }
    }).then(res=>{
      var content = res.result.data;
      that.setData({
        content: content
      })
    })
  },

  // 审核
  pass: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.cloud.callFunction({
      name: 'verifyPosts',
      data: {
        pass: id,
        notPass: '',
      },
      success: res=> {
        this.onLoad();
      }
    })
  },
  notPass: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.cloud.callFunction({
      name: 'verifyPosts',
      data: {
        pass: '',
        notPass: id,
      },
      success: res=> {
        this.onLoad();
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.checkLog();
    var avatarHeight = this.data.screenWidth;
    avatarHeight = avatarHeight*0.9*0.15;
    this.setData({
      avatarHeight: avatarHeight
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
    setTimeout(function() {
      wx.stopPullDownRefresh({
        success: (res) => {
          console.log(res);
        },
      })
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