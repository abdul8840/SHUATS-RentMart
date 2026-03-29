const TrustBadge = ({ score }) => {
  const getTrustLevel = (s) => {
    if (s >= 90) return { level: 'Excellent', color: 'green', emoji: '⭐⭐⭐⭐⭐' };
    if (s >= 75) return { level: 'Very Good', color: 'blue', emoji: '⭐⭐⭐⭐' };
    if (s >= 60) return { level: 'Good', color: 'teal', emoji: '⭐⭐⭐' };
    if (s >= 40) return { level: 'Average', color: 'yellow', emoji: '⭐⭐' };
    if (s >= 20) return { level: 'Below Average', color: 'orange', emoji: '⭐' };
    return { level: 'New User', color: 'gray', emoji: '🆕' };
  };

  const trust = getTrustLevel(score);

  return (
    <div>
      <span>{trust.emoji}</span>
      <span>{trust.level}</span>
      <span>({score}/100)</span>
    </div>
  );
};

export default TrustBadge;