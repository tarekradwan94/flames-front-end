<template>
  <div id="outfitPage">
    <HeadBar />
    <div class="outfit-container">
      <div class="outfit-flex">
        <div @mousemove="moveLens" @mouseenter="showZoom" @mouseleave="hideZoom"
            class="image-zoom-lens" :style="{'display': outfitZoomDisplay, 'left':
            lensLeft, 'top': lensTop, 'width': lensWidth, 'height': lensHeight}"></div>
        <img @mousemove="moveLens" @mouseenter="showZoom" @mouseleave="hideZoom"
            @load="setUpZoom" v-if="outfit" class="outfit-image"
            :alt="$t('outiftPreview') + ': ' + outfit.uniqueName " :src="outfit.image"
        />
        <div class="outfit-image-zoom" :style="{'display': outfitZoomDisplay, 'left': outfitImageZoomLeft, 'top': outfitImageZoomTop,
            'width': outfitImageZoomWidth, 'height': outfitImageZoomHeight, 'backgroundPosition': outfitImageZoomBackgroundPosition,
            'backgroundImage': outfitImageZoomBackgroundImage, 'backgroundSize': outfitImageZoomBackgroundSize}"></div>
        <OutfitArticlesContainer v-if="outfit" :outfit="outfit" />
      </div>
      <OutfitPurchaseCard v-if="outfit" :outfit="outfit" />
    </div>
  </div>
</template>

