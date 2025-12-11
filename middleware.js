import { NextResponse } from "next/server";

export function middleware(request) {
    // No hacemos nada, dejamos pasar todo
    return NextResponse.next();
}

// o directamente exportar un matcher vacío
export const config = {
    matcher: [],
};
