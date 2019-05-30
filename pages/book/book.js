// pages/login/login.js
const app = getApp()

// return 1 means can't get cookie again ,usually means password changing or account abnormal 
Page({
  data: {
    isTips: false,  // true -> fullscreen tip
    contents: [],
    currentContent: null,
    errorTip: "您尚未登录",
    popup: {
      popupHidden: true,
      base64ImgUrl: null
    },
    popupCaptcha: "",
    popupMode: 0,  // fixme
    // 0 for nothing  1 for renew search  2 for renew
  },
  onLoad: function (options) {
  },
  onShow: function() {
    const cookie = wx.getStorageSync('session_key')
    if (cookie) {
      this.setData({
        isTips: false
      })
      var headers = {
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
              that.setData({
                popupMode: 1
              })
              that.popupShow(base64ImgUrl)
            }
            else {
              this.commomModal("服务器维护中")
            }
          }
          else {
            this.commomModal("服务器维护中")
          }
        },
        fail: function (res) {
          this.commomModal("请检查网络连接")
        },
      })
    }
    else {
      this.setData({
        isTips: true
      })
      // not login
    }

  },
  captchaUpdate: function () {
    this.popupCancel()
    const cookie = wx.getStorageSync('session_key')
    if (cookie) {
      var headers = {
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
              that.setData({
                popupMode: 1
              })
              that.popupShow(base64ImgUrl)
            }
            else {
              that.commomModal("服务器维护中")
            }
          }
          else {
            that.commomModal("服务器维护中")
          }
        },
        fail: function (res) {
          that.commomModal("请检查网络连接")
        },
      })
    }
    else {
      //todo: quit login status
      this.setData({
        isTips: true
      })
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
    if (this.data.popupMode == 1) {
      const cookie = wx.getStorageSync('temp_session_key')
      if (inputCaptcha != "" && cookie) {
        var headers = {
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
                  that.commomModal("无法申请到网站Cookie，请稍后再试")
                  that.popupCancel()
                  break
                case -1:
                  that.commomModal("服务器维护中")
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
                  that.commomModal("账号异常，请重新登录")
                  that.setData({
                    isTips: true
                  })
                  that.popupCancel()
                  break
                default:
                  that.commomModal("未知登录问题")
                  that.popupCancel()
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
    }
    else if (this.data.popupMode == 2) {
      const cookie = wx.getStorageSync('temp_session_key')
      if (inputCaptcha != "" && cookie) {
        var headers = {
          'content-type': 'application/json',
          'Accept': 'application/json'
        }
        headers.Cookie = cookie
        var that = this
        wx.request({
          url: 'https://davidp.top/api/renew/captcha/',
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
                  // 
                  break
                case 2:
                  // can't renew
                  break
                case -1:
                  //server error
                  break
                case 101:
                  // 验证码错误
                  that.renewCaptchaUpdate()
                  break
                case 102:
                  that.popupCancel()
                  break
                default:
                // unkonwn login error
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
    }
    else {
      this.popupCancel()
    }
  },
  popupCancel: function () {
    this.setData({
      popup: {
        popupHidden: true,
        base64ImgUrl: null
      },
      popupCaptcha: "",
      // popupMode: 0
    })
  },

  renewTap: function() {
    var content = e.currentTarget.dataset.content
    if (content.book_renew_times != 0) {
      // already renewed
      return
    }
    const cookie = wx.getStorageSync('session_key')
    if (cookie) {
      this.setData({
        isTips: true
      })
      var headers = {
        'content-type': 'application/json',
        'Accept': 'application/json'
      }
      headers.Cookie = cookie
      var that = this
      wx.request({
        url: 'https://davidp.top/api/renew/',
        header: headers,
        method: 'POST',
        data: {
          bookid: content.book_id
        },
        dataType: 'json',
        success: function (res) {
          if (res.statusCode == 200) {
            if (res.data.status == 0) {
              // msgbox: success
            }
            else if (res.data.status == 1) {
              wx.setStorageSync('temp_session_key', res.header['Set-Cookie'])
              var base64Data = res.data.captcha
              base64Data = wx.arrayBufferToBase64(wx.base64ToArrayBuffer(base64Data))
              const base64ImgUrl = "data:image/png;base64," + base64Data
              that.setData({
                popupMode: 2,
                currentContent: content
              })
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
      this.setData({
        isTips: false
      })
      // not login
    }
  },
  renewCaptchaUpdate: function() {

    var content = this.data.currentContent
    if (content.book_renew_times != 0) {
      // already renewed
      return
    }
    const cookie = wx.getStorageSync('session_key')
    if (cookie) {
      this.setData({
        isTips: true
      })
      var headers = {
        'content-type': 'application/json',
        'Accept': 'application/json'
      }
      headers.Cookie = cookie
      var that = this
      wx.request({
        url: 'https://davidp.top/api/renew/',
        header: headers,
        method: 'POST',
        data: {
          bookid: content.book_id
        },
        dataType: 'json',
        success: function (res) {
          if (res.statusCode == 200) {
            if (res.data.status == 0) {
              // msgbox: success
            }
            else if (res.data.status == 1) {
              wx.setStorageSync('temp_session_key', res.header['Set-Cookie'])
              var base64Data = res.data.captcha
              base64Data = wx.arrayBufferToBase64(wx.base64ToArrayBuffer(base64Data))
              const base64ImgUrl = "data:image/png;base64," + base64Data
              that.setData({
                popupMode: 2
              })
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
      this.setData({
        isTips: false
      })
      // not login
    }
  },


  commomModal: function ( content) {
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
