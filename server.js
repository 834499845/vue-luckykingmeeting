/**
 * Created by LangK on 2016/12/20.
 */
var path = require('path')
var express = require('express')
var bodyParser = require('body-parser')
var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(express.static(path.join(__dirname, '/dist/')))

var mongoose = require('./db.js')

var huiyi = mongoose.model("huiyis", {
  name: String,
  txt: String, // 备注
  site: String, // 地点
  ctime: Number, // 开始时间
  etime: Number // 结束时间
});


// 预约列表
app.post('/list', function (req, res) {
  var num = Number(req.body.no)
  var page = Number(req.body.page)
  var nowtime = Date();
  var timestamp = Date.parse(nowtime); //以当前时间创建时间戳
  huiyi.count({}, function (err, count) {
    huiyi.find({"etime":{"$gt":Number(timestamp)}}).sort({ "ctime": 1 }).skip((page - 1) * num).limit(num)
      .exec(function (err, data) {
        // console.log('列表', data);
        if (err) {
          console.log(err)
          res.status(200).json({
            'status': 400,
            'data': "读取失败"
          })
        } else {
          res.status(200).json({
            'status': 200,
            'data': data,
            'tatal': data.length
          })
        }
      })
  })

})
// 预约
app.post('/homeadd', function (req, res) {
  var ccc = Number(req.body.ctime)
  var eee = Number(req.body.etime)
  var huiyiObj = {
    name: req.body.name,
    txt: req.body.txt,
    site: req.body.site,
    etime: eee,
    ctime: ccc
  }
  huiyi.find({ $and: [{ "etime": { "$gte": ccc } }, { "ctime": { "$lte": eee } }, { "site": req.body.site }] })
    .exec(function (err, data) {
      if (err) {
        console.log(err)
      } else {
        // console.log("查询符合时间的", data.length);
        if (data.length > 0) {
          res.status(200).json({
            'status': 207,
            'data': [],
            'msg': '该时段已经被预定'
          })
        } else {
          new huiyi(huiyiObj).save((err) => {
            if (err) {
              res.status(200).json({
                'status': 400,
                'data': [],
                'msg': '预约失败'
              })
            } else {
              res.status(200).json({
                'status': 200,
                'data': [],
                'msg': '预约成功'
              })
            }
          })
        }
      }

    })

})
// 取消预约
app.post('/delyy', function (req, res) {
  huiyi.findByIdAndRemove(req.body.id, function (err) {
    if (err) {
      res.status(200).json({
        'status': 400,
        'data': "删除失败"
      })
    } else {
      res.status(200).json({
        'status': 200,
        'data': "删除成功"
      })
    }
  });
})

app.listen(5050, function () {
  console.log('server start')
})
