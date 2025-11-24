"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

interface ErrorResponse {
    message: string;
}

export default function SuccessPage() {
    const router = useRouter();
    const params = useSearchParams();
    const code = params.get("code");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!code) {
            setError("Code manquant");
            return;
        }

        async function exchangeCode() {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/otp/oauth2/exchange?code=${code}`,
                    {
                        method: "POST",
                        credentials: "include",
                    }
                );

                if (!res.ok) {
                    const data: ErrorResponse = await res.json();
                    throw new Error(data.message || "Erreur lors de l'échange du code");
                }

                const tokens: AuthTokens = await res.json();
                document.cookie = `accessToken=${tokens.accessToken}; Path=/; Secure; SameSite=Strict;`;
                document.cookie = `refreshToken=${tokens.refreshToken}; Path=/; Secure; SameSite=Strict;`;

                router.replace("/dashboard");
            } catch (err: any) {
                console.error(err);
                setError(err.message);
            }
        }
        exchangeCode();
    }, [code, router]);

    if (error) return <p className="text-red-500">{error}</p>;
    return <p>Connexion en cours…</p>;
}
