<template>
    <span class="articles-preview-container">
        <img :alt="$t('article') + ': ' + article.name " :src="article.previewImage">
        <p>{{ article.brand + " - " + article.name }}</p>
        <span>{{ this.getLocaleAmount(article.price, article.currency) + " " + this.getCurrencySymbol(article.currency) }}</span>
    </span>
</template>

<script>

import { utilities } from '../utilities/utilities';

export default {
    name: 'ArticlePreview',
    props: {
        article: Object
    },
    methods: {
        getCurrencySymbol: function (currencyISOCode) {
            return utilities.getCurrencySymbol(currencyISOCode);
        },
        getLocaleAmount: function (amount, currency) {
            return utilities.getLocaleAmount(amount, currency);
        }
        
    }
};
</script>

<style lang="scss">

    .articles-preview-container {
        top: 0px;
        display: inline-block;
        white-space: normal;
        width: 90px;
        height: 160px;
        margin: 8px;

        img {
            /*max-width: 100%;
            height: auto;*/
            width: 90px;
            height: 90px;
            object-fit: contain;
            top: 0px;
            left: 0px;
        }

        p {
            margin: 0px;
            font-size: 0.8rem;
            font-weight: 500;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
            -moz-box-orient: vertical;
        }

        span {
            bottom: 0px;
            margin: 0px;
            font-size: 0.8rem;
            font-weight: 600;
            color: #006DB6;
        }
    }

</style>