// pages/communities/[safeWallet].js

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const CommunityDetails = () => {
  const router = useRouter();
  const { safeWallet } = router.query;
  const [community, setCommunity] = useState(null);

  useEffect(() => {
    const fetchCommunityDetails = async () => {
      try {
        const res = await fetch(`/api/communities/${safeWallet}`);
        const { data } = await res.json();
        setCommunity(data);
      } catch (error) {
        console.error('Failed to fetch community details:', error);
      }
    };

    if (safeWallet) fetchCommunityDetails();
  }, [safeWallet]);

  if (!community) return <p>Loading...</p>;

  return (
    <div>
      <h1>{community.name}</h1>
      <img src={community.image} alt={community.name} />
      <p>{community.description}</p>
    </div>
  );
};

export default CommunityDetails;
