<template>
  <div id="infoPageSongList" v-if="res !== null">
    <div class="bg">
      <img :src="userInfo.backgroundUrl || './../../assets/bg/bg.jpg'" />
    </div>
    <div class="header">
      <div class="bg">
        <img :src="userInfo.backgroundUrl || './../../assets/bg/bg.jpg'" />
      </div>
      <div class="middle">
        <div class="img">
          <img :src="res.backgroundCoverUrl || res.coverImgUrl" />
        </div>
        <div class="info">
          <div class="name">{{res.name}}</div>
          <div class="artical">
            <img :src="res.creator.avatarUrl" class="articalImg" />
            <div class="articalName">{{res.creator.nickname}}</div>
          </div>
          <div class="dscribe">{{res.description}}</div>
        </div>
      </div>
    </div>
    <div class="infoPageSongListMain">
      <div class="list">
        <div
          class="item"
          v-for="(item, index) in res.tracks"
          :key="index"
          @click="playSing(item.id, index)"
        >
          <div class="index">{{index+1}}</div>
          <div class="content">
            <div class="content_name">{{item.name}}</div>
            <div class="content_artical">
              <span v-for="(init, index) in item.ar" :key="index">{{init.name}}</span>
            </div>
          </div>
          <div class="iconPlay">
            <img src="./../../assets/icon/playVideo.png" />
          </div>
        </div>
      </div>
    </div>
    <div class="backBtn" @click="close">
      <img src="./../../assets/icon/backtwo.png" />
    </div>
  </div>
  <div v-else></div>
</template>

<script>
import { Toast } from "mint-ui";
export default {
  data() {
    return {};
  },
  methods: {
    // 关闭popup
    close() {
      this.$emit("closePopup", false);
    },
    // 添加歌单歌曲到待放列表
    async addListToLocal() {
      let idArr = [];
      for (let i = 0; i < this.res.tracks.length; i++) {
        if (this.res.tracks[i].id) idArr.push(this.res.tracks[i].id);
      }
      idArr = idArr.join(",");
      let result = await this.$axios({
        url: `/song/url?id=${idArr}`,
      });
      result = result.data.data;
      let storeArr = [];
      for (let k = 0; k < result.length; k++) {
        storeArr.push({
          name: this.res.tracks[k].name,
          src: result[k].url,
          singer: this.res.tracks[k].ar[0].name,
          img: this.res.tracks[k].al.picUrl,
          id: this.res.tracks[k].id,
        });
      }
      this.$store.commit("setMusicList", storeArr);
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
      this.addListToLocal();
    },
  },
  created() {},
  mounted() {},
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    loading() {
      return this.$store.state.loading;
    },
  },
  filters: {},
  components: {},
  watch: {
    $route() {},
  },
  props: ["res"],
};
</script>

<style lang='less' scoped>
@rate: 50;
#infoPageSongList {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: calc(100% - 55rem / @rate);
  background-color: pink;
  z-index: 99;
  overflow: hidden;
}
.bg {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  img {
    display: block;
    height: 667rem / @rate;
    position: absolute;
    left: 50%;
    z-index: -1;
    transform: translateX(-50%);
    filter: brightness(60%);
  }
}
.backBtn {
  position: absolute;
  right: 20rem / @rate;
  bottom: 20rem / @rate;
  width: 45rem / @rate;
  height: 45rem / @rate;
  border-radius: 50%;
  background: #ffdfe4;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 12;
  img {
    width: 20rem / @rate;
    height: 20rem / @rate;
    display: block;
  }
}
.header {
  position: relative;
  overflow: hidden;
  height: 180rem / @rate;
  z-index: 10;
  padding: 20rem / @rate 12rem / @rate 0;
  .bg {
    img {
      filter: blur(20rem / @rate);
    }
  }
  .middle {
    height: 140rem / @rate;
    display: flex;
    .img {
      width: 140rem / @rate;
      height: 140rem / @rate;
      img {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 10rem / @rate;
      }
    }
    .info {
      flex: 1;
      padding-left: 16rem / @rate;
      .name {
        font-size: 20rem / @rate;
        height: 50rem / @rate;
        color: #fff;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        margin: 6rem / @rate 0 10rem / @rate 0;
        text-shadow: 0 0 3rem / @rate #505050;
      }
      .artical {
        display: flex;
        align-items: center;
        margin-bottom: 10rem / @rate;
        .articalImg {
          height: 20rem / @rate;
          width: 20rem / @rate;
          border-radius: 50%;
          margin-right: 6rem / @rate;
        }
        .articalName {
          font-size: 10rem / @rate;
          vertical-align: middle;
          color: #fff;
          overflow: hidden;
          text-overflow: ellipsis;
          text-shadow: 0 0 1rem / @rate #505050;
        }
      }
      .dscribe {
        font-size: 10rem / @rate;
        color: #eeeeee;
        height: 38rem / @rate;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        text-shadow: 0 0 1rem / @rate #505050;
      }
    }
  }
}
.infoPageSongListMain {
  position: relative;
  z-index: 10;
  height: calc(100% - 180rem / @rate);
  overflow-y: auto;
  .list {
    .item {
      height: 60rem / @rate;
      display: flex;
      align-items: center;
      transition: background-color 0.3s ease;
      &:active {
        background-color: rgba(255, 255, 255, 0.3);
      }
      .index {
        min-width: 50rem / @rate;
        height: 60rem / @rate;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 18rem / @rate;
        color: #fff;
        text-shadow: 0 0 3rem / @rate #505050;
      }
      .content {
        width: 250rem / @rate;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .content_name {
          font-size: 14rem / @rate;
          color: #fff;
          text-shadow: 0 0 3rem / @rate #505050;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .content_artical {
          height: 20rem / @rate;
          display: flex;
          align-items: center;
          span {
            font-size: 10rem / @rate;
            color: #eeeeee;
            margin-right: 5rem / @rate;
          }
        }
      }
      .iconPlay {
        width: 30rem / @rate;
        height: 30rem / @rate;
        border-radius: 50%;
        border: 1.5rem / @rate solid #eeeeee;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 30rem / @rate;
        img {
          display: block;
          width: 15rem / @rate;
          height: 15rem / @rate;
        }
      }
    }
  }
}
</style>