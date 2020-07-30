<template>
  <div id="musicSwiper" ref="bannerBox" v-if="showBanner !== 0">
    <!-- 完成轮播图 -->
    <mt-swipe :auto="4000">
      <mt-swipe-item v-for="(item, index) in list" :key="index">
        <img :src="item.imageUrl" class="imgItem" @click="playSing(item.encodeId)" />
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
    playSing(id) {
      console.log(id);
    },
  },
  created() {},
  mounted() {},
  computed: {
    showBanner() {
      return this.list.length;
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
#musicSwiper {
  height: 100%;
  width: 100%;
}
.imgItem {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>