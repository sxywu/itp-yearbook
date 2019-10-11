<template>
  <div id="app">
    <Visualization v-bind='{data, width, height, student}'></Visualization>
    <div id='inputs'>
      <input id='name' type='text' placeholder='red burns' v-model='student' autofocus />
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
      student: '',
    }
  },
}
</script>

<style scoped>
#inputs {
  position: absolute;
  bottom: 120px;
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
  width: 800px;
}

#year {
  width: 112px;
}
</style>
