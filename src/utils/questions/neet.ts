import { Question } from '../../types';

export const NEET_QUESTION_POOL: Question[] = [
  {
    id: 'neet-001',
    text: 'During the human cardiac cycle, the physiological "Pacemaker" of the heart that generates spontaneous action potentials at the highest rate (70–75/min) is the:',
    options: ['Atrioventricular Node (AV Node)', 'Sinoatrial Node (SA Node)', 'Bundle of His', 'Purkinje Fibres'],
    correctAnswerIndex: 1,
    explanation: 'The Sinoatrial Node (SA Node) in the upper right wall of the right atrium is auto-excitable and sets the rhythmic pace of cardiac contraction.',
    subject: 'Zoology'
  },
  {
    id: 'neet-002',
    text: 'In flowering plants (Angiosperms), the unique phenomenon of "Double Fertilization" involves which two cellular fusion events?',
    options: [
      'Syngamy (egg cell + male gamete) and Triple Fusion (two polar nuclei + second male gamete)',
      'Fertilization of synergid and antipodal cell',
      'Fusion of two sperm cells with one egg cell',
      'Parthenocarpy and apomictic embryo sac development'
    ],
    correctAnswerIndex: 0,
    explanation: 'Syngamy forms the diploid zygote (2n), while Triple Fusion in the central cell produces the triploid Primary Endosperm Nucleus (PEN, 3n).',
    subject: 'Botany'
  },
  {
    id: 'neet-003',
    text: 'The restriction endonuclease enzyme "EcoRI" cuts double-stranded DNA specifically at which palindromic recognition nucleotide sequence?',
    options: [
      '5\'-G A A T T C-3\'',
      '5\'-A A G C T T-3\'',
      '5\'-C C C G G G-3\'',
      '5\'-G G A T C C-3\''
    ],
    correctAnswerIndex: 0,
    explanation: 'EcoRI isolated from Escherichia coli RY13 recognizes the 6-base pair palindromic sequence 5\'-GAATTC-3\' and produces single-stranded sticky cohesive ends.',
    subject: 'Zoology & Biotechnology'
  },
  {
    id: 'neet-004',
    text: 'In C₄ plants (such as Maize and Sugarcane), the primary CO₂ acceptor molecule situated within mesophyll cells is:',
    options: ['Ribulose 1,5-bisphosphate (RuBP)', 'Phosphoenolpyruvate (PEP)', 'Oxaloacetic acid (OAA)', 'Phosphoglyceric acid (PGA)'],
    correctAnswerIndex: 1,
    explanation: 'In C₄ plants, CO₂ is fixed by Phosphoenolpyruvate (PEP, 3-carbon) via PEP carboxylase to produce the 4-carbon organic acid Oxaloacetate in mesophyll cells.',
    subject: 'Botany'
  },
  {
    id: 'neet-005',
    text: 'What is the classical Mendelian phenotypic ratio observed in the F₂ generation of a Dihybrid cross?',
    options: ['3 : 1', '9 : 3 : 3 : 1', '1 : 2 : 1', '9 : 7'],
    correctAnswerIndex: 1,
    explanation: 'In Mendel\'s dihybrid cross of peas differing in two seed traits, the F₂ generation exhibits a phenotypic segregation ratio of 9 (dominant-dominant) : 3 (dominant-recessive) : 3 (recessive-dominant) : 1 (recessive-recessive).',
    subject: 'Botany & Genetics'
  },
  {
    id: 'neet-006',
    text: 'Ovulation in the human female menstrual cycle is triggered around day 14 primarily by a dramatic mid-cycle surge in which pituitary hormone?',
    options: ['Progesterone', 'Luteinizing Hormone (LH)', 'Oxytocin', 'Prolactin'],
    correctAnswerIndex: 1,
    explanation: 'The LH surge induces the rupture of the mature Graafian follicle and releases the secondary oocyte into the fallopian tube (ovulation).',
    subject: 'Zoology'
  },
  {
    id: 'neet-007',
    text: 'Which cellular organ of excretion and osmoregulation is characteristic of insects such as Cockroaches (Periplaneta americana)?',
    options: ['Nephridia', 'Flame cells (Protonephridia)', 'Malpighian tubules', 'Green glands'],
    correctAnswerIndex: 2,
    explanation: 'Malpighian tubules located at the junction of the midgut and hindgut extract nitrogenous wastes (principally potassium urate) from hemolymph and excrete uric acid crystals.',
    subject: 'Zoology'
  },
  {
    id: 'neet-008',
    text: 'Which plant growth regulator is referred to as the "Stress Hormone" because it induces rapid stomatal closure in response to water deficit stress?',
    options: ['Abscisic Acid (ABA)', 'Gibberellic Acid (GA₃)', 'Zeatin', 'Indole-3-Acetic Acid (IAA)'],
    correctAnswerIndex: 0,
    explanation: 'Abscisic Acid (ABA) acts as a survival hormone during drought, causing potassium efflux from guard cells leading to stomatal closure, and enforces seed dormancy.',
    subject: 'Botany'
  },
  {
    id: 'neet-009',
    text: 'What is the de Broglie wavelength (λ) of an electron accelerated from rest across an electrical potential difference of V volts?',
    options: ['λ ≈ 12.27 / √V Å', 'λ ≈ 1.227 * √V Å', 'λ ≈ 0.286 / √V Å', 'λ ≈ 6.63 * V Å'],
    correctAnswerIndex: 0,
    explanation: 'From λ = h / √(2 m q V), substituting standard constants for an electron yields the celebrated shortcut formula λ = 12.27 / √V Angstroms (Å).',
    subject: 'Physics'
  },
  {
    id: 'neet-010',
    text: 'When a p-n junction diode is placed under Forward Bias, what happens to the depletion layer width and the barrier potential?',
    options: ['Depletion layer widens and barrier increases', 'Depletion layer narrows and barrier decreases', 'Both remain constant', 'The diode acts as an open circuit'],
    correctAnswerIndex: 1,
    explanation: 'Under forward bias, majority carriers are pushed toward the junction, neutralizing space charge and causing the depletion layer width and junction potential barrier to decrease.',
    subject: 'Physics'
  },
  {
    id: 'neet-011',
    text: 'Which hormone is synthesized and secreted by the Juxtaglomerular (JG) cells of the renal afferent arteriole when blood pressure or GFR drops?',
    options: ['Renin', 'Aldosterone', 'Atrial Natriuretic Factor (ANF)', 'Erythropoietin'],
    correctAnswerIndex: 0,
    explanation: 'Renin is an aspartic protease that hydrolyzes circulating angiotensinogen to angiotensin I, initiating the RAAS pathway to elevate systemic blood pressure and GFR.',
    subject: 'Zoology'
  },
  {
    id: 'neet-012',
    text: 'Genetically modified "Golden Rice" has been bio-engineered to biosynthesize high concentrations of which nutrient to eliminate childhood blindness?',
    options: ['Vitamin C (Ascorbic Acid)', 'Beta-Carotene (Provitamin A)', 'Iron and Folic Acid', 'Vitamin B12'],
    correctAnswerIndex: 1,
    explanation: 'Golden Rice is genetically fortified with genes for phytoene synthase and carotene desaturase to produce beta-carotene (provitamin A) in the edible grain endosperm.',
    subject: 'Botany & Biotechnology'
  },
  {
    id: 'neet-013',
    text: 'What is the calculated oxidation state of Chromium (Cr) in Potassium Dichromate (K₂Cr₂O₇)?',
    options: ['+3', '+4', '+6', '+7'],
    correctAnswerIndex: 2,
    explanation: 'In K₂Cr₂O₇: 2(+1) + 2(x) + 7(-2) = 0 -> 2 + 2x - 14 = 0 -> 2x = 12 -> x = +6.',
    subject: 'Chemistry'
  },
  {
    id: 'neet-014',
    text: 'Which organic functional group gives a brilliant positive "Silver Mirror Test" when treated with ammoniacal silver nitrate solution (Tollens\' Reagent)?',
    options: ['Ketones (-CO-)', 'Aldehydes (-CHO)', 'Carboxylic acids (-COOH)', 'Alcohols (-OH)'],
    correctAnswerIndex: 1,
    explanation: 'Aldehydes are easily oxidized by Tollens\' reagent [Ag(NH₃)₂]⁺, reducing silver ions into metallic elemental silver which coats the test-tube wall as a shiny silver mirror.',
    subject: 'Chemistry'
  },
  {
    id: 'neet-015',
    text: 'During DNA replication in eukaryotes, the discontinuous short segments synthesized on the lagging strand are known as:',
    options: ['Okazaki fragments', 'TATA boxes', 'Introns', 'Poly-A tails'],
    correctAnswerIndex: 0,
    explanation: 'Because DNA polymerase synthesizes only in the 5\' to 3\' direction, the lagging strand is replicated discontinuously as Okazaki fragments, which are subsequently sealed by DNA Ligase.',
    subject: 'Botany & Genetics'
  },
  {
    id: 'neet-016',
    text: 'Which enzyme is regarded as the most abundant protein in the entire biosphere?',
    options: ['Collagen', 'RuBisCO', 'DNA Polymerase', 'Insulin'],
    correctAnswerIndex: 1,
    explanation: 'RuBisCO (Ribulose-1,5-bisphosphate carboxylase-oxygenase) in chloroplasts makes up nearly 40% of soluble leaf protein, making it the most abundant enzyme on Earth.',
    subject: 'Botany'
  },
  {
    id: 'neet-017',
    text: 'The testicular endocrine cells responsible for the biosynthesis and secretion of male Androgens (Testosterone) under the influence of LH are:',
    options: ['Sertoli cells', 'Leydig cells (Interstitial cells)', 'Spermatogonia', 'Epididymal principal cells'],
    correctAnswerIndex: 1,
    explanation: 'Leydig cells located in the interstitial spaces between seminiferous tubules produce testosterone upon stimulation by Luteinizing Hormone (ICSH).',
    subject: 'Zoology'
  },
  {
    id: 'neet-018',
    text: 'What is the work done by the Centripetal Force acting on a mass revolving in a uniform circular orbit of radius r over one complete cycle?',
    options: ['2π r F', 'π r F', 'Zero', '(1 / 2) m v²'],
    correctAnswerIndex: 2,
    explanation: 'The centripetal force is always directed radially inward, perpendicular to the instantaneous tangential displacement (θ = 90°). Thus, Work W = F · d = F d cos(90°) = 0.',
    subject: 'Physics'
  },
  {
    id: 'neet-019',
    text: 'What is the theoretical escape velocity from the gravitational field of the Earth\'s surface?',
    options: ['9.8 km/s', '11.2 km/s', '15.4 km/s', '22.4 km/s'],
    correctAnswerIndex: 1,
    explanation: 'Escape velocity v_e = √(2 g R). With g = 9.8 m/s² and R = 6.4 * 10⁶ m, v_e = √(2 * 9.8 * 6.4 * 10⁶) ≈ 11.2 km/s.',
    subject: 'Physics'
  },
  {
    id: 'neet-020',
    text: 'The historic international treaty "Montreal Protocol" signed in 1987 (effective 1989) was established to control the emissions of:',
    options: ['Greenhouse gases driving global warming', 'Ozone-depleting substances (CFCs and Halons)', 'Nuclear radioactive waste', 'Hazardous persistent organic pollutants'],
    correctAnswerIndex: 1,
    explanation: 'The Montreal Protocol on Substances that Deplete the Ozone Layer phases out chlorofluorocarbons (CFCs) and halons to protect the stratospheric ozone layer.',
    subject: 'Botany & Ecology'
  },
  {
    id: 'neet-021',
    text: 'Which phylum of animals exhibits bilateral symmetry in their free-swimming larval stage but develops pentamerous radial symmetry as adults?',
    options: ['Arthropoda', 'Mollusca', 'Echinodermata', 'Annelida'],
    correctAnswerIndex: 2,
    explanation: 'Adult echinoderms (e.g. Starfish, Sea urchins) possess pentaradial symmetry, whereas their ciliated bipinnaria and pluteus larvae are bilaterally symmetrical.',
    subject: 'Zoology'
  },
  {
    id: 'neet-022',
    text: 'Which chemical solution gives a negative result in the Biuret test for proteins?',
    options: ['Gelatin', 'Albumin', 'Pure Glucose solution', 'Casein (Milk protein)'],
    correctAnswerIndex: 2,
    explanation: 'The Biuret test detects peptide bonds (-CO-NH-). Pure glucose is a simple monosaccharide carbohydrate without peptide bonds, yielding a negative biuret test.',
    subject: 'Chemistry'
  },
  {
    id: 'neet-023',
    text: 'In human respiration, approximately what percentage of oxygen is transported bound to hemoglobin in red blood cells as Oxyhemoglobin?',
    options: ['3%', '20%', '70%', '97%'],
    correctAnswerIndex: 3,
    explanation: 'About 97% of O₂ is transported by RBCs as oxyhemoglobin (Hb₄O₈), while the remaining 3% is carried in a dissolved physical state in plasma.',
    subject: 'Zoology'
  },
  {
    id: 'neet-024',
    text: 'According to Raoult\'s Law, the relative lowering of vapour pressure of an ideal dilute solution is mathematically equal to the:',
    options: ['Mole fraction of the non-volatile solute', 'Mole fraction of the solvent', 'Molality of the solution', 'Osmotic pressure of the solution'],
    correctAnswerIndex: 0,
    explanation: '(P° - P) / P° = X_solute, where X_solute is the mole fraction of the dissolved non-volatile solute.',
    subject: 'Chemistry'
  },
  {
    id: 'neet-025',
    text: 'The electrical resistance of an Ideal Ammeter and an Ideal Voltmeter are respectively:',
    options: ['Zero and Infinite', 'Infinite and Zero', 'Zero and Zero', 'Infinite and Infinite'],
    correctAnswerIndex: 0,
    explanation: 'An ideal ammeter connected in series must have zero internal resistance so it causes no voltage drop. An ideal voltmeter connected in parallel must have infinite resistance to draw zero current.',
    subject: 'Physics'
  }
];
