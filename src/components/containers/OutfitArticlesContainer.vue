<template>
  <div class="outfit-articles-container">
    <div class="articles-vertical-container">
      <ArticleSelector :inputSelectedArticleIndex="selectedArticleIndex" :outfit="outfit" 
          @articleSelected="selectArticleIndex"/>
    </div>
    <div class="articles-horizontal-container">
      <ArticleSelector :inputSelectedArticleIndex="selectedArticleIndex" :outfit="outfit" 
          @articleSelected="selectArticleIndex"/>
    </div>
    <div class="article-card-container">
      <ArticleCard v-if="selectedArticle" :article="selectedArticle" />
    </div>
  </div>
</template>

<script>
import ArticleSelector from "../ArticleSelector.vue";
import ArticleCard from "../ArticleCard.vue";

export default {
  name: "OutfitArticlesContainer",
  props: {
    outfit: Object,
  },
  components: {
    ArticleCard,
    ArticleSelector
  },
  data: function () {
    return {
      selectedArticleIndex: 0,
    };
  },
  computed: {
    selectedArticle: function () {
      if(this.outfit && this.outfit.articles && this.outfit.articles.length > 0) {
        return this.outfit.articles[this.selectedArticleIndex];
      } else {
        return null;
      }
    }
  },
  methods: {
    selectArticleIndex: function(index) {
      this.selectedArticleIndex = index;
    }
  }
};
</script>

<style lang="scss">
$desktopMinWidth: 1250px; /* 105px * 2 outer margins + 300px min-width image + 420px min-width articles + 300px OutfitPurchaseCard + 10px * 2 inner margins */
$smallMobileMaxWidth: 470px; /* 10px * 2 outer margins + 450px each block */

.outfit-articles-container {
  min-width: 420px;
  height: 100%;
  margin: 0 10px 20px 0;
  display: inline-block;
  flex-grow: 100;
  position: relative;

  .articles-vertical-container {
    width: 100px;
    height: 100%;
    margin-right: 20px;
    position: absolute;
    overflow-x: hidden;
    overflow-y: auto;
    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  /* Hide scrollbar for Chrome, Safari and Opera */
  .articles-vertical-container::-webkit-scrollbar {
    display: none;
  }

  .articles-horizontal-container {
    display:none;
    overflow-y: hidden;
    overflow-x: scroll;
  }

  .article-card-container {
    position: relative;
    top: 0px;
    left: calc(100px + 20px);
    width: calc(100% - (100px + 20px));
  }
}

@media screen and (min-width: $smallMobileMaxWidth) and (max-width: $desktopMinWidth) {
  .outfit-articles-container {
    width: 450px;
    margin-left: calc((100% - (450px)) / 2);
    margin-right: calc((100% - (450px)) / 2);
  }
}

@media screen and (max-width: $smallMobileMaxWidth) {
  .outfit-articles-container {
    min-width: 300px;
    width: 300px;
    margin-left: calc((100% - (300px)) / 2);
    margin-right: calc((100% - (300px)) / 2);

    .articles-vertical-container {
      display: none;
    }

    .articles-horizontal-container {
      width: 100%;
      height: 100px;
      margin-right: 20px;
      display: block;
      position: relative;

    }

    .article-card-container {
        width: 100%;
        left: 0px;
    }
  }
}
</style>