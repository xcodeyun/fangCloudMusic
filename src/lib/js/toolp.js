class Tool {
  constructor(Vue) {
    this.Vue = Vue;
  }

  test() {
    return this.Vue;
  }

  // 获取音乐是否可用
  canPlay(id) {
    return new Promise(resolve => {
      this.Vue.prototype.$axios({
        url: `/check/music?id=${id}`
      }).then(res => {
        resolve(res.data.success);
      })
    })
  }

  // banner获取音乐
  getMusicUrl(id) {
    return new Promise(resolve => {
      let result = [];
      this.Vue.prototype.$axios({
        url: `/check/music?id=${id}`
      }).then(res => {
        if (!res.data.success) return resolve(null);
        this.Vue.prototype.$axios({
          url: `/song/url?id=${id}`
        }).then(
          res2 => {
            if (res2.data) {
              result.push(res2.data);
              this.Vue.prototype.$axios({
                url: `/song/detail?ids=${id}`
              }).then(res3 => {
                if (res3.data) {
                  result.push(res3.data);
                  resolve(result);
                }
                else {
                  resolve(null);
                }
              })
            }
            else resolve(null);
          },
          err => {
            resolve(null);
          })
      }, err => {
        resolve(null);
      })
    })
  }
}

export default Tool;
