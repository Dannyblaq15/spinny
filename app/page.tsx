import Link from "next/link";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Trophy,
  Upload
} from "lucide-react";

const featureCards = [
  {
    icon: Upload,
    title: "Load names fast",
    text: "Drop a CSV or TXT file, or paste names directly when the list changes at the last minute."
  },
  {
    icon: Trophy,
    title: "Make the reveal count",
    text: "A slot-machine roll, spotlight moment, and winner history turn a routine pick into a shared moment."
  },
  {
    icon: ShieldCheck,
    title: "Keep it private",
    text: "Everything runs in the browser. No accounts, no backend, no entry list leaving the device."
  }
];

export default function LandingPage() {
  return (
    <main className="landing-shell">
      <div className="confetti-field" aria-hidden="true">
        {Array.from({ length: 52 }, (_, index) => (
          <span key={index} style={{ "--i": index } as CSSProperties} />
        ))}
      </div>

      <section className="landing-hero">
        <div className="landing-nav" aria-label="Golden Draw overview">
          <span>
            <Sparkles size={19} />
            Golden Draw
          </span>
          <Link href="/draw">Open App</Link>
        </div>

        <div className="landing-hero-content">
          <p className="eyebrow">
            <Sparkles size={18} />
            Festive giveaway software
          </p>
          <h1>Every Draw Deserves a Drumroll</h1>
          <p className="landing-copy">
            Golden Draw helps event hosts upload entries, spin through names,
            and reveal winners with a bold, fair, browser-only giveaway show.
          </p>
          <div className="landing-actions">
            <Link className="launch-button" href="/draw">
              Use the Software
              <ArrowRight size={24} />
            </Link>
            <span>Client-side, private, and ready for the big moment.</span>
          </div>
        </div>
      </section>

      <section className="story-section" aria-labelledby="story-heading">
        <div>
          <p className="eyebrow">
            <CheckCircle2 size={17} />
            Why people need it
          </p>
          <h2 id="story-heading">The story starts with a messy raffle table.</h2>
        </div>
        <div className="story-copy">
          <p>
            Picture the end of an event: the prizes are ready, the room is
            watching, and someone is scrolling through a spreadsheet trying to
            prove the pick is random. The energy drops right when it should peak.
          </p>
          <p>
            Golden Draw was made for that exact moment. It turns a plain list of
            names into a confident, visible draw so everyone can follow along,
            celebrate the reveal, and trust that previous winners will not be
            picked again.
          </p>
        </div>
      </section>

      <section className="feature-strip" aria-label="Golden Draw features">
        {featureCards.map((feature) => {
          const Icon = feature.icon;
          return (
            <article key={feature.title} className="feature-tile">
              <Icon size={30} />
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          );
        })}
      </section>

      <section className="landing-cta" aria-label="Start using Golden Draw">
        <h2>Ready to run the next giveaway?</h2>
        <Link className="launch-button secondary" href="/draw">
          Go to Main Page
          <ArrowRight size={24} />
        </Link>
      </section>
    </main>
  );
}
