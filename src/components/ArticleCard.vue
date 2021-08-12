<template>
    <div class="article-card">
        <div class="image-gallery-container">
            <ImagesGallery :images="article.images" :uniqueName="article.uniqueName" />
        </div>
        <h2 class="article-description">{{ article.brand + " - " + article.name }}</h2>
        <p class="article-price">{{ this.getLocaleAmount(article.price, article.currency) + " " + this.getCurrencySymbol(article.currency) }}</p>
        <p :class="{'article-available' : isArticleAvailable, 'article-not-available': !isArticleAvailable }"
            class="article-availability"> {{ isArticleAvailable ? $t('available') : $t('notAvailable') }}</p>
        <p>{{ $t('brand') }}: <span class="article-detail">{{ article.brand }}</span></p>
        <p>{{ $t('color') }}: <span class="article-detail">{{ article.color }}</span></p>
        <div class="article-product-details-container">
            <div v-if="detailsPopoverShown" class="product-details-popover">
                <span>
                    {{ article.details }}
                </span>
            </div>
            <button class="article-product-details" @click="detailsPopoverShown = !detailsPopoverShown">{{ $t('productDetails') }}</button>
        </div>
        <div v-if="false" class="article-size">
            <span>{{ $t('size') }}:</span>
            <div class="size-guide-container">
                <div v-if="sizeGuidePopoverShown" class="size-guide-popover">
                    <span>
                        {{ sizeGuide }}
                    </span>
                </div>
                <button @click="sizeGuidePopoverShown = !sizeGuidePopoverShown">{{ $t('sizeGuide') }}</button>
            </div>
        </div>
        <SelectOption v-if="false" :options="sizeOptions" :inputTitle="$t('chooseYourSize')" />
        <button @click="buyArticle" class="article-purchase-button">{{ $t('buySingleItem') }}</button>
    </div>
</template>

<script>

import { utilities } from '../utilities/utilities';
import ImagesGallery from './ImagesGallery.vue';
import SelectOption from './SelectOption.vue';
import { constants } from '../utilities/constants';

export default {
    name: "ArticleCard",
    components: {
        SelectOption,
        ImagesGallery
    },
    props: {
        article: Object
    },
    data: function () {
        return {
            detailsPopoverShown: false,
            sizeGuidePopoverShown: false,
            sizeGuide: "XXXXXX - XXXXXX - XXXXXX - XXXXXX - XXXXXX - XXXXXX - XXXXXX - XXXXXX - XXXXXX - XXXXXX - XXXXXX - XXXXXX"
        }
    },
    computed: {
        sizeOptions: function() {
            let options = [];
            for(let i = 0; i < this.article.sizes.length; i++) {
                options = options.concat({key: this.article.sizes[i].size, text: this.article.sizes[i].size, selected:false});
            }
            return options;
        },
        isArticleAvailable: function () {
            for(let i = 0; i < this.article.sizes.length; i++) {
                if(this.article.sizes[i].quantity > 0) {
                    return true;
                }
            }
            return false;
        }
    },
    mounted: function () {
        document.addEventListener('click', this.checkClickAway);
        document.addEventListener('touchstart', this.checkClickAway);
    },
    beforeDestroy: function () {
        document.removeEventListener('click', this.checkClickAway);
        document.removeEventListener('touchstart', this.checkClickAway);
    },
    methods: {
        getCurrencySymbol: function (currencyISOCode) {
            return utilities.getCurrencySymbol(currencyISOCode);
        },
        getLocaleAmount: function (amount, currency) {
            return utilities.getLocaleAmount(amount, currency);
        },
        checkClickAway: function (e) {
            let rootElement = this.$vnode.elm;
            if(rootElement.getElementsByClassName("article-product-details-container").length === 1) {
                let productDetailsContainer = rootElement.getElementsByClassName("article-product-details-container")[0];
                if (!productDetailsContainer.contains(e.target)){
                    this.detailsPopoverShown = false;
                }
            }

            if(rootElement.getElementsByClassName("article-size").length === 1) {
                let sizeContainer = rootElement.getElementsByClassName("article-size")[0];
                if (!sizeContainer.contains(e.target)){
                    this.sizeGuidePopoverShown = false;
                }
            }
        },
        buyArticle: function () {
            window.open(this.article.externalUrl, "_blank");
            let interactionEndpoint = constants.backend.interactionEndpoint.buyArticle + "/" + this.article.uniqueName;
            this.$api
                .post(interactionEndpoint)
                .then(function () {});
        }
    }
}
</script>

<style lang="scss">

    .article-card {
        width: calc(100% - (20px * 2));
        padding: 0 20px 0 20px;
        margin-top: 0px;
        height: 100%;
        position: relative;
        font-size: 0.9rem;

        .image-gallery-container {
            width: 70%;
        }

        p {
            margin: 10px 0 10px 0;
        }

        .article-description {
            font-weight: 500;
            font-size: 1.3rem;
            line-height: 1.3em;
            height: 2.6em;
            max-width: 300px;

            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            display: -webkit-box;
            -webkit-box-orient: vertical;
        }

        .article-price {
            font-size: 1.1rem;
            font-weight: 600;
            color: #006DB6;
        }

        .article-availability {
            margin-bottom: 25px;
            font-weight: 800;
        }

        .article-available {
            color: #43bc63;
        }

        .article-not-available{
            color: red;
        }

        .article-detail {
            font-weight: 800;
            margin-left: 5px;
        }

        .article-product-details-container {
            position: relative;
            width: 100%;
        }

        .article-product-details {
            text-decoration: underline;
            font-family: 'Avenir-Heavy';
            font-weight: 900;
            text-align: left;
        }

        .product-details-popover {
            position: absolute;
            width: calc(100% - ((2 + 10) * 2)); //border + padding
            left: 10px;
            transform: translate(0, -100%);
            padding: 5px 10px 5px 10px;
            background-color: white;
            border: 2px solid lightgray;
            border-radius: 10px;
            box-shadow: 2px 1px 2px #2b2b2b40;
            z-index: 2;
        }
        

        .article-size {
            position: relative;
            margin: 20px 0 20px 0;
            span {
                width: 50%;
            }
        }
        
        .size-guide-container {
            display: inline-block;
            position: absolute;
            left: 50%;
            width: 50%;
            button {
                text-decoration: underline;
                width: 100%;
                height: 100%;
                font-size: 0.75rem;
                text-align: right;
            }
        }

        .size-guide-popover {
            position: absolute;
            width: calc(100% - ((2 + 10) * 2)); //border + padding
            right: 10px;
            transform: translate(0, -100%);
            padding: 5px 10px 5px 10px;
            background-color: white;
            border: 2px solid lightgray;
            border-radius: 10px;
            box-shadow: 2px 1px 2px #2b2b2b40;
            z-index: 2;
        }

        .article-purchase-button {
            width: 100%;
            height: 45px;
            border-radius: 10px;
            margin-top: 20px;
            background-color: #006db6;
            color: white;
            font-size: 1.1rem;
        }
    }
    
</style>