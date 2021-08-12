<template>
    <div class="outfit-purchase-card">
        <div class="outfit-purchase-data">
            <p>
                {{ $t('occasion') }}
            </p>
            <p class="outfit-purchase-occasion">
                {{ outfit.occasion[0].name }}
            </p>
            <div class="outfit-purchase-stylist">
                <img
                    :alt="$t('stylist') + ': ' + outfit.stylist[0].name "
                    :src="outfit.stylist[0].previewImage"
                />
                <span>{{ outfit.stylist[0].name }}</span>
            </div>
            <div class="outfit-purchase-votes">
                <span>{{ outfit.votesCounter }}</span>
                <button @click.stop="voteOutfit" :style="{'background-image': (outfit.isUpvoted === true ? votedIcon : voteIcon )}" />
            </div>
            <p
                class="outfit-purchase-articlescount"
                >{{ $tc('articles', outfit.articles.length, { count: outfit.articles.length }) }}</p>
            <p>
                {{ $t('style') }}:
                <span>{{ outfit.style[0].name }}</span>
            </p>
        </div>
        <div class="outfit-purchase-action">
            <p>
                {{ $t('totalPrice') }}
            </p>
            <p class="outfit-purchase-price">
                {{ this.getLocaleAmount(outfit.totalPrice, outfit.currency) + " " + this.getCurrencySymbol(outfit.currency) }}
            </p>
            <button @click="buyOutfit" class="outfit-purchase-button">
                {{ $t('buyTheOutfit') }}
            </button>
        </div>
    </div>
</template>

<script>
import { utilities } from '../utilities/utilities';
import { constants } from '../utilities/constants';
import { mapActions } from 'vuex';

export default {
  name: "OutfitPurchaseCard",
  props: {
      outfit: Object
  },
  data: function() {
    return {
      voteIcon: "url(" + require("../assets/vote-icon.png") + ")",
      votedIcon: "url(" + require("../assets/voted-icon.png") + ")"
    }
  },
  methods: {
      ...mapActions(["updateOutfit"]),
      getCurrencySymbol: function (currencyISOCode) {
          return utilities.getCurrencySymbol(currencyISOCode);
      },
      getLocaleAmount: function (amount, currency) {
          return utilities.getLocaleAmount(amount, currency);
      },
      voteOutfit: function () {
          let voteEndpoint = constants.backend.outfitEndpoint.single + "/" + this.outfit.uniqueName;
          if(!this.outfit.isUpvoted) {
              voteEndpoint += constants.backend.outfitEndpoint.upvote;
          } else {
              voteEndpoint += constants.backend.outfitEndpoint.unvote;
          }
          this.$api
              .put(voteEndpoint, { outfitUniqueName: this.outfit.uniqueName })
              .then(response => {
                  if(response.data.outfit) {
                      this.updateOutfit(response.data.outfit);
                  }
              });
      },
      buyOutfit: function () {
          let interactionEndpoint = constants.backend.interactionEndpoint.buyOutfit + "/" + this.outfit.uniqueName;
          this.$api
              .post(interactionEndpoint)
              .then(function () {});
      }
  }
}

</script>

<style lang="scss">
$desktopMinWidth: 1250px; /* 105px * 2 outer margins + 300px min-width image + 420px min-width articles + 300px OutfitPurchaseCard + 10px * 2 inner margins */
$stylistMargin: 10px 0 10px 0;
$stylistSize: 36px;
$margin: 15px 0 15px 0;

    .outfit-purchase-card {
        width: 300px;
        height: 370px;
        float: right;
        background-color: #f5f5f5;
        position: relative;
        margin-bottom: 30px;

        .outfit-purchase-data {
            width: 90%;
            height: 100px;
            position: relative;
            margin: $margin;
            left: 50%;
            transform: translate(-50%);
            font-size: 0.9rem;
            font-weight: 500;

            p {
                margin: 3px 0 3px 0;
                color: #373737;
            }
            span {
                color: black;
            }
        }

        .outfit-purchase-occasion {
            font-weight: 600;
            font-size: 1.6rem;
        }

        .outfit-purchase-stylist {
            width: 70%;
            margin: $stylistMargin;
            float: left;

            img {
                width: $stylistSize;
                height: $stylistSize;
                border-radius: calc(#{$stylistSize} / 2);
                float: left;
            }

            span {
                line-height: $stylistSize;
                vertical-align: middle;
                margin: 0 0 0 5px;
            }
        }

        .outfit-purchase-votes {
            width: 30%;
            margin: $stylistMargin;
            height: $stylistSize;
            float: left;

            button {
                width: 20px;
                height: 20px;
                top: 50%;
                transform: translate(0, -50%);
                background: no-repeat center top;
                -webkit-background-size: cover;
                -moz-background-size: cover;
                -o-background-size: cover;
                background-size: cover;
                float: right;
            }

            span {
                line-height: $stylistSize;
                vertical-align: middle;
                margin: 0 0 0 5px;
                float: right;
            }
        }

        .outfit-purchase-articlescount {
            font-size: 0.9rem;
            font-weight: 500;
        }

        .outfit-purchase-action {
            bottom: 0px;
            width: 90%;
            height: 110px;
            position: absolute;
            margin: $margin;
            left: 50%;
            transform: translate(-50%);
            font-size: 0.9rem;
            font-weight: 500;

            p {
                margin: 0;
            }
        }

        .outfit-purchase-price {
            font-size: 1.5rem;
            font-weight: 600;
            color: #006DB6;
            margin-top: 5px;
        }

        .outfit-purchase-button {
            width: 100%;
            height: 45px;
            border-radius: 10px;
            margin-top: 15px;
            background-color: #006db6;
            color: white;
            font-size: 1.1rem;
        }
    }
    @media screen and (max-width: $desktopMinWidth) {
        .outfit-purchase-card {
            width: 300px;
            margin-left: calc((100% - (300px)) / 2);
            margin-right: calc((100% - (300px)) / 2);
        }
    }

</style>