interface DefectsBoxProps {
  defects: string[];
}

export default function DefectsBox({ defects }: DefectsBoxProps) {
  if (defects.length === 0) return null;

  return (
    <section className="bg-bg border border-border rounded-[20px] p-6">
      <h2 className="text-lg font-bold text-text mb-3 flex items-center gap-2">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#d97706"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        Co není dokonalé
      </h2>
      <ul className="space-y-2">
        {defects.map((defect, index) => (
          <li key={index} className="flex items-start gap-3 text-sm text-text-muted">
            <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-amber-400" />
            {defect}
          </li>
        ))}
      </ul>
    </section>
  );
}
