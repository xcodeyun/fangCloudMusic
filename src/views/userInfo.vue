<template>
  <div id="userInfo">
    <div class="bg">
      <img src="./../assets/bg/bg.jpg" />
    </div>
    <div class="content">
      <mt-swipe :auto="0" :show-indicators="false" :continuous="false">
        <!-- 登录页 -->
        <mt-swipe-item>
          <div class="title">
            登录
            <span>左滑进入注册</span>
          </div>
          <div class="form">
            <div class="iptBox">
              <p>手机号</p>
              <input
                autocomplete="off"
                type="number"
                id="phone"
                v-model="login.phone"
                @blur="handleInfo(phoneVerify(login.phone), 'login', 'phoneTips')"
              />
              <div class="tips">{{login.phoneTips}}</div>
            </div>
            <div class="iptBox">
              <p>密码</p>
              <input
                autocomplete="off"
                type="password"
                v-model="login.onePassword"
                @blur="handleInfo(pawVerify(login.onePassword), 'login', 'onePasswordTips')"
              />
              <div class="tips">{{login.onePasswordTips}}</div>
            </div>
            <div class="iptBox">
              <p>验证码</p>
              <div class="initBox">
                <input
                  autocomplete="off"
                  type="number"
                  class="yanzhengma"
                  v-model="login.verification"
                  @input="openBtn('loginReq', login.verification)"
                  maxlength="8"
                />
                <div class="btn" ref="loginBtn" @click="sendVerification(login, 'loginBtn')">发送验证码</div>
              </div>
            </div>
          </div>
          <button class="submitBtn" @click="sendReq(login, 'login')" disabled ref="loginReq">登录</button>
        </mt-swipe-item>
        <!-- 注册页 -->
        <mt-swipe-item>
          <div class="title">
            注册
            <span>右滑进入登录</span>
          </div>
          <div class="form">
            <div class="iptBox">
              <p>手机号</p>
              <input
                autocomplete="off"
                @blur="handleInfo(phoneVerify(register.phone), 'register', 'phoneTips')"
                type="number"
                id="phone"
                v-model="register.phone"
              />
              <div class="tips">{{register.phoneTips}}</div>
            </div>
            <div class="iptBox">
              <p>密码</p>
              <input
                autocomplete="off"
                @blur="handleInfo(pawVerify(register.onePassword), 'register', 'onePasswordTips')"
                type="password"
                v-model="register.onePassword"
              />
              <div class="tips">{{register.onePasswordTips}}</div>
            </div>
            <div class="iptBox">
              <p>请再次输入密码</p>
              <input
                autocomplete="off"
                type="password"
                v-model="register.twoPassword"
                @blur="handleInfo(againPawVerify(register.onePassword, register.twoPassword), 'register', 'twoPasswordTips')"
              />
              <div class="tips">{{register.twoPasswordTips}}</div>
            </div>
            <div class="iptBox">
              <p>验证码</p>
              <div class="initBox">
                <input
                  autocomplete="off"
                  type="number"
                  class="yanzhengma"
                  v-model="register.verification"
                  @input="openBtn('registerReq', register.verification)"
                  maxlength="8"
                />
                <div
                  class="btn"
                  ref="registerBtn"
                  @click="sendVerification(register, 'registerBtn')"
                >发送验证码</div>
              </div>
            </div>
          </div>
          <button
            class="submitBtn"
            @click="sendReq(register, 'register')"
            disabled
            ref="registerReq"
          >注册</button>
        </mt-swipe-item>
      </mt-swipe>
    </div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      vifFlog: true,
      login: {
        phone: "",
        onePassword: "",
        verification: "",
        phoneTips: "",
        onePasswordTips: "",
        vifFlog: true,
        canSend: false,
      },
      register: {
        phone: "",
        onePassword: "",
        twoPassword: "",
        verification: "",
        phoneTips: "",
        onePasswordTips: "",
        twoPasswordTips: "",
        vifFlog: true,
        canSend: false,
      },
    };
  },
  methods: {
    // 校验手机号
    phoneVerify(target) {
      return /^1[3456789]\d{9}$/.test(target);
    },
    // 校验密码
    pawVerify(target) {
      return /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![_]+$)[0-9_A-Za-z\.]{7,19}$/.test(
        target
      );
    },
    // 校验二次密码
    againPawVerify(oldVal, newVal) {
      let a = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![_]+$)[0-9_A-Za-z\.]{7,19}$/.test(
        oldVal
      );
      let b = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![_]+$)[0-9_A-Za-z\.]{7,19}$/.test(
        newVal
      );
      if (oldVal !== newVal) return false;
      if (!a || !b) return false;
      return true;
    },
    // 校验验证码是否正确
    codeVerify(phone, code) {
      if (!this.phoneVerify(phone)) return false;

      return this.$axios({
        url: `/captcha/verify?phone=${phone}&captcha=${code}`,
      })
        .then((res) => {
          if (res.data.code === 200) {
            return true;
          } else {
            return false;
          }
        })
        .catch((err) => err);
    },

    // 处理提示信息
    async handleInfo(judeg, obj, attr) {
      if (judeg == "verification") {
        let res = await this.codeVerify(obj, attr);
        if (!res) {
          Toast({
            message: "验证码错误",
            position: "top",
            duration: 3000,
          });
        }
        return;
      }
      if (judeg) return this.$set(this[obj], attr, "");
      else this.$set(this[obj], attr, "该项填写有误");
    },
    // 发送验证码
    sendVerification(obj, target) {
      if (!obj.vifFlog) return;
      let phone = obj.phone;
      if (!this.phoneVerify(phone))
        return Toast({
          message: "请填写正确的手机号",
          position: "top",
          duration: 3000,
        });
      this.$axios({
        url: `/captcha/sent`,
        data: { phone },
        method: "post",
      }).then((res) => {
        if (res.response.data && res.response.data.code === 400) {
          return Toast({
            message: "该手机号验证次数过多,请明天再试",
            position: "top",
            duration: 2500,
          });
        }
        if (res.data.code === 200)
          Toast({
            message: "验证码发送成功",
            position: "top",
            duration: 3000,
          });
        let time = 120;
        obj.vifFlog = false;
        this.$refs[target].className = "btn active";
        this.$refs[target].innerHTML = `重新发送(${time})`;
        window.vif = setInterval(() => {
          if (time === 1) {
            this.$refs[target].className = "btn";
            this.$refs[target].innerHTML = `发送验证码`;
            obj.vifFlog = true;
            clearInterval(window.vif);
            return;
          }
          this.$refs[target].className = "btn active";
          this.$refs[target].innerHTML = `重新发送(${--time})`;
        }, 1000);
      });
    },
    // 发起登录 or 注册
    async sendReq(obj, str) {
      if (!this.phoneVerify(obj.phone))
        return Toast({
          message: "手机号格式错误",
          position: "top",
          duration: 3000,
        });
      if (!this.pawVerify(obj.onePassword))
        return Toast({
          message: "密码格式错误",
          position: "top",
          duration: 3000,
        });
      if (str === "login") {
        // 登录逻辑
        let vifRes = await this.codeVerify(obj.phone, obj.verification);
        if (typeof vifRes === "object")
          return Toast({
            message: "验证码错误",
            position: "top",
            duration: 3000,
          });
        this.$axios({
          url: "/login/cellphone",
          method: "post",
          data: {
            phone: obj.phone,
            password: encodeURI(obj.onePassword),
          },
        }).then((res) => {
          if (res.data.code === 200) {
            // 登录成功后
            localStorage.setItem("cloudMusicUserCookie", res.data.cookie);
            localStorage.setItem("cloudMusicUserId", res.data.account.id);
            this.$store.commit("setUserLoginState", true);
            this.$router.push("/wode");
          } else {
            localStorage.removeItem("cloudMusicUserCookie");
            localStorage.removeItem("cloudMusicUserId");
            this.$store.commit("setUserLoginState", false);
            Toast({
              message: "账号或密码错误",
              position: "top",
              duration: 2500,
            });
            return window.location.reload();
          }
        });
      } else if (str === "register") {
        // 注册逻辑
        if (!this.againPawVerify(obj.onePassword, obj.twoPassword))
          return Toast({
            message: "两次密码输入错误",
            position: "top",
            duration: 3000,
          });
        let phoneInfo = await this.$axios({
          url: `/cellphone/existence/check?phone=${obj.phone}`,
        });
        if (phoneInfo.data.code === 200) {
          if (phoneInfo.data.exist === 1) {
            return Toast({
              message: "该手机号已经存在",
              position: "top",
              duration: 3000,
            });
          } else {
            // 所有验证通过, 进入注册
            return this.registerGo(obj);
          }
        } else {
          return Toast({
            message: "手机号验证异常",
            position: "top",
            duration: 3000,
          });
        }
      }
    },
    // 注册行为
    async registerGo(obj) {
      let vifRes = await this.codeVerify(obj.phone, obj.verification);
      if (typeof vifRes === "object")
        return Toast({
          message: "验证码错误",
          position: "top",
          duration: 3000,
        });
      await this.$axios({
        url: "/register/cellphone",
        method: "post",
        data: {
          phone: obj.phone,
          password: obj.onePassword,
          captcha: obj.verification,
          nickname: `用户_${Math.floor(new Date().getTime() * Math.random())
            .toString()
            .substring(0, 4)}`,
        },
      }).then((res) => {
        if (res.data.code === 200) {
          Toast({
            message: "注册成功, 请登录",
            position: "top",
            duration: 1500,
          });
        }
        console.log(res);
      });
    },
    // 开放按钮可点击权限
    openBtn(target, context) {
      if (context === "" || context.length < 4) {
        this.$refs[target].className = "submitBtn";
        this.$refs[target].setAttribute("disabled", true);
      } else {
        this.$refs[target].className = "submitBtn active";
        this.$refs[target].removeAttribute("disabled");
      }
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
};
</script>

