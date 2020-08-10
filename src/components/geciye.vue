<template>
  <div id="geciye" v-if="geci !== null">
    <div class="main">
      <div class="hr"></div>
      <div class="geciList" ref="geciList">
        <div
          class="geciItem"
          v-for="(item, index) in geci"
          :key="index"
        >{{item === "" ? "...":item}}</div>
      </div>
    </div>
    <div class="adjustment">
      <div class="add" @click.stop="changeAdjustment(false)">-</div>
      <div class="reduce" @click.stop="changeAdjustment(true)">+</div>
    </div>
  </div>
  <div class="noGeci" v-else>该歌曲暂时没有歌词</div>
</template>

<script>
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      geci: null,
      time: null,
      row: 0,
      adjustment: 0,
    };
  },
  methods: {
    // 增加歌词速度
    changeAdjustment(flog) {
      let adjustment = this.adjustment;
      if (flog) {
        adjustment += 0.5;
        if (adjustment >= 3)
          return Toast({
            message: `速度最多增加${this.adjustment}秒`,
            position: "bottom",
            duration: 2000,
          });
      } else {
        adjustment -= 0.5;
        if (adjustment <= -3)
          return Toast({
            message: `速度最多减少${this.adjustment}秒`,
            position: "bottom",
            duration: 2000,
          });
      }
      this.adjustment = adjustment;
      Toast({
        message: `歌词速度调整为${this.adjustment}`,
        position: "bottom",
        duration: 2000,
      });
    },
    // 获取歌词
    getGeCi() {
      this.$axios({
        url: `/lyric?id=${this.item.id}`,
      }).then((res) => {
        res = res.data.nolyric || res.data.sgc ? null : res.data.lrc.lyric;
        if (res) {
          res = [].concat(res.split(/\n/));
          let geci = [],
            time = [];
          for (let i = 0; i < res.length; i++) {
            let store = res[i].split("]");
            store[0] = store[0].replace(/\[/, "");
            store[0] = store[0].split(/[\:\.]/g);
            let count =
              Number(store[0][0]) * 60 +
              Number(store[0][1]) +
              Number(store[0][2]) / 1000;
            store[0] = count;
            time.push(store[0]);
            geci.push(store[1]);
          }
          this.geci = geci;
          this.time = time;
        } else {
          this.geci = null;
        }
      });
    },
    // 自动滚动歌词
    autoGeciMove() {
      if (this.time && this.geci) {
        let time = this.time[this.row];
        if (isNaN(time)) time = 0;
        if (this.playTime > time - this.adjustment && this.$refs.geciList) {
          if (this.row !== this.geci.length) this.row++;
          if (this.row >= this.geci.length) this.row = 0;
          let h = (this.row - 1) * 50;
          h = h < 0 ? 0 : h;
          this.$refs.geciList.setAttribute(
            "style",
            `transform:translateY(-${h}px);`
          );
        }
      }
    },
  },
  created() {
    // 得到歌词数据
    this.getGeCi();
  },
  mounted() {
    window.geci = setInterval(() => {
      this.autoGeciMove();
    }, 100);
  },
  computed: {
    playTime() {
      return this.$store.state.player.playTime;
    },
  },
  filters: {},
  components: {},
  watch: {
    $route() {},
    index(val) {
      this.row = 0;
      this.getGeCi();
    },
  },
  props: ["item", "index"],
};
</script>

<style lang='less' scoped>
@rate: 50;
#geciye {
  height: 100%;
  padding-bottom: 24rem / @rate;
  position: relative;
}
.title {
  height: 40rem / @rate;
  text-align: center;
  margin-bottom: 30rem / @rate;
}
.main {
  height: 500rem / @rate;
  overflow: hidden;
}
.geciList {
  height: auto;
  position: absolute;
  top: 280rem / @rate;
  width: 100%;
  transition: transform 0.4s ease;
  .geciItem {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    font-size: 13rem / @rate;
    width: 100%;
    height: 50rem / @rate;
    color: #fff;
    text-shadow: 0 0 3rem / @rate #505050;
    line-height: 1.1;
    white-space: normal;
    word-break: keep-all;
    text-align: center;
  }
}
.hr {
  background-color: rgba(0, 0, 0, 0.4);
  width: 100%;
  height: 50rem / @rate;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}
.noGeci {
  color: #fff;
  font-size: 14rem / @rate;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-shadow: 0 0 3rem / @rate #505050;
}
.adjustment {
  position: absolute;
  bottom: 25rem / @rate;
  width: 100%;
  height: 30rem / @rate;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8rem / @rate;
  .add,
  .reduce {
    width: 30rem / @rate;
    height: 30rem / @rate;
    text-align: center;
    line-height: 30rem / @rate;
    background-color: rgba(0, 0, 0, 0.4);
    color: #fff;
    text-shadow: 0 0 3rem / @rate #505050;
    font-size: 22rem / @rate;
  }
}
</style>