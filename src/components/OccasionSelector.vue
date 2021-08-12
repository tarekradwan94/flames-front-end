<template>
  <div class="occasion-selector-subcontainer">
    <button
      v-if="leftScrollButtonVisible"
      class="scroll-occasions scroll-occasions-left"
      @click.stop="scrollLeft"
    ></button>
    <div class="occasion-selector">
      <button
        v-for="occasion in occasions"
        :key="occasion.uniqueName"
        class="occasion-card"
        :style="{'background-image': getImageUrl(occasion.previewImage)}"
        @click="gotoResults(occasion)"
      >
        <span>{{ occasion.name }}</span>
      </button>
    </div>
    <button
      v-if="rightScrollButtonVisible"
      class="scroll-occasions scroll-occasions-right"
      @click.stop="scrollRight"
    ></button>
  </div>
</template>

<script>
import { constants } from '../utilities/constants';

export default {
  name: "OccasionSelector",
  props: {
    occasions: Array,
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
        if(event.target.parentElement.getElementsByClassName("occasion-selector").length === 1) {
            let occasionSelector = event.target.parentElement.getElementsByClassName("occasion-selector")[0];
            let cssTrasnformation = window.getComputedStyle(occasionSelector).getPropertyValue("transform");
            let translate;
            if(cssTrasnformation === "none") {
                translate = 0;
            } else {
                let transformationString = cssTrasnformation.replace("matrix(", "").replace(")", "");
                let trasnformationArray = transformationString.split(",");
                translate = parseInt((trasnformationArray[4] || "0" ), 10); //[0]scaleX, [1]skewY, [2]skewX, [3]scaleY, [4]translateX, [5]translateY
            }
            translate += 212; //occasion card's width + margin
            if(translate > 0) { //right scroll limit
                translate = 0;
                setTimeout(function() {this.leftScrollButtonVisible = false;}.bind(this), 100);
            }
            this.rightScrollButtonVisible = true;
            occasionSelector.style.transform = "translateX(" + translate + "px" + ")";
        }
    },
    scrollRight: function (event) {
        if(event.target.parentElement.getElementsByClassName("occasion-selector").length === 1) {
            let occasionSelector = event.target.parentElement.getElementsByClassName("occasion-selector")[0];
            let cssTrasnformation = window.getComputedStyle(occasionSelector).getPropertyValue("transform");
            let translate;
            if(cssTrasnformation === "none") {
                translate = 0;
            } else {
                let transformationString = cssTrasnformation.replace("matrix(", "").replace(")", "");
                let trasnformationArray = transformationString.split(",");
                translate = parseInt((trasnformationArray[4] || "0" ), 10); //[0]scaleX, [1]skewY, [2]skewX, [3]scaleY, [4]translateX, [5]translateY
            }
            translate -= 212; //occasion card's width + margin
            let occasionSelectorContainerWidth = event.target.parentElement.offsetWidth;
            let occasionSelectorWidth = occasionSelector.offsetWidth;
            let scrollableWidth = -1 * ( occasionSelectorWidth - occasionSelectorContainerWidth );
            if(translate < scrollableWidth) { //left scroll limit
                translate = scrollableWidth;
                setTimeout(function() {this.rightScrollButtonVisible = false;}.bind(this), 100);
            }
            this.leftScrollButtonVisible = true;
            occasionSelector.style.transform = "translateX(" + translate + "px" + ")";
        }
    },
    checkScrollButtonsAndFixScroll: function () {
        let occasionSelectorContainer = this.$vnode.elm;
        if(occasionSelectorContainer.getElementsByClassName("occasion-selector").length === 1) {
            let occasionSelector = occasionSelectorContainer.getElementsByClassName("occasion-selector")[0];
            let cssTrasnformation = window.getComputedStyle(occasionSelector).getPropertyValue("transform");
            let translate;
            if(cssTrasnformation === "none") {
                translate = 0;
            } else {
                let transformationString = cssTrasnformation.replace("matrix(", "").replace(")", "");
                let trasnformationArray = transformationString.split(",");
                translate = parseInt((trasnformationArray[4] || "0" ), 10); //[0]scaleX, [1]skewY, [2]skewX, [3]scaleY, [4]translateX, [5]translateY
            }
            let occasionSelectorContainerWidth = occasionSelectorContainer.offsetWidth;
            let occasionSelectorWidth = occasionSelector.offsetWidth;
            let scrollableWidth = -1 * ( occasionSelectorWidth - occasionSelectorContainerWidth );
            if(translate < scrollableWidth) { //left scroll limit
                translate = scrollableWidth;
                occasionSelector.style.transform = "translateX(" + translate + "px" + ")";
                setTimeout(function() {this.rightScrollButtonVisible = false;}.bind(this), 100);
            } else if (scrollableWidth < 0) {
                this.rightScrollButtonVisible = true;
            }

            if(translate > 0) { //right scroll limit
                translate = 0;
                occasionSelector.style.transform = "translateX(" + translate + "px" + ")";
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
    gotoResults: function (occasion) {
      this.$router.push({
        name: "results",
        params: { keyWords: null, occasionID: occasion.uniqueName, styleID: " " }
      });
      let interactionEndpoint = constants.backend.interactionEndpoint.openOccasion + "/" + occasion.uniqueName;
      this.$api
          .post(interactionEndpoint)
          .then(function () {});
    }
  },
};
</script>

<style lang="scss">
.occasion-selector-subcontainer {
  white-space: nowrap;
  overflow: hidden;
  position: relative;

  .scroll-occasions {
    z-index: 2;
    width: 35px;
    height: 35px;
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
  }

  .scroll-occasions-left {
    left: 10px;
    background: url("../assets/scroll-left-white-icon.png") no-repeat center top;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
  }

  .scroll-occasions-right {
    right: 10px;
    background: url("../assets/scroll-right-white-icon.png") no-repeat center
      top;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
  }

  .occasion-selector {
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
 .occasion-selector::-webkit-scrollbar { /* Hide scrollbar for Chrome, Safari and Opera */
    display: none;
 }

  .occasion-card {
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