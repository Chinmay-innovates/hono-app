import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { CircleX } from 'lucide-react'

import type { AppType } from '@server/index'
import { hc } from 'hono/client'

const client = hc<AppType>('/')

export const Route = createFileRoute('/todos')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const res = await client.api.todos.$get()
      if (!res.ok) {
        throw new Error('Network res was not ok')
      }
      return res.json()
    },
  })

  const Loading = () => {
    return Array.from({ length: 5 }).map((_, i) => (
      <div className="flex items-center gap-2" key={i}>
        <div className="skeleton size-6 rounded-full" />
        <div className="skeleton h-4 w-32" />
      </div>
    ))
  }

  const ErrorAlert = () => {
    return (
      <div className="alert alert-error" role="alert">
        <CircleX />
        <span>{error?.message}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center p-10">
      {isError && <ErrorAlert />}
      <div className="space-y-3 p-6">
        {isLoading && Array.from({ length: 2 }).map(() => <Loading />)}
        {data &&
          data.map((todo) => (
            <div className="flex items-center gap-2">
              <input type="checkbox" className="checkbox checkbox-primary" />
              <span>{todo.title}</span>
            </div>
          ))}
      </div>
    </div>
  )
}
