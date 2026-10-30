import { useCallback, useEffect, useState } from "react";

export type Route = "home" | "about" | "desk" | "contact";

const ROUTES: Route[] = ["home", "about", "desk", "contact"];

const TITLES: Record<Route, string> = {
  home: "Isoko Mboni | Sell now or store?",
  about: "About | Isoko Mboni",
  desk: "Isoko Desk | Isoko Mboni",
  contact: "Contact | Isoko Mboni",
};

function readRoute(): Route {
  const raw = window.location.hash.replace(/^#\/?/, "").toLowerCase();
  return (ROUTES as string[]).includes(raw) ? (raw as Route) : "home";
}

export function useHashRoute(): [Route, (next: Route) => void] {
  const [route, setRoute] = useState<Route>(readRoute);

  useEffect(() => {
    const onHashChange = () => {
      setRoute(readRoute());
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    document.title = TITLES[route];
  }, [route]);

  const go = useCallback((next: Route) => {
    window.location.hash = next;
  }, []);

  return [route, go];
}