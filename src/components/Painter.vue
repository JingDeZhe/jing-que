<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { Picture, Comic, Piece, Point } from './lib/type'
import chroma from 'chroma-js'
import { nanoid } from 'nanoid'
import { cloneDeep } from 'lodash-es'
import { vOnClickOutside } from '@vueuse/components'

const props = defineProps<{
  comic?: Comic
}>()

const scaleN = 300
const viewBox = `0 0 ${scaleN} ${scaleN}`

const canvasCfg = ref({
  fill: '#fff',
  tmpPointColor: '#E06C75',
  pieceColor: '#282C34',
})
const drawBg = computed(() => chroma(canvasCfg.value.fill).darken(0.1).hex())

const paper = ref<SVGElement>()
const picture = ref<Picture>([])
const activePiece = ref<Piece>()
const tmpSpecie = ref<Piece>(getDefaultSpecie())
const isEditable = ref(true)
const polygonN = ref(3)

function handleSelectPoint(e: MouseEvent) {
  if (isEditable.value) {
    const { left, top, height, width } = paper.value!.getBoundingClientRect()
    const { clientX, clientY } = e
    const perX = ((clientX - left) / width) * scaleN
    const perY = ((clientY - top) / height) * scaleN
    const len = tmpSpecie.value.points.length
    const info: Point = { x: perX, y: perY }
    if (len < polygonN.value - 1) {
      tmpSpecie.value.points.push(info)
    } else {
      tmpSpecie.value.points.push(info)
      const t = cloneDeep(tmpSpecie.value)
      picture.value.push(t)
      activePiece.value = t
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
  const specie = picture.value.find((v) => v.id === id)
  if (specie) activePiece.value = specie
}

function deleteActiveSpecie() {
  const index = picture.value.findIndex((v) => v === activePiece.value)
  if (index !== -1) {
    picture.value.splice(index, 1)
    activePiece.value = undefined
  }
}

function getPolygonPoints(specie: Piece) {
  return specie.points
    .map((v) => {
      return `${v.x},${v.y}`
    })
    .join(' ')
}

function clear() {
  activePiece.value = undefined
  picture.value = []
  tmpSpecie.value = getDefaultSpecie()
}

function getDefaultSpecie() {
  return { id: nanoid(), color: canvasCfg.value.pieceColor, points: [] }
}

const imgInput = ref<HTMLInputElement>()
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
</script>

<template>
  <div class="jq-painter">
    <div class="jq-painter_list"></div>
    <div class="jq-painter_draw" :style="{ backgroundColor: drawBg }">
      <div class="jq-painter_tools">
        <v-btn size="small" flat>
          <v-icon icon="mdi-key"></v-icon>
        </v-btn>
      </div>
      <div
        class="jq-painter_canvas"
        :style="{ backgroundColor: canvasCfg.fill }"
        v-on-click-outside="() => (activePiece = undefined)"
      >
        <div class="jq-painter_paper">
          <svg
            :viewBox="viewBox"
            @click="handleSelectPoint"
            @contextmenu.prevent="handleSelectSpecie"
            ref="paper"
          >
            <g>
              <polygon
                v-for="v in picture"
                :points="getPolygonPoints(v)"
                :fill="v.color"
                :data-id="v.id"
                :class="{ active: activePiece?.id === v.id }"
              />
              <circle
                v-for="v in tmpSpecie.points"
                :cx="v.x"
                :cy="v.y"
                r="1"
                :fill="canvasCfg.tmpPointColor"
              />
            </g>
          </svg>
        </div>
        <div class="jq-painter_props">
          <v-menu :close-on-content-click="false">
            <template #activator="{ props }">
              <div class="flex items-center gap-2">
                <v-icon icon="mdi-artboard"></v-icon>
                <div
                  class="h-[2rem] rounded flex-1"
                  :style="{ backgroundColor: canvasCfg.fill }"
                  v-bind="props"
                ></div>
              </div>
            </template>
            <div class="p-1">
              <v-color-picker v-model="canvasCfg.fill" hideInputs></v-color-picker>
            </div>
          </v-menu>
          <template v-if="activePiece">
            <v-menu :close-on-content-click="false">
              <template #activator="{ props }">
                <div class="flex items-center gap-2">
                  <v-icon icon="mdi-triangle-outline"></v-icon>
                  <div
                    class="h-[2rem] rounded flex-1"
                    :style="{ backgroundColor: activePiece.color }"
                    v-bind="props"
                  ></div>
                </div>
              </template>
              <div class="p-1">
                <v-color-picker v-model="activePiece.color" hideInputs></v-color-picker>
              </div>
            </v-menu>
          </template>
        </div>
      </div>
    </div>

    <input type="file" accept="image/*" hidden ref="imgInput" />
  </div>
</template>

<style lang="scss">
.jq-painter {
  --at-apply: flex items-stretch overflow-hidden;
  &_list {
    --at-apply: w-[250px] bg-gray-800;
  }
  &_draw {
    --at-apply: flex-1 overflow-hidden flex flex-col items-center justify-center bg-gray-200;
  }
  &_canvas {
    --at-apply: flex shadow;
  }
  &_paper {
    > svg {
      --at-apply: h-[80vmin] w-[80vmin];
    }
    polygon {
      &.active {
        stroke: rgb(69, 178, 251);
        stroke-width: 1;
      }
    }
  }
  &_tools {
    --at-apply: rounded mb-4;
  }
  &_props {
    --at-apply: w-[200px] p-2 bg-gray-800 text-white flex flex-col gap-2;
  }
}
</style>
