// Decorative developer terminal for the hero. It is NOT functional.
const LINES = [
  { mark: "$", text: "join-codechef", tone: "text-ink-100" },
  { mark: ">", text: "build()", tone: "text-ink-300" },
  { mark: ">", text: "compete()", tone: "text-ink-300" },
  { mark: ">", text: "learn()", tone: "text-ink-300" },
  { mark: ">", text: "create()", tone: "text-ink-300" },
];

export default function Terminal() {
  return (
    <div aria-hidden="true" className="relative">
      <div className="absolute -inset-6 rounded-full bg-ember-500/10 blur-3xl" />

      <div className="relative overflow-hidden rounded-2xl border border-ink-600 bg-ink-900/90 shadow-2xl shadow-black/50">
        <div className="flex items-center gap-2 border-b border-ink-700 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-ink-600" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-600" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-600" />
          <span className="ml-3 font-mono text-xs text-ink-500">codechef-abesec ~ zsh</span>
        </div>

        <div className="space-y-2 p-5 font-mono text-sm sm:text-base">
          {LINES.map((line, index) => (
            <p key={line.text} className="term-line" style={{ animationDelay: `${400 + index * 380}ms` }}>
              <span className="text-ember-400">{line.mark}</span> <span className={line.tone}>{line.text}</span>
            </p>
          ))}
          <p className="term-line pt-2" style={{ animationDelay: `${400 + LINES.length * 380 + 200}ms` }}>
            <span className="text-emerald-400">&#10003;</span> <span className="text-ink-100">community initialized</span>
            <span className="cursor-blink ml-1.5 inline-block h-4 w-2 translate-y-0.5 bg-ember-500" />
          </p>
        </div>
      </div>

      <div className="relative -mt-4 ml-auto hidden w-[88%] overflow-hidden rounded-xl border border-ink-700 bg-ink-800/90 p-4 font-mono text-xs leading-relaxed text-ink-300 shadow-xl shadow-black/40 sm:block">
        <p>
          <span className="text-ember-300">function</span> <span className="text-ink-100">solve</span>(problem) {"{"}
        </p>
        <p className="pl-4">
          <span className="text-ember-300">return</span> think() + code() + iterate();
        </p>
        <p>{"}"}</p>
      </div>
    </div>
  );
}
