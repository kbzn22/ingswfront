
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

                // si no hay usuario → al login
                if (!data) {
                    router.push("/login");
                    return;
                }

                setUsuario(data);

                // si el rol NO está permitido en esta pantalla
                if (!allowedRoles.includes(data.rol)) {
                    if (data.rol === "DOCTOR") {
                        router.push("/medico");
                    } else if (data.rol === "ENFERMERA") {
                        router.push("/enfermeria");
                    } else {
                        router.push("/login");
                    }
                }
            } catch (e) {
                if (!cancelled) {
                    router.push("/login");
                }
            } finally {
                if (!cancelled) setChecking(false);
            }
        }

        check();

        return () => {
            cancelled = true;
        };
    }, [router]); // allowedRoles es constante por página

    return { usuario, checking };
}
