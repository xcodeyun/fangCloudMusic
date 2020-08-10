<template>
  <div id="dongtaiCard" v-if="res !== null">
    <div class="userArea">
      <div class="headPortrait">
        <img :src="res.user.avatarUrl" />
      </div>
      <div class="info">
        <div class="nickname">{{res.user.nickname}}</div>
        <div class="showTime">{{res.showTime | handleTime}}</div>
      </div>
      <div class="type" v-if="res.type == 13">分享歌单</div>
      <div class="type" v-else-if="res.type == 35">分享文本</div>
      <div class="type" v-else-if="res.type == 22">转发</div>
      <div class="type" v-else-if="res.type == 24">分享专栏文章</div>
      <div class="type" v-else-if="res.type == 18 || res.type == 19">分享单曲</div>
    </div>
    <div class="main">
      <div class="main_text" v-html="handleMsg"></div>
      <div class="main_img" v-if="res.pics.length !== 0">
        <div class="img" v-for="(item, index) in res.pics" :key="index">
          <img :src="item.squareUrl" />
        </div>
      </div>
      <div class="main_interaction" v-if="res.type !== 35 || res.type !== 22 || res.type !== 24">
        <!-- 歌单 -->
        <div class="interaction" v-if="res.type == 13" @click="toSongList(res.id)">
          <div class="interactionImg">
            <img :src="handleInfo.playlist.coverImgUrl" />
          </div>
          <div class="interactionInfo">
            <div class="top">{{handleInfo.playlist.name}}</div>
            <div class="bottom">by {{handleInfo.playlist.creator.nickname}}</div>
          </div>
        </div>
        <!-- 单曲 -->
        <div class="interaction" v-else-if="res.type == 18" @click="toSongPlay(handleInfo.song.id)">
          <div class="interactionImg">
            <img :src="handleInfo.song.album.blurPicUrl" />
          </div>
          <div class="interactionInfo">
            <div class="top">{{handleInfo.song.name}}</div>
            <div class="bottom">by {{handleInfo.song.album.artists[0].name}}</div>
          </div>
        </div>
        <!-- 专辑/单曲 -->
        <div class="interaction" v-else-if="res.type == 19" @click="toSongPlay(res.id)">
          <div class="interactionImg">
            <img :src="handleInfo.album.blurPicUrl" />
          </div>
          <div class="interactionInfo">
            <div class="top">{{handleInfo.album.name}}</div>
            <div class="bottom">by {{handleInfo.album.artist.name}}</div>
          </div>
        </div>
        <!-- 视频 -->
        <div class="interaction" v-else-if="res.type == 39">
          <div class="interactionVideo">
            <div class="interactionVideoTitle">{{handleInfo.video.title}}</div>
            <div class="interactionVideoMain" v-if="video !== ''">
              <video :src="video" controls></video>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="zhanweifu"></div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      video: "",
    };
  },
  methods: {
    // 处理视频播放路径
    getVideoUrl() {
      let val = this.handleInfo.video.videoId;
      let res = this.$axios({
        url: `/video/url?id=${val}&cookie=${localStorage.getItem(
          "cloudMusicUserCookie"
        )}`,
      }).then((res) => {
        this.video = res.data.urls[0].url;
      });
    },
    // 播放
    async toSongPlay(id) {
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
      this.$tool.getMusicUrl(id).then((res) => {
        this.addSong(res, id);
        this.$store.commit("setLoading", false);
      });
    },
    addSong(res, id) {
      if (res === null) {
        return Toast({
          message: "抱歉,暂无版权!",
          position: "bottom",
          duration: 2000,
        });
      }
      let player = Object.assign({}, this.$store.state.player);
      player.src = res[0].data[0].url;
      player.name = res[1].songs[0].name;
      player.singer = res[1].songs[0].ar[0].name;
      player.img = res[1].songs[0].al.picUrl;
      player.play = true;
      this.$store.commit("setPlayer", player);
      // 将歌曲加入到歌单里,以支撑歌词页面
      let data = [
        {
          name: res[1].songs[0].name,
          src: res[0].data[0].url,
          singer: res[1].songs[0].ar[0].name,
          img: res[1].songs[0].al.picUrl,
          id,
        },
      ];
      this.$store.commit("setMusicList", data);
    },
    // 跳到歌单页
    toSongList(id) {
      console.log(id);
    },
  },
  created() {
    // 如果是视频数据,则处理其内容
    if (this.res.type === 39) {
      this.getVideoUrl();
    }
  },
  mounted() {},
  computed: {
    handleInfo() {
      return JSON.parse(this.res.json);
    },
    handleMsg: function () {
      let val = JSON.parse(this.res.json).msg;
      if (val) {
        val = val.replace(/\n/g, "<br>");
        return val;
      }
    },
    loading() {
      return this.$store.state.loading;
    },
  },
  filters: {
    handleTime: function (val) {
      let date = new Date();
      date.setTime(val);
      let year = date.getFullYear();
      let month =
        date.getMonth() + 1 > 10
          ? date.getMonth() + 1
          : "0" + (date.getMonth() + 1);
      let day = date.getDate() > 10 ? date.getDate() : "0" + date.getDate();
      let hours =
        date.getHours() > 10 ? date.getHours() : "0" + date.getHours();
      let mon =
        date.getMinutes() > 10 ? date.getMinutes() : "0" + date.getMinutes();
      return `${year}年${month}月${day}日  ${hours}:${mon}`;
    },
  },
  components: {},
  watch: {
    $route() {},
  },
  props: ["res"],
};
</script>

