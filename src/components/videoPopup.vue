<template>
  <div id="videoPopup" ref="videoPopup">
    <!-- 视频区域 -->
    <div class="body" v-if="res !== null">
      <div class="video">
        <video :src="res.url" controls></video>
      </div>
      <div class="title">{{res.name}}</div>
      <div class="info">
        <div class="count" v-if="res.playCount">{{res.playCount}}次播放</div>
        <div class="time">{{res.publishTime | pushTimeHandle}}发布</div>
      </div>
      <div class="desc">{{res.desc}}</div>
      <div class="artival">发布者:{{res.artical || res.artists[0].name}}</div>
    </div>
    <!-- 相关视频区域 -->
    <div class="xiangguan">
      <div class="title">相关视频</div>
      <div class="xiangguanList">
        <div
          class="xiangguanItem"
          v-for="(item, index) in xiangguan"
          :key="index"
          @click="taggleVideo(item.vid)"
        >
          <div class="left">
            <img :src="item.coverUrl" />
            <div class="playInfo">{{item.durationms}}</div>
          </div>
          <div class="right">
            <div class="infoTitle">{{item.title}}</div>
            <div
              class="infoSec"
            >{{item.durationms | time}}&nbsp;by&nbsp;{{item.creator[0].userName}}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 评论区域 -->
    <div class="pinglun"></div>
    <!-- 返回按钮 -->
    <div class="back" @click="close">
      <img src="./../assets/icon/backtwo.png" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      res: null,
      xiangguan: null,
    };
  },
  methods: {
    // 切换相关视频
    async taggleVideo(id) {
      let res = await this.$axios({
        url: `/video/detail?id=${id}`,
      });
      let src = await this.$axios({
        url: `/video/url?id=${id}`,
      });
      res = res.data.data;
      src = src.data.urls[0].url;
      res = {
        name: res.title,
        desc: res.description,
        publishTime: res.publishTime,
        artical: res.creator.nickname,
        url: src,
      };
      this.res = res;
      this.$refs.videoPopup.scrollTo(0, 0);
    },
    // 关闭弹出层
    close() {
      this.$emit("close");
    },
    // 获取相关视频信息
    async getXiangguan(id) {
      let res = await this.$axios({
        url: `/related/allvideo?id=${this.item.id}`,
      });
      this.xiangguan = res.data.data;
    },
  },
  created() {
    this.res = this.item;
    this.getXiangguan(this.item.id);
  },
  mounted() {},
  computed: {},
  filters: {
    // 处理一下过滤器过滤时间
    time(val) {
      let mon = Math.floor(val / 1000 / 60);
      mon = mon >= 10 ? mon : "0" + mon;
      let sec = Math.floor((val - mon * 1000 * 60) / 1000);
      sec = sec >= 10 ? sec : "0" + sec;
      return `${mon}:${sec}`;
    },
    // 处理发布日期
    pushTimeHandle(val) {
      if (typeof val === "string") return val;
      let date = new Date(val);
      let year = date.getFullYear();
      let mon = date.getMonth() + 1;
      let day = date.getDate();
      mon = mon >= 10 ? mon : "0" + mon;
      day = day >= 10 ? day : "0" + day;
      return `${year}-${mon}-${day}`;
    },
  },
  components: {},
  watch: {
    $route() {},
    item() {
      this.res = this.item;
    },
  },
  props: ["item"],
};
</script>

<style lang='less' scoped>
@rate: 50;
#videoPopup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 800;
  background-color: #000;
  color: #fff;
  overflow-y: auto;
}
.video {
  video {
    width: 100%;
    height: auto;
  }
}
.title {
  color: #fff;
  font-size: 16rem / @rate;
  font-weight: bold;
  white-space: normal;
  word-break: break-all;
  padding: 0 12rem / @rate;
  margin-bottom: 12rem / @rate;
}
.info {
  display: flex;
  padding: 0 12rem / @rate;
  .count,
  .time {
    color: #eeeeee;
    font-size: 7rem / @rate;
    padding: 1rem / @rate 3rem / @rate;
    background-color: rgba(255, 255, 255, 0.3);
    margin: 0 6rem / @rate;
    &:first-child {
      margin-left: 0;
    }
  }
}
.desc {
  font-size: 12rem / @rate;
  word-break: break-all;
  white-space: normal;
  line-height: 1.2;
  color: #eeeeee;
  padding: 0 12rem / @rate;
  margin-top: 7rem / @rate;
}
.artival {
  padding: 10rem / @rate 12rem / @rate;
  color: #eeeeee;
  font-size: 14rem / @rate;
}
.xiangguan {
  .title {
    margin-top: 16rem / @rate;
  }
}
.xiangguanList {
  padding: 0 12rem / @rate;
  .xiangguanItem {
    margin-top: 12rem / @rate;
    display: flex;
    &:last-child {
      margin-bottom: 12rem / @rate;
    }
    .left {
      width: 120rem / @rate;
      height: 80rem / @rate;
      position: relative;
      border-radius: 8rem / @rate;
      overflow: hidden;
      margin-right: 10rem / @rate;
      img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .playInfo {
        font-size: 10rem / @rate;
        position: absolute;
        right: 5rem / @rate;
        top: 3rem / @rate;
        color: #fff;
        text-shadow: 0 0 1rem / @rate #505050;
      }
    }
    .right {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 220rem / @rate;
      .infoTitle {
        color: #fff;
        font-size: 14rem / @rate;
        margin-bottom: 7rem / @rate;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .infoSec {
        font-size: 12rem / @rate;
        color: #eeeeee;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
.back {
  width: 50rem / @rate;
  height: 50rem / @rate;
  position: fixed;
  bottom: 20rem / @rate;
  right: 25rem / @rate;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  overflow: hidden;
  background-image: radial-gradient(
    circle,
    rgba(0, 0, 0, 0.8),
    rgba(255, 255, 255, 0.8)
  );
  img {
    display: block;
    width: 30rem / @rate;
    height: 30rem / @rate;
  }
}
</style>