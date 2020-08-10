<template>
  <div id="faxian">
    <!-- 歌单popup -->
    <!-- 歌单详情组件 -->
    <transition name="gedanInfo">
      <gedanInfo v-if="showPopup" :res="showGedanInfoRes" @closePopup="closePopup"></gedanInfo>
    </transition>
    <!-- 轮播区域 -->
    <div class="swiperArea">
      <music-swiper :list="list"></music-swiper>
    </div>
    <!-- 次标题 -->
    <div class="subheading">
      <div class="subheadingItem" @click="goInfoPage('tuijian')">
        <div class="icon">
          <img src="./../assets/icon/meirituijian.png" />
        </div>
        <div class="title">每日推荐</div>
      </div>
      <div class="subheadingItem" @click="goInfoPage('gedan')">
        <div class="icon">
          <img src="./../assets/icon/gedan.png" />
        </div>
        <div class="title">歌单</div>
      </div>
      <div class="subheadingItem" @click="goInfoPage('paihangbang')">
        <div class="icon">
          <img src="./../assets/icon/paihangbang.png" />
        </div>
        <div class="title">排行榜</div>
      </div>
      <div class="subheadingItem" @click="goInfoPage('video')">
        <div class="icon">
          <img src="./../assets/icon/video.png" />
        </div>
        <div class="title">视频</div>
      </div>
    </div>
    <!-- 推荐歌曲 -->
    <div class="tuijianArea" v-if="tuijian.length !== 0">
      <div class="title">
        <div class="title_left">推荐歌曲</div>
        <div class="title_right" @click="allPlay">播放全部</div>
      </div>
      <ul class="tuijian">
        <music-list-card :list="tuijian"></music-list-card>
      </ul>
    </div>
    <!-- 发现好歌单 -->
    <div class="songListArea" v-if="songList.length !== 0">
      <div class="title">
        <div class="title_left">发现好歌单</div>
        <div class="title_right" @click="goInfoPage('gedan')">查看更多</div>
      </div>
      <ul class="songList">
        <li v-for="(item, index) in songList" :key="index" @click="showPopupHandle(item.id)">
          <music-card :musicData="item"></music-card>
        </li>
      </ul>
    </div>
    <!-- 新歌列表 -->
    <div class="jinquArea" v-if="xinge.length !== 0">
      <div class="title">
        <div class="title_left">新歌放送</div>
        <div class="title_right" @click="allPlay">播放全部</div>
      </div>
      <ul class="xinge">
        <music-list-card :list="xinge"></music-list-card>
      </ul>
    </div>
    <!-- 热门歌手 -->
    <!-- <div class="singerArea">
      <div class="title">
        <div class="title_left">热门歌手</div>
        <div class="title_right">查看更多</div>
      </div>
      <ul class="singerList">
        <li v-for="(item, index) in singer" :key="index">
          <singer-card :res="item"></singer-card>
        </li>
      </ul>
    </div>-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      songList: [],
      xinge: [],
      tuijian: [],
      singer: [],
      height: 150,
      width: 340,
      showPopup: false,
      showGedanInfoRes: null,
    };
  },
  methods: {
    // 显示歌单
    async showPopupHandle(id) {
      let res = await this.$axios({
        url: `/playlist/detail?id=${id}&cookie=${
          this.hasLogin ? localStorage.getItem("cloudMusicUserCookie") : ""
        }`,
      });
      this.showGedanInfoRes = res.data.playlist;
      this.showPopup = true;
    },
    // 关闭歌单
    closePopup() {
      this.showPopup = false;
    },
    // 播放全部
    allPlay() {
      if (this.xinge.length !== 0) {
        this.playSing(this.xinge[0].id);
        this.$store.commit("setMusicList", this.xinge);
      }
    },
    // 播歌
    async playSing(id) {
      if (id == 0)
        return Toast({
          message: "该项不是歌曲",
          position: "bottom",
          duration: 2000,
        });
      if (this.loading)
        return Toast({
          message: "加载中,请稍等...",
          position: "bottom",
          duration: 2000,
        });
      this.$store.commit("setLoading", true);
      let player = Object.assign({}, this.$store.state.player);
      let res = await this.$tool.getMusicUrl(id);
      this.addSong(res);
      this.$store.commit("setLoading", false);
    },
    addSong(res) {
      let player = Object.assign({}, this.$store.state.player);
      player.src = res[0].data[0].url;
      player.name = res[1].songs[0].name;
      player.singer = res[1].songs[0].ar[0].name;
      player.img = res[1].songs[0].al.picUrl;
      player.play = true;
      this.$store.commit("setPlayer", player);
    },
    // 跳至内页
    goInfoPage(type) {
      if (type === "video") return this.$router.push("/shipin");
      this.$router.push({
        path: "/infoPage",
        query: {
          type,
        },
      });
    },
    // 获取推荐歌曲列表
    getTuijian() {
      // 需要用户已经登陆后才可以访问该接口, 否则该接口会报错
      // let data = JSON.parse(sessionStorage.getItem("getTuijian"));
      // if (data !== null && data !== "null") return (this.tuijian = data);
      // this.$axios({ url: "/recommend/songs" }).then((res) => {
      //   this.tuijian = res.data.result;
      //   sessionStorage.setItem("getTuijian", JSON.stringify(res.data.result));
      // });
    },
    // 获取热门歌手列表
    getSinger() {
      let data = JSON.parse(sessionStorage.getItem("getSinger"));
      if (data !== null && data !== "null") return (this.singer = data);
      this.$axios({ url: "/top/artists?offset=0" }).then((res) => {
        let result = res.data.artists;
        result = result.splice(0, 12);
        sessionStorage.setItem("getSinger", JSON.stringify(result));
      });
    },
    // 获取新歌列表
    getXinge() {
      let data = JSON.parse(sessionStorage.getItem("getXinge"));
      if (data !== null && data !== "null") return (this.xinge = data);
      this.$axios({ url: "/personalized/newsong?type=1" }).then((res) => {
        this.xinge = res.data.result;
        sessionStorage.setItem("getXinge", JSON.stringify(res.data.result));
      });
    },
    // 获取banner数据
    getBannerData() {
      let data = sessionStorage.getItem("getBannerData");
      if (data === null) {
        this.$axios({ url: "/banner", data: { type: 1 } }).then((res) => {
          this.list = res.data.banners;
          sessionStorage.setItem(
            "getBannerData",
            JSON.stringify(res.data.banners)
          );
        });
      } else {
        this.list = JSON.parse(data);
      }
    },
    // 获取首页-发现好音乐数据
    getGoodsMusic() {
      let data = sessionStorage.getItem("getGoodsMusic");
      if (data === null) {
        this.$axios({
          url: "/personalized?limit=8",
        }).then((res) => {
          this.songList = res.data.result;
          sessionStorage.setItem(
            "getGoodsMusic",
            JSON.stringify(res.data.result)
          );
        });
      } else {
        this.songList = JSON.parse(data);
      }
    },
  },
  async created() {
    await this.getBannerData();
    await this.getGoodsMusic();
    await this.getXinge();
    await this.getSinger();
    await this.getTuijian();
  },
  mounted() {},
  computed: {
    hasLogin() {
      return this.$store.state.hasLogin;
    },
  },
  filters: {},
  components: {
    "music-swiper": () => import("./../components/musicSwiper"),
    "music-card": () => import("./../components/songCard"),
    "music-list-card": () => import("./../components/musicListCard"),
    "singer-card": () => import("./../components/singerCard"),
    gedanInfo: () => import("./../components/infoPage/infoPage_songList"),
  },
  watch: {
    $route() {},
  },
};
</script>

<style lang='less' scoped>
@import url("./../lib/less/viewLess/faxian.less");
</style>