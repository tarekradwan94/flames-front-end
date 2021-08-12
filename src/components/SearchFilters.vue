<template>
  <div id="search-filter">
    <div class="search-filter-keywords">
        <img class="search-filter-icon" :alt="$t('search')" src="../assets/search-icon.png">
        <h1 @blur="updateKeyWords" @keyup.enter="search" class="search-filter-input" contenteditable="true" :data-placeholder="$t('whatImatchWith')">{{ searchKeyWords }}</h1>
        <button class="search-reset-button" @click="resetFilterInput">
            <img class="search-reset-icon" :alt="$t('reset')" src="../assets/reset-icon.png">
        </button>
    </div>
    <div class="search-filter-attributes">
        <span class="search-attributes-title" >{{ $t('filterBy') }}</span>
        <div class="search-attributes-list">
            <AttributeFilter @applyFilter="filter" :options="colorOptions" :inputTitle="$t('color')" />
            <AttributeFilter @applyFilter="filter" :options="wearabilityOptions" :inputTitle="$t('wearability')" />
            <AttributeFilter @applyFilter="filter" :options="occasionOptions" :inputTitle="$t('occasion')" />
            <AttributeFilter @applyFilter="filter" :options="styleOptions" :inputTitle="$t('style')" />
            <AttributeFilter @applyFilter="filter" :options="brandOptions" :inputTitle="$t('brand')" />
            <AttributeFilter @applyFilter="filter" :options="priceOptions" :inputTitle="$t('priceEUR')" />
        </div>
    </div>
  </div>
</template>

<script>

import AttributeFilter from './AttributeFilter.vue';
import { constants } from '../utilities/constants';

