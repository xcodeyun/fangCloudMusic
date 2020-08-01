<template>
  <div id="musicPlayer" ref="musicbox">
    <div class="headerBg">
      <img src="./../assets/bg/bg.jpg" alt v-if="!hasLogin" />
      <img :src="userInfo ? userInfo.backgroundUrl : ''" alt v-else />
    </div>
    <audio class="audio" ref="audio" :src="src" loop></audio>
    <div class="box">
      <div class="musicImg" ref="musicImg">
        <img v-if="img !== ''" :src="img" />
      </div>
      <div class="info" ref="info">
        <div class="title animate" ref="title">{{name}}</div>
        <div class="singer" ref="singer">{{singer}}</div>
      </div>
      <div class="playBtn" @click="playAndStop" v-if="!play">
        <img src="./../assets/icon/play.png" />
      </div>
      <div class="playBtn stopBtn" @click="playAndStop" v-else>
        <img src="./../assets/icon/stop.png" />
      </div>
      <div class="playList" @click="showBpopupFlog = !showBpopupFlog">
        <img src="./../assets/icon/menuopen.png" alt />
      </div>
      <transition name="Bpopup">
        <div class="Bpopup" v-if="showBpopupFlog">
          <div class="title">播放列表(33)</div>
          <ul class="musicList">
            <li class="musicItem" v-for="(item, index) in musicList" :key="index">{{item.name}}</li>
          </ul>
        </div>
      </transition>
    </div>
    <div class="range" ref="range"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showBpopupFlog: false,
    };
  },
  methods: {
    // 播放动画的启用和暂停
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
    // 同步vuex中的播放/暂停记录
    playAndStop() {
      let data = this.$store.state.player;
      data.play = !data.play;
      this.$store.commit("setPlayer", data);
    },
    // 继续或暂停
    play_cmd() {
      if (this.$refs.audio) {
        if (this.$store.state.player.play) {
          this.$refs.audio.play();
          this.$refs.musicImg.className = "musicImg musicActive";
        } else {
          this.$refs.audio.pause();
          this.$refs.musicImg.className = "musicImg";
        }
      }
    },
    // 赋予音频src
    initializeAudio() {
      if (this.$refs.audio) {
        this.$refs.audio.src = this.$store.state.player.src;
      }
    },
    // 将播放进度渲染到按钮上
    renderPlayBtn(rate) {
      // let allWidth = this.$refs.musicbox.clientWidth;
      this.$refs.range.style.width =
        this.$refs.musicbox.clientWidth * rate + "px";
    },
  },
  created() {},
  mounted() {
    setTimeout(() => {
      let newData = {
        src: require("./../assets/media/music.mp3"),
        play: false,
        img: require("./../assets/bg/musicImg.png"),
        name: "カワキヲアメク",
        singer: "美波",
      };
      this.$store.commit("setPlayer", newData);
      this.initializeAudio();
    }, 1000);
    // 初始化定时器, 令其监听播放进度
    clearInterval(window.playObj);
    window.playObj = setInterval(() => {
      if (
        !isNaN(this.$refs.audio.currentTime) &&
        !isNaN(this.$refs.audio.duration)
      ) {
        this.renderPlayBtn(
          this.$refs.audio.currentTime / this.$refs.audio.duration
        );
      } else {
        this.renderPlayBtn(0);
      }
    }, 500);
  },
  computed: {
    src: function () {
      this.renderAnimate();
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
    musicList: function () {
      return this.$store.state.musicList;
    },
    hasLogin() {
      return this.$store.state.hasLogin;
    },
    userInfo() {
      return this.$store.state.userInfo;
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