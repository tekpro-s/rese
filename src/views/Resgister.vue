<template>
  <div>
    <HeaderAuth />
    <div class="card">
      <h2>Registration</h2>
      <div class="form">
        <validation-observer ref="obs" v-slot="ObserverProps">
          <validation-provider v-slot="{errors}" rules="required">
              <input name="name" placeholder="Username" type="text" v-model="name" />
              <p class="error">{{ errors[0] }}</p>
          </validation-provider>
          <validation-provider v-slot="{errors}" rules="required|email">
              <input name="email" placeholder="Email" type="email" v-model="email" />
              <p class="error">{{ errors[0] }}</p>
          </validation-provider>
          <validation-provider v-slot="{errors}" rules="required|min:8|max:20">
              <input name="password" placeholder="Password" type="password" v-model="password" />
              <p class="error">{{ errors[0] }}</p>
          </validation-provider>
          <button :disabled="ObserverProps.invalid || !ObserverProps.validated">登録</button>
        </validation-observer>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderAuth from "../components/HeaderAuth";
import axios from "axios";
import { extend, ValidationProvider, ValidationObserver } from 'vee-validate/dist/vee-validate.full'
import { required, email, min, max } from 'vee-validate/dist/rules';
// バリデーションルール
extend('required', required);
extend('email', email);
extend('min', min);
extend('max', max);

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
    ValidationProvider,
    ValidationObserver,
  },
  methods: {
    async auth() {
      try {
        const users = await axios.post("http://localhost:8000/api/v1/users/registration", {
          name: this.name,
          email: this.email,
          password: this.password
        })
        console.log(users);
        this.$router.push("/thanks");
      } catch (error) {
        alert(error);
      }
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
.form {
  text-align: center;
}
.form input {
  margin-top: 15px;
  width: 80%;
  padding: 5px;
  color: black;
  border: none;
  border-bottom: 1px solid #ccc;
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