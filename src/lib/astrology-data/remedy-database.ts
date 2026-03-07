/* ════════════════════════════════════════════════════════
   GrahAI — Comprehensive Vedic Remedy Database

   Every remedy backed by classical sources (BPHS, Lal Kitab,
   Saravali, Phaladeepika). Includes gemstones, mantras,
   fasting, charity, rudraksha, yantras, and dosha-specific
   remedial protocols.
   ════════════════════════════════════════════════════════ */

import type { PlanetName, DoshaType, Remedy, RemedyType, ClassicalReference } from "../ephemeris/types"

// ─── Per-Planet Remedy Database ──────────────────────────

export interface PlanetRemedySet {
  planet: PlanetName
  gemstone: GemstoneRemedy
  mantra: MantraRemedy
  fasting: FastingRemedy
  charity: CharityRemedy
  rudraksha: RudrakshaRemedy
  yantra: YantraRemedy
  color: string
  metal: string
  direction: string
  deity: string
}

export interface GemstoneRemedy {
  name: string
  nameHindi: string
  alternates: string[]
  caratMin: number
  caratRecommended: number
  metal: string
  finger: string
  hand: string
  wearingDay: string
  wearingNakshatra?: string
  wearingTime: string
  energizationMantra: string
  energizationCount: number
  precautions: string[]
  benefits: string[]
  reference: ClassicalReference
}

export interface MantraRemedy {
  beejMantra: string
  beejCount: number
  gayatriMantra: string
  gayatriCount: number
  stotram?: string
  chantingTime: string
  chantingDay: string
  maalaType: string
  totalJapaCount: number
  benefits: string[]
  reference: ClassicalReference
}

export interface FastingRemedy {
  day: string
  type: "complete" | "partial" | "fruit"
  allowedFoods: string[]
  avoidFoods: string[]
  breakFastTime: string
  duration: string
  benefits: string[]
}

export interface CharityRemedy {
  items: string[]
  donateToWhom: string
  day: string
  time: string
  direction: string
  frequency: string
  benefits: string[]
}

export interface RudrakshaRemedy {
  mukhi: number
  name: string
  deity: string
  benefits: string[]
  wearingDay: string
  mantra: string
}

export interface YantraRemedy {
  name: string
  material: string
  placement: string
  energization: string
  benefits: string[]
}

// ─── Planet Remedies ────────────────────────────────────

