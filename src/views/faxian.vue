<template>
  <div id="faxian">
    <!-- 轮播区域 -->
    <div class="swiperArea">
      <music-swiper :list="list"></music-swiper>
    </div>
    <!-- 次标题 -->
    <div class="subheading">
      <div class="subheadingItem">
        <div class="icon">
          <img src="./../assets/icon/meirituijian.png" />
        </div>
        <div class="title">每日推荐</div>
      </div>
      <div class="subheadingItem">
        <div class="icon">
          <img src="./../assets/icon/gedan.png" />
        </div>
        <div class="title">歌单</div>
      </div>
      <div class="subheadingItem">
        <div class="icon">
          <img src="./../assets/icon/paihangbang.png" />
        </div>
        <div class="title">排行榜</div>
      </div>
      <div class="subheadingItem">
        <div class="icon">
          <img src="./../assets/icon/diantai.png" />
        </div>
        <div class="title">电台</div>
      </div>
    </div>
    <!-- 推荐歌曲 -->
    <div class="tuijianArea" v-if="tuijian.length !== 0">
      <div class="title">
        <div class="title_left">推荐歌曲</div>
        <div class="title_right">播放全部</div>
      </div>
      <ul class="tuijian">
        <music-list-card :list="tuijian"></music-list-card>
      </ul>
    </div>
    <!-- 发现好歌单 -->
    <div class="songListArea" v-if="songList.length !== 0">
      <div class="title">
        <div class="title_left">发现好歌单</div>
        <div class="title_right">查看更多</div>
      </div>
      <ul class="songList">
        <li v-for="(item, index) in songList" :key="index">
          <music-card :musicData="item"></music-card>
        </li>
      </ul>
    </div>
    <!-- 新歌列表 -->
    <div class="jinquArea" v-if="xinge.length !== 0">
      <div class="title">
        <div class="title_left">新歌放送</div>
        <div class="title_right">播放全部</div>
      </div>
      <ul class="xinge">
        <music-list-card :list="xinge"></music-list-card>
      </ul>
    </div>
    <!-- 热门歌手 -->
    <div class="singerArea">
      <div class="title">
        <div class="title_left">热门歌手</div>
        <div class="title_right">查看更多</div>
      </div>
      <ul class="singerList">
        <li v-for="(item, index) in singer" :key="index">
          <singer-card :res="item"></singer-card>
        </li>
      </ul>
    </div>
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
    };
  },
  methods: {
    // 获取推荐歌曲列表
    getTuijian() {
      // 需要用户已经登陆后才可以访问该接口, 否则该接口会报错
      // let data = JSON.parse(sessionStorage.getItem("getTuijian"));
      // if (data !== null && data !== "null") return (this.tuijian = data);
      // this.$axios({ url: "/recommend/songs" }).then((res) => {
      //   console.log(res);
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
  computed: {},
  filters: {},
  components: {
    "music-swiper": () => import("./../components/musicSwiper"),
    "music-card": () => import("./../components/songCard"),
    "music-list-card": () => import("./../components/musicListCard"),
    "singer-card": () => import("./../components/singerCard"),
  },
  watch: {
    $route() {},
  },
};
</script>

<style lang='less' scoped>
@import url("./../lib/less/viewLess/faxian.less");
</style>