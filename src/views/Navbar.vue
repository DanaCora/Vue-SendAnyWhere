<script setup>
import { RouterLink } from "vue-router";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.module";
import { useUploadInfo } from "../stores/upload";
import { computed, onMounted } from "vue";

const uploadTab = useUploadInfo();

const authStore = useAuthStore();
const router = useRouter();

const currentUser = computed(() => {
  return authStore.dataStatus.user;
});

function logOut() {
  authStore.logout();
  router.push("/");
}

function setSelectedTab(tab) {
  uploadTab.setSelectedTab(tab);
}

function checkAuth() {
  authStore.checkAuth();
}

function alertLogin() {
  if (!currentUser.value) {
    alert("Please sign in first.");
    router.push("/signin");
  }
}

onMounted(() => {
  checkAuth();
});
</script>

<template>
  <nav class="nav">
    <ul class="navbar-logo">
      <li>
        <RouterLink to="/">
          <img src="../assets/image/logo4.png" alt="" />
        </RouterLink>
      </li>
      <li>
        <RouterLink to="/" class="nav-link nav-home">
          <strong>Send</strong>Everything
        </RouterLink>
      </li>
    </ul>

    <ul class="navbar-nav">
      <li class="nav-item">
        <RouterLink
          :to="{ path: '/chatroom' }"
          class="nav-link"
          @click="alertLogin()"
         >
           <font-awesome-icon :icon="['far', 'comments']" /> 聊天室
         </RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink
          :to="{ path: '/BulletinBoard', query: { page: 1 } }"
          class="nav-link"
         >
           <font-awesome-icon icon="circle-arrow-up" /> 佈告欄
        </RouterLink>
          </li>
      <li class="nav-item">
        <RouterLink
           :to="{ path: '/WorkBoard', query: { page: 1 } }"
           class="nav-link"
        >
           <font-awesome-icon icon="circle-arrow-up" /> 作業版
         </RouterLink>
       </li>
      <li class="nav-item">
        <RouterLink
           to="/uploadfile"
           class="nav-link"
          @click="setSelectedTab('Send')"
        >
          <font-awesome-icon icon="circle-arrow-up" /> Upload / Download
           <font-awesome-icon icon="circle-down" />
        </RouterLink>
      </li>

      <li class="nav-item" v-if="!currentUser">
        <RouterLink to="/signin" class="nav-link">
           <font-awesome-icon icon="sign-in-alt" /> Sign in
         </RouterLink>
      </li>

      <li class="nav-user" v-if="currentUser">
        <img
          :src="`data:image/png;base64,${currentUser.profileImage}`"
          alt=""
          />
        {{ currentUser.username }}
      </li>

      <li class="nav-item" @click.prevent="logOut" v-if="currentUser">
        <a class="nav-link">
          <font-awesome-icon icon="sign-in-alt" /> Sign out
        </a>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
@import "../assets/styles/app";
@import "../assets/styles/layout/navbar";
</style>
