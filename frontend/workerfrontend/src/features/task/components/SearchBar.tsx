interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="Hae tehtäviä..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-400 focus:border-green-400"
      />
    </div>
  );
}
