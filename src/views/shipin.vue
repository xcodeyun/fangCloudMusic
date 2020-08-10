<template>
  <div id="shipin">
    <!-- 水平滑动导航栏 -->
    <!-- 内容区域 -->
    <mt-loadmore :top-method="loadTop" ref="loadmore" :maxDistance="50" :topDistance="45">
      <ul class="videoList">
        <li v-for="(item,index) in mvList" :key="index" @click="goMv(item.id)">
          <div class="box">
            <div class="img">
              <img :src="item.cover" />
            </div>
            <div class="playBtn">
              <img src="./../assets/icon/playVideo.png" />
            </div>
            <div class="time">{{item.duration | time}}</div>
            <div class="playCount">{{item.playCount | playCount}}</div>
          </div>
          <div class="name">{{item.name}}</div>
          <div class="artical">by {{item.artistName}}</div>
        </li>
      </ul>
      <div class="bottomLoad" @click="loadBottom" v-if="!bottomReq">点击加载更多&nbsp;▼</div>
      <div class="bottomLoad" v-else>
        <mt-spinner type="snake"></mt-spinner>
      </div>
      <div slot="top" class="mint-loadmore-top">
        <span v-show="topStatus === 'drop'" class="continueDrop">继续下拉触发刷新</span>
        <span v-show="topStatus === 'loading'" class="loading">加载中</span>
      </div>
    </mt-loadmore>
    <!-- 视频弹窗 -->
    <transition name="video">
      <video-popup :item="res" v-if="showVideoPopup" @close="close" @goMv="goMv"></video-popup>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: -10,
      area: "全部",
      order: "上升最快",
      mvList: null,
      topStatus: "drop",
      limit: 10,
      bottomReq: false,
      showVideoPopup: false,
      res: null,
      id: 0,
    };
  },
  methods: {
    // 关闭弹出层回调
    close() {
      this.showVideoPopup = false;
    },
    // 底部点击更新
    async loadBottom() {
      this.bottomReq = true;
      let mv = await this.getMvData();
      this.mvList = this.mvList.concat(mv.data.data);
      this.bottomReq = false;
    },
    // 前往MV
    goMv(id) {
      this.id = id;
    },
    // 下拉刷新
    async loadTop() {
      this.topStatus = "loading";
      let mv = await this.getMvData();
      this.mvList = [].concat(mv.data.data);
      this.topStatus = "drop";
      this.$refs.loadmore.onTopLoaded();
    },
    // 获取mv
    getMvData() {
      return this.$axios({
        url: `/mv/all?area=${this.area}&order=${this.order}&limit=${
          this.limit
        }&offset=${(this.page += this.limit)}`,
      });
    },
    // 重置MvList
    async resetMvData(fn) {
      this.page = -10;
      let mv = await this.getMvData();
      this.mvList = [].concat(mv.data.data);
      if (fn) fn();
    },
  },
  async created() {
    // 初始化视频数据
    this.resetMvData();
  },
  mounted() {},
  computed: {},
  filters: {
    time(val) {
      let month = Math.floor(val / 1000 / 60);
      month = month > 10 ? month : "0" + month;
      let playCountHandle = Math.floor((val - month * 60 * 1000) / 1000);
      playCountHandle =
        playCountHandle > 10 ? playCountHandle : "0" + playCountHandle;
      return `${month}:${playCountHandle}`;
    },
    playCount(val) {
      if (val > 10000) {
        return Number(Number(val / 10000).toFixed(3)) + "万";
      } else {
        return val;
      }
    },
  },
  components: {
    "video-popup": () => import("./../components/videoPopup"),
  },
  watch: {
    $route() {},
    id(val) {
      if (val !== 0) {
        this.$axios({
          url: `/mv/detail?mvid=${val}`,
        }).then((res) => {
          this.$axios({
            url: `/mv/url?id=${val}`,
          }).then((init) => {
            res.data.data.url = init.data.data.url;
            this.res = res.data.data;
            this.showVideoPopup = true;
          });
        });
      }
    },
  },
};
</script>

<style lang='less' scoped>
@import url("./../lib/less/viewLess/shipin.less");
</style>