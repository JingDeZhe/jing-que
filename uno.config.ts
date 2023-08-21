import { defineConfig } from 'unocss'
import presetUno from '@unocss/preset-uno'

import transformerVariantGroup from '@unocss/transformer-variant-group'
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
  presets: [presetUno()],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  safelist: 'grid-cols-1 grid-cols-2 grid-cols-3 grid-cols-4'.split(' '),
  theme: {
    fontFamily: {
      pixel: 'pixel',
      wenkai: '霞鹜文楷等宽',
    },
  },
})
