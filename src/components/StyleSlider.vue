<template>
    <div class="style-slider-subcontainer">
        <div class="style-slider-header"> 
            <div class="style-slider-title">
                <h2>{{ $t('styleOutfits', { styleName: flamesStyle.name }) }}</h2>
            </div>
        </div>
        
        <button v-if="leftScrollButtonVisible" class="scroll-outfits scroll-outfits-left" @click.stop="scrollLeft"></button>
        <div class="style-slider">
            <OutfitPreview v-for="(outfit, index) in flamesStyle.outfits" :key="index" :margin="marginPerOutift" :showArticles="false" :outfit="outfit"/>
        </div>
        <button v-if="rightScrollButtonVisible" class="scroll-outfits scroll-outfits-right" @click.stop="scrollRight"></button>

        <div class="style-slider-actions">
            <button @click="gotoResults(flamesStyle)">{{ $t('seeAllStyleOutfits', { styleName: flamesStyle.name }) }} <img class="disclosure-icon" :alt="$t('seeAllStyleOutfits', { styleName: flamesStyle.name })" src="../assets/disclosure-icon.png"></button>
        </div>
    </div>
</template>

<script>

import OutfitPreview from "./OutfitPreview.vue";
import { constants } from '../utilities/constants';

export default {
    name : "StyleSlider",
    components: {
        OutfitPreview
    },
    props: {
        flamesStyle: Object
    },
    data: function () {
        return {
            marginPerOutift: "6px",
            leftScrollButtonVisible: false,
            rightScrollButtonVisible: false
        }
    },
    mounted: function () {
        window.addEventListener('resize', this.checkScrollButtonsAndFixScroll);
        this.checkScrollButtonsAndFixScroll();
    },
    beforeDestroy: function () {
      window.removeEventListener('resize', this.checkScrollButtonsAndFixScroll);
    },
    methods: {
        scrollLeft: function (event) {
            if(event.target.parentElement.getElementsByClassName("style-slider").length === 1) {
                let styleSlider = event.target.parentElement.getElementsByClassName("style-slider")[0];
                let cssTrasnformation = window.getComputedStyle(styleSlider).getPropertyValue("transform");
                let translate;
                if(cssTrasnformation === "none") {
                    translate = 0;
                } else {
                    let transformationString = cssTrasnformation.replace("matrix(", "").replace(")", "");
                    let trasnformationArray = transformationString.split(",");
                    translate = parseInt((trasnformationArray[4] || "0" ), 10); //[0]scaleX, [1]skewY, [2]skewX, [3]scaleY, [4]translateX, [5]translateY
                }
                translate += 302; //OutfitPreview's width + margin + border
                if(translate > 0) { //right scroll limit
                    translate = 0;
                    setTimeout(function() {this.leftScrollButtonVisible = false;}.bind(this), 100);
                }
                this.rightScrollButtonVisible = true;
                styleSlider.style.transform = "translateX(" + translate + "px" + ")";
            }
        },
        scrollRight: function (event) {
            if(event.target.parentElement.getElementsByClassName("style-slider").length === 1) {
                let styleSlider = event.target.parentElement.getElementsByClassName("style-slider")[0];
                let cssTrasnformation = window.getComputedStyle(styleSlider).getPropertyValue("transform");
                let translate;
                if(cssTrasnformation === "none") {
                    translate = 0;
                } else {
                    let transformationString = cssTrasnformation.replace("matrix(", "").replace(")", "");
                    let trasnformationArray = transformationString.split(",");
                    translate = parseInt((trasnformationArray[4] || "0" ), 10); //[0]scaleX, [1]skewY, [2]skewX, [3]scaleY, [4]translateX, [5]translateY
                }
                translate -= 302; //OutfitPreview's width + margin + border
                let styleSliderContainerWidth = event.target.parentElement.offsetWidth;
                let styleSliderWidth = styleSlider.offsetWidth;
                let scrollableWidth = -1 * ( styleSliderWidth - styleSliderContainerWidth );
                if(translate < scrollableWidth) { //left scroll limit
                    translate = scrollableWidth;
                    setTimeout(function() {this.rightScrollButtonVisible = false;}.bind(this), 100);
                }
                this.leftScrollButtonVisible = true;
                styleSlider.style.transform = "translateX(" + translate + "px" + ")";
            }
        },
        checkScrollButtonsAndFixScroll: function () {
            let styleSliderContainer = this.$vnode.elm;
            if(styleSliderContainer.getElementsByClassName("style-slider").length === 1) {
                let styleSlider = styleSliderContainer.getElementsByClassName("style-slider")[0];
                let cssTrasnformation = window.getComputedStyle(styleSlider).getPropertyValue("transform");
                let translate;
                if(cssTrasnformation === "none") {
                    translate = 0;
                } else {
                    let transformationString = cssTrasnformation.replace("matrix(", "").replace(")", "");
                    let trasnformationArray = transformationString.split(",");
                    translate = parseInt((trasnformationArray[4] || "0" ), 10); //[0]scaleX, [1]skewY, [2]skewX, [3]scaleY, [4]translateX, [5]translateY
                }
                let styleSliderContainerWidth = styleSliderContainer.offsetWidth;
                let styleSliderWidth = styleSlider.offsetWidth;
                let scrollableWidth = -1 * ( styleSliderWidth - styleSliderContainerWidth );
                if(translate < scrollableWidth) { //left scroll limit
                    translate = scrollableWidth;
                    styleSlider.style.transform = "translateX(" + translate + "px" + ")";
                    setTimeout(function() {this.rightScrollButtonVisible = false;}.bind(this), 100);
                } else if (scrollableWidth < 0) {
                    this.rightScrollButtonVisible = true;
                }

                if(translate > 0) { //right scroll limit
                    translate = 0;
                    styleSlider.style.transform = "translateX(" + translate + "px" + ")";
                    setTimeout(function() {this.leftScrollButtonVisible = false;}.bind(this), 100);
                } else if (translate < 0) {
                    this.leftScrollButtonVisible = true;
                }
            }
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
    }
};
</script>

<style lang="scss">

.style-slider-subcontainer{
    white-space: nowrap;
    overflow: hidden;
    position: relative;

    .style-slider-title {
        font-size: 0.9rem;
        font-weight: 500;
        font-family: "Avenir-Heavy";
    }

    .style-slider-actions {
        text-align: right;
        color: #2179bc;
        font-family: "Avenir-Heavy";
        font-size: 1rem;
    }

    .disclosure-icon {
        width: 18px;
        height: 18px;
        position: relative;
        vertical-align: middle;
    }

    .style-slider {
        position: relative;
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
    .style-slider::-webkit-scrollbar { /* Hide scrollbar for Chrome, Safari and Opera */
       display: none;
    }

    .scroll-outfits {
        z-index: 2;
        width: 48px;
        height: 48px;
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
    }

    .scroll-outfits-left {
        left: 20px;
        background: url('../assets/scroll-left-big-icon.png') no-repeat center top;
        -webkit-background-size: cover;
        -moz-background-size: cover;
        -o-background-size: cover;
        background-size: cover;
    }

    .scroll-outfits-right {
        right: 20px;
        background: url('../assets/scroll-right-big-icon.png') no-repeat center top;
        -webkit-background-size: cover;
        -moz-background-size: cover;
        -o-background-size: cover;
        background-size: cover;
        
    }
}

</style>