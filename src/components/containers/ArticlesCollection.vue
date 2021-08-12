<template>
    <div class="articles-collection-container">
        <button v-if="leftScrollButtonVisible" class="scroll-articles-left" @click.stop="scrollLeft"></button>
        <div class="articles-collection">
            <ArticlePreview v-for="article in articles" :key="article.uniqueName" :article="article" />
        </div>
        <button v-if="rightScrollButtonVisible" class="scroll-articles-right" @click.stop="scrollRight"></button>
    </div>
</template>

<script>

import ArticlePreview from '../ArticlePreview.vue';

export default {
  name: 'ArticlesCollection',
  components: {
      ArticlePreview
  },
  props: {
      articles: Array
  },
  data: function () {
      return {
          leftScrollButtonVisible: false,
          rightScrollButtonVisible: false
      }
  },
  mounted: function () {
    let articlesContainer = this.$vnode.elm;
    if(articlesContainer.getElementsByClassName("articles-collection").length === 1) {
        let articlesCollection = articlesContainer.getElementsByClassName("articles-collection")[0];
        let articlesContainerWidth = articlesContainer.offsetWidth;
        let articlesCollectionWidth = articlesCollection.offsetWidth;
        let scrollableWidth = -1 * ( articlesCollectionWidth - articlesContainerWidth );
        if(scrollableWidth > 0) { //if shown space is enough for the contents, no scroll
          this.rightScrollButtonVisible = false;
        } else {
            this.rightScrollButtonVisible = true;
        }
    }
  },
  methods: {
      scrollLeft: function (event) {
          if(event.target.parentElement.getElementsByClassName("articles-collection").length === 1) {
              let articlesCollection = event.target.parentElement.getElementsByClassName("articles-collection")[0];
              let cssTrasnformation = window.getComputedStyle(articlesCollection).getPropertyValue("transform");
              let translate;
              if(cssTrasnformation === "none") {
                  translate = 0;
              } else {
                  let transformationString = cssTrasnformation.replace("matrix(", "").replace(")", "");
                  let trasnformationArray = transformationString.split(",");
                  translate = parseInt((trasnformationArray[4] || "0" ), 10); //[0]scaleX, [1]skewY, [2]skewX, [3]scaleY, [4]translateX, [5]translateY
              }
              translate += 106;
              if(translate > 0) { //right scroll limit
                  translate = 0;
                  setTimeout(function() {this.leftScrollButtonVisible = false;}.bind(this), 100);
              }
              this.rightScrollButtonVisible = true;
              articlesCollection.style.transform = "translateX(" + translate + "px" + ")";
          }
      },
      scrollRight: function (event) {
          if(event.target.parentElement.getElementsByClassName("articles-collection").length === 1) {
              let articlesCollection = event.target.parentElement.getElementsByClassName("articles-collection")[0];
              let cssTrasnformation = window.getComputedStyle(articlesCollection).getPropertyValue("transform");
              let translate;
              if(cssTrasnformation === "none") {
                  translate = 0;
              } else {
                  let transformationString = cssTrasnformation.replace("matrix(", "").replace(")", "");
                  let trasnformationArray = transformationString.split(",");
                  translate = parseInt((trasnformationArray[4] || "0" ), 10); //[0]scaleX, [1]skewY, [2]skewX, [3]scaleY, [4]translateX, [5]translateY
              }
              translate -= 106;
              let articlesContainerWidth = event.target.parentElement.offsetWidth;
              let articlesCollectionWidth = articlesCollection.offsetWidth;
              let scrollableWidth = -1 * ( articlesCollectionWidth - articlesContainerWidth );
              if(translate < scrollableWidth) { //left scroll limit
                translate = scrollableWidth;
                setTimeout(function() {this.rightScrollButtonVisible = false;}.bind(this), 100);
              }
              this.leftScrollButtonVisible = true;
              articlesCollection.style.transform = "translateX(" + translate + "px" + ")";
          }
      }
  }
};
</script>

<style lang="scss">

    .articles-collection-container {
        position: relative;
        width: 100%;
        height: 160px;
        //background-color: lightgray;

        button {
            position: absolute;
            width: 25px;
            height: 25px;
            top: 50%;
            transform: translate(0, -50%);
            z-index: 2;
        }

        .scroll-articles-left {
            left: 0px;
            background: url('../../assets/scroll-left-icon.png') no-repeat center top;
            -webkit-background-size: cover;
            -moz-background-size: cover;
            -o-background-size: cover;
            background-size: cover;
        }

        .scroll-articles-right {
            right: 0px;
            background: url('../../assets/scroll-right-icon.png') no-repeat center top;
            -webkit-background-size: cover;
            -moz-background-size: cover;
            -o-background-size: cover;
            background-size: cover;
        }

        .articles-collection {
            position: relative;
            white-space: nowrap;
            overflow-y: hidden;
            overflow-x: scroll;
            width: fit-content;
            height: 100%;
            display: inline-block;
            z-index: 1;
            transition: transform 300ms ease-in-out;
            -ms-overflow-style: none;  /* Hide scrollbar for IE and Edge */
            scrollbar-width: none;  /* Hide scrollbar for Firefox */
        }
        .articles-collection::-webkit-scrollbar { /* Hide scrollbar for Chrome, Safari and Opera */
           display: none;
        }
    }

</style>