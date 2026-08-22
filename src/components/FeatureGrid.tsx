const features = [
  {
    name: "Patient Self-Scheduling",
    description:
      "Let patients book appointments online without calling the clinic. Reduce front-desk workload and no-shows.",
  },
  {
    name: "Digital Check-In",
    description:
      "Patients check in via a secure link sent before their appointment. Providers see real-time status updates.",
  },
  {
    name: "Structured Visit Notes",
    description:
      "Capture SOAP notes digitally with auto-save. Finalize notes to create an immutable patient record.",
  },
  {
    name: "Insurance Eligibility",
    description:
      "Verify coverage before the visit. Display active/inactive status, copay, and deductible remaining.",
  },
  {
    name: "HIPAA Compliance",
    description:
      "Audit logs, role-based access, and data retention policies built in. Meet your BAA requirements.",
  },
  {
    name: "Billing & Subscriptions",
    description:
      "Stripe Connect for clinic payouts. Per-provider subscriptions with transparent transaction fees.",
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-healthcare-600">
            Everything you need
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-healthcare-900 sm:text-4xl">
            Built for clinic operations
          </p>
          <p className="mt-6 text-lg leading-8 text-healthcare-700">
            From scheduling to billing, our vertical slice covers the full patient
            journey.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-healthcare-900">
                  {feature.name}
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-healthcare-700">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
