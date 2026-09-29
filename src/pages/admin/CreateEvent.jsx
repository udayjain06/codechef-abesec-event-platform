import PageHeader from "../../components/admin/PageHeader";
import EventForm from "../../components/admin/EventForm";
import usePageMeta from "../../hooks/usePageMeta";

export default function CreateEvent() {
  usePageMeta("Create event | CodeChef ABESEC");
  return (
    <>
      <PageHeader title="Create event" description="Fill in the details. The event appears on the site as soon as you save." />
      <EventForm />
    </>
  );
}
