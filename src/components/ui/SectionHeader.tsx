interface SectionHeaderProps {
  title: string
  subtitle?: string
  className?: string
}

export default function SectionHeader({
  title,
  subtitle,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`mb-4 ${className}`}>
      <h2 className="text-lg font-semibold text-text">{title}</h2>
      {subtitle && (
        <p className="text-sm text-text-dim mt-0.5">{subtitle}</p>
      )}
    </div>
  )
}
