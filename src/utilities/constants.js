export const constants = {
    backend: {
        endpointRoot: process.env.VUE_APP_BACKEND_ENDPOINT_ROOT,
        localeHTTPHeader: "Flames-language",
        orderByQuery: "orderBy",
        filterByQuery: "filterBy",
        searchByQuery: "searchBy",
        filterEqOperator: " $eq ",
        filterAndOperator: " $and ",
        occasionEndpoint: {
            single: "/occasion",
            multiple: "/occasions",
            outfits: "/outfits"
        },
        styleEndpoint: {
            single: "/style",
            multiple: "/styles",
            outfits: "/outfits"
        },
        outfitEndpoint: {
            single: "/outfit",
            multiple: "/outfits",
            inspiration: "/outfits/inspire",
            search: "/outfits/search",
            upvote: "/upvote",
            unvote: "/unvote"
        },
        articleEndpoint: {
            brands: "/articles/brands",
            colors: "/articles/colors",
            wearabilities: "/articles/wearabilities"
        },
        interactionEndpoint: {
            openOccasion: "/interaction/openOccasion",
            openStyle: "/interaction/openStyle",
            openArticle: "/interaction/openArticle",
            openOutfit: "/interaction/openOutfit",
            buyArticle: "/interaction/buyArticle",
            buyOutfit: "/interaction/buyOutfit",
            showTimeOutfit: "/interaction/outfitShowTime",
            showTimeOutfitZoom: "/interaction/outfitZoomShowTime",
            showTimeArticleZoom: "/interaction/articleZoomShowTime"
        }
    },
    interaction: {
        outfitPreviewShowTimeTriggerThreshold: 0.3,
        outfitShowTimeTriggerThreshold: 0,
        zoomShowTimeTriggerThreshold: 0,
        zoomShowTimeMinimumDuration: 2
    },
    inspiration: {
        defaultOrderByField: "updatedAt"
    },
    search: {
        priceOptions: [
            {key: "priceTier1", text: "0 - 100", selected: false},
            {key: "priceTier2", text: "100 - 300", selected: false},
            {key: "priceTier3", text: "300 - 500", selected: false},
            {key: "priceTier4", text: "500 - 1000", selected: false},
            {key: "priceTier5", text: "> 1000", selected: false}
        ],
        orderByFields: [
            {key: "", text: "relevance", selected: false},
            {key: "votesCounter", text: "popular", selected: false},
            {key: "createdAt", text: "latest", selected: false},
            {key: "totalPrice", text: "price", selected: false}
        ]
    }
};