export const PLANET_REMEDIES: Record<PlanetName, PlanetRemedySet> = {
  Sun: {
    planet: "Sun",
    color: "Ruby Red / Copper",
    metal: "Gold / Copper",
    direction: "East",
    deity: "Lord Surya (Sun God)",
    gemstone: {
      name: "Ruby",
      nameHindi: "Manik",
      alternates: ["Red Garnet", "Red Spinel", "Sunstone"],
      caratMin: 3,
      caratRecommended: 5,
      metal: "Gold",
      finger: "Ring Finger",
      hand: "Right",
      wearingDay: "Sunday",
      wearingTime: "Morning during Sunrise (6-7 AM)",
      energizationMantra: "Om Hraam Hreem Hraum Sah Suryaya Namah",
      energizationCount: 7000,
      precautions: [
        "Avoid if Mars is also afflicted — may increase aggression",
        "Not recommended during Sun Mahadasha if Sun is 6th/8th/12th lord",
        "Ensure Ruby is untreated and natural",
      ],
      benefits: [
        "Strengthens confidence, authority, and leadership",
        "Improves relationship with father and government",
        "Enhances vitality, bone health, and eyesight",
      ],
      reference: { source: "Jataka Parijata", chapter: 2, verse: 21, translation: "Ruby, the gemstone of the Sun, bestows authority, health, and victory over enemies when worn on the ring finger in gold on Sunday." },
    },
    mantra: {
      beejMantra: "Om Hraam Hreem Hraum Sah Suryaya Namah",
      beejCount: 7000,
      gayatriMantra: "Om Bhaskaraya Vidmahe Mahadyutikaraya Dheemahi Tanno Aditya Prachodayat",
      gayatriCount: 6000,
      stotram: "Aditya Hridaya Stotram",
      chantingTime: "Sunrise (Brahma Muhurta or within 1 hour of sunrise)",
      chantingDay: "Sunday",
      maalaType: "Sphatik (Crystal) or Rudraksha",
      totalJapaCount: 7000,
      benefits: [
        "Removes Pitra Dosha effects related to Sun",
        "Strengthens the soul (Atma Karaka)",
        "Brings recognition and government favors",
      ],
      reference: { source: "BPHS", chapter: 97, verse: 3, translation: "The Beej Mantra of the Sun, chanted 7000 times, pacifies solar afflictions and grants authority." },
    },
    fasting: {
      day: "Sunday",
      type: "partial",
      allowedFoods: ["Wheat", "Jaggery", "Fruits", "Milk"],
      avoidFoods: ["Salt", "Oil", "Non-vegetarian food"],
      breakFastTime: "After sunset",
      duration: "Sunrise to Sunset",
      benefits: ["Strengthens Sun", "Improves health and vitality", "Blesses paternal lineage"],
    },
    charity: {
      items: ["Wheat", "Jaggery (Gur)", "Copper utensils", "Red cloth", "Red flowers"],
      donateToWhom: "Temple priest or elderly father figure",
      day: "Sunday",
      time: "Before noon",
      direction: "East",
      frequency: "Every Sunday for 12 weeks",
      benefits: ["Pacifies afflicted Sun", "Reduces ego-related conflicts", "Improves government relations"],
    },
    rudraksha: {
      mukhi: 12,
      name: "12 Mukhi Rudraksha (Dwadash Aditya)",
      deity: "Surya (Sun God)",
      benefits: ["Enhances leadership", "Removes fear of authority", "Gives radiance"],
      wearingDay: "Sunday",
      mantra: "Om Kraum Sraum Raum Namah",
    },
    yantra: {
      name: "Surya Yantra",
      material: "Copper plate",
      placement: "East wall of home or puja room",
      energization: "Chant Surya Beej Mantra 108 times on Sunday morning",
      benefits: ["Removes Sun-related obstacles", "Brings fame and authority"],
    },
  },

  Moon: {
    planet: "Moon",
    color: "White / Silver",
    metal: "Silver",
    direction: "North-West",
    deity: "Lord Chandra (Moon God)",
    gemstone: {
      name: "Pearl",
      nameHindi: "Moti",
      alternates: ["Moonstone", "White Coral"],
      caratMin: 4,
      caratRecommended: 6,
      metal: "Silver",
      finger: "Little Finger",
      hand: "Right",
      wearingDay: "Monday",
      wearingTime: "Evening during Moonrise",
      energizationMantra: "Om Shraam Shreem Shraum Sah Chandraya Namah",
      energizationCount: 11000,
      precautions: [
        "Avoid if Moon is lord of 6th/8th/12th and afflicted",
        "Natural undrilled pearl preferred",
        "Avoid during waning Moon (Krishna Paksha) for wearing first time",
      ],
      benefits: [
        "Calms the mind and emotions",
        "Improves relationship with mother",
        "Enhances intuition and mental peace",
      ],
      reference: { source: "BPHS", chapter: 97, verse: 5, translation: "Pearl set in silver strengthens the Moon, bringing mental peace, emotional balance, and maternal blessings." },
    },
    mantra: {
      beejMantra: "Om Shraam Shreem Shraum Sah Chandraya Namah",
      beejCount: 11000,
      gayatriMantra: "Om Kshirputraya Vidmahe Amrittatvaya Dheemahi Tanno Chandrah Prachodayat",
      gayatriCount: 10000,
      stotram: "Chandra Kavacham",
      chantingTime: "Evening (after sunset) or Monday morning",
      chantingDay: "Monday",
      maalaType: "Sphatik (Crystal) mala",
      totalJapaCount: 11000,
      benefits: [
        "Alleviates depression and anxiety",
        "Strengthens the mind (Manas)",
        "Removes emotional instability",
      ],
      reference: { source: "BPHS", chapter: 97, verse: 5, translation: "The Beej Mantra of the Moon chanted 11000 times pacifies lunar afflictions." },
    },
    fasting: {
      day: "Monday",
      type: "partial",
      allowedFoods: ["Rice", "Milk", "White foods", "Fruits"],
      avoidFoods: ["Salt", "Non-vegetarian food", "Alcohol"],
      breakFastTime: "After seeing the Moon (or after 8 PM)",
      duration: "Sunrise to Moonrise",
      benefits: ["Strengthens Moon", "Emotional stability", "Better sleep"],
    },
    charity: {
      items: ["Rice", "Milk", "White cloth", "Silver", "Camphor", "White flowers"],
      donateToWhom: "Women, especially elderly women or mother figures",
      day: "Monday",
      time: "Evening",
      direction: "North-West",
      frequency: "Every Monday for 11 weeks",
      benefits: ["Pacifies afflicted Moon", "Emotional healing", "Mental clarity"],
    },
    rudraksha: {
      mukhi: 2,
      name: "2 Mukhi Rudraksha (Ardhanarishwara)",
      deity: "Chandra (Moon) / Ardhanarishwara",
      benefits: ["Emotional balance", "Unity in relationships", "Peace of mind"],
      wearingDay: "Monday",
      mantra: "Om Namah",
    },
    yantra: {
      name: "Chandra Yantra",
      material: "Silver plate",
      placement: "North-West wall or bedroom",
      energization: "Chant Chandra Beej Mantra 108 times on Monday evening",
      benefits: ["Removes Moon-related afflictions", "Brings emotional stability"],
    },
  },

  Mars: {
    planet: "Mars",
    color: "Red / Coral",
    metal: "Copper / Gold",
    direction: "South",
    deity: "Lord Hanuman / Kartikeya",
    gemstone: {
      name: "Red Coral",
      nameHindi: "Moonga",
      alternates: ["Carnelian", "Red Jasper"],
      caratMin: 5,
      caratRecommended: 7,
      metal: "Gold or Copper",
      finger: "Ring Finger",
      hand: "Right",
      wearingDay: "Tuesday",
      wearingTime: "Morning within 1 hour of sunrise",
      energizationMantra: "Om Kraam Kreem Kraum Sah Bhaumaya Namah",
      energizationCount: 7000,
      precautions: [
        "Not recommended if Mars is malefic lord (6th/8th) for the Lagna",
        "Avoid if prone to anger or aggression — may amplify it",
        "Must be natural untreated coral from the sea",
      ],
      benefits: [
        "Increases courage and physical strength",
        "Protects from accidents and surgery",
        "Resolves property and land disputes",
      ],
      reference: { source: "Phaladeepika", chapter: 2, verse: 7, translation: "Red Coral strengthens Mars, granting courage, protection from enemies, and victory in disputes." },
    },
    mantra: {
      beejMantra: "Om Kraam Kreem Kraum Sah Bhaumaya Namah",
      beejCount: 7000,
      gayatriMantra: "Om Angarkaya Vidmahe Shaktihasthaya Dheemahi Tanno Bhaumah Prachodayat",
      gayatriCount: 10000,
      chantingTime: "Tuesday morning, Sunrise",
      chantingDay: "Tuesday",
      maalaType: "Red Coral or Rudraksha mala",
      totalJapaCount: 10000,
      benefits: [
        "Reduces Mangal Dosha effects",
        "Strengthens courage and determination",
        "Protects from blood-related diseases",
      ],
      reference: { source: "BPHS", chapter: 97, verse: 7, translation: "Mars' Beej Mantra chanted 7000 times pacifies Mangal afflictions and Kuja Dosha." },
    },
    fasting: {
      day: "Tuesday",
      type: "partial",
      allowedFoods: ["Red lentils (Masoor Dal)", "Jaggery", "Wheat"],
      avoidFoods: ["Salt", "Non-vegetarian", "Alcohol"],
      breakFastTime: "After sunset",
      duration: "Sunrise to Sunset",
      benefits: ["Reduces Mangal Dosha", "Protects from accidents", "Improves property matters"],
    },
    charity: {
      items: ["Red lentils (Masoor Dal)", "Red cloth", "Copper items", "Sindoor", "Jaggery"],
      donateToWhom: "Young men, soldiers, or Hanuman temple",
      day: "Tuesday",
      time: "Morning before noon",
      direction: "South",
      frequency: "Every Tuesday for 21 weeks",
      benefits: ["Pacifies Mars", "Reduces aggression", "Resolves property disputes"],
    },
    rudraksha: {
      mukhi: 3,
      name: "3 Mukhi Rudraksha (Agni)",
      deity: "Agni (Fire God) / Mangal",
      benefits: ["Burns past karma", "Boosts self-confidence", "Controls anger"],
      wearingDay: "Tuesday",
      mantra: "Om Kleem Namah",
    },
    yantra: {
      name: "Mangal Yantra",
      material: "Copper plate",
      placement: "South wall of home",
      energization: "Chant Mangal Beej Mantra 108 times on Tuesday morning",
      benefits: ["Removes Mars-related obstacles", "Property protection"],
    },
  },

  Mercury: {
    planet: "Mercury",
    color: "Green",
    metal: "Bronze / Gold",
    direction: "North",
    deity: "Lord Vishnu",
    gemstone: {
      name: "Emerald",
      nameHindi: "Panna",
      alternates: ["Green Tourmaline", "Peridot", "Green Onyx"],
      caratMin: 3,
      caratRecommended: 5,
      metal: "Gold",
      finger: "Little Finger",
      hand: "Right",
      wearingDay: "Wednesday",
      wearingTime: "Morning 2 hours after sunrise",
      energizationMantra: "Om Braam Breem Braum Sah Budhaya Namah",
      energizationCount: 9000,
      precautions: [
        "Avoid if Mercury is combust and lord of 8th house",
        "Must be natural, untreated emerald",
        "Should not be cracked or have black spots",
      ],
      benefits: [
        "Enhances intelligence and communication",
        "Improves business and trade",
        "Strengthens nervous system",
      ],
      reference: { source: "BPHS", chapter: 97, verse: 9, translation: "Emerald strengthens Mercury, granting intelligence, eloquence, and success in commerce." },
    },
    mantra: {
      beejMantra: "Om Braam Breem Braum Sah Budhaya Namah",
      beejCount: 9000,
      gayatriMantra: "Om Gajadhvajaya Vidmahe Graharajaya Dheemahi Tanno Budhah Prachodayat",
      gayatriCount: 9000,
      chantingTime: "Wednesday morning, after sunrise",
      chantingDay: "Wednesday",
      maalaType: "Tulsi or Sphatik mala",
      totalJapaCount: 9000,
      benefits: [
        "Improves academic performance",
        "Enhances speech and writing ability",
        "Heals nervous system disorders",
      ],
      reference: { source: "BPHS", chapter: 97, verse: 9, translation: "Mercury's Beej Mantra chanted 9000 times grants wisdom and communication skills." },
    },
    fasting: {
      day: "Wednesday",
      type: "partial",
      allowedFoods: ["Green Moong Dal", "Green vegetables", "Fruits"],
      avoidFoods: ["Non-vegetarian food", "Alcohol"],
      breakFastTime: "After sunset",
      duration: "Sunrise to Sunset",
      benefits: ["Strengthens Mercury", "Improves intellect", "Better communication"],
    },
    charity: {
      items: ["Green Moong Dal", "Green cloth", "Green vegetables", "Bronze utensils"],
      donateToWhom: "Students, scholars, or Vishnu temple",
      day: "Wednesday",
      time: "Morning",
      direction: "North",
      frequency: "Every Wednesday for 21 weeks",
      benefits: ["Pacifies Mercury", "Academic success", "Business growth"],
    },
    rudraksha: {
      mukhi: 4,
      name: "4 Mukhi Rudraksha (Brahma)",
      deity: "Lord Brahma / Budh",
      benefits: ["Enhances wisdom", "Improves speech", "Academic success"],
      wearingDay: "Wednesday",
      mantra: "Om Hreem Namah",
    },
    yantra: {
      name: "Budh Yantra",
      material: "Bronze or copper plate",
      placement: "North wall or study room",
      energization: "Chant Budh Beej Mantra 108 times on Wednesday morning",
      benefits: ["Removes Mercury-related obstacles", "Academic and business success"],
    },
  },

  Jupiter: {
    planet: "Jupiter",
    color: "Yellow / Golden",
    metal: "Gold",
    direction: "North-East",
    deity: "Lord Brihaspati / Dakshinamurthy",
    gemstone: {
      name: "Yellow Sapphire",
      nameHindi: "Pukhraj",
      alternates: ["Yellow Topaz", "Citrine", "Yellow Beryl"],
      caratMin: 3,
      caratRecommended: 5,
      metal: "Gold",
      finger: "Index Finger",
      hand: "Right",
      wearingDay: "Thursday",
      wearingTime: "Morning during Jupiter Hora (within 2 hours of sunrise)",
      energizationMantra: "Om Graam Greem Graum Sah Gurave Namah",
      energizationCount: 19000,
      precautions: [
        "Avoid if Jupiter is functional malefic (Taurus, Gemini, Libra Lagna must be careful)",
        "Must be natural, eye-clean Yellow Sapphire",
        "Remove during eclipses",
      ],
      benefits: [
        "Brings wisdom, wealth, and divine grace",
        "Blesses marriage and children",
        "Strengthens dharma and spiritual growth",
      ],
      reference: { source: "BPHS", chapter: 97, verse: 11, translation: "Yellow Sapphire is the gemstone of Jupiter. Worn on the index finger in gold on Thursday, it grants wisdom, wealth, and progeny." },
    },
    mantra: {
      beejMantra: "Om Graam Greem Graum Sah Gurave Namah",
      beejCount: 19000,
      gayatriMantra: "Om Vrishabadhvajaya Vidmahe Grihasteshwaraya Dheemahi Tanno Guruh Prachodayat",
      gayatriCount: 16000,
      stotram: "Brihaspati Stotram / Guru Stotram",
      chantingTime: "Thursday morning, Brahma Muhurta or Sunrise",
      chantingDay: "Thursday",
      maalaType: "Turmeric (Haldi) or Rudraksha mala",
      totalJapaCount: 19000,
      benefits: [
        "Grants divine wisdom and grace",
        "Blesses with children and marriage",
        "Removes Guru Chandal Dosha",
      ],
      reference: { source: "BPHS", chapter: 97, verse: 11, translation: "Jupiter's Beej Mantra chanted 19000 times bestows wisdom and divine protection." },
    },
    fasting: {
      day: "Thursday",
      type: "partial",
      allowedFoods: ["Chana Dal", "Turmeric rice", "Yellow foods", "Banana"],
      avoidFoods: ["Non-vegetarian food", "Banana (some traditions say avoid)"],
      breakFastTime: "After sunset",
      duration: "Sunrise to Sunset",
      benefits: ["Strengthens Jupiter", "Blesses with wisdom", "Good for marriage prospects"],
    },
    charity: {
      items: ["Chana Dal", "Turmeric", "Yellow cloth", "Banana", "Gold", "Books"],
      donateToWhom: "Brahmins, teachers, Guru, or temple",
      day: "Thursday",
      time: "Morning before noon",
      direction: "North-East",
      frequency: "Every Thursday for 16 weeks",
      benefits: ["Pacifies Jupiter", "Brings spiritual growth", "Blesses children"],
    },
    rudraksha: {
      mukhi: 5,
      name: "5 Mukhi Rudraksha (Kalagni Rudra)",
      deity: "Lord Shiva (Kalagni Rudra) / Brihaspati",
      benefits: ["Spiritual growth", "Academic success", "General well-being"],
      wearingDay: "Thursday",
      mantra: "Om Hreem Namah",
    },
    yantra: {
      name: "Guru Yantra / Brihaspati Yantra",
      material: "Gold or copper plate",
      placement: "North-East wall or puja room",
      energization: "Chant Guru Beej Mantra 108 times on Thursday morning",
      benefits: ["Removes Jupiter-related obstacles", "Spiritual and material growth"],
    },
  },

  Venus: {
    planet: "Venus",
    color: "White / Multicolor / Pink",
    metal: "Silver / Platinum",
    direction: "South-East",
    deity: "Goddess Lakshmi / Shukracharya",
    gemstone: {
      name: "Diamond",
      nameHindi: "Heera",
      alternates: ["White Sapphire", "White Zircon", "Opal"],
      caratMin: 0.5,
      caratRecommended: 1,
      metal: "Platinum or White Gold",
      finger: "Middle Finger or Ring Finger",
      hand: "Right",
      wearingDay: "Friday",
      wearingTime: "Morning during Venus Hora",
      energizationMantra: "Om Draam Dreem Draum Sah Shukraya Namah",
      energizationCount: 16000,
      precautions: [
        "Avoid if Venus is lord of 6th/8th and heavily afflicted",
        "Never wear Diamond with Ruby — Venus and Sun are enemies",
        "Ensure stone is brilliant and flawless",
      ],
      benefits: [
        "Enhances love, beauty, and artistic talent",
        "Brings luxury, vehicles, and material comforts",
        "Improves married life and romantic relationships",
      ],
      reference: { source: "BPHS", chapter: 97, verse: 13, translation: "Diamond is the gemstone of Venus. It grants luxury, beauty, marital happiness, and artistic success." },
    },
    mantra: {
      beejMantra: "Om Draam Dreem Draum Sah Shukraya Namah",
      beejCount: 16000,
      gayatriMantra: "Om Aswadhwajaya Vidmahe Dhanurdhaaraya Dheemahi Tanno Shukrah Prachodayat",
      gayatriCount: 20000,
      stotram: "Shukra Kavacham",
      chantingTime: "Friday morning or evening",
      chantingDay: "Friday",
      maalaType: "Sphatik (Crystal) or Silver mala",
      totalJapaCount: 16000,
      benefits: [
        "Improves married life and love",
        "Brings material comforts and luxury",
        "Enhances creativity and artistic ability",
      ],
      reference: { source: "BPHS", chapter: 97, verse: 13, translation: "Venus' Beej Mantra chanted 16000 times brings love, beauty, and material prosperity." },
    },
    fasting: {
      day: "Friday",
      type: "partial",
      allowedFoods: ["White foods", "Kheer (rice pudding)", "Fruits", "Milk"],
      avoidFoods: ["Sour foods", "Non-vegetarian food"],
      breakFastTime: "After sunset",
      duration: "Sunrise to Sunset",
      benefits: ["Strengthens Venus", "Improves married life", "Brings luxury"],
    },
    charity: {
      items: ["White rice", "White cloth", "Silk cloth", "Perfume", "Sweets", "Silver"],
      donateToWhom: "Young women, brides, or Lakshmi temple",
      day: "Friday",
      time: "Morning or evening",
      direction: "South-East",
      frequency: "Every Friday for 20 weeks",
      benefits: ["Pacifies Venus", "Improves love life", "Material prosperity"],
    },
    rudraksha: {
      mukhi: 6,
      name: "6 Mukhi Rudraksha (Kartikeya)",
      deity: "Lord Kartikeya / Shukra",
      benefits: ["Enhances charisma", "Improves relationships", "Material comfort"],
      wearingDay: "Friday",
      mantra: "Om Hreem Hum Namah",
    },
    yantra: {
      name: "Shukra Yantra",
      material: "Silver plate",
      placement: "South-East wall or bedroom",
      energization: "Chant Shukra Beej Mantra 108 times on Friday",
      benefits: ["Removes Venus-related obstacles", "Blesses married life"],
    },
  },

  Saturn: {
    planet: "Saturn",
    color: "Black / Dark Blue / Navy",
    metal: "Iron / Steel",
    direction: "West",
    deity: "Lord Shani Dev / Lord Hanuman",
    gemstone: {
      name: "Blue Sapphire",
      nameHindi: "Neelam",
      alternates: ["Amethyst", "Lapis Lazuli", "Blue Spinel"],
      caratMin: 3,
      caratRecommended: 5,
      metal: "Iron, Silver, or Panchadhatu",
      finger: "Middle Finger",
      hand: "Right",
      wearingDay: "Saturday",
      wearingTime: "Evening during Saturn Hora",
      wearingNakshatra: "Pushya Nakshatra preferred",
      energizationMantra: "Om Praam Preem Praum Sah Shanaye Namah",
      energizationCount: 23000,
      precautions: [
        "MUST trial for 3 days before permanent wearing — Blue Sapphire can backfire",
        "Keep under pillow for 3 nights; if bad dreams or mishaps, do NOT wear",
        "Only wear if Saturn is Yogakaraka or beneficial in the chart",
        "Avoid if Saturn is lord of 8th and heavily afflicted",
      ],
      benefits: [
        "Rapid career advancement and discipline",
        "Protection during Sade Sati and Saturn transits",
        "Brings perseverance and long-term success",
      ],
      reference: { source: "BPHS", chapter: 97, verse: 15, translation: "Blue Sapphire must be worn with extreme caution. When suitable, it grants rapid success and protection from Saturn's malefic effects." },
    },
    mantra: {
      beejMantra: "Om Praam Preem Praum Sah Shanaye Namah",
      beejCount: 23000,
      gayatriMantra: "Om Sanaischaraya Vidmahe Sooryaputraya Dheemahi Tanno Mandah Prachodayat",
      gayatriCount: 19000,
      stotram: "Shani Stotram / Dashrath Krit Shani Stotra",
      chantingTime: "Saturday evening or during Saturn Hora",
      chantingDay: "Saturday",
      maalaType: "Iron or Rudraksha mala",
      totalJapaCount: 23000,
      benefits: [
        "Reduces Sade Sati effects",
        "Brings discipline and perseverance",
        "Removes delays and obstacles in career",
      ],
      reference: { source: "BPHS", chapter: 97, verse: 15, translation: "Saturn's Beej Mantra chanted 23000 times pacifies Shani and reduces Sade Sati suffering." },
    },
    fasting: {
      day: "Saturday",
      type: "partial",
      allowedFoods: ["Black Urad Dal", "Sesame (Til)", "Mustard oil foods"],
      avoidFoods: ["Salt (some traditions)", "Non-vegetarian food", "Alcohol"],
      breakFastTime: "After sunset or after seeing a star",
      duration: "Sunrise to Sunset",
      benefits: ["Pacifies Saturn", "Reduces Sade Sati effects", "Career growth"],
    },
    charity: {
      items: ["Black Urad Dal", "Sesame oil", "Iron items", "Black cloth", "Mustard oil", "Black sesame seeds"],
      donateToWhom: "Elderly, disabled, servants, or Shani temple",
      day: "Saturday",
      time: "Evening before sunset",
      direction: "West",
      frequency: "Every Saturday for 19 weeks",
      benefits: ["Pacifies Saturn", "Reduces karmic debts", "Removes delays"],
    },
    rudraksha: {
      mukhi: 7,
      name: "7 Mukhi Rudraksha (Anang Shiva)",
      deity: "Anang Shiva / Shani",
      benefits: ["Removes poverty", "Career success", "Reduces Saturn's malefic effects"],
      wearingDay: "Saturday",
      mantra: "Om Hum Namah",
    },
    yantra: {
      name: "Shani Yantra",
      material: "Iron plate",
      placement: "West wall of home",
      energization: "Chant Shani Beej Mantra 108 times on Saturday evening",
      benefits: ["Removes Saturn-related obstacles", "Career advancement"],
    },
  },

  Rahu: {
    planet: "Rahu",
    color: "Smoky / Ultraviolet / Dark Blue",
    metal: "Lead / Mixed metals (Ashtadhatu)",
    direction: "South-West",
    deity: "Goddess Durga / Saraswati",
    gemstone: {
      name: "Hessonite Garnet",
      nameHindi: "Gomed",
      alternates: ["Brown Zircon", "Spessartite Garnet"],
      caratMin: 5,
      caratRecommended: 7,
      metal: "Silver or Ashtadhatu (8-metal alloy)",
      finger: "Middle Finger",
      hand: "Right",
      wearingDay: "Saturday or Wednesday",
      wearingTime: "Evening during Rahu Kaal (varies by day)",
      energizationMantra: "Om Bhraam Bhreem Bhraum Sah Rahave Namah",
      energizationCount: 18000,
      precautions: [
        "Only wear if Rahu is Yogakaraka or in beneficial position",
        "Avoid during Rahu Mahadasha if Rahu is severely afflicted",
        "Must be natural Gomed without cracks",
      ],
      benefits: [
        "Overcomes Rahu's confusion and illusion",
        "Success in foreign lands and technology",
        "Protection from black magic and psychic attacks",
      ],
      reference: { source: "Lal Kitab", chapter: 12, verse: 5, translation: "Gomed pacifies Rahu's shadow influence, bringing clarity and protection from unseen forces." },
    },
    mantra: {
      beejMantra: "Om Bhraam Bhreem Bhraum Sah Rahave Namah",
      beejCount: 18000,
      gayatriMantra: "Om Naagadhwajaya Vidmahe Padmahastaya Dheemahi Tanno Rahu Prachodayat",
      gayatriCount: 18000,
      stotram: "Rahu Kavacham",
      chantingTime: "During Rahu Kaal or Saturday evening",
      chantingDay: "Saturday",
      maalaType: "Sphatik or Rudraksha mala",
      totalJapaCount: 18000,
      benefits: [
        "Removes Kaal Sarp Dosha effects",
        "Overcomes sudden obstacles and confusion",
        "Success in foreign connections",
      ],
      reference: { source: "BPHS", chapter: 97, verse: 17, translation: "Rahu's Beej Mantra chanted 18000 times removes shadow planet afflictions." },
    },
    fasting: {
      day: "Saturday",
      type: "partial",
      allowedFoods: ["Black Urad Dal", "Coconut", "Fruits"],
      avoidFoods: ["Non-vegetarian food", "Alcohol", "Tobacco"],
      breakFastTime: "After sunset",
      duration: "Sunrise to Sunset",
      benefits: ["Pacifies Rahu", "Removes Kaal Sarp effects", "Clarity of mind"],
    },
    charity: {
      items: ["Coconut", "Blue/black cloth", "Mustard seeds", "Blankets", "Mixed grains (Saptrishi Dal)"],
      donateToWhom: "Outcaste, homeless, or leprosy patients",
      day: "Saturday or Wednesday",
      time: "Evening",
      direction: "South-West",
      frequency: "Every Saturday for 18 weeks",
      benefits: ["Pacifies Rahu", "Removes sudden obstacles", "Overcomes phobias"],
    },
    rudraksha: {
      mukhi: 8,
      name: "8 Mukhi Rudraksha (Vinayaka)",
      deity: "Lord Ganesha / Rahu",
      benefits: ["Removes obstacles", "Success in ventures", "Protection from Rahu afflictions"],
      wearingDay: "Saturday",
      mantra: "Om Hum Namah",
    },
    yantra: {
      name: "Rahu Yantra",
      material: "Ashtadhatu (8-metal alloy) plate",
      placement: "South-West wall",
      energization: "Chant Rahu Beej Mantra 108 times during Rahu Kaal on Saturday",
      benefits: ["Removes Rahu-related obstacles", "Protection from psychic issues"],
    },
  },

  Ketu: {
    planet: "Ketu",
    color: "Grey / Smoky / Brown",
    metal: "Iron / Mixed metals",
    direction: "North-East (spiritual direction)",
    deity: "Lord Ganesha / Chitragupta",
    gemstone: {
      name: "Cat's Eye",
      nameHindi: "Lehsunia / Vaidurya",
      alternates: ["Tiger's Eye", "Chrysoberyl"],
      caratMin: 3,
      caratRecommended: 5,
      metal: "Silver or Ashtadhatu",
      finger: "Middle Finger or Ring Finger",
      hand: "Right",
      wearingDay: "Thursday or Saturday",
      wearingTime: "Evening",
      energizationMantra: "Om Sraam Sreem Sraum Sah Ketave Namah",
      energizationCount: 7000,
      precautions: [
        "Trial period of 3 days recommended (like Blue Sapphire)",
        "Avoid if Ketu is in 8th house with malefic aspects",
        "Must show clear chatoyancy (cat's eye effect)",
      ],
      benefits: [
        "Enhances spiritual insight and moksha path",
        "Protection from accidents and hidden enemies",
        "Removes Ketu-related confusion and detachment",
      ],
      reference: { source: "BPHS", chapter: 97, verse: 19, translation: "Cat's Eye strengthens Ketu, granting spiritual insight, protection, and liberation from karmic bondage." },
    },
    mantra: {
      beejMantra: "Om Sraam Sreem Sraum Sah Ketave Namah",
      beejCount: 7000,
      gayatriMantra: "Om Ashwadwajaya Vidmahe Soola Hasthaya Dheemahi Tanno Ketu Prachodayat",
      gayatriCount: 7000,
      stotram: "Ketu Kavacham",
      chantingTime: "Tuesday or Thursday evening",
      chantingDay: "Tuesday",
      maalaType: "Rudraksha mala (9 Mukhi preferred)",
      totalJapaCount: 7000,
      benefits: [
        "Spiritual liberation and moksha",
        "Protection from psychic disturbances",
        "Removes past-life karmic blocks",
      ],
      reference: { source: "BPHS", chapter: 97, verse: 19, translation: "Ketu's Beej Mantra chanted 7000 times removes karmic blocks and accelerates spiritual progress." },
    },
    fasting: {
      day: "Tuesday or Saturday",
      type: "partial",
      allowedFoods: ["Sesame seeds", "Mixed grains", "Fruits"],
      avoidFoods: ["Non-vegetarian food", "Alcohol"],
      breakFastTime: "After sunset",
      duration: "Sunrise to Sunset",
      benefits: ["Pacifies Ketu", "Spiritual growth", "Removes past-life obstacles"],
    },
    charity: {
      items: ["Sesame seeds", "Mixed-color blanket", "Dog food", "Seven grains", "Grey/brown cloth"],
      donateToWhom: "Sadhus (holy men), dogs, or spiritual institutions",
      day: "Tuesday or Saturday",
      time: "Evening",
      direction: "North-East (toward spiritual centers)",
      frequency: "Every Tuesday for 7 weeks",
      benefits: ["Pacifies Ketu", "Removes past-life karma", "Spiritual advancement"],
    },
    rudraksha: {
      mukhi: 9,
      name: "9 Mukhi Rudraksha (Durga)",
      deity: "Goddess Durga / Ketu",
      benefits: ["Spiritual protection", "Removes fear", "Past-life karma resolution"],
      wearingDay: "Tuesday",
      mantra: "Om Hreem Hum Namah",
    },
    yantra: {
      name: "Ketu Yantra",
      material: "Iron or mixed metal plate",
      placement: "North-East wall or meditation room",
      energization: "Chant Ketu Beej Mantra 108 times on Tuesday evening",
      benefits: ["Removes Ketu-related obstacles", "Spiritual advancement"],
    },
  },
}

