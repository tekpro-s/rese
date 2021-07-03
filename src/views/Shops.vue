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
    {{shops.data}}
    <div class="home flex">
        <div class="card" v-for="shop in filteredShops" :key="shop.id" >
          <img
            class="card-img"
            :src= shop.image_url
          />
          <div class="card-content">
            <h2 class="card-title">{{ shop.name }}</h2>
          </div>
          <div class="flex">
            <p class="area" @click="search(shop.area, '', '')" >#{{shop.area}}</p>
            <p class="genre" @click="search('', shop.genre, '')" >#{{shop.genre}}</p>
          </div>
          <div class="flex">
            <div class="card-link">
              <button @click="detail(shop.id)">詳しくみる</button>
            </div>
            <img v-if="!shop.like" class="icon" src="../assets/like_false.png" @click="fav(shop.id-1)" alt />
            <img v-if="shop.like" class="icon" src="../assets/like_true.png" @click="fav(shop.id-1)" alt />
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
  props: {
    props_area: String,
    props_genre: String,
  },
  data() {
    return {
      shops: [],
      shops_all: [],
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


    propsFilteredShops() {
      alert(this.props_area);
      alert(this.shops);
      const shopsArray = [];
      for (const i in this.shops) {
        if ((this.area == "" || this.shops[i].area == this.props_area)
          && (this.genre == "" || this.shops[i].genre == this.props_genre)){
          const shop = this.shops[i];
          shopsArray.push(shop);
        }
      }
      this.shops = shopsArray;
      alert(this.shops);
    },
    async fav(index) {
      try {
        // お気に入り追加していない場合
        if (!this.shops[index].like) {
          // お気に入り追加
          const like = await axios.post("http://localhost:3000/likes", {
            shop_id: this.shops[index].id,
            user_id: 1,
            name: this.shops[index].name,
            area: this.shops[index].area,
            genre: this.shops[index].genre,
            image_url: this.shops[index].image_url,
          })
          // ショップのlike更新
          const shop = await axios.put("http://localhost:3000/shops/" + this.shops[index].id, {
            name: this.shops[index].name,
            area: this.shops[index].area,
            genre: this.shops[index].genre,
            summary: this.shops[index].summary,
            image_url: this.shops[index].image_url,
            like: true
          })

          console.log(like);
          console.log(shop);
        } else {
          axios({
              method: "delete",
              url: "http://localhost:3000/likes",
              data: {
                shop_id: this.shops[index].id,
              },
          })
          // ショップのlike更新
          const shop = await axios.put("http://localhost:3000/shops/" + this.shops[index].id, {
            name: this.shops[index].name,
            area: this.shops[index].area,
            genre: this.shops[index].genre,
            summary: this.shops[index].summary,
            image_url: this.shops[index].image_url,
            like: false
          })

          //console.log(like);
          console.log(shop);
        }

        this.$router.go({
          path: this.$router.currentRoute.path,
          force: true,
        });

      } catch (error) {
        alert(error);
      }
    },
    async getShops() {
      const shops = await axios.get("http://localhost:8000/api/v1/shops");
      this.shops = shops.data.data;
      //alert(this.shops);
      //this.shops_all = shops.data;
      console.log(this.shops);
    },
    async getAreas() {
      const areas = await axios.get("http://localhost:3000/areas");
      this.areas = areas.data;
      console.log(this.areas);
    },
    async getGenres() {
      const genres = await axios.get("http://localhost:3000/genres");
      this.genres = genres.data;
      console.log(this.genres);
    }
  },
  computed: {
    filteredShops() {
      // 全店舗の元データを読み込む
      //this.shops = this.shops_all;
      const shops = [];
      for (const i in this.shops) {
        const shop = this.shops[i];
        if (shop.name.indexOf(this.keyword) !== -1) {
          if (shop.area == this.area || !this.area) {
            if (shop.genre == this.genre || !this.genre) {
              shops.push(shop);
            }
          }
        }
      }
      return shops;

    },
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