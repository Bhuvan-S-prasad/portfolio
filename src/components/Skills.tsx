import { useDeferredValue, useMemo, useState } from "react"
import { skills } from "../content/skills"
import { searchSkills, usageFor } from "../content/skillSpace"
import { useMediaQuery } from "../lib/motion"
import AnimatedHeader from "./UI/AnimatedHeader"
import SkillSearch from "./skills/SkillSearch"
import SkillSpace from "./skills/SkillSpace"
import SkillGrid from "./skills/SkillGrid"

const TOTAL = skills.reduce((n, g) => n + g.items.length, 0)

/**
 * Skills as a capability space: a hand-placed map of clusters you can query.
 * Search is keyword + curated aliases — no model. Hovering a skill shows
 * where it has been used. Phones and tablets get a grouped list instead.
 */
const Skills = () => {
    const [query, setQuery] = useState("")
    const [focus, setFocus] = useState<string | null>(null)
    const deferred = useDeferredValue(query)
    const matches = useMemo(() => searchSkills(deferred), [deferred])
    const querying = deferred.trim().length >= 2
    const wide = useMediaQuery("(min-width: 1024px)")

    // What the info strip describes: the hovered skill, else the best match.
    const subject = focus ?? (querying ? [...matches.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null : null)
    const subjectGroup = subject ? skills.find((g) => g.items.includes(subject))?.category : null
    const usage = subject ? usageFor(subject) : []

    return (
        <section id="skills" className="relative overflow-hidden rounded-t-4xl bg-neutral-950 pb-20 sm:pb-28 md:pb-36">
            <AnimatedHeader
                title="Skills"
                subTitle="What I work with"
                text={"The languages, frameworks and platforms\nI use to take an idea from a notebook\nto a working tool."}
                textColor="text-white"
                withScrollTrigger={true}
            />

            <div className="px-6 pt-6 sm:px-10 sm:pt-10">
                <SkillSearch
                    query={query}
                    onQuery={setQuery}
                    matchCount={matches.size}
                    total={TOTAL}
                    clusters={skills.length}
                />

                {wide ? (
                    <div className="pt-8">
                        <SkillSpace matches={matches} querying={querying} focus={focus} onFocus={setFocus} />

                        {/* Info strip */}
                        <div className="mt-6 flex min-h-12 flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-white/10 pt-5 font-mono text-[11px] uppercase tracking-[0.14em]">
                            {subject ? (
                                <>
                                    <span className="text-white">
                                        <span className="mr-2 text-gold">›</span>{subject}
                                    </span>
                                    <span className="text-white/35">{subjectGroup}</span>
                                    <span className="text-white/35">
                                        {usage.length ? "used in" : "core skill"}
                                        {usage.length > 0 && <span className="ml-3 normal-case tracking-normal text-white/75 font-sans text-sm">{usage.join(" · ")}</span>}
                                    </span>
                                </>
                            ) : (
                                <span className="text-white/35">hover a skill to see where it's used · dashed arcs link related skills across clusters</span>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="pt-4">
                        <SkillGrid matches={matches} querying={querying} />
                    </div>
                )}

                <p className="mt-10 font-mono text-[10px] leading-relaxed tracking-[0.04em] text-white/30">
                    Keyword search over a hand-curated map — no model involved. Positions are placed by hand, not learned.
                </p>
            </div>
        </section>
    )
}

export default Skills
