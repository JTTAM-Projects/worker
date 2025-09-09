import React from "react";

export default function LandingPage() {
  return (
    // pääkontti
    <section className="bg-gray-100 min-h-screen w-full">
      {/* sisäkontti */}
      <div className="max-w-[1280px] mx-auto p-8 grid gap-5">
        {/* banneri */}
        <div className="p-7 rounded-2xl border-4 border-lime-500 bg-white shadow-sm max-w-[900px] mx-auto text-center">
          {/* otsikko */}
          <h1 className="mb-1 text-4xl font-semibold text-gray-900">Lorem ipsum</h1>
          {/* kuvausteksti */}
          <p className="mt-2 text-gray-700">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
            odio. Praesent libero. Sed cursus ante dapibus diam.
          </p>
          {/* painikkeet bannerissa */}
          <div className="flex gap-2 mt-3 flex-wrap justify-center">
            <button className="px-3 py-2 rounded-lg border-4 border-lime-500 bg-lime-500 text-white hover:bg-lime-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime-500">
              Get started
            </button>
            <button className="px-3 py-2 rounded-lg border-4 border-lime-500 bg-white text-gray-900 hover:bg-gray-200">
              Learn more
            </button>
          </div>
        </div>

        {/* korttigridi */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 9 }).map((_, k) => (
            // yksittäinen kortti
            <article
              key={k}
              className="rounded-2xl border-4 border-lime-500 bg-white shadow-sm p-5 flex flex-col"
            >
              {/* kortin otsikko */}
              <h3 className="mt-0 text-2xl font-semibold text-gray-900">Lorem ipsum {k}</h3>
              {/* kortin kuvausteksti */}
              <p className="text-gray-700 mb-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Curabitur sodales ligula in libero.
              </p>
              {/* kortin toiminto-painike */}
              <button className="px-3 py-2 rounded-lg border-4 border-lime-500 bg-white text-gray-900 hover:bg-gray-200 mt-auto text-sm">
                Action
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
