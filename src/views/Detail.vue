<template>
  <div>
  <HeaderAuth />
    <div class="flex">
      <div class="shop">
        <button @click="$router.push('/')">＜</button>
        <h2 class="shop-title">{{shop.name}}</h2>
        <img
          class="card-img flex"
          :src=shop.image_url
        />
        <div class="flex">
          <p class="area" @click="area()">#{{shop.area}}</p>
          <p class="genre" @click="genre()">#{{shop.genre}}</p>
        </div>
        <p class="summary">{{shop.summary}}</p>
      </div>
      <div class="reservation">
        <h2 class="reservation-title">予約</h2>
        <input class="flex" type="date" v-model="date"/>
        <select class="flex" name="time" v-model="time">
          <option v-for="time in times" :key="time.id" :value="time.time">{{time.time}}</option>
        </select>
        <select id="number" name="number" v-model="number">
          <option value="">選択してください</option>
          <option value="1">1人</option>
          <option value="2">2人</option>
          <option value="3">3人</option>
          <option value="4">4人</option>
        </select>
        <ul class="data">
          <li>Shop: {{ shop.name }}</li>
          <li>Date:  {{ date }}</li>
          <li>Time:  {{ time }}</li>
          <li>Number:  {{ number }}人</li>
        </ul>
        <button class="reservation-button" @click="reservation">予約する</button>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderAuth from "../components/HeaderAuth";
import axios from "axios";
export default {
  props: {
    shop_id: String
  },
  data() {
    return {
      date: this.nowDate(),
      time: "10:00",
      number: 1,
      shop: "",
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
          id: 8,
          time: "14:00"
        },
        {
          id: 8,
          time: "14:30"
        },
        {
          id: 9,
          time: "15:00"
        },
        {
          id: 9,
          time: "15:30"
        },
        {
          id: 10,
          time: "16:00"
        },
        {
          id: 11,
          time: "16:30"
        },
        {
          id: 12,
          time: "17:00"
        },
        {
          id: 13,
          time: "17:30"
        },
        {
          id: 14,
          time: "18:00"
        },
        {
          id: 15,
          time: "18:30"
        },
        {
          id: 16,
          time: "19:00"
        },
        {
          id: 17,
          time: "19:30"
        },
        {
          id: 18,
          time: "20:00"
        },
      ]
    };
  },
  methods: {
    area() {
      this.$store.commit("area", this.shop.area);
      this.$router.push("/");
    },
    genre() {
      this.$store.commit("genre", this.shop.genre);
      this.$router.push("/");
    },
    async getShop() {
      const shop = await axios.get("http://localhost:3000/shops/" + this.shop_id);
      console.log(shop);
      this.shop = shop.data;
      console.log(this.shop);
    },
    async reservation() {
      try {
        const reservation = await axios.post("http://localhost:3000/reservations", {
            shop_id: this.shop_id,
            user_id: 1,
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
    // 現在日取得
    nowDate() {
      var today = new Date();
      today =
        today.getFullYear() +
        "-0" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      return today;
    }
  },
  created() {
    this.getShop();
  },
  components: {
    HeaderAuth
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