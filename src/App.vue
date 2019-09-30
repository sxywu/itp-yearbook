<template>
  <div id="app">
    <Visualization v-bind='{data, width, height, year}' />
  </div>
</template>

<script>
import _ from 'lodash'
import * as d3 from 'd3'
import Visualization from './Visualization.vue'

import data from '../data/studentsWithPhotos.json'

export default {
  name: 'app',
  components: {Visualization},
  data() {
    return {
      data: _.map(data, d => Object.assign(d, {year: +d.year})),
      width: window.innerWidth,
      height: window.innerHeight,
      year: 2011,
    }
  },
}
</script>

<style scoped>
</style>
