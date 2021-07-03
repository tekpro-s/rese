<template>
 <div class="header flex">
   <div class="left">
     <img class="logo" src="../assets/menu.png" @click="$router.push('/mypage')"/>
   </div>
   <div class="right flex">
     <router-link @click.native="transition" :to="{name:'Register'}" class="link">新規登録</router-link>
     <router-link @click.native="transition" :to="{name:'Login'}" class="link">ログイン</router-link>
     <p @click="$store.dispatch('logout'); transition()" class="link">ログアウト</p>
   </div>
 </div>
</template>

<script>

export default {
  methods: {
    transition() {
      this.$store.commit("area", "");
      this.$store.commit("genre", "");
    },
  }
};
</script>

<style scoped>
.right {
  align-items: center;
}
.link {
  margin-right: 20px;
  cursor: pointer;
  color: black;
  text-decoration: none;
}
.header {
  margin: 20px;
  justify-content: space-between;
}
.logo {
  width: 50px;
  cursor: pointer;
}
</style>