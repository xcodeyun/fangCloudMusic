<template>
  <div id="app">
    <!-- 背景图 -->
    <div id="bg">
      <img src="./assets/bg/bg.jpg" alt />
    </div>
    <!-- 页面内容主体 -->
    <div id="main">
      <!-- 头部 -->
      <div id="header">
        <music-header></music-header>
      </div>
      <!-- 页面 -->
      <div id="page">
        <router-view></router-view>
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
};
</script>

<style lang="less">
@import url("./lib/less/global/common.less");
@import url("./lib/less/global/app.less");
</style>
