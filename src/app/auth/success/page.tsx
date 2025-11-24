"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/otp/oauth2/exchange?email=&code=${code}`,
                    {
                        method: "POST",
                        credentials: "include",
                    }
                );

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.message || "Erreur lors de l'échange du code");
                }
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
