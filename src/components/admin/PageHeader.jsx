export default function PageHeader({ title, description, actions }) {
  return (
    <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-3xl font-extrabold text-ink-100 sm:text-4xl">{title}</h1>
        {description && <p className="mt-1.5 max-w-xl text-ink-300">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </header>
  );
}