// ─── Dosha-Specific Remedy Protocols ─────────────────────

export interface DoshaRemedyProtocol {
  dosha: string
  severity: "mild" | "moderate" | "severe"
  rituals: DoshaRitual[]
  mantras: string[]
  generalAdvice: string[]
  classicalReference: ClassicalReference
}

export interface DoshaRitual {
  name: string
  description: string
  frequency: string
  bestTime: string
  items: string[]
}

export const DOSHA_REMEDIES: Record<string, DoshaRemedyProtocol[]> = {
  "Mangal Dosha": [
    {
      dosha: "Mangal Dosha",
      severity: "mild",
      rituals: [
        {
          name: "Tuesday Fasting",
          description: "Fast on Tuesdays for 21 consecutive weeks. Offer red flowers and sindoor to Hanuman.",
          frequency: "Weekly for 21 weeks",
          bestTime: "Tuesday, all day",
          items: ["Red flowers", "Sindoor", "Jaggery"],
        },
      ],
      mantras: [
        "Om Kraam Kreem Kraum Sah Bhaumaya Namah (108 times daily)",
        "Hanuman Chalisa (daily)",
      ],
      generalAdvice: [
        "Mild Mangal Dosha often cancels if spouse also has Mangal Dosha",
        "Mars in own sign or exalted reduces Dosha significantly",
        "Marriage after age 28 naturally reduces Mars energy",
      ],
      classicalReference: { source: "BPHS", chapter: 77, verse: 34, translation: "When Mars Dosha is mild, Tuesday fasting and Hanuman worship are sufficient remedies." },
    },
    {
      dosha: "Mangal Dosha",
      severity: "moderate",
      rituals: [
        {
          name: "Mangal Shanti Puja",
          description: "Perform Mangal Shanti Puja at a Hanuman or Kuja temple. Include Nav Graha Havan.",
          frequency: "Once, then annual",
          bestTime: "Tuesday during Mars Hora",
          items: ["Red cloth", "Red coral mala", "Ghee", "Sesame", "Red flowers", "Havan samagri"],
        },
        {
          name: "Kumbh Vivah (Symbolic Marriage)",
          description: "Marriage to a banana tree (for males) or Vishnu idol (for females) before actual marriage to absorb Mars energy.",
          frequency: "Once (before marriage)",
          bestTime: "Auspicious Muhurta on Tuesday",
          items: ["Banana tree or Vishnu idol", "Vermillion", "Turmeric", "New cloth"],
        },
      ],
      mantras: [
        "Om Kraam Kreem Kraum Sah Bhaumaya Namah (7000 times total)",
        "Mangal Kavacham (daily for 40 days)",
        "Hanuman Chalisa (daily)",
      ],
      generalAdvice: [
        "Wear Red Coral (Moonga) in gold on ring finger after consulting an astrologer",
        "Donate blood on Tuesdays — symbolically channels Mars energy positively",
        "Visit Mangal Nath temple in Ujjain if possible",
      ],
      classicalReference: { source: "BPHS", chapter: 77, verse: 36, translation: "For moderate Mangal Dosha, Kumbh Vivah and Mangal Shanti Puja are prescribed in the classical texts." },
    },
    {
      dosha: "Mangal Dosha",
      severity: "severe",
      rituals: [
        {
          name: "Complete Mangal Dosha Nivaran Puja",
          description: "Full-day puja with Nav Graha havan, Mangal Stotra path, and Rudrabhishek. Best done at a Mangal Nath temple.",
          frequency: "Once, then follow-up annually",
          bestTime: "Tuesday during Shukla Paksha",
          items: ["Full havan samagri", "Red coral", "9 types of grains", "Red cloth", "Copper kalash"],
        },
      ],
      mantras: [
        "Om Kraam Kreem Kraum Sah Bhaumaya Namah (7000 times, complete japa)",
        "Mangal Kavacham (daily for 108 days)",
        "Sundarkand (Tuesdays for life)",
      ],
      generalAdvice: [
        "Severe Mangal Dosha requires professional astrological guidance",
        "Kumbh Vivah is strongly recommended before marriage",
        "Partner matching (Ashtakoot) must include Mangal Dosha compatibility",
        "Regular Hanuman worship is a lifelong remedy",
      ],
      classicalReference: { source: "BPHS", chapter: 77, verse: 38, translation: "Severe Kuja Dosha requires complete Mangal Shanti with havan, japa, and Kumbh Vivah for full pacification." },
    },
  ],

  "Kaal Sarp Dosha": [
    {
      dosha: "Kaal Sarp Dosha",
      severity: "moderate",
      rituals: [
        {
          name: "Kaal Sarp Dosha Nivaran Puja",
          description: "Performed at Trimbakeshwar temple (Nasik) or Mahakaleshwar (Ujjain). Includes Nag Puja and Rahu-Ketu Shanti.",
          frequency: "Once in lifetime (major puja), then annual smaller puja",
          bestTime: "Nag Panchami or during Rahu Kaal on Saturday",
          items: ["Silver Nag (snake idol)", "Milk", "Black sesame", "Coconut", "Nav Graha items"],
        },
        {
          name: "Nag Panchami Worship",
          description: "Offer milk to snake deities on Nag Panchami. Visit a Nag temple.",
          frequency: "Annually on Nag Panchami",
          bestTime: "Nag Panchami day",
          items: ["Milk", "Turmeric paste", "Rice", "Flowers"],
        },
      ],
      mantras: [
        "Om Bhraam Bhreem Bhraum Sah Rahave Namah (18000 times)",
        "Om Sraam Sreem Sraum Sah Ketave Namah (7000 times)",
        "Maha Mrityunjaya Mantra (daily 108 times)",
      ],
      generalAdvice: [
        "Kaal Sarp Dosha effects are strongest during Rahu-Ketu transits",
        "Keep a silver Nag-Nagin pair in your puja room",
        "Feed milk to snakes at a snake sanctuary (not wild snakes)",
        "Visit Trimbakeshwar for the most effective puja",
      ],
      classicalReference: { source: "Jataka Parijata", chapter: 14, verse: 15, translation: "Kaal Sarp Dosha is pacified by Nag Puja, Rahu-Ketu Shanti havan, and visiting Jyotirlinga temples." },
    },
  ],

  "Pitra Dosha": [
    {
      dosha: "Pitra Dosha",
      severity: "moderate",
      rituals: [
        {
          name: "Pitra Tarpan",
          description: "Offer water (Tarpan) to ancestors during Pitru Paksha (16-day period). Include sesame seeds and kusha grass.",
          frequency: "Daily during Pitru Paksha (annually in Bhadrapada month)",
          bestTime: "During Pitru Paksha, ideally on the tithi of ancestor's death",
          items: ["Black sesame seeds", "Kusha grass", "Water", "Rice", "Barley"],
        },
        {
          name: "Pind Daan at Gaya",
          description: "Perform Pind Daan (ancestral food offering) at Gaya, Bihar — the most powerful location for ancestral rites.",
          frequency: "Once in lifetime (most effective)",
          bestTime: "Pitru Paksha or any Amavasya",
          items: ["Rice balls (Pind)", "Sesame", "Barley", "Kusha grass", "Flowers"],
        },
        {
          name: "Narayan Nagbali Puja",
          description: "Three-day ritual at Trimbakeshwar for severe Pitra Dosha. Includes Nagbali and Narayan Bali vidhi.",
          frequency: "Once in lifetime",
          bestTime: "After consulting pandit for muhurta",
          items: ["As prescribed by temple priest"],
        },
      ],
      mantras: [
        "Om Pitrabhyah Swadha Namah (daily during Pitru Paksha)",
        "Om Hraam Hreem Hraum Sah Suryaya Namah (Sun mantra — 7000 times)",
        "Gayatri Mantra (daily 108 times)",
      ],
      generalAdvice: [
        "Never skip Shraddha ceremonies for ancestors",
        "Feed Brahmins and crows on Amavasya (New Moon)",
        "Plant a Peepal tree and water it regularly",
        "Donate food to the poor on father's or grandfather's death anniversary",
      ],
      classicalReference: { source: "BPHS", chapter: 80, verse: 48, translation: "Pitra Dosha is pacified by Tarpan, Pind Daan at Gaya, feeding Brahmins, and regular Shraddha ceremonies." },
    },
  ],

  "Sade Sati": [
    {
      dosha: "Sade Sati",
      severity: "moderate",
      rituals: [
        {
          name: "Shani Shanti Puja",
          description: "Perform Shani puja with mustard oil lamp (Til ka Tel ka Diya) at a Shani temple every Saturday.",
          frequency: "Weekly on Saturday",
          bestTime: "Saturday evening during Saturn Hora",
          items: ["Mustard oil", "Black Urad Dal", "Iron nail", "Black sesame", "Black cloth"],
        },
        {
          name: "Hanuman Puja (Sade Sati Protection)",
          description: "Hanuman is the greatest protector during Sade Sati. Recite Hanuman Chalisa and visit Hanuman temple on Saturdays and Tuesdays.",
          frequency: "Weekly (Tuesdays and Saturdays)",
          bestTime: "Tuesday and Saturday",
          items: ["Sindoor", "Red flowers", "Jasmine oil", "Jaggery", "Besan ladoo"],
        },
      ],
      mantras: [
        "Om Praam Preem Praum Sah Shanaye Namah (23000 times total japa)",
        "Hanuman Chalisa (daily, especially Saturdays)",
        "Dashrath Krit Shani Stotra (Saturday evenings)",
        "Maha Mrityunjaya Mantra (daily 108 times)",
      ],
      generalAdvice: [
        "Sade Sati is NOT always negative — it brings discipline and transformation",
        "Saturn rewards hard work and punishes shortcuts during this period",
        "Maintain strict discipline, ethics, and routine during Sade Sati",
        "Serve elderly people, disabled, and the underprivileged",
        "Donate mustard oil, black urad dal, and iron items on Saturdays",
        "Avoid major financial risks and speculations during peak Sade Sati",
      ],
      classicalReference: { source: "Phaladeepika", chapter: 26, verse: 12, translation: "During Sade Sati, worship of Lord Hanuman, Shani mantra japa, and charitable acts to the poor pacify Saturn's testing influence." },
    },
  ],

  "Chandal Yoga": [
    {
      dosha: "Chandal Yoga",
      severity: "moderate",
      rituals: [
        {
          name: "Jupiter Strengthening Puja",
          description: "Perform Brihaspati (Jupiter) puja with yellow items. Visit a Guru temple on Thursdays.",
          frequency: "Weekly on Thursday",
          bestTime: "Thursday morning during Jupiter Hora",
          items: ["Yellow cloth", "Chana Dal", "Turmeric", "Yellow flowers", "Banana"],
        },
      ],
      mantras: [
        "Om Graam Greem Graum Sah Gurave Namah (19000 times)",
        "Vishnu Sahasranama (Thursday mornings)",
        "Guru Gayatri Mantra (daily 108 times)",
      ],
      generalAdvice: [
        "Chandal Yoga (Jupiter-Rahu conjunction) needs Jupiter strengthening",
        "Respect your Guru and teachers — never disrespect elders",
        "Study scriptures and dharmic texts regularly",
        "Avoid get-rich-quick schemes and unethical shortcuts",
      ],
      classicalReference: { source: "Saravali", chapter: 33, verse: 8, translation: "Guru Chandal Yoga is pacified by strengthening Jupiter through mantras, charity, and devotion to one's Guru." },
    },
  ],

  "Grahan Yoga": [
    {
      dosha: "Grahan Yoga",
      severity: "moderate",
      rituals: [
        {
          name: "Grahan Dosha Shanti",
          description: "Perform Surya/Chandra Grahan Shanti puja during solar/lunar eclipses. Donate to temples during eclipses.",
          frequency: "During every eclipse",
          bestTime: "During actual eclipse time",
          items: ["Sesame seeds", "Kusha grass", "Tulsi", "Holy water"],
        },
      ],
      mantras: [
        "For Sun-Rahu: Om Adityaya Vidmahe + Om Bhraam Bhreem Bhraum Sah Rahave Namah",
        "For Moon-Rahu: Om Chandraya Namah + Om Bhraam Bhreem Bhraum Sah Rahave Namah",
        "Maha Mrityunjaya Mantra (during eclipses, 108 times)",
      ],
      generalAdvice: [
        "Chant mantras during eclipses for maximum benefit",
        "Take bath immediately after eclipse ends",
        "Donate food and clothes during eclipse period",
        "Do not eat during solar/lunar eclipse",
      ],
      classicalReference: { source: "BPHS", chapter: 80, verse: 58, translation: "Grahan Yoga is pacified by mantra chanting during eclipses, holy baths, and charitable acts at eclipse time." },
    },
  ],
}

