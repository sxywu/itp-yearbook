<template>
  <div id="visualization">
    <svg :width='width' :height='height'>
      <defs>
        <!-- gooey effect -->
        <filter id="gooey">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix in="blur" mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -14" />
        </filter>
        <!-- petal shape clip path -->
        <clipPath v-for='d in students' :id='`flowerClip${d.netID}`'>
          <!-- petals -->
          <path d="M.41,64.39C-.69,55,4.16,47.06,7.89,42.76c2.72-3.14-1.78,1.35,3.74,9.89,4.06,6.28,9.45,7.5,9.45,15.25A8.26,8.26,0,0,1,12.26,76,12.92,12.92,0,0,1,.41,64.39Z" transform='translate(-30, -70)' />
          <path d="M23.66,75a.22.22,0,0,1-.2-.39c2.86-2.55,5.27-4.65,4.48-10.39-.85-6.18-10.29-9.7-11.33-20.68s5.44-21.17,9.87-24.36c2.52-1.81-2.93.89,4.39,12.43,7.76,12.25,13.62,14.06,13.62,23C44.49,60.7,38.83,71.89,23.66,75Z" transform='translate(-30, -70)'/>
          <path d="M37.67,74.53c-.25-.07-.33-.39-.08-.49,6.94-3,11.49-6.69,12.95-14.71.66-3.59,1.35-8.78-1.46-13.41-3.17-5.23.71-2,4.94,2C58.7,52.44,62.37,58.2,60,66.16,57,76,44.49,76.54,37.67,74.53Z" transform='translate(-30, -70)'/>
          <!-- base -->
          <path d="M13.67,82.31a.76.76,0,0,1,.7-.94c5.66-.47,31.78-1.8,32.74,0S41,99.55,40.05,99.89s-17.55.61-18.79,0C19.32,98.93,14.5,86.43,13.67,82.31Z" transform='translate(-30, -70)'/>
          <!-- embers -->
          <circle class="cls-1" cx="37.44" cy="14" r="3" transform='translate(-30, -70)'/>
          <circle class="cls-1" cx="6" cy="32" r="2" transform='translate(-30, -70)'/>
          <circle class="cls-1" cx="43" cy="28" r="1.5" transform='translate(-30, -70)'/>
          <!-- student name -->
          <text :y='45' text-anchor='middle' dy='.35em'>{{ d.name }}</text>
        </clipPath>
      </defs>
      <g v-for='d in students' :transform='`translate(${d.x}, ${d.y})`'>
        <g style='filter: url("#gooey")' :clip-path='`url(#flowerClip${d.netID})`'>
          <circle v-for='c in d.colors' :cx='c.x' :cy='c.y' :r='c.r' :fill='c.color' />
        </g>
        <circle :r='1.5 * largest' opacity='0'
          @mouseenter='updateHovered(d)' @mouseleave='updateHovered(null)' />
      </g>
    </svg>
  </div>
</template>

<script>
import _ from 'lodash'
import * as d3 from 'd3'
import chroma from 'chroma-js'
import images from '../data/photos/*/*.*'

const largest = 60
const margin = {left: 20, top: 20, right: 20, bottom: 20}

export default {
  name: 'visualization',
  props: ['data', 'width', 'height', 'year', 'updateHovered'],
  data() {
    return {
      students: [],
      largest,
    }
  },
  mounted() {
    this.yScale = d3.scaleLinear().domain([0, 1]).range([0.25 * largest, -0.25 * largest])
    this.sizeScale = d3.scaleLog().domain([1, 5]).range([largest, largest / 6])
    this.colorSimulation = d3.forceSimulation()
      .force('x', d3.forceX(0))
      .force('y', d3.forceY(0))
      .force('collide', d3.forceCollide(d => d.r * 0.75))
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
              color: chroma(color).saturate(0.75),
              x: _.random(-0.25 * largest, 0.25 * largest),
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
            netID: d.netID,
          }
        }).value()

      // position students
      const xPadding = 2.5 * largest
      const yPadding = 3 * largest
      // figure out max number given height restriction
      let perColumn = Math.floor((this.width - 1.5 * yPadding - 200) / yPadding)
      // take minimum between perColumn and square root number
      perColumn = Math.min(perColumn, Math.floor(Math.sqrt(this.students.length)))
      const perRow = Math.ceil(this.students.length / perColumn)
      const xOffset = (this.width - perRow * xPadding + 100) / 2
      const yOffset = (this.height - perColumn * yPadding + 100) / 2
      _.chain(this.students)
        .sortBy(d => d.hue)
        .each((student, i) => {
          const column = Math.floor(i / perColumn)
          const x = column * xPadding +xOffset
          let y = (i % perColumn) * yPadding + yOffset
          y += (column % 2 ? 0 : yPadding / 2) // offset by column
          Object.assign(student, {x, y})
        }).value()
    }
  },
}
</script>

<style scoped>
text {
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  /* fill: #fff; */
}
</style>
