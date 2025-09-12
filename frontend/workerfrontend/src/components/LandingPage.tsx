import React from "react";

export default function LandingPage() {
  return (
    // pääkontti
    <section className="bg-gray-50 min-h-screen w-full">
      {/* ylätunniste */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        {/* navigaatio */}
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          {/* navigaatio-linkit */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-green-400">
              How it works
            </a>
            <a href="#" className="text-gray-600 hover:text-green-400">
              Post a Task
            </a>
            <a href="#" className="text-gray-600 hover:text-green-400">
              Browse tasks
            </a>
          </div>
          {/* oikean reunan painikkeet */}
          <div className="flex items-center space-x-4">
            <a
              href="#"
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 hover:border-green-400 text-sm font-medium"
            >
              Sign up
            </a>
            <a
              href="#"
              className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 hover:border-green-400 text-sm font-medium"
            >
              Log in
            </a>
            <button className="p-2 rounded-md hover:bg-gray-100">
              <span className="material-icons">menu</span>
            </button>
          </div>
        </nav>
      </header>

      {/* sisäkontti */}
      <main className="container mx-auto px-6 py-12 grid gap-12">
        {/* banneri */}
        <section className="bg-white rounded-lg shadow-lg text-center py-16 px-8">
          {/* otsikko */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Get more done with WorkerApp
          </h1>
          {/* kuvausteksti */}
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Find trusted people for everyday tasks, from minor repairs to
            errands. Post a task and get started today.
          </p>
          {/* painikkeet */}
          <div className="mt-8 flex justify-center space-x-4 flex-wrap">
            <a
              href="#"
              className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 font-medium"
            >
              Post a task
            </a>
            <a
              href="#"
              className="bg-white border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-100 hover:border-green-400 font-medium"
            >
              Browse tasks
            </a>
          </div>
        </section>

        {/* korttigridi */}
        <section className="grid gap-8">
          {/* kortit rivissä */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              [
                "search",
                "Post a task",
                "Describe your task and set your budget. Get matched with qualified Taskers.",
              ],
              [
                "person_search",
                "Choose your Tasker",
                "Review Tasker profiles, ratings, and reviews. Select the best fit for your needs.",
              ],
              [
                "done_all",
                "Get it done",
                "Taskers complete the work, and you pay securely through the platform. Leave feedback to help others.",
              ],
            ].map(([icon, title, desc]) => (
              <div
                key={title}
                className="bg-white p-6 rounded-lg border border-gray-200 hover:bg-gray-100 hover:border-green-400 hover:shadow-md transition duration-200"
              >
                <span className="material-icons text-green-400 text-3xl mb-4">
                  {icon}
                </span>
                <h3 className="font-bold text-lg text-gray-800 mb-2">
                  {title}
                </h3>
                <p className="text-gray-600 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* suosituimmat tehtävät */}
        <section className="grid gap-6">
          {/* otsikko */}
          <h2 className="text-2xl font-bold text-gray-800">Popular Tasks</h2>
          {/* painikelista */}
          <div className="flex flex-wrap gap-4">
            {[
              ["cleaning_services", "Home Cleaning"],
              ["local_florist", "Gardening"],
              ["support_agent", "Tech Support"],
              ["pets", "Pet Sitting"],
              ["local_car_wash", "Car Washing"],
              ["build", "Furniture Assembly"],
            ].map(([icon, label]) => (
              <a
                key={label}
                href="#"
                className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-100 hover:border-green-400 transition"
              >
                <span className="material-icons mr-2 text-green-400">
                  {icon}
                </span>
                <span className="font-medium text-gray-800">{label}</span>
              </a>
            ))}
          </div>
        </section>
      </main>

      {/* alatunniste */}
      <footer className="bg-gray-100 border-t border-gray-200">
        <div className="container mx-auto px-6 py-6 text-sm text-gray-600">
          {/* alatunnisteen sisältö */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              <a href="#" className="hover:text-green-400">
                About
              </a>
              <a href="#" className="hover:text-green-400">
                Contact
              </a>
              <a href="#" className="hover:text-green-400">
                Terms of Service
              </a>
              <a href="#" className="hover:text-green-400">
                Privacy Policy
              </a>
            </div>
            <div>
              <p>© 2025 WorkerApp. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}
