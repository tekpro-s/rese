<template>
  <div>
    <div class="left-padding">
      <button class="comment-button" @click="openModal">投稿する</button>
    </div>

    <div id="overlay" v-if="show">
      <div id="content">
        <div >
          <select placeholder="評価" id="evaluation" name="evaluation" v-model="evaluation" class="flex">
            <option value="">評価を選択してください</option>
            <option value="5">5（とても良い）</option>
            <option value="4">4（良い）</option>
            <option value="3">3（普通）</option>
            <option value="2">2（悪い）</option>
            <option value="1">1（とても悪い）</option>
          </select>
          <textarea placeholder="コメント" v-model="comment" class="flex" rows="4" cols="40" >
          </textarea>
        </div>
        <button @click="send">投稿する</button>
        <button @click="closeModal">閉じる</button>
      </div>
    </div>
    <div>
      <div v-for="comment in shop.comments" :key="comment.id" >
        <ul class="comment" v-if="comment.user">

          <li><b>{{ comment.user.name }}さんのコメント</b></li>

          <div class="top-banner" >
            <li  v-for="n in comment.evaluation" :key="n"><img src="../assets/star.png"></li>
          </div>
          <li>{{ comment.content }}</li>
          <li class="created_at">{{ comment.created_at | moment }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
export default {
  props: {
    shop: Object
  },
  data() {
    return {
      evaluation: 5,
      comment: "",
      show: false,
    };
  },
  methods: {
    openModal() {
      this.show = true;
    },
    closeModal() {
      this.show = false;
    },
    async send() {
      try {
        //コメントを投稿する
        this.show = false;
        console.log(this.$store.state.user.id);
        console.log(this.shop.id);
        console.log(this.evaluation);
        console.log(this.comment);

        //ユーザーの予約情報取得
        const reservations = await axios.get("http://localhost:8000/api/v1/users/" + this.$store.state.user.id + "/reservations");

        // 詳細情報のショップIDが、ショップに紐づく予約情報にあり、現在日が予約時刻を過ぎているか確認
        const result = reservations.data.data.some((value) => {
          console.log(value);
          console.log(value.created_at + " | " + new Date());
          console.log(moment(new Date()).isAfter(value.date));
          return (value.shop_id == this.shop.id && moment(value.date).isAfter(new Date()));
        });

        console.log("aaaa "+result);

        // 詳細情報のショップIDが、ショップに紐づく予約情報にあり、現在日が予約時刻を過ぎている場合コメント可能
        if (result) {
          const comment = await axios.post("http://localhost:8000/api/v1/shops/"  + this.shop.id + "/comments", {
            user_id: this.$store.state.user.id,
            evaluation: this.evaluation,
            content: this.comment,
          })

          // コメント一覧にコメントを追加する
          const user = {id: this.$store.state.user.id, name: this.$store.state.user.name}
          console.log(user);
          console.log(comment.data.data);
          this.$set(comment.data.data, 'user', user)

          this.shop.comments.unshift(comment.data.data)
          //this.shop.comments.push(comment.data.data)
          console.log(this.shop.comments);
          console.log(comment.data.data);
        } else {
          alert("予約時刻を過ぎていないためコメント不可です");
        }

      } catch (error) {
        alert(error);
      }
    }
  },
  filters: {
      moment: function (date) {
          return moment(date).format('YYYY/MM/DD HH:mm');
      }
  }
}
</script>

<style scoped>
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

#content select,textarea {
  margin-top: 5px;
  margin-bottom: 15px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 10px;
}
.comment-button {
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
.comment {
  background: #305DFF;
  color: white;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
  width: 50%;
  list-style: none;
}
.comment li {
  margin-top: 10px;
  
}
.top-banner{
	display: flex;
	flex-wrap:wrap;
  
}
.top-banner li {
	width: calc(20%/5);/*←画像を横に4つ並べる場合*/
	box-sizing:border-box;
}
.top-banner li img {
	max-width:100%; /*画像のはみだしを防ぐ*/
	height: auto; /*画像の縦横比を維持 */
}
.created_at {
  font-size: 12px;
  margin-bottom: 10px;
}
</style>