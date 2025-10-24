export function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
      <h3 style={{ margin: 0 }}>{title}</h3>
      {subtitle ? <p style={{ marginTop: 8 }}>{subtitle}</p> : null}
    </div>
  )
}

