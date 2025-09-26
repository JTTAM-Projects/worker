import { Link } from "react-router-dom";

export default function TaskerPromoCard() {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 hover:bg-gray-100 hover:border-green-400 hover:shadow-md transition duration-200 h-96 flex flex-col items-center justify-center text-center">
      <span className="material-icons text-green-400 text-4xl mb-4">
        person
      </span>
      <h3 className="font-bold text-2xl text-gray-800 mb-4">Työntekijälle</h3>
      <p className="text-gray-600 max-w-xs mb-6">
        Selaa avoimia tehtäviä ja ansaitse rahaa omilla taidoillasi.
      </p>
      <Link
        to="/tasks"
        className="bg-green-500 text-white px-6 py-3 rounded-md font-medium hover:bg-green-600"
      >
        Hae tehtäviä
      </Link>
    </div>
  );
}
