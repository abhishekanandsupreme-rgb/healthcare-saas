const tiers = [
  {
    name: "Starter",
    price: 99,
    frequency: "/provider/month",
    description: "For solo providers and small clinics getting started.",
    features: [
      "Patient self-scheduling",
      "Digital check-in",
      "Basic visit notes",
      "HIPAA audit logs",
      "Email support",
    ],
    cta: "Start free trial",
    mostPopular: false,
  },
  {
    name: "Growth",
    price: 79,
    frequency: "/provider/month",
    description: "For growing clinics that need billing and eligibility.",
    features: [
      "Everything in Starter",
      "Insurance eligibility checks",
      "Stripe billing & subscriptions",
      "Priority support",
      "Custom branding",
    ],
    cta: "Start free trial",
    mostPopular: true,
  },
  {
    name: "Enterprise",
    price: null,
    frequency: "Custom",
    description: "For multi-location groups with advanced compliance needs.",
    features: [
      "Everything in Growth",
      "Role-based access control",
      "SSO / MFA enforcement",
      "Dedicated success manager",
      "Custom SLA",
    ],
    cta: "Contact sales",
    mostPopular: false,
  },
];

export default function Pricing() {
  return (
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
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-3xl p-8 ring-1 ${
                tier.mostPopular
                  ? "ring-healthcare-600 bg-healthcare-50"
                  : "ring-gray-200"
              }`}
            >
              <h3
                className={`text-lg font-semibold leading-8 ${
                  tier.mostPopular ? "text-healthcare-600" : "text-healthcare-900"
                }`}
              >
                {tier.name}
                {tier.mostPopular && (
                  <span className="ml-2 rounded-full bg-healthcare-600 px-2 py-0.5 text-xs text-white">
                    Most popular
                  </span>
                )}
              </h3>
              <p className="mt-4 text-sm leading-6 text-healthcare-700">
                {tier.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                {tier.price !== null ? (
                  <>
                    <span className="text-4xl font-bold tracking-tight text-healthcare-900">
                      ${tier.price}
                    </span>
                    <span className="text-sm font-semibold leading-6 text-healthcare-700">
                      {tier.frequency}
                    </span>
                  </>
                ) : (
                  <span className="text-4xl font-bold tracking-tight text-healthcare-900">
                    {tier.frequency}
                  </span>
                )}
              </p>
              <a
                href="#"
                className={`mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  tier.mostPopular
                    ? "bg-healthcare-600 text-white shadow-sm hover:bg-healthcare-500 focus-visible:outline-healthcare-600"
                    : "bg-healthcare-600 text-white shadow-sm hover:bg-healthcare-500 focus-visible:outline-healthcare-600"
                }`}
              >
                {tier.cta}
              </a>
              <ul className="mt-8 space-y-3 text-sm leading-6 text-healthcare-700">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <svg
                      className="h-6 w-5 flex-none text-healthcare-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
