// src/services/apiService.js
export const API_URL =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

function headers() {
    return {
        "Content-Type": "application/json",
    };
}

export async function apiGet(path) {
    const res = await fetch(`${API_URL}${path}`, {
        method: "GET",
        headers: headers(),
        cache: "no-store",
        credentials: "include",
    });

    let data = null;
    if (res.status !== 204) {
        try {
            data = await res.json();
        } catch {
            // respuesta sin body
        }
    }

    if (!res.ok) {
        const message = data?.message || `Error GET ${path}: ${res.status}`;
        const error = new Error(message);
        error.status = res.status;
        error.data = data;
        throw error;
    }

    return data;
}

export async function apiPost(path, body) {
    const res = await fetch(`${API_URL}${path}`, {
        method: "POST",
        headers: headers(),
        credentials: "include",
        body: body ? JSON.stringify(body) : undefined,
    });

    let data = null;
    if (res.status !== 204) {
        try {
            data = await res.json();
        } catch {}
    }

    if (!res.ok) {
        const message = data?.message || `Error POST ${path}: ${res.status}`;
        const error = new Error(message);
        error.status = res.status;
        error.data = data;
        throw error;
    }

    return data;
}
