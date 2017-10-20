/**
 * Created by LangK on 2016/12/20.
 */
import Vue from 'vue'
require("../../API/config")
import home from "../assets/requerst/home"
export default {
    // 添加预约
    getAdd({}, postdata) {
        return Vue.http.post('/homeadd', postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 预约列表
    getLists({}, postdata) {
        return Vue.http.post('/list', postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    // 取消预约
    getDelYY({}, postdata) {
        return Vue.http.post('/delyy', postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
}
