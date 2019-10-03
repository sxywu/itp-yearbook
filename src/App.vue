<template>
  <div id="app">
    <Visualization v-bind='{data, width, height, year}'></Visualization>
    <div id='infobox'>
      <h1>{{ year }}</h1>
      <br />
      <Years v-bind='{data, updateYear}' />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import * as d3 from 'd3'

import Visualization from './Visualization.vue'
import Years from './Years.vue'

import data from '../data/studentsWithPhotos.json'

export default {
  name: 'app',
  components: {Visualization, Years},
  data() {
    return {
      data: _.map(data, d => Object.assign(d, {year: +d.year})),
      width: window.innerWidth,
      height: window.innerHeight,
      year: 2011,
      years: [],
    }
  },
  methods: {
    updateYear(year) {
      this.year = year
    }
  },
}
</script>

<style scoped>
#infobox {
  position: absolute;
  top: 20px;
  left: 20px;
  max-width: 500px;
  background: rgba(255, 255, 255, 0.95);
  text-align: center;
  overflow: visible;
  padding: 20px;
  border: 1px solid #333;
}
</style>
