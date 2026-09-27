import { suggestions } from "../../content/skillSpace"

interface SkillSearchProps {
    query: string
    onQuery: (q: string) => void
    matchCount: number
    total: number
    clusters: number
}

/** "Query the skill space": free text plus a few suggested queries. */
const SkillSearch = ({ query, onQuery, matchCount, total, clusters }: SkillSearchProps) => {
    const querying = query.trim().length >= 2

    return (
        <div className="flex flex-col gap-4 border-y border-white/10 py-5 lg:flex-row lg:items-center lg:gap-8">
            <label className="flex min-w-0 flex-1 items-center gap-3 font-mono text-sm">
                <span className="text-gold" aria-hidden>›</span>
                <span className="sr-only">Search skills</span>
                <input
                    type="search"
                    value={query}
                    onChange={(e) => onQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Escape") onQuery("") }}
                    placeholder="query the skill space — try “agents”"
                    spellCheck={false}
                    autoComplete="off"
                    data-cursor="type"
                    className="w-full min-w-0 bg-transparent text-white outline-none placeholder:text-white/30 [&::-webkit-search-cancel-button]:hidden"
                />
            </label>

            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Suggested queries">
                {suggestions.map((s) => {
                    const on = query.trim().toLowerCase() === s
                    return (
                        <button
                            key={s}
                            type="button"
                            onClick={() => onQuery(on ? "" : s)}
                            aria-pressed={on}
                            data-cursor="query"
                            className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors duration-300
                                ${on ? "border-gold bg-gold text-ink" : "border-white/15 text-white/55 hover:border-gold/60 hover:text-white"}`}
                        >
                            {s}
                        </button>
                    )
                })}
            </div>

            <p className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-white/40" aria-live="polite">
                {querying
                    ? matchCount
                        ? <><span className="text-gold">{matchCount}</span> match{matchCount > 1 ? "es" : ""}</>
                        : "no matches"
                    : `${total} skills · ${clusters} clusters`}
            </p>
        </div>
    )
}

export default SkillSearch
