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
          <validation-provider name="日付" rules="required">
            <div slot-scope="ProviderProps">
              <input class="flex" type="date" v-model="date"/>

              <p>{{ ProviderProps.errors[0] }}</p>
              <p v-if="!reservationDatetimeFlg">現在日時より以前の日時は指定できません。</p>
            </div>
          </validation-provider>
          <validation-provider name="時間" rules="required">
            <div slot-scope="ProviderProps">
              <select class="flex" name="time" v-model="time">
                <option v-for="time in times" :key="time.id" :value="time.time">{{time.time}}</option>
              </select>
              <p class="error">{{ ProviderProps.errors[0] }}</p>
              <p v-if="!reservationDatetimeFlg">現在日時より以前の日時は指定できません。</p>
            </div>
          </validation-provider>
          <validation-provider name="人数" rules="required">
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
            <li>店舗名: {{ shop.name }}</li>
            <li>予約日:  {{ changeDateFormat }}</li>
            <li>予約時刻:  {{ time }}</li>
            <li>予約人数:  {{ number }}人</li>
          </ul>
          <button class="reservation-button" @click="reservation" :disabled="ObserverProps.invalid || !ObserverProps.validated || !reservationDatetimeFlg" >予約する</button>
        </validation-observer>
      </div>
    </div>
    <div>
      <PostComment :shop="shop" />
    </div>
  </div>
</template>

<script>
import HeaderAuth from "../components/HeaderAuth";
import BackButton from "../components/BackButton";
import PostComment from "../components/PostComment";
import axios from "axios";
import moment from "moment";
import { extend, ValidationProvider, ValidationObserver, localize } from 'vee-validate/dist/vee-validate.full'
import { required } from 'vee-validate/dist/rules';
import ja from 'vee-validate/dist/locale/ja';
// バリデーションルール
extend('required', required);
localize('ja', ja);

export default {
  props: {
    shop_id: String
  },
  data() {
    return {
      date: "",
      time: "10:00",
      number: "1",
      shop: {
        area: {
          name: ""
        },
        genre: {
          name: ""
        }
      },
      comments: [],
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
        {
          id: 22,
          time: "20:30"
        },
        {
          id: 23,
          time: "21:00"
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
    getToday() {
      // 現在日取得
      var today = new Date();
      var y = today.getFullYear();
      var m = ('00' + (today.getMonth()+1)).slice(-2);
      var d = ('00' + today.getDate()).slice(-2);
      return (y + '-' + m + '-' + d);
    }
  },
  created() {
    this.getShop();
    this.date = this.getToday();
  },
  computed: {
    changeDateFormat() {
      return this.date.replaceAll('-', '/');
    },
    reservationDatetimeFlg() {
      // 予約日時が現在日より後ならtrue
      return moment(this.date + " " + this.time).isAfter(new Date());
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
.reservation-button:disabled {
  background-color: #a9a9a9;
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