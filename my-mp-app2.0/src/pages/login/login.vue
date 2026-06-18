<!--
 * 登录页 — 手机号 + 验证码 + 本机号码一键登录
 * 不进 tabBar;被 request 拦截器 4001/401 跳转
 * 修改注意:
 *   - 倒计时 60s 写死,如需服务端控制改 onSendCode 的 setInterval 部分
 *   - 一键登录解密走 loginByWxPhone,后端未接通时占位 toast
-->
<template>
  <view class="page">
    <!-- 顶部渐变 hero -->
    <view class="hero">
      <view class="hero-blob blob-1"></view>
      <view class="hero-blob blob-2"></view>
      <view class="hero-inner">
        <text class="brand">{{ brandLabel }}</text>
        <text class="hello">欢迎回来 👋</text>
        <text class="sub">登录以同步你的订阅与阅读历史</text>
      </view>
    </view>

    <!-- 表单卡片 -->
    <view class="card">
      <view class="field">
        <text class="label">手机号</text>
        <input
          v-model="phone"
          class="input"
          type="number"
          maxlength="11"
          placeholder="请输入手机号"
          placeholder-class="placeholder"
        />
      </view>

      <view class="field">
        <text class="label">验证码</text>
        <view class="input-row">
          <input
            v-model="code"
            class="input"
            type="number"
            maxlength="6"
            placeholder="6 位验证码"
            placeholder-class="placeholder"
          />
          <view
            class="code-btn"
            :class="{ 'code-btn-disabled': countdown > 0 || !phoneValid }"
            hover-class="btn-press"
            @click="onSendCode"
          >
            {{ countdown > 0 ? `${countdown}s 后重发` : "获取验证码" }}
          </view>
        </view>
      </view>

      <view
        class="primary-btn"
        :class="{ 'primary-btn-disabled': !canSubmit }"
        hover-class="btn-press"
        @click="onSubmit"
      >
        登录
      </view>

      <button
        class="ghost-btn"
        hover-class="btn-press"
        open-type="getPhoneNumber"
        @getphonenumber="onGetPhoneNumber"
      >
        本机号码一键登录
      </button>

      <text class="agreement">
        登录即同意《用户协议》与《隐私政策》
      </text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, onUnmounted } from "vue";
import { BIZ } from "@/config/biz";
import { sendSmsCode, loginBySms, loginByWxPhone } from "@/api/modules/user";
import { showError, showSuccess } from "@/utils/message";

const brandLabel = BIZ.label;

const phone = ref("");
const code = ref("");
const countdown = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;

const phoneValid = computed(() => /^1\d{10}$/.test(phone.value));
const canSubmit = computed(() => phoneValid.value && /^\d{4,6}$/.test(code.value));

