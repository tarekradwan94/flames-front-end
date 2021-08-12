import { utilities } from '../../utilities/utilities';

const state = {
    allOutfits: [],
    inspirationOutfits: [],
    searchResultOutfits: []
};

const getters = {
    getInspirationOutfits: function (state) {
        return state.inspirationOutfits;
    },

    getSearchResultOutfits: function (state) {
        return state.searchResultOutfits;
    },

    getOutfit: function (state) {
        return (uniqueName) => {
            return state.allOutfits.find(outfit => outfit.uniqueName === uniqueName)
        }
    }
};

const actions = {
    updateInspirationOutfits: function ({commit}, inspirationOutfits) {
        commit("setInspirationOutfits", inspirationOutfits )
    },

    updateSearchResultOutfits: function ({commit}, searchResultOutfits) {
        commit("setSearchResultOutfits", searchResultOutfits )
    },

    updateOutfit: function ({commit}, updatedOutfit) {
        commit("setUpdatedOutfit", updatedOutfit);
    },

    updateOutfits: function ({commit}, updatedOutfits) {
        commit("setUpdatedOutfits", updatedOutfits);
    },

    addOutfit: function ({commit}, newOutfit) {
        commit("setNewOutfit", newOutfit);
    }
};

const mutations = {
    setInspirationOutfits: function (state, outfits) {
        let freshInspirationOutfits = [];
        for(let i = 0; i < outfits.length; i++) {

            let outfit = state.allOutfits.find(outfit => outfit.uniqueName === outfits[i].uniqueName);
            if(outfit) {
                //updated existing instances of outfits
                utilities.copyFieldsFromObjectToObject(outfits[i], outfit);
                freshInspirationOutfits = freshInspirationOutfits.concat(outfit); //use inside inspirationOutfits array the same instance contained in allOutfits
            } else {
                //if no existing instance was found, add it
                state.allOutfits = state.allOutfits.concat(outfits[i]);
                freshInspirationOutfits = freshInspirationOutfits.concat(outfits[i]); //use inside inspirationOutfits array the same instance contained in allOutfits
            }
        }
        state.inspirationOutfits = freshInspirationOutfits;
    },

    setSearchResultOutfits: function (state, outfits) {
        let freshSearchResultOutfits = [];
        for(let i = 0; i < outfits.length; i++) {

            let outfit = state.allOutfits.find(outfit => outfit.uniqueName === outfits[i].uniqueName);
            if(outfit) {
                //updated existing instances of outfits
                utilities.copyFieldsFromObjectToObject(outfits[i], outfit);
                freshSearchResultOutfits = freshSearchResultOutfits.concat(outfit); //use inside searchResultOutfits array the same instance contained in allOutfits
            } else {
                //if no existing instance was found, add it
                state.allOutfits = state.allOutfits.concat(outfits[i]);
                freshSearchResultOutfits = freshSearchResultOutfits.concat(outfits[i]); //use inside searchResultOutfits array the same instance contained in allOutfits
            }
        }
        state.searchResultOutfits = freshSearchResultOutfits;
    },

    setUpdatedOutfit: function (state, updatedOutfit) {
        //updated existing instances of outfit
        let outfit = state.allOutfits.find(outfit => outfit.uniqueName === updatedOutfit.uniqueName);
        if(outfit) {
            utilities.copyFieldsFromObjectToObject(updatedOutfit, outfit);
        }
    },

    setUpdatedOutfits: function (state, updatedOutfits) {
        //updated existing instances of outfits
        for(let i = 0; i < updatedOutfits.length; i++) {

            let outfit = state.allOutfits.find(outfit => outfit.uniqueName === updatedOutfits[i].uniqueName);
            if(outfit) {
                //updated existing instances of outfits
                utilities.copyFieldsFromObjectToObject(updatedOutfits[i], outfit);
            }
        }
    },

    setNewOutfit: function (state, newOutfit) {
        state.allOutfits = state.allOutfits.concat(newOutfit);
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}