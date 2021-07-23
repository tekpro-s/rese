<template>
 <div>
   <HeaderAuth />
   <button @click="$router.push('/')">&lt;</button>
   <div class="flex">
      <div >
        <h2 class="title">{{this.$store.state.user.name}}さんの予約状況</h2>
        <div class="reservation" v-for="(reservation, index) in reservations" :key="reservation.id" >
          <validation-observer ref="obs" v-slot="ObserverProps">
           <ul>
              <li>予約{{index+1}}</li>
              <li>Shop:{{reservation.shop.name}}</li>

              <validation-provider name="date">
                <div slot-scope="ProviderProps" rules="required">
                  <li v-if="active[index]">Date:  {{reservation.date}}</li>
                  <li v-else><input type="date" name="date" v-model="reservation.date"/></li>
                  <p class="error">{{ ProviderProps.errors[0] }}</p>
                </div>
              </validation-provider>
              <validation-provider name="time">
                <div slot-scope="ProviderProps" rules="required">
                  <li v-if="active[index]">Time:  {{reservation.time}}</li>
                  <li v-else>
                    <select name="time" v-model="reservation.time">
                      <option v-for="time in times" :key="time.id" :value="time.time">{{time.time}}</option>
                    </select>
                    <p class="error">{{ ProviderProps.errors[0] }}</p>
                  </li>
                </div>
              </validation-provider>

              <validation-provider name="number" rulses="required|numeric">
               <div slot-scope="ProviderProps" >
                  <li v-if="active[index]">Number:  {{reservation.number}}人</li>
                  <li v-else>
                    <select id="number" name="number" v-model="reservations[index].number">
                      <option value="">選択してください</option>
                      <option value="1">1人</option>
                      <option value="2">2人</option>
                      <option value="3">3人</option>
                      <option value="4">4人</option>
                    </select>
                    <p class="error">{{ ProviderProps.errors[0] }}</p>
                  </li>
                </div>
              </validation-provider>
  
          </ul>
            <img class="icon" src="../assets/cancel.png" @click="cancel(reservation.shop_id, reservation.id, index)" alt />
            <img class="icon" src="../assets/edit.png" @click="edit(reservation.id, index)" alt  :disabled="ObserverProps.invalid || !ObserverProps.validated" />
          </validation-observer>
        </div>
      </div>
      <div class="like">
        <h2 class="title">お気に入り店舗</h2>
        <ShopCard area="" genre="" keyword="" />
      </div>
    </div>
 </div>
</template>

