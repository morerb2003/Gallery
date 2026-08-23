export const CATEGORIES = [
  { id: 'all', label: 'All Photos', icon: '✨' },
  { id: 'personal', label: 'Personal', icon: '📷' },
  { id: 'travel', label: 'Travel', icon: '🏞️' },
  { id: 'nature', label: 'Nature', icon: '🌄' },
  { id: 'city', label: 'City', icon: '🏙️' },
  { id: 'art', label: 'Art & Abstract', icon: '🎨' },
];

export const photosData = [
  // --- Personal ---
  {
    id: 1,
    title: "Golden Hour Smile",
    category: "personal",
    description: "Enjoying the warm golden rays in the park on a peaceful evening.",
    date: "2026-04-12",
    location: "Central Park, New York",
    featured: true,
    camera: "Sony A7 IV • 85mm f/1.4",
    src: "/photos/personal-1.jpg",
    fallbackSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
    tags: ["Portrait", "Sunset", "Smile"]
  },
  {
    id: 2,
    title: "Morning Brew & Notes",
    category: "personal",
    description: "Savoring an artisan cappuccino and journaling the week's creative inspirations.",
    date: "2026-05-03",
    location: "Artisan Roasters Cafe",
    featured: false,
    camera: "Fujifilm X-T5 • 35mm f/2.0",
    src: "/photos/personal-2.jpg",
    fallbackSrc: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
    tags: ["Coffee", "Lifestyle", "Cozy"]
  },
  {
    id: 3,
    title: "Creative Workspace",
    category: "personal",
    description: "Late night coding session and design sprint with ambient mechanical keyboard glow.",
    date: "2026-06-18",
    location: "Home Studio, Mumbai",
    featured: true,
    camera: "Canon EOS R6 • 50mm f/1.8",
    src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
    tags: ["Workspace", "Coding", "Minimal"]
  },
  {
    id: 4,
    title: "Acoustic Evening Session",
    category: "personal",
    description: "Strumming favorite acoustic chords under warm fairy lights.",
    date: "2026-07-22",
    location: "Rooftop Lounge",
    featured: false,
    camera: "Leica Q2 • 28mm f/1.7",
    src: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=1200&q=80",
    tags: ["Music", "Guitar", "Mood"]
  },

  // --- Travel ---
  {
    id: 5,
    title: "Taj Mahal Reflections",
    category: "travel",
    description: "Sunrise glow reflecting symmetrically over the marble marvel at dawn.",
    date: "2026-02-14",
    location: "Agra, India",
    featured: true,
    camera: "Nikon Z8 • 24-70mm f/2.8",
    src: "/photos/travel-1.jpg",
    fallbackSrc: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
    tags: ["Heritage", "Monument", "Sunrise"]
  },
  {
    id: 6,
    title: "Tropical Lagoon Paradise",
    category: "travel",
    description: "Crystal azure waters, overwater bungalows, and vivid sunset clouds over the reef.",
    date: "2026-03-29",
    location: "Maldives Islands",
    featured: true,
    camera: "DJI Mavic 3 Pro • 24mm",
    src: "/photos/travel-2.jpg",
    fallbackSrc: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    tags: ["Beach", "Tropical", "Sunset"]
  },
  {
    id: 7,
    title: "Kyoto Bamboo Groves",
    category: "travel",
    description: "Walking quietly through the towering green bamboo stalks in Arashiyama.",
    date: "2025-11-10",
    location: "Kyoto, Japan",
    featured: false,
    camera: "Sony A7R V • 16-35mm f/2.8",
    src: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    tags: ["Japan", "Bamboo", "Zen"]
  },
  {
    id: 8,
    title: "Santorini Cliffside Vista",
    category: "travel",
    description: "Iconic blue domes overlooking the Aegean Sea during a golden Mediterranean evening.",
    date: "2025-09-05",
    location: "Oia, Santorini, Greece",
    featured: true,
    camera: "Canon EOS R5 • 24-105mm f/4",
    src: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
    tags: ["Santorini", "Sea", "Architecture"]
  },

  // --- Nature ---
  {
    id: 9,
    title: "Himalayan Sunrise Crest",
    category: "nature",
    description: "First sunlight igniting the high Himalayan snow peaks with dramatic sky gradients.",
    date: "2026-01-19",
    location: "Himalayas, India/Nepal",
    featured: true,
    camera: "Sony A1 • 70-200mm f/2.8",
    src: "/photos/nature-1.jpg",
    fallbackSrc: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    tags: ["Mountains", "Snow", "Peak"]
  },
  {
    id: 10,
    title: "Emerald Forest Mist",
    category: "nature",
    description: "Sun rays piercing through lush ancient canopy trees wrapped in morning fog.",
    date: "2026-06-04",
    location: "Redwood National Park, USA",
    featured: false,
    camera: "Nikon Z7 II • 24-70mm f/4",
    src: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
    tags: ["Forest", "Mist", "Sunbeams"]
  },
  {
    id: 11,
    title: "Cascading Waterfall Oasis",
    category: "nature",
    description: "Pristine emerald waters cascading down mossy rocks into a quiet lagoon.",
    date: "2026-05-15",
    location: "Plitvice Lakes, Croatia",
    featured: false,
    camera: "Fujifilm GFX 100S • 32-64mm",
    src: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80",
    tags: ["Waterfall", "Lush", "River"]
  },
  {
    id: 12,
    title: "Desert Dune Ripples",
    category: "nature",
    description: "Wind-sculpted sand dunes creating hypnotic shadow curves in the evening sun.",
    date: "2025-12-08",
    location: "Sahara Desert, Morocco",
    featured: false,
    camera: "Sony A7 IV • 24-105mm",
    src: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80",
    tags: ["Desert", "Dunes", "Shadows"]
  },

  // --- City ---
  {
    id: 13,
    title: "Tokyo Cyberpunk Rain",
    category: "city",
    description: "Vibrant neon signs reflecting off wet Shinjuku streets during a gentle night drizzle.",
    date: "2026-03-11",
    location: "Shinjuku, Tokyo, Japan",
    featured: true,
    camera: "Sony A7S III • 35mm f/1.4",
    src: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
    tags: ["Tokyo", "Neon", "Nightlife"]
  },
  {
    id: 14,
    title: "Manhattan Twilight Skyline",
    category: "city",
    description: "Panoramic view of New York skyscrapers glowing against deep blue hour skies.",
    date: "2026-04-20",
    location: "Brooklyn Bridge Park, NYC",
    featured: false,
    camera: "Canon EOS R5 • 24-70mm f/2.8",
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    tags: ["Skyline", "NYC", "Architecture"]
  },
  {
    id: 15,
    title: "London Red Reflections",
    category: "city",
    description: "Classic red double-decker bus moving through historic London architecture at dusk.",
    date: "2025-10-18",
    location: "Westminster, London, UK",
    featured: false,
    camera: "Leica SL2 • 50mm f/1.4",
    src: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80",
    tags: ["London", "Streets", "Urban"]
  },
  {
    id: 16,
    title: "Futuristic Glass Atrium",
    category: "city",
    description: "Geometric curves and modern architectural symmetry of an airport canopy.",
    date: "2026-02-02",
    location: "Jewel Changi, Singapore",
    featured: false,
    camera: "Sony A7R IV • 12-24mm f/2.8",
    src: "https://images.unsplash.com/photo-1512632570417-a6096acb2984?auto=format&fit=crop&w=1200&q=80",
    tags: ["Modern", "Geometry", "Interior"]
  },

  // --- Art & Abstract ---
  {
    id: 17,
    title: "Liquid Chroma Waves",
    category: "art",
    description: "Swirling acrylic fluid dynamics creating mesmerizing cosmic neon ripples.",
    date: "2026-07-01",
    location: "Digital Studio",
    featured: true,
    camera: "Macro Studio Setup • 100mm f/2.8",
    src: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80",
    tags: ["Abstract", "Fluid", "Color"]
  },
  {
    id: 18,
    title: "Prism Light Refraction",
    category: "art",
    description: "Optical crystal prism breaking direct sunlight into rainbow spectral bands.",
    date: "2026-05-28",
    location: "Optics Laboratory",
    featured: false,
    camera: "Fujifilm X-H2 • 56mm f/1.2",
    src: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80",
    tags: ["Prism", "Rainbow", "Spectrum"]
  },
  {
    id: 19,
    title: "Minimalist Geometry",
    category: "art",
    description: "Clean brutalist shadows and warm stucco architectural curves in high contrast.",
    date: "2026-06-12",
    location: "Contemporary Museum",
    featured: false,
    camera: "Sony A7C • 35mm f/1.8",
    src: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80",
    tags: ["Minimal", "Shadows", "Clean"]
  },
  {
    id: 20,
    title: "Neon Cybernetic Burst",
    category: "art",
    description: "Electrifying 3D luminous strands converging into a radiant focal point.",
    date: "2026-08-01",
    location: "Generative Art Lab",
    featured: true,
    camera: "Generative Render",
    src: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
    tags: ["Neon", "Digital", "Generative"]
  }
];
