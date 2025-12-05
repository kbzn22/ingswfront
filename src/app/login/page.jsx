"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    loginService,
    obtenerUsuarioActualService,
} from "@/services/authService";

const AUTH_URL = "http://localhost:8080/auth/login";

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {

            await loginService(username, password);


            const usuario = await obtenerUsuarioActualService();

            if (!usuario || !usuario.rol) {
                throw new Error("No se pudo determinar el rol del usuario.");
            }


            if (usuario.rol === "DOCTOR") {
                router.push("/medico");
            } else if (usuario.rol === "ENFERMERA") {
                router.push("/enfermeria");
            } else {
                // rol desconocido → home o error
                router.push("/");
            }

        } catch (err) {
            console.error(err);
            setError("Usuario o contraseña incorrectos.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow flex flex-col gap-3 w-full max-w-sm"
            >
                <h1 className="text-xl font-semibold text-center">Iniciar sesión</h1>

                <input
                    type="text"
                    placeholder="Usuario"
                    className="border rounded px-2 py-1"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Contraseña"
                    className="border rounded px-2 py-1"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white rounded py-2 hover:bg-blue-700 disabled:opacity-60"
                >
                    {loading ? "Ingresando..." : "Ingresar"}
                </button>
            </form>
        </main>
    );
}
