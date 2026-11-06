
export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">
          Terms & Conditions
        </h1>

        <div className="space-y-5 text-gray-700">
          <section>
            <h2 className="mb-2 text-xl font-semibold">
              1. Account Registration
            </h2>
            <p>
              You must provide accurate and complete information when
              creating your account.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">
              2. Account Security
            </h2>
            <p>
              You are responsible for keeping your login credentials
              confidential and for activity under your account.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">
              3. Personal Information
            </h2>
            <p>
              Your personal information will be used to provide and
              maintain the services offered by this application.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">
              4. Acceptance
            </h2>
            <p>
              By selecting the Terms & Conditions checkbox during
              registration, you confirm that you have read and agree
              to these terms.
            </p>
          </section>
        </div>

        <a
          href="/signup"
          className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Back to Signup
        </a>
      </div>
    </main>
  );
}
