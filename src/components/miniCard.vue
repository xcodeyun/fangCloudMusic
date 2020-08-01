<template>
  <div id="miniCard" @click="taggleSong(miniData.id || miniData.song.al.id)">
    <div class="miniCard_img">
      <img :src="miniData.coverImgUrl || miniData.song.al.picUrl" />
    </div>
    <div class="miniCard_info">
      <div class="miniCard_title">{{miniData.name || miniData.song.al.name}}</div>
      <div class="miniCard_actical" v-if="!miniData.coverImgUrl">
        <span
          v-for="(item, index) in miniData.song.ar"
          :key="index"
        >{{index == 0 ? item.name : '/'+item.name}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    taggleSong(id) {
      console.log(id);
    },
  },
  created() {},
  mounted() {},
  computed: {},
  filters: {},
  components: {},
  watch: {
    $route() {},
  },
  props: ["miniData"],
};
</script>

<style lang='less' scoped>
@rate: 50;
#miniCard {
  width: 100%;
  display: flex;
  justify-content: space-between;
  transition: background-color 0.3s ease;
  border-radius: 10rem / @rate;
  overflow: hidden;
  &:active {
    background-color: rgba(255, 255, 255, 0.5);
  }
  .miniCard_img {
    height: 70rem / @rate!important;
    width: 70rem / @rate!important;
    min-width: 70rem / @rate;
    border-radius: 10rem / @rate;
    overflow: hidden;
    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .miniCard_info {
    max-height: 70rem;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    padding: 0 6rem / @rate;
    font-size: 14rem / @rate;
    .miniCard_title {
      white-space: normal;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      user-select: none;
    }
    .miniCard_actical {
      color: #a5a5a5;
      font-size: 10rem / @rate;
      margin-top: 18rem / @rate;
    }
  }
}
</style>