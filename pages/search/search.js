Page({
  data: {
    inputValue: null,
    contents: [],
    currentPage: 0,
    isLoading: true,
  },
  bindinput: function(input) {
    this.setData({
        inputValue: input.detail.value
      })
  },
  bindconfirm: function () {
    console.log("Search Starting. first load...") 
    let {contents } = this.data
    var that = this
    this.getJson().then(function (data) {
      that.setData(
        {
          contents: contents.concat(data),
          isLoading: false,
          currentPage: 1,
        }
      )
    }).catch(function (info) {
      console.log('ERROR:' + info)
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
    this.getJson().then(function (data) {
      that.setData(
        {
          contents: contents.concat(data),
          currentPage: currentPage + 1,
          isLoading: false,
        }
      )
    }).catch(function (info) {
      console.log('ERROR:' + info)
    })
  },
  getJson: function() {
    return new Promise((resolve, reject) => {
      var jsonObj
      let{inputValue, currentPage} = this.data
      wx.request({
        url: 'https://davidp.top/api/search/',
        method: 'POST',
        dataType: 'json',
        data: {
          keyword: inputValue, //TODO: uncode to unicode
          page: currentPage
        },
        header: {
          'content-type': 'application/json',
          'Accept': 'application/json'
        },
        success: function (res) {//服务器返回数据
          if (res.statusCode == 200) {
            console.log(res.data)
            resolve(res.data)
          } else {
            reject(res.data)          }
        },
        error: function (e) {
          reject('网络出错')
        }
          //TODO: 加载错误反馈
      })
    })
  // !important 从服务器接收数据无需JSON.parse，因为wx.request 的 dataType默认为 json，会在获得数据后自动进行一次JSONparse。
  }

})
