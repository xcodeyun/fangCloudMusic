<template>
  <div id="infoPage">
    <div class="bg">
      <img :src="hasLogin ? userInfo.backgroundUrl : './../asset/bg/bg.jpg'" />
    </div>
    <div class="main" v-if="hasLogin">
      <infopage-header :type="type"></infopage-header>
      <div class="body">
        <infopage-tuijian v-if="type === 'tuijian'" :res="resData" :type="type"></infopage-tuijian>
        <infopage-gedan v-if="type === 'gedan'" :type="type"></infopage-gedan>
        <infopage-paihangbang v-if="type === 'paihangbang'" :type="type"></infopage-paihangbang>
        <infopage-diantai v-if="type === 'diantai'" :type="type"></infopage-diantai>
      </div>
    </div>
    <div class="main" v-else>
      <div class="noLogin" @click="$router.go(-1)">
        请登录后使用该功能
        <br />点击返回
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      resData: null,
    };
  },
  methods: {
    getData() {
      if (this.type === "tuijian") {
        this.$axios({
          url: `/recommend/songs?cookie=${localStorage.getItem(
            "cloudMusicUserCookie"
          )}&timestamp=${new Date().getTime()}`,
        }).then((res) => {
          this.resData = res.data.data.dailySongs;
        });
      }
    },
  },
  created() {
    this.getData();
  },
  mounted() {},
  computed: {
    type() {
      return this.$route.query.type || "";
    },
    userInfo() {
      return this.$store.state.userInfo;
    },
    hasLogin() {
      return this.$store.state.hasLogin;
    },
  },
  filters: {},
  components: {
    "infopage-header": () => import("./../components/infoPage/infoPage_header"),
    "infopage-tuijian": () =>
      import("./../components/infoPage/infoPage_tuijian"),
    "infopage-gedan": () => import("./../components/infoPage/infoPage_gedan"),
    "infopage-paihangbang": () =>
      import("./../components/infoPage/infoPage_paihangbang"),
    "infopage-diantai": () =>
      import("./../components/infoPage/infopage_diantai"),
  },
  watch: {
    $route() {},
  },
};
</script>

<style lang='less' scoped>
@rate: 50;
#infoPage {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: calc(100% - 55rem / @rate);
  overflow: hidden;
}
.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  img {
    display: block;
    width: 375rem / @rate;
    height: 667rem / @rate;
    object-position: center top;
    object-fit: cover;
    filter: blur(8rem / @rate) brightness(85%);
  }
}
.main {
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
  z-index: 99;
  .noLogin {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 14rem / @rate;
    color: #fff;
    text-shadow: 0 0 3rem / @rate #505050;
    text-align: center;
  }
}
.body {
  overflow: hidden;
  height: 100%;
}
</style>