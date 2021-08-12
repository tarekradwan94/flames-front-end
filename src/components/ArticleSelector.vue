<template>
  <div class="article-selector">
    <div
      :class="{'article-selected' : index ===  selectedArticleIndex}"
      @click="selectArticleIndex(index)"
      v-for="(article, index) in outfit.articles"
      class="article"
      :key="index"
    >
      <img
        :alt="$t('article') + ': ' + article.name "
        :src="article.previewImage"
      />
    </div>
  </div>
</template>

<script>
import { constants } from '../utilities/constants';

export default {
  name: "ArticleSelector",
  props: {
    outfit: Object,
    inputSelectedArticleIndex: Number,
  },
  data: function () {
    return {
      selectedArticleIndex: this.inputSelectedArticleIndex,
    };
  },
  watch: {
    inputSelectedArticleIndex: function (newIndex) {
      this.selectedArticleIndex = newIndex;
    }
  },
  mounted: function () {
    window.addEventListener("resize", this.showSelectedArticle);
  },
  beforeDestroy: function () {
    window.removeEventListener("resize", this.showSelectedArticle);
  },
  methods: {
    selectArticleIndex: function (index) {
      this.selectedArticleIndex = index;
      this.$emit("articleSelected", index);
      let interactionEndpoint = constants.backend.interactionEndpoint.openArticle + "/" + this.outfit.articles[index].uniqueName;
          this.$api
              .post(interactionEndpoint)
              .then(function () {});
    },
    showSelectedArticle: function () {
      let articleSelector = this.$vnode.elm;
      if (
        articleSelector.getElementsByClassName("article-selected").length === 1
      ) {
        let selectedArticle = articleSelector.getElementsByClassName(
          "article-selected"
        )[0];
        selectedArticle.scrollIntoViewIfNeeded(); //show the selected article in case of device rotation (horizontal / vertical ArticleSelector switch)
      }
    },
  },
};
</script>

<style lang="scss">
$smallMobileMaxWidth: 470px; /* 10px * 2 outer margins + 450px each block */

.article-selector {
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  width: 100%;
  max-height: calc(100% - 20px);
  overflow-x: inherit;
  overflow-y: inherit;
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  .article {
    box-shadow: 2px 1px 2px #2b2b2b40;
    margin: 20px 5px 20px 5px;
    height: 90px;
    width: 90px;
    display: inline-block;

    img {
      width: 90px;
      height: 90px;
      object-fit: contain;
    }
  }

  .article-selected {
    border: 2px solid #006db6;
  }
}
/* Hide scrollbar for Chrome, Safari and Opera */
.article-selector::-webkit-scrollbar {
  display: none;
}
@media screen and (max-width: $smallMobileMaxWidth) {
  .article-selector {
    max-width: calc(100% - 20px);
    height: 100%;
    max-height: 100%;
    top: 0;
    transform: translate(0, 0);
    white-space: nowrap;

    .article {
      margin: 5px 20px 5px 20px;

      img {
        max-height: 100%;
      }
    }
  }
}
</style>