<style lang='less' scoped>
@rate: 50;
.userArea {
  height: 55rem / @rate;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .headPortrait {
    width: 40rem / @rate;
    height: 40rem / @rate;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 12rem / @rate;
    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .info {
    flex: 1;
    height: 40rem / @rate;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .nickname {
      font-size: 14rem / @rate;
      color: #92b5db;
    }
    .showTime {
      font-size: 12rem / @rate;
      color: #ded4d5;
      margin-top: 6rem / @rate;
    }
  }
  .type {
    margin: 0 12rem / @rate;
    font-size: 14rem / @rate;
    color: #ffffff;
  }
}
.main {
  padding-left: 64rem / @rate;
  .main_text {
    line-height: 1.4;
    letter-spacing: 1rem / @rate;
    font-size: 13rem / @rate;
    color: #fff;
    text-shadow: 0 0 1rem / @rate #505050;
    margin-bottom: 10rem / @rate;
    padding-right: 15rem / @rate;
    white-space: normal;
    word-break: break-all;
    width: 100%;
    overflow: hidden;
  }
  .main_img {
    width: calc(100% - 12rem / @rate);
    overflow-x: auto;
    white-space: nowrap;
    height: 105rem / @rate;
    font-size: 0;
    .img {
      display: inline-block;
      width: 100rem / @rate;
      height: 100rem / @rate;
      border-radius: 10rem / @rate;
      overflow: hidden;
      margin-right: 5rem / @rate;
      img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}
.interaction {
  width: calc(100% - 12rem / @rate);
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4rem / @rate;
  padding: 10rem / @rate;
  display: flex;
  align-items: center;
  .interactionImg {
    width: 45rem / @rate;
    height: 45rem / @rate;
    border-radius: 8rem / @rate;
    overflow: hidden;
    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .interactionInfo {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin: 0 7rem / @rate;
    .top {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 200rem / @rate;
      font-size: 14rem / @rate;
      color: #fff;
      text-shadow: 0 0 1rem / @rate #505050;
    }
    .bottom {
      color: #f1f1f1;
      font-size: 10rem / @rate;
      text-shadow: 0 0 1rem / @rate #505050;
      margin-top: 5rem / @rate;
    }
  }
  .interactionVideo {
    width: 100%;
    display: flex;
    flex-direction: column;
    .interactionVideoTitle {
      font-size: 12rem / @rate;
      color: #fff;
      text-shadow: 0 0 1rem / @rate #505050;
      margin-bottom: 8rem / @rate;
    }
    .interactionVideoMain {
      width: 100%;
      height: 150rem / @rate;
      border-radius: 7rem / @rate;
      video {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }
}
.zhanweifu {
  height: 20rem / @rate;
}
</style>