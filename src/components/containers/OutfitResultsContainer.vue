<template>
  <div id="outfit-results-container">
    <div class="outfit-results-subcontainer">
        <div class="outfit-results-header"> 
            <div class="outfit-results-title">
                <span>{{ $tc('results', outfits.length, { count: outfits.length }) }}</span>
            </div>
                
            <div class="outfit-results-sort-actions">
                <button @click="toggleOrderByValuesPopover">{{ $t('orderBy') }}{{ orderByFieldText ? ": " + orderByFieldText : "" }} <img class="order-by-icon" :alt="$t('orderBy')" src="../../assets/order-by-icon.png"></button>
                <div v-if="orderByPopoverShown" class="order-by-values-popover">
                    <div class="order-by-options">
                        <div v-for="field in orderByFields" :key="field.key" @click="selectOrderByField(field)" class="order-by-option">
                            {{ $t(field.text) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="outfit-results-list">
            <OutfitPreview v-for="outfit in outfits" :key="outfit.uniqueName" :margin="marginPerOutift" :showArticles="true" :outfit="outfit"/>
        </div>
    </div>
  </div>
</template>

<script>
import OutfitPreview from '../OutfitPreview.vue';
import { constants } from '../../utilities/constants';

export default {
  name: 'OutfitResultsContainer',
  components: {
      OutfitPreview
  },
  mounted: function () {
      this.calculateOutfitMargins();
      window.addEventListener('resize', this.calculateOutfitMargins);
      document.addEventListener('click', this.checkClickAway);
      document.addEventListener('touchstart', this.checkClickAway);
  },
  beforeDestroy: function () {
      window.removeEventListener('resize', this.calculateOutfitMargins);
      document.removeEventListener('click', this.checkClickAway);
      document.removeEventListener('touchstart', this.checkClickAway);
  },
  updated: function () {
      this.calculateOutfitMargins();
  },
  methods: {
      calculateOutfitMargins: function () {
        const outfitPreviewWidth = 292; //width 290px + border 2px (1px each side)
        let resultsContainer = this.$vnode.elm;
        if(resultsContainer.getElementsByClassName("outfit-results-list").length === 1) {
            let resultsList = resultsContainer.getElementsByClassName("outfit-results-list")[0];
            let resultsListWidth = window.getComputedStyle(resultsList).getPropertyValue("width").replace("px", "");
            let remainingWidthForMargins;
            let outfitsQuantityPerRow;
            if(resultsListWidth <= (outfitPreviewWidth * this.outfits.length)) {
                remainingWidthForMargins = resultsListWidth % outfitPreviewWidth;
                outfitsQuantityPerRow = Math.floor(resultsListWidth / outfitPreviewWidth);
            } else {
                remainingWidthForMargins = resultsListWidth - (outfitPreviewWidth * this.outfits.length);
                outfitsQuantityPerRow = this.outfits.length;
            }
            
            let totalMarginPerOutfit = remainingWidthForMargins / outfitsQuantityPerRow;
            this.marginPerOutift = (totalMarginPerOutfit / 2) + "px";
        }
      },
      toggleOrderByValuesPopover: function () {
            this.orderByPopoverShown = !this.orderByPopoverShown;
      },
      hideOrderByValuesPopover: function () {
          this.orderByPopoverShown = false;
      },
      checkClickAway: function (e) {   
          let outfitResultsContainer = this.$vnode.elm;
          if(outfitResultsContainer.getElementsByClassName("outfit-results-sort-actions").length === 1) {
              let orderByFilter = outfitResultsContainer.getElementsByClassName("outfit-results-sort-actions")[0];
              if(orderByFilter.getElementsByClassName("order-by-values-popover").length === 1) {
                  let orderByFilterPopover = orderByFilter.getElementsByClassName("order-by-values-popover")[0];
                  if (!orderByFilter.contains(e.target) && !orderByFilterPopover.contains(e.target)){
                      this.hideOrderByValuesPopover();
                  }
              }
          }
      },
      selectOrderByField: function (orderByField) {
          this.hideOrderByValuesPopover();
          orderByField.selected = true;
          this.orderByFieldText = this.$t(orderByField.text);
          this.$emit("applySort", orderByField);
      }
  },
  props: {
      outfits: Array
  },
  data: function () {
      return {
          marginPerOutift: "10px",
          orderByPopoverShown: false,
          orderByFields: constants.search.orderByFields,
          orderByFieldText: ""
        }
    }
};
</script>

<style lang="scss">

    $mobileMaxWidth: 800px;

    #outfit-results-container {
        //overflow: hidden; //in order to not crop order by fields list
        position: relative;
        top: 0px;
        left: 0px;
        /*height: 1600px; handled in component data*/ 
        width: 100%;

        .outfit-results-subcontainer {
            margin: 35px 105px 70px 105px;
            height: calc(100% - (35px + 70px));
            position: relative;
        }
        @media screen and (max-width: $mobileMaxWidth) {
            .outfit-results-subcontainer {
                margin: 0px 10px 0px 10px;
                height: 100%;
            }
        }

        .outfit-results-header {
            position: relative;
            margin-bottom: 20px;
        }

        .outfit-results-title {
            position: relative;
            width: 50%;
            display: inline-block;
            font-size: 1.3rem;
            font-weight: 500;
        }

        .outfit-results-sort-actions {
            position: relative;
            width: 50%;
            display: inline-block;
            text-align: right;
            font-weight: 500;

            button {
                margin: 0 8px 0 8px;
            }
        }
        
        .order-by-values-popover {
            position: absolute;
            right: 0px;
            margin: 2px 8px 0 0;
            padding: 10px 5px 5px 15px;
            width: 100px;
            height: auto;
            z-index: 99;
            background-color: white;
            box-shadow: 2px 2px 5px #2b2b2b40;
            border: 1px solid #dedede;
        }
        .order-by-option {
            margin-top: 5px;
            margin-right: 12px; //like order by icon
            text-align: center;
            cursor: pointer;
        }

        .order-by-icon {
            width: 12px;
            height: 12px;
            position: relative;
            vertical-align: middle;
        }
    }
</style>
