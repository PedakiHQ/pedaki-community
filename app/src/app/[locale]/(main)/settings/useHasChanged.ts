"use client";
import {useEffect, useRef} from "react";
import { toast } from "sonner";

export const useHasChanged = () => {
    const hasChanged = useRef(false)

    const setHasChanged = (bool: boolean) => {
        hasChanged.current = bool
    }

    useEffect(() => {
        return () => {
            if (hasChanged.current) {
                toast.warning("Les changements n'ont pas été sauvegardés.", {
                    id: 'settings-unsaved-changes',
                });
            }
        };
    }, []);

    return setHasChanged
}