import { useState } from "react";
import { DemoFrame, Tag } from "./kit";
import { usePhases } from "./usePhases";

type Line = { agent: string; tool: string; args: string; result: string };

const REQUEST = "Move tomorrow's 3 pm sync to Friday and let the team know.";

const PLAN: Line[] = [
    { agent: "planner", tool: "plan", args: "find sync → check Friday → notify team", result: "3 steps" },
    { agent: "memory", tool: "recall", args: "\"weekly sync\"", result: "2 episodes" },
    { agent: "calendar", tool: "search", args: "tomorrow 15:00", result: "1 event" },
    { agent: "calendar", tool: "free_slots", args: "Friday", result: "11:00 · 15:00" },
    { agent: "mail", tool: "draft", args: "\"Sync moves to Fri 15:00\"", result: "ready" },
];

const APPROVAL: Line = { agent: "human", tool: "approve", args: "calendar.update + mail.send", result: "" };

const OUTCOMES = {
    approved: {
        lines: [
            { agent: "calendar", tool: "update", args: "Fri 15:00", result: "ok" },
            { agent: "mail", tool: "send", args: "to: team", result: "sent" },
        ],
        reply: "Done — the sync is on Friday at 15:00 and the team has been emailed.",
    },
    rejected: {
        lines: [
            { agent: "planner", tool: "abort", args: "discard draft", result: "nothing sent" },
            { agent: "memory", tool: "store", args: "\"confirm before moving syncs\"", result: "saved" },
        ],
        reply: "Okay — nothing changed. I'll check with you before moving it again.",
    },
};

// 0 wait · 1 request · 2–6 plan lines · 7 approval (holds) · 8–9 actions · 10 reply
const DURATIONS = [600, 700, 900, 900, 900, 900, 1000, -1, 800, 800, 500];
const APPROVAL_PHASE = 7;

/** Auto-Mate: an agent trace replay where the visitor is the human in the loop. */
const AgentDemo = () => {
    const { phase, done, advance, replay } = usePhases(DURATIONS);
    const [decision, setDecision] = useState<"approved" | "rejected">("approved");

    const decide = (d: "approved" | "rejected") => {
        setDecision(d);
        advance();
    };

    const lines = [...PLAN, APPROVAL, ...OUTCOMES[decision].lines];
    const waiting = phase === APPROVAL_PHASE;

    return (
        <DemoFrame
            title="auto-mate · agent trace"
            status={done ? "complete" : waiting ? "awaiting approval" : "running"}
            busy={!done && !waiting}
            onReplay={replay}
        >
            <div className="flex h-full flex-col gap-4">
                {/* Incoming request */}
                <div className={`self-end max-w-[85%] transition-all duration-500 ${phase >= 1 ? "opacity-100" : "translate-y-2 opacity-0"}`}>
                    <p className="mb-1.5 text-right font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">you · via telegram</p>
                    <p className="rounded-2xl rounded-br-sm bg-white/10 px-4 py-2.5 text-sm font-light text-white/85">{REQUEST}</p>
                </div>

                {/* Trace */}
                <ol className="flex flex-col gap-1 font-mono text-[11px] leading-6">
                    {lines.map((line, i) => {
                        const visible = i < phase - 1;
                        const running = i === phase - 2 && i !== PLAN.length;
                        const isApproval = i === PLAN.length;
                        if (!visible) return null;
                        return (
                            <li key={`${decision}-${i}`} className="grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-3 animate-[fadeIn_0.35s_ease-out_both]">
                                <span className={isApproval ? "text-ember" : "text-white/35"}>{line.agent}</span>
                                <span className="truncate text-white/75">
                                    <span className="text-gold">{line.tool}</span>
                                    <span className="text-white/40">(</span>{line.args}<span className="text-white/40">)</span>
                                </span>
                                <span className="text-right text-white/45">
                                    {isApproval
                                        ? waiting
                                            ? <span className="animate-pulse text-ember">pending</span>
                                            : <Tag tone={decision === "approved" ? "gold" : "muted"}>{decision}</Tag>
                                        : running ? <span className="animate-pulse text-gold">···</span> : line.result}
                                </span>
                            </li>
                        );
                    })}
                </ol>

                {/* Human in the loop */}
                {waiting && (
                    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-ember/40 bg-ember/10 px-4 py-3 animate-[fadeIn_0.4s_ease-out_both]">
                        <p className="mr-auto text-sm font-light text-white/80">Approve these actions? <span className="text-white/45">You're the human in the loop.</span></p>
                        <button
                            type="button"
                            onClick={() => decide("rejected")}
                            data-cursor="reject"
                            className="rounded-full border border-white/20 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white/70 transition-colors hover:border-white/50 hover:text-white"
                        >
                            Reject
                        </button>
                        <button
                            type="button"
                            onClick={() => decide("approved")}
                            data-cursor="approve"
                            className="rounded-full bg-gold px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink transition-opacity hover:opacity-85"
                        >
                            Approve
                        </button>
                    </div>
                )}

                {/* Reply */}
                {phase >= 10 && (
                    <div className="max-w-[85%] animate-[fadeIn_0.5s_ease-out_both]">
                        <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">auto-mate</p>
                        <p className="rounded-2xl rounded-bl-sm border border-gold/30 bg-gold/10 px-4 py-2.5 text-sm font-light text-white/85">
                            {OUTCOMES[decision].reply}
                        </p>
                    </div>
                )}
            </div>
        </DemoFrame>
    );
};

export default AgentDemo;
