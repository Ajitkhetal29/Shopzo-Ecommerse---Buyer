"use client";

import { useEffect, useState } from "react";
import { initializeApp } from "@/services/appInit";


export default function AppInitializer({ children }: { children: React.ReactNode }) {

    const [ready, setReady] = useState(false);

    useEffect(() => {
        const init = async () => {
            await initializeApp();
            setReady(true);
        }
        init();
    }, []);

    if (!ready) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;



}



