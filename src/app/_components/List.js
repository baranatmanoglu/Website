'use client'

import Link from 'next/link'
import useSWR from 'swr'

import cx from '@/lib/cx'
import { fetcher } from '@/lib/utils'

const dateWithDayAndMonthFormatter = Intl.DateTimeFormat('tr-TR', {
  day: '2-digit',
  month: '2-digit'
})

const dateWithMonthAndYearFormatter = Intl.DateTimeFormat('en-US', {
  month: '2-digit',
  year: 'numeric'
})

export const List = ({ items }) => {
  const { data, error } = useSWR('/api/getViews', fetcher, {
    keepPreviousData: true
    // refreshInterval: 1000 * 60 // 1 minute
  })

  const itemsEntriesByYear = items.reduce((acc, item) => {
    const year = new Date(item.date).getFullYear()

    const yearArr = acc.find((item) => item[0] === year)
    if (!yearArr) {
      acc.push([year, [item]])
    } else {
      yearArr[1].push(item)
    }

    return acc
  }, [])

  return (
    <div className="text-sm">
      <header className="grid grid-cols-6 py-4 text-gray-500">
        <span className="col-span-1 hidden text-left md:grid">Year</span>
        <span className="col-span-6 md:col-span-5">
          <span className="grid grid-cols-4 items-center md:grid-cols-8">
            <span className="col-span-1 text-left">Date</span>
            <span className="col-span-2 md:col-span-6">Title</span>
            <span className="col-span-1 text-right">Views</span>
          </span>
        </span>
      </header>

      <div className="group">
        {itemsEntriesByYear.map((customItems) => {
          const [year, itemsArr] = customItems

          return (
            <ul className="list-none" key={year}>
              {itemsArr.map((item, itemIndex) => {
                const { title, slug, date } = item

                const dateObj = new Date(date)
                const dateWithDayAndMonth = dateWithDayAndMonthFormatter.format(dateObj)
                const dateWithMonthAndYear = dateWithMonthAndYearFormatter.format(dateObj)

                const views = data?.find((item) => item.slug === slug)?.view_count || 0
                const formattedViews = new Intl.NumberFormat('en-US').format(views)

                return (
                  <li key={slug} className="grid grid-cols-6 p-0 group-hover:text-gray-300">
                    <span
                      className={cx(
                        'pointer-events-none col-span-1 hidden items-center text-gray-500 md:grid',
                        itemIndex === 0 && 'border-t border-gray-200'
                      )}
                    >
                      {itemIndex === 0 ? year : ''}
                    </span>
                    <Link href={`/writing/${slug}`} className="col-span-6 hover:text-black md:col-span-5">
                      <span className="grid grid-cols-4 items-center gap-2 border-t border-gray-200 py-4 md:grid-cols-8">
                        <span className="col-span-1 text-left">
                          <time dateTime={date} className="hidden md:block">
                            {dateWithDayAndMonth}
                          </time>
                          <time dateTime={date} className="md:hidden">
                            {dateWithMonthAndYear}
                          </time>
                        </span>
                        <span className="col-span-2 line-clamp-4 md:col-span-6">{title}</span>
                        <span className="col-span-1 text-right">{!error && data ? formattedViews : null}</span>
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )
        })}
      </div>
    </div>
  )
}
