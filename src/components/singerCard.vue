<template>
  <div id="singerCard" @click="singerInit(res.id)">
    <div class="img">
      <img :src="res.picUrl" />
    </div>
    <div class="info">{{res.name}}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    singerInit(id) {
      console.log("跳转到歌手信息页面 --> ", id);
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
  props: ["res"],
};
</script>

<style lang='less' scoped>
@rate: 50;
#singerCard {
  width: 100%;
  height: 100%;
  position: relative;
  .img {
    height: 100%;
    img {
      display: block;
      height: 100%;
      width: 100%;
      object-fit: cover;
      object-position: center center;
    }
  }
  .info {
    font-size: 13rem / @rate;
    color: #fff;
    font-weight: bold;
    text-shadow: 0 0 3rem / @rate #505050;
    position: absolute;
    right: 0;
    bottom: 0;
    padding: 5rem / @rate 10rem / @rate;
  }
}
</style>