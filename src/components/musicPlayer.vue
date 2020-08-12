<template>
  <div id="musicPlayer" ref="musicbox" @click.stop="taggleGlobalPopup">
    <div class="headerBg">
      <img src="./../assets/bg/bg.jpg" alt v-if="!hasLogin" />
      <img :src="userInfo ? userInfo.backgroundUrl : ''" alt v-else />
    </div>
    <!-- 播放器标签实体 -->
    <audio class="audio" ref="audio" :src="src"></audio>
    <div class="box">
      <!-- 播放器样子 -->
      <div class="musicImg" ref="musicImg">
        <img v-if="img !== ''" :src="img" />
      </div>
      <div class="info" ref="info">
        <div class="title animate" ref="title">{{name}}</div>
        <div class="singer" ref="singer">{{singer}}</div>
      </div>
      <div class="playBtn" @click.stop="playAndStop" v-if="!play">
        <img src="./../assets/icon/play.png" />
      </div>
      <div class="playBtn stopBtn" @click.stop="playAndStop" v-else>
        <img src="./../assets/icon/stop.png" />
      </div>
      <!-- <div class="playList" @click.stop="showBpopupFlog = !showBpopupFlog">
        <img src="./../assets/icon/menuopen.png" alt />
      </div>-->
      <!-- 播放列表 -->
      <transition name="Bpopup">
        <div class="Bpopup" v-if="showBpopupFlog">
          <div class="title">播放列表</div>
          <ul class="musicList">
            <li
              class="musicItem"
              v-for="(item, index) in musicList"
              :key="index"
              @click="taggleListSong(index)"
            >{{item.name}}</li>
          </ul>
        </div>
      </transition>
    </div>
    <div class="range" ref="range"></div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      showBpopupFlog: false,
      srcFlog: true,
    };
  },
  methods: {
    // 切换全局弹窗
    taggleGlobalPopup() {
      let globalPopup = Object.assign({}, this.$store.state.globalPopup);
      globalPopup.show = true;
      this.$store.commit("setGlobalPopup", globalPopup);
    },
    // 播放动画的启停, 歌名滚动动画
    renderAnimate() {
      if (this.$refs.title && this.$refs.singer) {
        if (this.name.length * 14 > this.$refs.info.clientWidth) {
          this.$refs.title.className = "title animateT";
        } else {
          this.$refs.title.className = "title";
        }
        if (this.singer.length * 12 > this.$refs.info.clientWidth) {
          this.$refs.singer.className = "singer animateS";
        } else {
          this.$refs.singer.className = "singer";
        }
      }
    },
    // 同步vuex中的 播放/暂停
    playAndStop() {
      if (this.src === "") return;
      let data = this.$store.state.player;
      data.play = !data.play;
      this.$store.commit("setPlayer", data);
    },
    // 继续或暂停头像转动动画以及开启音频播放和关闭音频播放函数
    play_cmd() {
      if (this.$refs.audio) {
        if (this.$store.state.player.play) {
          setTimeout(() => {
            this.$refs.audio.play();
            this.$refs.musicImg.className = "musicImg musicActive";
            this.$refs.audio.addEventListener("canplay", this.canplayCallback);
          }, 0);
        } else {
          this.$refs.audio.pause();
          this.$refs.musicImg.className = "musicImg";
        }
      }
    },
    // 歌曲可播放回调
    canplayCallback() {
      this.$refs.audio.play();
      this.$refs.musicImg.className = "musicImg musicActive";
      this.$store.commit("setPlayerAllTime", this.$refs.audio.duration);
      this.$refs.audio.removeEventListener("canplay", this.canplayCallback);
    },
    // 赋予音频src
    async initializeAudio() {
      this.$axios({
        url: `/check/music?id=${this.musicList[this.player].id}`,
      })
        .then((res) => {
          if (this.$refs.audio) {
            this.$refs.audio.src = this.$store.state.player.src;
          }
        })
        .catch((err) => {
          Toast({
            message: "该歌曲暂不可播放",
            position: "bottom",
            duration: 1500,
          });
        });
    },
    // 将播放进度渲染到按钮上
    renderPlayBtn(rate) {
      // let allWidth = this.$refs.musicbox.clientWidth;
      this.$refs.range.style.width =
        this.$refs.musicbox.clientWidth * rate + "px";
    },
    // 当音频播放完成后的处理逻辑
    finish() {
      let musicList = this.musicList;
      if (this.$refs.audio.ended) {
        if (musicList.length < 1) {
          this.$refs.audio.pause();
        } else {
          let player = Object.assign({}, this.$store.state.player);
          player.index++;
          if (player.index == musicList.length) player.index = 0;
          player.name = this.musicList[player.index].name;
          player.src = this.musicList[player.index].src;
          player.singer = this.musicList[player.index].singer;
          player.img = this.musicList[player.index].img;
          this.$store.commit("setPlayer", player);
        }
      }
    },
    // 在列表中切换歌曲
    taggleListSong(index) {
      // let player = Object.assign({}, this.$store.state.player);
      // player.index = index;
      // player.name = this.musicList[player.index].name;
      // player.src = this.musicList[player.index].src;
      // player.singer = this.musicList[player.index].singer;
      // this.$store.commit("setPlayer", player);
      // this.$refs.audio.currentTime = 0;
    },
  },
  created() {},
  mounted() {
    // 初始化定时器, 令其监听播放进度
    clearInterval(window.playObj);
    window.playObj = setInterval(() => {
      if (
        !isNaN(this.$refs.audio.currentTime) &&
        !isNaN(this.$refs.audio.duration)
      ) {
        let player = this.$store.state.player;
        player.playTime = this.$refs.audio.currentTime;
        this.$store.commit("setPlayer", player);
        this.renderPlayBtn(
          this.$refs.audio.currentTime / this.$refs.audio.duration
        );
      } else {
        let player = this.$store.state.player;
        player.playTime = 0;
        this.$store.commit("setPlayer", player);
        this.renderPlayBtn(0);
      }
    }, 50);
  },
  computed: {
    src: function () {
      if (!this.srcFlog) return;
      this.renderAnimate();
      if (this.$store.state.player.src === null) {
        this.srcFlog = false;
        Toast({
          message: "该歌曲暂不可播放,为您播放下一首",
          position: "bottom",
          duration: 2000,
        });
        // 处理player
        if (this.musicList.length <= 0) return null;
        let player = this.player;
        let musicList = this.musicList;
        player.index++;
        if (player.index >= musicList.length) player.index = 0;
        player.img = this.musicList[player.index].img;
        player.src = this.musicList[player.index].src;
        player.name = this.musicList[player.index].name;
        player.id = this.musicList[player.index].id;
        this.$store.commit("setPlayer", player);
        setTimeout(() => {
          this.srcFlog = true;
        }, 3000);
      }
      return this.$store.state.player.src;
    },
    name: function () {
      return this.$store.state.player.name;
    },
    singer: function () {
      return this.$store.state.player.singer;
    },
    img: function () {
      return this.$store.state.player.img;
    },
    play: function () {
      this.play_cmd();
      return this.$store.state.player.play;
    },
    player() {
      return this.$store.state.player;
    },
    musicList: function () {
      return this.$store.state.musicList;
    },
    hasLogin() {
      return this.$store.state.hasLogin;
    },
    userInfo() {
      return this.$store.state.userInfo;
    },
    allTime: {
      set(val) {},
      get() {
        return this.$store.state.player.allTime;
      },
    },
  },
  filters: {},
  components: {},
  watch: {
    $route() {},
  },
};
</script>

<style lang='less' scoped>
@import url("./../lib/less/componentsLess/musicPlayer.less");
</style>