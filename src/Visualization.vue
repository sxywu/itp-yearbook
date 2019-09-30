<template>
  <div id="visualization">
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
        <circle :r='1.25 * largest' opacity='0'
          @mouseenter='hovered = d' @mouseleave='hovered = null' />
      </g>
    </svg>
    <!-- IMAGE -->
    <div v-if='hovered' :style='{
      position: `absolute`,
      top: hovered.y + 1.75 * largest,
      left: hovered.x,
      transform: `translate(-50%, 0)`,
    }'>
      <img :src='hovered.image' />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import * as d3 from 'd3'
import chroma from 'chroma-js'
import images from '../data/photos/*/*.*'

const largest = 40
const margin = {left: 20, top: 20, right: 20, bottom: 20}

export default {
  name: 'visualization',
  props: ['data', 'width', 'height', 'year'],
  data() {
    return {
      students: [],
      hovered: null,
      largest,
    }
  },
  mounted() {
    this.yScale = d3.scaleLinear().domain([0, 1]).range([0.5 * largest, -0.5 * largest])
    this.sizeScale = d3.scaleLog().domain([1, 5]).range([largest, largest / 10])
    this.colorSimulation = d3.forceSimulation()
      .force('x', d3.forceX(0))
      .force('y', d3.forceY(0))
      .force('collide', d3.forceCollide(d => d.r * 0.5))
      .stop()

    this.calculateData()
  },
  watch: {
    year() {
      this.calculateData()
    },
  },
  methods: {
    calculateData() {
      this.students = _.chain(this.data)
        .filter(d => +d.year === this.year && d.colors)
        .map((d, i) => {
          const colors = _.map(d.colors, (color, i) => {
            const lightness = chroma(color).hsl()[2]
            return {
              color,
              x: _.random(-0.5 * largest, 0.5 * largest),
              y: this.yScale(lightness),
              r: this.sizeScale(i + 1),
            }
          })
          // simulate
          this.colorSimulation.nodes(colors).alpha(1)
          _.times(300, this.colorSimulation.tick())

          const [hue, saturation, lightness] = chroma(d.colors[0]).hsl()
          return {
            colors,
            name: d.name.split(' ')[0],
            image: _.values(images[d.year][d.netID])[0],
            hue: ((hue + 120) % 360 + 10) || 0,
            lightness,
          }
        }).value()

      const size = 2.75 * largest
      this.histogram = d3.histogram().value(d => d.hue)
        .domain([0, 370]).thresholds(_.times(37, i => i * 10))
      const bins = _.filter(this.histogram(this.students), bin => bin.length)
      const xOffset = (this.width - bins.length * size) / 2

      _.each(bins, (students, i) => {
        const yOffset = (this.height - students.length * size) / 2
        _.chain(students)
          .sortBy(d => -d.lightness)
          .each((student, j) => {
            Object.assign(student, {
              x: (i + 0.5) * size + xOffset,
              y: (j + 0.5) * size + yOffset,
            })
          }).value()
      })
    }
  },
}
</script>

<style scoped>
text {
  font-size: 12px;
  fill: #fff;
}
</style>
