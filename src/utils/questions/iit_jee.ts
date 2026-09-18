import { Question } from '../../types';

export const IIT_JEE_QUESTION_POOL: Question[] = [
  {
    id: 'jee-001',
    text: 'In Young\'s Double Slit Experiment (YDSE), if the slit separation d is halved and the slit-to-screen distance D is doubled, what happens to the fringe width β?',
    options: ['Remains unchanged', 'Doubled', 'Halved', 'Increases by 4 times'],
    correctAnswerIndex: 3,
    explanation: 'Fringe width β = λD / d. New fringe width β\' = λ(2D) / (d / 2) = 4(λD / d) = 4β. It increases by 4 times.',
    subject: 'Physics'
  },
  {
    id: 'jee-002',
    text: 'Which coordination complex ion exhibits optical isomerism (enantiomerism)?',
    options: ['[Co(NH₃)₆]³⁺', 'cis-[Co(en)₂Cl₂]⁺', 'trans-[Co(en)₂Cl₂]⁺', '[Ni(CN)₄]²⁻'],
    correctAnswerIndex: 1,
    explanation: 'cis-[Co(en)₂Cl₂]⁺ lacks both a plane of symmetry and an inversion center, making its mirror image non-superimposable (chiral and optically active).',
    subject: 'Chemistry'
  },
  {
    id: 'jee-003',
    text: 'If A is a 3 × 3 non-singular matrix such that A Aᵀ = Aᵀ A and B = A⁻¹ Aᵀ, what is B Bᵀ equal to?',
    options: ['I (Identity Matrix)', 'A', 'B²', 'A⁻¹'],
    correctAnswerIndex: 0,
    explanation: 'B Bᵀ = (A⁻¹ Aᵀ)(A⁻¹ Aᵀ)ᵀ = (A⁻¹ Aᵀ)(A (A⁻¹)ᵀ) = A⁻¹ (Aᵀ A) (Aᵀ)⁻¹ = A⁻¹ (A Aᵀ) (Aᵀ)⁻¹ = (A⁻¹ A)(Aᵀ (Aᵀ)⁻¹) = I.',
    subject: 'Mathematics'
  },
  {
    id: 'jee-004',
    text: 'One mole of an ideal gas undergoes reversible isothermal expansion at temperature T from volume V to 2V. The work done by the gas is:',
    options: ['RT ln 2', '2 RT', 'RT / 2', 'Zero'],
    correctAnswerIndex: 0,
    explanation: 'For reversible isothermal expansion of an ideal gas: W = nRT ln(V₂ / V₁) = (1)RT ln(2V / V) = RT ln 2.',
    subject: 'Physics'
  },
  {
    id: 'jee-005',
    text: 'Which ion has the highest limiting molar conductivity (Λ°ₘ) in aqueous solution at 298 K?',
    options: ['Li⁺', 'Na⁺', 'K⁺', 'H⁺ (aq)'],
    correctAnswerIndex: 3,
    explanation: 'The hydrogen ion H⁺ (hydronium) exhibits exceptionally high molar conductivity in water via the Grotthuss proton-hop relay mechanism across hydrogen bonds.',
    subject: 'Chemistry'
  },
  {
    id: 'jee-006',
    text: 'A particle moves along a straight line such that its velocity is given by v = α√x, where α is a positive constant and x is displacement. The acceleration of the particle is:',
    options: ['α / 2', 'α² / 2', 'α²', '2 α²'],
    correctAnswerIndex: 1,
    explanation: 'Acceleration a = v (dv/dx) = (α x^(1/2)) * [α * (1/2) x^(-1/2)] = α² / 2, which is constant.',
    subject: 'Physics'
  },
  {
    id: 'jee-007',
    text: 'Which of the following organic halides will undergo an Sₙ1 solvolysis reaction at the fastest rate?',
    options: ['CH₃-CH₂-Cl', 'CH₂=CH-CH₂-Cl (Allyl chloride)', '(CH₃)₃C-Cl (tert-Butyl chloride)', 'C₆H₅-CH₂-Cl (Benzyl chloride)'],
    correctAnswerIndex: 3,
    explanation: 'The benzyl carbocation (C₆H₅-CH₂⁺) formed upon departure of Cl⁻ is exceptionally stable due to extensive resonance delocalization across the aromatic ring, driving the fastest Sₙ1 rate.',
    subject: 'Chemistry'
  },
  {
    id: 'jee-008',
    text: 'Evaluate the calculus limit: lim_{x -> 0} (tan x - sin x) / x³',
    options: ['0', '1 / 2', '1', '2'],
    correctAnswerIndex: 1,
    explanation: '(tan x - sin x) / x³ = [sin x (1 - cos x)] / (x³ cos x) = (sin x / x) * [2 sin²(x/2) / x²] * (1 / cos x) -> 1 * 2 * (1/4) * 1 = 1/2.',
    subject: 'Mathematics'
  },
  {
    id: 'jee-009',
    text: 'The electric field at any point inside a uniformly charged conducting spherical shell of radius R carrying charge Q is:',
    options: ['kQ / R²', 'kQ / r²', 'Zero', 'kQ / 2R²'],
    correctAnswerIndex: 2,
    explanation: 'By Gauss\'s Law, a spherical Gaussian surface inside a charged spherical shell encloses zero net charge, so E = 0 at all internal points (electrostatic shielding).',
    subject: 'Physics'
  },
  {
    id: 'jee-010',
    text: 'The Reimer-Tiemann reaction converts phenol into which aromatic compound in the presence of chloroform (CHCl₃) and aqueous potassium hydroxide (KOH)?',
    options: ['Benzaldehyde', 'Salicylaldehyde (o-hydroxybenzaldehyde)', 'Benzoic acid', 'Anisole'],
    correctAnswerIndex: 1,
    explanation: 'Phenol reacts with chloroform and alkali via a dichlorocarbene (:CCl₂) intermediate to introduce a formyl group ortho to the phenolic -OH, yielding Salicylaldehyde.',
    subject: 'Chemistry'
  },
  {
    id: 'jee-011',
    text: 'Evaluate the definite integral: ∫₀¹ [1 / (1 + x²)] dx',
    options: ['π / 2', 'π / 4', 'π / 3', '1'],
    correctAnswerIndex: 1,
    explanation: '∫ [1 / (1 + x²)] dx = tan⁻¹(x). Evaluating from 0 to 1: tan⁻¹(1) - tan⁻¹(0) = π/4 - 0 = π/4.',
    subject: 'Mathematics'
  },
  {
    id: 'jee-012',
    text: 'The theoretical efficiency of a reversible Carnot heat engine operating between a reservoir at 600 K and a sink at 300 K is:',
    options: ['25%', '33.3%', '50%', '75%'],
    correctAnswerIndex: 2,
    explanation: 'Carnot efficiency η = 1 - (T_cold / T_hot) = 1 - (300 / 600) = 1 - 0.5 = 0.5 = 50%.',
    subject: 'Physics'
  },
  {
    id: 'jee-013',
    text: 'What are the dimensional formula and SI units of Planck\'s constant (h)?',
    options: ['[M L² T⁻¹], Joule·second', '[M L T⁻²], Newton', '[M L² T⁻²], Joule', '[M L⁻¹ T⁻¹], Pascal·second'],
    correctAnswerIndex: 0,
    explanation: 'From E = hν, h = E / ν = [M L² T⁻²] / [T⁻¹] = [M L² T⁻¹]. Its dimensions are identical to those of angular momentum.',
    subject: 'Physics'
  },
  {
    id: 'jee-014',
    text: 'What is the hybridization and molecular shape of Xenon Tetrafluoride (XeF₄)?',
    options: ['sp³d, See-saw', 'sp³d², Square planar', 'dsp², Square planar', 'sp³d, Trigonal bipyramidal'],
    correctAnswerIndex: 1,
    explanation: 'Xenon has 8 valence electrons. In XeF₄, it forms 4 bond pairs and has 2 lone pairs (Steric Number = 6). The hybridization is sp³d² with an octahedral electron geometry and a square planar molecular shape.',
    subject: 'Chemistry'
  },
  {
    id: 'jee-015',
    text: 'If A is a 3 × 3 square matrix with determinant |A| = 4, what is the determinant of its adjugate matrix |adj(A)|?',
    options: ['4', '12', '16', '64'],
    correctAnswerIndex: 2,
    explanation: 'For any n × n matrix, |adj(A)| = |A|^(n - 1). Here n = 3, so |adj(A)| = |A|^(3 - 1) = |A|² = 4² = 16.',
    subject: 'Mathematics'
  },
  {
    id: 'jee-016',
    text: 'What is the moment of inertia of a uniform solid sphere of mass M and radius R about any diameter axis?',
    options: ['(1 / 2) M R²', '(2 / 5) M R²', '(2 / 3) M R²', '(5 / 3) M R²'],
    correctAnswerIndex: 1,
    explanation: 'By standard integration for a uniform solid sphere, I_diameter = (2 / 5) M R².',
    subject: 'Physics'
  },
  {
    id: 'jee-017',
    text: 'For a first-order chemical reaction, if the rate constant is k, what is the half-life period (t₁/₂)?',
    options: ['0.693 / k', 'k / 0.693', '1 / (k · [A]₀)', '[A]₀ / (2 k)'],
    correctAnswerIndex: 0,
    explanation: 'For a first-order reaction, t₁/₂ = ln(2) / k = 0.693 / k, which is strictly independent of the initial reactant concentration.',
    subject: 'Chemistry'
  },
  {
    id: 'jee-018',
    text: 'If the scalar triple product of three non-zero vectors [a⃗  b⃗  c⃗] = 0, what does this mathematically imply?',
    options: [
      'The three vectors are mutually perpendicular',
      'The three vectors are coplanar',
      'The three vectors have unit magnitude',
      'At least one vector is a null vector'
    ],
    correctAnswerIndex: 1,
    explanation: 'The scalar triple product a⃗ · (b⃗ × c⃗) represents the volume of the parallelepiped formed by the three vectors. When the volume is zero, the vectors lie in the same plane (coplanar).',
    subject: 'Mathematics'
  },
  {
    id: 'jee-019',
    text: 'The magnetic field B at the center of a circular coil of radius R carrying a steady electric current I is:',
    options: ['μ₀ I / (2 R)', 'μ₀ I / (4π R)', 'μ₀ I / (2π R)', 'μ₀ I / R²'],
    correctAnswerIndex: 0,
    explanation: 'By the Biot-Savart Law, the magnetic field at the center of a circular loop of radius R with 1 turn is B = (μ₀ I) / (2 R).',
    subject: 'Physics'
  },
  {
    id: 'jee-020',
    text: 'Which of the following compounds will readily undergo self-aldol condensation in the presence of dilute NaOH?',
    options: ['HCHO (Formaldehyde)', 'C₆H₅CHO (Benzaldehyde)', 'CH₃CHO (Acetaldehyde)', '(CH₃)₃C-CHO (Pivalaldehyde)'],
    correctAnswerIndex: 2,
    explanation: 'Aldol condensation requires the presence of at least one α-hydrogen atom. Acetaldehyde (CH₃CHO) has 3 α-hydrogens, whereas formaldehyde, benzaldehyde, and pivalaldehyde have zero α-hydrogens.',
    subject: 'Chemistry'
  },
  {
    id: 'jee-021',
    text: 'What is the maximum mathematical value of the trigonometric function f(x) = 3 sin x + 4 cos x?',
    options: ['5', '7', '12', '25'],
    correctAnswerIndex: 0,
    explanation: 'The maximum value of a sin x + b cos x is √(a² + b²) = √(3² + 4²) = √(9 + 16) = √25 = 5.',
    subject: 'Mathematics'
  },
  {
    id: 'jee-022',
    text: 'The relationship between standard Gibbs Free Energy change (ΔG°) and standard cell electromotive force (E°_cell) is:',
    options: ['ΔG° = -n F E°_cell', 'ΔG° = n F E°_cell', 'ΔG° = -R T ln(E°_cell)', 'ΔG° = -n F / E°_cell'],
    correctAnswerIndex: 0,
    explanation: 'Standard Gibbs free energy change represents maximum electrical work: ΔG° = -w_elec = -n F E°_cell, where n is moles of electrons and F is Faraday\'s constant.',
    subject: 'Chemistry'
  },
  {
    id: 'jee-023',
    text: 'What is the area of the region bounded by the parabola y² = 4ax and its latus rectum x = a?',
    options: ['(8 / 3) a²', '(4 / 3) a²', '2 a²', '(16 / 3) a²'],
    correctAnswerIndex: 0,
    explanation: 'Area = 2 ∫₀ᵃ 2√(ax) dx = 4√a * [(2/3) x^(3/2)]₀ᵃ = 4√a * (2/3) a^(3/2) = (8 / 3) a².',
    subject: 'Mathematics'
  },
  {
    id: 'jee-024',
    text: 'In the photoelectric effect, if the frequency of incident light is doubled while keeping intensity constant, the stopping potential:',
    options: ['Is halved', 'Is doubled', 'More than doubles', 'Remains unchanged'],
    correctAnswerIndex: 2,
    explanation: 'Einstein\'s photoelectric equation: eV₀ = hν - Φ. If ν -> 2ν, eV₀\' = 2hν - Φ = 2(hν - Φ) + Φ = 2(eV₀) + Φ. Thus, V₀\' > 2V₀ (more than doubles).',
    subject: 'Physics'
  },
  {
    id: 'jee-025',
    text: 'What is the total number of terms in the algebraic expansion of (x + y + z)¹⁰?',
    options: ['55', '66', '121', '1000'],
    correctAnswerIndex: 1,
    explanation: 'The number of non-negative integral solutions of a + b + c = n is given by (n + r - 1) C (r - 1). Here n = 10, r = 3: (10 + 3 - 1) C (3 - 1) = 12 C 2 = (12 * 11) / 2 = 66.',
    subject: 'Mathematics'
  }
];
