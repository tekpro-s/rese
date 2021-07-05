<template>
 <div>
   <HeaderAuth />
   <button @click="$router.push('/')">&lt;</button>
   <div class="flex">
      <div >
        <h2 class="title">{{this.$store.state.user.name}}さんの予約状況</h2>
        <div class="reservation" v-for="reservation in reservations" :key="reservation.id" >
          <ul>
            <li>予約{{reservation.id}}</li>
            <li>Shop: {{reservation.shop_id}}</li>
            <li>Date:  {{reservation.date}}</li>
            <li>Time:  {{reservation.time}}</li>
            <li>Number:  {{reservation.number}}人</li>
          </ul>
          <img class="icon" src="../assets/cancel.png" @click="cancel(reservation.shop_id, reservation.id)" alt />
        </div>
      </div>
      <div class="like">
        <h2 class="title">お気に入り店舗</h2>
        <div class="home flex">
            <div class="card" v-for="shop in filteredShops" :key="shop.id" >
              <img
                class="card-img"
                :src= shop.image_url
              />
              <div class="card-content">
                <h3 class="card-title">{{ shop.name }}</h3>
              </div>
              <div class="flex">
                <p class="area" @click="area(shop.area.name)">#{{shop.area.name}}</p>
                <p class="genre" @click="genre(shop.genre.name)">#{{shop.genre.name}}</p>
              </div>
              <div class="flex">
                <div class="card-link">
                  <button @click="detail(shop.id)">詳しくみる</button>
                </div>
                <img class="icon" src="../assets/like_true.png" @click="deleteFav(shop.id-1)" alt />
              </div>
            </div>
          </div>
        </div>
    </div>
 </div>
</template>

<script>
import HeaderAuth from "../components/HeaderAuth";
import axios from "axios";
export default {
  data() {
    return {
      email: this.email,
      password: this.password,
      reservations: [],
      likes: [],
      shops: []
    };
  },
  components: {
    HeaderAuth
  },
  methods: {
    async cancel(shop_id, reservation_id){
      try {
        const reservations = await axios.delete("http://localhost:8000/api/v1/shops/" + shop_id + "/reservations", {
          params: { reservation_id: reservation_id }
        });

        console.log(reservations);
        this.$router.go({
          path: this.$router.currentRoute.path,
          force: true,
        });
      } catch (e) {
          alert(e);
      }
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

        console.log(likes);

        this.$router.go({
          path: this.$router.currentRoute.path,
          force: true,
        });

      } catch (error) {
        alert(error);
      }
    }, 
    async getReservations() {
      const reservations = await axios.get("http://localhost:8000/api/v1/users/" + this.$store.state.user.id + "/reservations");
      this.reservations = reservations.data.data;
      console.log(this.reservations);
    },
    async getLikes() {
      const likes = await axios.get("http://localhost:8000/api/v1/users/" + this.$store.state.user.id + "/likes"  );
      this.likes = likes.data.data;
      console.log(this.likes);
    },
    async getShops() {
      const shops = await axios.get("http://localhost:8000/api/v1/shops");
      this.shops = shops.data.data;
      console.log(this.shops);
    }
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
    },
  },
  created() {
    this.getReservations();
    this.getLikes();
    this.getShops();
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
  width: 10%;
  height: 10%;
  cursor: pointer;
}

</style>