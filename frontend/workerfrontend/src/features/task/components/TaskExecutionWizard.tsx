import { useEffect, useMemo, useRef, useState } from "react";

type ExecutionPhase = "ready" | "running" | "paused" | "confirm" | "finished";

type TaskExecutionWizardProps = {
  taskTitle: string;
  onBack?: () => void;
  onFinish?: () => void;
  onComplete?: () => Promise<void>;
};

const STEP_LABELS = ["Aloita työ", "Työ käynnissä", "Lopeta työ"];

export default function TaskExecutionWizard({ taskTitle, onBack, onFinish, onComplete }: TaskExecutionWizardProps) {
  const [phase, setPhase] = useState<ExecutionPhase>("ready");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<number | null>(null);
  const [finishError, setFinishError] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    if (phase === "running") {
      timerRef.current = window.setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [phase]);

  useEffect(() => {
    if (phase === "finished" && onFinish) {
      onFinish();
    }
  }, [phase, onFinish]);

  const handleComplete = async () => {
    if (isCompleting) {
      return;
    }
    setFinishError(null);

    if (!onComplete) {
      setPhase("finished");
      return;
    }

    try {
      setIsCompleting(true);
      await onComplete();
      setPhase("finished");
    } catch (error) {
      setFinishError(error instanceof Error ? error.message : "Työn lopetus epäonnistui.");
    } finally {
      setIsCompleting(false);
    }
  };

  const activeStep = useMemo(() => {
    if (phase === "ready") return 0;
    if (phase === "running" || phase === "paused") return 1;
    return 2;
  }, [phase]);

  const formattedTime = useMemo(() => {
    const hours = Math.floor(elapsedSeconds / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((elapsedSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(elapsedSeconds % 60)
      .toString()
      .padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }, [elapsedSeconds]);

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-4 sm:gap-10 py-6">
      {STEP_LABELS.map((label, index) => {
        const isActive = index === activeStep;
        const isCompleted = index < activeStep;

        return (
          <div key={label} className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                isActive
                  ? "border-green-500 bg-green-500 text-white"
                  : isCompleted
                    ? "border-green-400 bg-green-100 text-green-700"
                    : "border-gray-300 bg-white text-gray-500"
              }`}
            >
              {index + 1}
            </div>
            <span className={`hidden sm:inline ${isActive ? "text-green-600" : "text-gray-600"}`}>{label}</span>
          </div>
        );
      })}
    </div>
  );

  const Card = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center max-w-2xl mx-auto">
      {children}
    </div>
  );

  const renderBody = () => {
    if (phase === "ready") {
      return (
        <Card>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Työ aloitettavissa</h2>
          <p className="text-gray-600 mb-6">Kun aloitat, aika alkaa juosta. Voit keskeyttää työn milloin tahansa.</p>
          <button
            type="button"
            onClick={() => setPhase("running")}
            className="rounded-lg bg-green-500 px-6 py-3 text-lg font-semibold text-white hover:bg-green-600"
          >
            Aloita työ
          </button>
        </Card>
      );
    }

    if (phase === "running") {
      return (
        <Card>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Työ käynnissä</h2>
          <p className="text-4xl font-mono text-gray-900 mb-6">{formattedTime}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => setPhase("paused")}
              className="rounded-lg bg-yellow-400 px-6 py-3 text-base font-semibold text-white hover:bg-yellow-500"
            >
              Keskeytä työ
            </button>
            <button
              type="button"
              onClick={() => setPhase("confirm")}
              className="rounded-lg bg-red-500 px-6 py-3 text-base font-semibold text-white hover:bg-red-600"
            >
              Lopeta työ
            </button>
          </div>
        </Card>
      );
    }

    if (phase === "paused") {
      return (
        <Card>
          <div className="flex flex-col items-center">
            <div className="h-14 w-14 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500 mb-4">
              <span className="material-icons text-3xl">pause</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Työ keskeytetty</h2>
            <p className="text-gray-600 mb-6">Voit jatkaa työtä tai päättää sen.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setPhase("running")}
                className="rounded-lg bg-green-500 px-6 py-3 text-base font-semibold text-white hover:bg-green-600"
              >
                Jatka työtä
              </button>
              <button
                type="button"
                onClick={() => setPhase("confirm")}
                className="rounded-lg bg-red-500 px-6 py-3 text-base font-semibold text-white hover:bg-red-600"
              >
                Lopeta työ
              </button>
            </div>
          </div>
        </Card>
      );
    }

    if (phase === "confirm") {
      return (
        <Card>
          <div className="flex flex-col items-center">
            <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center text-red-500 mb-4">
              <span className="material-icons text-3xl">warning</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Haluatko varmasti lopettaa tämän työn?</h2>
            <p className="text-gray-600 mb-6">
              Työn tila siirtyy odottamaan työnantajan hyväksyntää, eikä tätä toimintoa voi perua.
            </p>
            {finishError && (
              <div className="mb-4 w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {finishError}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setPhase("paused")}
                className="rounded-lg border border-gray-300 px-6 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50"
              >
                Peruuta
              </button>
              <button
                type="button"
                onClick={() => void handleComplete()}
                disabled={isCompleting}
                className="rounded-lg bg-red-500 px-6 py-3 text-base font-semibold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-300"
              >
                {isCompleting ? "Tallennetaan..." : "Lopeta työ"}
              </button>
            </div>
          </div>
        </Card>
      );
    }

    return (
      <Card>
        <div className="flex flex-col items-center">
          <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center text-green-500 mb-4">
            <span className="material-icons text-3xl">check_circle</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Työ lähetetty hyväksyttäväksi</h2>
          <p className="text-gray-600 mb-6">Kokonaisaika: {formattedTime}</p>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="rounded-lg bg-green-500 px-6 py-3 text-base font-semibold text-white hover:bg-green-600"
            >
              Palaa listoihin
            </button>
          )}
        </div>
      </Card>
    );
  };

  return (
    <section className="bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-6 pt-6">
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wide">Työn toteutus</p>
          <h1 className="text-3xl font-bold text-gray-900">{taskTitle}</h1>
        </div>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <span className="material-icons text-base">arrow_back</span>
            Takaisin
          </button>
        )}
      </div>

      <div className="px-6">
        <StepIndicator />
      </div>

      <div className="px-6 pb-8">{renderBody()}</div>
    </section>
  );
}
