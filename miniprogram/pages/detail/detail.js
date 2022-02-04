// pages/detail/detail.js

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
    // openid
    openid: '',
    // 评论人信息
    nickName: '',
    avatar: '',
    identity: [],
    // 帖子内容
    content: [],
    // 评论内容
    comment: [],
    // 返回
    back: '<',
    // 提交的评论内容
    cmt: [],
    id: '',
    // 监听输入
    input: '',
    time: '',
  },

  // 返回
  navBack: function(e) {
    wx.navigateBack({
      delta: 0,
    })
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
        var openid = res.data;
        that.setData({
          openid: openid,
        })
        db.collection('users').where({
          openid: openid
        }).get()
        .then(res=> {
          console.log(res)
          that.setData({
            nickName: res.data[0].nickName,
            avatar: res.data[0].avatar,
            identity: res.data[0].identity,
          })
        })
        .catch(err=> {
          console.log(err);
          this.gotoLog();
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

  // 获取现在时间
  getTime: function(e) {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var time = '';
    time += year + '-' + month + '-' + day;
    this.setData({
      time: time
    })
  },

  // 评论提交
  cmt_submit: function(e) {
    console.log(e);
    var that = this;
    var ctn = e.detail.value.cmt;
    if(ctn.length == 0) {
      wx.showToast({
        title: '写点东西吧',
        icon: 'none',
        duration: 800
      })
      return;
    }
    else {
      this.getTime();
      var index = [];
      var piv = 0;
      for(var idx=0; idx<ctn.length; idx++) {
        // 分段存储
        if(ctn[idx] == '\n') {
          var prg = ctn.slice(piv,idx);
          console.log(prg);
          index.push(prg);
          piv = idx+1;
          continue;
        }
        else if(idx == ctn.length-1 && piv != idx) {
          var prg = ctn.slice(piv,idx+1);
          console.log(prg);
          index.push(prg);
        }
      }
      var id = e.currentTarget.dataset.id;
      var openid = this.data.openid;
      var nickName = this.data.nickName;
      var avatar = this.data.avatar;
      var identity = this.data.identity;
      var time = this.data.time;
      ctn = index;
      var comment = {'nickName':nickName,'openid':openid,'avatar':avatar,'ctn':ctn, 'identity':identity, 'time':time };
      wx.cloud.callFunction({
        name: 'addComment',
        data: {
          id: id,
          cmt: comment
        }
      }).then(res=>{
        console.log(res);
        wx.showToast({
          title: '评论成功',
          icon: 'success',
          duration: 800
        })
        this.setData({
          input: ''
        })
        setTimeout(function(){
          that.onLoad({'id':id});
        },800)
      })
      

    }
  },
  // 监听输入
  listenInput: function(e) {
    console.log(e);
    this.setData({
      input: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var avatarHeight = this.data.screenWidth;
    avatarHeight = avatarHeight*0.9*0.15;
    this.setData({
      avatarHeight: avatarHeight
    })
    this.checkLog();
    console.log(options);
    var id = options.id;
    this.setData({
      id: id
    })
    db.collection('posts').doc(id).get({
      success:res=> {
        console.log(res);
        this.setData({
          content: res.data,
          comment: res.data.comment
        })
      }
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
    var id = this.data.id;
    this.onLoad({'id':id});
    setTimeout(function(){
      wx.stopPullDownRefresh({
        success: (res) => {
          console.log(res);
        },
      })
    },500)
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