var mongoose = require("mongoose")
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://192.168.1.216:27017/yuyue")
var db = mongoose.connection

db.on("error", (err) => {
    console.error("数据库连接失败", err);
})
db.on("open", () => {
    console.log("打开数据库成功！");
})

module.exports = mongoose

