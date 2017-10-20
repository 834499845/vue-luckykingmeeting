<template>
  <div id="app" class="views">
    <router-view class="view" keep-alive></router-view>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  export default {
    name: 'views',
    data() {
      return {
      }
    },
    created: function () {
    },
    methods: {
    }
  }

</script>
<style>
  a {
    text-decoration: none;
  }
  
  [v-cloak] {
    display: none;
  }
  
  ul {
    margin: 0;
    padding: 0;
  }
  
  li {
    list-style: none;
  }
  
  .mint-button {
    height: 5rem;
  }
  
  p {
    margin: 0;
    padding: 0;
  }
  
  a,
  button,
  input,
  optgroup,
  select,
  textarea,
  div {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  
  body,
  html {
    margin: 0;
    padding: 0;
    font-family: "Microsoft YaHei", Arial, "Helvetica Neue", Helvetica, sans-serif;
    background: url('/static/img/timg.jpg') no-repeat;
    background-size: 100% 100%;
    background-position: center center;
    min-width: 1250px;
    min-height: 750px;

  }
  
  input,
  textarea {
    -webkit-appearance: none;
    outline: none;
  }
  
  a,
  img {
    -webkit-touch-callout: none;
  }
</style>