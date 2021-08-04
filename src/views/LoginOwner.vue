<template>
 <div>
   <HeaderAuth />
   <div class="card">
     <div class="card_title">
      <h2>店舗代表者ログイン</h2>
     </div>
     <div class="form">
        <input placeholder="Email" type="email" v-model="email" />
        <input placeholder="Password" type="password" v-model="password" />
        <button @click="auth">ログイン</button>
     </div>
   </div>
 </div>
</template>

<script>
import HeaderAuth from "../components/HeaderAuth";
export default {
  data() {
    return {
      email: "",
      password: ""
    };
  },
  components: {
    HeaderAuth
  },
  methods: {
    auth() {
      this.$store.dispatch("login_owner", {
        email: this.email,
        password: this.password,
      });
    }
  }
};
</script>

<style scoped>
.card {
  margin: 100px auto;
  width: 350px;
  background: #fff;
  border-radius: 5px;
  padding: 0 0 10px 0;
}
.card h2 {
  color: white;
  background: #305dff;
  text-align: left;
  padding: 20px;
}
input {
  margin-top: 15px;
  width: 80%;
  padding: 5px;
  color: black;
  border: none;
  border-bottom: 1px solid #ccc;
}
.form {
  text-align: center;
}
.form button {
  margin-top: 15px;
  width: 100px;
  text-align: center;
  padding: 8px 0 10px;
  background-color: #305dff;
  border-radius: 10px;
  cursor: pointer;
  margin-right: 0px;
  border: none;
  color:white;
}
</style>