import { useEffect, useRef, useCallback } from 'react'

interface UseInfiniteScrollOptions {
  rootMargin?: string
  threshold?: number | number[]
}

export function useInfiniteScroll(
  onIntersect: () => void,
  hasMore: boolean,
  isLoading: boolean,
  options: UseInfiniteScrollOptions = {}
): (node: HTMLElement | null) => void {
  const observerRef = useRef<IntersectionObserver | null>(null)

  const sentinelRef = useCallback(
    (node: HTMLElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      if (!hasMore) return

      if (node) {
        observerRef.current = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting && !isLoading && hasMore) {
              onIntersect()
            }
          },
          {
            rootMargin: options.rootMargin ?? '0px 0px 200px 0px',
            threshold: options.threshold ?? 0.1,
          }
        )

        observerRef.current.observe(node)
      }
    },
    [onIntersect, hasMore, isLoading, options]
  )

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return sentinelRef
}
