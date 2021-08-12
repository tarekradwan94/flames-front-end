<template>
  <div class="images-gallery">
    <div class="image-container">
      <button v-if="leftScrollButtonVisible" class="scroll-images-left" @click.stop="scrollLeft"></button>

      
      <div @mousemove="moveLens" @mouseenter="showZoom" @mouseleave="hideZoom"
            class="image-lens" :style="{'display': articleZoomDisplay, 'left':
            lensLeft, 'top': lensTop, 'width': lensWidth, 'height': lensHeight}"></div>
      <div v-for="(image, index) in images" class="image" :key="index">
        <img @mousemove="moveLens" @mouseenter="showZoom" @mouseleave="hideZoom" @load="setUpZoom"
            class="article-image" :alt="$t('galleryImage')" :src="image" />
      </div>
      <div class="image-zoom" :style="{'display': articleZoomDisplay, 'left': articleImageZoomLeft, 'top': articleImageZoomTop,
            'width': articleImageZoomWidth, 'height': articleImageZoomHeight, 'background-position': articleImageZoomBackgroundPosition,
            'background-image': articleImageZoomBackgroundImage, 'background-size': articleImageZoomBackgroundSize}"></div>

      <button v-if="rightScrollButtonVisible" class="scroll-images-right" @click.stop="scrollRight"></button>
    </div>
    <div class="dots-container">
      <span
        v-for="(image, index) in images"
        class="dot"
        @click="showSpecificImage(index)"
        :key="index"
      />
    </div>
  </div>
</template>

<script>
import { utilities } from '../utilities/utilities';
import { constants } from '../utilities/constants';

export default {
  name: "ImagesGallery",
  props: {
    images: Array,
    uniqueName: String
  },
  data: function () {
    return {
      galleryIndex: 0,
      articleZoomDisplay: "none",
      lensLeft: "0px",
      lensTop: "0px",
      lensHeight: "40px",
      lensWidth: "40px",
      articleImageZoomLeft: "0px",
      articleImageZoomTop: "0px",
      articleImageZoomWidth: "300px",
      articleImageZoomHeight: "300px",
      articleImageZoomBackgroundPosition: "0px 0px",
      articleImageZoomBackgroundSize: "0px 0px",
      zoomShowTime: null
    };
  },
  watch: {
    images: function() {
      this.showSpecificImage(0); //reset index since new images size might be lower then old array size (prevent index out of array)
    }
  },
  computed: {
    leftScrollButtonVisible: function () {
      return this.galleryIndex > 0;
    },
    rightScrollButtonVisible: function () {
      return this.galleryIndex + 1 < this.images.length;
    },
    articleImageZoomBackgroundImage: function () {
      return "url('" + this.images[this.galleryIndex] + "')";
    }
  },
  mounted: function () {
    this.showImage();
    window.addEventListener('resize', this.setUpZoom.bind(this));

    // start tracking zoom time and save it as interaction
    var articleZoomObserver = new IntersectionObserver(function(entries) {
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
              let interactionEndpoint = constants.backend.interactionEndpoint.showTimeArticleZoom + "/" + this.uniqueName;
              this.$api
                  .post(interactionEndpoint, {showTime: showTimeDurationInSeconds})
                  .then(function () {});
              }.bind(this));
          }
        }
      }
    }.bind(this), { root: null,  threshold: [constants.interaction.zoomShowTimeTriggerThreshold] });

    articleZoomObserver.observe(this.$vnode.elm.getElementsByClassName("image-zoom")[0]);
  },
  beforeDestroy: function () {
      window.removeEventListener('resize', this.setUpZoom);
  },
  methods: {
    scrollLeft: function () {
      this.galleryIndex--;
      this.showImage();
    },
    scrollRight: function () {
      this.galleryIndex++;
      this.showImage();
    },
    showSpecificImage: function (n) {
      this.galleryIndex = n;
      this.showImage();
    },
    showImage: function () {
      let imagesGallery = this.$vnode.elm;
      let images = imagesGallery.getElementsByClassName("image");
      let dots = imagesGallery.getElementsByClassName("dot");

      for (let i = 0; i < images.length; i++) {
        images[i].style.display = "none";
      }
      for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
      }
      images[this.galleryIndex].style.display = "block";
      dots[this.galleryIndex].className += " active";
      this.setUpZoom();
    },
    showZoom: function () {
      if(!utilities.isMobile()) {
          this.articleZoomDisplay = "block";
      }
    },
    hideZoom: function () {
      this.articleZoomDisplay = "none";
    },
    moveLens: function (e) {
      let articleCard = this.$vnode.elm;
      let articleImage = articleCard.getElementsByClassName("article-image")[this.galleryIndex];
      let articleImageWrapper = articleCard.getElementsByClassName("image")[this.galleryIndex];
        e.preventDefault();

        let articleImageSize = utilities.getImageContainedSize(articleImage, 210, 210);

        let pos = this.getCursorPos(e);
        if(pos) {
            /* calculate the position of the lens */
          let x = pos.x - (parseInt(this.lensWidth.replace("px", ""), 10) / 2);
          let y = pos.y - (parseInt(this.lensHeight.replace("px", ""), 10) / 2);
          /* prevent the lens from being positioned outside the image */
          let emptyHorizontalSpace = (articleImage.width - articleImageSize.width) / 2;
          let emptyVerticalSpace = (articleImage.height - articleImageSize.height) / 2;
          if (x > articleImageSize.width - parseInt(this.lensWidth.replace("px", ""), 10)  + emptyHorizontalSpace) {x = articleImageSize.width - parseInt(this.lensWidth.replace("px", ""), 10)  + emptyHorizontalSpace;}
          if (x < emptyHorizontalSpace) {x = emptyHorizontalSpace;}
          if (y > articleImageSize.height - parseInt(this.lensHeight.replace("px", ""), 10)  + emptyVerticalSpace) {y = articleImageSize.height - parseInt(this.lensHeight.replace("px", ""), 10) + emptyVerticalSpace;}
          if (y < emptyVerticalSpace) {y = emptyVerticalSpace}

          let articleImageStyle = window.getComputedStyle(articleImage);
          let articleImageMarginLeft = parseFloat((articleImageStyle.marginRight.replace("px", "") || "0" ) ,10); //right margin is the only that gets shrinked, thus use it as reference for the left margin
          /*if(articleImageMarginLeft === 10) { //if it'sinitial right margin, then the margin left was not resized -> 0
            articleImageMarginLeft = 0;
          }*/
          let articleImageWrapperStyle = window.getComputedStyle(articleImageWrapper);
          let articleImageWrapperMarginLeft = parseFloat((articleImageWrapperStyle.marginLeft.replace("px", "") || "0" ) ,10);

          /* set the position of the lens */
          this.lensLeft = (x + articleImageMarginLeft + articleImageWrapperMarginLeft) + "px";
          this.lensTop = y + "px";
          /* display what the lens "sees" */
          this.articleImageZoomLeft = (x + articleImageMarginLeft + articleImageWrapperMarginLeft + 120) + "px";
          this.articleImageZoomTop = (y - parseInt(this.articleImageZoomHeight.replace("px", ""), 10) + parseInt(this.lensHeight.replace("px", ""), 10) + 200 ) + "px";
          
          x -= emptyHorizontalSpace;
          y -= emptyVerticalSpace;

          let cx = parseInt(this.articleImageZoomWidth.replace("px", ""), 10) / parseInt(this.lensWidth.replace("px", ""), 10); //
          let cy = parseInt(this.articleImageZoomHeight.replace("px", ""), 10) / parseInt(this.lensHeight.replace("px", ""), 10);
          this.articleImageZoomBackgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
        }
    },
    getCursorPos: function (e) {
      let articleCard = this.$vnode.elm;
      let articleImage = articleCard.getElementsByClassName("article-image")[this.galleryIndex];
        let a, x = 0, y = 0;
        e = e || window.event;
        /*get the x and y positions of the image:*/
        a = articleImage.getBoundingClientRect();
        /*calculate the cursor's x and y coordinates, relative to the image:*/
        x = e.pageX - a.left;
        y = e.pageY - a.top;
        /*consider any page scrolling:*/
        x = x - window.pageXOffset;
        y = y - window.pageYOffset;
        return {x : x, y : y};
    },

    setUpZoom: function () {
      let articleCard = this.$vnode.elm;
      let articleImage = articleCard.getElementsByClassName("article-image")[this.galleryIndex];
      let articleImageSize = utilities.getImageContainedSize(articleImage, 210, 210);


      /* calculate the ratio between zoom and lens */
      let cx = parseInt(this.articleImageZoomWidth.replace("px", ""), 10) / parseInt(this.lensWidth.replace("px", ""), 10); //this.articleImageZoom.offsetWidth / this.lens.offsetWidth;
      let cy = parseInt(this.articleImageZoomHeight.replace("px", ""), 10) / parseInt(this.lensHeight.replace("px", ""), 10); //this.articleImageZoom.offsetHeight / this.lens.offsetHeight;

      /* set background properties for the zoom */
      this.articleImageZoomBackgroundSize = (articleImageSize.width * cx) + "px " + (articleImageSize.height * cy) + "px";
    }
  }
};
</script>

