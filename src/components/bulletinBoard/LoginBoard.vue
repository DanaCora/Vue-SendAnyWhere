<script setup>
import { ref, computed, onMounted } from "vue";
import BoardUploadService from "../../services/BoardService.js";
import { useRouter } from "vue-router";
import {
  generatePrivateKey,
  generatePublicKey,
} from "../../cryptoUtils/DH-Crypto.js";

const emits = defineEmits(["sendLoginStatus"]);
const props = defineProps({ roomCode: String, roomType: String});
const router = useRouter();

function handleSendLoginStatus(newStatus) {
  emits("sendLoginStatus", newStatus);
}

const pwd = ref("");

function clearPassword() {
  pwd.value = "";
}

const flag = ref(false);
function togglePasswordVisibility() {
  flag.value = !flag.value;
}
const inputType = computed(() => {
  return flag.value ? "text" : "password";
});
const elIcon = computed(() => {
  return flag.value ? ["far", "eye"] : ["far", "eye-slash"];
});

const roomPrivateKey = generatePrivateKey();
const roomPublicKey = generatePublicKey(roomPrivateKey);

function handleLoginData() {
  BoardUploadService.accessRoom(pwd.value, props.roomCode, props.roomType, roomPublicKey, roomPrivateKey)
    .then(() => {
      router.push(`/BulletinBoard/roomboard/${props.roomCode}`);
    })
    .catch((error) => {
      console.log(error);
    });
}
</script>

<template>
  <div class="login-board-mask">
    <div class="login-board" @click.stop>
      <h1>Enter Your Password.</h1>
      <div class="login-board-title">
        <span><font-awesome-icon icon="house-user" /></span>
        <div>
          <p>One for all room.</p>
          <h2>{{ roomCode }}</h2>
        </div>
      </div>
      <form @submit.prevent="handleLoginData">
        <h3>Password</h3>
        <input type="text" name="username" style="display: none;" autocomplete="username" />

        <div class="login-board-password-input">
          <span><font-awesome-icon icon="lock" /></span>
          <label for="pwd"></label>
          <input v-model="pwd" name="pwd" id="pwd" :type="inputType" autocomplete="current-password"/>
          <span @click="togglePasswordVisibility"
            ><font-awesome-icon :icon="elIcon"
          /></span>
        </div>
        <div class="login-board-decide">
          <button
            class="login-board-cancel"
            @click="handleSendLoginStatus(false)"
          >
            Cancel
          </button>
          <button class="login-board-confirm">
            Confirm
          </button>
        </div>
      </form>
      <p @click="clearPassword">Reset Password.</p>
      <span @click="handleSendLoginStatus(false)"
        ><font-awesome-icon icon="xmark"
      /></span>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../../assets/styles/layout/board/loginBoard";
</style>
