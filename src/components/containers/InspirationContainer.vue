<template>
  <div id="inspiration-container">
    <div class="inspiration-subcontainer">
        <div class="inspiration-header"> 
            <div class="inspiration-title">
                <h2>{{ $t('findYourInspiration') }}</h2>
            </div>
                
            <div class="inspiration-sort-actions">
                <button @click="outfitsOrderByField = 'votesCounter';" :class="{'sort-selected': outfitsOrderByField === 'votesCounter' }">{{ $t('popular') }}</button> | 
                <button @click="outfitsOrderByField = 'updatedAt';" :class="{'sort-selected': outfitsOrderByField === 'updatedAt' }">{{ $t('latest') }}</button>
            </div>
        </div>
        
        <div class="inspiration-list">
            <OutfitPreview v-for="outfit in outfits" :key="outfit.uniqueName" :margin="marginPerOutift" :showArticles="true" :outfit="outfit"/>
        </div>
    </div>
  </div>
</template>

<script>
import OutfitPreview from '../OutfitPreview.vue';
import { constants } from '../../utilities/constants';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'InspirationContainer',
  components: {
      OutfitPreview
  },
  mounted: function () {
      this.loadOutfits(this.outfitsOrderByField);
      this.calculateOutfitMargins();
      window.addEventListener('resize', this.calculateOutfitMargins);
  },
  beforeDestroy: function () {
      window.removeEventListener('resize', this.calculateOutfitMargins);
  },
  updated: function () {
      this.calculateOutfitMargins();
  },
  methods: {
      ...mapActions(["updateInspirationOutfits"]),
      calculateOutfitMargins: function () {
        const outfitPreviewWidth = 292; //width 290px + border 2px (1px each side)
        let inspirationContainer = this.$vnode.elm;
        if(inspirationContainer.getElementsByClassName("inspiration-list").length === 1) {
            let inspirationList = inspirationContainer.getElementsByClassName("inspiration-list")[0];
            let inspirationListWidth = window.getComputedStyle(inspirationList).getPropertyValue("width").replace("px", "");
            let remainingWidthForMargins;
            let outfitsQuantityPerRow;
            if(inspirationListWidth <= (outfitPreviewWidth * this.outfits.length)) {
                remainingWidthForMargins = inspirationListWidth % outfitPreviewWidth;
                outfitsQuantityPerRow = Math.floor(inspirationListWidth / outfitPreviewWidth);
            } else {
                remainingWidthForMargins = inspirationListWidth - (outfitPreviewWidth * this.outfits.length);
                outfitsQuantityPerRow = this.outfits.length;
            }
            
            let totalMarginPerOutfit = remainingWidthForMargins / outfitsQuantityPerRow;
            this.marginPerOutift = (totalMarginPerOutfit / 2) + "px";
        }
      },
      loadOutfits: function (orderByFiels) {
          let inspirationEndpoint = constants.backend.outfitEndpoint.inspiration;
          if(orderByFiels) {
              inspirationEndpoint += "?" + constants.backend.orderByQuery + "=" + orderByFiels;
          }
          this.$api
              .get(inspirationEndpoint)
              .then(response => (this.updateInspirationOutfits(response.data)));
      }
  },
  data: function () {
      return {
          marginPerOutift: "10px",
          outfitsOrderByField: "" //constants.inspiration.defaultOrderByField //prevent default sorting in order to track user explicit operation
      }
  },
  computed: {
      ...mapGetters(["getInspirationOutfits"]),
      outfits: function () {
          return this.getInspirationOutfits;
      }
  },
  watch: {
      outfitsOrderByField: function (newField) {
          this.loadOutfits(newField);
      }
  }
};
</script>

<style lang="scss">

    $mobileMaxWidth: 800px;

    #inspiration-container {
        overflow: hidden;
        position: relative;
        top: 0px;
        left: 0px;
        /*height: 1600px; handled in component data*/ 
        width: 100%;

        .inspiration-subcontainer {
            margin: 35px 105px 70px 105px;
            height: calc(100% - (35px + 70px));
            position: relative;
        }
        @media screen and (max-width: $mobileMaxWidth) {
            .inspiration-subcontainer {
                margin: 0px 10px 0px 10px;
                height: 100%;
            }
        }

        .inspiration-header {
            position: relative;
            margin-bottom: 10px;
        }

        .inspiration-title {
            position: relative;
            width: 50%;
            display: inline-block;
            font-size: 1.2rem;
        }

        .inspiration-sort-actions {
            position: relative;
            width: 50%;
            display: inline-block;
            text-align: right;
            font-weight: 500;

            button {
                margin: 0 8px 0 8px;
            }
        }

        .sort-selected {
            font-weight: 700;
        }

        .inspiration-list {
            display: block;
            position: relative;
        }
    }
</style>
