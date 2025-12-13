import { memo } from "react";
import type { Category } from "../types";
import { getCategoryIcon } from "../utils/categoryUtils";

interface CategoryFilterProps {
  selectedCategories: string[];
  onToggle: (category: string) => void;
}

const ALL_CATEGORIES: Category[] = [
  "Cleaning",
  "Garden",
  "Moving",
  "Other",
  "Yard",
  "Forest work",
  "Household",
  "Repair",
  "Painting",
  "Snow removal",
];

export const CategoryFilter = memo(function CategoryFilter({ selectedCategories, onToggle }: CategoryFilterProps) {
  return (
    <div className="mb-4 border-b border-gray-200 pb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">
        Kategoriat {selectedCategories.length > 0 && `(${selectedCategories.length} valittu)`}
      </h3>

      <div className="mt-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {ALL_CATEGORIES.map((category) => (
          <label
            key={category}
            className="flex items-center space-x-2 cursor-pointer hover:bg-green-50 p-2 rounded transition-colors"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggle(category);
            }}
          >
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              readOnly
              className="w-4 h-4 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500 accent-green-600"
            />
            <span
              className={`material-icons text-lg ${selectedCategories.includes(category) ? "text-green-600" : "text-gray-400"}`}
            >
              {getCategoryIcon(category)}
            </span>
            <span className="text-sm">{category}</span>
          </label>
        ))}
      </div>
    </div>
  );
});
