<template>
  <div id="app">
    <Visualization v-bind='{data, width, height, year, updateHovered}'></Visualization>
    <div id='infobox'>
      <div id='years'>
        <h1>{{ year }}</h1>
        <br />
        <Years v-bind='{data, updateYear}' />
      </div>
      <!-- HOVER -->
      <div v-if='hovered' id='hovered'>
        <img :src='hovered.image' width='100%' />
        <div class='name'>{{ hovered.name }}</div>
      </div>
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
#infobox {
  position: absolute;
  top: 20px;
  left: 20px;
  text-align: center;
  overflow: visible;
}

#years, #hovered {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border: 1px solid #333;
  position: relative;
  margin-bottom: 10px;
}

#hovered {
  pointer-events: none;
}

#hovered .name {
  font-weight: bold;
  text-transform: uppercase;
  color: #fff;
  position: absolute;
  left: 50%;
  bottom: 25px;
  transform: translate(-50%, 0);
}
</style>
