const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

function headers() {
    return {
        'Content-Type': 'application/json',
        // acá después podés agregar Authorization, etc.
    };
}

async function apiGet(path) {
    const res = await fetch(`${API_URL}${path}`, {
        method: 'GET',
        headers: headers(),
        cache: 'no-store',
        credentials: 'include', // si usás cookies de sesión, mejor incluirlo siempre
    });

    let data = null;
    if (res.status !== 204) {
        try {
            data = await res.json();
        } catch {
            // puede no haber body
        }
    }

    if (!res.ok) {
        const message = data?.message || `Error POST ${path}: ${res.status}`;

        const error = new Error(message);
        error.status = res.status;
        error.data = data;
        throw error;
    }

    return data; // puede ser null si 204
}

async function apiPost(path, body) {
    const res = await fetch(`${API_URL}${path}`, {
        method: 'POST',
        headers: headers(),
        credentials: 'include',
        body: body ? JSON.stringify(body) : undefined,
    });

    let data = null;
    if (res.status !== 204) {
        try {
            data = await res.json();
        } catch {
            // respuesta sin JSON, la dejamos en null
        }
    }

    if (!res.ok) {
        const message = data?.message || `Error POST ${path}: ${res.status}`;

        const error = new Error(message);
        error.status = res.status;
        error.data = data;
        throw error;
    }

    return data; // null si 204
}


export { API_URL, apiGet, apiPost };
