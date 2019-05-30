// roomBooking.js
Page({
  data: {
    // optionsDate:0,
    // optionsRoom:0,
    // optionsStart:0,
    // optionsEnd:0,
    roomName: "",
    startIndex: 0,
    endIndex: 13,    // 22-8
    dateIndex: 0,
    timeArray: ["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
      "18:00", "19:00", "20:00", "21:00", "22:00"],
    // slice timeArray[] to get startTimeArray and endTimeArray
    startTimeArray: ["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
      "18:00", "19:00", "20:00", "21:00"],
    endTimeArray: ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
      "18:00", "19:00", "20:00", "21:00", "22:00"],
    dateArray: null,
  },
  onLoad: function (options) {
    this.setData(
      {
        dateIndex: options.date,
        roomName: options.room,
        startIndex: this.data.startTimeArray.indexOf(options.start + ":00"),
      }
    )
    this.setData({
      endTimeArray: this.data.timeArray.slice(this.data.startIndex + 1),
    })
    this.setData({
      endIndex: this.data.endTimeArray.indexOf(options.end + ":00"),
    })
    this.setData({
      startTimeArray: this.data.timeArray.slice(0, this.data.endIndex + 14 - this.data.endTimeArray.length + 1)
    })
    
    
  },
  onShow: function (options) {
    var timeStamp = Date.parse(new Date());
    var secondPerDay = 24 * 60 * 60;
    var result = [];
    for (var i = 0; i < 7; i += 1) {
      result.push(this.getDateFromStamp(timeStamp + i * secondPerDay * 1000))
    }
    this.setData({
      dateArray: result,
    })
  },
  getDateFromStamp: function (timeStamp) {
    var date = new Date(timeStamp);
    var year = date.getFullYear();
    var month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return year + "-" + month + "-" + day;
  },
  startPickerChange: function (picker) {
    var index =  parseInt(picker.detail.value)
    var timeArray = this.data.timeArray
    var newIndex = this.data.endIndex + (14 - this.data.endTimeArray.length - index)  //括号内为索引位移量
    // if(newIndex < 0) {
    //   newIndex = 0
    // }
    this.setData(
      {
        startIndex: index,
        endTimeArray: timeArray.slice(index + 1),
        endIndex: newIndex,
      },
    )
  },

  endPickerChange: function (picker) {
    var index = parseInt(picker.detail.value)
    var timeArray = this.data.timeArray
    this.setData(
      {
        endIndex: index,
        startTimeArray: timeArray.slice(0, index + 14 - this.data.endTimeArray.length + 1)
      }
    )
  },

  datePickerChange: function (picker) {
    var index = parseInt(picker.detail.value)
    this.setData({
      dateIndex: index,
    })
  },
  bindtap: function () {  // confirm?
    var date = this.data.dateIndex
    var startTime = this.data.startTimeArray[this.data.startIndex].slice(0, -3)  // - means reverse
    var endTime = this.data.endTimeArray[this.data.endIndex].slice(0, -3)
    var that = this 
    // fixme headers  
    wx.request({
      url: 'https://davidp.top/api/roombooking/', 
      data: {
        room: that.data.roomName,
        date: date,
        start: parseInt(startTime),
        end: parseInt(endTime)
      },
      header: {
        'content-type': 'application/json',
        'Accept': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        if (res.statusCode == 200) {
          switch (res.data.status) {
            case 0:
              that.commomModal("预订成功")
              break
            case 1:
              that.commomModal("该时段已被占用")
              break
            case 2:
              that.commomModal("无法申请到网站Cookie，请稍后再试")
              break
            case 3:
              that.commomModal("帐号异常，请重新登录")
              break
            default:
              that.commomModal("服务器维护中")
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
})

