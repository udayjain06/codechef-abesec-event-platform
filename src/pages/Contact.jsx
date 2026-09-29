import { GraduationCap, Users } from "lucide-react";
import Button from "../components/Button";
import InstagramIcon from "../components/InstagramIcon";
import usePageMeta from "../hooks/usePageMeta";
import { COLLEGE_NAME, INSTAGRAM_URL } from "../data/site";

export default function Contact() {
  usePageMeta("Contact | CodeChef ABESEC", "Get in touch with the CodeChef ABESEC chapter at ABES Engineering College through our official Instagram.");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-extrabold text-ink-100 sm:text-5xl">Contact</h1>
        <p className="mt-5 text-lg text-ink-300">
          Questions about an event or the chapter? Follow updates and reach out through our official Instagram account.
        </p>
      </header>

      <dl className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-ink-700 bg-ink-900 p-6">
          <Users className="h-6 w-6 text-ember-400" aria-hidden="true" />
          <dt className="mt-4 text-sm text-ink-300">Chapter</dt>
          <dd className="mt-1 text-lg font-bold text-ink-100">CodeChef ABESEC</dd>
        </div>
        <div className="rounded-2xl border border-ink-700 bg-ink-900 p-6">
          <GraduationCap className="h-6 w-6 text-ember-400" aria-hidden="true" />
          <dt className="mt-4 text-sm text-ink-300">College</dt>
          <dd className="mt-1 text-lg font-bold text-ink-100">{COLLEGE_NAME}</dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-col items-start gap-4 rounded-2xl border border-ember-500/30 bg-ink-900 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h2 className="text-xl font-bold text-ink-100">Official Instagram</h2>
          <p className="mt-1 text-ink-300">@abesec.codechef</p>
        </div>
        <Button href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" size="lg">
          <InstagramIcon className="h-5 w-5" />
          Message us on Instagram
          <span className="sr-only"> (opens in a new tab)</span>
        </Button>
      </div>
    </div>
  );
}
