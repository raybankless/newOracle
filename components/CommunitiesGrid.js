// components/CommunitiesGrid.js
import styles from '../styles/CommunitiesGrid.module.css';
const CommunitiesGrid = ({ communities, onCommunitySelect }) => {
  return (
    <div className={styles.communitiesGrid}>
      {communities.map((community) => (
        <div key={community._id} className={styles.communityCard} onClick={() => onCommunitySelect(community.safeWallet)}>
          <img src={community.image || "defaultCommunityImage.jpg"} alt={community.name} className={styles.communityImage} />
          <div className={styles.communityInfo}>
            <span className={styles.communityName}>{community.name}</span>
            {/* Additional community info here */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommunitiesGrid;
