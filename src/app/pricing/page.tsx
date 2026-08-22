import Link from "next/link";
import CTA from "@/components/CTA";

export default function Pricing() {
  return (
    <main className="min-h-screen bg-white">
      <section id="pricing" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-base font-semibold leading-7 text-healthcare-600">
              Pricing
            </h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-healthcare-900 sm:text-5xl">
              Simple, per-provider pricing
            </p>
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-healthcare-700">
            Start with a 14-day free trial. No credit card required.
          </p>
          <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-3">
            {/* Starter */}
            <div className="rounded-3xl p-8 ring-1 ring-gray-200">
              <h3 className="text-lg font-semibold leading-8 text-healthcare-900">
                Starter
              </h3>
              <p className="mt-4 text-sm leading-6 text-healthcare-700">
                For solo providers and small clinics getting started.
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-healthcare-900">
                  $99
                </span>
                <span className="text-sm font-semibold leading-6 text-healthcare-700">
                  /provider/month
                </span>
              </p>
              <Link
                href="#"
                className="mt-6 block rounded-md bg-healthcare-600 px-3 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-healthcare-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-healthcare-600"
              >
                Start free trial
              </Link>
              <ul className="mt-8 space-y-3 text-sm leading-6 text-healthcare-700">
                <li className="flex gap-x-3">Patient self-scheduling</li>
                <li className="flex gap-x-3">Digital check-in</li>
                <li className="flex gap-x-3">Basic visit notes</li>
                <li className="flex gap-x-3">HIPAA audit logs</li>
                <li className="flex gap-x-3">Email support</li>
              </ul>
            </div>

            {/* Growth */}
            <div className="rounded-3xl p-8 ring-1 ring-healthcare-600 bg-healthcare-50">
              <h3 className="text-lg font-semibold leading-8 text-healthcare-600">
                Growth
              </h3>
              <p className="mt-4 text-sm leading-6 text-healthcare-700">
                For growing clinics that need billing and eligibility.
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-healthcare-900">
                  $79
                </span>
                <span className="text-sm font-semibold leading-6 text-healthcare-700">
                  /provider/month
                </span>
              </p>
              <Link
                href="#"
                className="mt-6 block rounded-md bg-healthcare-600 px-3 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-healthcare-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-healthcare-600"
              >
                Start free trial
              </Link>
              <ul className="mt-8 space-y-3 text-sm leading-6 text-healthcare-700">
                <li className="flex gap-x-3">Everything in Starter</li>
                <li className="flex gap-x-3">Insurance eligibility checks</li>
                <li className="flex gap-x-3">Stripe billing & subscriptions</li>
                <li className="flex gap-x-3">Priority support</li>
                <li className="flex gap-x-3">Custom branding</li>
              </ul>
            </div>

            {/* Enterprise */}
            <div className="rounded-3xl p-8 ring-1 ring-gray-200">
              <h3 className="text-lg font-semibold leading-8 text-healthcare-900">
                Enterprise
              </h3>
              <p className="mt-4 text-sm leading-6 text-healthcare-700">
                For multi-location groups with advanced compliance needs.
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-healthcare-900">
                  Custom
                </span>
              </p>
              <Link
                href="#"
                className="mt-6 block rounded-md bg-healthcare-600 px-3 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-healthcare-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-healthcare-600"
              >
                Contact sales
              </Link>
              <ul className="mt-8 space-y-3 text-sm leading-6 text-healthcare-700">
                <li className="flex gap-x-3">Everything in Growth</li>
                <li className="flex gap-x-3">Role-based access control</li>
                <li className="flex gap-x-3">SSO / MFA enforcement</li>
                <li className="flex gap-x-3">Dedicated success manager</li>
                <li className="flex gap-x-3">Custom SLA</li>
              </ul>
            </div>
          </div>
          <div className="mt-16">
            <CTA />
          </div>
        </div>
      </section>
    </main>
  );
}
