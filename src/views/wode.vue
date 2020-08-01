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
        <div class="loginBtn" v-else>签到</div>
      </div>
      <div class="bottom" v-if="hasLogin">
        <div class="bottomItem">
          <div class="img">
            <img src="./../assets/icon/music.png" />
          </div>
          <div class="info">正在播放</div>
        </div>
        <div class="bottomItem">
          <div class="img">
            <img src="./../assets/icon/diantai.png" />
          </div>
          <div class="info">我的电台</div>
        </div>
        <div class="bottomItem">
          <div class="img">
            <img src="./../assets/icon/Star.png" />
          </div>
          <div class="info">我的收藏</div>
        </div>
        <div class="bottomItem">
          <div class="img">
            <img src="./../assets/icon/yinyuechangpian.png" />
          </div>
          <div class="info">关注新歌</div>
        </div>
      </div>
    </div>
    <div class="main" v-if="hasLogin">
      <!-- 最近播放 -->
      <div class="zuijinbofang" v-if="zuijinbofang !== null">
        <div class="wodeTitle">
          <div class="left">最近播放</div>
          <div class="right">更多</div>
        </div>
        <div class="zuijinbofangList">
          <div class="zuijinbofangItem" v-for="(item, index) in zuijinbofang" :key="index">
            <music-minicard :miniData="item"></music-minicard>
          </div>
        </div>
      </div>
      <!-- 我的音乐 -->
      <div class="myMusic">
        <div class="wodeTitle">
          <div class="left">我的音乐</div>
          <div class="right">更多</div>
        </div>
        <div class="myMusicList">
          <div class="myMusicItem" v-for="(item, index) in myMusic" :key="index">
            <div class="item_content">
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
          <div class="mySongListListItem" v-for="(item, index) in songList" :key="index">
            <music-minicard :miniData="item"></music-minicard>
          </div>
        </div>
      </div>
      <!-- 创建歌单 -->
      <div class="foundList">
        <div class="wodeTitle">
          <div class="left">创建歌单</div>
        </div>
        <div class="foundListList">
          <div class="foundListListItem" v-for="(item, index) in foundList" :key="index">
            <music-minicard :miniData="item"></music-minicard>
          </div>
        </div>
      </div>
    </div>
    <div class="noLogin" v-else>请登录以查看更多内容</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      zuijinbofang: null,
      songList: null,
      foundList: null,
      myMusic: [
        {
          icon: require("./../assets/icon/like.png"),
          name: "我喜欢的音乐",
          sec: "心动模式",
          to: "like",
        },
        {
          icon: require("./../assets/icon/fm.png"),
          name: "私人FM",
          sec: "听点新鲜的",
          to: "fm",
        },
        {
          icon: require("./../assets/icon/tuijian.png"),
          name: "单曲为你推荐",
          sec: "助力好歌",
          to: "odd",
        },
        {
          icon: require("./../assets/icon/good.png"),
          name: "歌单为你推荐",
          sec: "助力好歌单",
          to: "songList",
        },
      ],
    };
  },
  methods: {
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
        )}&type=1`,
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
  },
  watch: {
    $route() {},
  },
};
</script>

<style lang='less' scoped>
@import url("./../lib/less/viewLess/wode.less");
</style>