<style lang="scss">
.images-gallery {
  .scroll-images-left {
    position: absolute;
    width: 25px;
    height: 25px;
    top: 50%;
    transform: translate(0, -50%);
    left: 0px;
    background: url("../assets/scroll-left-icon.png") no-repeat center top;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    z-index: 2;
  }

  .scroll-images-right {
    position: absolute;
    width: 25px;
    height: 25px;
    top: 50%;
    transform: translate(0, -50%);
    right: 0px;
    background: url("../assets/scroll-right-icon.png") no-repeat center top;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    z-index: 2;
  }

  img {
    vertical-align: middle;
    width: 210px;
    height: 210px;
    object-fit: contain;
  }

  .image-container {
    position: relative;
    text-align: center;
  }

  /* Hide the images by default */
  .image {
    position: relative;
    display: none;
    width: 210px;
    height: 210px;
    margin-left: auto;
    margin-right: auto;
  }

  .image-lens {
    position: absolute;
    border: 1px solid #d4d4d4;
    cursor: zoom-in;
    z-index: 10;
  }

  .image-zoom {
    border: 1px solid #d4d4d4;
    position: absolute;
    z-index: 10;
    display: none;
    background-size: contain;
    cursor: zoom-in;
  }

  .dots-container {
    position: relative;
    display: block;
    text-align: center;
  }

  .dot {
    cursor: pointer;
    display: inline-block;
    top: 0px;
    width: 4px;
    height: 4px;
    margin: 0 5px 0 5px;
    border-radius: 4px;
    border: 1px solid lightgray;
    background-color: lightgray;
    opacity: 0.6;
  }

  .active,
  .dot:hover {
    border: 1px solid #006db6;
    opacity: 1;
    background-color: #006db6;
  }
}
</style>