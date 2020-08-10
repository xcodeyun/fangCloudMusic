<template>
  <div id="infoPage_tuijian">
    <div class="top">
      <div class="time">
        <span class="mon">{{month}}</span>
        /
        <span class="day">{{day}}</span>
      </div>
    </div>
    <div class="body">
      <div class="playAll" @click="playAllSong">
        <div class="img">
          <img src="./../../assets/icon/play_full.png" />
        </div>
        <span>播放全部</span>
      </div>
      <!-- 歌曲列表 -->
      <div class="songList">
        <div class="songItem" v-for="(item, index) in res" :key="index">
          <musiclistcar :item="item" @addSongList="addSongList" :index="index"></musiclistcar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      idarr: null,
    };
  },
  methods: {
    // 如果选择听其中的一首歌曲, 那么就将整个歌单添加到待放列表中, 有bug, 待修复, 加不进去
    addSongList(index) {
      console.log(index);
      if (this.res === null || this.idarr === null) return;
      let arr = [];
      for (let i = 0; i < this.res.length; i++) {
        let singer = this.res[i].ar;
        if (singer.length > 1) {
          let str = "";
          for (let k = 0; k < singer.length; k++) {
            str += k == 0 ? singer[k].name : "/" + singer[k].name;
          }
          singer = str;
        } else {
          singer = this.res[i].ar[0].name;
        }
        let data = {
          name: this.res[i].al.name,
          id: this.res[i].al.id,
          img: this.res[i].al.picUrl,
          src: this.idarr[i].url,
          singer,
        };
        arr.push(data);
      }
      this.$store.commit("setMusicList", arr);
      // 切换当前播放的index
      let player = Object.assign({}, this.$store.state.player);
      player.index = index;
      this.$store.commit("setPlayer", player);
    },
    // 播放全部
    playAllSong() {
      this.playSing(this.res[0].id);
    },
    // 播歌
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
  async created() {
    // 获取所有的歌曲src
    if (this.res) {
      let arr = [];
      for (let i = 0; i < this.res.length; i++) {
        arr.push(this.res[i].al.id);
      }
      arr = arr.join(",");
      let data = await this.$axios({
        url: `/song/url?id=${arr}`,
      });
      this.idarr = data.data.data;
      console.log(data);
    }
  },
  mounted() {},
  computed: {
    month() {
      let date = new Date();
      let month =
        date.getMonth() + 1 > 10
          ? date.getMonth() + 1
          : "0" + (date.getMonth() + 1);
      return month;
    },
    day() {
      let date = new Date();
      let day = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
      return day;
    },
  },
  filters: {},
  components: {
    musiclistcar: () => import("./infoPage_card"),
  },
  watch: {
    $route() {},
  },
  props: ["res", "type"],
};
</script>

<style lang='less' scoped>
@rate: 50;
#infoPage_tuijian {
  padding-top: 60rem / @rate;
  overflow: hidden;
}
.top {
  background-color: rgba(255, 255, 255, 0.4);
  font-size: 27rem / @rate;
  color: #f1f1f1;
  padding: 16rem / @rate 20rem / @rate;
  text-shadow: 0 0 3rem / @rate #505050;
  position: relative;
  .mon {
    font-size: 54rem / @rate;
    font-weight: bold;
    color: #fff;
    letter-spacing: 3rem / @rate;
    text-shadow: 0 0 3rem / @rate #505050;
  }
  .day {
    font-size: 27rem / @rate;
    color: #f1f1f1;
    letter-spacing: 3rem / @rate;
    text-shadow: 0 0 3rem / @rate #505050;
  }
  &::after,
  &::before {
    content: "";
    display: block;
    position: absolute;
    bottom: 0;
    transform: translateY(50%);
    width: 6rem / @rate;
    height: 20rem / @rate;
    border-radius: 20rem / @rate;
    background-color: #fff;
  }
  &::before {
    left: 40rem / @rate;
  }
  &::after {
    right: 40rem / @rate;
  }
}
.body {
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.1);
  .playAll {
    height: 65rem / @rate;
    padding: 0 20rem / @rate;
    display: flex;
    align-items: center;
    .img {
      width: 30rem / @rate;
      height: 30rem / @rate;
      border: 1.5rem / @rate solid #fff;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 20rem / @rate;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        display: block;
        width: 12rem / @rate;
        height: 12rem / @rate;
      }
    }
    span {
      font-size: 14rem / @rate;
      color: #fff;
    }
  }
}
.songList {
  height: 667rem / @rate - 225rem / @rate - 55rem / @rate;
  width: 100%;
  overflow-y: auto;
  .songItem {
    height: 60rem / @rate;
    padding: 0 12rem / @rate;
    margin-bottom: 12rem / @rate;
    transition: background-color 0.3s ease;
    &:active {
      background-color: rgba(0, 0, 0, 0.3);
    }
  }
}
</style>