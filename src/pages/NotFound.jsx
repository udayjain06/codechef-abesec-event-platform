import { Compass } from "lucide-react";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";
import usePageMeta from "../hooks/usePageMeta";

export default function NotFound() {
  usePageMeta("Page not found | CodeChef ABESEC");
  return (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <EmptyState
        icon={Compass}
        title="Page not found"
        message="The page you are looking for does not exist or has moved."
        action={<Button to="/">Back to home</Button>}
      />
    </div>
  );
}
