import { useParams } from "react-router-dom";
import { SearchX } from "lucide-react";
import PageHeader from "../../components/admin/PageHeader";
import EventForm from "../../components/admin/EventForm";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import Button from "../../components/Button";
import { LoadingState } from "../../components/Loading";
import useFetch from "../../hooks/useFetch";
import usePageMeta from "../../hooks/usePageMeta";
import { supabase } from "../../lib/supabase";
import { isUuid } from "../../utils/uuid";

export default function EditEvent() {
  usePageMeta("Edit event | CodeChef ABESEC");
  const { id } = useParams();

  const { data: event, loading, error, reload } = useFetch(
    () =>
      isUuid(id)
        ? supabase.from("events").select("*").eq("id", id).maybeSingle()
        : Promise.resolve({ data: null, error: null }),
    [id]
  );

  if (loading) return <LoadingState label="Loading event..." />;
  if (error) return <ErrorState title="Unable to load this event." message="Please try again." onRetry={reload} />;
  if (!event)
    return <EmptyState icon={SearchX} title="Event not found." message="It may have been deleted." action={<Button to="/admin/events">Back to events</Button>} />;

  return (
    <>
      <PageHeader title="Edit event" description={event.title} />
      {/* key makes React rebuild the form if you switch to another event */}
      <EventForm key={event.id} event={event} />
    </>
  );
}
