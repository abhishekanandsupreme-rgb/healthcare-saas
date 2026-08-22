import Link from "next/link";

export default function About() {
  return (
    <main className="min-h-screen bg-white">
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-healthcare-900 sm:text-5xl">
              About HealthCare SaaS
            </h1>
            <p className="mt-6 text-lg leading-8 text-healthcare-700">
              We are building the future of clinic operations. Our platform
              combines modern technology with healthcare compliance to help
              providers focus on what matters most — their patients.
            </p>
            <div className="mt-10">
              <Link
                href="/dashboard"
                className="rounded-md bg-healthcare-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-healthcare-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-healthcare-600"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
