<template>
  <div id="init" v-if="res !== null">
    <div class="bg">
      <img :src="res[sign].album.blurPicUrl || ''" />
    </div>
    <div class="main">
      <div class="header">
        <div class="icon" @click="$router.go(-1)">
          <img src="./../assets/icon/back.png" />
        </div>
        <div class="text">私人FM</div>
      </div>
      <transition-group tag="div" class="box" name="taggle" style="overflow: hidden;">
        <div class="bofangye" key="bofangye" v-show="showbofang" @click="showbofang = !showbofang">
          <bofangye
            :type="'square'"
            :item="res[sign]"
            :index="sign"
            :taggle="taggle"
            @changeSign="next"
            @next="next"
            @prev="prev"
            @taggleH="taggleH"
          ></bofangye>
        </div>
        <div class="geciye" key="geciye" v-show="!showbofang" @click="showbofang = !showbofang">
          <geciye :item="res[sign]" :index="sign" :id="res[sign].id"></geciye>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      res: null,
      sign: 0,
      showbofang: true,
      taggle: false,
    };
  },
  methods: {
    // 打开开关, 阻止切换时重置数据
    taggleH() {
      this.taggle = true;
    },
    // 添加播放数据
    async changeSign(flog) {
      if (this.sign >= this.res.length - 2) {
        if (this.$store.state.hasLogin) {
          let res = await this.$axios({
            url: `/personal_fm?cookie=${localStorage.getItem(
              "cloudMusicUserCookie"
            )}&timestamp=${new Date().getTime()}`,
          });
          this.res = this.res.concat(res.data.data);
          if (flog) {
            this.sign++;
          }
        } else {
          this.res = this.res;
          Toast({
            message: "请登录后重试",
            position: "bottom",
            duration: 2000,
          });
        }
      }
    },
    // 前一首
    prev() {
      if (this.sign === 0)
        return Toast({
          message: "已经是第一首了",
          position: "bottom",
          duration: 2000,
        });
      this.sign--;
    },
    // 下一首
    next() {
      if (this.sign === this.res.length - 1) return;
      this.sign++;
      this.changeSign();
    },
  },
  created() {},
  mounted() {},
  destroyed() {
    // 临死前存下FM数据
    this.$store.commit("setFMstorage", this.res);
    // 临死前存下sign
    let player = Object.assign({}, this.$store.state.player);
    player.index = this.sign;
    this.$store.commit("setPlayer", player);
  },
  computed: {
    hasLogin() {
      return this.$store.state.hasLogin;
    },
  },
  filters: {},
  components: {
    bofangye: () => import("./../components/bofangye"),
    geciye: () => import("./../components/geciye"),
  },
  watch: {
    $route() {},
  },
  beforeRouteEnter(to, from, next) {
    next(async (vm) => {
      if (vm.$store.state.hasLogin) {
        if (vm.$store.state.isFM) {
          vm.res = [].concat(vm.$store.state.FMstorage);
          vm.sign = vm.$store.state.player.index;
        } else {
          let res = await vm.$axios({
            url: `/personal_fm?cookie=${localStorage.getItem(
              "cloudMusicUserCookie"
            )}&timestamp=${new Date().getTime()}`,
          });
          vm.res = [].concat(res.data.data);
        }
      } else {
        vm.res = null;
      }
    });
  },
};
</script>

<style lang='less' scoped>
@import url("./../lib/less/viewLess/init.less");
</style>