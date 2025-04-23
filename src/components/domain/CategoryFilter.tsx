import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  onSelectCategory
}) => {
  return (
    <div className="flex flex-wrap gap-2 md:gap-4">
      {categories.map(category => (
        <button
          key={category}
          className={`px-4 py-2 rounded-md transition-colors ${
            category === activeCategory
              ? 'bg-gray-800 text-white'
              : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white'
          }`}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;