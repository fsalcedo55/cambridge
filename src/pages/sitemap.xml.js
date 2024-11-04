const EXTERNAL_DATA_URL = "https://www.spanishforuskids.com"

function generateSiteMap(pages) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${pages
       .map((page) => {
         return `
       <url>
           <loc>${`${EXTERNAL_DATA_URL}${page}`}</loc>
       </url>
     `
       })
       .join("")}
   </urlset>
 `
}

export const getServerSideProps = async ({ res }) => {
  const pages = [
    "/",

    // Add more pages as needed
  ]

  const sitemap = generateSiteMap(pages)

  res.setHeader("Content-Type", "text/xml")
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

const SiteMap = () => {
  // getServerSideProps will do the heavy lifting
}

export default SiteMap