// ─── Utility: Get Remedies for Planet ────────────────────

export function getPlanetRemedies(planet: PlanetName): PlanetRemedySet {
  return PLANET_REMEDIES[planet]
}

export function getPlanetGemstone(planet: PlanetName): GemstoneRemedy {
  return PLANET_REMEDIES[planet].gemstone
}

export function getPlanetMantra(planet: PlanetName): MantraRemedy {
  return PLANET_REMEDIES[planet].mantra
}

// ─── Utility: Get Dosha Remedies ─────────────────────────

export function getDoshaRemedies(doshaName: string, severity?: "mild" | "moderate" | "severe"): DoshaRemedyProtocol[] {
  const remedies = DOSHA_REMEDIES[doshaName] || []
  if (severity) {
    return remedies.filter(r => r.severity === severity)
  }
  return remedies
}

// ─── Utility: Get All Remedies for a Chart ───────────────

export interface ChartRemedySummary {
  planetRemedies: Array<{
    planet: PlanetName
    reason: string
    primaryRemedy: string
    gemstone: string
    mantra: string
  }>
  doshaRemedies: Array<{
    dosha: string
    severity: string
    primaryRitual: string
    mantra: string
  }>
  generalGuidance: string[]
}

/**
 * Generate a personalized remedy summary based on detected afflictions.
 * Takes in weak/afflicted planets and detected doshas.
 */
