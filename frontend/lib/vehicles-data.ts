export type FuelType    = "Electric" | "Petrol" | "Diesel" | "Hybrid" | "CNG" | "LPG";
export type VehicleType = "Car" | "Bike";

export interface Vehicle {
  id:            number;
  name:          string;
  brand:         string;
  type:          VehicleType;
  fuel:          FuelType;
  price:         string;
  priceNum:      number;
  rating:        number;
  reviews:       number;
  range:         string;
  topSpeed:      string;
  acceleration?: string;
  engine?:       string;
  power?:        string;
  torque?:       string;
  transmission?: string;
  seating?:      number;
  weight?:       string;
  image:         string;
  tag?:          string;
  tagGradient?:  string;
  aiScore?:      number;
  description?:  string;
  features?:     string[];
  colors?:       string[];
}

export const VEHICLES: Vehicle[] = [
  /* ── CARS ── */
  {
    id: 1, name: "Nexon EV Max", brand: "Tata", type: "Car", fuel: "Electric",
    price: "₹18.99 L", priceNum: 1899000, rating: 4.7, reviews: 3210,
    range: "437 km", topSpeed: "150 km/h", acceleration: "9.0s",
    engine: "Permanent Magnet AC Motor", power: "143 bhp", torque: "215 Nm",
    transmission: "Automatic (Single Speed)", seating: 5, weight: "1,615 kg",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&q=80",
    tag: "Best Seller", tagGradient: "from-cyan-500 to-blue-600", aiScore: 97,
    description: "The Tata Nexon EV Max redefines electric mobility in India with an exceptional 437 km WLTC range, rapid DC fast charging, and an array of connected car features. Its bold SUV styling conceals a highly efficient electric drivetrain that delivers brisk performance with zero emissions.",
    features: ["437 km WLTC Range", "DC Fast Charging (50 kW)", "9-inch Floating Touchscreen", "360° Camera", "6 Airbags", "Connected Car Tech (iRA)", "Auto Climate Control", "Wireless Charging"],
    colors: ["Fearless Purple", "Tropical Mist", "Pristine White", "Daytona Grey"],
  },
  {
    id: 2, name: "Creta 2024", brand: "Hyundai", type: "Car", fuel: "Petrol",
    price: "₹11.11 L", priceNum: 1111000, rating: 4.4, reviews: 8710,
    range: "620 km", topSpeed: "165 km/h", acceleration: "10.5s",
    engine: "1.5L Kappa MPi", power: "115 bhp", torque: "144 Nm",
    transmission: "IVT / 6MT", seating: 5, weight: "1,250 kg",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&q=80",
    tag: "Popular", tagGradient: "from-violet-500 to-purple-700", aiScore: 93,
    description: "The Hyundai Creta remains India's most loved compact SUV, now with a completely redesigned interior featuring a panoramic dual-screen dashboard, enhanced safety tech, and a smoother, more refined ride quality.",
    features: ["Panoramic Dual Screens", "Digital Instrument Cluster", "Bose Premium Sound", "Level 2 ADAS", "Ventilated Seats", "Sunroof", "Wireless Android Auto/CarPlay"],
    colors: ["Abyss Black", "Fiery Red", "Atlas White", "Ocean Blue"],
  },
  {
    id: 3, name: "Grand Vitara", brand: "Maruti", type: "Car", fuel: "Hybrid",
    price: "₹13.69 L", priceNum: 1369000, rating: 4.4, reviews: 5430,
    range: "700 km", topSpeed: "175 km/h", acceleration: "9.5s",
    engine: "1.5L Strong Hybrid", power: "116 bhp", torque: "141 Nm",
    transmission: "e-CVT / 6AT", seating: 5, weight: "1,265 kg",
    image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=900&q=80",
    tag: "Top Value", tagGradient: "from-green-500 to-emerald-600", aiScore: 91,
    description: "The Maruti Suzuki Grand Vitara with strong hybrid technology delivers exceptional fuel efficiency with a class-leading 700 km tank range. The self-charging hybrid system seamlessly switches between petrol and electric power.",
    features: ["Strong Hybrid System", "700km+ Tank Range", "Head-up Display", "360° Camera", "Ventilated Front Seats", "Connected Car via Suzuki Connect", "6 Airbags"],
    colors: ["Grandeur Grey", "Splendid Silver", "Opulent Red", "Arctic White"],
  },
  {
    id: 4, name: "Thar ROXX", brand: "Mahindra", type: "Car", fuel: "Diesel",
    price: "₹18.99 L", priceNum: 1899000, rating: 4.6, reviews: 4120,
    range: "550 km", topSpeed: "155 km/h", acceleration: "11.2s",
    engine: "2.2L mHawk Diesel", power: "172 bhp", torque: "370 Nm",
    transmission: "6MT / 6AT", seating: 5, weight: "1,820 kg",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&q=80",
    tag: "Off-Road King", tagGradient: "from-amber-500 to-orange-600", aiScore: 94,
    description: "The Mahindra Thar ROXX brings iconic 4x4 capability to a family-friendly 5-door body. With the powerful mHawk diesel, switchable 4WD, and premium interior, it's the most capable lifestyle SUV in the segment.",
    features: ["4x4 Shift-on-Fly", "Level 2 ADAS", "Dual-Zone Climate Control", "10.25\" Touchscreen", "360° Camera", "Steel Bumper", "Rock Mode & Sand Mode"],
    colors: ["Everest White", "Stealth Black", "Burnt Sienna", "Blazing Bronze"],
  },
  {
    id: 5, name: "Swift 2024", brand: "Maruti", type: "Car", fuel: "Petrol",
    price: "₹6.49 L", priceNum: 649000, rating: 4.3, reviews: 22400,
    range: "600 km", topSpeed: "170 km/h", acceleration: "12.0s",
    engine: "1.2L Z-Series", power: "82 bhp", torque: "112 Nm",
    transmission: "5MT / AMT", seating: 5, weight: "915 kg",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&q=80",
    tag: "🔥 Hot", tagGradient: "from-red-500 to-orange-500", aiScore: 88,
    description: "The all-new Maruti Swift is lighter, peppier, and more fuel-efficient than ever. With a fresh sporty design, enhanced cabin quality, and the new Z-Series engine, it sets a new benchmark in the premium hatchback segment.",
    features: ["1.2L Z12E Engine", "Enhanced Fuel Efficiency", "9\" Smart Play Pro+", "360° View Camera", "6 Airbags", "Cruise Control", "Wireless Charging"],
    colors:["Speedy Blue", "Magma Grey", "Arctic White", "Pearl Flash Orange"],
  },
  {
    id: 6, name: "Creta EV", brand: "Hyundai", type: "Car", fuel: "Electric",
    price: "₹17.99 L", priceNum: 1799000, rating: 4.5, reviews: 1900,
    range: "473 km", topSpeed: "160 km/h", acceleration: "7.9s",
    engine: "Electric Motor (42 kWh)", power: "135 bhp", torque: "255 Nm",
    transmission: "Automatic (Single Speed)", seating: 5, weight: "1,595 kg",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&q=80",
    tag: "New Launch", tagGradient: "from-cyan-500 to-blue-600", aiScore: 93,
    description: "The Hyundai Creta EV combines the class-leading design and features of the Creta with a long-range electric drivetrain. With 473 km ARAI range and V2L (Vehicle-to-Load) capability, it's the most feature-packed electric SUV under ₹20L.",
    features: ["473km ARAI Range", "V2L Technology", "Level 2 ADAS", "Panoramic Sunroof", "Digital Side Mirrors", "64-Color Ambient Light", "Pixel LED Headlamps"],
    colors: ["Cosmic Blue", "Atlas White", "Abyss Black", "Froster Blue"],
  },
  /* ── BIKES ── */
  {
    id: 7, name: "Classic 350", brand: "Royal Enfield", type: "Bike", fuel: "Petrol",
    price: "₹1.93 L", priceNum: 193000, rating: 4.5, reviews: 12300,
    range: "500 km", topSpeed: "130 km/h", acceleration: "12.0s",
    engine: "349cc J-Series Single", power: "20.2 bhp", torque: "27 Nm",
    transmission: "5-Speed Manual", weight: "195 kg",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
    tag: "Trending", tagGradient: "from-orange-500 to-red-600", aiScore: 91,
    description: "The Royal Enfield Classic 350 is the quintessential retro motorcycle that has defined a generation. With its thump-worthy engine, iconic styling, and vastly improved reliability, it remains India's most romantic ride.",
    features: ["349cc J-Series Engine", "Tripper Navigation", "Dual Channel ABS", "Halogen/LED Lighting", "USB Charging Port", "Adjustable Windscreen"],
    colors: ["Signals Marsh", "Signals Desert Storm", "Dark Gunmetal", "Stealth Black"],
  },
  {
    id: 8, name: "Duke 390", brand: "KTM", type: "Bike", fuel: "Petrol",
    price: "₹3.11 L", priceNum: 311000, rating: 4.7, reviews: 3200,
    range: "400 km", topSpeed: "167 km/h", acceleration: "4.8s",
    engine: "399cc Single Cylinder", power: "44.5 bhp", torque: "39 Nm",
    transmission: "6-Speed Quick-Shift", weight: "179 kg",
    image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=900&q=80",
    tag: "Performance", tagGradient: "from-orange-400 to-yellow-500", aiScore: 95,
    description: "The KTM Duke 390 is the most powerful street naked in its class, blending aggressive styling with razor-sharp handling. With a full-color TFT display, quick-shifter, and cornering ABS, it delivers a superbike experience at a fraction of the cost.",
    features: ["TFT Color Display", "Quick-Shifter", "Cornering ABS", "Lean-Angle Sensing", "4 Ride Modes", "LED Lighting", "Bi-directional QS"],
    colors: ["Petrol Blue/White", "Black"],
  },
  {
    id: 9, name: "Himalayan 450", brand: "Royal Enfield", type: "Bike", fuel: "Petrol",
    price: "₹2.85 L", priceNum: 285000, rating: 4.6, reviews: 2140,
    range: "500 km", topSpeed: "155 km/h", acceleration: "6.5s",
    engine: "452cc Sherpa Engine", power: "40.1 bhp", torque: "40 Nm",
    transmission: "6-Speed Manual", weight: "196 kg",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
    tag: "Adventure", tagGradient: "from-red-500 to-orange-600", aiScore: 96,
    description: "The all-new Royal Enfield Himalayan 450 is a ground-up redesign built for serious adventure touring. With the new Sherpa 450 engine, fully adjustable suspension, and a comprehensive TFT Tripper display, it's the most capable mid-size adventure tourer.",
    features: ["452cc Sherpa Engine", "Tripper Pod Navigation", "Gorilla Glass TFT", "Adjustable Levers", "Google Maps Navigation", "3 Riding Modes", "Adjustable Suspension"],
    colors: ["Sleet", "Slate", "Hanle Black", "Kamet White"],
  },
  {
    id: 10, name: "CB300R", brand: "Honda", type: "Bike", fuel: "Petrol",
    price: "₹2.88 L", priceNum: 288000, rating: 4.5, reviews: 2200,
    range: "380 km", topSpeed: "143 km/h", acceleration: "5.5s",
    engine: "286cc Single Cylinder", power: "30.9 bhp", torque: "27.5 Nm",
    transmission: "6-Speed Manual", weight: "147 kg",
    image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=900&q=80",
    tag: "Naked Style", tagGradient: "from-red-500 to-rose-600", aiScore: 90,
    description: "The Honda CB300R is a neo-sports café-inspired naked motorcycle that combines minimalist Japanese design with a punchy single-cylinder engine. Its lightweight chassis, premium components, and clean aesthetics make it a joy to ride in any condition.",
    features: ["Round LED Headlight", "Full Digital Instrument", "ABS", "Steel Trellis Frame", "Inverted Front Fork", "Monoshock Rear", "Lightweight Design"],
    colors: ["Candy Chromosphere Red", "Matte Gunpowder Black"],
  },
  {
    id: 11, name: "Dominar 400", brand: "Bajaj", type: "Bike", fuel: "Petrol",
    price: "₹2.42 L", priceNum: 242000, rating: 4.3, reviews: 6700,
    range: "420 km", topSpeed: "148 km/h", acceleration: "6.2s",
    engine: "373.3cc Triple-Spark", power: "40 bhp", torque: "35 Nm",
    transmission: "6-Speed + Slipper Clutch", weight: "182 kg",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
    tag: "Sport Tourer", tagGradient: "from-purple-500 to-violet-700", aiScore: 89,
    description: "The Bajaj Dominar 400 is a power cruiser built for long-distance touring. With twin exhaust headers, USD front forks, a slipper clutch, and a strong 40 bhp output, it offers highway-crushing performance at an accessible price point.",
    features: ["Triple-Spark Technology", "USD Front Fork", "Slipper Clutch", "Twin Barrel Exhaust", "LED All Lighting", "Navigation Mount", "Dual ABS"],
    colors: ["Aurora Green", "Charcoal Black"],
  },
  {
    id: 12, name: "Meteor 350", brand: "Royal Enfield", type: "Bike", fuel: "Petrol",
    price: "₹2.21 L", priceNum: 221000, rating: 4.5, reviews: 3780,
    range: "520 km", topSpeed: "130 km/h", acceleration: "11.5s",
    engine: "349cc J-Series Single", power: "20.2 bhp", torque: "27 Nm",
    transmission: "5-Speed Manual", weight: "191 kg",
    image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=900&q=80",
    tag: "Cruiser", tagGradient: "from-purple-500 to-violet-700", aiScore: 90,
    description: "The Royal Enfield Meteor 350 is the ultimate cruiser for long weekend rides. With its relaxed ergonomics, thumpy J-Series engine, and Tripper navigation, it's designed for those who love unhurried, soul-satisfying journeys.",
    features: ["Tripper Navigation", "Meteor Constellation App", "USB Charging", "Dual ABS", "Classic Cruiser Ergonomics", "Spoke/Alloy Wheels"],
    colors: ["Fireball", "Supernova Brown", "Stellar", "Vega Blue"],
  },
];

export const BRANDS = Array.from(new Set(VEHICLES.map((v) => v.brand))).sort();
export const FUEL_TYPES: FuelType[] = ["Electric", "Petrol", "Diesel", "Hybrid", "CNG", "LPG"];
