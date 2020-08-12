<template>
  <div id="bofangye">
    <div class="touxiang">
      <div class="img" v-if="type === 'square'">
        <img :src="item.img || item.album.blurPicUrl || ''" />
      </div>
      <div class="img" v-else>圆形</div>
    </div>
    <div class="info">
      <div class="title">{{item.name || item.album.name || ''}}</div>
      <div class="artical">{{item.singer || item.album.artists[0].name || ''}}</div>
    </div>
    <div class="control">
      <div class="range">
        <div class="left">{{player.playTime | timeHandle}}</div>
        <div class="middle" ref="rangeBox">
          <div class="mask" ref="mask"></div>
          <div class="finishRange" ref="finish"></div>
          <div class="notRange"></div>
        </div>
        <div class="right">{{player.allTime | timeHandle}}</div>
      </div>
      <div class="menu">
        <div class="nolike" @click.stop="nolike">
          <img src="./../assets/icon/like_kong.png" />
        </div>
        <div class="prev" @click.stop="prev">
          <img src="./../assets/icon/prev.png" />
        </div>
        <div class="playBtn" @click.stop="pausePlay">
          <img src="./../assets/icon/pagePlay.png" v-if="!player.play" />
          <img src="./../assets/icon/pagePause.png" v-else />
        </div>
        <div class="next" @click.stop="next">
          <img src="./../assets/icon/next.png" />
        </div>
        <div class="like" @click.stop="like">
          <img src="./../assets/icon/like_kong.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      allTimeFlog: true,
      playTime: 0,
      nextFlog: true,
      src: "",
    };
  },
  methods: {
    // 取消喜欢
    nolike() {
      this.$axios({
        url: `/like?id=${this.item.id}&like=${false}&cookie=${
          this.hasLogin ? localStorage.getItem("cloudMusicUserCookie") : ""
        }`,
      })
        .then((res) => {
          Toast({
            message: "取消喜欢成功",
            position: "bottom",
            duration: 2000,
          });
        })
        .catch((err) => {
          Toast({
            message: "取消喜欢失败",
            position: "bottom",
            duration: 2000,
          });
        });
    },
    // 前一首
    prev() {
      this.$emit("prev");
    },
    // 下一首
    next() {
      this.$emit("next");
    },
    // 添加喜欢
    like() {
      this.$axios({
        url: `/like?id=${this.item.id}&like=${true}&cookie=${
          this.hasLogin ? localStorage.getItem("cloudMusicUserCookie") : ""
        }`,
      })
        .then((res) => {
          Toast({
            message: "添加喜欢成功",
            position: "bottom",
            duration: 2000,
          });
        })
        .catch((err) => {
          Toast({
            message: "添加喜欢失败",
            position: "bottom",
            duration: 2000,
          });
        });
    },
    // 播放暂停
    pausePlay() {
      let player = Object.assign({}, this.player);
      player.play = !player.play;
      this.$store.commit("setPlayer", player);
    },
    // 播歌
    changePlayer(flog) {
      if (!flog) return;
      this.playSing(this.item.id, this.index);
    },
    // 播放歌曲
    async playSing(id, index) {
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
      this.src = res[0].data[0].url;
      this.addSong(res, index);
      this.$store.commit("setLoading", false);
    },
    addSong(res, index) {
      if (res === null)
        return Toast({
          message: "该歌曲暂不可播放",
          position: "bottom",
          duration: 2000,
        });
      // 处理player
      let player = Object.assign({}, this.$store.state.player);
      player.src = res[0].data[0].url;
      player.name = res[1].songs[0].name;
      player.singer = res[1].songs[0].ar[0].name;
      player.img = res[1].songs[0].al.picUrl;
      player.play = true;
      player.index = index;
      this.$store.commit("setPlayer", player);
    },
  },
  created() {
    if (this.item) this.changePlayer();
  },
  mounted() {},
  computed: {
    player() {
      this.playTime = this.$store.state.player.playTime;
      return this.$store.state.player;
    },
    loading() {
      return this.$store.state.loading;
    },
    musicList() {
      return this.$store.state.musicList;
    },
    hasLogin() {
      return this.$store.state.hasLogin;
    },
  },
  filters: {
    timeHandle(val) {
      if (val === 0) return "00:00";
      let mon = Math.floor(val / 60);
      mon = mon >= 10 ? mon : "0" + mon;
      let sec = Math.floor(val - mon * 60);
      sec = sec >= 10 ? sec : "0" + sec;
      return mon + ":" + sec;
    },
  },
  components: {},
  watch: {
    $route() {},
    playTime(val) {
      if (this.$refs && this.player.allTime !== 0) {
        let move =
          (this.playTime / this.player.allTime) *
          this.$refs.rangeBox.clientWidth;
        this.$refs.mask.style.webkitTransform = `translate(${move}px)`;
        this.$refs.mask.style.transform = `translate(${move}px)`;
        this.$refs.finish.style.width = move + "px";
        if (
          Math.round(this.player.playTime) >= Math.round(this.player.allTime) &&
          this.player.playTime > 0 &&
          this.nextFlog
        ) {
          this.$emit("changeSign", true);
          this.nextFlog = false;
          setTimeout(() => {
            this.nextFlog = true;
          }, 3000);
        }
      }
    },
    index() {
      this.changePlayer(true);
    },
  },
  props: ["type", "item", "index", "taggle"],
};
</script>

