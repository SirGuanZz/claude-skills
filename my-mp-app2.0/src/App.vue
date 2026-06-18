<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";

onLaunch(() => {
  console.log("App Launch");
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>

<style lang="scss">
/* 全局少量基础样式;具体 token 在 uni.scss
 * 这里只补微信小程序里偶尔需要的 reset:button 默认外边框、image 默认 inline-block 间隙
 */
button::after {
  border: none;
}
image {
  display: block;
}
</style>
