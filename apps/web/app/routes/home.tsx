import { redirect } from "react-router";
import type { Route } from "./+types/home";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  if (!url.searchParams.has("category")) {
    url.searchParams.set("category", "news");
  }
  throw redirect(`/all${url.search}`);
}

export function meta() {
  return [];
}

export default function Home() {
  return null;
}
