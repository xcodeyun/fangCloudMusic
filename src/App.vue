<template>
  <div id="app">
    <!-- 背景图 -->
    <div id="bg">
      <img src="./assets/bg/bg.jpg" alt v-if="!hasLogin" />
      <img :src="userInfo ? userInfo.backgroundUrl : ''" alt v-else />
    </div>
    <!-- 页面内容主体 -->
    <div id="main">
      <!-- 头部 -->
      <div id="header">
        <music-header></music-header>
      </div>
      <!-- 页面 -->
      <div id="mask"></div>
      <div id="page">
        <transition name="routerTRS">
          <router-view></router-view>
        </transition>
      </div>
      <!-- 播放器 -->
      <div id="player">
        <music-player></music-player>
      </div>
    </div>
    <!-- 额外内容窗口(弹窗) -->
  </div>
</template>

<script>
export default {
  components: {
    "music-header": () => import("./components/musicHeader"),
    "music-player": () => import("./components/musicPlayer"),
  },
  created() {
    // 如果本地存储了用户的ID, 那么表示用户曾经已经登陆, 此时就直接根据id获取用户信息
    let uid = localStorage.getItem("cloudMusicUserId");
    if (uid !== null) {
      // 发起请求获取用户信息
      this.$axios({
        url: "/user/detail",
        method: "post",
        data: {
          uid,
        },
      }).then((res) => {
        if (res.data && res.data.profile) {
          this.$store.commit("setUserLoginState", true);
          this.$store.commit("setUserInfo", res.data.profile);
        } else {
          this.$store.commit("setUserLoginState", false);
          this.$store.commit("setUserInfo", null);
        }
      });
    } else {
      // 用户未登录
      this.$store.commit("setUserLoginState", false);
      this.$store.commit("setUserInfo", null);
    }
  },
  computed: {
    hasLogin() {
      return this.$store.state.hasLogin;
    },
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
};
</script>

<style lang="less">
@import url("./lib/less/global/common.less");
@import url("./lib/less/global/app.less");
</style>
