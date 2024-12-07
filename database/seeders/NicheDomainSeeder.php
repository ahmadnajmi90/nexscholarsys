<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NicheDomainSeeder extends Seeder
{
    public function run()
    {
        DB::table('niche_domain')->insert([
            // Crop Science niche domains
            ['name' => 'Plant breeding and genetics', 'research_area_id' => 1],
            ['name' => 'Sustainable crop production', 'research_area_id' => 1],
            ['name' => 'Precision agriculture', 'research_area_id' => 1],

            // Soil Science niche domains
            ['name' => 'Soil fertility and nutrient management', 'research_area_id' => 2],
            ['name' => 'Soil microbiology', 'research_area_id' => 2],
            ['name' => 'Land degradation and soil conservation', 'research_area_id' => 2],

            // Agricultural Engineering niche domains
            ['name' => 'Mechanisation and automation', 'research_area_id' => 3],
            ['name' => 'Irrigation and water management', 'research_area_id' => 3],
            ['name' => 'Post-harvest technology', 'research_area_id' => 3],

            // Exoplanet Studies niche domains
            ['name' => 'Planetary detection methods', 'research_area_id' => 4],
            ['name' => 'Habitability of exoplanets', 'research_area_id' => 4],
            ['name' => 'Atmospheric characterisation of exoplanets', 'research_area_id' => 4],

            // Cosmology niche domains
            ['name' => 'Dark matter and dark energy', 'research_area_id' => 5],
            ['name' => 'Cosmic microwave background', 'research_area_id' => 5],
            ['name' => 'Large-scale structure of the universe', 'research_area_id' => 5],

            // Stellar Astrophysics niche domains
            ['name' => 'Star formation theories', 'research_area_id' => 6],
            ['name' => 'Stellar evolution', 'research_area_id' => 6],
            ['name' => 'Supernova explosions', 'research_area_id' => 6],

            // Genetics and Genomics niche domains
            ['name' => 'Functional genomics', 'research_area_id' => 7],
            ['name' => 'Epigenetics', 'research_area_id' => 7],
            ['name' => 'Genome editing technologies', 'research_area_id' => 7],

            // Microbiology niche domains
            ['name' => 'Antimicrobial resistance', 'research_area_id' => 8],
            ['name' => 'Pathogenic microorganisms', 'research_area_id' => 8],
            ['name' => 'Industrial microbiology', 'research_area_id' => 8],

            // Ecology niche domains
            ['name' => 'Biodiversity conservation', 'research_area_id' => 9],
            ['name' => 'Ecosystem dynamics', 'research_area_id' => 9],
            ['name' => 'Climate change impacts on ecosystems', 'research_area_id' => 9],

            // Organisational Behaviour niche domains
            ['name' => 'Leadership theories', 'research_area_id' => 10],
            ['name' => 'Employee motivation', 'research_area_id' => 10],
            ['name' => 'Change management', 'research_area_id' => 10],

            // Marketing Analytics niche domains
            ['name' => 'Consumer behaviour analysis', 'research_area_id' => 11],
            ['name' => 'Digital marketing metrics', 'research_area_id' => 11],
            ['name' => 'Market segmentation', 'research_area_id' => 11],

            // Entrepreneurship Studies niche domains
            ['name' => 'Startup ecosystems', 'research_area_id' => 12],
            ['name' => 'Venture capital dynamics', 'research_area_id' => 12],
            ['name' => 'Innovation strategies', 'research_area_id' => 12],

            // Organic Chemistry niche domains
            ['name' => 'Natural product synthesis', 'research_area_id' => 13],
            ['name' => 'Reaction mechanisms', 'research_area_id' => 13],
            ['name' => 'Polymer chemistry', 'research_area_id' => 13],

            // Inorganic Chemistry niche domains
            ['name' => 'Coordination compounds', 'research_area_id' => 14],
            ['name' => 'Bioinorganic chemistry', 'research_area_id' => 14],
            ['name' => 'Catalysis', 'research_area_id' => 14],

            // Analytical Chemistry niche domains
            ['name' => 'Spectroscopy methods', 'research_area_id' => 15],
            ['name' => 'Chromatographic techniques', 'research_area_id' => 15],
            ['name' => 'Electrochemical analysis', 'research_area_id' => 15],

            // Structural Engineering niche domains
            ['name' => 'Building materials and structures', 'research_area_id' => 16],
            ['name' => 'Seismic design and analysis', 'research_area_id' => 16],
            ['name' => 'Structural health monitoring', 'research_area_id' => 16],

            // Transportation Engineering niche domains
            ['name' => 'Traffic flow modelling', 'research_area_id' => 17],
            ['name' => 'Sustainable transport systems', 'research_area_id' => 17],
            ['name' => 'Transportation safety and risk analysis', 'research_area_id' => 17],

            // Geotechnical Engineering niche domains
            ['name' => 'Soil mechanics', 'research_area_id' => 18],
            ['name' => 'Geotechnical earthquake engineering', 'research_area_id' => 18],
            ['name' => 'Groundwater management', 'research_area_id' => 18],

            // Artificial Intelligence niche domains
            ['name' => 'Machine learning algorithms', 'research_area_id' => 19],
            ['name' => 'Natural language processing', 'research_area_id' => 19],
            ['name' => 'Computer vision', 'research_area_id' => 19],

            // Cybersecurity niche domains
            ['name' => 'Network security', 'research_area_id' => 20],
            ['name' => 'Cryptography', 'research_area_id' => 20],
            ['name' => 'Ethical hacking', 'research_area_id' => 20],

            // Data Science niche domains
            ['name' => 'Big data analytics', 'research_area_id' => 21],
            ['name' => 'Predictive modelling', 'research_area_id' => 21],
            ['name' => 'Data visualisation', 'research_area_id' => 21],

            // Visual Arts niche domains
            ['name' => 'Digital art', 'research_area_id' => 22],
            ['name' => 'Art history', 'research_area_id' => 22],
            ['name' => 'Art and technology', 'research_area_id' => 22],

            // Creative Writing niche domains
            ['name' => 'Fiction writing', 'research_area_id' => 23],
            ['name' => 'Poetry', 'research_area_id' => 23],
            ['name' => 'Playwriting', 'research_area_id' => 23],

            // Performing Arts niche domains
            ['name' => 'Theatre studies', 'research_area_id' => 24],
            ['name' => 'Dance studies', 'research_area_id' => 24],
            ['name' => 'Music performance', 'research_area_id' => 24],

            // Geology niche domains
            ['name' => 'Petrology', 'research_area_id' => 25],
            ['name' => 'Mineralogy', 'research_area_id' => 25],
            ['name' => 'Paleontology', 'research_area_id' => 25],

            // Meteorology niche domains
            ['name' => 'Weather forecasting', 'research_area_id' => 26],
            ['name' => 'Climate modelling', 'research_area_id' => 26],
            ['name' => 'Atmospheric chemistry', 'research_area_id' => 26],

            // Oceanography niche domains
            ['name' => 'Marine biology', 'research_area_id' => 27],
            ['name' => 'Ocean currents', 'research_area_id' => 27],
            ['name' => 'Marine pollution', 'research_area_id' => 27],

            // Macroeconomics niche domains
            ['name' => 'Economic growth and development', 'research_area_id' => 28],
            ['name' => 'Monetary policy', 'research_area_id' => 28],
            ['name' => 'International trade', 'research_area_id' => 28],

            // Microeconomics niche domains
            ['name' => 'Market structure analysis', 'research_area_id' => 29],
            ['name' => 'Consumer choice theory', 'research_area_id' => 29],
            ['name' => 'Labor economics', 'research_area_id' => 29],

            // Behavioural Economics niche domains
            ['name' => 'Decision-making biases', 'research_area_id' => 30],
            ['name' => 'Nudge theory', 'research_area_id' => 30],
            ['name' => 'Prospect theory', 'research_area_id' => 30],

            // Curriculum Development niche domains
            ['name' => 'Instructional design', 'research_area_id' => 31],
            ['name' => 'Assessment and evaluation', 'research_area_id' => 31],
            ['name' => 'Curriculum policy', 'research_area_id' => 31],

            // Educational Technology niche domains
            ['name' => 'E-learning platforms', 'research_area_id' => 32],
            ['name' => 'Online education tools', 'research_area_id' => 32],
            ['name' => 'Virtual classrooms', 'research_area_id' => 32],

            // Inclusive Education niche domains
            ['name' => 'Special needs education', 'research_area_id' => 33],
            ['name' => 'Universal design for learning', 'research_area_id' => 33],
            ['name' => 'Educational equity', 'research_area_id' => 33],

            // Power Systems niche domains
            ['name' => 'Smart grids', 'research_area_id' => 34],
            ['name' => 'Renewable energy integration', 'research_area_id' => 34],
            ['name' => 'Power distribution networks', 'research_area_id' => 34],

            // Signal Processing niche domains
            ['name' => 'Image processing', 'research_area_id' => 35],
            ['name' => 'Speech recognition', 'research_area_id' => 35],
            ['name' => 'Signal filtering techniques', 'research_area_id' => 35],

            // Embedded Systems niche domains
            ['name' => 'IoT applications', 'research_area_id' => 36],
            ['name' => 'Real-time systems', 'research_area_id' => 36],
            ['name' => 'Microcontroller-based design', 'research_area_id' => 36],

            // Environmental Chemistry niche domains
            ['name' => 'Environmental pollutants', 'research_area_id' => 37],
            ['name' => 'Water quality analysis', 'research_area_id' => 37],
            ['name' => 'Waste management chemistry', 'research_area_id' => 37],

            // Climate Change Science niche domains
            ['name' => 'Carbon footprint analysis', 'research_area_id' => 38],
            ['name' => 'Greenhouse gases', 'research_area_id' => 38],
            ['name' => 'Climate modelling and predictions', 'research_area_id' => 38],

            // Pollution Control niche domains
            ['name' => 'Air pollution control', 'research_area_id' => 39],
            ['name' => 'Water pollution treatment', 'research_area_id' => 39],
            ['name' => 'Waste management technologies', 'research_area_id' => 39],

            // Public Health niche domains
            ['name' => 'Epidemic control', 'research_area_id' => 40],
            ['name' => 'Health systems management', 'research_area_id' => 40],
            ['name' => 'Health promotion', 'research_area_id' => 40],

            // Epidemiology niche domains
            ['name' => 'Disease surveillance', 'research_area_id' => 41],
            ['name' => 'Biostatistical analysis', 'research_area_id' => 41],
            ['name' => 'Infectious disease epidemiology', 'research_area_id' => 41],

            // Health Informatics niche domains
            ['name' => 'Electronic health records', 'research_area_id' => 42],
            ['name' => 'Telemedicine', 'research_area_id' => 42],
            ['name' => 'Health data analytics', 'research_area_id' => 42],

            // Ancient History niche domains
            ['name' => 'Ancient civilisations', 'research_area_id' => 43],
            ['name' => 'Archaeological methods', 'research_area_id' => 43],
            ['name' => 'Ancient art and architecture', 'research_area_id' => 43],

            // Modern History niche domains
            ['name' => 'Modern revolutions', 'research_area_id' => 44],
            ['name' => 'World wars history', 'research_area_id' => 44],
            ['name' => 'History of modern politics', 'research_area_id' => 44],

            // World History niche domains
            ['name' => 'Global trade history', 'research_area_id' => 45],
            ['name' => 'Colonialism and decolonisation', 'research_area_id' => 45],
            ['name' => 'Transnational history', 'research_area_id' => 45],

            // Cultural Studies niche domains
            ['name' => 'Media and popular culture', 'research_area_id' => 46],
            ['name' => 'Globalisation and identity', 'research_area_id' => 46],
            ['name' => 'Cultural heritage and preservation', 'research_area_id' => 46],
            
            // Anthropology niche domains
            ['name' => 'Cultural anthropology', 'research_area_id' => 47],
            ['name' => 'Archaeological anthropology', 'research_area_id' => 47],
            ['name' => 'Linguistic anthropology', 'research_area_id' => 47],

            // Sociology niche domains
            ['name' => 'Social stratification', 'research_area_id' => 48],
            ['name' => 'Urban sociology', 'research_area_id' => 48],
            ['name' => 'Sociology of education', 'research_area_id' => 48],

            // Human Rights Law niche domains
            ['name' => 'International human rights treaties', 'research_area_id' => 49],
            ['name' => 'Humanitarian law', 'research_area_id' => 49],
            ['name' => 'Gender and equality law', 'research_area_id' => 49],

            // Corporate Law niche domains
            ['name' => 'Corporate governance and compliance', 'research_area_id' => 50],
            ['name' => 'Mergers and acquisitions', 'research_area_id' => 50],
            ['name' => 'Corporate taxation', 'research_area_id' => 50],

            // International Law (research_area_id = 51)
            ['name' => 'Treaty negotiations and enforcement', 'research_area_id' => 51],
            ['name' => 'International humanitarian law', 'research_area_id' => 51],
            ['name' => 'Law of the sea and territorial disputes', 'research_area_id' => 51],

            // Knowledge Management (research_area_id = 52)
            ['name' => 'Knowledge sharing strategies', 'research_area_id' => 52],
            ['name' => 'Knowledge repositories and curation', 'research_area_id' => 52],
            ['name' => 'Organisational learning and innovation', 'research_area_id' => 52],

            // Digital Libraries (research_area_id = 53)
            ['name' => 'Metadata standards and interoperability', 'research_area_id' => 53],
            ['name' => 'Digital preservation techniques', 'research_area_id' => 53],
            ['name' => 'User experience in digital library systems', 'research_area_id' => 53],

            // Information Retrieval (research_area_id = 54)
            ['name' => 'Search engine optimisation', 'research_area_id' => 54],
            ['name' => 'Semantic search technologies', 'research_area_id' => 54],
            ['name' => 'Personalised information retrieval', 'research_area_id' => 54],

            // Nanomaterials (research_area_id = 55)
            ['name' => 'Synthesis of nanostructures', 'research_area_id' => 55],
            ['name' => 'Applications in drug delivery', 'research_area_id' => 55],
            ['name' => 'Environmental impacts of nanomaterials', 'research_area_id' => 55],

            // Composite Materials (research_area_id = 56)
            ['name' => 'Fibre-reinforced composites', 'research_area_id' => 56],
            ['name' => 'Hybrid composite technologies', 'research_area_id' => 56],
            ['name' => 'Bio-based composite materials', 'research_area_id' => 56],

            // Metallurgy (research_area_id = 57)
            ['name' => 'Corrosion resistance studies', 'research_area_id' => 57],
            ['name' => 'Alloy development for aerospace', 'research_area_id' => 57],
            ['name' => 'Recycling and sustainable metallurgy', 'research_area_id' => 57],

            // Algebra (research_area_id = 58)
            ['name' => 'Group theory applications', 'research_area_id' => 58],
            ['name' => 'Algebraic geometry', 'research_area_id' => 58],
            ['name' => 'Linear algebra in machine learning', 'research_area_id' => 58],

            // Statistics (research_area_id = 59)
            ['name' => 'Bayesian inference methods', 'research_area_id' => 59],
            ['name' => 'Statistical modelling and simulation', 'research_area_id' => 59],
            ['name' => 'Multivariate analysis', 'research_area_id' => 59],

            // Applied Mathematics (research_area_id = 60)
            ['name' => 'Numerical analysis techniques', 'research_area_id' => 60],
            ['name' => 'Mathematical modelling of ecosystems', 'research_area_id' => 60],
            ['name' => 'Optimisation problems in engineering', 'research_area_id' => 60],

            // Thermodynamics (Mechanical Engineering, research_area_id = 61)
            ['name' => 'Heat transfer in energy systems', 'research_area_id' => 61],
            ['name' => 'Thermodynamics of materials', 'research_area_id' => 61],
            ['name' => 'Advanced power cycles', 'research_area_id' => 61],

            // Robotics (Mechanical Engineering, research_area_id = 62)
            ['name' => 'Robotic control systems', 'research_area_id' => 62],
            ['name' => 'Autonomous navigation algorithms', 'research_area_id' => 62],
            ['name' => 'Humanoid robot design', 'research_area_id' => 62],

            // Fluid Mechanics (Mechanical Engineering, research_area_id = 63)
            ['name' => 'Turbulent flow analysis', 'research_area_id' => 63],
            ['name' => 'Hydrodynamic stability', 'research_area_id' => 63],
            ['name' => 'Aeroelasticity in fluid mechanics', 'research_area_id' => 63],

             // Pharmacology (Medical and Health Sciences, research_area_id = 64)
            ['name' => 'Drug design and development', 'research_area_id' => 64],
            ['name' => 'Pharmacokinetics and pharmacodynamics', 'research_area_id' => 64],
            ['name' => 'Natural product pharmacology', 'research_area_id' => 64],

            // Pathology (Medical and Health Sciences, research_area_id = 65)
            ['name' => 'Molecular pathology', 'research_area_id' => 65],
            ['name' => 'Diagnostic histopathology', 'research_area_id' => 65],
            ['name' => 'Infectious disease pathology', 'research_area_id' => 65],

            // Clinical Medicine (Medical and Health Sciences, research_area_id = 66)
            ['name' => 'Cardiology and cardiovascular medicine', 'research_area_id' => 66],
            ['name' => 'Oncology and cancer therapy', 'research_area_id' => 66],
            ['name' => 'Endocrinology and diabetes research', 'research_area_id' => 66],

            // Ethics (Philosophy and Religious Studies, research_area_id = 67)
            ['name' => 'Bioethics and medical ethics', 'research_area_id' => 67],
            ['name' => 'Environmental ethics', 'research_area_id' => 67],
            ['name' => 'Ethics in artificial intelligence', 'research_area_id' => 67],

            // Comparative Religion (Philosophy and Religious Studies, research_area_id = 68)
            ['name' => 'Interfaith dialogue', 'research_area_id' => 68],
            ['name' => 'Religious practices and rituals', 'research_area_id' => 68],
            ['name' => 'Scriptural interpretation across traditions', 'research_area_id' => 68],

            // Metaphysics (Philosophy and Religious Studies, research_area_id = 69)
            ['name' => 'Philosophy of time and space', 'research_area_id' => 69],
            ['name' => 'Metaphysical theories of causation', 'research_area_id' => 69],
            ['name' => 'Ontology and being', 'research_area_id' => 69],

            // Theoretical Physics (Physical Sciences, research_area_id = 70)
            ['name' => 'String theory and quantum gravity', 'research_area_id' => 70],
            ['name' => 'Cosmology and dark matter', 'research_area_id' => 70],
            ['name' => 'Particle physics and the Standard Model', 'research_area_id' => 70],

            // Quantum Mechanics (Physical Sciences, research_area_id = 71)
            ['name' => 'Quantum computing applications', 'research_area_id' => 71],
            ['name' => 'Quantum entanglement and teleportation', 'research_area_id' => 71],
            ['name' => 'Foundations of quantum theory', 'research_area_id' => 71],

            // Thermodynamics (Physical Sciences, research_area_id = 72)
            ['name' => 'Thermodynamics in astrophysics', 'research_area_id' => 72],
            ['name' => 'Irreversible processes', 'research_area_id' => 72],
            ['name' => 'Statistical mechanics', 'research_area_id' => 72],

            // International Relations (Political Science, research_area_id = 73)
            ['name' => 'Global security and conflict studies', 'research_area_id' => 73],
            ['name' => 'International organisations and diplomacy', 'research_area_id' => 73],
            ['name' => 'Geopolitical risk analysis', 'research_area_id' => 73],

            // Political Theory (Political Science, research_area_id = 74)
            ['name' => 'Democratic governance and theory', 'research_area_id' => 74],
            ['name' => 'Political philosophy of justice', 'research_area_id' => 74],
            ['name' => 'Authoritarianism and regime dynamics', 'research_area_id' => 74],

            // Comparative Politics (Political Science, research_area_id = 75)
            ['name' => 'Electoral systems and voting behaviour', 'research_area_id' => 75],
            ['name' => 'Comparative federalism', 'research_area_id' => 75],
            ['name' => 'Political institutions and policy analysis', 'research_area_id' => 75],

            // Cognitive Psychology (Psychology, research_area_id = 76)
            ['name' => 'Decision-making processes', 'research_area_id' => 76],
            ['name' => 'Attention and memory research', 'research_area_id' => 76],
            ['name' => 'Language acquisition and processing', 'research_area_id' => 76],

            // Social Psychology (Psychology, research_area_id = 77)
            ['name' => 'Group dynamics and social influence', 'research_area_id' => 77],
            ['name' => 'Prejudice and intergroup relations', 'research_area_id' => 77],
            ['name' => 'Social cognition and behaviour', 'research_area_id' => 77],

            // Clinical Psychology (Psychology, research_area_id = 78)
            ['name' => 'Cognitive-behavioural therapy', 'research_area_id' => 78],
            ['name' => 'Trauma and post-traumatic stress', 'research_area_id' => 78],
            ['name' => 'Psychological assessment methods', 'research_area_id' => 78],

            // Urban Sociology (Sociology, research_area_id = 79)
            ['name' => 'Urbanisation and social stratification', 'research_area_id' => 79],
            ['name' => 'Community development and planning', 'research_area_id' => 79],
            ['name' => 'Housing and neighbourhood studies', 'research_area_id' => 79],

            // Sociology of Education (Sociology, research_area_id = 80)
            ['name' => 'Educational inequality', 'research_area_id' => 80],
            ['name' => 'School-community relationships', 'research_area_id' => 80],
            ['name' => 'Cultural reproduction in education', 'research_area_id' => 80],

            // Gender Studies (Sociology, research_area_id = 81)
            ['name' => 'Gender and media representation', 'research_area_id' => 81],
            ['name' => 'Intersectionality in social theory', 'research_area_id' => 81],
            ['name' => 'Workplace gender dynamics', 'research_area_id' => 81],

            // Astrobiology (Space Sciences, research_area_id = 82)
            ['name' => 'Exoplanet exploration', 'research_area_id' => 82],
            ['name' => 'Origins of life and extraterrestrial life', 'research_area_id' => 82],
            ['name' => 'Astrobiological implications of extremophiles', 'research_area_id' => 82],

            // Planetary Science (Space Sciences, research_area_id = 83)
            ['name' => 'Planetary atmospheres and climate', 'research_area_id' => 83],
            ['name' => 'Surface geology of Mars and Venus', 'research_area_id' => 83],
            ['name' => 'Planetary formation and evolution', 'research_area_id' => 83],

            // Space Exploration (Space Sciences, research_area_id = 84)
            ['name' => 'Human spaceflight and Mars exploration', 'research_area_id' => 84],
            ['name' => 'Space missions and satellite technology', 'research_area_id' => 84],
            ['name' => 'Astroengineering and space habitats', 'research_area_id' => 84],

            // Biostatistics (Statistics, research_area_id = 85)
            ['name' => 'Epidemiological data analysis', 'research_area_id' => 85],
            ['name' => 'Statistical methods in public health', 'research_area_id' => 85],
            ['name' => 'Clinical trials and experimental design', 'research_area_id' => 85],

            // Time Series Analysis (Statistics, research_area_id = 86)
            ['name' => 'Financial market prediction', 'research_area_id' => 86],
            ['name' => 'Weather and climate modeling', 'research_area_id' => 86],
            ['name' => 'Signal processing in time series', 'research_area_id' => 86],

            // Data Mining (Statistics, research_area_id = 87)
            ['name' => 'Machine learning and predictive analytics', 'research_area_id' => 87],
            ['name' => 'Data mining for pattern recognition', 'research_area_id' => 87],
            ['name' => 'Big data analysis and data warehousing', 'research_area_id' => 87],

            // Veterinary Medicine (Veterinary Sciences, research_area_id = 88)
            ['name' => 'Animal surgery and clinical practice', 'research_area_id' => 88],
            ['name' => 'Veterinary pathology and diagnostics', 'research_area_id' => 88],
            ['name' => 'Veterinary pharmacology and therapeutics', 'research_area_id' => 88],

            // Animal Nutrition (Veterinary Sciences, research_area_id = 89)
            ['name' => 'Animal feed formulation and additives', 'research_area_id' => 89],
            ['name' => 'Nutritional deficiencies in farm animals', 'research_area_id' => 89],
            ['name' => 'Nutrition for companion animals', 'research_area_id' => 89],

            // Wildlife Health (Veterinary Sciences, research_area_id = 90)
            ['name' => 'Epidemiology of wildlife diseases', 'research_area_id' => 90],
            ['name' => 'Conservation medicine and wildlife health', 'research_area_id' => 90],
            ['name' => 'Zoonotic diseases and wildlife conservation', 'research_area_id' => 90],
        ]);
    }
}
