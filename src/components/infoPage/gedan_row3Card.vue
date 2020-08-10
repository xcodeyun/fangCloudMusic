<template>
  <div id="gedanRow3Card">
    <div class="img">
      <img :src="res.picUrl || res.coverImgUrl" />
      <div class="count">{{res.playCount | countHandle}}</div>
    </div>
    <div class="text">{{res.name}}</div>
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
  computed: {},
  filters: {
    countHandle(val) {
      let result = val;
      if (result > 10000) result = Math.floor(result / 10000) + "万";
      return result;
    },
  },
  components: {},
  watch: {
    $route() {},
  },
  props: ["res"],
};
</script>

<style lang='less' scoped>
@rate: 50;
#gedanRow3Card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.img {
  width: 115rem / @rate;
  height: 115rem / @rate;
  margin-bottom: 6rem / @rate;
  overflow: hidden;
  border-radius: 10rem / @rate;
  position: relative;
  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .count {
    position: absolute;
    top: 5rem / @rate;
    right: 5rem / @rate;
    color: #fff;
    text-shadow: 0 0 2rem / @rate #505050;
    font-size: 10rem / @rate;
  }
}
.text {
  width: 100%;
  height: 32rem / @rate;
  font-size: 13rem / @rate;
  padding: 0 3rem / @rate;
  color: #fff;
  white-space: normal;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>