export function generateRemedySummary(
  afflictedPlanets: Array<{ planet: PlanetName, reason: string }>,
  detectedDoshas: Array<{ name: string, severity: "mild" | "moderate" | "severe" }>
): ChartRemedySummary {
  const planetRemedies = afflictedPlanets.map(({ planet, reason }) => {
    const rem = PLANET_REMEDIES[planet]
    return {
      planet,
      reason,
      primaryRemedy: `Wear ${rem.gemstone.name} (${rem.gemstone.nameHindi}) in ${rem.gemstone.metal} on ${rem.gemstone.finger}`,
      gemstone: rem.gemstone.name,
      mantra: rem.mantra.beejMantra,
    }
  })

  const doshaRemedies = detectedDoshas.map(({ name, severity }) => {
    const protocols = getDoshaRemedies(name, severity)
    const primary = protocols[0]
    return {
      dosha: name,
      severity,
      primaryRitual: primary?.rituals[0]?.name || "Consult an astrologer for specific rituals",
      mantra: primary?.mantras[0] || "Chant Maha Mrityunjaya Mantra daily",
    }
  })

  const generalGuidance = [
    "Always consult a qualified Jyotish astrologer before wearing gemstones",
    "Mantras should be chanted with devotion and correct pronunciation",
    "Charity should be done with genuine compassion, not as a transaction",
    "Remedies work best when combined with self-effort and ethical living",
    "Gemstones should be natural, untreated, and energized properly before wearing",
  ]

  return { planetRemedies, doshaRemedies, generalGuidance }
}
