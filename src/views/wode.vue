<template>
  <div id="wode">
    <div class="header">
      <div class="top" @click="toUserInfo">
        <div class="userImg">
          <img :src="userInfo?userInfo.avatarUrl:''" v-if="hasLogin" class="hasLoginImg" />
          <img src="./../assets/icon/seeuser.png" v-else class="noLoginImg" />
        </div>
        <div class="userName">{{userInfo ? userInfo.nickname:'登录以使用更多功能'}}</div>
        <div class="loginBtn" v-if="!hasLogin">立即登录</div>
        <div class="loginBtn" v-else @click="qiandao">签到</div>
      </div>
      <div class="bottom" v-if="hasLogin">
        <div class="bottomItem" @click="taggleGlobalPopup">
          <div class="img">
            <img src="./../assets/icon/music.png" />
          </div>
          <div class="info">正在播放</div>
        </div>
        <div class="bottomItem" @click="openPopup(557887680)">
          <div class="img">
            <img src="./../assets/icon/diantai.png" />
          </div>
          <div class="info">我的喜欢</div>
        </div>
        <div class="bottomItem" @click="$router.push('/shipin')">
          <div class="img">
            <img src="./../assets/icon/video.png" />
          </div>
          <div class="info">关注MV</div>
        </div>
        <div class="bottomItem" @click="$router.push('/infoPage?type=gedan')">
          <div class="img">
            <img src="./../assets/icon/yinyuechangpian.png" />
          </div>
          <div class="info">关注好歌</div>
        </div>
      </div>
    </div>
    <div class="main" v-if="hasLogin">
      <!-- 最近播放 -->
      <div class="zuijinbofang" v-if="zuijinbofang !== null">
        <div class="wodeTitle">
          <div class="left">最近播放</div>
        </div>
        <div class="zuijinbofangList">
          <div
            class="zuijinbofangItem"
            v-for="(item, index) in zuijinbofang"
            :key="index"
            @click="bofang(item)"
          >
            <music-minicard :miniData="item" :type="'song'"></music-minicard>
          </div>
        </div>
      </div>
      <!-- 我的音乐 -->
      <div class="myMusic">
        <div class="wodeTitle">
          <div class="left">我的音乐</div>
        </div>
        <div class="myMusicList">
          <div class="myMusicItem" v-for="(item, index) in myMusic" :key="index">
            <router-link
              class="item_content"
              :to="item.to"
              tag="div"
              v-if="item.to !== '/wode/init/like'"
            >
              <img :src="item.icon" />
              <span>{{item.name}}</span>
            </router-link>
            <div class="item_content" v-else @click="openPopup(557887680)">
              <img :src="item.icon" />
              <span>{{item.name}}</span>
            </div>
            <div class="secInfo">{{item.sec}}</div>
          </div>
        </div>
      </div>
      <!-- 收藏歌单 -->
      <div class="mySongList">
        <div class="wodeTitle">
          <div class="left">收藏歌单</div>
        </div>
        <div class="mySongListList">
          <div
            class="mySongListListItem"
            v-for="(item, index) in songList"
            :key="index"
            @click="openPopup(item.id)"
          >
            <music-minicard :miniData="item" :type="'songs'"></music-minicard>
          </div>
        </div>
      </div>
      <!-- 创建歌单 -->
      <div class="foundList">
        <div class="wodeTitle">
          <div class="left">创建歌单</div>
        </div>
        <div class="foundListList">
          <div
            class="foundListListItem"
            v-for="(item, index) in foundList"
            :key="index"
            @click="openPopup(item.id)"
          >
            <music-minicard :miniData="item"></music-minicard>
          </div>
        </div>
      </div>
    </div>
    <div class="noLogin" v-else>请登录以查看更多内容</div>
    <!-- 歌单popup -->
    <!-- 歌单详情组件 -->
    <transition name="gedanInfo">
      <gedanInfo v-if="showGedanInfo" :res="showGedanInfoRes" @closePopup="closePopup"></gedanInfo>
    </transition>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      zuijinbofang: null,
      songList: null,
      foundList: null,
      showGedanInfo: false,
      showGedanInfoRes: null,
      myMusic: [
        {
          icon: require("./../assets/icon/like.png"),
          name: "我喜欢的音乐",
          sec: "心动模式",
          to: "/wode/init/like",
        },
        {
          icon: require("./../assets/icon/fm.png"),
          name: "私人FM",
          sec: "听点新鲜的",
          to: "/wode/init/fm",
        },
        {
          icon: require("./../assets/icon/tuijian.png"),
          name: "单曲为你推荐",
          sec: "助力好歌",
          to: "/infoPage?type=tuijian",
        },
        {
          icon: require("./../assets/icon/good.png"),
          name: "歌单为你推荐",
          sec: "助力好歌单",
          to: "/infoPage?type=gedan",
        },
      ],
    };
  },
  methods: {
    // 签到
    qiandao() {
      this.$axios({
        url: `/daily_signin?cookie=${localStorage.getItem(
          "cloudMusicUserCookie"
        )}&timestamp=${new Date().getTime()}`,
      })
        .then((res) => {
          Toast({
            message: "签到成功",
            position: "bottom",
            duration: 2000,
          });
        })
        .catch((err) => {
          Toast({
            message: "今天已签到",
            position: "bottom",
            duration: 2000,
          });
        });
    },
    // 切换全局弹窗
    taggleGlobalPopup() {
      let globalPopup = Object.assign({}, this.$store.state.globalPopup);
      globalPopup.show = true;
      this.$store.commit("setGlobalPopup", globalPopup);
    },
    // 播放最近音乐
    bofang(item) {
      this.playSing(item.song.id, 0);
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
      let player = Object.assign({}, this.$store.state.player);
      player.src = res[0].data[0].url;
      player.name = res[1].songs[0].name;
      player.singer = res[1].songs[0].ar[0].name;
      player.img = res[1].songs[0].al.picUrl;
      player.play = true;
      player.index = index;
      this.$store.commit("setPlayer", player);
    },
    // 打开popup
    async openPopup(id) {
      let res = await this.$axios({
        url: `/playlist/detail?id=${id}&cookie=${
          this.hasLogin ? localStorage.getItem("cloudMusicUserCookie") : ""
        }`,
      });
      this.showGedanInfoRes = res.data.playlist;
      this.showGedanInfo = true;
    },
    // 关闭popup
    closePopup() {
      this.showGedanInfo = false;
    },
    // 前往用户登录页面
    toUserInfo() {
      if (this.hasLogin) return;
      this.$router.push("/userInfo");
    },
    // 获取最近播放数据
    getUserSongData() {
      return this.$axios({
        url: `/user/record?uid=${localStorage.getItem(
          "cloudMusicUserId"
        )}&type=1&timestamp=${new Date().getTime()}`,
      });
    },
    // 收藏歌单
    getUserSongList() {
      return this.$axios({
        url: `/user/playlist?uid=${localStorage.getItem("cloudMusicUserId")}`,
      });
    },
    // 创建歌单
    getUserFoundList() {
      return this.$axios({
        url: `/user/playlist?uid=${localStorage.getItem(
          "cloudMusicUserId"
        )}&cookie=${localStorage.getItem("cloudMusicUserCookie")}`,
      });
    },
    // 页面初始化
    async createdHandle() {
      // 初始化最近播放列表
      let zuijinbofang = await this.getUserSongData();
      this.zuijinbofang = zuijinbofang.data.weekData.splice(0, 12);
      // 初始化用户收藏歌单列表
      let songList = await this.getUserSongList();
      this.songList = [].concat(songList.data.playlist);
      // 初始化用户创建歌单列表(去掉与收藏歌单列表重复的项, 即为用户创建歌单)
      let foundList = await this.getUserFoundList();
      foundList = foundList.data.playlist;
      for (let i = 0; i < foundList.length; i++) {
        for (let k = 0; k < songList.data.playlist.length; k++) {
          if (songList.data.playlist[k].id === foundList[i].id) {
            foundList.splice(i, 1);
            songList.data.playlist.splice(k, 1);
            i--;
            break;
          }
        }
      }
      this.foundList = foundList;
    },
  },
  async created() {},
  mounted() {},
  computed: {
    hasLogin() {
      let result = this.$store.state.hasLogin;
      if (result) this.createdHandle();
      return this.$store.state.hasLogin;
    },
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  filters: {},
  components: {
    "music-minicard": () => import("./../components/miniCard.vue"),
    gedanInfo: () => import("./../components/infoPage/infoPage_songList"),
  },
  watch: {
    $route() {},
  },
};
</script>

<style lang='less' scoped>
@import url("./../lib/less/viewLess/wode.less");
</style>