import Link from "next/link";

/** Keeps 404s inside the site chrome, which moved from the root layout to this segment. */
export default function NotFound() {
  return (
    <div className="container-x flex flex-col items-center py-32 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">This page could not be found.</h1>
      <Link href="/" className="mt-6 font-semibold text-brand underline-offset-2 hover:underline">
        Home
      </Link>
    </div>
  );
}
