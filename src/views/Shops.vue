<template>
  <div>
    <HeaderAuth />
    <select class="search" v-model="area">
      <option value="">All area</option>
      <option v-for="area in areas" :key="area.id" :value="area.name">{{area.name}}</option>
    </select>
    <select class="search" v-model="genre">
      <option value="">All genre</option>
      <option v-for="genre in genres" :key="genre.id" :value="genre.name">{{genre.name}}</option>
    </select>
    <input class="search" placeholder="Search" v-model="keyword"/>
    {{getFav}}
    <div class="home flex">
        <div class="card" v-for="shop in filteredShops" :key="shop.id" >
                    {{shop.likes}}
          <img
            class="card-img"
            :src= shop.image_url
          />
          <div class="card-content">
            <h2 class="card-title">{{ shop.name }}</h2>
          </div>
          <div class="flex">
            <p class="area" @click="setArea(shop.area.name)" >#{{shop.area.name}}</p>
            <p class="genre" @click="setGenre(shop.genre.name)" >#{{shop.genre.name}}</p>
          </div>
          <div class="flex">
            <div class="card-link">
              <button @click="detail(shop.id)">詳しくみる</button>
            </div>
            <img v-if="!getFav[shop.id-1]" class="icon" src="../assets/like_false.png" @click="setFav(shop.id-1)" alt />
            <img v-if="getFav[shop.id-1]" class="icon" src="../assets/like_true.png" @click="setFav(shop.id-1)" alt />
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import HeaderAuth from "../components/HeaderAuth";
import axios from "axios";
export default {
  components: {
    HeaderAuth
  },
  data() {
    return {
      shops: [],
      likes: [],
      areas: [],
      genres: [],
      area: this.$store.state.area,
      genre: this.$store.state.genre,
      keyword: ""
    }
  },
  methods: {
    detail(id) {
      this.$store.commit("area", "");
      this.$store.commit("genre", "");
      this.$router.push({ name: 'Detail', params: { shop_id: id } })
    },
    setArea(area_name) {
      this.area = area_name;
    },
    setGenre(genre_name) {
      this.genre = genre_name;
    },
    async setFav(index) {
      try {
        // ログイン中のユーザーIDが、ショップに紐づくいいねリストにあるか確認
        const result = this.shops[index].likes.some((value) => {
          return value.user_id == this.$store.state.user.id;
        });

        // いいねが存在するか確認
        if (result) {
          // いいねが存在する場合いいね削除
          const likes = await axios.delete("http://localhost:8000/api/v1/shops/" + this.shops[index].id + "/likes", {
            params: { user_id: this.$store.state.user.id }
          });

          console.log(likes);
        } else {
          // いいねが存在しない場合いいね追加
          const likes = await axios.put("http://localhost:8000/api/v1/shops/" + this.shops[index].id + "/likes", {
            user_id: this.$store.state.user.id
          });

          console.log(likes);

        }

        // console.log("1:" + this.shops[index].likes[0]);
        // this.getShops();
        // console.log("2:" + this.shops[index].likes[0]);
        // this.shops[index].likes.some((value) => {
        //   console.log("1:" + value.user_id);
        // });
        // alert(this.shops[index].id);
        const shop = await axios.get("http://localhost:8000/api/v1/shops/" + this.shops[index].id);
        this.shops.splice(index, 1, shop.data.data);
        console.log(shop);
        // console.log(shop.data.data);
        // console.log(shop.data);
        // console.log(this.shops[index]);
        // this.shops[index] = shop.data.data;
        //this.likes[index] = 

      } catch (error) {
        alert(error);
      }
    },
    async getShops() {
      const shops = await axios.get("http://localhost:8000/api/v1/shops");
      this.shops = shops.data.data;
      console.log(this.shops);
    },
    async getAreas() {
      const areas = await axios.get("http://localhost:8000/api/v1/areas");
      this.areas = areas.data.data;
      console.log(this.areas);
    },
    async getGenres() {
      const genres = await axios.get("http://localhost:8000/api/v1/genres");
      this.genres = genres.data.data;
      console.log(this.genres);
    }
  },
  computed: {
    filteredShops() {
      // 全店舗の元データを読み込む
      const shops = [];

      for (const i in this.shops) {
        const shop = this.shops[i];
        if (shop.name.indexOf(this.keyword) !== -1) {
          if (shop.area.name == this.area || !this.area) {
            if (shop.genre.name == this.genre || !this.genre) {
              shops.push(shop);
            }
          }
        }
      }
      return shops;

    },
    getFav() {
      const likes = [];

      for (const i in this.shops) {
        // ログイン中のユーザーIDが、ショップに紐づくいいねリストにあるか確認
        const result = this.shops[i].likes.some((value) => {
          return value.user_id == this.$store.state.user.id;
        });
        likes.push(result);
        
      }

      return likes;
    }
  },
  created() {
    this.getShops();
    this.getAreas();
    this.getGenres();
  },
};
</script>

<style scoped>
.home {
  justify-content: space-around; 
  flex-wrap: wrap; 
}
.card {
  width: 27%;
  margin: 5px 0;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 5px #ccc;
}
.card-img {
  border-radius: 5px 5px 0 0;
  max-width: 100%;
  height: auto;
}
.card-content {
  padding: 20px;
}
.card-title {
  font-size: 20px;
  color: #333;
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
.card button {
  width: 100px;
  padding: 8px 0 10px;
  background-color: #305dff;
  border-radius: 10px;
  cursor: pointer;
  margin-right: 0px;
  border: none;
  color:white;
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
.search {
  margin-left: 20px;
}

</style>