<template>
  <div id="search-results">
    <HeadBar />
    <SearchFilters :inputOccasionID="occasionID" :inputStyleID="styleID" @applyFilter="filter" :keyWords="keyWords" />
    <OutfitResultsContainer :outfits="outfits" @applySort="sort"/>
    <!--<FootBar />-->
  </div>
</template>


<script>
import HeadBar from '../HeadBar.vue';
import SearchFilters from '../SearchFilters.vue';
import OutfitResultsContainer from '../containers/OutfitResultsContainer.vue';
import { constants } from '../../utilities/constants';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'SearchResultsPage',
  props: {
      keyWords: String,
      occasionID: String,
      styleID: String
  },
  components: {
    HeadBar,
    SearchFilters,
    OutfitResultsContainer
  },
  data: function () {
    return {
      filterOptions: {},
      searchKeyWords: "",
      orderByField: {}
    }
  },
  mounted: function () {
    if(this.keyWords !== null && this.keyWords !== undefined) {
      //check if this is unconditional
      this.searchKeyWords = this.keyWords;
    }
  },
  watch : {
    filterOptions: function (newFilterOptions) {
      this.loadSearchResults(newFilterOptions, this.searchKeyWords, this.orderByField);
    },
    keyWords: function(newKeywords) {
      this.searchKeyWords = newKeywords;
    },
    searchKeyWords: function (newSearchKeyWords) {
      if(newSearchKeyWords !== undefined && newSearchKeyWords !== null) {
        this.loadSearchResults(this.filterOptions, newSearchKeyWords, this.orderByField);
      }
    },
    orderByField: function (newOrderByField) {
      this.loadSearchResults(this.filterOptions, this.searchKeyWords, newOrderByField);
    }
  },
  methods: {
    ...mapActions(["updateSearchResultOutfits"]),
    filter: function (options) {
      let filterOptions = {};

      let colorOptions = options.colorOptions;
      if(colorOptions && colorOptions.length > 0) {
        filterOptions.color = colorOptions;
      }

      let occasionOptions = options.occasionOptions;
      if(occasionOptions && occasionOptions.length > 0) {
        filterOptions.occasionID = occasionOptions;
      }

      let styleOptions = options.styleOptions;
      if(styleOptions && styleOptions.length > 0) {
        filterOptions.styleID = styleOptions;
      }

      let wearabilityOptions = options.wearabilityOptions;
      if(wearabilityOptions && wearabilityOptions.length > 0) {
        filterOptions.wearability = wearabilityOptions;
      }

      let brandOptions = options.brandOptions;
      if(brandOptions && brandOptions.length > 0) {
        filterOptions.brand = brandOptions;
      }

      let priceOptions = options.priceOptions;
      if(priceOptions && priceOptions.length > 0) {
        filterOptions.totalPrice = priceOptions;
      }

      if(JSON.stringify(this.filterOptions) !== JSON.stringify(filterOptions)) {
        this.filterOptions = filterOptions;
      }
      if(options.keyWords !== null && options.keyWords !== undefined && this.searchKeyWords !== options.keyWords) {
        this.searchKeyWords = options.keyWords;
      }
    },
    sort: function(orderByField) {
      if(JSON.stringify(this.orderByField) !== JSON.stringify(orderByField)) {
        this.orderByField = orderByField;
      }
    },
    loadSearchResults: function(filterOptions, searchKeyWords, orderByField) {
      let searchEndpoint = constants.backend.outfitEndpoint.search;

      let urlParams = [];

      if(filterOptions && Object.keys(filterOptions).length > 0) { //filter example "?filterBy=occasionID $eq wedding-guest;weekend; $and styleID $eq xxxx;yyyy"
        let filterParam = constants.backend.filterByQuery + "=";
        Object.keys(filterOptions).forEach(key => {
          filterParam += key + constants.backend.filterEqOperator;
          for(let i = 0; i < filterOptions[key].length; i++) {
            filterParam += filterOptions[key][i].key + ";";
          }
          filterParam += constants.backend.filterAndOperator;
        });
        filterParam = filterParam.substring(0, filterParam.lastIndexOf(constants.backend.filterAndOperator));
        urlParams = urlParams.concat(filterParam);
      }

      if(searchKeyWords) {
        let searchParam = constants.backend.searchByQuery + "=" + searchKeyWords;
        urlParams = urlParams.concat(searchParam);
      }
      
      if(orderByField && Object.keys(orderByField).length > 0) {
        let orderParam = constants.backend.orderByQuery + "=" + orderByField.key;
        urlParams = urlParams.concat(orderParam);
      }

      if(urlParams.length > 0) {
        searchEndpoint += "?" + urlParams[0];
        for(let i = 1; i < urlParams.length; i++) {
          searchEndpoint += "&" + urlParams[i];
        }
      }

      this.$api
        .get(searchEndpoint)
        .then(response => (this.updateSearchResultOutfits(response.data)));
    }
  },
  computed: {
      ...mapGetters(["getSearchResultOutfits"]),
      outfits: function () {
          return this.getSearchResultOutfits;
      }
  }
};
</script>