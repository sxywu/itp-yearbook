<template>
  <svg :width='11.5 * xPadding' :height='4 * yPadding'>
    <g v-for='d in years' :transform='`translate(${d.x}, ${d.y})`'>
      <rect :x='-xPadding / 2' :y='-yPadding / 2' :width='xPadding' :height='yPadding'
        stroke='#fff' stroke-width='2' fill='#333' :opacity='d.opacity'
        @click='updateYear(d.year)' />
    </g>
    <text v-for='n in 4' :x='1.5 * xPadding - 3' :y='(n - 0.5) * yPadding'
      text-anchor='end' dy='.35em'>{{ 1970 + n * 10}}</text>
  </svg>
</template>

<script>
import _ from 'lodash'
import * as d3 from 'd3'
import chroma from 'chroma-js'

const xPadding = 20
const yPadding = 30
export default {
  name: 'years',
  props: ['data', 'updateYear'],
  data() {
    return {
      years: [],
      xPadding, yPadding,
    }
  },
  mounted() {
    const opacityScale = d3.scaleLinear().domain([1, 100]).range([0.1, 1])
    const perRow = 10
    this.years = _.chain(this.data)
      .filter(d => d.colors)
      .groupBy(d => d.year)
      .map((students, year) => {
        year = +year
        const color = chroma.average(_.map(students, ({colors}) => colors[0]), 'hsl')
        const x = (year % perRow + 2) * xPadding
        const y = (Math.floor((year - 1980) / perRow) + 0.5) * yPadding

        return {
          color, x, y,
          opacity: opacityScale(students.length),
          text: year % perRow === 0 ? year : '',
          width: xPadding, height: yPadding,
          year,
        }
      }).value()
  },
}
</script>

<style scoped>
text {
  font-family: monospace;
  font-size: 12px;
}
rect {
  cursor: pointer;
}
</style>
