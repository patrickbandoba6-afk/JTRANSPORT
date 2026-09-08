import Link from "next/link";
import { API_URL, type Mission } from "../../../lib/api";
import { MissionActions } from "../../../components/MissionActions";

async function getMission(id: string): Promise<Mission | null> {
  try {
    const res = await fetch(`${API_URL}/api/missions/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.mission;
  } catch {
    return null;
  }
}

export default async function MissionDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mission = await getMission(id);

  if (!mission) {
    return (
      <main className="container">
        <Link href="/missions">← Missions</Link>
        <section className="section card">
          <p className="muted">Cette mission n'existe pas ou n'est plus disponible.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="container">
      <Link href="/missions">← Missions</Link>
      <section className="section card">
        <span className="tag">{mission.vehicleType}</span>
        <span className="tag">{mission.status}</span>
        <h1>{mission.fromCity} → {mission.toCity}</h1>
        <p className="muted">Mission {mission.id} · {new Date(mission.date).toLocaleDateString("fr-FR")}</p>
        <p><b>Marchandise :</b> {mission.cargo}</p>
        <p><b>Poids :</b> {mission.weightKg} kg</p>
        <p><b>Budget indicatif :</b> <span className="price">{mission.budget} €</span></p>
      </section>

      <MissionActions mission={mission} />
    </main>
  );
}
