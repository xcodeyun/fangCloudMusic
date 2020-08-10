<template>
  <div id="musicListCard">
    <mt-swipe :show-indicators="false" :auto="0" v-if="handle.length !== 0">
      <mt-swipe-item v-for="(item, index) in handle" :key="index">
        <div
          class="cardList"
          v-for="(initItem, initIndex) in item"
          :key="initIndex"
          @click="playTheSong(initItem.id)"
        >
          <div class="img">
            <img :src="initItem.picUrl" />
          </div>
          <div class="title">{{initItem.name}}</div>
          <div class="playIcon">
            <img src="./../assets/icon/play_full.png" />
          </div>
        </div>
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
    async playTheSong(id) {
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
      player.index = 0;
      this.$store.commit("setPlayer", player);
      this.addListToLocal(res);
    },
    // 添加歌单歌曲到待放列表
    async addListToLocal(res) {
      let arr = [];
      let singer = "";
      for (let i = 0; i < res[1].songs[0].ar.length; i++) {
        singer +=
          i !== 0
            ? "/" + res[1].songs[0].ar[i].name
            : res[1].songs[0].ar[i].name;
      }
      let data = {
        src: res[0].data[0].url,
        name: res[1].songs[0].name,
        singer,
        img: res[1].songs[0].al.picUrl,
        id: res[1].songs[0].al.id,
      };
      arr.push(data);
      this.$store.commit("setMusicList", arr);
    },
  },
  created() {},
  mounted() {},
  computed: {
    handle() {
      let result = [];
      let arr = [];
      for (let i = 0; i < this.list.length; i++) {
        if (i % 3 == 0 && i != 0) {
          result.push(arr);
          arr = [];
        }
        arr.push(this.list[i]);
      }
      return result;
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
#musicListCard {
  height: 100%;
}
.mint-swipe-item {
  display: flex !important;
  height: 100%;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
}
.cardList {
  width: 100%;
  height: 55rem / @rate;
  display: flex;
  align-items: center;
  .img {
    height: 55rem / @rate;
    width: 55rem / @rate;
    border-radius: 10rem / @rate;
    overflow: hidden;
    img {
      display: block;
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }
  .title {
    flex: 1;
    padding: 0 6rem / @rate;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14rem / @rate;
    color: #fff;
    text-shadow: 0 0 3rem / @rate #505050;
  }
  .playIcon {
    width: 30rem / @rate;
    height: 30rem / @rate;
    border: 1rem / @rate solid #fff;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10rem / @rate;
    img {
      display: block;
      width: 15rem / @rate;
      height: 15rem / @rate;
    }
  }
}
</style>