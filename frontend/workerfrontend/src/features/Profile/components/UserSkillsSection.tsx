export default function ProfileSkillsSection() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Taidot</h2>
      <div className="flex flex-wrap gap-3">
        <span className="bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-full">
          Puutarhatyöt
        </span>
        <span className="bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-full">
          Siivoustyöt
        </span>
        <span className="bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-full">
          Muuttoapu
        </span>
        <span className="bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-full">
          Kodin pienet korjaukset
        </span>
        <span className="bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-full">
          Huonekalujen kokoonpano
        </span>
        <span className="bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-full">
          Maalaustöt
        </span>
      </div>
    </div>
  );
}