<style lang='less' scoped>
@rate: 50;
#userInfo {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
}
.bg {
  position: absolute;
  width: 100%;
  height: 100%;
  transform: scale(1.2);
  filter: blur(12rem / @rate);
  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.content {
  // 继续写登录注册页样式
  position: absolute;
  width: 100%;
  height: 100%;
  .title {
    font-size: 28rem / @rate;
    font-weight: bold;
    color: #fff;
    text-align: center;
    margin-top: 20vh;
    margin-bottom: 5vh;
    span {
      font-size: 10rem / @rate;
      margin-left: 5rem / @rate;
      color: #fff;
    }
  }
}
.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  .iptBox {
    width: 80%;
    height: 50rem / @rate;
    position: relative;
    margin-bottom: 14rem / @rate;
    display: flex;
    flex-direction: column;
    p {
      font-size: 12rem / @rate;
    }
    .tips {
      position: absolute;
      font-size: 10rem / @rate;
      right: 6rem / @rate;
      bottom: 12rem / @rate;
      color: tomato;
    }
    & > input {
      width: 100%;
      background-color: transparent;
      height: 32rem / @rate;
      font-size: 18rem / @rate;
      border-bottom: 1rem / @rate solid #f1f1f1;
      padding-right: 90rem / @rate;
      color: #fff;
      text-shadow: 0 0 3rem / @rate #505050;
    }
    .initBox {
      height: 32rem / @rate;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .yanzhengma {
        flex: 1;
        background-color: transparent;
        height: 32rem / @rate;
        font-size: 18rem / @rate;
        color: #fff;
        text-shadow: 0 0 3rem / @rate #505050;
        border-bottom: 1rem / @rate solid #f1f1f1;
      }
      .btn {
        width: 100rem / @rate;
        height: 25rem / @rate;
        line-height: 25rem / @rate;
        color: #00a1d6;
        font-size: 12rem / @rate;
        text-align: center;
      }
      .active {
        color: #f0e0e8;
      }
    }
    .success {
      color: lightgreen;
    }
  }
}
.submitBtn {
  display: block;
  width: 80%;
  border-radius: 10rem / @rate;
  padding: 10rem / @rate 0;
  font-size: 16rem / @rate;
  background-color: #f0e0e8;
  color: #fff;
  position: absolute;
  bottom: 58rem / @rate;
  left: 50%;
  transform: translateX(-50%);
  transition: background-color 0.3s ease;
}
.submitBtn.active {
  background-color: #00a1d6;
}
</style>