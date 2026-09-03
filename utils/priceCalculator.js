const fabricRates = {

  cotton: 80,

  denim: 150,

  wool: 200,

  silk: 300,

  polyester: 60,

  leather: 400,

  linen: 180,
};

// ======================================================
// CONDITION BONUS / PENALTY
// ======================================================
const conditionBonus = {

  like_new: 0.40,

  good: 0.20,

  average: 0.05,

  damaged: -0.30,
};

// ======================================================
// BRAND BONUS
// ======================================================
const brandBonus = {

  nike: 200,

  adidas: 150,

  zara: 180,

  puma: 120,

  levis: 220,

  gucci: 500,

  louis: 700,
};

// ======================================================
// PRICE CALCULATOR
// ======================================================
const calculatePrice = (cloth) => {

  // ================= FABRIC RATE =================
  const rate =
    fabricRates[
      cloth.fabricType?.toLowerCase()
    ] || 50;

  // ================= BASE PRICE =================
  let basePrice =
    cloth.weight * rate;

  // ================= CONDITION =================
  const conditionValue =
    conditionBonus[
      cloth.condition?.toLowerCase()
    ] || 0;

  let finalPrice =
    basePrice +
    basePrice * conditionValue;

  // ================= BRAND BONUS =================
  const brand =
    cloth.brand?.toLowerCase() || "";

  Object.keys(brandBonus).forEach(
    (brandName) => {

      if (
        brand.includes(brandName)
      ) {

        finalPrice +=
          brandBonus[brandName];
      }
    }
  );

  // ================= DAMAGE PENALTY =================
  const damageLevel =
    Number(cloth.damageLevel) || 0;

  finalPrice -=
    damageLevel * 20;

  // ================= AGE PENALTY =================
  const ageOfCloth =
    Number(cloth.ageOfCloth) || 0;

  finalPrice -=
    ageOfCloth * 10;

  // ================= MINIMUM PRICE =================
  if (finalPrice < 50) {

    finalPrice = 50;
  }

  // ================= ROUND PRICE =================
  return Math.round(finalPrice);
};

module.exports = calculatePrice;