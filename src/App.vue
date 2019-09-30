<template>
  <div id="app">
    <svg :width='width' :height='height'>
      <!-- gooey effect -->
      <defs>
         <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix in="blur" mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" />
         </filter>
      </defs>
      <!-- <g style='filter: url("#gooey")'> -->
        <circle v-for='d in nodes' :cx='d.x' :cy='d.y' r='3' :fill='d.color' />
      <!-- </g> -->
      <!-- <g v-for='d in years' :transform='`translate(${d.x}, ${height / 2})`'>
      </g> -->
      <text v-for='d in years' :x='d.x' :y='height / 2'
        dy='.35em' text-anchor='middle'>{{ d.year }}</text>
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
      years: [],
      nodes: [],
    }
  },
  mounted() {
    this.xScale = d3.scaleLog().domain([2000, 2020])
      .range([margin.left, this.width - margin.right])
    // eventually do vertical by hue or lightness?
    this.yScale = d3.scaleLinear().domain([1, 0])
      .range([margin.top, this.height - margin.bottom])

    console.log(this.years)
    this.nodes = _.chain(data)
      .filter(d => d.colors)
      .map(d => {
        const color = d.colors[0]
        const x = this.xScale(+d.year)
        const y = this.yScale(chroma(color).hsl()[2])
        return {
          x, y,
          focusX: x, focusY: this.height / 2,
          color,
        }
      }).value()

    console.log(this.nodes)
    this.years = _.times(20, i => {
      const year = 2000 + i
      return {
        year,
        x: this.xScale(year),
      }
    })

    this.simulation = d3.forceSimulation(this.nodes)
      .force('x', d3.forceX().x(d => d.focusX))
      .force('y', d3.forceY().y(d => d.focusY))
      .force('collide', d3.forceCollide(3))
  },
}
</script>

<style scoped>
</style>
