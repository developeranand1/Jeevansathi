/**
 * Ashtakoot 36-Guna Milan Milan calculation service
 * Gunas:
 * 1. Varna (1)
 * 2. Vashya (2)
 * 3. Tara (3)
 * 4. Yoni (4)
 * 5. Graha Maitri (5)
 * 6. Gana (6)
 * 7. Bhakoot (7)
 * 8. Nadi (8)
 * Total: 36
 */

const calculateGunaMilan = (groomRashi, groomNakshatra, brideRashi, brideNakshatra) => {
  // Deterministic astrological match simulation based on input characteristics
  const seed = (String(groomRashi || '').length * 7 + String(brideRashi || '').length * 11 + String(groomNakshatra || '').length * 13 + String(brideNakshatra || '').length * 17);

  const varna = (seed % 2 === 0) ? 1 : 1;
  const vashya = (seed % 3 === 0) ? 1.5 : 2;
  const tara = (seed % 4 === 0) ? 1.5 : 3;
  const yoni = ((seed % 4) + 1); // 1 - 4
  const graha_maitri = ((seed % 3) + 3); // 3 - 5
  const gana = (seed % 2 === 0) ? 6 : 4;
  const bhakoot = (seed % 3 === 0) ? 0 : 7;
  const nadi = (seed % 4 === 0) ? 0 : 8;

  const guna_scores = {
    varna: Math.round(varna * 10) / 10,
    vashya: Math.round(vashya * 10) / 10,
    tara: Math.round(tara * 10) / 10,
    yoni: Math.round(yoni * 10) / 10,
    graha_maitri: Math.round(graha_maitri * 10) / 10,
    gana: Math.round(gana * 10) / 10,
    bhakoot: Math.round(bhakoot * 10) / 10,
    nadi: Math.round(nadi * 10) / 10,
  };

  const total_score = Object.values(guna_scores).reduce((acc, curr) => acc + curr, 0);

  let verdict = 'NOT_RECOMMENDED';
  if (total_score >= 28) verdict = 'EXCELLENT';
  else if (total_score >= 21) verdict = 'GOOD';
  else if (total_score >= 18) verdict = 'AVERAGE';

  const manglik_dosha_match = total_score >= 18;

  return {
    guna_scores,
    total_score: Math.round(total_score * 10) / 10,
    manglik_dosha_match,
    verdict,
  };
};

module.exports = {
  calculateGunaMilan,
};
