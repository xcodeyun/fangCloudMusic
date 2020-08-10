<template>
  <div id="musicSwiper" ref="bannerBox" v-if="showBanner !== 0">
    <!-- 完成轮播图 -->
    <mt-swipe :auto="4000">
      <mt-swipe-item v-for="(item, index) in list" :key="index">
        <img :src="item.imageUrl" class="imgItem" @click="playSing(item.encodeId)" />
      </mt-swipe-item>
    </mt-swipe>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
export default {
  data() {
    return {};
  },
  methods: {
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
  },
  created() {},
  mounted() {},
  computed: {
    showBanner() {
      return this.list.length;
    },
    loading() {
      return this.$store.state.loading;
    },
  },
  filters: {},
  components: {},
  watch: {
    $route() {},
  },
  props: ["list"],
};
</script>

<style lang='less' scoped>
@rate: 50;
#musicSwiper {
  height: 100%;
  width: 100%;
}
.imgItem {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>