export default {
  name: 'SearchFilters',
  components: {
      AttributeFilter
  },
  props: {
      keyWords: String,
      inputOccasionID: String,
      inputStyleID: String
  },
  mounted: function() {
      this.loadOccasions();
      this.loadStyles();
      this.loadPrices();
      this.loadBrands();
      this.loadColors();
      this.loadWearabilities();
  },
  data: function () {
      return {
          searchKeyWords : this.keyWords,
          occasionOptions: [],
          occasionOptionsReady: false,
          styleOptions: [],
          styleOptionsReady: false,
          wearabilityOptions: [],
          wearabilityOptionsReady: false,
          colorOptions: [],
          colorOptionsReady: false,
          brandOptions: [],
          brandOptionsReady: false,
          priceOptions: [],
          priceOptionsReady: false
      }
  },
  watch: {
    keyWords: function (newKeyWords) {
        this.updateHTMLSearchInput(newKeyWords);
        this.searchKeyWords = newKeyWords; //apparently during navigation, data properties don't get updated correctly
    },
    searchKeyWords: function (newKeyWords) {
        this.updateHTMLSearchInput(newKeyWords);
        this.filter();
    },
    occasionOptionsReady: function() {
        this.emitFiltersReady();
    },
    styleOptionsReady: function() {
        this.emitFiltersReady();
    },
    wearabilityOptionsReady: function() {
        this.emitFiltersReady();
    },
    colorOptionsReady: function() {
        this.emitFiltersReady();
    },
    brandOptionsReady: function() {
        this.emitFiltersReady();
    },
    priceOptionsReady: function() {
        this.emitFiltersReady;
    },
    inputOccasionID: function(newOccasion) {
        if(newOccasion) {
            this.resetAllFilter(); //unselect all options in order to show just the selected occasion results
            for(let i = 0; i < this.occasionOptions.length; i++) {
                this.occasionOptions[i].selected = this.occasionOptions[i].key === newOccasion;
            }
            this.filter();
        }
    },
    inputStyleID: function(newStyle) {
        if(newStyle) {
            this.resetAllFilter(); //unselect all options in order to show just the selected occasion results
            for(let i = 0; i < this.styleOptions.length; i++) {
                this.styleOptions[i].selected = this.styleOptions[i].key === newStyle;
            }
            this.filter();
        }
    }
  },
  methods: {
    updateHTMLSearchInput: function (newKeyWords) { //this method is because Vue doesn't support v-model with contenteditable tags
        let searchFilter = this.$vnode.elm;
        if(searchFilter.getElementsByClassName("search-filter-input").length === 1) {
            let searchInput = searchFilter.getElementsByClassName("search-filter-input")[0];
            searchInput.innerText = newKeyWords;
        }
    },
    updateKeyWords: function(event) {
        this.searchKeyWords = event.target.innerText; //this line is because Vue doesn't support v-model with contenteditable tags
    },
    search: function () {
        this.searchKeyWords = event.target.innerText; //this line is because Vue doesn't support v-model with contenteditable tags
    },
    resetFilterInput: function () {
        this.searchKeyWords = "";
    },
    loadOccasions: function () {
      let occasionsEndpoint = constants.backend.occasionEndpoint.multiple;
      this.$api
        .get(occasionsEndpoint)
        .then(response => {
          let occasions = response.data;
          let occasionOptions = [];
          for(let i = 0; i < occasions.length; i++) {
              occasionOptions = occasionOptions.concat({
                  key: occasions[i].uniqueName,
                  text: occasions[i].name,
                  selected: this.inputOccasionID === occasions[i].uniqueName
                });
          }
          this.occasionOptions = occasionOptions;
          this.occasionOptionsReady = true;
        });
    },
    loadStyles: function () {
      let stylesEndpoint = constants.backend.styleEndpoint.multiple;
      this.$api
        .get(stylesEndpoint)
        .then(response => {
          let styles = response.data;
          let styleOptions = [];
          for(let i = 0; i < styles.length; i++) {
              styleOptions = styleOptions.concat({
                  key: styles[i].uniqueName,
                  text: styles[i].name,
                  selected: this.inputStyleID === styles[i].uniqueName
                });
          }
          this.styleOptions = styleOptions;
          this.styleOptionsReady = true;
        });
    },
    loadPrices: function () {
        this.priceOptions = constants.search.priceOptions;
        this.priceOptionsReady = true;
    },
    loadBrands: function () {
      let brandsEndpoint = constants.backend.articleEndpoint.brands;
      this.$api
        .get(brandsEndpoint)
        .then(response => {
          let brands = response.data;
          let brandOptions = [];
          for(let i = 0; i < brands.length; i++) {
              brandOptions = brandOptions.concat({
                  key: brands[i],
                  text: brands[i],
                  selected: false
                });
          }
          this.brandOptions = brandOptions;
          this.brandOptionsReady = true;
        });
    },
    loadColors: function () {
      let colorsEndpoint = constants.backend.articleEndpoint.colors;
      this.$api
        .get(colorsEndpoint)
        .then(response => {
          let colors = response.data;
          let colorOptions = [];
          for(let i = 0; i < colors.length; i++) {
              colorOptions = colorOptions.concat({
                  key: colors[i],
                  text: colors[i],
                  selected: false
                });
          }
          this.colorOptions = colorOptions;
          this.colorOptionsReady = true;
        });
    },
    loadWearabilities: function () {
      let wearabilitiesEndpoint = constants.backend.articleEndpoint.wearabilities;
      this.$api
        .get(wearabilitiesEndpoint)
        .then(response => {
          let wearabilities = response.data;
          let wearabilityOptions = [];
          for(let i = 0; i < wearabilities.length; i++) {
              wearabilityOptions = wearabilityOptions.concat({
                  key: wearabilities[i],
                  text: wearabilities[i],
                  selected: false
                });
          }
          this.wearabilityOptions = wearabilityOptions;
          this.wearabilityOptionsReady = true;
        });
    },
    emitFiltersReady: function () {
        if(this.occasionOptionsReady && this.styleOptionsReady && this.wearabilityOptionsReady
            && this.colorOptionsReady && this.brandOptionsReady && this.priceOptionsReady) {
                if(!this.searchKeyWords) { //if there are keywords at this stage, the page was loaded by home search bar and results loading was already done
                    this.$emit("applyFilter", {
                        occasionOptions: this.occasionOptions.filter(function (option) {
                            return option.selected
                        }),
                        styleOptions: this.styleOptions.filter(function (option) {
                            return option.selected
                        }), 
                        wearabilityOptions: this.wearabilityOptions.filter(function (option) {
                            return option.selected
                        }),
                        colorOptions: this.colorOptions.filter(function (option) {
                            return option.selected
                        }),
                        brandOptions: this.brandOptions.filter(function (option) {
                            return option.selected
                        }),
                        priceOptions: this.priceOptions.filter(function (option) {
                            return option.selected
                        })
                    });
                }
            }
    },
    filter: function () {
        this.$emit("applyFilter", {
            occasionOptions: this.occasionOptions.filter(function (option) {
                return option.selected
            }),
            styleOptions: this.styleOptions.filter(function (option) {
                return option.selected
            }), 
            wearabilityOptions: this.wearabilityOptions.filter(function (option) {
                return option.selected
            }),
            colorOptions: this.colorOptions.filter(function (option) {
                return option.selected
            }),
            brandOptions: this.brandOptions.filter(function (option) {
                return option.selected
            }),
            priceOptions: this.priceOptions.filter(function (option) {
                return option.selected
            }),
            keyWords: this.searchKeyWords
        });
    },
    resetAllFilter: function () {
        for(let i = 0; i < this.occasionOptions.length; i++) {
            this.occasionOptions[i].selected = false;
        }
        for(let i = 0; i < this.styleOptions.length; i++) {
            this.styleOptions[i].selected = false;
        }
        for(let i = 0; i < this.wearabilityOptions.length; i++) {
            this.wearabilityOptions[i].selected = false;
        }
        for(let i = 0; i < this.colorOptions.length; i++) {
            this.colorOptions[i].selected = false;
        }
        for(let i = 0; i < this.brandOptions.length; i++) {
            this.brandOptions[i].selected = false;
        }
        for(let i = 0; i < this.priceOptions.length; i++) {
            this.priceOptions[i].selected = false;
        }
    }
  }
};
</script>

