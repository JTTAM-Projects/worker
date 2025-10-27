import { memo } from 'react';

interface PriceRangeInputProps {
  minPrice: string;
  maxPrice: string;
  minPriceSlider: number;
  maxPriceSlider: number;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onMinSliderChange: (value: number) => void;
  onMaxSliderChange: (value: number) => void;
}

export const PriceRangeInput = memo(function PriceRangeInput({
  minPrice,
  maxPrice,
  minPriceSlider,
  maxPriceSlider,
  onMinPriceChange,
  onMaxPriceChange,
  onMinSliderChange,
  onMaxSliderChange,
}: PriceRangeInputProps) {
  // Clamp slider values to valid range for visual display
  const clampedMin = Math.max(0, Math.min(500, minPriceSlider));
  const clampedMax = Math.max(0, Math.min(500, maxPriceSlider));
  
  return (
    <div className="mb-4 border-b border-gray-200 pb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">
        Hinta {(minPrice || maxPrice) && `(€${minPrice || '0'} - €${maxPrice || '∞'})`}
      </h3>
      
      <div className="mt-3 space-y-4">
        {/* Input boxes */}
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="number"
              value={minPrice}
              onChange={(e) => onMinPriceChange(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="Min €"
              min="0"
              max="500"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <span className="text-gray-500">-</span>
          <div className="flex-1">
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="Max €"
              min="0"
              max="500"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        {/* Dual-handle slider */}
        <div className="relative px-2">
          <div className="relative h-2">
            {/* Track background */}
            <div className="absolute w-full h-2 bg-gray-200 rounded-full"></div>
            
            {/* Active range track */}
            <div 
              className="absolute h-2 bg-green-500 rounded-full"
              style={{
                left: `${(clampedMin / 500) * 100}%`,
                right: `${100 - (clampedMax / 500) * 100}%`
              }}
            ></div>
            
            {/* Min slider */}
            <input
              type="range"
              min="0"
              max="500"
              step="5"
              value={clampedMin}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value <= maxPriceSlider) {
                  onMinSliderChange(value);
                }
              }}
              className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-green-600 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
              style={{ zIndex: clampedMin > 500 - clampedMax ? 5 : 3 }}
            />
            
            {/* Max slider */}
            <input
              type="range"
              min="0"
              max="500"
              step="5"
              value={clampedMax}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value >= minPriceSlider) {
                  onMaxSliderChange(value);
                }
              }}
              className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-green-600 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
              style={{ zIndex: clampedMax <= 500 - clampedMin ? 5 : 3 }}
            />
          </div>
          
          {/* Tick marks and labels */}
          <div className="relative flex justify-between mt-2 text-xs text-gray-600">
            <span>€0</span>
            <span>€100</span>
            <span>€200</span>
            <span>€300</span>
            <span>€400</span>
            <span>€500</span>
          </div>
        </div>
      </div>
    </div>
  );
});
