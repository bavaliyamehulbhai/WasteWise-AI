import { Sparkles } from "lucide-react";

function AIExplanation({ explanation }) {
  return (
    <section className="rounded-[20px] border border-border-default bg-surface-card p-5">

      <div className="flex items-center gap-2">
        <Sparkles
          size={18}
          className="text-brand"
        />

        <h2 className="text-sm font-semibold text-text-primary">
          Why this result?
        </h2>
      </div>

      <p className="mt-4 text-sm leading-6 text-text-muted">
        {explanation}
      </p>

      <div className="mt-4 rounded-xl bg-success-bg px-4 py-3">
        <p className="text-xs font-medium leading-5 text-success-text">
          AI-assisted recommendation. Always follow local waste
          disposal rules when they differ.
        </p>
      </div>

    </section>
  );
}

export default AIExplanation;
