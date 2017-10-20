<template>
    <div id="app" class="home">
        <div class="mian">
            <div class="Day">
                <div class="DayLeft">
                    {{timeStr}}
                </div>
                <div class="DayRight" @click="addShowClick">
                    预约
                </div>
            </div>
            <div class="meeting" v-loading="loading" element-loading-text="正在加载中..">
                <ul>
                    <li class="firstLi">
                        <div>人物</div>
                        <div>地点</div>
                        <div>时间</div>
                        <div>备注</div>
                        <div>操作</div>
                    </li>
                    <li class="dataLi" v-for="(item,index) in items">
                        <div>{{item.name | strFun}}</div>
                        <div>{{item.site | siteFun}}</div>
                        <div>
                            <div>
                                {{item.ctime | cwtimeFun}}
                            </div>
                            <div>
                                {{item.ctime | ctimeFun}}
                            </div>
                            <div>
                                {{item.etime | etimeFun}}
                            </div>
                        </div>
                        <div>{{item.txt | strFun}}</div>
                        <div>
                            <small @click="callYYClick(index)">取消预约</small>
                        </div>
                    </li>
                    <li class="nullLi" v-show="nullYY">
                        <div>
                            暂无预约
                        </div>
                    </li>
                    <li class="lastLi">
                        <div class="lastSel">
                            <el-pagination @size-change="handleSizeChange" :current-page="currentPage" @current-change="handleCurrentChange" :page-sizes="[10]"
                                :page-size="pageSizeNum" layout="total, sizes, prev, pager, next" :total="totalNum">
                                </el-pagination>
                        </div>
                        <div class="lastPag">
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <!--添加弹出框-->
        <div :class="{addPopup:isAddPopup,showAdd:isShowAdd}">
            <transition name="slide-fade">
                <div class="addMain" v-show="isAddShow" v-loading.body="adding" element-loading-text="正在添加中..">
                    <div class="addone">
                        <div>预约</div>
                    </div>
                    <div class="addnam">
                        <div>
                            <small></small> 人物：
                        </div>
                        <div>
                            <input type="text" v-model="addName" placeholder="请输入预约人名字">
                        </div>
                    </div>
                    <div class="addtwo">
                        <div>
                            <small>*</small> 地点：
                        </div>
                        <div>
                            <select v-model="selected">
                              <option v-for="option in options" v-bind:value="option.value">
                                  {{ option.text }}
                               </option>
                            </select>
                        </div>
                    </div>
                    <div class="addthr">
                        <div>
                            <small>*</small> 时间：
                        </div>
                        <div>
                            <div>
                                <el-date-picker class="block" @change="dateTimeChange1" v-model="value1" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="会议开始时间">
                                </el-date-picker>
                            </div>
                            <div>
                                <el-date-picker class="block" @change="dateTimeChange2" v-model="value2" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="会议结束时间">
                                </el-date-picker>
                            </div>
                        </div>
                    </div>
                    <div class="addinp">
                        <div>
                            <small></small> 备注：
                        </div>
                        <div>
                            <input type="text" v-model="addTxt" placeholder="请输入备注信息">
                        </div>
                    </div>
                    <div class="addtst">
                        <div>
                            {{tstStr}}
                        </div>
                    </div>
                    <div class="addbut">
                        <div @click="addClick">
                            确认
                        </div>
                        <div @click="callClick">
                            取消
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>
<script>
    import { mapActions, mapState } from 'vuex'
    export default {
        name: 'home',
        data() {
            return {
                timeStr: '',
                tstStr: '带红色*号为必填项',
                pageSizeNum: 10,
                totalNum: 0,
                currentPage: 1,
                isSelLeft: 0,
                items: [
                ],
                isAddPopup: true,
                isShowAdd: true,
                isAddShow: false,
                nullYY: true,
                loading: false,
                adding: false,
                strTimestamp: 0,
                endTimestamp: 0,
                selected: '0',
                options: [
                    { text: '大会议室', value: '0' },
                    { text: '小会议室', value: '1' },
                    { text: '会客室', value: '2' }
                ],
                addTxt: '',
                addName: '',
                value1: '',
                value2: ''
            }
        },
        created: function () {
            var self = this
            self.loading = false
            self.getLists({
                no: self.pageSizeNum,
                page: self.currentPage
            }).then((data) => {
                console.log('预约列表', data)
                self.loading = false
                if (data.status == 200) {
                    if (data.data.length > 0) {
                        self.nullYY = false
                        self.items = data.data
                        self.totalNum = data.tatal
                    } else {
                        self.nullYY = true
                    }
                } else {
                    self.nullYY = true
                }
            }).catch(msg => {
                console.log(msg)
            })
        },
        filters: {
            cwtimeFun: function (val) {
                // 1494916450000
                if (val) {
                    var now = new Date(val)
                    var week = now.getDay()
                    switch (week) {
                        case 0:
                            week = "周天";
                            break;
                        case 1:
                            week = "周一";
                            break;
                        case 2:
                            week = "周二";
                            break;
                        case 3:
                            week = "周三";
                            break;
                        case 4:
                            week = "周四";
                            break;
                        case 5:
                            week = "周五";
                            break;
                        case 6:
                            week = "周六";
                            break;
                        default:
                            break;
                    }
                    var year = now.getYear() - 100;
                    var month = now.getMonth() + 1;
                    month = month > 9 ? month : "0" + month
                    var date = now.getDate();
                    date = date > 9 ? date : "0" + date
                    var hour = now.getHours();
                    hour = hour > 9 ? hour : "0" + hour
                    var minute = now.getMinutes();
                    minute = minute > 9 ? minute : "0" + minute
                    return "20" + year + "-" + month + "-" + date + "  " + week
                } else {
                    return '无'
                }
            },
            ctimeFun: function (val) {
                // 1494916450000
                if (val) {
                    var now = new Date(val)
                    var week = now.getDay()
                    var year = now.getYear() - 100;
                    var month = now.getMonth() + 1;
                    month = month > 9 ? month : "0" + month
                    var date = now.getDate();
                    date = date > 9 ? date : "0" + date
                    var hour = now.getHours();
                    hour = hour > 9 ? hour : "0" + hour
                    var minute = now.getMinutes();
                    minute = minute > 9 ? minute : "0" + minute
                    return hour + "：" + minute;
                } else {
                    return '无'
                }
            },
            etimeFun: function (val) {
                // 1494916450000
                if (val) {
                    var now = new Date(val)
                    var week = now.getDay()
                    var year = now.getYear() - 100;
                    var month = now.getMonth() + 1;
                    month = month > 9 ? month : "0" + month
                    var date = now.getDate();
                    date = date > 9 ? date : "0" + date
                    var hour = now.getHours();
                    hour = hour > 9 ? hour : "0" + hour
                    var minute = now.getMinutes();
                    minute = minute > 9 ? minute : "0" + minute
                    return hour + "：" + minute;
                } else {
                    return '无'
                }
            },
            siteFun: function (val) {
                if (val === '0') {
                    return "大会议室"
                } else if (val === '1') {
                    return "小会议室"
                } else if (val === '2') {
                    return "会客室"
                } else {
                    return '无'
                }
            },
            strFun: function (val) {
                if (val) {
                    return val
                } else {
                    return '无'
                }
            }
        },
        mounted() {
            var self = this
            function showLeftTime() {
                var now = new Date();
                var year = now.getYear() - 100;
                var month = now.getMonth() + 1;
                month = month > 9 ? month : "0" + month
                var day = now.getDate();
                day = day > 9 ? day : "0" + day
                var hours = now.getHours();
                hours = hours > 9 ? hours : "0" + hours
                var minutes = now.getMinutes();
                minutes = minutes > 9 ? minutes : "0" + minutes
                var seconds = now.getSeconds();
                seconds = seconds > 9 ? seconds : "0" + seconds
                var week = now.getDay()
                switch (week) {
                    case 0:
                        week = "周天";
                        break;
                    case 1:
                        week = "周一";
                        break;
                    case 2:
                        week = "周二";
                        break;
                    case 3:
                        week = "周三";
                        break;
                    case 4:
                        week = "周四";
                        break;
                    case 5:
                        week = "周五";
                        break;
                    case 6:
                        week = "周六";
                        break;
                    default:
                        break;
                }
                var helloStr = ''
                if (hours < 6) { helloStr = "凌晨好！" }
                else if (hours < 9) { helloStr = "早上好！" }
                else if (hours < 12) { helloStr = "上午好！" }
                else if (hours < 14) { helloStr = "中午好！" }
                else if (hours < 17) { helloStr = "下午好！" }
                else if (hours < 19) { helloStr = "傍晚好！" }
                else if (hours < 22) { helloStr = "晚上好！" }
                else { helloStr = "夜里好！" }
                self.timeStr = helloStr + "20" + year + "年" + month + "月" + day + "日 " + week + " " + hours + ":" + minutes + ":" + seconds + "";
            }
            setInterval(showLeftTime, 1000);
        },
        methods: {
            // 设置每页个数
            handleSizeChange(val) {
                var self = this;
                self.loading = true
                self.pageSizeNum = val;
                self.currentPage = 1
                self.loading = true
                self.getLists({
                    no: val,
                    page: self.currentPage
                }).then((data) => {
                    console.log('预约列表', data)
                    self.loading = false
                    if (data.status == 200) {
                        if (data.data.length > 0) {
                            self.nullYY = false
                            self.items = data.data
                            self.totalNum = data.tatal
                        } else {
                            self.nullYY = true
                        }
                    } else {
                        self.nullYY = true
                    }
                }).catch(msg => {
                    console.log(msg)
                })
            },
            // 点击分页
            handleCurrentChange(val) {
                var self = this;
                self.loading = true
                self.currentPage = val
                self.getLists({
                    no: self.pageSizeNum,
                    page: val
                }).then((data) => {
                    console.log('预约列表', data)
                    self.loading = false
                    if (data.status == 200) {
                        if (data.data.length > 0) {
                            self.nullYY = false
                            self.items = data.data
                            self.totalNum = data.tatal
                        } else {
                            self.nullYY = true
                        }
                    } else {
                        self.nullYY = true
                    }
                }).catch(msg => {
                    console.log(msg)
                })
            },
            dayClick(index) {
                this.isSelLeft = index
            },
            // 添加页面
            addShowClick() {
                this.isShowAdd = false
                this.isAddShow = true
            },
            dateTimeChange1(val) {
                var strTimestamp = Date.parse(new Date(val))
                this.strTimestamp = Number(strTimestamp)
                console.log(this.strTimestamp)
            },
            dateTimeChange2(val) {
                var endTimestamp = Date.parse(new Date(val))
                this.endTimestamp = Number(endTimestamp)
                console.log(this.endTimestamp)
            },
            // 添加
            addClick() {
                var self = this
                if (self.selected.length > 0 && self.strTimestamp > 0 && self.endTimestamp > 0 && self.endTimestamp > self.strTimestamp) {
                    self.adding = true
                    self.getAdd({
                        name: self.addName,
                        site: self.selected,
                        ctime: self.strTimestamp,
                        etime: self.endTimestamp,
                        txt: self.addTxt
                    }).then((data) => {
                        console.log('预约', data)
                        self.adding = false
                        self.tstStr = '带红色*号为必填项'
                        if (data.status == 200) {
                            console.log('预约成功')
                            self.$message({
                                type: 'info',
                                message: '预约成功'
                            });
                            self.isShowAdd = true
                            self.isAddShow = false
                            self.loading = true
                            self.addName = ''
                            self.addTxt = ''
                            self.selected = '0'
                            self.value1 = ''
                            self.value2 = ''
                            self.getLists({
                                no: self.pageSizeNum,
                                page: self.currentPage
                            }).then((data) => {
                                console.log('预约列表', data)
                                self.loading = false
                                if (data.status == 200) {
                                    if (data.data.length > 0) {
                                        self.nullYY = false
                                        self.items = data.data
                                        self.totalNum = data.tatal
                                    } else {
                                        self.nullYY = true
                                    }
                                } else {
                                    self.nullYY = true
                                }
                            }).catch(msg => {
                                console.log(msg)
                            })

                        } else if (data.status == 207) {
                            self.$message({
                                type: 'info',
                                message: '已被预定'
                            });
                        } else {
                            self.$message({
                                type: 'info',
                                message: '预定失败'
                            });
                        }
                    }).catch(msg => {
                        console.log(msg)
                    })
                } else {
                    if (self.selected.length == 0) {
                        self.tstStr = '会议地点为必填项'
                    } else if (self.strTimestamp == 0) {
                        self.tstStr = '会议开始时间为必填项'
                    } else if (self.endTimestamp == 0) {
                        self.tstStr = '会议结束时间为必填项'
                    } else if (self.endTimestamp <= self.strTimestamp) {
                        self.tstStr = '会议结束时间必须大于开始时间'
                    }
                }
            },
            // 取消
            callClick() {
                this.isShowAdd = true
                this.isAddShow = false
            },
            // 取消预约
            callYYClick(index) {
                var self = this
                var str = ''
                if (self.items[index].site === '0') {
                    str = "大会议室"
                } else if (self.items[index].site === '1') {
                    str = "小会议室"
                } else if (self.items[index].site === '2') {
                    str = "会客室"
                } else {
                    str = '无'
                }
                var nameStr = "此操作将取消 " + str + " 的预约,是否继续 ?"
                self.$confirm(nameStr, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    self.getDelYY({
                        id: self.items[index]._id
                    }).then((data) => {
                        console.log('getDelYY', data)
                        if (data.status == 200) {
                            self.$message({
                                type: 'info',
                                message: '取消预约成功'
                            });
                            self.getLists({
                                no: self.pageSizeNum,
                                page: self.currentPage
                            }).then((data) => {
                                console.log('预约列表', data)
                                self.loading = false
                                if (data.status == 200) {
                                    self.items = data.data
                                    if (data.data.length > 0) {
                                        self.nullYY = false
                                        self.totalNum = data.tatal
                                    } else {
                                        self.nullYY = true
                                    }
                                } else {
                                    self.nullYY = true
                                }
                            }).catch(msg => {
                                console.log(msg)
                            })
                        } else {
                            self.$message({
                                type: 'info',
                                message: '取消失败'
                            });
                        }
                    }).catch(msg => {
                        console.log(msg)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            ...mapActions(['getAdd','getLists','getDelYY'])
        }
    }

</script>
<style scoped>
    #app {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .mian {
        width: 1200px;
        min-height: 700px;
        border: 2px solid rgba(29, 140, 224, 0.3);
        background-color: rgba(254, 255, 245, 0.3);
        border-radius: 4px;
    }
    
    .Day {
        display: flex;
        height: 70px;
        border-bottom: 1px solid rgba(29, 140, 224, 0.5);
        align-items: center;
        overflow: hidden;
        justify-content: space-around;
        font-size: 22px;
    }
    
    .DayLeft {
        display: flex;
        min-width: 200px;
        height: 40px;
        line-height: 40px;
    }
    
    .Day .selLeft {
        background-color: #EFF2F7;
        color: #000;
        border: 1px solid #333;
    }
    
    .DayLeft>div {
        width: 100px;
        height: 40px;
        border: 1px solid #1D8CE0;
        margin-left: 15px;
        text-align: center;
        line-height: 40px;
        border-radius: 3px;
        color: #333;
        cursor: pointer;
    }
    
    .DayRight {
        width: 100px;
        height: 35px;
        line-height: 35px;
        border: 1px solid #1D8CE0;
        text-align: center;
        border-radius: 3px;
        color: #333;
        cursor: pointer;
    }
    
    .meeting {
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        min-height: 610px;
        margin-top: 20px;
    }
    
    .meeting>ul>li {
        display: flex;
        border-bottom: 1px solid #ccc;
        min-height: 40px;
        line-height: 40px;
        overflow: hidden;
        font-size: 14px;
    }
    
    .meeting>ul>li>div {
        border-left: 1px solid #ccc;
        text-align: center;
    }
    
    .meeting>ul>li>div:nth-child(1) {
        border-left: 0;
        width: 10%;
    }
    
    .meeting>ul>li>div:nth-child(2) {
        width: 10%;
    }
    
    .meeting>ul>li>div:nth-child(3) {
        width: 45%;
    }
    
    .meeting>ul>li>div:nth-child(4) {
        width: 25%;
    }
    
    .meeting>ul>li>div:nth-child(5) {
        width: 10%;
    }
    
    .meeting>ul .nullLi {
        width: 100%;
    }
    
    .meeting>ul .dataLi>div:nth-child(3) {
        display: flex;
    }
    
    .meeting>ul .dataLi>div:nth-child(3)>div {
        width: 33%;
        /*border: 1px solid red;*/
    }
    
    .meeting>ul .dataLi>div:nth-child(3)>div:nth-child(2) {
        position: relative;
    }
    
    .meeting>ul .dataLi>div:nth-child(3)>div:nth-child(2):after {
        position: absolute;
        content: "";
        right: -50px;
        top: 19px;
        width: 100px;
        height: 1px;
        /*background-color: #000;*/
        border-top: 1px dashed #000;
    }
    
    .meeting>ul .dataLi>div:nth-child(5) small {
        border: 1px solid #ccc;
        padding: 5px;
        border-radius: 3px;
        color: #333;
        cursor: pointer;
    }
    
    .meeting>ul .nullLi>div:nth-child(1) {
        width: 100%;
        text-align: center;
    }
    
    .meeting>ul .lastLi {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;
        width: 100%;
    }
    
    .meeting>ul .lastLi>div {
        border: 0;
    }
    
    .meeting>ul .lastLi .lastSel {
        width: 530px;
        height: 35px;
        margin-top: 3px;
    }
    
    .meeting>ul .lastLi .lastPag {
        width: 50px;
        height: 35px;
        margin-top: 5px;
    }
    
    .slide-fade-enter-active {
        transition: all 0.7s ease;
    }
    
    .slide-fade-enter,
    .slide-fade-leave-active {
        transform: translateY(-30px);
        opacity: 0;
    }
    /*添加弹出框*/
    
    .addPopup {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.4);
    }
    
    .addMain {
        border: 1px solid #8492a6;
        border-radius: 7px;
        margin: calc((100vh - 460px) / 2) auto;
        width: 600px;
        height: 450px;
        background-color: #fff;
        overflow: hidden;
    }
    
    .addMain>div {
        width: 100%;
        min-height: 30px;
        display: flex;
        align-items: center;
        margin-top: 15px;
    }
    
    .addMain>div small {
        color: red;
    }
    
    .addnam {}
    
    .addnam>div:nth-child(1) {
        width: 100px;
        height: 50px;
        line-height: 50px;
        text-align: right;
    }
    
    .addnam>div:nth-child(2) {
        min-width: 350px;
    }
    
    .addnam>div:nth-child(2) input {
        width: 370px;
        height: 32px;
        border: 1px solid rgb(191, 203, 217);
        line-height: 35px;
        padding-left: 5px;
        border-radius: 3px;
        margin-left: 15px;
        font-size: 16px;
    }
    
    .addMain .addone {
        border-bottom: 1px solid #ccc;
        height: 60px;
        line-height: 60px;
        margin-top: 0;
    }
    
    .addone>div {
        width: 100%;
        font-size: 24px;
        text-align: center;
    }
    
    .addtwo>div {}
    
    .addtwo>div:nth-child(1) {
        width: 100px;
        height: 50px;
        text-align: right;
        line-height: 50px;
    }
    
    .addtwo>div:nth-child(2) {
        min-width: 300px;
    }
    
    .addtwo>div:nth-child(2) select {
        display: block;
        width: 373px;
        height: 34px;
        border: 1px solid rgb(191, 203, 217);
        line-height: 34px;
        padding-left: 5px;
        border-radius: 3px;
        margin-left: 15px;
        font-size: 15px;
    }
    
    .addthr {}
    
    .addthr>div:nth-child(1) {
        width: 100px;
        height: 50px;
        line-height: 50px;
        text-align: right;
    }
    
    .addthr>div:nth-child(2) {
        min-width: 350px;
        display: flex;
    }
    
    .block {
        width: 180px;
        margin-left: 15px;
    }
    
    .addinp {}
    
    .addinp>div:nth-child(1) {
        width: 100px;
        height: 50px;
        line-height: 50px;
        text-align: right;
    }
    
    .addinp>div:nth-child(2) {
        min-width: 350px;
    }
    
    .addinp>div:nth-child(2) input {
        width: 370px;
        height: 32px;
        border: 1px solid rgb(191, 203, 217);
        line-height: 35px;
        padding-left: 5px;
        border-radius: 3px;
        margin-left: 15px;
        font-size: 16px;
    }
    
    .addMain .addtst {
        margin-top: 5px;
        height: 25px;
    }
    
    .addMain .addtst>div:nth-child(1) {
        text-align: center;
        width: 100%;
        color: red;
        font-size: 14px;
    }
    
    .addbut {
        display: flex;
        justify-content: flex-end;
        border-top: 1px solid #ccc;
        height: 80px;
    }
    
    .addbut>div {
        margin-right: 15px;
        text-align: center;
        font-size: 18px;
        width: 80px;
        height: 32px;
        line-height: 32px;
        border-radius: 3px;
        border: 1px solid #1D8CE0;
        cursor: pointer;
    }
    
    .showAdd {
        display: none;
    }
</style>