<script>
import HeaderAuth from "../components/HeaderAuth";
import ShopCard from "../components/ShopCard";
import axios from "axios";
import { extend, ValidationProvider, ValidationObserver } from 'vee-validate';
import { required, numeric } from 'vee-validate/dist/rules';
// バリデーションルール
extend('required', required);
extend('required', numeric);
export default {
  data() {
    return {
      email: this.email,
      password: this.password,
      active: [],
      reservations: [],
      likes: [],
      shops: [],
      times: [
        {
          id: 1,
          time: "10:00:00"
        },
        {
          id: 2,
          time: "10:30:00"
        },
        {
          id: 3,
          time: "11:00:00"
        },
        {
          id: 4,
          time: "11:30:00"
        },
        {
          id: 5,
          time: "12:00:00"
        },
        {
          id: 6,
          time: "12:30:00"
        },
        {
          id: 7,
          time: "13:00:00"
        },
        {
          id: 8,
          time: "13:30:00"
        },
        {
          id: 9,
          time: "14:00:00"
        },
        {
          id: 10,
          time: "14:30:00"
        },
        {
          id: 11,
          time: "15:00:00"
        },
        {
          id: 12,
          time: "15:30:00"
        },
        {
          id: 13,
          time: "16:00:00"
        },
        {
          id: 14,
          time: "16:30:00"
        },
        {
          id: 15,
          time: "17:00:00"
        },
        {
          id: 16,
          time: "17:30:00"
        },
        {
          id: 17,
          time: "18:00:00"
        },
        {
          id: 18,
          time: "18:30:00"
        },
        {
          id: 19,
          time: "19:00:00"
        },
        {
          id: 20,
          time: "19:30:00"
        },
        {
          id: 21,
          time: "20:00:00"
        },
      ]
    };
  },
  components: {
    HeaderAuth,
    ShopCard,
    ValidationProvider,
    ValidationObserver,
  },
  methods: {
    // 積み上げ更新
    async edit(reservation_id, index) {
      // console.log(this.reservations[index].date + " " + this.reservations[index].time + " " + this.reservations[index].number);
      if (!this.active[index]) {
          const reservation = await axios.put("http://localhost:8000/api/v1/reservations/" + reservation_id, {
              date: this.reservations[index].date,
              time: this.reservations[index].time,
              number: this.reservations[index].number,
          });

          console.log(reservation);
      }
      console.log(this.active[index] + " " + index);
      //this.active[index] = !this.active[index];
      this.$set(this.active, index, !this.active[index]);
      console.log(this.active[index] + " " + index);
    },
    async cancel(shop_id, reservation_id, index){
      try {
        const reservations = await axios.delete("http://localhost:8000/api/v1/shops/" + shop_id + "/reservations", {
          reservation_id: reservation_id
        });
        console.log(reservations);

        this.reservations.splice(index, 1);

      } catch (e) {
          alert(e);
      }
    },
    detail(id) {
      this.$store.commit("area", "");
      this.$store.commit("genre", "");
      this.$router.push({ name: 'Detail', params: { shop_id: id } })
    },
    area(area_name) {
      this.$store.commit("area", area_name);
      this.$router.push("/");
    },
    genre(genre_name) {
      this.$store.commit("genre", genre_name);
      this.$router.push("/");
    },
    async deleteFav(index) {
      try {
        const likes = await axios.delete("http://localhost:8000/api/v1/shops/" + this.shops[index].id + "/likes", {
          params: { user_id: this.$store.state.user.id }
        });

        console.log("http://localhost:8000/api/v1/shops/" + this.shops[index].id + "/likes");
        console.log(likes);

        const shop = await axios.get("http://localhost:8000/api/v1/shops/" + this.shops[index].id);
        this.shops.splice(index, 1, shop.data.data);

        //         this.$router.go({
        //   path: this.$router.currentRoute.path,
        //   force: true,
        // });

        //console.log(shop);

      } catch (error) {
        alert(error);
      }
    }, 
    async getReservations() {
      const reservations = await axios.get("http://localhost:8000/api/v1/users/" + this.$store.state.user.id + "/reservations");
      this.reservations = reservations.data.data;

      for (const i in this.reservations) {
        this.active.push(true);
        console.log(i);
      }

      console.log(this.reservations);
      console.log(this.active);
    },
    async getLikes() {
      const likes = await axios.get("http://localhost:8000/api/v1/users/" + this.$store.state.user.id + "/likes"  );
      this.likes = likes.data.data;
      console.log(this.likes);
    },
  },
  computed: {
    filteredShops() {
      // いいねに紐づくショップ情報を取得
      const shops = [];

      for (const i in this.shops) {
        const shop = this.shops[i];

        // ログイン中のユーザーIDが、ショップに紐づくいいねリストにあるか確認
        const result = shop.likes.some((value) => {
          return value.user_id == this.$store.state.user.id;
        });
        if (result) {
          shops.push(shop);
        }
      }

      return shops;
    }
  },
  created() {
    this.getReservations();
    this.getLikes();
  },
};
</script>

<style scoped>
.home {
  flex-wrap: wrap; 
}
.reservation {
  background: #305DFF;
  color: white;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
  width: 50%;
}
.reservation_id {
  margin-top: 20px;
}
.title {
  margin: 10px;
  font-weight:bold;
  width: 350px;
  color: black;
}
.card {
  margin: 10px;
  width: 350px;
  background: #fff;
  border-radius: 5px;
  padding: 0 0 10px 0;
}
.card-content {
  padding: 20px;
}
.card-link {
  padding: 20px;
}
.card-link a {
  text-decoration: none;
  color: #0bd;
  margin: 0 10px;
  cursor: pointer;
}
.card-link a:hover {
  color: #0090aa;
}
.reservation {
  margin: 10px;
  width: 350px;
  border-radius: 5px;
  padding: 0 0 10px 0;
}
.reservation li {
  color: white;
  background: #305dff;
  text-align: left;
  padding: 10px;
  list-style: none;
}
.card-img {
  border-radius: 5px 5px 0 0;
  max-width: 100%;
  height: auto;
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
.card button {
  width: 100px;
  text-align: center;
  padding: 8px 0 10px;
  background-color: #305dff;
  border-radius: 10px;
  cursor: pointer;
  margin-right: 0px;
  border: none;
  color: white;
}
.area {
  margin-left: 20px;
  margin-right: 10px;
  cursor: pointer;
}
.genre {
  cursor: pointer;
}
.icon {
  padding: 20px 0 10px;
  margin: 0 10px 0 10px ;
  width: 8%;
  height: 8%;
  cursor: pointer;
}

</style>