import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

type Props = {
  code: string
  isDark: boolean
}

let nextId = 0

export function MermaidDiagram({ code, isDark }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!code || !containerRef.current) return
    let isMounted = true
    const id = `mermaid-${nextId++}`

    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
    })

    mermaid
      .render(id, code)
      .then(({ svg }) => {
        if (isMounted && containerRef.current) {
          containerRef.current.innerHTML = svg
        }
      })
      .catch((err) => {
        if (isMounted && containerRef.current) {
          containerRef.current.innerHTML =
            `<pre class="text-sm text-red-600 whitespace-pre-wrap">No se pudo generar el diagrama: ${String(
              err?.message ?? err,
            )}</pre>`
        }
      })

    return () => {
      isMounted = false
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [code, isDark])

  return <div ref={containerRef} className="overflow-auto" />
}
