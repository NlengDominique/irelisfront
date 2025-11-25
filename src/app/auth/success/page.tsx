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
                console.log("➡️ Exchange started with code:", code);

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/otp/oauth2/exchange?code=${code}`,
                    {
                        method: "POST",
                        credentials: "include",
                    }
                );

                console.log("⬅️ Response received, status:", res.status);

                if (!res.ok) {
                    const errorText = await res.text();
                    console.error("❌ Backend error response:", errorText);
                    throw new Error(errorText || "Erreur lors de l'échange du code");
                }

                const tokens: AuthTokens = await res.json();
                console.log("✅ Tokens reçus :", tokens);

                document.cookie = `accessToken=${tokens.accessToken}`;
                document.cookie = `refreshToken=${tokens.refreshToken}`;

                localStorage.setItem("accessToken", tokens.accessToken);
                localStorage.setItem("refreshToken", tokens.refreshToken);

                console.log("➡️ Redirection vers /dashboard...");

                router.push("/dashboard");

            } catch (err: any) {
                console.error("🔥 Erreur finale :", err);
                setError(err.message);
            }
        }

        exchangeCode();
    }, [code, router]);

    if (error) return <p className="text-red-500">{error}</p>;
    return <p>Connexion en cours…</p>;
}
