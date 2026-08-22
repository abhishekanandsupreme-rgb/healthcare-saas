export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-healthcare-50 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h1 className="text-4xl font-bold tracking-tight text-healthcare-900 sm:text-6xl">
            Modern Healthcare Management for Modern Clinics
          </h1>
          <p className="mt-6 text-lg leading-8 text-healthcare-700">
            Streamline patient scheduling, digital check-in, and visit notes.
            Built for compliance. Designed for speed.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#pricing"
              className="rounded-md bg-healthcare-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-healthcare-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-healthcare-600"
            >
              Get started
            </a>
            <a
              href="#features"
              className="text-sm font-semibold leading-6 text-healthcare-900"
            >
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
