// pages/login/login.js
const app = getApp()
Page({
  data: {
    id: "",
    passwordLib: "",
    passwordSpace: "",
    errorInfo: null,
    popup: {
      popupHidden: true,
      base64ImgUrl: null
    },
    popupCaptcha: ""
  },
  onLoad: function (options) {
  },
  idInput: function (input) {
    this.setData(
      {
        id: input.detail.value
      }
    )
  },
  passwordLibInput: function (input) {
    this.setData(
      {
        passwordLib: input.detail.value
      }
    )
  },
  passwordSpaceInput: function (input) {
    this.setData(
      {
        passwordSpace: input.detail.value
      }
    )
  },
  loginBtnclk: function () {
    
    let { id, passwordLib, passwordSpace } = this.data 
    // todo: check is empty
    if (id == "" || passwordLib == "" || passwordSpace == "" ) {
      this.commomModal("请输入用户名与密码")
      return
    }
    this.login(id, passwordLib, passwordSpace).then((res) => {
      if (res.data.status == 0) {
        wx.setStorageSync('session_key', res.header['Set-Cookie'])
        app.globalData.personnelno = id
        this.popupCancel()
        wx.navigateBack({
          delta: 1,
        })
      }
      else if (res.data.status == 2) {
        wx.setStorageSync('temp_session_key', res.header['Set-Cookie'])
        var base64Data = res.data.captcha
        base64Data = wx.arrayBufferToBase64(wx.base64ToArrayBuffer(base64Data))
        const base64ImgUrl = "data:image/png;base64," + base64Data
        this.popupShow(base64ImgUrl)
      }
      else {
        this.commomModal("用户名或密码错误")
      }
    }).catch((info) => {
      this.commomModal(info)
    })
  },
  login: function (id, passwordLib, passwordSpace) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://davidp.top/api/login/',
        method: 'POST',
        data: {
          'id': id,
          'passwd_lib': passwordLib,
          'passwd_space': passwordSpace,
        },
        header: {
          'content-type': 'application/json',
          'Accept': 'application/json'
        },
        success: function (res) {
          if (res.statusCode == 200 && res.header['Set-Cookie']) {
            if (res.data.status != -1) {
              resolve(res)
            } else {
              reject("服务器维护中")
            }
          } else {
            reject("服务器维护中")
          }
        },
        error: function (e) {
          reject("请检查网络连接")
        }
      })
    })
  },
  captchaUpdate: function() {
    this.popupCancel()
    const cookie = wx.getStorageSync('temp_session_key')
    if (cookie) {
      var headers = {
        'content-type': 'application/json',
        'Accept': 'application/json'
      }
      headers.Cookie = cookie
      var that = this
      wx.request({
        url: 'https://davidp.top/api/captchaupdate/',
        header: headers,
        method: 'GET',
        dataType: 'json',
        success: function (res) {
          if (res.statusCode == 200) {
            if (res.data.status == 0) {
              wx.setStorageSync('temp_session_key', res.header['Set-Cookie'])
              var base64Data = res.data.captcha
              base64Data = wx.arrayBufferToBase64(wx.base64ToArrayBuffer(base64Data))
              const base64ImgUrl = "data:image/png;base64," + base64Data
              that.popupShow(base64ImgUrl)
            }
            else {
            that.popupCancel()
            }
          }
          else {
            this.commomModal("服务器维护中")
            that.popupCancel()
          }
        },
        fail: function (res) {
          this.commomModal("请检查网络连接")
          that.popupCancel()
        },
      })
    }
    else if (inputCaptcha == "") {
      return
    }
    else {
      this.commomModal("请尝试重新登录")
      that.popupCancel()
    }

  },
  popupShow: function(base64ImgUrl) {
    this.setData({
      popup: {
        popupHidden: false,
        base64ImgUrl: base64ImgUrl
      },
      popupCaptcha: null
    })
  },
  popupInput: function(input) {
    this.setData({
      inputCaptcha: input.detail.value 
    })
  },
  popupConfirm: function() {
    
    const cookie = wx.getStorageSync('temp_session_key')
    if (inputCaptcha != "" && cookie) {
      var headers = {
        'content-type': 'application/json',
        'Accept': 'application/json'
      }
      headers.Cookie = cookie 
      var that = this
      wx.request({
        url: 'https://davidp.top/api/login/captcha/',
        data: {
          captcha: that.data.inputCaptcha 
        },
        header: headers,
        method: 'POST',
        dataType: 'json',
        success: function (res) {
          if (res.statusCode == 200) {
            switch (res.data.status) {
              case 0:
                wx.setStorageSync('session_key', res.header['Set-Cookie'])
                that.popupCancel()
                break
              case 101:
                wx.showModal({
                  title: "",
                  content: "验证码错误",
                  success: function (res) {
                    if (res.confirm) {
                      that.captchaUpdate()
                    }
                    else if (res.cancel) {
                      that.popupCancel()
                    }
                    
                  }
                })
                
                break
              case 102:
                that.popupCancel()
                break
              default:
                this.commomModal("请尝试重新登录")
                that.popupCancel()
            }
          }
          else {
            this.commomModal("服务器维护中")
            that.popupCancel()
          }
        },
        fail: function (res) {
          this.commomModal("请检查网络连接")
          that.popupCancel()
        },
      })
    }
    else if (inputCaptcha == ""){
      return
    }
    else {
      this.commomModal("请尝试重新登录")
      that.popupCancel()
    }
    
  },
  popupCancel: function() {
    this.setData({
      popup: {
        popupHidden: true,
        base64ImgUrl: null
      },
      popupCaptcha: ""
    })
  },

  commomModal: function (content) {
    wx.showModal({
      title: "",
      content: content,
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
        }
        else if (res.cancel) {
        }
      }
    })
  }
})