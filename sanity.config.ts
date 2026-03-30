import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { schemaTypes } from './sanity/schemas'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!

export default defineConfig({
  name: 'woranz',
  title: 'Woranz CMS',

  projectId,
  dataset,

  basePath: '/studio',

  plugins: [
    structureTool(),
    presentationTool({
      previewUrl: '/api/draft-mode/enable?redirect=/',
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
