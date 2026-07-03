/**
 * =========================================
 * CropsPage
 * =========================================
 *
 * Pantalla de cultivos estratégicos.
 *
 * Finalidad:
 * - consumir perfiles desde service;
 * - mostrar cards navegables/visuales;
 * - preparar el módulo para GET /api/crops/profiles.
 * 
*/

import { useEffect, useState } from "react";
import { CropProfileCard } from "../components/CropProfileCard";
import { getCropProfiles } from "../services/cropProfilesService";
import type { CropProfile } from "../types/cropProfile.types";
import "../crops.css";

export function CropsPage() {
    const [profiles, setProfiles] = useState<ReadonlyArray<CropProfile>>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Carga perfiles desde service.
    // La página no consume cropProfilesMock directamente.
    useEffect(() => {
        async function loadProfiles() {
            try {
                const data = await getCropProfiles();

                setProfiles(data);
                setErrorMessage(null);
            } catch {
                setErrorMessage("No se pudieron cargar los perfiles de cultivo.");
            } finally {
                setIsLoading(false);
            }
        }

        void loadProfiles();
    }, []);

    return (
        <section className="cropsPage" aria-labelledby="crops-title">
        <header className="cropsHero">
            <div>
                <p className="cropsHero__eyebrow">Cultivos estratégicos</p>
                <h1 id="crops-title">Perfiles agrícolas nacionales</h1>
                <span>
                    Cada perfil define riesgos principales, métricas preferidas y reglas
                    base para adaptar la inteligencia prescriptiva de AgroVision.
                </span>
            </div>
        </header>

        {isLoading && (
            <div className="cropsState">
                <p>Cargando perfiles de cultivo...</p>
            </div>
        )}

        {errorMessage && (
            <div className="cropsState cropsState--error">
                <p>{errorMessage}</p>
            </div>
        )}

        {!isLoading && !errorMessage && profiles.length === 0 && (
            <div className="cropsState">
            <p>No hay perfiles de cultivo disponibles.</p>
            </div>
        )}

        {!isLoading && !errorMessage && profiles.length > 0 && (
            <section className="cropsGrid" aria-label="Perfiles de cultivo">
            {profiles.map((profile) => (
                <CropProfileCard key={profile.cropType} cropProfile={profile} />
            ))}
            </section>
        )}
        </section>
    );
}