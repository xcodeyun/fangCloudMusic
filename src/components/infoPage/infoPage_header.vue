<template>
  <div id="infoPage_header">
    <div class="back" @click="$router.go(-1)">
      <img src="./../../assets/icon/back.png" />
    </div>
    <div class="title">{{title}}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
  created() {},
  mounted() {},
  computed: {
    title() {
      if (this.type === "tuijian") {
        return "每日推荐";
      } else if (this.type === "gedan") {
        return "歌单";
      } else if (this.type === "paihangbang") {
        return "排行榜";
      } else if (this.type === "diantai") {
        return "电台";
      }
      return "";
    },
  },
  filters: {},
  components: {},
  watch: {
    $route() {},
  },
  props: ["type"],
};
</script>

<style lang='less' scoped>
@rate: 50;
#infoPage_header {
  height: 60rem / @rate;
  padding: 0 12rem / @rate;
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.4);
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  .back {
    width: 40rem / @rate;
    height: 40rem / @rate;
    padding: 10rem / @rate;
    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .title {
    font-size: 18rem / @rate;
    text-shadow: 0 0 3rem / @rate #505050;
    color: #ffffff;
    margin: 0 13rem / @rate;
  }
}
</style>