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
    <ShopCard :area="area" :genre="genre" :keyword="keyword" />
  </div>
</template>

<script>
import HeaderAuth from "../components/HeaderAuth";
import ShopCard from "../components/ShopCard";
import axios from "axios";
export default {
  components: {
    HeaderAuth,
    ShopCard
  },
  data() {
    return {
      areas: [],
      genres: [],
      area: this.$store.state.area,
      genre: this.$store.state.genre,
      keyword: ""
    }
  },
  methods: {
    setArea(area_name) {
      this.area = area_name;
    },
    setGenre(genre_name) {
      this.genre = genre_name;
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
  created() {
    this.getAreas();
    this.getGenres();
  },
}
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