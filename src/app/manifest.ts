import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AsynQ",
    short_name: "AsynQ",
    start_url: ".",
    display: "standalone",
    scope: "/",
    description: "AsynQ is a Content Creation AI Tool specialized in Writing. Type your full prompt and get a multi-option post content. Choose and edit your preferred option and save it for later.",

    icons: [
      {
        purpose: "maskable",
        sizes: "48x48",
        src: "icons/maskable_icon_x48.png",
        type: "image/png"
      },
      {
        purpose: "maskable",
        sizes: "72x72",
        src: "icons/maskable_icon_x72.png",
        type: "image/png"
      },
      {
        purpose: "maskable",
        sizes: "96x96",
        src: "icons/maskable_icon_x96.png",
        type: "image/png"
      },
      {
        purpose: "maskable",
        sizes: "128x128",
        src: "icons/maskable_icon_x128.png",
        type: "image/png"
      },
      {
        purpose: "maskable",
        sizes: "384x384",
        src: "icons/maskable_icon_x384.png",
        type: "image/png"
      }
    ]
  }
}
