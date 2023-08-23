<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import bird from './test-data/bird'
import xian from './test-data/xian'
import anime from 'animejs/lib/anime.es.js'
import { cloneDeep, random } from 'lodash-es'

const steps: { name: string; species: Specie[] }[] = [
  { name: '鹊', species: bird },
  { name: '桥仙', species: xian },
]

type PointInfo = { index: number; x: number; y: number }
type Specie = {
  id: string
  color: string
  points: PointInfo[]
}

const pointCnt = Math.max(bird.length, xian.length)

steps.forEach((v) => {
  v.species = v.species.concat(
    new Array(pointCnt - v.species.length).fill(null).map(() => {
      const idx = random(v.species.length - 1)
      return cloneDeep(v.species[idx])
    })
  )
})

const firstStep = steps[0]

const size = ref(600)
const polygons = ref<SVGPolygonElement[]>([])

function getPolygonPoints(specie: Specie) {
  if (!specie) return '50,50'
  return specie.points
    .map((v) => {
      return `${v.x},${v.y}`
    })
    .join(' ')
}

onMounted(() => {
  const { clientWidth, clientHeight } = document.documentElement
  const minSize = Math.min(clientWidth, clientHeight)
  if (size.value > minSize - 20) size.value = minSize - 20
  polygons.value.forEach((el, idx) => {
    anime({
      targets: el,
      points: { value: getPolygonPoints(xian[idx]) },
      fill: xian[idx].color,
      easing: 'easeInOutCubic',
      duration: 1000,
      loop: true,
      delay: 1000,
      endDelay: 1000,
      direction: 'alternate',
    })
  })
})
</script>

<template>
  <div class="species-viewer">
    <div class="title text-3xl">
      <span class="text-[#8076a3] text-5xl">鹊</span>
      <span class="text-red-700">桥仙</span>
    </div>
    <svg :width="size" :height="size" viewBox="0 0 100 100">
      <polygon
        v-for="v in firstStep.species"
        :points="getPolygonPoints(v)"
        :fill="v.color"
        :data-id="v.id"
        ref="polygons"
      />
    </svg>
  </div>
</template>

<style lang="scss">
.title {
  --at-apply: font-serif;
}
</style>
