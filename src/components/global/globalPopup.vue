<template>
  <div id="globalPopup">
    <div class="bg">
      <img
        :src="musicList.length !== 0 && musicList[player.index] ? musicList[player.index].img : ''"
      />
    </div>
    <div class="main">
      <div class="header">
        <div class="icon" @click="taggleGlobalPopup">
          <img src="./../../assets/icon/back.png" />
        </div>
        <div class="text">{{musicList[player.index] ? musicList[player.index].name : ""}}</div>
      </div>
      <transition-group tag="div" class="box" name="taggle" style="overflow: hidden;">
        <div
          class="bofangye"
          key="bofangye"
          v-show="showbofang"
          @click="showbofang = !showbofang"
          v-if="musicList.length !== 0"
        >
          <bofangye
            :type="'square'"
            :item="musicList[player.index] ? musicList[player.index] : null"
            :index="player.index"
            @changeSign="next"
            @next="next"
            @prev="prev"
            @taggleH="taggleH"
          ></bofangye>
        </div>
        <div
          class="geciye"
          key="geciye"
          v-show="!showbofang"
          @click="showbofang = !showbofang"
          v-if="musicList.length !== 0"
        >
          <geciye :item="musicList[player.index]" :index="player.index"></geciye>
        </div>
      </transition-group>
      <div class="noplay" v-if="musicList.length === 0">播放歌曲后才能查看歌曲</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showbofang: true,
      taggle: false,
    };
  },
  methods: {
    // 打开开关, 阻止切换时重置数据
    taggleH() {
      this.taggle = true;
    },
    // 下一首
    next() {
      let player = this.$store.state.player;
      player.index++;
      if (player.index >= this.musicList.length) player.index = 0;
      this.$store.commit("setPlayer", player);
    },
    // 上一首
    prev() {
      let player = this.$store.state.player;
      player.index--;
      if (player.index <= 0) player.index = this.musicList.length - 1;
      this.$store.commit("setPlayer", player);
    },
    // 全局popup显隐
    taggleGlobalPopup() {
      let val = this.globalPopup;
      val.show = false;
      this.$store.commit("setGlobalPopup", val);
    },
  },
  created() {},
  mounted() {},
  computed: {
    player() {
      return this.$store.state.player;
    },
    musicList() {
      return this.$store.state.musicList;
    },
    globalPopup() {
      return this.$store.state.globalPopup;
    },
  },
  filters: {},
  components: {
    bofangye: () => import("./../bofangye"),
    geciye: () => import("./../geciye"),
  },
  watch: {
    $route() {},
  },
};
</script>

<style lang='less' scoped>
@rate: 50;
#globalPopup {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 999;
}
.bg {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  transform: scale(1.2);
  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3),
    rgba(0, 0, 0, 0.6)
  );
  img {
    display: block;
    height: 667rem / @rate;
    width: auto;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    filter: blur(32rem / @rate) brightness(80%);
  }
}
.main {
  height: 100%;
  position: relative;
  z-index: 99;
  padding: 0 16rem / @rate;
  .header {
    height: 60rem / @rate;
    display: flex;
    align-items: center;
    .icon {
      width: 20rem / @rate;
      height: 20rem / @rate;
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }
  .text {
    font-size: 18rem / @rate;
    font-weight: bold;
    color: #fff;
    margin-left: 13rem / @rate;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    white-space: nowrap;
  }
  .box {
    height: calc(100% - 60rem / @rate);
    position: relative;
  }
  .bofangye,
  .geciye {
    width: 100%;
    height: 100%;
    position: absolute;
  }
}
.noplay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 13rem / @rate;
  color: #fff;
}
// vue动画
.taggle-enter,
.taggle-leave-to {
  opacity: 0;
}
.taggle-enter-active,
.taggle-leave-active {
  transition: opacity 0.3s ease;
}
</style>