<style lang='less' scoped>
@rate: 50;
#bofangye {
  height: 100%;
  overflow: hidden;
  padding-top: 60rem / @rate;
  position: relative;
  .touxiang {
    width: 300rem / @rate;
    height: 300rem / @rate;
    margin: 25rem / @rate auto;
    .img {
      width: 100%;
      height: 100%;
      img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
  .info {
    width: 300rem / @rate;
    height: 50rem / @rate;
    margin: 0 auto;
    .title {
      width: 100%;
      text-align: center;
      font-size: 22rem / @rate;
      color: #fff;
      text-shadow: 0 0 2rem / @rate #505050;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .artical {
      color: #eeeeee;
      text-align: center;
      width: 100%;
      font-size: 12rem / @rate;
      margin-top: 12rem / @rate;
    }
  }
  .control {
    width: 100%;
    height: 100rem / @rate;
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .range {
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left,
      .right {
        font-size: 10rem / @rate;
        width: 28rem / @rate;
      }
      .left {
        color: #fff;
      }
      .right {
        color: #454b4b;
        text-align: right;
      }
      .middle {
        width: 270rem / @rate;
        height: 2rem / @rate;
        position: relative;
        margin: 0 8rem / @rate;
        .finishRange,
        .notRange {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          border-radius: 2rem / @rate;
        }
        .finishRange {
          background-color: #fff;
          z-index: 10;
          width: 0;
        }
        .notRange {
          background-color: #34383b;
        }
        .mask {
          position: absolute;
          left: -3.5rem / @rate;
          top: calc(50% - 3.5rem / @rate);
          width: 7rem / @rate;
          height: 7rem / @rate;
          border-radius: 50%;
          background-color: #fff;
          z-index: 100;
        }
      }
    }
    .menu {
      height: 75rem / @rate;
      width: 100%;
      display: flex;
      .playBtn,
      .nolike,
      .prev,
      .next,
      .like {
        flex: 1;
        height: 70rem / @rate;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .nolike,
      .prev,
      .next,
      .like {
        position: relative;
        img {
          display: block;
          width: 30rem / @rate;
          height: 30rem / @rate;
        }
      }
      .nolike::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        width: 60%;
        height: 2rem / @rate;
        background-color: #fff;
      }
      .playBtn {
        img {
          display: block;
          width: 60rem / @rate;
          height: 60rem / @rate;
        }
      }
    }
  }
}
</style>