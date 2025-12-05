// middleware.js
import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    // Rutas que queremos proteger
    const isMedicoRoute = pathname.startsWith("/medico");
    const isEnfermeriaRoute = pathname.startsWith("/enfermeria");

    if (!isMedicoRoute && !isEnfermeriaRoute) {
        // Si no es una ruta protegida, seguir normal
        return NextResponse.next();
    }

    // 1) Leer cookie de sesión
    const sessionId = request.cookies.get("SESSION_ID")?.value;

    if (!sessionId) {
        // No hay sesión -> al login
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    try {
        // 2) Preguntar al back quién soy
        const res = await fetch(`${API_URL}/auth/me`, {
            method: "GET",
            headers: {
                // reenviamos la cookie al back
                cookie: `SESSION_ID=${sessionId}`,
            },
            cache: "no-store",
        });
        console.log(res);
        if (!res.ok) {
            const loginUrl = new URL("/login", request.url);
            return NextResponse.redirect(loginUrl);
        }

        const user = await res.json();
        const rol = user.rol; // "DOCTOR" o "ENFERMERA"

        // 3) Reglas de acceso por rol
        if (isMedicoRoute && rol !== "DOCTOR") {
            // enfermera u otro → redirigir a su panel si corresponde
            if (rol === "ENFERMERA") {
                const url = new URL("/enfermeria", request.url);
                return NextResponse.redirect(url);
            }
            const loginUrl = new URL("/login", request.url);
            return NextResponse.redirect(loginUrl);
        }

        if (isEnfermeriaRoute && rol !== "ENFERMERA") {
            if (rol === "DOCTOR") {
                const url = new URL("/medico", request.url);
                return NextResponse.redirect(url);
            }
            const loginUrl = new URL("/login", request.url);
            return NextResponse.redirect(loginUrl);
        }

        // Todo ok → dejar pasar
        return NextResponse.next();
    } catch (err) {
        console.error("Error en middleware auth:", err);
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
    }
}

// Aplica solo a estas rutas
export const config = {
    matcher: ["/medico/:path*", "/enfermeria/:path*"],
};
