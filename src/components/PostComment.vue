<template>
  <div>
    <div class="left-padding">
      <button class="comment-button" @click="openModal">投稿する</button>
    </div>
    {{shop}}
    <div id="overlay" v-if="show">
      <div id="content">
        <div class="comment">
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
      <div class="reservation" v-for="comment in shop.comments" :key="comment.id" >
        <ul class="data">
          <li>ユーザーID: {{ comment.user_id }}</li>
          <li>コメント:  {{ comment.content }}</li>
          <li>評価:  {{ comment.evaluation }}</li>
          <li>日付:  {{ comment.updated_at }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
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
        const comment = await axios.post("http://127.0.0.1:8000/api/v1/shops/"  + this.shop.id + "/comments", {
          user_id: this.$store.state.user.id,
          evaluation: this.evaluation,
          content: this.comment,
        })

        // コメント一覧にコメントを追加する
        this.shop.comments.push(comment.data.data)
        console.log(comment);
      } catch (error) {
        alert(error);
      }
    }
  },
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
.reservation {
  background: #305DFF;
  color: white;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
  width: 50%;
}
</style>