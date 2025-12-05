// app/page.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { obtenerUsuarioActualService } from "@/services/authService";

export default function HomeRedirect() {
    const router = useRouter();

    useEffect(() => {
        async function go() {
            try {
                const me = await obtenerUsuarioActualService();

                if (me?.rol === "DOCTOR") {
                    router.replace("/medico");
                } else if (me?.rol === "ENFERMERA") {
                    router.replace("/enfermeria");
                } else {
                    router.replace("/login");
                }
            } catch {
                router.replace("/login");
            }
        }

        go();
    }, [router]);

    return (
        <main className="min-h-screen flex items-center justify-center">
            <p>Redirigiendo...</p>
        </main>
    );
}
