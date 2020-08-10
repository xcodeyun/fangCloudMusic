<template>
  <div id="infoPagePaihangbang">
    <div class="tuijian">
      <div class="title">榜单推荐</div>
      <div class="tuijianList" v-if="tuijian !== null">
        <div
          class="tuijianItem"
          v-for="(item, index) in tuijian"
          :key="index"
          @click="openSongList(item)"
        >
          <div class="img">
            <img :src="item.coverImgUrl" />
            <div class="ball">{{item.updateFrequency}}</div>
          </div>
          <div class="text">{{item.name}}</div>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="title">官方榜单</div>
      <div class="paihangList" v-if="paihang !== null">
        <div
          class="paihangItem"
          v-for="(item, index) in paihang"
          :key="index"
          @click="openSongList(item)"
        >
          <div class="left">
            <img :src="item.coverImgUrl" />
            <div class="ball">{{item.updateFrequency}}</div>
          </div>
          <div class="right">
            <div class="rightTitle">{{item.name}}</div>
            <ul class="infoList">
              <li
                v-for="(init, kndex) in item.tracks"
                :key="kndex"
              >{{kndex+1}}.{{init.first}}-{{init.second}}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="title">其他榜单</div>
      <div class="qitaList" v-if="qita !== null">
        <div
          class="qitaItem"
          v-for="(item, index) in qita"
          :key="index"
          @click="openSongList(item)"
        >
          <div class="img">
            <img :src="item.coverImgUrl" />
            <div class="ball">{{item.updateFrequency}}</div>
          </div>
          <div class="text">{{item.name}}</div>
        </div>
      </div>
    </div>
    <!-- 弹窗 -->
    <transition name="gedanInfo">
      <gedanInfo v-if="showGedanInfo" :res="showGedanInfoRes" @closePopup="closePopup"></gedanInfo>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tuijian: null,
      paihang: null,
      qita: null,
      showGedanInfo: null,
      showGedanInfoRes: null,
    };
  },
  methods: {
    async openSongList(item) {
      let res = await this.$axios({
        url: `/playlist/detail?id=${item.id}`,
      });
      this.showGedanInfoRes = res.data.playlist;
      this.showGedanInfo = true;
    },
    closePopup() {
      this.showGedanInfo = false;
    },
  },
  created() {
    this.$axios({ url: `/toplist/detail` }).then((res) => {
      this.paihang = res.data.list.slice(0, 4);
      this.tuijian = res.data.list.slice(4, 7);
      this.qita = res.data.list.slice(7);
    });
  },
  mounted() {},
  computed: {},
  filters: {},
  components: {
    gedanInfo: () => import("./infoPage_songList"),
  },
  watch: {
    $route() {},
  },
};
</script>

<style lang='less' scoped>
@rate: 50;
#infoPagePaihangbang {
  padding-top: 60rem / @rate;
}
.title {
  font-size: 16rem / @rate;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 0 3rem / @rate #505050;
  padding: 8rem / @rate 0;
}
.tuijian {
  margin-bottom: 20rem / @rate;
  padding: 0 14rem / @rate;
  .tuijianList {
    display: flex;
    justify-content: space-between;
    .tuijianItem {
      width: 110rem / @rate;
      height: 140rem / @rate;
      .img {
        overflow: hidden;
        width: 110rem / @rate;
        height: 110rem / @rate;
        border-radius: 8rem / @rate;
        position: relative;
        margin-bottom: 5rem / @rate;
        img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .ball {
          position: absolute;
          bottom: 5rem / @rate;
          left: 5rem / @rate;
          font-size: 8rem / @rate;
          color: #fff;
          text-shadow: 0 0 1rem / @rate #505050;
        }
      }
      .text {
        font-size: 12rem / @rate;
        color: #fff;
        text-shadow: 0 0 1rem / @rate #505050;
        white-space: normal;
        word-break: break-all;
      }
    }
  }
}
.main {
  padding: 0 14rem / @rate;
  height: 355rem / @rate;
  overflow-y: auto;
  .paihangList {
    .paihangItem {
      margin: 8rem / @rate 0;
      display: flex;
      align-items: center;
      .left {
        width: 100rem / @rate;
        height: 100rem / @rate;
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
        .ball {
          position: absolute;
          left: 6rem / @rate;
          bottom: 3rem / @rate;
          font-size: 8rem / @rate;
          text-shadow: 0 0 1rem / @rate #505050;
          color: #fff;
        }
      }
      .right {
        flex: 1;
        height: 120rem / @rate;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .rightTitle {
          font-size: 14rem / @rate;
          text-shadow: 0 0 2rem / @rate #505050;
          color: #fff;
        }
        .infoList {
          margin-top: 12rem / @rate;
          li {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 12rem / @rate;
            color: #fff;
            text-shadow: 0 0 1rem / @rate #505050;
            margin-bottom: 5rem / @rate;
            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
    }
  }
  .qitaList {
    display: flex;
    flex-wrap: wrap;
    .qitaItem {
      width: 110rem / @rate;
      height: 140rem / @rate;
      margin-right: 5rem / @rate;
      &:nth-child(3n) {
        margin-right: 0;
      }
      .img {
        overflow: hidden;
        width: 110rem / @rate;
        height: 110rem / @rate;
        border-radius: 8rem / @rate;
        position: relative;
        margin-bottom: 5rem / @rate;
        img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .ball {
          position: absolute;
          bottom: 5rem / @rate;
          left: 5rem / @rate;
          font-size: 8rem / @rate;
          color: #fff;
          text-shadow: 0 0 1rem / @rate #505050;
        }
      }
      .text {
        font-size: 12rem / @rate;
        color: #fff;
        text-shadow: 0 0 1rem / @rate #505050;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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