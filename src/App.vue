<template>
  <div id="app">
    <svg :width='width' :height='height'>
      <!-- gooey effect -->
      <defs>
         <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -14" />
         </filter>
      </defs>
      <g v-for='d in students' :transform='`translate(${d.x}, ${d.y})`'>
        <g style='filter: url("#gooey")'>
          <circle v-for='c in d.colors' :cx='c.x' :cy='c.y' :r='c.r' :fill='c.color' />
        </g>
        <text text-anchor='middle' dy='.35em'>{{ d.name }}</text>
      </g>
    </svg>
  </div>
</template>

<script>
import _ from 'lodash'
import * as d3 from 'd3'
import chroma from 'chroma-js'
import data from '../data/studentsWithPhotos.json'

const margin = {left: 20, top: 20, right: 20, bottom: 20}

export default {
  name: 'app',
  data() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      year: 2011,
      years: [],
      students: [],
    }
  },
  mounted() {
    const largest = 24
    this.sizeScale = d3.scaleLinear().domain([0, 4]).range([largest, largest / 3])
    this.yScale = d3.scaleLinear().domain([0, 1]).range([1.5 * largest, -1.5 * largest])
    this.sizeScale = d3.scaleLinear().domain([0, 4]).range([largest, largest / 4])
    this.colorSimulation = d3.forceSimulation()
      .force('x', d3.forceX(0))
      .force('y', d3.forceY(0))
      .force('collide', d3.forceCollide(d => d.r / 2))
      .stop()

    this.students = _.chain(data)
      .filter(d => +d.year === this.year && d.colors)
      .map((d, i) => {
        const colors = _.map(d.colors, (color, i) => {
          const lightness = chroma(color).hsl()[2]
          return {
            color,
            x: _.random(-1.5 * largest, 1.5 * largest),
            y: this.yScale(lightness),
            r: this.sizeScale(i),
          }
        })
        // simulate
        this.colorSimulation.nodes(colors).alpha(1)
        _.times(300, this.colorSimulation.tick())

        const [hue, saturation, lightness] = chroma.average(d.colors, 'hsl').hsl()
        let x = ((hue || 0 + 120) % 360) / 360
        x = x * this.width * 0.2 + this.width * 0.4
        const y = (1 - lightness) * this.height * 0.1 + this.height * 0.45
        return {
          colors,
          name: d.name.split(' ')[0],
          x, y,
          // forceX: x, forceY: y,
          // x: _.random(this.width * 0.4, this.width * 0.6),
          // y: _.random(this.height * 0.45, this.height * 0.55),
        }
      }).value()

    this.simulation = d3.forceSimulation(this.students)
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      // .force('x', d3.forceX(d => d.forceX))
      // .force('y', d3.forceY(d => d.forceY))
      .force('collide', d3.forceCollide(2 * largest))
      // .force('charge', d3.forceManyBody())
  },
}
</script>

<style scoped>
text {
  font-size: 12px;
}
</style>
