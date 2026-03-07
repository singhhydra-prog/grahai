/* ════════════════════════════════════════════════════════
   GrahAI — Vedic Stories Database

   Short narrative stories (200-400 words) teaching Vedic
   astrology concepts. Context-aware: stories are matched
   to the user's chart features (yogas, doshas, planets,
   nakshatras, houses).

   Each story maps to a concept and includes classical
   text references.
   ════════════════════════════════════════════════════════ */

// ─── Story Structure ────────────────────────────────────

export interface VedicStory {
  id: string
  title: string
  concept: string
  category: "planet" | "yoga" | "dosha" | "nakshatra" | "house" | "dasha" | "general"
  triggerKey: string  // matched against chart features
  narrative: string
  moral: string
  relatedTexts: Array<{ source: string, chapter: number, topic: string }>
  readTimeMinutes: number
}

// ─── Stories ────────────────────────────────────────────

export const VEDIC_STORIES: VedicStory[] = [
  // ─── Planet Stories ───────────────────────────────────
  {
    id: "sun-surya-chariot",
    title: "Surya's Golden Chariot",
    concept: "Sun — The Soul's Light",
    category: "planet",
    triggerKey: "Sun",
    narrative: `In the beginning of time, when darkness covered the universe, Lord Surya mounted his golden chariot drawn by seven horses — each representing a day of the week, each a colour of the rainbow. His charioteer, Aruna (the dawn), guided the horses across the sky, and wherever the chariot passed, life stirred and consciousness awakened.

The Rig Veda tells us that Surya is not merely a ball of fire, but the visible form of the Supreme — the Atmakaraka, the indicator of the soul. Just as the Sun illuminates the outer world, it illuminates our inner world of purpose and dharma.

King Yudhisthira, the eldest Pandava, was born with a powerful Sun in his chart. Even in exile, stripped of kingdom and comfort, his inner light never dimmed. His truth-telling, his refusal to compromise dharma even when deception would have won easier battles — this is the Sun's gift: unwavering integrity.

But the story also warns. Karna, son of Surya himself, had a debilitated Sun in some reckonings. Despite immense talent and generosity, his identity crisis — not knowing his true parentage — caused him to align with adharma. A weakened Sun creates confusion about one's purpose.

Parashara wrote in BPHS that the Sun rules the bones, the heart, and the right eye. When the Sun is strong, the native walks with authority. When weak, they seek validation from others instead of generating their own light.`,
    moral: "The Sun in your chart is your soul's compass. Whether exalted or debilitated, it tells you where to find your purpose — not in others' approval, but in your own dharmic truth.",
    relatedTexts: [
      { source: "BPHS", chapter: 3, topic: "Nature of Sun" },
      { source: "Rig Veda", chapter: 1, topic: "Surya Sukta" },
    ],
    readTimeMinutes: 2,
  },
  {
    id: "moon-chandra-curse",
    title: "Why the Moon Waxes and Wanes",
    concept: "Moon — The Mind's Mirror",
    category: "planet",
    triggerKey: "Moon",
    narrative: `Chandra, the Moon god, was beautiful beyond measure. His silver light enchanted all of heaven. Daksha Prajapati, pleased with his luminance, gave him his twenty-seven daughters — the Nakshatras — in marriage. But Chandra committed a great error: he favoured Rohini above all others.

The neglected wives complained to their father. Daksha, furious, cursed Chandra: "You who cannot love equally shall wane into nothingness." And so the Moon began to shrink, growing weaker each night, his light fading, the world plunging into darkness.

In desperation, Chandra sought refuge in Lord Shiva. Meditating at Prabhasa, he performed the Maha Mrityunjaya mantra ten million times. Shiva, moved by his devotion, could not fully undo Daksha's curse but offered a boon: the Moon would wax and wane, never fully dying, always returning to fullness.

This is why, in Jyotish, the Moon represents the mind — brilliant one moment, dimmed the next, but always cycling back. A strong Moon gives emotional resilience; a weak Moon brings the mind's endless fluctuations. The Purnima (full moon) night is auspicious because the mind is at its fullest capacity.

Parashara teaches that the Moon rules the fourth house of mind and mother. Those with Moon afflicted by Rahu experience Grahan Yoga — an eclipse of the mind — bringing anxiety and confusion. The remedy? Just as Chandra turned to Shiva, we turn to mantra and meditation.`,
    moral: "The mind, like the Moon, naturally waxes and wanes. Don't judge yourself in the dark phases — fullness always returns to those who maintain devotion and discipline.",
    relatedTexts: [
      { source: "BPHS", chapter: 3, topic: "Nature of Moon" },
      { source: "Shiva Purana", chapter: 12, topic: "Chandra and Shiva" },
    ],
    readTimeMinutes: 2,
  },
  {
    id: "saturn-shani-justice",
    title: "Shani Dev — The Slow Teacher",
    concept: "Saturn — Karma and Discipline",
    category: "planet",
    triggerKey: "Saturn",
    narrative: `When Shani Dev was born, his gaze fell upon his father Surya, and the Sun was eclipsed. Such was the power of Saturn's glance — wherever it fell, it brought truth, even if truth was painful.

People fear Shani. They worship him to avoid his gaze. But the wise sages understood: Shani is not cruel. He is the most impartial judge in the cosmic court. He rewards sustained effort and punishes shortcuts with equal precision.

Consider the story of King Vikramaditya, the most righteous king of ancient India. When Shani's Sade Sati came upon him, Vikramaditya lost his kingdom, was falsely accused of theft, had his hands and feet cut off, and wandered as a blind beggar. Seven and a half years of relentless suffering.

But Vikramaditya never cursed fate. He never abandoned dharma. When Sade Sati ended, not only was his kingdom restored — it expanded beyond what he had before. Shani himself appeared and said: "I tested you not to destroy you, but to prove to the world that dharma survives every trial."

In BPHS, Parashara describes Saturn as the significator of longevity, discipline, and service. Saturn's transit through the 12th, 1st, and 2nd from Moon (Sade Sati) lasts seven and a half years — long enough to restructure an entire life. Those who resist learn through suffering. Those who surrender to discipline emerge as diamonds — forged under pressure.`,
    moral: "Saturn doesn't punish — he purifies. The pressure you feel during Saturn periods is the same pressure that turns coal into diamond. Endure with dharma, and emerge transformed.",
    relatedTexts: [
      { source: "BPHS", chapter: 3, topic: "Nature of Saturn" },
      { source: "BPHS", chapter: 65, topic: "Sade Sati" },
    ],
    readTimeMinutes: 2,
  },
  {
    id: "jupiter-brihaspati-wisdom",
    title: "Brihaspati — Guru of the Gods",
    concept: "Jupiter — Wisdom and Expansion",
    category: "planet",
    triggerKey: "Jupiter",
    narrative: `Among the nine planets, Jupiter holds the title "Guru" — teacher. As Brihaspati, he serves as the preceptor of the Devas, guiding them through cosmic wars, moral dilemmas, and the art of righteous governance.

Once, the Asuras (demons) gained tremendous power through severe penances. The Devas were losing battle after battle. It was not superior weapons that saved them — it was Brihaspati's counsel. He taught them timing: when to attack, when to retreat, when to negotiate. He taught them that expansion without wisdom leads to destruction.

This is Jupiter's gift in the chart. Where Jupiter sits, that area of life expands — but with wisdom, not mere growth. Jupiter in the 2nd house expands wealth through knowledge. Jupiter in the 7th blesses marriage through mutual respect. Jupiter in the 9th — its most exalted placement — brings dharmic fortune and spiritual teachers into life.

But even Jupiter has lessons to teach through absence. When Jupiter is debilitated in Capricorn, the native may mistake material success for spiritual growth. They accumulate credentials but not wisdom. They collect followers but not true students.

Parashara writes that Jupiter's Dasha is a period of expansion, children, and divine grace. The Gajakesari Yoga (Jupiter in Kendra from Moon) makes one "as splendid as an elephant among animals" — commanding, wise, and generous.`,
    moral: "True expansion is not about getting more — it's about understanding more deeply. Jupiter teaches that the greatest wealth is wisdom shared freely with others.",
    relatedTexts: [
      { source: "BPHS", chapter: 3, topic: "Nature of Jupiter" },
      { source: "BPHS", chapter: 34, topic: "Gajakesari Yoga" },
    ],
    readTimeMinutes: 2,
  },
  {
    id: "rahu-eclipse-ambition",
    title: "Rahu — The Head Without a Body",
    concept: "Rahu — Illusion and Worldly Desires",
    category: "planet",
    triggerKey: "Rahu",
    narrative: `During the churning of the cosmic ocean, the gods and demons together extracted Amrit — the nectar of immortality. Lord Vishnu, disguised as the enchantress Mohini, began distributing the nectar exclusively to the gods.

One clever Asura named Svarbhanu disguised himself as a god and sat between the Sun and Moon. He drank the nectar. But before it could pass his throat, the Sun and Moon recognized him and alerted Vishnu, who severed his head with the Sudarshana Chakra.

The nectar had already touched his head and body — so both survived separately. The head became Rahu, the body became Ketu. And forever after, Rahu and Ketu eclipse the Sun and Moon in revenge.

In Jyotish, Rahu represents insatiable desire — the head that consumed nectar but has no body to feel satisfied. Rahu in your chart shows where your ambition is strongest but also where illusion is greatest. Rahu in the 10th house drives immense career ambition, sometimes through unconventional paths. Rahu in the 7th can create obsessive relationships with people from different cultures.

Kaal Sarp Dosha — when all planets fall between Rahu and Ketu — represents a life caught between desire and detachment, karma demanding to be resolved this lifetime.

The ancients did not demonize Rahu. They recognized that desire itself is a force of evolution. Without Rahu, there would be no ambition, no technology, no boundary-breaking innovation. The key is awareness — knowing when ambition serves growth versus when it feeds delusion.`,
    moral: "Rahu teaches that desire without awareness leads to eclipse. Channel ambition through dharma, and even Rahu becomes a force for evolution rather than destruction.",
    relatedTexts: [
      { source: "BPHS", chapter: 3, topic: "Nature of Rahu" },
      { source: "Vishnu Purana", chapter: 9, topic: "Samudra Manthan" },
    ],
    readTimeMinutes: 2,
  },

  // ─── Yoga Stories ─────────────────────────────────────
  {
    id: "gajakesari-elephant-lion",
    title: "The Elephant and the Lion — Gajakesari Yoga",
    concept: "Gajakesari Yoga",
    category: "yoga",
    triggerKey: "Gajakesari",
    narrative: `In the ancient forests of Naimisharanya, an elephant (Gaja) and a lion (Kesari) once shared a watering hole. The other animals watched in fear, expecting a terrible fight. But instead, the two mighty beings established an unspoken respect. The elephant brought depth and memory; the lion brought courage and authority. Together, they protected the entire forest.

This is the essence of Gajakesari Yoga — formed when Jupiter (Guru, the elephant of wisdom) sits in a Kendra (angular house) from the Moon (the mind, emotional courage). When wisdom supports the mind, or when the mind supports wisdom, greatness manifests naturally.

Parashara describes the native with Gajakesari as "splendid like an elephant among animals, blessed with many followers, fond of learning, and engaged in virtuous deeds." It does not promise material wealth alone — it promises the kind of respect that comes from genuine wisdom and emotional stability.

Not all Gajakesari Yogas are equal. Jupiter must be strong — not combust, not debilitated, not in an enemy sign. A weak Jupiter creates the form of the yoga but not its substance. It's like an elephant without tusks — impressive in size but lacking power.

When this yoga is active in your Dasha, teachers appear naturally, opportunities for learning multiply, and your advice becomes valued by others. The key is to use this energy for growth — not just personal comfort.`,
    moral: "True strength comes from the union of wisdom (Jupiter) and emotional intelligence (Moon). Gajakesari Yoga is earned through lifetimes of learning — honour it through continued study and service.",
    relatedTexts: [
      { source: "BPHS", chapter: 34, topic: "Gajakesari Yoga" },
      { source: "Phaladeepika", chapter: 6, topic: "Lunar Yogas" },
    ],
    readTimeMinutes: 2,
  },
  {
    id: "neecha-bhanga-phoenix",
    title: "The Phoenix Yoga — Neecha Bhanga Raj Yoga",
    concept: "Neecha Bhanga Raj Yoga",
    category: "yoga",
    triggerKey: "Neecha Bhanga",
    narrative: `The sage Vyasa once told a parable of a seed thrown into a dark crevice between rocks. With no soil, no sunlight, and no water, any ordinary seed would perish. But this was not an ordinary seed — it was a banyan seed. Slowly, painfully, it pushed roots into the rock itself, drawing moisture from morning dew. Years later, it split the rocks apart and grew into a magnificent tree that sheltered hundreds.

This is Neecha Bhanga Raj Yoga — the cancellation of debilitation that creates royal power. When a planet falls to its lowest point (debilitation) but specific conditions rescue it, the native doesn't just recover — they achieve greater heights than someone who was never tested.

The conditions for cancellation are precise: the debilitation lord must be strong, or the exaltation lord of the debilitated planet must be in a Kendra, or the debilitated planet must be aspected by its exaltation lord. When any of these conditions are met, the planet's weakness transforms into extraordinary strength.

History is full of Neecha Bhanga examples. Leaders who rose from poverty, artists who created masterpieces from suffering, healers whose own illness taught them compassion. The debilitation forced them to develop resources they would never have discovered in comfort.

Parashara states that Neecha Bhanga Raj Yoga can make even a person born in humble circumstances rise to positions of great authority — precisely because they understand both sides of the coin.`,
    moral: "Your greatest weakness, properly channelled, becomes your greatest strength. Debilitation is not a curse — it's an invitation to develop mastery through adversity.",
    relatedTexts: [
      { source: "BPHS", chapter: 28, topic: "Neecha Bhanga Raj Yoga" },
      { source: "Saravali", chapter: 35, topic: "Cancellation of Debilitation" },
    ],
    readTimeMinutes: 2,
  },

  // ─── Dosha Stories ────────────────────────────────────
  {
    id: "mangal-dosha-hanuman",
    title: "Mangal Dosha and Hanuman's Blessing",
    concept: "Mangal Dosha",
    category: "dosha",
    triggerKey: "Mangal Dosha",
    narrative: `When Prince Rama was exiled to the forest for fourteen years, his beloved wife Sita walked beside him into the wilderness. Theirs was a marriage tested by Mangal — Mars, the planet of aggression, separation, and warrior energy.

Mars placed in the 7th house of marriage brings Mangal Dosha — a condition that creates turbulence in partnerships. Sita was abducted. Rama waged war. The marriage endured separation, battle, and even public doubt. Yet their bond was unbreakable, because it was forged through dharma.

The remedy for Mangal Dosha is not fear but channelled courage. The tradition prescribes worshipping Hanuman — himself an avatar of Shiva and the embodiment of Mars energy directed toward divine service. Hanuman used his Mars energy not for personal ambition but for devoted service to Rama.

In modern readings, Mangal Dosha is over-feared. Nearly 50% of charts have Mars in a "dosha" position (houses 1, 2, 4, 7, 8, or 12). The severity depends on Mars's sign, aspects, and conjunctions. Mars in its own sign (Aries, Scorpio) in the 7th is far less problematic than Mars debilitated in the 8th.

Classical texts prescribe matching two Manglik charts (Dosha cancellation) or performing Kumbh Vivah (symbolic marriage to a pot) before actual marriage. The deeper teaching: Mars energy in marriage must be channelled into shared purpose, adventure, and mutual protection — not competition.`,
    moral: "Mangal Dosha is not a death sentence for marriage — it's a call to channel warrior energy into protection and devotion. Like Hanuman, direct Mars energy toward service, and it becomes your greatest strength.",
    relatedTexts: [
      { source: "BPHS", chapter: 41, topic: "Mangal Dosha" },
      { source: "Ramayana", chapter: 0, topic: "Rama and Sita" },
    ],
    readTimeMinutes: 2,
  },
  {
    id: "kaal-sarp-transformation",
    title: "The Serpent's Embrace — Kaal Sarp Dosha",
    concept: "Kaal Sarp Dosha",
    category: "dosha",
    triggerKey: "Kaal Sarp",
    narrative: `Lord Vishnu sleeps upon Shesha Naga — the cosmic serpent with a thousand heads. This image contains a profound teaching: even the Supreme Being rests within the embrace of serpentine energy. The serpent is not the enemy — it is the very bed of consciousness.

Kaal Sarp Dosha occurs when all seven planets (Sun through Saturn) fall between Rahu (the serpent's head) and Ketu (the tail). The native feels caught in karmic loops — recurring patterns, delayed results, and the sense that invisible forces control their life.

There are twelve types of Kaal Sarp, named after twelve serpents from mythology. Anant Kaal Sarp (Rahu in 1st, Ketu in 7th) affects self and relationships. Vasuki (Rahu in 2nd, Ketu in 8th) affects wealth and transformation. Each type indicates a specific life area demanding karmic resolution.

But Kaal Sarp is not a life sentence. Many of history's most transformative figures had this dosha. It forced them beyond ordinary achievement because ordinary paths were blocked. Like a river that cannot flow straight — it finds alternate routes and carves grand canyons.

The classical remedy is the Trimbakeshwar Puja — performed at the temple where Shiva himself tamed the serpent of time. Mantra meditation (particularly the Maha Mrityunjaya) gradually loosens the serpent's grip. But the deepest remedy is acceptance of karmic purpose.`,
    moral: "Kaal Sarp Dosha is not a punishment — it is concentrated karma seeking resolution. Like Vishnu resting on the serpent, learn to rest within your karma rather than fighting it, and it becomes your vehicle for transcendence.",
    relatedTexts: [
      { source: "BPHS", chapter: 41, topic: "Kaal Sarp Yoga" },
      { source: "Garuda Purana", chapter: 5, topic: "Naga Worship" },
    ],
    readTimeMinutes: 2,
  },

  // ─── Nakshatra Stories ────────────────────────────────
  {
    id: "ashwini-twin-healers",
    title: "The Divine Twin Healers — Ashwini Nakshatra",
    concept: "Ashwini Nakshatra",
    category: "nakshatra",
    triggerKey: "Ashwini",
    narrative: `Before there were hospitals, before there was medicine, there were the Ashwini Kumaras — divine twin horsemen who rode across the heavens healing the sick and restoring the broken. They are the physicians of the gods, born from Surya and his wife Sanjna when she took the form of a mare.

Ashwini is the first Nakshatra — the first breath of the zodiac at 0° Aries. Those born under this star carry an instinctive urge to heal, fix, and initiate. They are fast — sometimes impatiently so. Like horses at the starting gate, they charge forward before others have finished planning.

The Rig Veda records that the Ashwini Kumaras restored sight to the blind sage Rjrasva, gave an iron leg to Vishpala the warrior queen, and rejuvenated the elderly sage Chyavana to youth. Their healing was not limited to physical bodies — they healed injustice, restored honour, and bridged impossible gaps.

In Jyotish, planets in Ashwini carry this initiatory energy. Moon in Ashwini gives quick emotional responses and healing instincts. Sun in Ashwini drives pioneering leadership. Mars in Ashwini (its exaltation range) creates warriors of unmatched speed.

The shadow side? Ashwini can be hasty, restless, and impatient with slower processes. The twin horses want to gallop — walking feels like punishment. Learning when to charge and when to wait is Ashwini's lifetime lesson.`,
    moral: "Ashwini reminds us that the universe placed healing energy at the very beginning of the zodiac. Your impulse to help others is not weakness — it is the most primal force in creation.",
    relatedTexts: [
      { source: "BPHS", chapter: 7, topic: "Nakshatra Characteristics" },
      { source: "Rig Veda", chapter: 1, topic: "Ashwini Kumaras" },
    ],
    readTimeMinutes: 2,
  },
  {
    id: "rohini-creation",
    title: "Rohini — The Star of Creation",
    concept: "Rohini Nakshatra",
    category: "nakshatra",
    triggerKey: "Rohini",
    narrative: `Of the twenty-seven Nakshatras — the Moon's celestial wives — Rohini was the most beautiful. Her name means "the red one," and she was associated with fertility, growth, and the creative force. The Moon loved her so deeply that he refused to visit his other wives.

This favouritism led to Daksha's curse upon the Moon (the waxing-waning story), but it also reveals Rohini's extraordinary magnetic power. Rohini is ruled by the Moon and falls in Taurus — the sign of Venus. This double feminine creative energy makes it the most fertile, prosperous, and aesthetically gifted of all Nakshatras.

Lord Krishna was born under Rohini Nakshatra. His enchanting beauty, his mastery of music and art, his ability to attract devotees through sheer charm — all are Rohini qualities. But Krishna also demonstrated Rohini's deeper nature: the power to create new paradigms. He didn't just preserve dharma — he reinvented it for a new age.

The deity of Rohini is Brahma — the creator. Planets placed here have extraordinary creative potential. They manifest things into being through sheer will and aesthetic vision. Business ventures, artistic works, children, and relationships all flourish under Rohini's influence.

The shadow? Possessiveness and attachment. Just as the Moon couldn't let go of Rohini, natives with strong Rohini placements struggle with letting go of what they love. Learning non-attachment while remaining creative is the path.`,
    moral: "Rohini teaches that creation is the highest expression of divine energy. Create beauty, nurture growth, but remember — the Moon must visit all Nakshatras. Don't cling so tightly to what you love that you eclipse everything else.",
    relatedTexts: [
      { source: "BPHS", chapter: 7, topic: "Rohini Nakshatra" },
      { source: "Bhagavata Purana", chapter: 10, topic: "Krishna's Birth" },
    ],
    readTimeMinutes: 2,
  },

  // ─── House Stories ────────────────────────────────────
  {
    id: "tenth-house-karma",
    title: "The Tenth House — Your Mark on the World",
    concept: "10th House (Karma Bhava)",
    category: "house",
    triggerKey: "house_10",
    narrative: `In the Mahabharata, Arjuna stood frozen on the battlefield of Kurukshetra. His bow, Gandiva, slipped from his hands. Before him were his teachers, cousins, and grandfathers — people he loved, now his enemies. He turned to Krishna: "I cannot act. Action will bring only destruction."

Krishna's response became the Bhagavad Gita — and its central teaching addresses the 10th house directly: "You have the right to action alone, never to its fruits." The 10th house is Karma Bhava — the house of action, career, and one's visible contribution to the world. It is the highest point in the chart, the Midheaven, where the soul's public purpose is displayed.

In BPHS, Parashara assigns the 10th house to governance, profession, fame, and achievement. A strong 10th house doesn't guarantee wealth (that's the 2nd and 11th), but it guarantees that one's actions are seen and remembered. The 10th lord's placement tells the story of HOW one achieves.

If the 10th lord sits in the 9th (fortune), success comes through wisdom and teachers. In the 11th (gains), through networking. In the 12th (loss/foreign), through work abroad or behind the scenes. Each combination paints a unique career narrative.

Saturn in the 10th — often feared — is actually one of the strongest placements for sustained career achievement. Saturn forces discipline, delays gratification, but builds empires that last. The delay IS the gift.`,
    moral: "The 10th house asks: What will you DO with your time on earth? Not what you accumulate, but what you create. Like Arjuna, the answer is always: act with dharma, release attachment to results.",
    relatedTexts: [
      { source: "BPHS", chapter: 11, topic: "10th House Significations" },
      { source: "Bhagavad Gita", chapter: 2, topic: "Karma Yoga" },
    ],
    readTimeMinutes: 2,
  },

  // ─── Dasha Stories ────────────────────────────────────
  {
    id: "vimshottari-wheel",
    title: "The 120-Year Wheel — Vimshottari Dasha",
    concept: "Vimshottari Dasha System",
    category: "dasha",
    triggerKey: "dasha_general",
    narrative: `Sage Parashara once told his student Maitreya: "The life of a human unfolds not in random chaos but in precise planetary periods — each governed by a graha, each lasting an exact number of years. This 120-year cycle is called Vimshottari, and it is the key to unlocking time itself."

The cycle begins with the planet that rules the Moon's Nakshatra at birth. If the Moon is in Bharani (ruled by Venus), the native begins life in Venus Dasha. If in Pushya (Saturn), Saturn's period opens the story. The remaining balance at birth is calculated from the Moon's exact position within the Nakshatra — down to the minute.

The nine planets divide 120 years: Sun (6), Moon (10), Mars (7), Rahu (18), Jupiter (16), Saturn (19), Mercury (17), Ketu (7), Venus (20). Each Mahadasha contains nine Antardashas, and each Antardasha nine Pratyantardashas — creating a fractal of time where every moment is governed by a specific planetary combination.

The genius of this system is that it doesn't predict events — it reveals the QUALITY of time. Saturn Mahadasha doesn't mean suffering; it means time moves slowly, demanding patience. Jupiter Mahadasha doesn't mean automatic success; it means wisdom is available if you seek it.

The greatest astrologers read Dasha not as fortune-telling but as a cosmic curriculum. What is this period trying to teach? What skills is the universe asking you to develop?`,
    moral: "Time in Jyotish is not an enemy but a teacher. Each Dasha period carries a specific lesson. The wise native doesn't fight the current period — they learn its curriculum and graduate with grace.",
    relatedTexts: [
      { source: "BPHS", chapter: 46, topic: "Vimshottari Dasha System" },
      { source: "BPHS", chapter: 50, topic: "Effects of Dashas" },
    ],
    readTimeMinutes: 2,
  },

  // ─── General Wisdom Stories ───────────────────────────
  {
    id: "navamsa-marriage-fruit",
    title: "The Navamsa — The Fruit of Dharma",
    concept: "D9 Navamsa Chart",
    category: "general",
    triggerKey: "navamsa",
    narrative: `A king once planted two mango trees in his garden. One grew tall and wide with magnificent leaves, the other remained modest in size. The king favoured the tall tree, boasting to visitors about its grandeur. But when the season of fruit arrived, the tall tree bore sour, small mangoes. The modest tree produced the sweetest fruit the kingdom had ever tasted.

Sage Narada, visiting the king, pointed at the trees: "Your Majesty, the tall tree is like the Rashi chart — impressive in appearance. The modest tree is like the Navamsa — it reveals the actual fruit of one's karma. Never judge a chart by the Rashi alone."

The Navamsa (D9) is the ninth divisional chart — each sign divided into nine parts of 3°20'. Parashara declared it the most important divisional chart after the Rashi, because it reveals three critical things: the quality of marriage, the strength of one's dharma, and the true dignity of planets.

A planet exalted in Rashi but debilitated in Navamsa is like a wealthy person with no inner peace. A planet debilitated in Rashi but exalted in Navamsa (Vargottama) is like a person of humble means but extraordinary character — the sweet fruit from the modest tree.

When the same sign appears in both Rashi and Navamsa for a planet (Vargottama), that planet carries double strength — its outer expression matches its inner truth. This is considered one of the highest dignities a planet can achieve.`,
    moral: "The Navamsa teaches that appearances deceive. True strength lies not in what is visible (Rashi) but in what is real (Navamsa). Judge a person — and a chart — by the quality of their fruit, not the height of their tree.",
    relatedTexts: [
      { source: "BPHS", chapter: 6, topic: "Navamsa (D9) Chart" },
      { source: "Jataka Parijata", chapter: 2, topic: "Vargottama" },
    ],
    readTimeMinutes: 2,
  },
  {
    id: "remedies-alignment",
    title: "Remedies — Tuning the Cosmic Instrument",
    concept: "Vedic Remedies",
    category: "general",
    triggerKey: "remedy_general",
    narrative: `A student once asked his Guru: "If karma is fixed, how can remedies change anything? Aren't we just fooling ourselves?"

The Guru picked up a veena (stringed instrument) and plucked a discordant string. "Does this string have bad karma?" he asked. "No, Guruji," the student replied. "It's just out of tune." The Guru turned the peg slightly. The same string now produced a beautiful note.

"Remedies," said the Guru, "do not change your strings. They tune them. Your planets are your strings — fixed at birth by karma. But the tension, the resonance, the way they vibrate with the cosmos — this can be adjusted."

Parashara dedicated several chapters of BPHS to remedies — not as superstition but as vibrational science. A mantra recited 108 times creates a specific frequency. A gemstone worn on the correct finger channels planetary light through the body's electromagnetic field. Fasting on a specific day synchronizes the body's rhythms with the ruling planet.

The key insight: remedies work through alignment, not magic. Donating black sesame on Saturday doesn't bribe Saturn — it creates an act of service (Saturn's frequency) that harmonizes the native's energy with Saturn's cosmic lesson. Chanting the Gayatri Mantra at sunrise doesn't please the Sun god — it aligns the practitioner's consciousness with solar energy.

The most powerful remedy, said Parashara, is selfless service (Karma Yoga). When one serves others without expectation, all planetary afflictions gradually dissolve — because service is the common resonance of all nine planets.`,
    moral: "Remedies don't change your fate — they tune your instrument. The same notes of karma, played on a well-tuned instrument, can produce music instead of noise. But the highest remedy is always selfless service.",
    relatedTexts: [
      { source: "BPHS", chapter: 77, topic: "Remedial Measures" },
      { source: "BPHS", chapter: 79, topic: "Mantra Remedies" },
    ],
    readTimeMinutes: 2,
  },
  {
    id: "venus-shukra-resurrection",
    title: "Shukracharya — The Master of Revival",
    concept: "Venus — Desire and Devotion",
    category: "planet",
    triggerKey: "Venus",
    narrative: `Shukracharya (Venus) is the Guru of the Asuras — the demons. While Brihaspati (Jupiter) guides the Devas through wisdom, Shukra guides the Asuras through an equally powerful force: desire and devotion.

Shukra is the only sage who knows the Mrita Sanjivani Vidya — the mantra that resurrects the dead. Time and again, the Asuras were defeated in battle, and time and again, Shukra brought them back to life. The gods could win battles but could never win the war — because desire cannot be permanently killed. It always resurfaces.

In Jyotish, Venus represents everything the soul desires in the material world: beauty, love, art, luxury, sensual pleasure, and creative expression. Venus is not merely about romance — it is the planet of refinement. Where Venus sits in your chart, you seek beauty and harmony.

Venus exalted in Pisces reveals the highest form of desire: devotion itself. The devotee who worships with complete surrender channels Venus energy into spiritual ecstasy. Venus debilitated in Virgo becomes overly analytical about love, dissecting beauty until only criticism remains.

The sage Shukra lost an eye when he was caught in the stomach of Lord Vishnu after trying to help a demon. He emerged with one eye — symbolic of Venus's dual nature: one eye sees worldly beauty, the lost eye represents the sacrifice needed for true devotion.`,
    moral: "Venus teaches that desire is divine when channelled toward beauty and devotion, but destructive when it becomes attachment. Like Shukra, use the power of desire not to cling to the material but to resurrect the sacred in everyday life.",
    relatedTexts: [
      { source: "BPHS", chapter: 3, topic: "Nature of Venus" },
      { source: "Devi Bhagavata", chapter: 4, topic: "Shukracharya" },
    ],
    readTimeMinutes: 2,
  },
  {
    id: "mars-karttikeya-courage",
    title: "Karttikeya — The Spear of Mars",
    concept: "Mars — Courage and Action",
    category: "planet",
    triggerKey: "Mars",
    narrative: `When the demon Tarakasura terrorized the universe, neither Brahma, Vishnu, nor the combined force of all Devas could defeat him. A prophecy declared that only a son of Shiva could slay him. But Shiva was deep in meditation, detached from the world.

Through divine orchestration, Karttikeya (Skanda/Murugan) was born — not from a womb but from the fire of Shiva's third eye, nursed by the six Krittikas (Pleiades stars). At just six days old, he picked up his vel (spear), marched to Tarakasura's fortress, and destroyed the demon in single combat.

This is Mars energy in its purest form: decisive action without hesitation, courage born not from anger but from righteous purpose. Karttikeya did not hate Tarakasura — he simply knew that dharma required action, and he acted.

In the chart, Mars represents our capacity for action, physical energy, brothers, property, and courage. Mars exalted in Capricorn (Saturn's sign) reveals a profound truth: the greatest warriors are disciplined, not merely aggressive. Uncontrolled Mars creates accidents, conflicts, and violence. Mars channelled through Saturn's discipline creates generals, surgeons, and athletes.

Mars debilitated in Cancer shows courage undermined by emotional vulnerability. The warrior's heart is too soft for battle. The remedy is not to suppress emotions but to find causes worth fighting for that honour both strength and sensitivity.`,
    moral: "Mars asks: What are you willing to fight for? Courage without purpose is violence. Purpose without courage is cowardice. True Mars energy — like Karttikeya's vel — is precise, purposeful, and unstoppable.",
    relatedTexts: [
      { source: "BPHS", chapter: 3, topic: "Nature of Mars" },
      { source: "Skanda Purana", chapter: 1, topic: "Birth of Karttikeya" },
    ],
    readTimeMinutes: 2,
  },
  {
    id: "mercury-budha-intellect",
    title: "Budha — The Prince of Intellect",
    concept: "Mercury — Communication and Commerce",
    category: "planet",
    triggerKey: "Mercury",
    narrative: `Budha (Mercury) has an unusual origin. He is the son of Chandra (Moon) and Tara (wife of Brihaspati/Jupiter). Born from an illicit union, Budha carried the tension of dual lineage — the emotional Moon and the scholarly Jupiter's household. Neither fully accepted, he had to create his own identity through intelligence alone.

This origin story explains Mercury's nature perfectly. Mercury is the planet of adaptability, communication, and intellectual agility. It borrows qualities from whatever planet sits nearby — just as Budha had to navigate between conflicting parental influences.

Mercury alone among the planets has no fixed nature — it is benefic with benefics, malefic with malefics. A chameleon. In the chart, Mercury shows how you think, communicate, and process information. Mercury in fire signs thinks quickly and speaks boldly. In water signs, thought is intuitive and poetic. In earth signs, practical and methodical.

The Budhaditya Yoga (Mercury conjunct Sun) is one of the most common yet powerful yogas. When intellect (Mercury) is illuminated by soul-purpose (Sun), the native communicates with authority. Scientists, writers, and CEOs often have this combination.

Mercury retrograde — feared in popular astrology — is actually a period for reviewing, revising, and reconnecting. Mercury doesn't malfunction in retrograde; it simply turns inward, asking us to think before we speak and review before we launch.`,
    moral: "Mercury teaches that intelligence is not about knowing everything — it's about adapting to everything. Like Budha who forged his own identity from conflicting origins, your mind's greatest power is its flexibility.",
    relatedTexts: [
      { source: "BPHS", chapter: 3, topic: "Nature of Mercury" },
      { source: "BPHS", chapter: 34, topic: "Budhaditya Yoga" },
    ],
    readTimeMinutes: 2,
  },
  {
    id: "ketu-moksha-liberation",
    title: "Ketu — The Tail of Liberation",
    concept: "Ketu — Spirituality and Detachment",
    category: "planet",
    triggerKey: "Ketu",
    narrative: `While Rahu (the head) consumed the nectar of immortality, Ketu (the body) was left without a mouth to consume anything at all. And therein lies Ketu's profound teaching: liberation comes not from consuming more but from needing nothing.

Ketu is the natural moksha karaka — the significator of spiritual liberation. Where Ketu sits in your chart marks the area of life where you have already achieved mastery in past lives. There is no hunger there, no ambition, only a quiet competence that sometimes looks like disinterest.

Ketu in the 7th house doesn't hate relationships — it has mastered them in previous incarnations and now seeks something beyond. Ketu in the 2nd doesn't reject wealth — it recognizes that money alone cannot satisfy. Ketu in the 12th (its natural house) is the mark of an old soul approaching final liberation.

The sage Ganesha bears Ketu's energy. His severed head (replaced by an elephant's) symbolizes the transcendence of ego-mind. He removes obstacles not through force but through wisdom that sees beyond illusion.

During Ketu's Dasha, material ambitions often dissolve. Careers shift, relationships transform, and what once seemed important suddenly feels hollow. This is not loss — it is Ketu removing what no longer serves the soul's evolution. Those who resist feel pain. Those who surrender discover freedom they never imagined.`,
    moral: "Ketu teaches the most radical lesson in Jyotish: you don't need to acquire more to be complete. True liberation is recognizing what you can release. The body without a head doesn't consume — it simply IS.",
    relatedTexts: [
      { source: "BPHS", chapter: 3, topic: "Nature of Ketu" },
      { source: "BPHS", chapter: 47, topic: "Ketu Dasha Effects" },
    ],
    readTimeMinutes: 2,
  },
]

