<template>
  <div id="app">
    <Visualization v-bind='{data, width, height, year}'></Visualization>
    <div class='years'>
      <span v-for='d in years' @click='year = d.year'>
        {{ d.year }}
      </span>
    </div>
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
      years: [],
      year: 2011,
    }
  },
  mounted() {
    const years = _.chain(this.data)
      .map('year').uniq().sortBy().value()
    this.years = _.map(years, (year, i) => {
      return {
        year,
        // x: (i + 0.5) * (this.width * 0.8) / years.length + this.width * 0.1,
      }
    })
  },
}
</script>

<style scoped>
.years {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  text-align: center;
  padding: 40px 0;
}

.years span {
  display: inline-block;
  padding: 0 10px;
  cursor: pointer;
}
</style>
