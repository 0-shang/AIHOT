import { redirect } from "react-router";

export async function loader() {
  return redirect("/all");
}

export default function TopicPage() {
  return null;
}
