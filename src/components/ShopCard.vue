<template>
  <div>
    <button v-if="ownerFlg" class="owner-button" @click="openModal">店舗を追加する</button>
    <div id="overlay" v-if="show">
      <div id="content" class="modal">
        <div>
          <ul>
            <li>店舗名：<input placeholder="店舗名" name="name" v-model="name"  cols="40"/></li>
            <li>
              地域：
              <select class="search" v-model="area_id">
                <option value="">All area</option>
                <option v-for="area in areas" :key="area.id" :value="area.id">{{area.name}}</option>
              </select>
            </li>
            <li>
              ジャンル：
              <select class="search" v-model="genre_id">
                <option value="">All genre</option>
                <option v-for="genre in genres" :key="genre.id" :value="genre.id">{{genre.name}}</option>
              </select>
            </li>
            <li>
              店舗概要：
              <textarea placeholder="店舗概要" name="summary" v-model="summary" class="flex" rows="4" cols="40" >
              </textarea>
            </li>
            <li>
              画像URL：
              <input placeholder="画像URL" name="image_url" v-model="image_url"  cols="40"/>
            </li>
          </ul>

        </div>
        <button v-if="this.id != ''" class="owner-button" @click="edit(index)">店舗情報を更新する</button>
        <button v-else class="owner-button" @click="send">店舗を追加する</button>
        <button class="owner-button" @click="closeModal">閉じる</button>
      </div>
    </div>
    <paginate name="paginate-shops" :list="filteredShops" :per="10"> 
      <div class="home flex">

        <div class="card" v-for="shop in paginated('paginate-shops')" :key="shop.id" >
          <img
            class="card-img"
            :src= "shop.image_url"
          />
          <div class="card-content">
            <h2 class="card-title">{{ shop.name }}</h2>
          </div>
          <div class="flex">
            <p class="area" @click="setArea(shop.area.name)" >#{{shop.area.name}}</p>
            <p class="genre" @click="setGenre(shop.genre.name)" >#{{shop.genre.name}}</p>
          </div>
          <div class="flex" v-if="!ownerFlg">
            <div class="card-link">
              <button @click="detail(shop.id)">詳しくみる</button>
            </div>
            <img v-if="!getFav[shop.id-1]" class="icon" src="../assets/like_false.png" @click="setFav(shop.id-1)" alt />
            <img v-if="getFav[shop.id-1]" class="icon" src="../assets/like_true.png" @click="setFav(shop.id-1)" alt />
          </div>
          <div v-else>
            <button class="owner-button" @click="openModal_update(shop.id-1)">更新</button>
            <!--<button class="owner-button" @click="cancel(shop.id-1, shop.id)">削除</button>-->
          </div>
        </div>
      </div>
    </paginate>
    <paginate-links for="paginate-shops" class="pagination" :classes="{
      'ul.paginate-links > li': 'page-item',
      'ul.paginate-links > li > a': 'page-link',
    }" :show-step-links="true"></paginate-links>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    area: String,
    genre: String,
    keyword: String
  },
  data() {
    return {
      shops: [],
      likes: [],
      areas: [],
      genres: [],
      paginate: ['paginate-shops'],
      show: false,
      id: "",
      index: "",
      name: "",
      area_id: "",
      genre_id: "",
      summary: "",
      image_url: "",
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

      if (this.$route.path === "/mypage") {
        this.$store.commit("area", area_name);
        this.$router.push("/");
      }
    },
    setGenre(genre_name) {
      this.genre = genre_name;

      if (this.$route.path === "/mypage") {
        this.$store.commit("genre", genre_name);
        this.$router.push("/");
      }
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
          //console.log("a: " + likes.data.data.shop);
        }
        
        const shop = await axios.get("http://localhost:8000/api/v1/shops/" + this.shops[index].id);
        this.shops.splice(index, 1, shop.data.data);
        console.log(shop);


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
    },
    openModal() {
      this.id = "";
      this.show = true;
    },
    openModal_update(index) {
      this.id = this.shops[index].id;
      this.index = index;
      this.name = this.shops[index].name;
      this.area_id = this.shops[index].area_id;
      this.genre_id = this.shops[index].genre_id;
      this.summary = this.shops[index].summary;
      this.image_url = this.shops[index].image_url;
      this.show = true;
    },
    closeModal() {
      this.id = "";
      this.show = false;
    },
    async send(){
      try {
        const shops = await axios.post("http://localhost:8000/api/v1/shops", {
          name: this.name,
          area_id: this.area_id,
          genre_id: this.genre_id,
          summary: this.summary,
          image_url: this.image_url
        });

        const shop = await axios.get("http://localhost:8000/api/v1/shops/" + shops.data.data.id);

        console.log(shop.data.data);
        this.shops.push(shop.data.data);
        this.show = false;

        console.log(shop);
      } catch (error) {
        alert(error);
      }
    },
    // 店舗情報更新
    async edit(index) {
      console.log("adasddsfd:   ");
      try {
        console.log("adasd:   "+this.id);
        await axios.put("http://localhost:8000/api/v1/shops/" + this.id, {
          name: this.name,
          area_id: this.area_id,
          genre_id: this.genre_id,
          summary: this.summary,
          image_url: this.image_url
        });
        const shop = await axios.get("http://localhost:8000/api/v1/shops/" + this.id);

        console.log(this.shops[index]);
        this.$set(this.shops, index, shop.data.data);
        this.show = false;
        this.id="";
        this.index+"";

        console.log(shop.data.data);
      } catch (error) {
        alert(error);
      }
    },
    // async cancel(index, shop_id){

    //   try {
    //     const comment = await axios.delete("http://localhost:8000/api/v1/shops/" + shop_id, {
    //     });

    //     this.shops.splice(index, 1);

    //   } catch (e) {
    //       alert(e);
    //   }
    // }
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
              if (this.$route.path === "/mypage") {
                // ログイン中のユーザーIDが、ショップに紐づくいいねリストにあるか確認
                const result = shop.likes.some((value) => {
                  return value.user_id == this.$store.state.user.id;
                });
                if (result) {
                  shops.push(shop);
                }
              } else {
                shops.push(shop);
              }
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
    },
    ownerFlg() {
      return this.$route.path === "/owner";
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

.owner-button {
  width: 100px;
  text-align: center;
  padding: 8px 0 10px;
  background-color: #0438FF;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 10px;
  color: white;
  border: none;
  margin: 10px;
}

.icon {
  padding: 10px 0 0px;
  margin: 0 10px 0 20px;
  width: 10%;
  height: 10%;
  cursor: pointer;
}

.right {
  margin: 0 0 0 auto;
}

#overlay {
  z-index: 1;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
#content {
  text-align: center;
  z-index: 2;
  width: 100%;
  padding: 10px;
  background: #fff;
  align-items: center;
  justify-content: center;
}

#content select,
#content textarea {
  margin-top: 5px;
  margin-bottom: 15px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 10px;
}

.pagination {
  display: flex;
  list-style-type: none;
  padding: 6px 12px;
  text-align: center;
}

.ul.paginate-links > li {
  display: inline;
  margin: 0 2px;
  padding: 0;
  display: inline-block;
  background:#9D50BB;
  width: 50px;
  height: 50px;
  text-align: center;
  position: relative;
}

.pagination li a{
  vertical-align: middle;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  display:table;
  color: #fff;
  text-decoration: none;
}

.pagination li a span{
  display:table-cell;
  vertical-align:middle;
}

.pagination li a:hover,
.pagination li a.active{
  color: #000;
  background: #ccf;
}
</style>