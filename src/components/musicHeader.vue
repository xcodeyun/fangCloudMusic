<template>
  <div id="musicHeader">
    <div class="menu" @click="tagglePopup">
      <img src="./../assets/icon/_menu.png" />
    </div>
    <div class="linkBtnList">
      <router-link class="linkBtnItem" tag="div" to="/wode">我的</router-link>
      <router-link class="linkBtnItem" tag="div" to="/faxian">发现</router-link>
      <router-link class="linkBtnItem" tag="div" to="/yuncun">云村</router-link>
      <router-link class="linkBtnItem" tag="div" to="/shipin">视频</router-link>
    </div>
    <div class="search" @click="taggleSearch">
      <img src="./../assets/icon/search.png" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    tagglePopup() {
      this.$store.commit("setPopup");
    },
    taggleSearch() {
      this.$store.commit("setSearch");
    },
  },
  created() {},
  mounted() {},
  computed: {},
  filters: {},
  components: {},
  watch: {
    $route() {},
  },
};
</script>

<style lang='less' scoped>
@import url("./../lib/less/componentsLess/musicHeader.less");
</style>