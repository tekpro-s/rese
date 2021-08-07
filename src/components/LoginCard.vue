<template>
 <div>
   <div class="card">
      <div class="card_title">
        <h2 v-if='role == 1'>ログイン</h2>
        <h2 v-else-if='role == 2'>店舗代表者ログイン</h2>
        <h2 v-else-if='role == 3'>管理者ログイン</h2>
      </div>
      <div class="form">
        <validation-observer ref="obs" v-slot="ObserverProps">
          <validation-provider name="メールアドレス" v-slot="{errors}" rules="required|email|max:255">
            <input placeholder="Email" type="email" v-model="email" />
            <p class="error">{{ errors[0] }}</p>
          </validation-provider>
          <validation-provider name="パスワード" v-slot="{errors}" rules="required|min:8|max:255">
            <input placeholder="Password" type="password" v-model="password" />
            <p class="error">{{ errors[0] }}</p>
          </validation-provider>
          <button :disabled="ObserverProps.invalid || !ObserverProps.validated" @click="auth" v-if='role == 1'>ログイン</button>
          <button :disabled="ObserverProps.invalid || !ObserverProps.validated" @click="auth_owner" v-else-if='role == 2'>ログイン</button>
          <button :disabled="ObserverProps.invalid || !ObserverProps.validated" @click="auth_administrator" v-else-if='role == 3'>ログイン</button>
        </validation-observer>
     </div>
   </div>
 </div>
</template>

<script>
import { extend, ValidationProvider, ValidationObserver, localize } from 'vee-validate/dist/vee-validate.full'
import { required, email, max } from 'vee-validate/dist/rules';
import ja from 'vee-validate/dist/locale/ja';

// バリデーションルール
extend('required', required);
extend('email', {
  ...email,
  message: "有効なメールアドレスではありません"
});
extend('max', max);
localize('ja', ja);

export default {
  props: {
    role: Number,
  },
  data() {
    return {
      email: "",
      password: ""
    };
  },
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  methods: {
    auth() {
      this.$store.dispatch("login", {
        email: this.email,
        password: this.password
      });
    },
    auth_owner() {
      this.$store.dispatch("login_owner", {
        email: this.email,
        password: this.password
      });
    },
    auth_administrator() {
      this.$store.dispatch("login_administrator", {
        email: this.email,
        password: this.password
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