<script>
import HeadBar from "../HeadBar.vue";
import OutfitPurchaseCard from "../OutfitPurchaseCard.vue";
import OutfitArticlesContainer from "../containers/OutfitArticlesContainer.vue";
import { constants } from '../../utilities/constants';
import { utilities } from '../../utilities/utilities';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: "OutfitPage",
  components: {
    HeadBar,
    OutfitPurchaseCard,
    OutfitArticlesContainer
  },
  props: {
    uniqueName: String,
  },
  mounted: function () {
    this.loadOutfit(this.uniqueName);
    window.addEventListener('resize', this.setUpZoom.bind(this));
    // start tracking outfit show time and save it as interaction
    var outfitObserver = new IntersectionObserver(function(entries) {
      for(let i=0; i<entries.length; i++) {
        if(entries[i].isIntersecting) {
          // GO
          this.showTime = new Date();
        } else if(this.showTime !== null) {
          //STOP
          const showTimeDuration = Math.abs(this.showTime - new Date()); //duration in ms
          this.showTime = null;
          const showTimeDurationInSeconds = Math.ceil(showTimeDuration / 1000); 

          requestIdleCallback(function() {
            let interactionEndpoint = constants.backend.interactionEndpoint.showTimeOutfit + "/" + this.outfit.uniqueName;
            this.$api
                .post(interactionEndpoint, {showTime: showTimeDurationInSeconds})
                .then(function () {});
          }.bind(this));

        }
      }
    }.bind(this), { root: null,  threshold: [constants.interaction.outfitShowTimeTriggerThreshold] });

    outfitObserver.observe(this.$vnode.elm);

    // start tracking zoom time and save it as interaction
    var outfitZoomObserver = new IntersectionObserver(function(entries) {
      for(let i=0; i<entries.length; i++) {
        if(entries[i].isIntersecting) {
          // GO
          this.zoomShowTime = new Date();
        } else if(this.zoomShowTime !== null) {
          //STOP
          const showTimeDuration = Math.abs(this.zoomShowTime - new Date()); //duration in ms
          this.zoomShowTime = null;
          const showTimeDurationInSeconds = Math.ceil(showTimeDuration / 1000); 
          if(showTimeDurationInSeconds >= constants.interaction.zoomShowTimeMinimumDuration) { //prevent mistaken interactions, zoom duration must exceed a minimum limit to be tracked
            requestIdleCallback(function() {
              let interactionEndpoint = constants.backend.interactionEndpoint.showTimeOutfitZoom + "/" + this.outfit.uniqueName;
              this.$api
                  .post(interactionEndpoint, {showTime: showTimeDurationInSeconds})
                  .then(function () {});
              }.bind(this));
          }
        }
      }
    }.bind(this), { root: null,  threshold: [constants.interaction.zoomShowTimeTriggerThreshold] });

    outfitZoomObserver.observe(this.$vnode.elm.getElementsByClassName("outfit-image-zoom")[0]);
  },
  beforeDestroy: function () {
      window.removeEventListener('resize', this.setUpZoom);
  },
  watch: {
    uniqueName: function (newUniqueName) {
      this.loadOutfit(newUniqueName);
    }
  },
  data: function () {
    return {
      outfitZoomDisplay: "none",
      lensLeft: "0px",
      lensTop: "0px",
      lensHeight: "100px",
      lensWidth: "100px",
      outfitImageZoomLeft: "0px",
      outfitImageZoomTop: "0px",
      outfitImageZoomWidth: "300px",
      outfitImageZoomHeight: "300px",
      outfitImageZoomBackgroundPosition: "0px 0px",
      outfitImageZoomBackgroundSize: "0px 0px",
      showTime: null,
      zoomShowTime: null
    };
  },
  computed: {
    ...mapGetters(["getOutfit"]),
    outfit: function () {
          return  this.getOutfit(this.uniqueName);
    },
    outfitImage: function () {
      let outfitPage = this.$vnode.elm;
      return outfitPage.getElementsByClassName("outfit-image")[0];
    },
    outfitImageZoomBackgroundImage: function () {
      if(this.outfit) {
        return "url('" + this.outfit.image + "')";
      } else {
        return "";
      }
    }
  },
  methods: {
    ...mapActions(["addOutfit"]),
    loadOutfit: function (uniqueName) {
      if(!this.outfit) {
        let outfitEndpoint = constants.backend.outfitEndpoint.single + "/" + uniqueName;
        this.$api
          .get(outfitEndpoint)
          .then(function (response) {
            this.addOutfit(response.data);
          }.bind(this));
      } else {
        //this is done only if the outfit is "cached", because in the other case the interaction is already tracked on the outfit READ call in the backend
        let interactionEndpoint = constants.backend.interactionEndpoint.openOutfit + "/" + this.outfit.uniqueName;
            this.$api
                .post(interactionEndpoint)
                .then(function () {});
      }
    },
    showZoom: function () {
      if(!utilities.isMobile()) {
          this.outfitZoomDisplay = "block";
      }
    },
    hideZoom: function () {
      this.outfitZoomDisplay = "none";
    },
    moveLens: function (e) {
      let outfitPage = this.$vnode.elm;
      let outfitImage = outfitPage.getElementsByClassName("outfit-image")[0];
        e.preventDefault();

        let outfitImageSize = utilities.getImageContainedSize(outfitImage);

        let pos = this.getCursorPos(e);
        if(pos) {
          /* calculate the position of the lens */
          let x = pos.x - (parseInt(this.lensWidth.replace("px", ""), 10) / 2);
          let y = pos.y - (parseInt(this.lensHeight.replace("px", ""), 10) / 2);
          /* prevent the lens from being positioned outside the image */
          let emptyHorizontalSpace = (outfitImage.width - outfitImageSize.width) / 2;
          let emptyVerticalSpace = (outfitImage.height - outfitImageSize.height) / 2;
          if (x > outfitImageSize.width - parseInt(this.lensWidth.replace("px", ""), 10)  + emptyHorizontalSpace) {x = outfitImageSize.width - parseInt(this.lensWidth.replace("px", ""), 10)  + emptyHorizontalSpace;}
          if (x < emptyHorizontalSpace) {x = emptyHorizontalSpace;}
          if (y > outfitImageSize.height - parseInt(this.lensHeight.replace("px", ""), 10)  + emptyVerticalSpace) {y = outfitImageSize.height - parseInt(this.lensHeight.replace("px", ""), 10) + emptyVerticalSpace;}
          if (y < emptyVerticalSpace) {y = emptyVerticalSpace}

          let outfitImageStyle = window.getComputedStyle(outfitImage);
          let outfitImageMarginLeft = parseFloat((outfitImageStyle.marginRight.replace("px", "") || "0" ) ,10); //right margin is the only that gets shrinked, thus use it as reference for the left margin
          if(outfitImageMarginLeft === 10) { //if it'sinitial right margin, then the margin left was not resized -> 0
            outfitImageMarginLeft = 0;
          }
          /* set the position of the lens */
          this.lensLeft = (x + outfitImageMarginLeft) + "px";
          this.lensTop = (y + parseFloat((outfitImageStyle.marginTop.replace("px", "") || "0" ) ,10)) + "px";

          /* display what the lens "sees" */
          this.outfitImageZoomLeft = (x + outfitImageMarginLeft + 120) + "px";
          this.outfitImageZoomTop = (y + parseFloat((outfitImageStyle.marginTop.replace("px", "") || "0" ) ,10) - parseInt(this.outfitImageZoomHeight.replace("px", ""), 10) + parseInt(this.lensHeight.replace("px", ""), 10) + 20 ) + "px";
          
          x -= emptyHorizontalSpace;
          y -= emptyVerticalSpace;
          

          let cx = parseInt(this.outfitImageZoomWidth.replace("px", ""), 10) / parseInt(this.lensWidth.replace("px", ""), 10); //
          let cy = parseInt(this.outfitImageZoomHeight.replace("px", ""), 10) / parseInt(this.lensHeight.replace("px", ""), 10);
          this.outfitImageZoomBackgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
        }
    },
    getCursorPos: function (e) {
      let outfitPage = this.$vnode.elm;
      let outfitImage = outfitPage.getElementsByClassName("outfit-image")[0];

        let a, x = 0, y = 0;
        e = e || window.event;
        /*get the x and y positions of the image:*/
        a = outfitImage.getBoundingClientRect();
        /*calculate the cursor's x and y coordinates, relative to the image:*/
        x = e.pageX - a.left;
        y = e.pageY - a.top;
        /*consider any page scrolling:*/
        x = x - window.pageXOffset;
        y = y - window.pageYOffset;
        return {x : x, y : y};
    },
    setUpZoom: function () {
      let outfitPage = this.$vnode.elm;
      let outfitImage = outfitPage.getElementsByClassName("outfit-image")[0];
      let outfitImageSize = utilities.getImageContainedSize(outfitImage);

      /* calculate the ratio between zoom and lens */
      let cx = parseInt(this.outfitImageZoomWidth.replace("px", ""), 10) / parseInt(this.lensWidth.replace("px", ""), 10); //this.outfitImageZoom.offsetWidth / this.lens.offsetWidth;
      let cy = parseInt(this.outfitImageZoomHeight.replace("px", ""), 10) / parseInt(this.lensHeight.replace("px", ""), 10); //this.outfitImageZoom.offsetHeight / this.lens.offsetHeight;

      /* set background properties for the zoom */
      this.outfitImageZoomBackgroundSize = (outfitImageSize.width * cx) + "px " + (outfitImageSize.height * cy) + "px";
    }
  }
};
</script>

