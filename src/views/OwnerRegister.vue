<template>
  <div>
    <HeaderAuth />
    <div v-if="this.$store.state.user.role_id==3">
      <h2>管理画面</h2>
      <RegisterCard :role="3" />
    </div >
    <div v-else>
      <p>管理者ユーザーのみアクセスできます</p>
    </div>
  </div>
</template>

<script>
import HeaderAuth from "../components/HeaderAuth";
import RegisterCard from "../components/RegisterCard";

export default {
  data() {
    return {
      name: "",
      email: "",
      password: ""
    };
  },
  components: {
    HeaderAuth,
    RegisterCard,
  },
}
</script>
