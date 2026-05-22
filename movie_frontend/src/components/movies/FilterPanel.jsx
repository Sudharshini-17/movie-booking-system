import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from './FilterPanel.module.css';

const FilterSection = ({ title, options, selected, onChange, isLoading }) => {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <div className={styles.section}>
      <button 
        className={styles.sectionHeader} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.sectionTitle}>{title}</span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      
      {isOpen && (
        <div className={styles.optionsList}>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={styles.skeletonOption}></div>
            ))
          ) : (
            options.map(option => (
              <label key={option.name} className={styles.optionLabel}>
                <div className={styles.checkboxWrapper}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={selected.includes(option.name)}
                    onChange={() => onChange(option.name)}
                  />
                  <span className={styles.checkboxCustom}></span>
                </div>
                <span className={styles.optionName}>{option.name}</span>
                <span className={styles.optionCount}>{option.count}</span>
              </label>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const FilterPanel = ({ 
  genres, 
  languages, 
  selectedGenres, 
  selectedLanguages, 
  onGenreChange, 
  onLanguageChange,
  isLoading 
}) => {
  const hasFilters = selectedGenres.length > 0 || selectedLanguages.length > 0;

  const handleClearFilters = () => {
    // We would need a function passed from parent, or handle individually
    selectedGenres.forEach(g => onGenreChange(g));
    selectedLanguages.forEach(l => onLanguageChange(l));
  };

  return (
    <div className={`glass-panel ${styles.panel}`}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Filters</h2>
        {hasFilters && (
          <button className={styles.clearBtn} onClick={handleClearFilters}>
            Clear
          </button>
        )}
      </div>
      
      <FilterSection 
        title="Genres" 
        options={genres} 
        selected={selectedGenres}
        onChange={onGenreChange}
        isLoading={isLoading}
      />
      
      <FilterSection 
        title="Languages" 
        options={languages} 
        selected={selectedLanguages}
        onChange={onLanguageChange}
        isLoading={isLoading}
      />
    </div>
  );
};

export default FilterPanel;
