"use client";

import { useEffect } from "react";
import { fetchAndHydrateProfile } from "@/lib/profile-sync";

/** При открытии сайта подтягивает имя и профиль с сервера в localStorage. */
export function AuthHydrator() {
  useEffect(() => {
    void fetchAndHydrateProfile();
  }, []);

  return null;
}
