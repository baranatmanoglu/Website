import { notFound } from 'next/navigation'

import PageTitle from '@/app/_components/PageTitle'
import { getCollection } from '@/lib/raindrop'
import { COLLECTIONS } from '@/lib/constants'
import { openGraphImage } from '@/app/shared-metadata'

/* export async function generateMetadata({ params }) {
  const { slug } = params
  const seoData = (await getPostSeo(slug)) ?? null
  if (!seoData) return null

  const {
    title,
    description,
    date,
    slug: postSlug,
    sys: { firstPublishedAt, publishedAt: updatedAt }
  } = seoData

  const siteUrl = `/writing/${postSlug}`
  const postDate = date || firstPublishedAt
  const publishedTime = new Date(postDate).toISOString()
  const modifiedTime = new Date(updatedAt).toISOString()

  return {
    title: `${title} — Onur Şuyalçınkaya`,
    description,
    openGraph: {
      title: `${title} — Onur Şuyalçınkaya`,
      description,
      images: [
        {
          ...openGraphImage,
          url: getOgImageUrl({ title }),
          alt: title
        }
      ],
      type: 'article',
      publishedTime,
      ...(updatedAt && {
        modifiedTime
      }),
      url: siteUrl
    },
    alternates: {
      canonical: siteUrl
    }
  }
} */

export const revalidate = 60 * 60 * 24 * 7 // 1 week

async function fetchData(id) {
  const collection = await getCollection(id)
  if (!collection?.items?.length) notFound()

  return {
    collection
  }
}

export default async function CollectionPage({ params }) {
  const { id } = params
  const collectionName = COLLECTIONS.find((collection) => collection.id === Number(id))?.name ?? '' // id param is string
  const { collection } = await fetchData(id)

  const chunk1of2 = []
  const chunk2of2 = []
  collection.items.forEach((element, index) => {
    if (index % 2 === 0) {
      chunk1of2.push(element)
    } else {
      chunk2of2.push(element)
    }
  })
  const chunks = [[...chunk1of2], [...chunk2of2]]
  console.log('chunk2of2', chunk2of2)

  /* const chunk1of3 = array.filter((_, index) => index % 3 === 0)
  const chunk2of3 = array.filter((_, index) => index % 3 === 1)
  const chunk3of3 = array.filter((_, index) => index % 3 === 2) */

  return (
    <div className="content-wrapper">
      <div className="content @container">
        <PageTitle title={collectionName} />
        <div className="grid gap-4 @2xl:grid-cols-2 @4xl:grid-cols-3">
          {chunks.map((chunk, chunkIndex) => {
            return (
              <div key={`chunk_${chunkIndex}`} className="space-y-4">
                {chunk.map((bookmark) => {
                  return (
                    <a
                      key={bookmark._id}
                      className="flex min-w-0 cursor-pointer flex-col gap-4 rounded-lg border border-gray-200 p-4 shadow-sm transition-colors duration-200 hover:border-gray-300 hover:bg-gray-100"
                      href={bookmark.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {bookmark.cover && (
                        <object
                          data={bookmark.cover}
                          name={bookmark.title}
                          width={300}
                          height={180}
                          type="image/png"
                          className="h-auto min-h-[180px] w-full overflow-hidden rounded-md border object-cover"
                        >
                          <img
                            src="/assets/fallback.webp"
                            alt={bookmark.title}
                            width={300}
                            height={240}
                            loading="lazy"
                            className="w-full rounded-none"
                          />
                        </object>
                      )}
                      <div className="flex flex-col gap-1">
                        <h3>{bookmark.title}</h3>
                        <span className="line-clamp-6 text-sm">{bookmark.excerpt}</span>
                      </div>
                    </a>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
