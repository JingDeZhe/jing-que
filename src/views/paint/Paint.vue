<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const canvas = ref<HTMLElement>()
const svg = ref<SVGElement>()

onMounted(() => {
  const { height, width } = canvas.value!.getBoundingClientRect()
  const size = Math.min(width, height) - 10
  svg.value?.setAttribute('width', `${size}`)
  svg.value?.setAttribute('height', `${size}`)
})

type PointInfo = { index: number; x: number; y: number }
let tmpPointGroup = ref<PointInfo[]>([])
const pointGroups = ref<PointInfo[][]>([])
function handleSelectPoint(e: MouseEvent) {
  const { left, top, height, width } = svg.value!.getBoundingClientRect()
  const { clientX, clientY } = e
  const perX = ((clientX - left) / width) * 100
  const perY = ((clientY - top) / height) * 100
  const len = tmpPointGroup.value.length
  const info: PointInfo = { index: len, x: perX, y: perY }
  if (len < 2) {
    tmpPointGroup.value.push(info)
  } else {
    tmpPointGroup.value.push(info)
    pointGroups.value.push([...tmpPointGroup.value])
    tmpPointGroup.value.splice(0)
  }
}

function getPolygonPoints(points: PointInfo[]) {
  return points
    .map((v) => {
      return `${v.x},${v.y}`
    })
    .join(' ')
}
//@ts-ignore
window.t = pointGroups
</script>

<template>
  <div class="species-paint">
    <div class="tools"></div>
    <div class="canvas" ref="canvas">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        @click="handleSelectPoint"
        ref="svg"
      >
        <polygon fill="#30303060" v-for="v in pointGroups" :points="getPolygonPoints(v)"></polygon>
        <circle v-for="v in tmpPointGroup" :cx="v.x" :cy="v.y" r="1" fill="#E5B45660" />
      </svg>
    </div>
  </div>
</template>

<style lang="scss"></style>
