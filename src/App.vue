<template>
  <div id="app">
    <Visualization v-bind='{data, width, height, year, student}'></Visualization>
    <div id='inputs'>
      <input id='name' type='text' placeholder='search for a student' v-model='student' />
      in class of <input id='year' type='text' v-model.number='year' />
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
      student: '',
      year: 2019,
      hovered: null,
    }
  },
  methods: {
    updateYear(year) {
      this.year = year
    },
    updateHovered(hovered) {
      this.hovered = hovered
    },
  },
}
</script>

<style scoped>
#inputs {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translate(-50%, 0%);
  font-size: 36px;
  background: #fff;
}

input {
  padding: 2px 10px;
  font-family: 'Playfair Display';
  font-size: 36px;
  border: 1px solid;
  text-align: center;
}

#year {
  width: 112px;
}
</style>
