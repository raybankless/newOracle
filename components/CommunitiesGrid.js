import React from "react";
import styles from "../styles/CommunitiesGrid.module.css"; // Ensure you have this CSS file

const CommunitiesGrid = ({ communities }) => {
  return (
    <div className={styles.communitiesGrid}>
      {communities.map((community) => (
        <div key={community._id} className={styles.communityCard}>
          <img src={community.image || "defaultCommunityImage.jpg"} alt={community.name} className={styles.communityImage} />
          <div className={styles.communityInfo}>
            <span className={styles.communityName}>{community.name}</span>
            {/* You can add more details you want to show for each community */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommunitiesGrid;
