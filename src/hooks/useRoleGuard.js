"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { obtenerUsuarioActualService } from "@/services/authService";

export function useRoleGuard(allowedRoles) {
    const router = useRouter();
    const [usuario, setUsuario] = useState(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function check() {
            try {
                const data = await obtenerUsuarioActualService();

                if (cancelled) return;


                if (!data) {
                    router.replace("/login");
                    return;
                }


                if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
                    if (!allowedRoles.includes(data.rol)) {
                        // 🚫 Rol no permitido en esta pantalla
                        if (data.rol === "DOCTOR") {
                            router.replace("/medico");
                        } else if (data.rol === "ENFERMERA") {
                            router.replace("/enfermeria");
                        } else {
                            router.replace("/login");
                        }
                        return; // 👈 CLAVE: cortamos acá, no marcamos autorizado en esta página
                    }
                }


                setUsuario(data);
                setChecking(false);
            } catch (e) {
                if (!cancelled) {
                    console.error("Error en useRoleGuard:", e);
                    router.replace("/login");
                }
            }
        }

        check();

        return () => {
            cancelled = true;
        };
    }, [router, JSON.stringify(allowedRoles)]);

    return { usuario, checking };
}
