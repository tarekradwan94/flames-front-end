<template>
  <div class="style-selector-subcontainer">
    <button
      v-if="leftScrollButtonVisible"
      class="scroll-styles scroll-styles-left"
      @click.stop="scrollLeft"
    ></button>
    <div class="style-selector">
      <button
        v-for="style in styles"
        :key="style.uniqueName"
        class="style-card"
        :style="{'background-image': getImageUrl(style.previewImage)}"
        @click="gotoResults(style)"
      >
        <span>{{ style.name }}</span>
      </button>
    </div>
    <button
      v-if="rightScrollButtonVisible"
      class="scroll-styles scroll-styles-right"
      @click.stop="scrollRight"
    ></button>
  </div>
</template>

<script>
import { constants } from '../utilities/constants';

export default {
  name: "StyleSelector",
  props: {
    styles: Array,
  },
  data: function () {
    return {
      leftScrollButtonVisible: false,
      rightScrollButtonVisible: false,
    };
  },
  mounted: function () {
    window.addEventListener("resize", this.checkScrollButtonsAndFixScroll);
    this.checkScrollButtonsAndFixScroll();
  },
  beforeDestroy: function () {
    window.removeEventListener("resize", this.checkScrollButtonsAndFixScroll);
  },
  updated: function () {
    this.checkScrollButtonsAndFixScroll();
  },
  methods: {
    scrollLeft: function (event) {
        if(event.target.parentElement.getElementsByClassName("style-selector").length === 1) {
            let styleSelector = event.target.parentElement.getElementsByClassName("style-selector")[0];
            let cssTrasnformation = window.getComputedStyle(styleSelector).getPropertyValue("transform");
            let translate;
            if(cssTrasnformation === "none") {
                translate = 0;
            } else {
                let transformationString = cssTrasnformation.replace("matrix(", "").replace(")", "");
                let trasnformationArray = transformationString.split(",");
                translate = parseInt((trasnformationArray[4] || "0" ), 10); //[0]scaleX, [1]skewY, [2]skewX, [3]scaleY, [4]translateX, [5]translateY
            }
            translate += 212; //style card's width + margin
            if(translate > 0) { //right scroll limit
                translate = 0;
                setTimeout(function() {this.leftScrollButtonVisible = false;}.bind(this), 100);
            }
            this.rightScrollButtonVisible = true;
            styleSelector.style.transform = "translateX(" + translate + "px" + ")";
        }
    },
    scrollRight: function (event) {
        if(event.target.parentElement.getElementsByClassName("style-selector").length === 1) {
            let styleSelector = event.target.parentElement.getElementsByClassName("style-selector")[0];
            let cssTrasnformation = window.getComputedStyle(styleSelector).getPropertyValue("transform");
            let translate;
            if(cssTrasnformation === "none") {
                translate = 0;
            } else {
                let transformationString = cssTrasnformation.replace("matrix(", "").replace(")", "");
                let trasnformationArray = transformationString.split(",");
                translate = parseInt((trasnformationArray[4] || "0" ), 10); //[0]scaleX, [1]skewY, [2]skewX, [3]scaleY, [4]translateX, [5]translateY
            }
            translate -= 212; //style card's width + margin
            let styleSelectorContainerWidth = event.target.parentElement.offsetWidth;
            let styleSelectorWidth = styleSelector.offsetWidth;
            let scrollableWidth = -1 * ( styleSelectorWidth - styleSelectorContainerWidth );
            if(translate < scrollableWidth) { //left scroll limit
                translate = scrollableWidth;
                setTimeout(function() {this.rightScrollButtonVisible = false;}.bind(this), 100);
            }
            this.leftScrollButtonVisible = true;
            styleSelector.style.transform = "translateX(" + translate + "px" + ")";
        }
    },
    checkScrollButtonsAndFixScroll: function () {
        let styleSelectorContainer = this.$vnode.elm;
        if(styleSelectorContainer.getElementsByClassName("style-selector").length === 1) {
            let styleSelector = styleSelectorContainer.getElementsByClassName("style-selector")[0];
            let cssTrasnformation = window.getComputedStyle(styleSelector).getPropertyValue("transform");
            let translate;
            if(cssTrasnformation === "none") {
                translate = 0;
            } else {
                let transformationString = cssTrasnformation.replace("matrix(", "").replace(")", "");
                let trasnformationArray = transformationString.split(",");
                translate = parseInt((trasnformationArray[4] || "0" ), 10); //[0]scaleX, [1]skewY, [2]skewX, [3]scaleY, [4]translateX, [5]translateY
            }
            let styleSelectorContainerWidth = styleSelectorContainer.offsetWidth;
            let styleSelectorWidth = styleSelector.offsetWidth;
            let scrollableWidth = -1 * ( styleSelectorWidth - styleSelectorContainerWidth );
            if(translate < scrollableWidth) { //left scroll limit
                translate = scrollableWidth;
                styleSelector.style.transform = "translateX(" + translate + "px" + ")";
                setTimeout(function() {this.rightScrollButtonVisible = false;}.bind(this), 100);
            } else if (scrollableWidth < 0) {
                this.rightScrollButtonVisible = true;
            }

            if(translate > 0) { //right scroll limit
                translate = 0;
                styleSelector.style.transform = "translateX(" + translate + "px" + ")";
                setTimeout(function() {this.leftScrollButtonVisible = false;}.bind(this), 100);
            } else if (translate < 0) {
                this.leftScrollButtonVisible = true;
            }
        }
    },
    getImageUrl: function (imageLink) {
      //return "url(" + require("../assets/" + imageLink) + ")";
      return "url(" + imageLink + ")";
    },
    gotoResults: function (style) {
      this.$router.push({
        name: "results",
        params: { keyWords: null, occasionID: " ", styleID: style.uniqueName }
      });
      let interactionEndpoint = constants.backend.interactionEndpoint.openStyle + "/" + style.uniqueName;
      this.$api
          .post(interactionEndpoint)
          .then(function () {});
    }
  },
};
</script>

<style lang="scss">
.style-selector-subcontainer {
  white-space: nowrap;
  overflow: hidden;
  position: relative;

  .scroll-styles {
    z-index: 2;
    width: 35px;
    height: 35px;
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
  }

  .scroll-styles-left {
    left: 10px;
    background: url("../assets/scroll-left-white-icon.png") no-repeat center top;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
  }

  .scroll-styles-right {
    right: 10px;
    background: url("../assets/scroll-right-white-icon.png") no-repeat center
      top;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
  }

  .style-selector {
    position: relative;
    color: white;
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
 .style-selector::-webkit-scrollbar { /* Hide scrollbar for Chrome, Safari and Opera */
    display: none;
 }

  .style-card {
    position: relative;
    width: 200px;
    height: 150px;
    margin-right: 12px;
    border-radius: 5px;
    box-shadow: 2px 1px 2px #2b2b2b40;
    background-repeat: no-repeat;
    background-position: center top;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;

    span {
      position: absolute;
      bottom: 10px;
      left: 0px;
      width: 100%;
      text-align: center;
      font-size: 1.35rem;
    }
  }
}
</style>