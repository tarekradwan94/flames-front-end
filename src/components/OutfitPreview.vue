<template>
  <button
    @click="gotoOutfit"
    :style="{marginLeft: margin, marginRight:margin}"
    class="outfit-preview-container"
  >
    <img
      class="outfit-preview-image"
      :alt="$t('outiftPreview') + ': ' + outfit.name "
      :src="outfit.previewImage"
    />
    <div class="outfit-preview-details">
      <span v-if="showArticles"
        class="outfit-preview-articlescount"
      >{{ $tc('articles', outfit.articles.length, { count: outfit.articles.length }) }}</span>
      <ArticlesCollection :articles="outfit.articles" v-if="showArticles" />
      <div v-if="showArticles" class="outfit-preview-separator"></div>
      <div class="outfit-preview-data">
        <p>
          {{ $t('occasion') }}:
          <span>{{ outfit.occasion[0].name }}</span>
        </p>
        <p>
          {{ $t('style') }}:
          <span>{{ outfit.style[0].name }}</span>
        </p>
        <div class="outfit-preview-stylist">
          <img
            :alt="$t('stylist') + ': ' + outfit.stylist[0].name "
            :src="outfit.stylist[0].previewImage"
          />
          <span>{{ outfit.stylist[0].name }}</span>
        </div>
        <div class="outfit-preview-votes">          <span>{{ outfit.votesCounter }}</span>
          <button @click.stop="voteOutfit" :style="{'background-image': (outfit.isUpvoted === true ? votedIcon : voteIcon )}" />
        </div>
      </div>
    </div>
  </button>
</template>

<script>
import ArticlesCollection from "./containers/ArticlesCollection.vue";
import { constants } from '../utilities/constants';
import { mapActions } from 'vuex';

export default {
  name: "OutfitPreview",
  components: {
    ArticlesCollection,
  },
  props: {
    outfit: Object,
    margin: String,
    showArticles: Boolean
  },
  data: function() {
    return {
      voteIcon: "url(" + require("../assets/vote-icon.png") + ")",
      votedIcon: "url(" + require("../assets/voted-icon.png") + ")",
      showTime: null
    }
  },
  mounted: function () {
    // start tracking outfit show time and save it as interaction
    var outfitObserver = new IntersectionObserver(function(entries) {
      for(let i=0; i<entries.length; i++) {
        if(entries[i].isIntersecting) {
          // GO
          this.showTime = new Date();
        } else if(this.showTime !== null) {
          //STOP
          const showTimeDuration = Math.abs(this.showTime - new Date()); //duration in ms
          this.showTime = null;
          const showTimeDurationInSeconds = Math.ceil(showTimeDuration / 1000); 

          requestIdleCallback(function() {
            let interactionEndpoint = constants.backend.interactionEndpoint.showTimeOutfit + "/" + this.outfit.uniqueName;
            this.$api
                .post(interactionEndpoint, {showTime: showTimeDurationInSeconds})
                .then(function () {});
          }.bind(this));

        }
      }
    }.bind(this), { root: null,  threshold: [constants.interaction.outfitPreviewShowTimeTriggerThreshold] });

    outfitObserver.observe(this.$vnode.elm);
  },
  methods: {
    ...mapActions(["updateOutfit"]),
    gotoOutfit: function () {
      this.$router.push({
        name: "outfit",
        params: { uniqueName: this.outfit.uniqueName }
      });
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
          .then(function (response) {
            if(response.data.outfit ) {
              this.updateOutfit(response.data.outfit);
            }
          }.bind(this));
    }
  },
};
</script>

<style lang="scss">
$mobileMaxWidth: 800px;

$stylistMargin: 10px 0 10px 0;
$stylistSize: 36px;

.outfit-preview-container {
  width: 290px;
  border-radius: 10px;
  border: 1px solid #c3c7c9;
  overflow: hidden;
  position: relative;
  top: 0px;
  left: 0px;
  display: inline-block;
  margin-bottom: 35px;
  background-color: white;

  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  color: inherit;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  text-align: left;

  .outfit-preview-image {
    /* fixed sizes */
    width: 288px;
    height: 376px;
    object-fit: cover; //preserve aspect ratio
  }

  .outfit-preview-details {
    margin: 5px 10px 5px 10px;
  }

  .outfit-preview-articlescount {
    font-size: 0.9rem;
    font-weight: 500;
  }

  .outfit-preview-separator {
    width: 90%;
    height: 1px;
    position: relative;
    margin: 15px 0 15px 0;
    left: 50%;
    transform: translate(-50%);
    background-color: #e1e1e1;
  }

  .outfit-preview-data {
    width: 90%;
    height: 100px;
    position: relative;
    margin: 15px 0 15px 0;
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

  .outfit-preview-stylist {
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

  .outfit-preview-votes {
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
}
@media screen and (max-width: $mobileMaxWidth) {
  .outfit-preview-container {
    margin: 0 auto 35px auto;
  }
}
</style>
