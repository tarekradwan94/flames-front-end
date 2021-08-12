<template>
  <div id="search-bar">
    <img class="search-icon" :alt="$t('search')" src="../assets/search-icon.png">
    <input v-model="searchKeyWords" class="search-input" type="text" :placeholder="$t('whatImatchWith')" @keyup.enter="search">
  </div>
</template>

<script>

export default {
  name: 'SearchBar',
  data: function () {
    return {
      searchKeyWords: "",
    }
  },
  methods: {
    search: function () {
      if(this.searchKeyWords !== "") { //prevent navigation if no key word is input
        this.$router.push({ name: 'results', params: { keyWords: this.searchKeyWords, occasionID: " ", styleID: " " } });
      }
    }
  }
};
</script>

<style lang="scss">

$smallMobileMaxWidth: 350px;

    #search-bar {
        height: 45px;
        width: 100%;
        border-radius: 10px;
        border: 1px solid #0567FF;
        overflow: hidden;
        position: relative;
        top: 0px;
        left: 0px;
        background-color: white;

        .search-icon {
            width: 18px;
            height: 18px;
            position: absolute;
            top: 50%;
            margin: 0 20px 0 20px;
            transform: translate(0, -50%);
            text-align: center;
            font-size: 1.7rem;
            color: white;
        }
        @media screen and (max-width: $smallMobileMaxWidth) {
            .search-icon {
                margin: 0 10px 0 10px;
            }
        }

        .search-input {
            position: absolute;
            height: 100%;
            width: calc(100% - 58px);
            border: 0;
            padding: 0;
            left: 58px;
            font-family: Avenir;
            font-size: 0.85rem;
            outline: none;
        }
        @media screen and (max-width: $smallMobileMaxWidth) {
            .search-input {
                left: 38px;
                width: calc(100% - 38px);
            }
        }
    }
</style>
