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
      playTime: 0,
      allTime: 0,
      index: 0
    },
    // 是否当前处于私人FM中
    isFM: false,
    // 当前播放的音乐所在音乐列表
    musicList: [
      // {
      //   name: "测试1",
      //   src: require("./../assets/media/test.mp3"),
      //   singer: "测试歌手1",
      //   img: "",
      //   id: 0
      // }
    ],
    // 用户是否登录
    hasLogin: false,
    // 用户信息
    userInfo: null,
    // 全局加载开关
    loading: false,
    // FM音乐缓存
    FMstorage: [],
    // 全局歌词弹窗
    globalPopup: {
      show: false,
      id: 0
    }
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
    },
    // 设置用户是否登录
    setUserLoginState(state, val) {
      state.hasLogin = val;
    },
    // 设置用户信息
    setUserInfo(state, val) {
      state.userInfo = Object.assign({}, val);
    },
    // 设置全局加载状态
    setLoading(state, val) {
      state.loading = val;
    },
    // 设置全局待放列表
    setMusicList(state, val) {
      state.musicList = [].concat(val);
    },
    // 设置播放器总时长
    setPlayerAllTime(state, val) {
      let newData = Object.assign({}, state.player);
      newData.allTime = val;
      state.player = newData;
    },
    // 设置是否位于FM中
    setFM(state, val) {
      state.isFM = val;
    },
    // 设置FM缓存
    setFMstorage(state, val) {
      state.FMstorage = [].concat(val);
    },
    // 设置全局歌词弹窗
    setGlobalPopup(state, val) {
      state.globalPopup = Object.assign(val);
    }
  },
  actions: {
  },
  modules: {
  }
})
