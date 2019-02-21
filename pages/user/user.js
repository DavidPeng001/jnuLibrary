// pages/user/user.js
const app = getApp()
Page({
  data: {
    personnelno: ''
  },
  onShow: function() {
    this.quickLogin()
    // personnelno = app.globalData.personnelno
  },
  quickLogin: function () {
    let { personnelno } = app.globalData
    if (personnelno != null) {
      this.setData({
        personnelno: personnelno,
      })
      return
    }
    else {
      console.log('-- Getting Personnelno --')
      app.getPersonnelno()
    }
    return
  },
  logintap: function() {
    wx.navigateTo({
      url: '../login/login'
    })
    // TODO: 若已经登录，点击转到注销界面
  }
})