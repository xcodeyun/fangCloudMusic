<template>
  <div id="infoPageCard" @click="playSing(item.id)">
    <div class="rowCardImg">
      <img :src="item.al.picUrl" />
    </div>
    <div class="rowCardInfo">
      <div class="title">{{item.name}}</div>
      <div class="artical">{{item.ar[0].name}}&nbsp;&nbsp;{{item.al.name}}</div>
    </div>
    <div class="play">
      <img src="./../../assets/icon/play.png" />
    </div>
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
      let res = await this.$tool.getMusicUrl(id).catch((res) => {
        Toast({
          message: "该歌曲暂不可播放",
        });
        let player = this.$store.state.player;
        player.src = null;
        this.$store.commit("setPlayer", player);
      });
      this.addSong(res);
      this.$store.commit("setLoading", false);
    },
    addSong(res) {
      if (res) {
        let player = Object.assign({}, this.$store.state.player);
        player.src = res[0].data[0].url;
        player.name = res[1].songs[0].name;
        player.singer = res[1].songs[0].ar[0].name;
        player.img = res[1].songs[0].al.picUrl;
        player.play = true;
        this.$store.commit("setPlayer", player);
        this.$emit("addSongList", this.index);
      }
    },
  },
  created() {},
  mounted() {},
  computed: {
    loading() {
      return this.$store.state.loading;
    },
  },
  filters: {},
  components: {},
  watch: {
    $route() {},
  },
  props: ["item", "index"],
};
</script>

<style lang='less' scoped>
@rate: 50;
#infoPageCard {
  height: 100%;
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease;
  .rowCardImg {
    width: 50rem / @rate;
    height: 50rem / @rate;
    border-radius: 8rem / @rate;
    overflow: hidden;
    margin-right: 20rem / @rate;
    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .rowCardInfo {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    .title {
      font-size: 16rem / @rate;
      color: #fff;
      width: 240rem / @rate;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .artical {
      width: 240rem / @rate;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      text-indent: 0.2em;
      font-size: 12rem / @rate;
      color: #eeeeee;
      margin-top: 6rem / @rate;
    }
  }
  .play {
    width: 35rem / @rate;
    height: 35rem / @rate;
    border-radius: 50%;
    border: 1rem / @rate solid rgba(255, 255, 255, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      display: block;
      width: 15rem / @rate;
      height: 15rem / @rate;
    }
  }
}
</style>