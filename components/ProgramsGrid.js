import React from 'react';
import styles from '../styles/ProgramsGrid.module.css';

const ProgramsGrid = ({ programs }) => {
  if (programs.length === 0) {
    return <p className={styles.noPrograms}>No programs available.</p>;
  }

  return (
    <div className={styles.grid}>
      {programs.map((program, index) => (
        <div 
          key={program.id ? program.id : `program-${index}`} 
          className={styles.programCard}
        >
          <h3>{program.name}</h3>
          <p>ID: {program.id}</p>
          {/* Add other program details as needed */}
        </div>
      ))}
    </div>
  );
};

export default ProgramsGrid;
