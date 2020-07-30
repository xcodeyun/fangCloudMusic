import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 左侧弹出窗口依赖参
    popup: false,
    // 搜索窗口依赖参
    search: false,
    // 播放器公共参数
    player: {
      src: "",
      play: false,
      name: "",
      singer: "",
      img: "",
      playTime: 0
    },
    // 当前播放的音乐所在音乐列表
    musicList: [
      {
        name: "カワキヲアメクカワキヲアメク"
      },
      {
        name: "カワキヲアメクカワキヲアメク"
      },
      {
        name: "カワキヲアメクカワキヲアメク"
      },
      {
        name: "カワキヲアメクカワキヲアメク"
      },
      {
        name: "カワキヲアメクカワキヲアメク"
      },
      {
        name: "カワキヲアメクカワキヲアメク"
      },
      {
        name: "カワキヲアメクカワキヲアメク"
      },
      {
        name: "カワキヲアメクカワキヲアメク"
      },
      {
        name: "カワキヲアメクカワキヲアメク"
      },
      {
        name: "カワキヲアメクカワキヲアメク"
      },
    ]
  },
  mutations: {
    // 左侧弹出窗口更改
    setPopup(state) {
      state.popup = !state.popup;
      console.log("popup属性被修改为 ---> ", state.popup);
    },
    // 搜索窗口更改
    setSearch(state) {
      state.search = !state.search;
      console.log("search属性被修改为 ---> ", state.search);
    },
    // 播放器参数修改
    setPlayer(state, data) {
      state.player = Object.assign({}, data);
    }
  },
  actions: {
  },
  modules: {
  }
})
