<template>
  <div id="styles">
    <HeadBar />
    <div class="style-selector-container">
        <div class="style-selector-title">
            <h1>{{ $t('outfitStyles') }}</h1>
        </div>
        <StyleSelector :styles="styles" />
    </div>
    <div v-for="style in previewedStyles" :key = "style.uniqueName" class="style-slider-container">
        <StyleSlider :flamesStyle="style" />
    </div>
  </div>
</template>

<script>
import HeadBar from "../HeadBar.vue";
import StyleSelector from "../StyleSelector.vue";
import StyleSlider from "../StyleSlider.vue";
import { constants } from '../../utilities/constants';
import { mapActions } from 'vuex';

export default {
  name: "StylesPage",
  components: {
    HeadBar,
    StyleSelector,
    StyleSlider
  },
  data: function () {
    return {
      styles: [],
      previewedStyles: []
    };
  },
  mounted: function () {
    this.loadStyles();
  },
  methods: {
    ...mapActions(["updateOutfits"]),
    loadStyles: function() {
      let stylesEndpoint = constants.backend.styleEndpoint.multiple;
      this.$api
        .get(stylesEndpoint)
        .then(response => {
          this.styles = response.data;
          var min = 0; 
          var max = this.styles.length-1;  
          var random1 = Math.floor(Math.random() * (max + 1 - min)) + min;
          var random2 = Math.floor(Math.random() * (max + 1 - min)) + min;
          this.loadStylePreview(this.styles[random1]);
          this.loadStylePreview(this.styles[random2]);
        });
    },
    loadStylePreview: function(style) {
      let stylesEndpoint = constants.backend.styleEndpoint.single + "/" + style.uniqueName + constants.backend.styleEndpoint.outfits;
      this.$api
        .get(stylesEndpoint)
        .then(response => {
          style.outfits = response.data;
          this.updateOutfits(response.data);
          this.previewedStyles = this.previewedStyles.concat(style);
        });
    }
  }
};
</script>

<style lang="scss">
$mobileMaxWidth: 800px;

.style-slider-container {
    margin: 35px 105px 35px 105px;
}
@media screen and (max-width: $mobileMaxWidth) {
    .style-slider-container {
        margin: 0px 10px 30px 10px;
    }
}

.style-selector-container {
    position: relative;
    margin: 70px 105px 70px 105px;
}
@media screen and (max-width: $mobileMaxWidth) {
    .style-selector-container {
        margin: 40px 10px 40px 10px;
    }
}

.style-selector-title {
    position: relative;
    width: 100%;
    font-size: 0.9rem;
    font-family: "Avenir-Heavy";
}

</style>