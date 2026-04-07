export function HeroCodeSnippet() {
  return (
    <div className="rounded-2xl border border-violet-200/80 bg-slate-900/95 p-4 font-mono text-[11px] leading-relaxed text-emerald-400 shadow-lg shadow-violet-300/20 sm:text-xs md:p-5">
      <pre className="overflow-x-auto whitespace-pre text-left">
        <code>{`function createWebsite() {
  const technologies = [
    'HTML5', 'CSS3', 'JavaScript',
    'PHP', 'MySQL'
  ];
  return 'Amazing Website!';
}`}</code>
      </pre>
    </div>
  );
}
