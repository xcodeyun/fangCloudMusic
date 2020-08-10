<template>
  <div id="dongtai">
    <!-- 顶部滚动栏(关注列表) -->
    <div class="rowList" v-if="guanzhuList !== null">
      <div
        class="rowItem"
        @click="goUserStr(item.userId)"
        v-for="(item, index) in guanzhuList"
        :key="index"
      >
        <div class="body">
          <div class="rowItemImg">
            <img :src="item.avatarUrl" />
          </div>
          <div class="rowItemText">{{item.nickname}}</div>
        </div>
      </div>
    </div>
    <!-- 内容区:动态项 -->
    <div class="context" v-if="hasLogin">
      <div class="dongtaiList">
        <div class="dongtaiItem" v-for="(item, index) in dongtaiData" :key="index">
          <music-dongtai :res="item" v-if="item.type !== 33"></music-dongtai>
        </div>
      </div>

      <div class="moreItem" v-if="!moreData" @click="more">点击加载更多动态</div>
      <div class="moreItem" v-else>
        <mt-spinner type="snake"></mt-spinner>
      </div>
    </div>
    <div class="noLogin" v-else>请登录后查看动态</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 用户关注列表依赖参数
      guanzhuList: null,
      // 用户动态列表依赖参数
      dongtaiData: null,
      // 用户登录依赖参数
      hasLogin: false,
      // 点击加载切换依赖参
      moreData: false,
      // 页数依赖参
      page: 0,
    };
  },
  methods: {
    // 点击加载更多动态
    async more() {
      this.moreData = true;
      let res = await this.getDongtaiData(this.page);
      this.page = res.data.lasttime;
      res = res.data.event;
      res = this.handleDataSort(res);
      this.dongtaiData = this.dongtaiData.concat(res);
      this.moreData = false;
    },
    // 点击进入用户介绍页
    goUserStr(id) {
      console.log(id);
    },
    // 获取关注列表
    getGuanZhu() {
      return this.$axios({
        url: `/user/follows?uid=${localStorage.getItem(
          "cloudMusicUserId"
        )}&cookie=${localStorage.getItem("cloudMusicUserCookie")}`,
      });
    },
    // 获取用户动态
    getDongtaiData(lasttime) {
      return this.$axios({
        url: `/event?cookie=${localStorage.getItem(
          "cloudMusicUserCookie"
        )}&lasttime=${lasttime ? lasttime : ""}`,
      });
    },
    // 处理数据
    async handleData() {
      // 关注列表数据
      let guanzhuData = await this.getGuanZhu();
      this.guanzhuList = guanzhuData.data.follow;
      // 动态列表数据
      let dongtaiData = await this.getDongtaiData();
      this.page = dongtaiData.data.lasttime;
      dongtaiData = dongtaiData.data.event;
      dongtaiData = this.handleDataSort(dongtaiData);
      this.dongtaiData = [].concat(dongtaiData);
      // 保存分页
      console.log();
    },
    // 排序数据(按时间从小到大)
    handleDataSort(data) {
      function mergeSort(res) {
        let len = res.length;
        if (len <= 1) return res;
        let middle = Math.floor(len / 2);

        let l = res.splice(0, middle);
        let r = res;

        return merge(mergeSort(l), mergeSort(r));
      }
      function merge(l, r) {
        let result = [];
        let indexL = 0;
        let indexR = 0;

        while (indexL < l.length && indexR < r.length) {
          if (l[indexL].showTime > r[indexR].showTime) {
            result.push(l[indexL]);
            indexL++;
          } else {
            result.push(r[indexR]);
            indexR++;
          }
        }

        while (indexL < l.length) {
          result.push(l[indexL]);
          indexL++;
        }
        while (indexR < r.length) {
          result.push(r[indexR]);
          indexR++;
        }

        return result;
      }
      return mergeSort([].concat(data));
    },
  },
  created() {},
  mounted() {},
  computed: {},
  filters: {},
  components: {
    "music-dongtai": () => import("./../components/dongtaiCard"),
  },
  watch: {
    $route() {},
    hasLogin(val) {
      if (val) this.handleData();
    },
  },
  beforeRouteEnter(to, from, next) {
    return next((vm) => {
      if (localStorage.getItem("cloudMusicUserCookie") !== null)
        vm.hasLogin = true;
    });
  },
};
</script>

<style lang='less' scoped>
@import url("./../lib/less/viewLess/dongtai.less");
</style>