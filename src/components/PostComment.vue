<template>
  <div>
    <div class="left-padding">
      <button :disabled="!commentButtonFlg" class="comment-button" @click="openModal">投稿する</button>
    </div>
    <div id="overlay" v-if="show">
      <div id="content">
        <validation-observer ref="obs" v-slot="ObserverProps">
          <div>
            <validation-provider name="evaluation" rules="required">
              <div slot-scope="ProviderProps">
                <select placeholder="評価" id="evaluation" name="evaluation" v-model="evaluation" class="flex">
                  <option value="">評価を選択してください</option>
                  <option value=5>5（とても良い）</option>
                  <option value=4>4（良い）</option>
                  <option value=3>3（普通）</option>
                  <option value=2>2（悪い）</option>
                  <option value=1>1（とても悪い）</option>
                </select>
                <p class="error">{{ ProviderProps.errors[0] }}</p>
              </div>
            </validation-provider>
            <validation-provider name="comment" rules="required">
              <div slot-scope="ProviderProps">
                <textarea placeholder="コメント" name="comment" v-model="comment" class="flex" rows="4" cols="40" >
                </textarea>
                <p class="error">{{ ProviderProps.errors[0] }}</p>
              </div>
            </validation-provider>
          </div>
          <button class="comment-button" @click="send" :disabled="ObserverProps.invalid || !ObserverProps.validated">投稿する</button>
          <button class="comment-button" @click="closeModal">閉じる</button>
        </validation-observer>
      </div>
    </div>
    <div>
      <div v-for="comment in shop.comments" :key="comment.id" >
        <ul class="comment" v-if="comment.user">
          {{comment}}
          <li><b>{{ comment.user.name }}さんのコメント</b></li>

          <div class="evaluation-star" >
            {{comment.evaluation}}
            <li v-for="n in comment.evaluation" :key="n"><img src="../assets/star.png">{{n}}</li>
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
import { extend, ValidationProvider, ValidationObserver } from 'vee-validate/dist/vee-validate.full'
import { required } from 'vee-validate/dist/rules';
// バリデーションルール
extend('required', required);
export default {
  props: {
    shop: Object
  },
  data() {
    return {
      evaluation: "",
      comment: "",
      show: false,
      reservations: [],
    };
  },
  methods: {
    openModal() {
      this.show = true;
    },
    closeModal() {
      this.show = false;
    },
    async getReservations() {
      //ユーザーの予約情報取得
      const reservations = await axios.get("http://localhost:8000/api/v1/users/" + this.$store.state.user.id + "/reservations");
      console.log(reservations);
      this.reservations = reservations.data.data;
      console.log(this.reservations);
    },
    async send() {
      try {
        //コメントを投稿する
        this.show = false;
        console.log(this.$store.state.user.id);
        console.log(this.shop.id);
        console.log(this.evaluation);
        console.log(this.comment);

        // 詳細情報のショップIDが、ショップに紐づく予約情報にあり、現在日が予約時刻を過ぎている場合コメント可能
        if (this.commentButtonFlg){

          const comment = await axios.post("http://localhost:8000/api/v1/shops/"  + this.shop.id + "/comments", {
            user_id: this.$store.state.user.id,
            evaluation: this.evaluation,
            content: this.comment,
          })

          // コメント一覧にコメントを追加する
          const user = {id: this.$store.state.user.id, name: this.$store.state.user.name}
          console.log(user);
          console.log(comment.data.data);
          this.$set(comment.data.data, 'user', user);
          this.$set(comment.data.data, 'evaluation', parseInt(comment.data.data.evaluation));

          this.shop.comments.unshift(comment.data.data)
          //this.shop.comments.push(comment.data.data)
          console.log(this.shop.comments);
          console.log(comment.data.data);

          this.evaluation = "";
          this.comment = "";
        } else {
          alert("予約日時が現在日時以前のためコメント不可です");
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
  },
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  created() {
    this.getReservations();
  },
  computed: {
    commentButtonFlg() {
        // 詳細情報のショップIDが、ショップに紐づく予約情報にあり、現在日が予約時刻を過ぎているか確認
        const result = this.reservations.some((value) => {
          console.log(value);
          console.log(value.date+ " " + value.time + " | " + new Date());
          console.log(moment(new Date()).isAfter(value.date + " " + value.time));
          return (value.shop_id == this.shop.id && moment(new Date()).isAfter(value.date+ " " + value.time));
        });
      console.log(result);
      return result;
    },
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
.evaluation-star {
	display: flex;
	flex-wrap:wrap;
  
}
.evaluation-star li {
	width: calc(20%/5);/*←画像を横に4つ並べる場合*/
	box-sizing:border-box;
}
.evaluation-star li img {
	max-width:100%; /*画像のはみだしを防ぐ*/
	height: auto; /*画像の縦横比を維持 */
}
.created_at {
  font-size: 12px;
  margin-bottom: 10px;
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
  margin: 10px;
}
.comment-button:disabled {
  background-color: #a9a9a9;
}
</style>