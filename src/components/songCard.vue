<template>
  <div id="songCard" v-if="musicData">
    <div class="img">
      <img :src="musicData.picUrl" />
      <div class="playCount">
        <img src="./../assets/icon/play.png" />
        <span>{{musicData.playCount|playCountFilter}}</span>
      </div>
    </div>
    <div class="title">{{musicData.name}}</div>
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
    playCountFilter(val) {
      if (val > 10000) {
        return Math.round(val / 10000) + "万";
      } else {
        return val;
      }
    },
  },
  components: {},
  watch: {
    $route() {},
  },
  props: {
    musicData: {
      type: Object,
      default: function () {
        return {
          name: "...",
          picUrl: "#",
          playCount: "...",
          id: "000000",
        };
      },
    },
  },
};
</script>

<style lang='less' scoped>
@rate: 50;
#songCard {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  .img {
    width: 120rem / @rate;
    height: 120rem / @rate;
    border-radius: 10rem / @rate;
    overflow: hidden;
    position: relative;
    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .playCount {
      position: absolute;
      right: 5rem / @rate;
      top: 3rem / @rate;
      display: flex;
      align-items: center;
      img {
        width: 14rem / @rate;
        height: 14rem / @rate;
      }
      span {
        margin-left: 3rem / @rate;
        font-size: 12rem / @rate;
        color: #fff;
        text-shadow: 0 0 3rem / @rate #505050;
      }
    }
  }
  .title {
    width: 120rem / @rate;
    height: 36rem / @rate;
    line-height: 1.5;
    color: #fff;
    font-size: 12rem / @rate;
    text-shadow: 0 0 3rem / @rate #505050;
    white-space: normal;
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
  }
}
</style>