<style lang="scss">

    $lineHeight: 45px;
    $mobileMaxWidth: 800px;

    #search-filter {
        width: calc(100% - (105px * 2));
        margin: 40px 105px 20px 105px;
        position: relative;

        .search-filter-keywords {
            margin-bottom: 40px;
            height: $lineHeight;
        }

        .search-filter-icon {
            width: 18px;
            height: 18px;
            position: relative;
            margin: 0 20px 0 0;
            vertical-align: middle;
            
        }

        .search-filter-input {
            display: inline-block;
            position: relative;
            overflow: hidden;
            white-space: nowrap;
            height: 100%;
            max-width: calc(100% - (38px * 2));
            min-width: 20px;
            padding: 0;
            margin: 0;
            vertical-align: middle;
            line-height: $lineHeight;
            font-family: Avenir;
            font-size: 1.7rem;
            font-weight: 500;
            outline: none;
            border-bottom: 1px solid #b7b7b7;

            br {
                display:none;
            }
            
            * {
                display:inline;
                white-space:nowrap;
            }
        }
        
        .search-reset-button {
            margin: 0 0 0 20px;
            width: 18px;
            height: 18px;
            vertical-align: middle;
        }

        .search-reset-icon {
            width: 100%;
            height: 100%;
            position: relative;
        }

        .search-attributes-title {
            font-weight: 500;
        }
    }
    @media screen and (max-width: $mobileMaxWidth) {
        #search-filter {
            width: calc(100% - (10px * 2));
            margin: 40px 10px 20px 10px;
        }
    }
</style>
