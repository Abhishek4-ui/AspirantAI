/**
 * AspirantAI — Official GATE Multi-Disciplinary Registry
 * Contains verified official paper codes, syllabus structures, and examination blueprints
 * for ALL officially offered GATE examination papers (GATE 2024, 2025, 2026).
 */

const OFFICIAL_GATE_PAPERS = [
  {
    code: 'CS',
    name: 'Computer Science and Information Technology',
    hasEngineeringMath: true,
    hasGeneralAptitude: true,
    category: 'Engineering & Technology',
    yearsOffered: [2020, 2021, 2022, 2023, 2024, 2025, 2026],
    totalQuestions: 65,
    totalMarks: 100,
    durationMinutes: 180,
    sections: [
      {
        name: 'General Aptitude (GA)',
        weight: 0.15,
        topics: ['Verbal Ability', 'Quantitative Aptitude', 'Analytical Aptitude', 'Spatial Aptitude']
      },
      {
        name: 'Engineering Mathematics',
        weight: 0.13,
        topics: ['Discrete Mathematics', 'Linear Algebra', 'Calculus', 'Probability and Statistics']
      },
      {
        name: 'Algorithms and Data Structures',
        weight: 0.18,
        topics: ['Asymptotic Analysis & Recurrences', 'Divide & Conquer, Greedy, Dynamic Programming', 'Graph Algorithms & Shortest Paths', 'Hashing, Stacks, Queues, Trees, Heaps']
      },
      {
        name: 'Theory of Computation & Compiler Design',
        weight: 0.16,
        topics: ['Regular Languages & Finite Automata', 'Context-Free Languages & Pushdown Automata', 'Turing Machines & Decidability', 'Lexical Analysis, Parsing, Syntax Directed Translation', 'Code Generation & Optimization']
      },
      {
        name: 'Computer Organization & Architecture',
        weight: 0.12,
        topics: ['Machine Instructions & Addressing Modes', 'ALU, Data Path & Control Unit', 'Instruction Pipelining & Hazards', 'Memory Hierarchy (Cache, Main, Virtual Memory)', 'I/O Interface & DMA']
      },
      {
        name: 'Operating Systems',
        weight: 0.14,
        topics: ['Processes, Threads & CPU Scheduling', 'Inter-process Communication & Synchronization', 'Deadlocks & Prevention', 'Memory Management & Paging', 'File Systems & Disk Scheduling']
      },
      {
        name: 'Databases & Computer Networks',
        weight: 0.12,
        topics: ['ER Model & Relational Algebra', 'SQL Queries & Normal Forms (1NF-BCNF)', 'Transaction Management & Concurrency Control', 'OSI/TCP-IP Layers, Framing, Error Control', 'Routing Algorithms, IPv4/IPv6, TCP/UDP Congestion Control', 'Application Layer Protocols & Network Security']
      }
    ]
  },
  {
    code: 'DA',
    name: 'Data Science and Artificial Intelligence',
    hasEngineeringMath: true,
    hasGeneralAptitude: true,
    category: 'Engineering & Technology',
    yearsOffered: [2024, 2025, 2026],
    totalQuestions: 65,
    totalMarks: 100,
    durationMinutes: 180,
    sections: [
      {
        name: 'General Aptitude (GA)',
        weight: 0.15,
        topics: ['Verbal Ability', 'Quantitative Aptitude', 'Analytical Aptitude', 'Spatial Aptitude']
      },
      {
        name: 'Probability and Statistics',
        weight: 0.20,
        topics: ['Random Variables & Expectation', 'Probability Distributions (Normal, Poisson, Binomial)', 'Bayes Theorem & Conditional Probability', 'Hypothesis Testing & Confidence Intervals']
      },
      {
        name: 'Linear Algebra & Calculus',
        weight: 0.15,
        topics: ['Vector Spaces, Basis, Linear Independence', 'Eigenvalues, Eigenvectors, Diagonalization', 'Singular Value Decomposition (SVD)', 'Multivariable Calculus, Gradients, Optimizations']
      },
      {
        name: 'Programming, Data Structures & Algorithms',
        weight: 0.18,
        topics: ['Python Data Structures & Complexity', 'Searching & Sorting Algorithms', 'Graph Theory Basics & Traversal', 'Dynamic Programming Fundamentals']
      },
      {
        name: 'Database Management & Data Warehousing',
        weight: 0.12,
        topics: ['Relational Model, Normalization, SQL', 'Data Warehousing, OLAP, Star & Snowflake Schema', 'Indexing & Query Processing']
      },
      {
        name: 'Machine Learning',
        weight: 0.20,
        topics: ['Supervised Learning (Regression, Logistic, SVM, Decision Trees)', 'Unsupervised Learning (K-Means, PCA, Hierarchical)', 'Cross-Validation & Regularization (L1/L2)', 'Neural Networks & Deep Learning Basics']
      }
    ]
  },
  {
    code: 'EC',
    name: 'Electronics and Communication Engineering',
    hasEngineeringMath: true,
    hasGeneralAptitude: true,
    category: 'Engineering & Technology',
    yearsOffered: [2020, 2021, 2022, 2023, 2024, 2025, 2026],
    totalQuestions: 65,
    totalMarks: 100,
    durationMinutes: 180,
    sections: [
      { name: 'General Aptitude', weight: 0.15, topics: ['Verbal Ability', 'Numerical Ability', 'Abstract Reasoning'] },
      { name: 'Engineering Mathematics', weight: 0.13, topics: ['Linear Algebra', 'Calculus', 'Differential Equations', 'Complex Analysis', 'Probability'] },
      { name: 'Networks, Signals and Systems', weight: 0.18, topics: ['Network Solution Methods & Theorems', 'Continuous & Discrete-Time Fourier Transform', 'Laplace & Z-Transform', 'LTI Systems & Sampling Theorem'] },
      { name: 'Electronic Devices & Analog Circuits', weight: 0.18, topics: ['Energy Bands in Silicon, PN Junction, Zener', 'BJT, MOSFET, Small Signal Models', 'Op-Amp Applications, Oscillators, Amplifiers'] },
      { name: 'Digital Circuits & Microprocessors', weight: 0.16, topics: ['Boolean Algebra, Combinational Logic', 'Sequential Circuits (Flip-Flops, Counters, Registers)', 'Data Converters (ADC/DAC)', '8085/8086 Architecture'] },
      { name: 'Communications & Electromagnetics', weight: 0.20, topics: ['Random Processes, AM/FM Modulation', 'Digital Modulation (ASK, PSK, QAM), Information Theory', 'Maxwell Equations, Transmission Lines, Waveguides, Antennas'] }
    ]
  },
  {
    code: 'EE',
    name: 'Electrical Engineering',
    hasEngineeringMath: true,
    hasGeneralAptitude: true,
    category: 'Engineering & Technology',
    yearsOffered: [2020, 2021, 2022, 2023, 2024, 2025, 2026],
    totalQuestions: 65,
    totalMarks: 100,
    durationMinutes: 180,
    sections: [
      { name: 'General Aptitude', weight: 0.15, topics: ['Verbal Ability', 'Quantitative Ability', 'Logical Reasoning'] },
      { name: 'Engineering Mathematics', weight: 0.13, topics: ['Linear Algebra', 'Calculus', 'Differential Equations', 'Complex Variables', 'Probability'] },
      { name: 'Electric Circuits & Electromagnetic Fields', weight: 0.16, topics: ['Network Theorems, Transient Analysis', 'Three Phase Balanced Circuits', 'Coulomb Law, Magnetic Circuits, Biot-Savart Law'] },
      { name: 'Electrical Machines', weight: 0.18, topics: ['Single & Three-Phase Transformers', 'DC Machines: Operating Characteristics', 'Three-Phase Induction Motors', 'Synchronous Generators & Motors'] },
      { name: 'Power Systems', weight: 0.18, topics: ['Transmission Line Models, Symmetrical Components', 'Load Flow Analysis (Gauss-Seidel, Newton-Raphson)', 'Power System Stability, Fault Analysis, Relays & Circuit Breakers'] },
      { name: 'Control Systems & Power Electronics', weight: 0.20, topics: ['Transfer Functions, Root Locus, Bode Plots, Nyquist', 'State Variable Models', 'Thyristors, MOSFETs, IGBTs, Inverters, Choppers, Rectifiers'] }
    ]
  },
  {
    code: 'ME',
    name: 'Mechanical Engineering',
    hasEngineeringMath: true,
    hasGeneralAptitude: true,
    category: 'Engineering & Technology',
    yearsOffered: [2020, 2021, 2022, 2023, 2024, 2025, 2026],
    totalQuestions: 65,
    totalMarks: 100,
    durationMinutes: 180,
    sections: [
      { name: 'General Aptitude', weight: 0.15, topics: ['Verbal Ability', 'Quantitative Ability', 'Spatial Aptitude'] },
      { name: 'Engineering Mathematics', weight: 0.13, topics: ['Linear Algebra', 'Calculus', 'Differential Equations', 'Numerical Methods', 'Probability'] },
      { name: 'Applied Mechanics and Design', weight: 0.24, topics: ['Engineering Mechanics (Trusses, Friction, Dynamics)', 'Strength of Materials (Stress, Strain, Bending, Torsion)', 'Theory of Machines & Vibrations', 'Machine Design (Shafts, Gears, Bearings)'] },
      { name: 'Fluid Mechanics and Thermal Sciences', weight: 0.26, topics: ['Fluid Properties, Bernoulli, Boundary Layer', 'Thermodynamics Laws, Cycles (Carnot, Rankine, Otto, Diesel)', 'Heat Transfer (Conduction, Convection, Radiation, Heat Exchangers)'] },
      { name: 'Materials, Manufacturing & Industrial Engineering', weight: 0.22, topics: ['Engineering Materials & Phase Diagrams', 'Casting, Forming, Welding, Machining', 'Computer Integrated Manufacturing (CIM), Metrology', 'Operations Research, LPP, Queuing, Inventory, Forecasting'] }
    ]
  },
  {
    code: 'CE',
    name: 'Civil Engineering',
    hasEngineeringMath: true,
    hasGeneralAptitude: true,
    category: 'Engineering & Technology',
    yearsOffered: [2020, 2021, 2022, 2023, 2024, 2025, 2026],
    totalQuestions: 65,
    totalMarks: 100,
    durationMinutes: 180,
    sections: [
      { name: 'General Aptitude', weight: 0.15, topics: ['Verbal Ability', 'Numerical Ability', 'Reasoning'] },
      { name: 'Engineering Mathematics', weight: 0.13, topics: ['Linear Algebra', 'Calculus', 'Ordinary & Partial Differential Equations', 'Probability and Statistics'] },
      { name: 'Structural Engineering', weight: 0.22, topics: ['Solid Mechanics & Stresses', 'Structural Analysis (Trusses, Arches, Moment Distribution)', 'Design of Concrete Structures (LSM & WSM)', 'Design of Steel Structures (Tension, Compression, Beams)'] },
      { name: 'Geotechnical & Foundation Engineering', weight: 0.18, topics: ['Soil Mechanics, Permeability, Consolidation, Shear Strength', 'Earth Pressure, Slope Stability, Shallow & Deep Foundations'] },
      { name: 'Water Resources & Environmental Engineering', weight: 0.20, topics: ['Fluid Mechanics, Pipe Flow, Open Channel Flow', 'Hydrology & Irrigation Engineering', 'Water Quality, Wastewater Treatment, Air Pollution'] },
      { name: 'Transportation & Geomatics Engineering', weight: 0.12, topics: ['Geometric Design of Highways, Pavement Design, Traffic Engineering', 'Principles of Surveying, Levelling, GPS and GIS Basics'] }
    ]
  },
  {
    code: 'CH',
    name: 'Chemical Engineering',
    hasEngineeringMath: true,
    hasGeneralAptitude: true,
    category: 'Engineering & Technology',
    yearsOffered: [2020, 2021, 2022, 2023, 2024, 2025, 2026],
    totalQuestions: 65,
    totalMarks: 100,
    durationMinutes: 180,
    sections: [
      { name: 'General Aptitude', weight: 0.15, topics: ['Verbal Ability', 'Numerical Ability'] },
      { name: 'Engineering Mathematics', weight: 0.13, topics: ['Linear Algebra', 'Calculus', 'Differential Equations', 'Numerical Methods'] },
      { name: 'Process Calculations & Thermodynamics', weight: 0.18, topics: ['Material & Energy Balances, Recycling', 'Phase Equilibria, VLE, Chemical Reaction Equilibria'] },
      { name: 'Fluid Mechanics & Mechanical Operations', weight: 0.16, topics: ['Fluid Statics, Navier-Stokes, Boundary Layer', 'Pumps, Compressors, Particle Settling, Filtration'] },
      { name: 'Heat & Mass Transfer', weight: 0.20, topics: ['Conduction, Convection, Radiation, Exchangers', 'Fick Law, Distillation, Absorption, Extraction, Drying'] },
      { name: 'Chemical Reaction Engineering & Plant Design', weight: 0.18, topics: ['Kinetics, CSTR, PFR, Catalyst Deactivation', 'Process Control, Instrumentation, Plant Economics'] }
    ]
  },
  {
    code: 'IN',
    name: 'Instrumentation Engineering',
    hasEngineeringMath: true,
    hasGeneralAptitude: true,
    category: 'Engineering & Technology',
    yearsOffered: [2020, 2021, 2022, 2023, 2024, 2025, 2026],
    totalQuestions: 65,
    totalMarks: 100,
    durationMinutes: 180,
    sections: [
      { name: 'General Aptitude', weight: 0.15, topics: ['Verbal Ability', 'Analytical Ability'] },
      { name: 'Engineering Mathematics', weight: 0.13, topics: ['Linear Algebra', 'Calculus', 'Complex Variables'] },
      { name: 'Sensors and Industrial Instrumentation', weight: 0.25, topics: ['Transducers (Resistive, Capacitive, Inductive)', 'Measurement of Temperature, Pressure, Flow, Level', 'Optical & Biomedical Instrumentation'] },
      { name: 'Signals and Systems & Control Systems', weight: 0.25, topics: ['Continuous & Discrete Time LTI Systems', 'Feedback Systems, Stability Criteria, Compensators'] },
      { name: 'Analog & Digital Electronics', weight: 0.22, topics: ['Op-Amp Circuits, Filters, ADC/DAC', 'Microcontrollers & Communication Protocols'] }
    ]
  },
  {
    code: 'BM',
    name: 'Biomedical Engineering',
    hasEngineeringMath: true,
    hasGeneralAptitude: true,
    category: 'Engineering & Technology',
    yearsOffered: [2020, 2021, 2022, 2023, 2024, 2025, 2026],
    totalQuestions: 65,
    totalMarks: 100,
    durationMinutes: 180,
    sections: [
      { name: 'General Aptitude', weight: 0.15, topics: ['Verbal Ability', 'Quantitative Aptitude'] },
      { name: 'Engineering Mathematics', weight: 0.13, topics: ['Linear Algebra', 'Calculus', 'Differential Equations'] },
      { name: 'Biomedical Signals and Systems', weight: 0.24, topics: ['ECG, EEG, EMG Signal Processing', 'Filtering & Spectral Analysis'] },
      { name: 'Biomaterials & Biomechanics', weight: 0.24, topics: ['Biocompatibility, Polymers, Metals for Implants', 'Tissue Mechanics, Prosthetics & Orthotics'] },
      { name: 'Medical Imaging & Instrumentation', weight: 0.24, topics: ['X-Ray, CT Scan, MRI, Ultrasound Imaging', 'Defibrillators, Pacemakers, Biosensors'] }
    ]
  },
  {
    code: 'BT',
    name: 'Biotechnology',
    hasEngineeringMath: true,
    hasGeneralAptitude: true,
    category: 'Engineering & Technology',
    yearsOffered: [2020, 2021, 2022, 2023, 2024, 2025, 2026],
    totalQuestions: 65,
    totalMarks: 100,
    durationMinutes: 180,
    sections: [
      { name: 'General Aptitude', weight: 0.15, topics: ['Verbal Ability', 'Quantitative Ability'] },
      { name: 'Engineering Mathematics', weight: 0.13, topics: ['Calculus', 'Probability', 'Differential Equations'] },
      { name: 'Biochemistry & Microbiology', weight: 0.24, topics: ['Biomolecules, Enzyme Kinetics', 'Microbial Growth & Metabolism'] },
      { name: 'Molecular Biology & Genetics', weight: 0.24, topics: ['DNA Replication, Transcription, Translation', 'Recombinant DNA Technology, PCR, CRISPR'] },
      { name: 'Bioprocess Engineering & Bioinformatics', weight: 0.24, topics: ['Bioreactor Design, Downstream Processing', 'Sequence Alignment, BLAST, Phylogenetic Trees'] }
    ]
  },
  {
    code: 'AE',
    name: 'Aerospace Engineering',
    hasEngineeringMath: true,
    hasGeneralAptitude: true,
    category: 'Engineering & Technology',
    yearsOffered: [2020, 2021, 2022, 2023, 2024, 2025, 2026],
    totalQuestions: 65,
    totalMarks: 100,
    durationMinutes: 180,
    sections: [
      { name: 'General Aptitude', weight: 0.15, topics: ['Verbal Ability', 'Spatial Aptitude'] },
      { name: 'Engineering Mathematics', weight: 0.13, topics: ['Linear Algebra', 'Calculus', 'Differential Equations'] },
      { name: 'Aerodynamics', weight: 0.24, topics: ['Incompressible Flow, Airfoils, Wings', 'Compressible Flow, Shock Waves, Wind Tunnel Testing'] },
      { name: 'Flight Mechanics & Propulsion', weight: 0.24, topics: ['Aircraft Performance, Stability & Control', 'Gas Turbine Engines, Rocket Propulsion'] },
      { name: 'Space Dynamics & Structures', weight: 0.24, topics: ['Orbital Mechanics, Kepler Laws', 'Aircraft Structural Analysis, Aeroelasticity'] }
    ]
  },
  {
    code: 'AG',
    name: 'Agricultural Engineering',
    hasEngineeringMath: true,
    hasGeneralAptitude: true,
    category: 'Engineering & Technology',
    yearsOffered: [2020, 2021, 2022, 2023, 2024, 2025, 2026],
    totalQuestions: 65,
    totalMarks: 100,
    durationMinutes: 180,
    sections: [
      { name: 'General Aptitude', weight: 0.15, topics: ['Verbal Ability', 'Quantitative Ability'] },
      { name: 'Engineering Mathematics', weight: 0.13, topics: ['Linear Algebra', 'Calculus', 'Probability'] },
      { name: 'Farm Machinery and Power', weight: 0.24, topics: ['Tractor Systems, Tillage Equipment', 'Harvesting & Threshing Machinery'] },
      { name: 'Soil and Water Conservation', weight: 0.24, topics: ['Hydrology, Soil Erosion Control', 'Irrigation Systems (Drip, Sprinkler), Drainage'] },
      { name: 'Agricultural Processing & Storage', weight: 0.24, topics: ['Drying, Milling, Grain Storage Structures'] }
    ]
  },
  {
    code: 'AR',
    name: 'Architecture and Planning',
    hasEngineeringMath: false,
    hasGeneralAptitude: true,
    category: 'Architecture & Planning',
    yearsOffered: [2020, 2021, 2022, 2023, 2024, 2025, 2026],
    totalQuestions: 65,
    totalMarks: 100,
    durationMinutes: 180,
    sections: [
      { name: 'General Aptitude', weight: 0.15, topics: ['Verbal Ability', 'Spatial Ability'] },
      { name: 'Architecture, City and Housing', weight: 0.35, topics: ['History of Architecture (Indian, Western)', 'Contemporary Architecture & Urban Design', 'Housing Typologies & Affordable Housing'] },
      { name: 'Planning and Landscape', weight: 0.25, topics: ['Urban Planning Principles, Master Plans, Zoning', 'Environmental Impact Assessment, Landscape Architecture'] },
      { name: 'Building Systems & Construction Management', weight: 0.25, topics: ['Building Services (HVAC, Acoustics, Lighting)', 'Sustainable Architecture & Green Buildings', 'Project Management, CPM, PERT'] }
    ]
  },
  {
    code: 'CY',
    name: 'Chemistry',
    hasEngineeringMath: false,
    hasGeneralAptitude: true,
    category: 'Science',
    yearsOffered: [2020, 2021, 2022, 2023, 2024, 2025, 2026],
    totalQuestions: 65,
    totalMarks: 100,
    durationMinutes: 180,
    sections: [
      { name: 'General Aptitude', weight: 0.15, topics: ['Verbal Ability', 'Numerical Ability'] },
      { name: 'Physical Chemistry', weight: 0.28, topics: ['Quantum Chemistry, Spectroscopy', 'Chemical Thermodynamics & Kinetics', 'Electrochemistry & Solid State'] },
      { name: 'Inorganic Chemistry', weight: 0.28, topics: ['Coordination Chemistry, Organometallics', 'Bioinorganic Chemistry & Main Group Elements'] },
      { name: 'Organic Chemistry', weight: 0.29, topics: ['Reaction Mechanisms, Stereochemistry', 'Pericyclic Reactions & Organic Synthesis'] }
    ]
  },
  {
    code: 'ES',
    name: 'Environmental Science and Engineering',
    hasEngineeringMath: true,
    hasGeneralAptitude: true,
    category: 'Engineering & Technology',
    yearsOffered: [2021, 2022, 2023, 2024, 2025, 2026],
    totalQuestions: 65,
    totalMarks: 100,
    durationMinutes: 180,
    sections: [
      { name: 'General Aptitude', weight: 0.15, topics: ['Verbal Ability', 'Quantitative Ability'] },
      { name: 'Engineering Mathematics', weight: 0.13, topics: ['Calculus', 'Probability and Statistics'] },
      { name: 'Environmental Chemistry & Microbiology', weight: 0.24, topics: ['Water Chemistry, Atmospheric Chemistry', 'Microbial Ecology, Pathogens, Biodegradation'] },
      { name: 'Water Resources & Environmental Treatment', weight: 0.24, topics: ['Water Supply, Wastewater Treatment, Sludge Management'] },
      { name: 'Air Pollution & Solid Waste Management', weight: 0.24, topics: ['Particulate & Gaseous Pollutants, Control Devices', 'Hazardous Waste, Circular Economy'] }
    ]
  },
  {
    code: 'EY',
    name: 'Ecology and Evolution',
    hasEngineeringMath: false,
    hasGeneralAptitude: true,
    category: 'Science',
    yearsOffered: [2020, 2021, 2022, 2023, 2024, 2025, 2026],
    totalQuestions: 65,
    totalMarks: 100,
    durationMinutes: 180,
    sections: [
      { name: 'General Aptitude', weight: 0.15, topics: ['Verbal Ability', 'Reasoning'] },
      { name: 'Ecology', weight: 0.30, topics: ['Population Ecology, Community Dynamics', 'Ecosystem Energetics & Biogeochemical Cycles'] },
      { name: 'Evolution', weight: 0.30, topics: ['Natural Selection, Speciation, Phylogenetics', 'Molecular Evolution & Population Genetics'] },
      { name: 'Behavioral Ecology & Conservation', weight: 0.25, topics: ['Animal Behavior, Foraging Strategies', 'Conservation Biology & Biodiversity Conservation'] }
    ]
  },
  {
    code: 'GE',
    name: 'Geomatics Engineering',
    hasEngineeringMath: true,
    hasGeneralAptitude: true,
    category: 'Engineering & Technology',
    yearsOffered: [2022, 2023, 2024, 2025, 2026],
    totalQuestions: 65,
    totalMarks: 100,
    durationMinutes: 180,
    sections: [
      { name: 'General Aptitude', weight: 0.15, topics: ['Verbal Ability', 'Quantitative Aptitude'] },
      { name: 'Engineering Mathematics', weight: 0.13, topics: ['Linear Algebra', 'Calculus'] },
      { name: 'Remote Sensing', weight: 0.24, topics: ['Electromagnetic Spectrum, Sensors, Satellite Platforms', 'Digital Image Processing, Classification'] },
      { name: 'Geographical Information Systems (GIS)', weight: 0.24, topics: ['Spatial Data Models, Vector & Raster Analysis', 'Coordinate Systems & Map Projections'] },
      { name: 'Global Navigation Satellite Systems (GNSS) & Surveying', weight: 0.24, topics: ['GPS, GLONASS, NavIC, Photogrammetry, LiDAR'] }
    ]
  },
  {
    code: 'GG',
    name: 'Geology and Geophysics',
    hasEngineeringMath: false,
    hasGeneralAptitude: true,
    category: 'Science',
    yearsOffered: [2020, 2021, 2022, 2023, 2024, 2025, 2026],
    totalQuestions: 65,
    totalMarks: 100,
    durationMinutes: 180,
    sections: [
      { name: 'General Aptitude', weight: 0.15, topics: ['Verbal Ability', 'Logical Reasoning'] },
      { name: 'Common Geology and Geophysics', weight: 0.25, topics: ['Earth Interior, Plate Tectonics, Mineralogy'] },
      { name: 'Geology Specialization', weight: 0.30, topics: ['Petrology, Structural Geology, Stratigraphy, Paleontology'] },
      { name: 'Geophysics Specialization', weight: 0.30, topics: ['Seismic Methods, Gravity & Magnetic Prospecting, Well Logging'] }
    ]
  },
  {
    code: 'MA',
    name: 'Mathematics',
    hasEngineeringMath: false,
    hasGeneralAptitude: true,
    category: 'Science',
    yearsOffered: [2020, 2021, 2022, 2023, 2024, 2025, 2026],
    totalQuestions: 65,
    totalMarks: 100,
    durationMinutes: 180,
    sections: [
      { name: 'General Aptitude', weight: 0.15, topics: ['Verbal Ability', 'Numerical Ability'] },
      { name: 'Linear Algebra & Abstract Algebra', weight: 0.25, topics: ['Vector Spaces, Groups, Rings, Fields'] },
      { name: 'Real Analysis & Complex Analysis', weight: 0.25, topics: ['Metric Spaces, Sequences, Analytic Functions, Residue Calculus'] },
      { name: 'Ordinary & Partial Differential Equations', weight: 0.20, topics: ['Boundary Value Problems, Laplace & Fourier Transforms'] },
      { name: 'Numerical Analysis & Topology', weight: 0.15, topics: ['Root Finding, Topological Spaces, Compactness'] }
    ]
  },
  {
    code: 'MN',
    name: 'Mining Engineering',
    hasEngineeringMath: true,
    hasGeneralAptitude: true,
    category: 'Engineering & Technology',
    yearsOffered: [2020, 2021, 2022, 2023, 2024, 2025, 2026],
    totalQuestions: 65,
    totalMarks: 100,
    durationMinutes: 180,
    sections: [
      { name: 'General Aptitude', weight: 0.15, topics: ['Verbal Ability', 'Numerical Ability'] },
      { name: 'Engineering Mathematics', weight: 0.13, topics: ['Linear Algebra', 'Calculus', 'Probability'] },
      { name: 'Mine Development & Surface Mining', weight: 0.24, topics: ['Drilling, Blasting, Explosives, Opencast Mining'] },
      { name: 'Underground Mining & Ventilation', weight: 0.24, topics: ['Coal & Metal Mining Methods, Mine Gases & Dust'] },
      { name: 'Rock Mechanics & Ground Control', weight: 0.24, topics: ['Stress Distribution, Strata Control, Roof Bolting'] }
    ]
  },
  {
    code: 'MT',
    name: 'Metallurgical Engineering',
    hasEngineeringMath: true,
    hasGeneralAptitude: true,
    category: 'Engineering & Technology',
    yearsOffered: [2020, 2021, 2022, 2023, 2024, 2025, 2026],
    totalQuestions: 65,
    totalMarks: 100,
    durationMinutes: 180,
    sections: [
      { name: 'General Aptitude', weight: 0.15, topics: ['Verbal Ability', 'Quantitative Ability'] },
      { name: 'Engineering Mathematics', weight: 0.13, topics: ['Linear Algebra', 'Calculus', 'Differential Equations'] },
      { name: 'Thermodynamics and Rate Processes', weight: 0.24, topics: ['Ellingham Diagrams, Phase Equilibria, Diffusion'] },
      { name: 'Physical Metallurgy', weight: 0.24, topics: ['Crystal Imperfections, Phase Transformations, Heat Treatment'] },
      { name: 'Mechanical & Manufacturing Metallurgy', weight: 0.24, topics: ['Elastic & Plastic Deformation, Fracture, Casting, Welding'] }
    ]
  },
  {
    code: 'NM',
    name: 'Naval Architecture and Marine Engineering',
    hasEngineeringMath: true,
    hasGeneralAptitude: true,
    category: 'Engineering & Technology',
    yearsOffered: [2022, 2023, 2024, 2025, 2026],
    totalQuestions: 65,
    totalMarks: 100,
    durationMinutes: 180,
    sections: [
      { name: 'General Aptitude', weight: 0.15, topics: ['Verbal Ability', 'Spatial Aptitude'] },
      { name: 'Engineering Mathematics', weight: 0.13, topics: ['Linear Algebra', 'Calculus', 'Differential Equations'] },
      { name: 'Hydrostatics and Ship Stability', weight: 0.24, topics: ['Buoyancy, Metacentre, Damage Stability'] },
      { name: 'Ship Resistance and Propulsion', weight: 0.24, topics: ['Frictional Resistance, Propeller Design, Cavitation'] },
      { name: 'Ship Structures and Marine Systems', weight: 0.24, topics: ['Longitudinal Strength, Marine Engines, Piping Systems'] }
    ]
  },
  {
    code: 'PE',
    name: 'Petroleum Engineering',
    hasEngineeringMath: true,
    hasGeneralAptitude: true,
    category: 'Engineering & Technology',
    yearsOffered: [2020, 2021, 2022, 2023, 2024, 2025, 2026],
    totalQuestions: 65,
    totalMarks: 100,
    durationMinutes: 180,
    sections: [
      { name: 'General Aptitude', weight: 0.15, topics: ['Verbal Ability', 'Quantitative Aptitude'] },
      { name: 'Engineering Mathematics', weight: 0.13, topics: ['Linear Algebra', 'Calculus', 'Differential Equations'] },
      { name: 'Drilling & Well Completion', weight: 0.24, topics: ['Drilling Fluids, Casing Design, Blowout Prevention'] },
      { name: 'Reservoir Engineering', weight: 0.24, topics: ['Porosity, Permeability, Darcy Law, Material Balance'] },
      { name: 'Production Operations & Enhanced Recovery', weight: 0.24, topics: ['Artificial Lift, EOR Methods, Gas Processing'] }
    ]
  },
  {
    code: 'PH',
    name: 'Physics',
    hasEngineeringMath: false,
    hasGeneralAptitude: true,
    category: 'Science',
    yearsOffered: [2020, 2021, 2022, 2023, 2024, 2025, 2026],
    totalQuestions: 65,
    totalMarks: 100,
    durationMinutes: 180,
    sections: [
      { name: 'General Aptitude', weight: 0.15, topics: ['Verbal Ability', 'Analytical Reasoning'] },
      { name: 'Classical Mechanics', weight: 0.20, topics: ['Lagrangian & Hamiltonian Formulation, Central Force Motion'] },
      { name: 'Electromagnetic Theory', weight: 0.20, topics: ['Maxwell Equations, Wave Propagation, Relativistic Electrodynamics'] },
      { name: 'Quantum Mechanics', weight: 0.25, topics: ['Schrodinger Equation, Hydrogen Atom, Perturbation Theory'] },
      { name: 'Thermodynamics & Solid State Physics', weight: 0.20, topics: ['Statistical Mechanics, Band Theory, Superconductivity'] }
    ]
  },
  {
    code: 'PI',
    name: 'Production and Industrial Engineering',
    hasEngineeringMath: true,
    hasGeneralAptitude: true,
    category: 'Engineering & Technology',
    yearsOffered: [2020, 2021, 2022, 2023, 2024, 2025, 2026],
    totalQuestions: 65,
    totalMarks: 100,
    durationMinutes: 180,
    sections: [
      { name: 'General Aptitude', weight: 0.15, topics: ['Verbal Ability', 'Quantitative Aptitude'] },
      { name: 'Engineering Mathematics', weight: 0.13, topics: ['Linear Algebra', 'Calculus', 'Probability'] },
      { name: 'Metal Casting, Forming & Joining', weight: 0.24, topics: ['Moulding, Forging, Rolling, Arc Welding'] },
      { name: 'Machining and Machine Tool Operations', weight: 0.24, topics: ['Merchant Circle, Tool Life, CNC Machining, Metrology'] },
      { name: 'Operations Research & Supply Chain', weight: 0.24, topics: ['Linear Programming, Transportation, Inventory, Six Sigma'] }
    ]
  },
  {
    code: 'ST',
    name: 'Statistics',
    hasEngineeringMath: false,
    hasGeneralAptitude: true,
    category: 'Science',
    yearsOffered: [2020, 2021, 2022, 2023, 2024, 2025, 2026],
    totalQuestions: 65,
    totalMarks: 100,
    durationMinutes: 180,
    sections: [
      { name: 'General Aptitude', weight: 0.15, topics: ['Verbal Ability', 'Logical Reasoning'] },
      { name: 'Probability and Distribution Theory', weight: 0.30, topics: ['Central Limit Theorem, Joint Distributions, Order Statistics'] },
      { name: 'Statistical Inference & Hypothesis Testing', weight: 0.30, topics: ['Neyman-Pearson Lemma, Maximum Likelihood Estimation, UMVUE'] },
      { name: 'Linear Models & Design of Experiments', weight: 0.25, topics: ['Regression Analysis, ANOVA, Factorial Designs'] }
    ]
  },
  {
    code: 'TF',
    name: 'Textile Engineering and Fibre Science',
    hasEngineeringMath: true,
    hasGeneralAptitude: true,
    category: 'Engineering & Technology',
    yearsOffered: [2020, 2021, 2022, 2023, 2024, 2025, 2026],
    totalQuestions: 65,
    totalMarks: 100,
    durationMinutes: 180,
    sections: [
      { name: 'General Aptitude', weight: 0.15, topics: ['Verbal Ability', 'Quantitative Ability'] },
      { name: 'Engineering Mathematics', weight: 0.13, topics: ['Calculus', 'Differential Equations'] },
      { name: 'Fibre Structure and Properties', weight: 0.24, topics: ['Natural & Synthetic Fibres, Crystallinity, Tenacity'] },
      { name: 'Yarn Manufacture & Fabric Structure', weight: 0.24, topics: ['Carding, Spinning, Weaving, Knitting Principles'] },
      { name: 'Chemical Processing & Testing', weight: 0.24, topics: ['Bleaching, Dyeing, Printing, Tensile Testing'] }
    ]
  },
  {
    code: 'XE',
    name: 'Engineering Sciences',
    hasEngineeringMath: true,
    hasGeneralAptitude: true,
    category: 'Interdisciplinary Engineering',
    yearsOffered: [2020, 2021, 2022, 2023, 2024, 2025, 2026],
    totalQuestions: 65,
    totalMarks: 100,
    durationMinutes: 180,
    sections: [
      { name: 'General Aptitude', weight: 0.15, topics: ['Verbal Ability', 'Quantitative Aptitude'] },
      { name: 'Section A: Engineering Mathematics (Compulsory)', weight: 0.15, topics: ['Linear Algebra', 'Calculus', 'Complex Variables', 'Differential Equations'] },
      { name: 'Optional Section 1 (Fluid Mechanics / Solid Mechanics / Thermodynamics)', weight: 0.35, topics: ['Core Principles & Applied Problems'] },
      { name: 'Optional Section 2 (Materials Science / Polymer Science / Atmospheric Science)', weight: 0.35, topics: ['Specialized Theoretical & Computational Analysis'] }
    ]
  },
  {
    code: 'XH',
    name: 'Humanities and Social Sciences',
    hasEngineeringMath: false,
    hasGeneralAptitude: true,
    category: 'Humanities & Social Sciences',
    yearsOffered: [2021, 2022, 2023, 2024, 2025, 2026],
    totalQuestions: 65,
    totalMarks: 100,
    durationMinutes: 180,
    sections: [
      { name: 'General Aptitude', weight: 0.15, topics: ['Verbal Ability', 'Analytical Ability'] },
      { name: 'Section B1: Reasoning and Comprehension (Compulsory)', weight: 0.25, topics: ['Reading Comprehension, Critical Reasoning, Logic'] },
      { name: 'Discipline Optional (Economics / English / Linguistics / Philosophy / Psychology / Sociology)', weight: 0.60, topics: ['Advanced Disciplinary Foundations & Analytical Methodologies'] }
    ]
  },
  {
    code: 'XL',
    name: 'Life Sciences',
    hasEngineeringMath: false,
    hasGeneralAptitude: true,
    category: 'Life Sciences',
    yearsOffered: [2020, 2021, 2022, 2023, 2024, 2025, 2026],
    totalQuestions: 65,
    totalMarks: 100,
    durationMinutes: 180,
    sections: [
      { name: 'General Aptitude', weight: 0.15, topics: ['Verbal Ability', 'Quantitative Reasoning'] },
      { name: 'Section P: Chemistry (Compulsory)', weight: 0.25, topics: ['Atomic Structure, Chemical Bonding, Reaction Mechanisms, Stereochemistry'] },
      { name: 'Optional Life Science Discipline 1 (Biochemistry / Botany / Microbiology)', weight: 0.30, topics: ['Cellular Metabolism, Plant Physiology, Microbial Genetics'] },
      { name: 'Optional Life Science Discipline 2 (Zoology / Food Technology)', weight: 0.30, topics: ['Animal Diversity, Immunology, Food Processing & Preservation'] }
    ]
  }
];

function getAllGatePapers(filterYear = null) {
  if (!filterYear || filterYear === 'All') return OFFICIAL_GATE_PAPERS;
  const yr = parseInt(filterYear, 10);
  if (isNaN(yr)) return OFFICIAL_GATE_PAPERS;
  return OFFICIAL_GATE_PAPERS.filter(p => p.yearsOffered.includes(yr));
}

function getGatePaperByCode(code) {
  if (!code) return null;
  const upper = code.toUpperCase().replace(/^GATE_?/, '');
  return OFFICIAL_GATE_PAPERS.find(p => p.code.toUpperCase() === upper) || null;
}

module.exports = {
  OFFICIAL_GATE_PAPERS,
  getAllGatePapers,
  getGatePaperByCode
};
