import { Lightbulb } from "lucide-react";

const GreenTips = () => {
  return (
    <section className="rounded-2xl border border-border-default bg-surface-card p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Green Tips
          </h2>
          <p className="text-sm text-text-muted">
            Daily sustainability
          </p>
        </div>
      </div>

      <div className="flex-1 rounded-xl bg-warning-bg/30 p-5 border border-warning-text/20 flex flex-col justify-center transition-colors">
        <div className="w-10 h-10 bg-warning-bg rounded-full flex items-center justify-center mb-3">
          <Lightbulb className="text-warning-text" size={20} />
        </div>

        <h3 className="font-semibold text-text-primary mb-2">
          Rinse before you recycle
        </h3>

        <p className="text-sm text-text-muted">
          Clean containers are easier to process and prevent contamination of other recyclables. A quick rinse makes a huge difference!
        </p>
      </div>
    </section>
  );
};

export default GreenTips;
