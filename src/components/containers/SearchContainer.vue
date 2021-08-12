<template>
  <div id="search-container">
    <div class="search-title">
        <h1>{{ $t('outfitsForYou') }}</h1>
    </div>
    <div class="search-bar-container">
        <SearchBar />
    </div>
  </div>
</template>

<script>
import SearchBar from '../SearchBar.vue';

export default {
  name: 'SearchContainer',
  components: {
      SearchBar
  }
}
</script>

<style lang="scss">

    $mobileMaxWidth: 800px;
    $smallMobileMaxWidth: 375px;

    #search-container {
        overflow: hidden;
        position: relative;
        top: 0px;
        left: 0px;
        height: 700px;
        width: 100%;
        background: url('../../assets/search-container-bg.png') no-repeat center top;
        -webkit-background-size: cover;
        -moz-background-size: cover;
        -o-background-size: cover;
        background-size: cover;

        .search-title {
            width: 100%;
            margin: 90px 0  90px 0;
            text-align: center;
            font-size: 1.7rem;
            color: white;
        }

        .search-bar-container {
            width: 55%;
            height: 45px;
            position: absolute;
            left: 50%;
            transform: translate(-50%);
        }
        @media screen and (max-width: $mobileMaxWidth) {
            .search-bar-container {
                width: 80%;
            }
        }
        @media screen and (max-width: $smallMobileMaxWidth) {
            .search-bar-container {
                width: 95%;
            }
        }
    }
</style>
