import { redirect } from "react-router";
import type { Route } from "./+types/home";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  throw redirect(`/all${url.search}`);
}

export function meta() {
  return [];
}

export default function Home() {
  return null;
}
