"use client";

import {
  ChangeEvent,
  DragEvent,
  useMemo,
  useRef,
  useState
} from "react";
import {
  Crown,
  FileUp,
  Gift,
  RotateCcw,
  Sparkles,
  Trash2,
  Trophy,
  Users
} from "lucide-react";

type DrawnWinner = {
  id: string;
  name: string;
  drawNumber: number;
};

const SAMPLE_ROLL_NAMES = [
  "Golden Ticket",
  "Lucky Star",
  "Finalist",
  "Grand Prize",
  "Spotlight"
];

function parseEntries(input: string) {
  return input
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function uniqueEntries(entries: string[]) {
  const seen = new Set<string>();
  return entries.filter((entry) => {
    const key = entry.toLocaleLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export default function Home() {
  const [entries, setEntries] = useState<string[]>([]);
  const [manualText, setManualText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [winnerCount, setWinnerCount] = useState(1);
  const [winners, setWinners] = useState<DrawnWinner[]>([]);
  const [currentWinners, setCurrentWinners] = useState<string[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rollNames, setRollNames] = useState<string[]>(SAMPLE_ROLL_NAMES);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const winnerNames = useMemo(
    () => new Set(winners.map((winner) => winner.name.toLocaleLowerCase())),
    [winners]
  );

  const availableEntries = useMemo(
    () =>
      entries.filter((entry) => !winnerNames.has(entry.toLocaleLowerCase())),
    [entries, winnerNames]
  );

  const canDraw = entries.length > 0 && availableEntries.length > 0 && !isSpinning;

  function mergeEntries(newEntries: string[]) {
    setEntries((current) => uniqueEntries([...current, ...newEntries]));
  }

  function handleManualChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const value = event.target.value;
    setManualText(value);
    setEntries(uniqueEntries(parseEntries(value)));
    setWinners([]);
    setCurrentWinners([]);
  }

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;

    const validFiles = Array.from(files).filter((file) =>
      /\.(csv|txt)$/i.test(file.name)
    );

    const fileText = await Promise.all(validFiles.map((file) => file.text()));
    const importedEntries = parseEntries(fileText.join("\n"));
    mergeEntries(importedEntries);
    setManualText((current) =>
      [current, importedEntries.join("\n")].filter(Boolean).join("\n")
    );
    setWinners([]);
    setCurrentWinners([]);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    void handleFiles(event.dataTransfer.files);
  }

  function clearAll() {
    setEntries([]);
    setManualText("");
    setWinners([]);
    setCurrentWinners([]);
    setRollNames(SAMPLE_ROLL_NAMES);
  }

  function drawWinners() {
    if (!canDraw) return;

    const drawSize = Math.min(winnerCount, availableEntries.length);
    const selected = shuffle(availableEntries).slice(0, drawSize);
    const rollingPool = shuffle([...availableEntries, ...SAMPLE_ROLL_NAMES]).slice(
      0,
      Math.max(12, Math.min(availableEntries.length, 28))
    );

    setIsSpinning(true);
    setCurrentWinners([]);
    setRollNames([...rollingPool, ...selected]);

    window.setTimeout(() => {
      const drawNumber = winners.length + 1;
      setCurrentWinners(selected);
      setWinners((current) => [
        ...selected.map((name, index) => ({
          id: `${Date.now()}-${name}-${index}`,
          name,
          drawNumber
        })),
        ...current
      ]);
      setIsSpinning(false);
    }, 2800);
  }

  return (
    <main className="app-shell">
      <div className="confetti-field" aria-hidden="true">
        {Array.from({ length: 42 }, (_, index) => (
          <span key={index} style={{ "--i": index } as React.CSSProperties} />
        ))}
      </div>

      <section className="hero">
        <div>
          <p className="eyebrow">
            <Sparkles size={18} />
            Golden Draw
          </p>
          <h1>Giveaway Night</h1>
          <p className="hero-copy">
            Load the list, spin the marquee, and crown winners with a little
            spectacle. Everything stays client-side in your browser.
          </p>
        </div>
        <div className="hero-stats" aria-label="Giveaway status">
          <div>
            <strong>{entries.length}</strong>
            <span>entries</span>
          </div>
          <div>
            <strong>{availableEntries.length}</strong>
            <span>left</span>
          </div>
          <div>
            <strong>{winners.length}</strong>
            <span>winners</span>
          </div>
        </div>
      </section>

      <div className="workspace-grid">
        <section className="panel entry-panel" aria-labelledby="entries-heading">
          <div className="section-title">
            <div>
              <p className="eyebrow">
                <Users size={17} />
                Entry Management
              </p>
              <h2 id="entries-heading">Upload the guest list</h2>
            </div>
            <span className="count-badge">{entries.length} entries loaded</span>
          </div>

          <div
            className={`drop-zone ${isDragging ? "is-dragging" : ""}`}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                fileInputRef.current?.click();
              }
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt,text/csv,text/plain"
              multiple
              onChange={(event) => void handleFiles(event.target.files)}
            />
            <FileUp size={34} />
            <strong>Drop CSV or TXT files here</strong>
            <span>One name per line. Click to browse.</span>
          </div>

          <label className="manual-entry">
            <span>Paste or type names</span>
            <textarea
              value={manualText}
              onChange={handleManualChange}
              placeholder={"Ava Johnson\nMika Chen\nNoah Williams"}
              rows={8}
            />
          </label>

          <div className="preview-header">
            <h3>Live Preview</h3>
            <button className="ghost-button" onClick={clearAll} type="button">
              <Trash2 size={17} />
              Clear All
            </button>
          </div>
          <div className="entry-list" aria-live="polite">
            {entries.length ? (
              entries.map((entry, index) => (
                <span key={`${entry}-${index}`}>{entry}</span>
              ))
            ) : (
              <p>No entries loaded yet.</p>
            )}
          </div>
        </section>

        <section className="panel draw-panel" aria-labelledby="draw-heading">
          <div className="section-title">
            <div>
              <p className="eyebrow">
                <Gift size={17} />
                Random Selection
              </p>
              <h2 id="draw-heading">Spin the spotlight</h2>
            </div>
            <label className="winner-count">
              <span>Draw</span>
              <select
                value={winnerCount}
                onChange={(event) => setWinnerCount(Number(event.target.value))}
              >
                {Array.from({ length: 10 }, (_, index) => index + 1).map(
                  (count) => (
                    <option value={count} key={count}>
                      {count}
                    </option>
                  )
                )}
              </select>
            </label>
          </div>

          <div className={`slot-machine ${isSpinning ? "is-spinning" : ""}`}>
            <div className="slot-window">
              <div
                className="slot-reel"
                style={
                  {
                    "--roll-distance": Math.max(0, rollNames.length - 1)
                  } as React.CSSProperties
                }
              >
                {rollNames.map((name, index) => (
                  <span key={`${name}-${index}`}>{name}</span>
                ))}
              </div>
            </div>
          </div>

          <button
            className="spin-button"
            disabled={!canDraw}
            onClick={drawWinners}
            type="button"
          >
            <Crown size={30} />
            {isSpinning ? "SPINNING..." : winners.length ? "PICK AGAIN" : "SPIN & PICK"}
          </button>

          <div className={`winner-reveal ${currentWinners.length ? "show" : ""}`}>
            <div className="spotlight" />
            <Trophy size={38} />
            <p>{currentWinners.length > 1 ? "Winners" : "Winner"}</p>
            <h3>
              {currentWinners.length
                ? currentWinners.join(", ")
                : "Awaiting the draw"}
            </h3>
          </div>
        </section>

        <aside className="panel winners-panel" aria-labelledby="winners-heading">
          <div className="section-title compact">
            <div>
              <p className="eyebrow">
                <Trophy size={17} />
                Sidebar Log
              </p>
              <h2 id="winners-heading">Winners So Far</h2>
            </div>
            <button
              className="icon-button"
              onClick={() => {
                setWinners([]);
                setCurrentWinners([]);
              }}
              title="Reset winners"
              type="button"
            >
              <RotateCcw size={18} />
            </button>
          </div>
          <ol className="winner-log">
            {winners.length ? (
              winners.map((winner) => (
                <li key={winner.id}>
                  <span>{winner.name}</span>
                  <small>Draw {winner.drawNumber}</small>
                </li>
              ))
            ) : (
              <p>No winners yet.</p>
            )}
          </ol>
        </aside>
      </div>
    </main>
  );
}
