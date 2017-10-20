import Vue from 'vue'
const home = {
    // 获取列表
    hotLists: function hotLists(ip, postdata) {
        var ipStr = ip + '/' + postdata.openid
        return Vue.http.get(ipStr, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    userLists: function userLists(ip, postdata) {
        var ipStr = ip + '/' + postdata.openid
        return Vue.http.get(ipStr, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    },
    addHots: function addHots(ip, postdata) {
        var ipStr = ip + '/' + postdata.openid + '/' + postdata.spotid
        return Vue.http.get(ipStr, postdata).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.body)
            } else {
                return Promise.reject(response.data.message)
            }
        })
    }
}

export default home
