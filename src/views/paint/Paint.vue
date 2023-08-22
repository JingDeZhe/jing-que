<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { set, get } from 'idb-keyval'
import { cloneDeep } from 'lodash-es'
import { nanoid } from 'nanoid'
// import panzoom from 'panzoom'

const canvas = ref<HTMLElement>()
const svg = ref<SVGElement>()
const imgInput = ref<HTMLInputElement>()
const sketchBox = ref<SVGGElement>()

const isEditable = ref(true)

const config = {
  tmpColor: '#FF5A3360',
  defaultColor: '#303030',
}

onMounted(() => {
  const { height } = canvas.value!.getBoundingClientRect()
  const size = height
  svg.value?.setAttribute('width', `${size}`)
  svg.value?.setAttribute('height', `${size}`)
  // panzoom(sketchBox.value!)
})

type PointInfo = { index: number; x: number; y: number }
type Specie = {
  id: string
  color: string
  points: PointInfo[]
}

const activeSpecie = ref<Specie>()

const tmpSpecie = ref<Specie>(getDefaultSpecie())
const species = ref<Specie[]>([])
function handleSelectPoint(e: MouseEvent) {
  if (isEditable.value) {
    const { left, top, height, width } = svg.value!.getBoundingClientRect()
    const { clientX, clientY } = e
    const perX = ((clientX - left) / width) * 100
    const perY = ((clientY - top) / height) * 100
    const len = tmpSpecie.value.points.length
    const info: PointInfo = { index: len, x: perX, y: perY }
    if (len < 2) {
      tmpSpecie.value.points.push(info)
    } else {
      tmpSpecie.value.points.push(info)
      const t = cloneDeep(tmpSpecie.value)
      species.value.push(t)
      activeSpecie.value = t
      tmpSpecie.value.id = nanoid()
      tmpSpecie.value.points.splice(0)
    }
  } else {
    const el = e.target as HTMLElement
    selectSpecie(el)
  }
}

function handleSelectSpecie(e: MouseEvent) {
  selectSpecie(e.target as HTMLElement)
}

function selectSpecie(el: HTMLElement) {
  const id = el.dataset.id
  const specie = species.value.find((v) => v.id === id)
  if (specie) activeSpecie.value = specie
}

function deleteActiveSpecie() {
  const index = species.value.findIndex((v) => v === activeSpecie.value)
  if (index !== -1) {
    species.value.splice(index, 1)
    activeSpecie.value = undefined
  }
}

function getPolygonPoints(specie: Specie) {
  return specie.points
    .map((v) => {
      return `${v.x},${v.y}`
    })
    .join(' ')
}

const STORE_KEY_TMP = 'species_store_tmp'
function saveTmp() {
  set(STORE_KEY_TMP, cloneDeep(species.value))
}

async function loadTmp() {
  const d = (await get<Specie[]>(STORE_KEY_TMP)) || []
  d.forEach((v) => {
    v.id = nanoid()
  })
  species.value = d
  console.log(cloneDeep(species.value))
  activeSpecie.value = undefined
}

function clear() {
  activeSpecie.value = undefined
  species.value = []
  tmpSpecie.value = getDefaultSpecie()
}

function getDefaultSpecie() {
  return { id: nanoid(), color: config.defaultColor, points: [] }
}

function handleUploadImg() {
  imgInput.value!.click()
}

const referImgSrc = ref<string>()
function uploadReferImg() {
  const file = imgInput.value?.files?.[0]
  if (!file) return
  referImgSrc.value = URL.createObjectURL(file)
}

function clearReferImg() {
  referImgSrc.value = undefined
}

//@ts-ignore
window.t = species
</script>

<template>
  <div class="species-paint">
    <div class="tools">
      <div class="mr-auto">
        <input type="checkbox" v-model="isEditable" id="is-editable" />
        <label for="is-editable">Editable</label>
      </div>
      <button class="btn" @click="handleUploadImg">Select Reference Image</button>
      <button class="btn" @click="clearReferImg">Clear Reference Image</button>
      <button class="btn" @click="saveTmp">Save Draft</button>
      <button class="btn" @click="loadTmp">Load Draft</button>
      <button class="btn" @click="clear">Clear</button>
    </div>
    <div class="canvas" ref="canvas">
      <div class="canvas-config">
        <template v-if="activeSpecie">
          <div class="mb-1rem">
            <button class="btn" style="--focus-color: #9690ad" @click="deleteActiveSpecie">
              Remove
            </button>
          </div>
          <div class="grid grid-cols-[120px_1fr] items-center">
            <span class="canvas-config_label">Color</span>
            <input type="color" v-model="activeSpecie.color" />
          </div>
        </template>
      </div>
      <div class="canvas-sketch">
        <img class="refer-img" :src="referImgSrc" v-if="referImgSrc" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          @click="handleSelectPoint"
          @contextmenu.prevent="handleSelectSpecie"
          ref="svg"
        >
          <g ref="sketchBox">
            <polygon
              v-for="v in species"
              :points="getPolygonPoints(v)"
              :fill="v.color"
              :data-id="v.id"
              :class="{ active: activeSpecie?.id === v.id }"
            />
            <circle
              v-for="v in tmpSpecie.points"
              :cx="v.x"
              :cy="v.y"
              r="1"
              :fill="config.tmpColor"
            />
          </g>
        </svg>
      </div>
    </div>

    <input type="file" accept="image/*" ref="imgInput" hidden @change="uploadReferImg" />
  </div>
</template>

<style lang="scss"></style>
