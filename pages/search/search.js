Page({
  data: {
    inputValue: null,
    contents: [],
    currentPage: 0,
    currentId: 0,
    isLoading: true,
  },
  bindinput: function(input) {
    this.setData({
        inputValue: input.detail.value
      })
  },
  bindconfirm: function () {
    console.log("Search Starting. first load...") 
    var that = this
    that.setData({
      currentPage: 0,
    })
    this.getJson().then((data) => {
      if (data.length == 0) {
        this.commomModal("该关键词下没有搜索到图书")
      }
      for(var i = 0; i < data.length; i++) {
        data[i]['id'] = i + this.data.currentPage * 10

      }
      that.setData(
        {
          contents: data,
          isLoading: false,
          currentPage: 1,
        }
      )
    }).catch((info) => {
      this.commomModal(info)
    })
  },
  onReachBottom: function() {
    console.log("reach bottom. loading...")
    let { currentPage, isLoading, contents} = this.data
    var that = this
    if (isLoading) {
      return
    }
    this.setData({
      isLoading: true
    })
    this.getJson().then((data) => {
      for (var i = 0; i < 10; i++) {
        data[i]['id'] = i + this.data.currentPage * 10
      }
      that.setData(
        {
          contents: contents.concat(data),
          currentPage: currentPage + 1,
          isLoading: false,
        }
      )
    }).catch((info) => {
      this.commomModal(info)
    })
  },
  // 搜索到尾页，给出提示
  getJson: function() {
    // 亦可写成异步，setData写在异步函数内。
    return new Promise((resolve, reject) => {
      var jsonObj
      let{inputValue, currentPage} = this.data
      
      wx.request({
        url: 'https://davidp.top/api/search/',
        method: 'POST',
        dataType: 'json',
        data: {
          keyword: inputValue, //TODO: decode to unicode
          page: currentPage
        },
        header: {
          'content-type': 'application/json',
          'Accept': 'application/json'
        },
        success: function (res) {
          if (res.statusCode == 200) {
            resolve(res.data)
          } else {
            reject("服务器维护中")          
          }
        },
        error: function (e) {
          reject('请检查网络连接')
        }
          //TODO: 加载错误反馈
      })
    })
  // !important 从服务器接收数据无需JSON.parse，因为wx.request 的 dataType默认为 json，会在获得数据后自动进行一次JSONparse。
  },
  moreInfo: function(e) {
    var id = e.currentTarget.dataset.id
    this.setData({
      currentId: id
    })
    this.getMoreInfo(this.data.contents[id].href)
    
  },
  getMoreInfo: function (href) {
    console.log(href)
    var that = this
    wx.request({
      url: 'https://davidp.top/api/searchinfo/',
      data: {
        href: href
      },
      header: {
        'content-type': 'application/json',
        'Accept': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        if (res.statusCode == 200) {
          var tempContents = that.data.contents
          tempContents[that.data.currentId].addition = res.data
          that.setData({
            contents: tempContents
          })
        }
        else {
          that.commomModal("服务器维护中")
        }
      },
      fail: function (res) {
        that.commomModal("请检查网络连接")
      },

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