// --- 倒计时:60s 内禁用获取验证码,防重复点击;leaveBeforeUnmount 清 timer ---
function startCountdown() {
  countdown.value = 60;
  timer = setInterval(() => {
    countdown.value -= 1;
    if (countdown.value <= 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  }, 1000);
}

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

async function onSendCode() {
  if (countdown.value > 0) return;
  if (!phoneValid.value) {
    showError("请输入正确的手机号");
    return;
  }
  try {
    await sendSmsCode(phone.value);
    showSuccess("验证码已发送");
    startCountdown();
  } catch {
    // request 拦截器已 toast,这里不重复提示
  }
}

// --- 提交登录:走 user 接口,成功写 token + setStorageSync,跳回上一页或首页 ---
async function onSubmit() {
  if (!canSubmit.value) return;
  try {
    const res = await loginBySms(phone.value, code.value);
    uni.setStorageSync("token", res.data.token);
    uni.setStorageSync("userId", res.data.userId);
    showSuccess("登录成功");
    backOrHome();
  } catch {
    /* 拦截器已处理 */
  }
}

// --- 一键登录:open-type=getPhoneNumber → wx.login code → 后端解密(待接) ---
async function onGetPhoneNumber(e: any) {
  if (!e.detail.encryptedData) {
    // 用户拒绝授权
    showError("已取消授权");
    return;
  }
  try {
    const loginRes = await new Promise<UniApp.LoginRes>((resolve, reject) => {
      uni.login({ provider: "weixin", success: resolve, fail: reject });
    });
    const res = await loginByWxPhone({
      code: loginRes.code,
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
    });
    uni.setStorageSync("token", res.data.token);
    uni.setStorageSync("userId", res.data.userId);
    showSuccess("登录成功");
    backOrHome();
  } catch {
    /* 拦截器已处理 */
  }
}

function backOrHome() {
  const pages = getCurrentPages();
  if (pages.length > 1) {
    uni.navigateBack();
  } else {
    uni.switchTab({ url: "/pages/index/index" });
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $color-bg;
}

.hero {
  position: relative;
  height: 480rpx;
  padding: 120rpx $space-5 0;
  background: linear-gradient(135deg, $color-brand-700 0%, $color-brand-500 70%, #38bdf8 100%);
  overflow: hidden;
}
.hero-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60rpx);
  opacity: 0.55;
}
.blob-1 {
  width: 360rpx;
  height: 360rpx;
  background: #93c5fd;
  top: -100rpx;
  right: -80rpx;
}
.blob-2 {
  width: 280rpx;
  height: 280rpx;
  background: #fbbf24;
  bottom: -60rpx;
  left: -60rpx;
  opacity: 0.35;
}
.hero-inner {
  position: relative;
  z-index: 1;
}
.brand {
  display: block;
  font-family: var(--font-display);
  font-size: $fs-h2;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 2rpx;
}
.hello {
  display: block;
  margin-top: $space-2;
  font-family: var(--font-display);
  font-size: $fs-display;
  font-weight: 700;
  color: #fff;
}
.sub {
  display: block;
  margin-top: $space-2;
  font-size: $fs-body;
  color: rgba(255, 255, 255, 0.85);
}

.card {
  position: relative;
  z-index: 2;
  margin: -120rpx $space-4 0;
  padding: $space-5;
  background: #fff;
  border-radius: $radius-xl;
  box-shadow: 0 24rpx 48rpx rgba(2, 132, 199, 0.12);
}

.field {
  margin-bottom: $space-4;
}
.label {
  display: block;
  font-size: $fs-caption;
  color: $color-text-soft;
  margin-bottom: $space-2;
}
.input-row {
  display: flex;
  align-items: center;
  gap: $space-2;
}
.input {
  flex: 1;
  height: 88rpx;
  padding: 0 $space-3;
  background: $color-bg;
  border-radius: $radius-md;
  font-size: $fs-h3;
  color: $color-text;
}
.placeholder {
  color: $color-text-mute;
}
.code-btn {
  flex-shrink: 0;
  padding: 0 $space-3;
  height: 88rpx;
  line-height: 88rpx;
  font-size: $fs-caption;
  color: $color-brand-700;
  background: $color-brand-50;
  border-radius: $radius-md;
  font-weight: 600;
  transition: transform 200ms ease-out;
}
.code-btn-disabled {
  color: $color-text-mute;
  background: $color-line;
}

.primary-btn {
  margin-top: $space-3;
  height: 96rpx;
  line-height: 96rpx;
  text-align: center;
  background: linear-gradient(135deg, $color-brand-600, $color-brand-500);
  color: #fff;
  font-size: $fs-h3;
  font-weight: 700;
  border-radius: $radius-pill;
  box-shadow: 0 12rpx 24rpx rgba(2, 132, 199, 0.32);
  transition: transform 200ms ease-out;
}
.primary-btn-disabled {
  background: $color-line;
  color: $color-text-mute;
  box-shadow: none;
}

.ghost-btn {
  margin-top: $space-3;
  height: 96rpx;
  line-height: 96rpx;
  text-align: center;
  background: #fff;
  color: $color-brand-700;
  font-size: $fs-h3;
  font-weight: 600;
  border: 2rpx solid $color-brand-200;
  border-radius: $radius-pill;
  transition: transform 200ms ease-out;
}

.btn-press {
  transform: scale(0.98);
}

.agreement {
  display: block;
  margin-top: $space-4;
  text-align: center;
  font-size: $fs-caption;
  color: $color-text-mute;
}
</style>
