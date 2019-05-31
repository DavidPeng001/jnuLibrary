// pages/user/user.js
const app = getApp()
Page({
  data: {
    personnelno: null
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
      let { personnelno } = app.globalData
      if (personnelno != null) {
        this.setData({
          personnelno: personnelno,
        })
        return
      }
    }
    
  },
  logintap: function() {
    if (this.data.personnelno) {
      wx.showModal({
        title: "",
        content: "是否确定退出登录？",
        success: function (res) {
          if (res.confirm) {
            app.logout()
          }
          else if (res.cancel) {
            
          }
        }
      })
    }
    else {
      wx.navigateTo({
        url: '../login/login'
      })

    }
    
  }
})