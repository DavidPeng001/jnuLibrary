// pages/login/login.js
const app = getApp()
Page({
  data: {
    contents: [],
    errorInfo: null,
    popup: {
      popupHidden: true,
      base64ImgUrl: null
    },
    popupCaptcha: ""
  },
  onLoad: function (options) {
  },
  onShow: function() {
    const cookie = wx.getStorageSync('session_key')
    if (cookie) {
      headers = {
        'content-type': 'application/json',
        'Accept': 'application/json'
      }
      headers.Cookie = cookie
      var that = this
      wx.request({
        url: 'https://davidp.top/api/renewsearch/',
        header: headers,
        method: 'GET',
        dataType: 'json',
        success: function (res) {
          if (res.statusCode == 200) {
            if (res.data.status == 0) {
              that.setData({
                contents: res.data.table
              })
            }
            else if (res.data.status == 1) {
              wx.setStorageSync('temp_session_key', res.header['Set-Cookie'])
              var base64Data = res.data.captcha
              base64Data = wx.arrayBufferToBase64(wx.base64ToArrayBuffer(base64Data))
              const base64ImgUrl = "data:image/png;base64," + base64Data
              that.popupShow(base64ImgUrl)
            }
            else {
              // back and try again
            }
          }
          else {
            console.log("bad connection")
          }
        },
        fail: function (res) {
          console.log("bad connection")
        },
      })
    }
    else {
      // not login
    }

  },
  // loginBtnclk: function () {
  //   let { id, passwordLib, passwordSpace } = this.data
  //   // todo: check is empty
  //   this.login(id, passwordLib, passwordSpace).then((res) => {
  //     if (res.data.status == 0) {
  //       wx.setStorageSync('session_key', res.header['Set-Cookie'])
  //       app.globalData.personnelno = id
  //       this.popupCancel()
  //       wx.navigateBack({
  //         delta: 1,
  //       })
  //     }
  //     else if (res.data.status == 2) {
  //       wx.setStorageSync('temp_session_key', res.header['Set-Cookie'])
  //       var base64Data = res.data.captcha
  //       base64Data = wx.arrayBufferToBase64(wx.base64ToArrayBuffer(base64Data))
  //       const base64ImgUrl = "data:image/png;base64," + base64Data
  //       this.popupShow(base64ImgUrl)
  //     }
  //     else {
  //       // password wrong
  //     }
  //   }).catch((info) => {
  //     console.log('Login fail: ' + info)
  //     this.setData({
  //       errorInfo: info,
  //     })
  //   })
  // },
  // login: function (id, passwordLib, passwordSpace) {
  //   return new Promise((resolve, reject) => {
  //     wx.request({
  //       url: 'https://davidp.top/api/login/',
  //       method: 'POST',
  //       data: {
  //         'id': id,
  //         'passwd_lib': passwordLib,
  //         'passwd_space': passwordSpace,
  //       },
  //       header: {
  //         'content-type': 'application/json',
  //         'Accept': 'application/json'
  //       },
  //       success: function (res) {
  //         if (res.statusCode == 200 && res.header['Set-Cookie']) {
  //           if (res.data.status != -1) {
  //             resolve(res)
  //           } else {
  //             reject('bad conn')
  //           }
  //         } else {
  //           reject('网络连接错误')
  //         }
  //       },
  //       error: function (e) {
  //         reject('网络连接错误')
  //       }
  //     })
  //   })
  // },
  captchaUpdate: function () {
    this.popupCancel()
    const cookie = wx.getStorageSync('session_key')
    if (cookie) {
      headers = {
        'content-type': 'application/json',
        'Accept': 'application/json'
      }
      headers.Cookie = cookie
      var that = this
      wx.request({
        url: 'https://davidp.top/api/renewsearch/',
        header: headers,
        method: 'GET',
        dataType: 'json',
        success: function (res) {
          if (res.statusCode == 200) {
            if (res.data.status == 0) {
              that.setData({
                contents: res.data.table
              })
            }
            else if (res.data.status == 1) {
              wx.setStorageSync('temp_session_key', res.header['Set-Cookie'])
              var base64Data = res.data.captcha
              base64Data = wx.arrayBufferToBase64(wx.base64ToArrayBuffer(base64Data))
              const base64ImgUrl = "data:image/png;base64," + base64Data
              that.popupShow(base64ImgUrl)
            }
            else {
              // back and try again
            }
          }
          else {
            console.log("bad connection")
          }
        },
        fail: function (res) {
          console.log("bad connection")
        },
      })
    }
    else {
      // not login
    }
  },
  popupShow: function (base64ImgUrl) {
    this.setData({
      popup: {
        popupHidden: false,
        base64ImgUrl: base64ImgUrl
      },
      popupCaptcha: null
    })
  },
  popupInput: function (input) {
    this.setData({
      inputCaptcha: input.detail.value
    })
  },
  popupConfirm: function () {

    const cookie = wx.getStorageSync('temp_session_key')
    if (inputCaptcha != "" && cookie) {
      headers = {
        'content-type': 'application/json',
        'Accept': 'application/json'
      }
      headers.Cookie = cookie
      var that = this
      wx.request({
        url: 'https://davidp.top/api/renewsearch/captcha/',
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
              case 1:
                // password wrong
                break
              case -1:
                //server error
                break
              case 101:
                // 验证码错误
                that.captchaUpdate()
                break
              case 102:
                that.popupCancel()
                break
              default:
              // unkonwn login e
            }
          }
          else {
            console.log("bad connection")
          }
        },
        fail: function (res) {
          console.log("bad connection")
        },
      })
    }
    else if (inputCaptcha == "") {
      return
    }
    else {
      // no cookie
    }

  },
  popupCancel: function () {
    this.setData({
      popup: {
        popupHidden: true,
        base64ImgUrl: null
      },
      popupCaptcha: ""
    })
  }

})