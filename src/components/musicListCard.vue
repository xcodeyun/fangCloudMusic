<template>
  <div id="musicListCard">
    <mt-swipe :show-indicators="false" :auto="0" v-if="handle.length !== 0">
      <mt-swipe-item v-for="(item, index) in handle" :key="index">
        <div
          class="cardList"
          v-for="(initItem, initIndex) in item"
          :key="initIndex"
          @click="playTheSong(initItem.id)"
        >
          <div class="img">
            <img :src="initItem.picUrl" />
          </div>
          <div class="title">{{initItem.name}}</div>
          <div class="playIcon">
            <img src="./../assets/icon/play_full.png" />
          </div>
        </div>
      </mt-swipe-item>
    </mt-swipe>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    playTheSong(id) {
      console.log(id);
    },
  },
  created() {},
  mounted() {},
  computed: {
    handle() {
      let result = [];
      let arr = [];
      for (let i = 0; i < this.list.length; i++) {
        if (i % 3 == 0 && i != 0) {
          result.push(arr);
          arr = [];
        }
        arr.push(this.list[i]);
      }
      return result;
    },
  },
  filters: {},
  components: {},
  watch: {
    $route() {},
  },
  props: ["list"],
};
</script>

<style lang='less' scoped>
@rate: 50;
#musicListCard {
  height: 100%;
}
.mint-swipe-item {
  display: flex !important;
  height: 100%;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
}
.cardList {
  width: 100%;
  height: 55rem / @rate;
  display: flex;
  align-items: center;
  .img {
    height: 55rem / @rate;
    width: 55rem / @rate;
    border-radius: 10rem / @rate;
    overflow: hidden;
    img {
      display: block;
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }
  .title {
    flex: 1;
    padding: 0 6rem / @rate;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14rem / @rate;
    color: #fff;
    text-shadow: 0 0 3rem / @rate #505050;
  }
  .playIcon {
    width: 30rem / @rate;
    height: 30rem / @rate;
    border: 1rem / @rate solid #fff;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10rem / @rate;
    img {
      display: block;
      width: 15rem / @rate;
      height: 15rem / @rate;
    }
  }
}
</style>