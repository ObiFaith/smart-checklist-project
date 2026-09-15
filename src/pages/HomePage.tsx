import { useNavigate } from "react-router-dom";
import { SituationList } from "../components/situation/SituationList";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <main className="page-shell home-page">
      <header className="hero-section">
        <p className="eyebrow">Did I Forget Something?</p>
        <h1>Before you leave, let&apos;s make sure you have everything.</h1>
      </header>

      <section aria-labelledby="situations-heading" className="panel">
        <h2 id="situations-heading">Where are you going?</h2>
        <SituationList
          onSelect={(situationId) => navigate(`/checklist/${situationId}`)}
        />
      </section>
    </main>
  );
}
