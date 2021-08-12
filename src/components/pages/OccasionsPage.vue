<template>
  <div id="occasions">
    <HeadBar />
    <div class="occasion-selector-container">
        <div class="occasion-selector-title">
            <h1>{{ $t('outfitsForEveryOccasion') }}</h1>
        </div>
        <OccasionSelector :occasions="occasions" />
    </div>
    <div v-for="occasion in previewedOccasions" :key = "occasion.uniqueName" class="occasion-slider-container">
        <OccasionSlider :occasion="occasion" />
    </div>
  </div>
</template>

<script>
import HeadBar from "../HeadBar.vue";
import OccasionSelector from "../OccasionSelector.vue";
import OccasionSlider from "../OccasionSlider.vue";
import { constants } from '../../utilities/constants';
import { mapActions } from 'vuex';

export default {
  name: "OccasionsPage",
  components: {
    HeadBar,
    OccasionSelector,
    OccasionSlider
  },
  data: function () {
    return {
      occasions: [],
      previewedOccasions: []
    };
  },
  mounted: function () {
    this.loadOccasions();
  },
  methods: {
    ...mapActions(["updateOutfits"]),
    loadOccasions: function() {
      let occasionsEndpoint = constants.backend.occasionEndpoint.multiple;
      this.$api
        .get(occasionsEndpoint)
        .then(response => {
          this.occasions = response.data;
          var min = 0; 
          var max = this.occasions.length-1;  
          var random1 = Math.floor(Math.random() * (max + 1 - min)) + min;
          var random2 = Math.floor(Math.random() * (max + 1 - min)) + min;
          this.loadOccasionPreview(this.occasions[random1]);
          this.loadOccasionPreview(this.occasions[random2]);
        });
    },
    loadOccasionPreview: function(occasion) {
      let outfitsEndpoint = constants.backend.occasionEndpoint.single + "/" + occasion.uniqueName + constants.backend.occasionEndpoint.outfits;
      this.$api
        .get(outfitsEndpoint)
        .then(response => {
          occasion.outfits = response.data;
          this.updateOutfits(response.data);
          this.previewedOccasions = this.previewedOccasions.concat(occasion);
        });
    }
  }
};
</script>

<style lang="scss">
$mobileMaxWidth: 800px;

.occasion-slider-container {
    margin: 35px 105px 35px 105px;
}
@media screen and (max-width: $mobileMaxWidth) {
    .occasion-slider-container {
        margin: 0px 10px 30px 10px;
    }
}

.occasion-selector-container {
    position: relative;
    margin: 70px 105px 70px 105px;
}
@media screen and (max-width: $mobileMaxWidth) {
    .occasion-selector-container {
        margin: 40px 10px 40px 10px;
    }
}

.occasion-selector-title {
    position: relative;
    width: 100%;
    font-size: 0.9rem;
    font-family: "Avenir-Heavy";
}

</style>