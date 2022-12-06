import { Suspense } from 'react'

import Card from '@/components/Card'
import Markdown from '@/components/Markdown'
import PageTitle from '@/components/PageTitle'
import PageSeo from '@/components/PageSeo'
import { getAllLogbook, getPageSeo } from '@/lib/contentful'

const Journey = ({ allLogbook, pageSeo: { title = 'Journey', ...rest } }) => {
  return (
    <>
      <PageSeo title={title} {...rest} />
      <div className="content">
        <PageTitle title={title} />
        <Suspense fallback={null}>
          <div className="flex flex-col gap-y-12 items-stretch">
            {allLogbook.map((item, itemIndex) => (
              <div key={`data_${itemIndex}`} className="flex flex-col gap-y-6">
                <div className="flex items-center">
                  <h2>{item.year}</h2>
                  <hr className="border-dashed border-gray-200 flex-1 ml-4 my-0" />
                </div>
                <section>
                  {item.logs.map((log, logIndex) => (
                    <div key={`data_${itemIndex}_log_${logIndex}`} className="flex relative pb-8 last:pb-0">
                      {logIndex !== item.logs.length - 1 && (
                        <div className="w-10 absolute inset-x-0 inset-y-2.5 mt-10 flex items-center justify-center">
                          <div className="border-l-2 border-gray-200 h-full w-px pointer-events-none"></div>
                        </div>
                      )}
                      <div className="flex items-center justify-center align-middle flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full z-0">
                        <span role="img" aria-label={log.title}>
                          {log.emoji}
                        </span>
                      </div>
                      <div className="flex-grow pl-4">
                        <Card title={log.title} subtitle={<Markdown>{log.description}</Markdown>} />
                      </div>
                    </div>
                  ))}
                </section>
              </div>
            ))}
          </div>
        </Suspense>
      </div>
    </>
  )
}

export async function getStaticProps({ preview = false }) {
  const [allLogbook, pageSeo] = await Promise.all([getAllLogbook(preview), getPageSeo('journey', preview)])

  const mappedLogbook = []
  allLogbook.map((log) => {
    const year = new Date(log.date).getFullYear()
    const existingYear = mappedLogbook.find((item) => item?.year === year)

    if (!existingYear) {
      mappedLogbook.push({
        year,
        logs: [log]
      })
    } else {
      existingYear.logs.push(log)
    }
  })

  return {
    props: { allLogbook: mappedLogbook, pageSeo, headerTitle: pageSeo?.title || 'Journey' }
  }
}

export default Journey
