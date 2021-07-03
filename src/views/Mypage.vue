<template>
 <div>
   <HeaderAuth />
   <button @click="$router.push('/')">＜</button>
   <div class="flex">
      <div >
        <h2 class="title">予約状況</h2>
        <div class="reservation" v-for="reservation in reservations" :key="reservation.id" >
          <ul>
            <li>予約{{reservation.id}}</li>
            <li>Shop: {{reservation.shop_id}}</li>
            <li>Date:  {{reservation.date}}</li>
            <li>Time:  {{reservation.time}}</li>
            <li>Number:  {{reservation.number}}人</li>
          </ul>
          <img class="icon" src="../assets/cancel.png" @click="cancel(reservation.id)" alt />
        </div>
      </div>
      <div class="like">
        <h2 class="title">お気に入り店舗</h2>
        <div class="home flex">
            <div class="card" v-for="like in likes" :key="like.id" >
              <img
                class="card-img"
                :src= like.image_url
              />
              <div class="card-content">
                <h3 class="card-title">{{ like.name }}</h3>
              </div>
              <router-link :to="{name:'Shops'}" class="area">#{{like.area}}</router-link>
              <router-link :to="{name:'Shops'}" class="genre">#{{like.genre}}</router-link>
              <div class="flex">
                <div class="card-link">
                  <button @click="$router.push({ name: 'Detail', params: { shop_id: like.shop_id }})">詳しくみる</button>
                </div>
                <img class="icon" src="../assets/like_true.png" @click="fav(like.id)" alt />
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
    async cancel(id){
      const reservations = await axios.delete("http://localhost:3000/reservations/" + id);
      console.log(reservations);
      this.$router.go({
        path: this.$router.currentRoute.path,
        force: true,
      });
    },
    async fav(index) {
      try {
        // お気に入り削除
        //alert(index);
        //alert(this.likes[index].shop_id);
        // axios({
        //   method: "delete",
        //   url: "http://localhost:3000/likes",
        //   data: {
        //    id: index
        //   },
        // })
        const like = await axios.delete("http://localhost:3000/likes/" + index);
        console.log(this.likes[index].shop_id);
        //alert(this.likes[index].shop_id);
        // ショップのlike更新
        // const shop = await axios.put("http://localhost:3000/shops/" + this.likes[index].shop_id, {
        //   name: this.likes[index].name,
        //   area: this.likes[index].area,
        //   genre: this.likes[index].genre,
        //   summary: this.likes[index].summary,
        //   image_url: this.likes[index].image_url,
        //   like: false
        // })

        console.log(like);
        //console.log(shop);
        this.$router.go({
          path: this.$router.currentRoute.path,
          force: true,
        });

      } catch (error) {
        alert(error);
      }
    }, 
    async getReservations() {
      const reservations = await axios.get("http://localhost:3000/reservations");
      this.reservations = reservations.data;
      console.log(this.reservations);
    },
    async getLikes() {
      const likes = await axios.get("http://localhost:3000/likes");
      this.likes = likes.data;
      console.log(this.likes);
    },
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
}
.icon {
  padding: 20px 0 10px;
  width: 10%;
  height: 10%;
  cursor: pointer;
}
</style>