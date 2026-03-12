interface EquipmentSectionProps {
  equipment: Record<string, string[]>;
}

const groupIcons: Record<string, string> = {
  Komfort: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  Bezpečnost: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  Exteriér: "M18 20V10M12 20V4M6 20v-6",
  Interiér: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
};

function GroupIcon({ group }: { group: string }) {
  const path = groupIcons[group];
  if (!path) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}

export default function EquipmentSection({ equipment }: EquipmentSectionProps) {
  const groups = Object.entries(equipment);

  if (groups.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-bold text-text mb-4">Výbava</h2>
      <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
        {groups.map(([group, items]) => (
          <div
            key={group}
            className="bg-bg border border-border rounded-[12px] p-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-blue">
                <GroupIcon group={group} />
              </span>
              <h3 className="text-sm font-bold text-text">{group}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {items.map((item) => (
                <span
                  key={item}
                  className="px-3.5 py-1.5 bg-surface border border-border rounded-full text-[13px] text-text-muted"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