// ─── Story Selection ────────────────────────────────────

/**
 * Get stories relevant to a user's chart features.
 */
export function getRelevantStories(
  chartFeatures: {
    yogas?: string[]
    doshas?: string[]
    planets?: string[]
    nakshatras?: string[]
    houses?: number[]
    dashaLord?: string
  },
  limit: number = 3
): VedicStory[] {
  const matches: Array<{ story: VedicStory, score: number }> = []

  for (const story of VEDIC_STORIES) {
    let score = 0

    // Match yogas
    if (chartFeatures.yogas?.some(y =>
      story.triggerKey.toLowerCase().includes(y.toLowerCase()) ||
      y.toLowerCase().includes(story.triggerKey.toLowerCase())
    )) {
      score += 10
    }

    // Match doshas
    if (chartFeatures.doshas?.some(d =>
      story.triggerKey.toLowerCase().includes(d.toLowerCase()) ||
      d.toLowerCase().includes(story.triggerKey.toLowerCase())
    )) {
      score += 10
    }

    // Match planets
    if (chartFeatures.planets?.includes(story.triggerKey)) {
      score += 5
    }

    // Match current dasha lord
    if (chartFeatures.dashaLord === story.triggerKey) {
      score += 8
    }

    // Match nakshatras
    if (chartFeatures.nakshatras?.some(n => story.triggerKey === n)) {
      score += 7
    }

    // General stories get a small base score
    if (story.category === "general") {
      score += 2
    }

    if (score > 0) {
      matches.push({ story, score })
    }
  }

  // Sort by relevance score
  matches.sort((a, b) => b.score - a.score)

  // Return top matches
  return matches.slice(0, limit).map(m => m.story)
}

/**
 * Get a random story for daily content.
 */
export function getDailyStory(dayOfYear: number): VedicStory {
  return VEDIC_STORIES[dayOfYear % VEDIC_STORIES.length]
}

/**
 * Get all stories for a specific category.
 */
export function getStoriesByCategory(category: VedicStory["category"]): VedicStory[] {
  return VEDIC_STORIES.filter(s => s.category === category)
}
