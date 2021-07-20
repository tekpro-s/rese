<template>
  <div>
  <HeaderAuth />
    <div class="flex">
      <div class="shop">
        <BackButton />
        <h2 class="shop-title">{{shop.name}}</h2>
        <img
          class="card-img flex"
          :src=shop.image_url
        />
        <div class="flex">
          <p class="area" @click="area(shop.area.name)">#{{shop.area.name}}</p>
          <p class="genre" @click="genre(shop.genre.name)">#{{shop.genre.name}}</p>
        </div>
        <p class="summary">{{shop.summary}}</p>
      </div>
      <div class="reservation">
        <validation-observer ref="obs" v-slot="ObserverProps">
          <h2 class="reservation-title">予約</h2>
          <validation-provider name="date" rules="required">
            <div slot-scope="ProviderProps">
              <input class="flex" type="date" v-model="date"/>
              <p class="error">{{ ProviderProps.errors[0] }}</p>
            </div>
          </validation-provider>
          <validation-provider name="time" rules="required">
            <div slot-scope="ProviderProps">
              <select class="flex" name="time" v-model="time">
                <option v-for="time in times" :key="time.id" :value="time.time">{{time.time}}</option>
              </select>
              <p class="error">{{ ProviderProps.errors[0] }}</p>
            </div>
          </validation-provider>
          <validation-provider name="number" rules="required|numeric">
            <div slot-scope="ProviderProps">
              <select id="number" name="number" v-model="number">
                <option value="">選択してください</option>
                <option value="1">1人</option>
                <option value="2">2人</option>
                <option value="3">3人</option>
                <option value="4">4人</option>
                <option value="5">5人</option>
              </select>
              <p class="error">{{ ProviderProps.errors[0] }}</p>
            </div>
          </validation-provider>
          <ul class="data">
            <li>Shop: {{ shop.name }}</li>
            <li>Date:  {{ changeDateFormat }}</li>
            <li>Time:  {{ time }}</li>
            <li>Number:  {{ number }}人</li>
          </ul>
          <button class="reservation-button" @click="reservation" :disabled="ObserverProps.invalid || !ObserverProps.validated" >予約する</button>
        </validation-observer>
      </div>
    </div>
    <div>
      <PostComment :shop_id="shop_id" />
      <div class="card" v-for="comment in shop.comments" :key="comment.id" >
        <ul class="data">
          <li>ユーザーID: {{ comment.user_id }}</li>
          <li>コメント:  {{ comment.content }}</li>
          <li>評価:  {{ comment.id }}</li>
          <li>日付:  {{ comment.updated_at }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderAuth from "../components/HeaderAuth";
import BackButton from "../components/BackButton";
import PostComment from "../components/PostComment";
import axios from "axios";
import { extend, ValidationProvider, ValidationObserver } from 'vee-validate';
import { required, numeric } from 'vee-validate/dist/rules';
// バリデーションルール
extend('required', required);
extend('required', numeric);
export default {
  props: {
    shop_id: String
  },
  data() {
    return {
      date: this.changeDateFormat,
      time: "10:00",
      number: 1,
      shop: {
        area: {
          name: ""
        },
        genre: {
          name: ""
        }
      },
      times: [
        {
          id: 1,
          time: "10:00"
        },
        {
          id: 2,
          time: "10:30"
        },
        {
          id: 3,
          time: "11:00"
        },
        {
          id: 4,
          time: "11:30"
        },
        {
          id: 5,
          time: "12:00"
        },
        {
          id: 6,
          time: "12:30"
        },
        {
          id: 7,
          time: "13:00"
        },
        {
          id: 8,
          time: "13:30"
        },
        {
          id: 9,
          time: "14:00"
        },
        {
          id: 10,
          time: "14:30"
        },
        {
          id: 11,
          time: "15:00"
        },
        {
          id: 12,
          time: "15:30"
        },
        {
          id: 13,
          time: "16:00"
        },
        {
          id: 14,
          time: "16:30"
        },
        {
          id: 15,
          time: "17:00"
        },
        {
          id: 16,
          time: "17:30"
        },
        {
          id: 17,
          time: "18:00"
        },
        {
          id: 18,
          time: "18:30"
        },
        {
          id: 19,
          time: "19:00"
        },
        {
          id: 20,
          time: "19:30"
        },
        {
          id: 21,
          time: "20:00"
        },
      ]
    };
  },
  methods: {
    area(area_name) {
      this.$store.commit("area", area_name);
      this.$router.push("/");
    },
    genre(genre_name) {
      this.$store.commit("genre", genre_name);
      this.$router.push("/");
    },
    async getShop() {
      const shop = await axios.get("http://localhost:8000/api/v1/shops/" + this.shop_id);
      this.shop = shop.data.data;
      console.log(this.shop);
    },
    async reservation() {
      try {
        const reservation = await axios.post("http://localhost:8000/api/v1/shops/" + this.shop_id + "/reservations", {
          user_id: this.$store.state.user.id,
          date: this.date,
          time: this.time,
          number: this.number,
        })
        console.log(reservation);
        this.$router.push("/done");
      } catch (e) {
          alert(e);
      }
    },
  },
  created() {
    this.getShop();
    var today = new Date();
    var y = today.getFullYear();
    var m = ('00' + (today.getMonth()+1)).slice(-2);
    var d = ('00' + today.getDate()).slice(-2);
    this.date = (y + '-' + m + '-' + d);
  },
  computed: {
    changeDateFormat() {
      var today = new Date();
      var y = today.getFullYear();
      var m = ('00' + (today.getMonth()+1)).slice(-2);
      var d = ('00' + today.getDate()).slice(-2);

      return (y + '-' + m + '-' + d);
    }
  },
  components: {
    HeaderAuth,
    BackButton,
    PostComment,
    ValidationProvider,
    ValidationObserver,
  },
};
</script>

<style scoped>
.reservation-button {
  width: 100px;
  text-align: center;
  padding: 8px 0 10px;
  background-color: #0438FF;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 10px;
  color: white;
  border: none;
}
.area {
  margin-right: 10px;
  cursor: pointer;
}
.genre {
  cursor: pointer;
}
.shop {
  color: black;
  width: 50%;
  margin: 10px;
}
.shop-title,
.reservation-title {
  font-size: 24px;
}
.card-img{
  margin-bottom: 20px;
  border-radius: 5px 5px 0 0;
  max-width: 50%;
  height: auto;
}
.summary {
  margin-top: 20px;
}
.data{
  background: #4C7EFF;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
}
.reservation {
  background: #305DFF;
  color: white;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
  width: 50%;
}
input {
  margin: 10px;
}
select {
  margin-top: 10px;
  margin-left: 10px;
}
.data li {
  margin: 5px;
  list-style: none;
}
</style>