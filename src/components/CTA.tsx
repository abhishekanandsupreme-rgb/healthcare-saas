export default function CTA() {
  return (
    <section className="relative isolate overflow-hidden bg-healthcare-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to streamline your clinic?
          </h2>
          <p className="mt-6 text-lg leading-8 text-healthcare-200">
            Join the pilot program. Deploy in minutes, not months. HIPAA-ready
            from day one.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#"
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-healthcare-900 shadow-sm hover:bg-healthcare-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Start your free trial
            </a>
            <a
              href="#"
              className="text-sm font-semibold leading-6 text-white"
            >
              Contact sales <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