<style lang="scss">
$desktopMinWidth: 1250px; /* 105px * 2 outer margins + 300px min-width image + 420px min-width articles + 300px OutfitPurchaseCard + 10px * 2 inner margins */
$smallMobileMaxWidth: 470px; /* 10px * 2 outer margins + 450px each block */

.outfit-container {
  margin: 35px 105px 35px 105px;

  .outfit-flex {
    display: flex;
    width: calc(100% - (300px)); /* 300px OutfitPurchaseCard */
    float: left;
    align-items: flex-start;
    position: relative;
  }

  .outfit-image {
    max-width: 450px;
    min-width: 300px;
    margin: 0 10px 20px 0;
    width: 100%;
    height: auto;
    cursor: zoom-in;
  }

  .image-zoom-lens {
    position: absolute;
    border: 1px solid #d4d4d4;
    cursor: zoom-in;
  }

  .outfit-image-zoom {
    border: 1px solid #d4d4d4;
    position: absolute;
    z-index: 10;
    display: none;
    background-size: contain;
    cursor: zoom-in;
  }
}
@media screen and (min-width: $smallMobileMaxWidth) and (max-width: $desktopMinWidth) {
  .outfit-container {
    margin: 35px 10px 35px 10px;

    .outfit-flex {
      display: block;
      width: 100%;
      margin-left: auto;
      margin-right: auto;
    }

    .outfit-image {
      width: 450px;
      margin-left: calc((100% - (450px)) / 2);
      margin-right: calc((100% - (450px)) / 2);
    }

    .image-zoom-lens {
      display: none;
    }

    .outfit-image-zoom {
      display: none;
    }
  }
}
@media screen and (max-width: $smallMobileMaxWidth) {
  .outfit-container {
    margin: 35px 10px 35px 10px;

    .outfit-flex {
      display: block;
      width: 100%;
      margin-left: auto;
      margin-right: auto;
    }

    .outfit-image {
      width: 300px;
      margin-left: calc((100% - (300px)) / 2);
      margin-right: calc((100% - (300px)) / 2);
    }
  }
}
</style>
