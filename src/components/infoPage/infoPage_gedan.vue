<template>
  <div id="infoPage_gedan">
    <!-- 顶部选项卡 -->
    <div class="nav" v-show="catlist!==null">
      <mt-navbar v-model="selected" id="infoPage_gedan_navlist">
        <mt-tab-item :id="item.id" v-for="item in catlist" :key="item.id">
          <div class="title" @click="taggle(item.name)">{{item.name}}</div>
        </mt-tab-item>
      </mt-navbar>
    </div>
    <!-- 内容框 -->
    <div class="main" v-if="renderList !== null">
      <div class="gedanList">
        <div
          class="gedanItem"
          v-for="item in renderList"
          :key="item.id"
          @click="showGendanInfoHandle(item.id)"
        >
          <row3card :res="item"></row3card>
        </div>
      </div>
    </div>
    <!-- 歌单详情组件 -->
    <transition name="gedanInfo">
      <gedanInfo v-if="showGedanInfo" :res="showGedanInfoRes" @closePopup="closePopup"></gedanInfo>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selected: 1,
      catlist: null,
      renderList: null,
      showGedanInfo: false,
      showGedanInfoRes: null,
    };
  },
  methods: {
    // 子组件关闭popup的回调监听
    closePopup(val) {
      this.showGedanInfo = val;
    },
    // 点击跳出歌单页面
    async showGendanInfoHandle(id) {
      let res = await this.$axios({
        url: `/playlist/detail?id=${id}&cookie=${
          this.hasLogin ? localStorage.getItem("cloudMusicUserCookie") : ""
        }`,
      });
      res = res.data.playlist;
      this.showGedanInfoRes = res;
      this.showGedanInfo = true;
    },
    // 获取歌单分类
    getCatlist() {
      return this.$axios({
        url: "/playlist/hot",
      });
    },
    // 根据歌单分类长度, 渲染导航条
    async renderNav() {
      let navList = await this.getCatlist();
      let navEle = document.getElementById("infoPage_gedan_navlist");
      navList = navList.data.tags;
      navList.unshift({
        id: "06200620",
        name: "推荐",
      });
      navEle.style.width = (navList.length * 100) / 50 + "rem";
      this.catlist = navList;
      this.selected = this.catlist[0].id;
    },
    // 切换歌单时获取
    taggle(name, before) {
      if (name === "推荐" || name === "" || !name) {
        // 请求推荐
        this.$axios({
          url: `/personalized`,
        }).then((res) => {
          this.renderList = [].concat(res.data.result);
        });
      } else {
        // 请求分类列表
        let url = `/top/playlist/highquality?cat=${encodeURI(name)}`;
        if (before)
          url = `/top/playlist/highquality?cat=${encodeURI(
            name
          )}&before=${before}`;
        this.$axios({
          url,
        }).then((res) => {
          this.renderList = [].concat(res.data.playlists);
        });
      }
    },
  },
  created() {},
  async mounted() {
    // 请求分类数据
    this.renderNav();
    // 请求推荐表单数据
    this.taggle();
  },
  computed: {
    hasLogin() {
      return this.$store.state.hasLogin;
    },
  },
  filters: {},
  components: {
    row3card: () => import("./gedan_row3Card"),
    gedanInfo: () => import("./infoPage_songList"),
  },
  watch: {
    $route() {},
  },
};
</script>

<style lang='less' scoped>
@rate: 50;
#infoPage_gedan {
  padding-top: 60rem / @rate;
  height: 100%;
}
.nav {
  width: 100%;
  height: 53rem / @rate;
  white-space: nowrap;
  overflow-x: auto;
}
.mint-navbar {
  background-color: transparent;
  overflow: hidden;
  position: relative;
  background-color: rgba(255, 255, 255, 0.4);
  height: calc(100% - 7rem / @rate);
  .mint-tab-item {
    z-index: 99;
    position: relative;
  }
}
.mint-navbar .mint-tab-item.is-selected {
  color: #fff;
  border-color: #fff;
  text-shadow: 0 0 2rem / @rate #505050;
}
.mint-navbar .mint-tab-item .title {
  font-size: 15rem / @rate;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.mint-tab-container {
  height: calc(100% - 53rem / @rate);
  overflow-y: auto;
}
.main {
  padding: 12rem / @rate 6rem / @rate;
  height: calc(100% - 53rem / @rate);
  overflow-y: auto;
  .gedanList {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .gedanItem {
      height: 160rem / @rate;
      width: 115rem / @rate;
      margin-bottom: 6rem / @rate;
      margin-right: 8rem / @rate;
      &:nth-last-child(1),
      &:nth-last-child(2),
      &:nth-last-child(3) {
        margin-bottom: 0;
      }
      &:nth-child(3n) {
        margin-right: 0;
      }
    }
  }
}
.gedanInfo-enter,
.gedanInfo-leave-to {
  transform: translateY(100%);
}
.gedanInfo-enter-active,
.gedanInfo-leave-active {
  transition: transform 0.3s ease;
}
</style>