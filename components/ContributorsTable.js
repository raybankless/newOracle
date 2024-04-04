import React from 'react';
import styles from '../styles/ContributorsTable.module.css';

const ContributorsTable = ({ contributors, creatorWallet }) => {
  const shortenWallet = (wallet) => `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;

return (
    <table className={styles.contributorsTable}>

      <tbody>
        {contributors.map((contributor) => (
          <tr key={contributor.wallet}>
            <td className={`${styles.avatar}`}>
              <img
                src={`https://source.boringavatars.com/beam/28/${contributor.wallet}?colors=CCCC66,A8BF73,80B380,80B380,34999B`}
                alt="Avatar"
                className={`${styles.avatarImg}`}
              />
            </td>
            <td className={`${styles.wallet}`}>
              {shortenWallet(contributor.wallet)}
              {contributor.wallet === creatorWallet ? ' - EF -' : ''}
            </td>
            <td>{contributor.measurement}</td>
            <td>{contributor.unit}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ContributorsTable;