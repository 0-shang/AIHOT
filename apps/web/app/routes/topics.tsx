import { redirect } from "react-router";

export async function loader() {
  return redirect("/all");
}

export default function TopicsPage() {
  return null;
}
