<template>
 <div>
   <HeaderAuth />
   <LoginCard :role="2" />
 </div>
</template>

<script>
import HeaderAuth from "../components/HeaderAuth";
import LoginCard from "../components/LoginCard";
export default {
  components: {
    HeaderAuth,
    LoginCard
  },
};
</script>
