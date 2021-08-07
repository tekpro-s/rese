import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import axios from "axios";
import router from "../router/index";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    auth: "",
    user: "",
    area: "",
    genre: ""
  },
  mutations: {
    auth(state, payload) {
      state.auth = payload;
    },
    user(state, payload) {
      state.user = payload;
    },
    logout(state, payload) {
      state.auth = payload;
    },
    changeUserData(state, payload) {
      state.user.profile = payload;
    },
    area(state, payload) {
      state.area = payload;
    },
    genre(state, payload) {
      state.genre = payload;
    }
  },
  actions: {
    async login({ commit }, { email, password }) {
      const responseLogin = await axios.post(
        process.env.VUE_APP_API_BASE_URL + "users/login",
        {
          email: email,
          password: password,
        }
      );

      commit("auth", responseLogin.data.auth);
      commit("user", responseLogin.data.user);
      router.replace("/");
    },
    async login_owner({ commit }, { email, password }) {
      const responseLogin = await axios.post(
        process.env.VUE_APP_API_BASE_URL + "users/login",
        {
          email: email,
          password: password,
        }
      );

      if (responseLogin.data.user.role_id == 2) {
        commit("auth", responseLogin.data.auth);
        commit("user", responseLogin.data.user);
        router.replace("/owner");
      } else {
        alert("店舗代表者ユーザーではありません");
      }
    },
    async login_administrator({ commit }, { email, password }) {

      const responseLogin = await axios.post(
        process.env.VUE_APP_API_BASE_URL + "users/login",
        {
          email: email,
          password: password,
        }
      );

      if (responseLogin.data.user.role_id == 3) {
        commit("auth", responseLogin.data.auth);
        commit("user", responseLogin.data.user);
        router.replace("/ownerRegister");
      } else {
        alert("管理者ユーザーではありません");
      }
    },
    logout({ commit }) {
      axios
        .post(process.env.VUE_APP_API_BASE_URL + "users/logout", {
          auth: this.state.auth,
        })
        .then((response) => {
          console.log(response);
          commit("logout", response.data.auth);
          router.replace("/login");
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
});