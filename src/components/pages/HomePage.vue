<template>
  <div id="home">
    <HeadBar />
    <SearchContainer />
    <NeedsContainer />
    <InspirationContainer />
    <!--<FootBar />-->
  </div>
</template>

<script>
import HeadBar from '../HeadBar.vue';
import SearchContainer from '../containers/SearchContainer.vue';
import NeedsContainer from '../containers/NeedsContainer.vue';
import InspirationContainer from '../containers/InspirationContainer.vue';

export default {
  name: 'HomePage',
  components: {
    HeadBar,
    SearchContainer,
    NeedsContainer,
    InspirationContainer
  }
};
</script>

