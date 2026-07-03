import React, { useState, useMemo } from "react";
import {
  Bike,
  Plus,
  ChevronLeft,
  CheckCircle2,
  Clock,
  Wrench,
  Store,
  MapPin,
  Star,
  LogOut,
  User,
  Search,
  ScanLine,
  ShieldCheck,
  Shield,
  ClipboardList,
  Route,
  Compass,
  Mountain,
  Activity,
  Link,
  AlertTriangle,
  Zap,
  Circle,
  ArrowRightLeft,
  UserCheck,
  History,
  XCircle,
  Menu,
  X,
  Send,
  ChevronRight,
  Bell,
  MessageSquare,
  Eye,
  EyeOff,
  Mail,
  ChevronUp,
  CalendarPlus,
  FileDown,
  FileText,
  Square,
  CheckSquare,
} from "lucide-react";

/* =========================================================
   HELPERS
   ========================================================= */

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let s = seed;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generatePattern(seedStr, size = 17) {
  const rand = mulberry32(hashString(seedStr || "seed"));
  const grid = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => rand() > 0.55)
  );
  const finder = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1],
  ];
  const placeFinder = (ox, oy) => {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        grid[oy + y][ox + x] = !!finder[y][x];
      }
    }
  };
  placeFinder(0, 0);
  placeFinder(size - 7, 0);
  placeFinder(0, size - 7);
  return grid;
}

function daysAgoISO(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function monthsAgoISO(n) {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d.toISOString().slice(0, 10);
}

function addMonthsToDate(dateStr, n) {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + n);
  return d;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function makeBikeId() {
  const part = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SB-${part()}-${part()}`;
}

const SERVICE_INTERVAL_MONTHS = 6;

const SPOKEBOOK_TERMS = [
  {
    heading: "1. Acceptance of these Terms",
    body: "Spokebook's website, mobile apps, and related services (the \"Services\") are provided to you (the \"User\", \"Rider\", or \"Shop\") by Spokebook, subject to these Terms & Conditions (the \"Terms\"). By creating an account, or by accessing or using the Services in any way, you agree to be bound by these Terms. If you do not agree, please do not create an account or use the Services.",
  },
  {
    heading: "2. What Spokebook does",
    body: "Spokebook lets Riders register bicycles, log and verify service history, track component wear, transfer bike ownership, and message Bike Shops. Bike Shops can list a public profile, verify Riders' services and component details, and communicate with Riders directly through the app. Spokebook may optionally connect to third-party services such as Strava to automatically calculate distance-based component wear. Spokebook does not manufacture, sell, install, or inspect any bicycle or component, and does not guarantee the accuracy of any service history, ownership record, or wear estimate entered by a Rider or Shop.",
  },
  {
    heading: "3. Creating an account",
    body: "You must provide accurate, current information when registering, including a valid email address. Riders and Shops are each responsible for keeping their login credentials confidential and for all activity that occurs under their account. Bike Shops must provide accurate business details, including a genuine trading address, which will be shown publicly to Riders searching the Spokebook directory. Spokebook may refuse registration, suspend, or terminate any account it reasonably believes is fraudulent, abusive, or in breach of these Terms.",
  },
  {
    heading: "4. Rider responsibilities",
    body: "Riders are responsible for the accuracy of the bicycle details, service entries, component information, and cost figures they log. Self-logged services are clearly distinguished in the app from services verified by a Bike Shop, and Spokebook makes no representation that a self-logged entry has been independently checked. Riders remain solely responsible for the safe mechanical condition of their bicycle; Spokebook is a record-keeping tool, not a substitute for professional inspection or maintenance advice.",
  },
  {
    heading: "5. Bike Shop responsibilities",
    body: "Bike Shops agree to only confirm or verify services they have genuinely performed or inspected, and to keep their public profile — including address, specialities, and contact details — accurate and up to date. Verified status within Spokebook reflects a Shop's own confirmation and is not independently audited or guaranteed by Spokebook.",
  },
  {
    heading: "6. Ownership transfers",
    body: "Spokebook's ownership transfer feature allows a Rider to generate a transfer code and pass a bicycle's full record to a new owner. Spokebook maintains a chain-of-custody log for informational purposes only. This feature does not constitute a legal transfer of title, does not verify that the transferring party is the lawful owner of the bicycle, and should not be relied upon as proof of ownership in any legal, insurance, or law-enforcement context.",
  },
  {
    heading: "7. Strava and other third-party connections",
    body: "If you choose to connect a third-party service such as Strava, Spokebook accesses only the ride and gear data required to calculate component wear, using the access you explicitly grant. Spokebook never receives or stores your third-party account password. You may disconnect any third-party service at any time from that service's own settings, or by removing the connection within Spokebook. Spokebook is not responsible for the availability, accuracy, or continued support of any third-party service, and reserves the right to change or remove any third-party integration at any time.",
  },
  {
    heading: "8. Messaging and notifications",
    body: "Spokebook facilitates direct messages between Riders and their preferred Bike Shop, and may send push notifications relating to component wear, service reminders, ownership transfers, and messages. Message content is visible to both parties in a conversation and, where relevant, may include component and bike details automatically attached by the app. Spokebook is not responsible for the content, tone, or accuracy of messages sent by Riders or Shops.",
  },
  {
    heading: "9. Costs and currency",
    body: "Any cost figures entered against a service or component are recorded in South African Rand (ZAR) and are for the User's own personal record-keeping purposes only. Spokebook does not process payments, does not verify entered costs against any invoice or receipt, and accepts no liability for the accuracy of exported cost totals or PDF reports.",
  },
  {
    heading: "10. Data export",
    body: "Riders may export their service history and component records as a PDF for their own use. Exported reports reflect only the information logged within Spokebook and may not include work carried out elsewhere.",
  },
  {
    heading: "11. Fees",
    body: "Spokebook is currently provided free of charge. Should paid plans be introduced in future, applicable fees will be clearly displayed before you are charged, and these Terms will be updated accordingly.",
  },
  {
    heading: "12. Suggestions and public content",
    body: "Content submitted to the public Suggestion Box, including upvotes, is visible to other Users. By submitting a suggestion, you grant Spokebook a non-exclusive, royalty-free right to use, adapt, and act on that suggestion without obligation or compensation.",
  },
  {
    heading: "13. Account deletion",
    body: "You may delete your account and associated data at any time from within the app, or by contacting support@spokebook.app. Some records, such as a bicycle's chain-of-custody history, may be retained in de-identified form where a bicycle remains registered to another User.",
  },
  {
    heading: "14. Liability",
    body: "The Services are provided \"as is\", without warranty of any kind. Spokebook does not provide bicycle mechanical, safety, or maintenance advice, and is not liable for any accident, injury, loss, or damage arising from reliance on information stored, calculated, or displayed within the app, including service reminders, wear percentages, or verification status.",
  },
  {
    heading: "15. Changes to these Terms",
    body: "Spokebook may update these Terms from time to time. Where changes are significant, we will make reasonable efforts to notify Users within the app. Continued use of the Services after an update constitutes acceptance of the revised Terms.",
  },
  {
    heading: "16. Contact",
    body: "Questions about these Terms can be sent to support@spokebook.app.",
  },
];

function getNextServiceInfo(bike) {
  if (!bike.serviceLog.length) {
    return { label: "No service logged yet", tone: "neutral", nextDue: null };
  }
  const sorted = [...bike.serviceLog].sort((a, b) => new Date(b.date) - new Date(a.date));
  const last = sorted[0];
  const nextDue = addMonthsToDate(last.date, SERVICE_INTERVAL_MONTHS);
  const today = new Date();
  const days = Math.round((nextDue - today) / (1000 * 60 * 60 * 24));
  const nextDueISO = nextDue.toISOString().slice(0, 10);
  if (days < 0) {
    const overdue = Math.abs(days);
    return { label: `Overdue by ${overdue} day${overdue === 1 ? "" : "s"}`, tone: "alert", nextDue: nextDueISO };
  }
  if (days <= 30) {
    return { label: `Due in ${days} day${days === 1 ? "" : "s"}`, tone: "pending", nextDue: nextDueISO };
  }
  const months = Math.round(days / 30);
  return { label: `Due in ~${months} month${months === 1 ? "" : "s"}`, tone: "ok", nextDue: nextDueISO };
}

const COMPONENT_PRESETS = [
  {
    type: "Chain",
    maxKm: 2500,
    range: "1,500 – 3,000 km",
    description: "Varies by drivetrain speed and lubrication. 11/12-speed chains wear faster. Replace at ~0.5% stretch to protect cassette and chainrings.",
    basis: "Shimano, SRAM & Park Tool published wear guidelines",
  },
  {
    type: "Rear Tyre",
    maxKm: 4000,
    range: "2,500 – 6,000 km",
    description: "Road: 3,000–6,000 km. Gravel/MTB: 2,000–4,000 km. Replace when tread centre is gone or casing shows wear or cracking.",
    basis: "Continental, Schwalbe & Michelin tyre lifespan data",
  },
  {
    type: "Front Tyre",
    maxKm: 6000,
    range: "4,000 – 8,000 km",
    description: "Front tyres wear significantly slower than rear. Road: up to 8,000 km. Check for cracking, cuts, and casing damage regularly.",
    basis: "Continental, Schwalbe & Michelin tyre lifespan data",
  },
  {
    type: "Brake Pads (Rim)",
    maxKm: 2000,
    range: "1,000 – 3,000 km",
    description: "Wet weather can reduce life to under 500 km. Replace when pad reaches wear indicator line or is thinner than 1mm.",
    basis: "Shimano & Campagnolo brake pad service intervals",
  },
  {
    type: "Brake Pads (Disc)",
    maxKm: 3500,
    range: "2,000 – 5,000 km",
    description: "Sintered pads last longer (~5,000 km) but are harder on rotors. Organic pads bed in better but wear faster (~2,000 km).",
    basis: "Shimano, SRAM & Magura disc brake documentation",
  },
  {
    type: "Cassette",
    maxKm: 12000,
    range: "8,000 – 15,000 km",
    description: "Replace every 2–3 chains to maximise cassette life. Skipping chain replacements will accelerate cassette wear significantly.",
    basis: "Shimano & SRAM drivetrain compatibility guidelines",
  },
  {
    type: "Chainring",
    maxKm: 25000,
    range: "15,000 – 30,000 km",
    description: "Inspect for shark-fin tooth profile. A single-ring setup wears faster than a triple. Replace with chain & cassette for best results.",
    basis: "Park Tool & Shimano drivetrain wear documentation",
  },
  {
    type: "Brake Cables",
    maxKm: 7000,
    range: "5,000 – 10,000 km",
    description: "Replace annually or when braking feels spongy. Stainless cables last longer in wet conditions. Always replace housing simultaneously.",
    basis: "Jagwire & Shimano cable service recommendations",
  },
  {
    type: "Derailleur Cable",
    maxKm: 7000,
    range: "5,000 – 10,000 km",
    description: "Replace when shifting degrades or cable shows fraying. Inner cables fray at clamp points first — inspect before full replacement.",
    basis: "Jagwire & Shimano cable service recommendations",
  },
  {
    type: "Bar Tape",
    maxKm: 7000,
    range: "5,000 – 10,000 km",
    description: "Replace annually or when grip is compromised. Cork tape lasts ~5,000 km; synthetic tape can reach 10,000 km in dry conditions.",
    basis: "Fizik, Supacaz & Lizard Skins tape longevity data",
  },
  {
    type: "Bottom Bracket",
    maxKm: 15000,
    range: "10,000 – 30,000 km",
    description: "Threaded steel BBs last longer. Press-fit designs are more susceptible to moisture ingress. Replace when creaking or bearing play appears.",
    basis: "Shimano, Campagnolo & Wheels Mfg service intervals",
  },
  {
    type: "Brake Rotor",
    maxKm: 15000,
    range: "10,000 – 20,000 km",
    description: "Replace when thickness falls below 1.5mm (Shimano) or 1.8mm (SRAM). Warped rotors can sometimes be trued rather than replaced.",
    basis: "Shimano & SRAM rotor minimum thickness specifications",
  },
  {
    type: "Other",
    maxKm: 5000,
    range: "Custom",
    description: "Set your own service interval for a custom component.",
    basis: "User-defined",
  },
];

function getComponentKm(component, stravaGearId) {
  const rides = (stravaGearId && RIDES_BY_GEAR[stravaGearId]) || [];
  const installDate = new Date(component.installedOn);
  const rideKm = rides
    .filter((r) => new Date(r.date) >= installDate)
    .reduce((sum, r) => sum + r.distanceKm, 0);
  return Math.round(rideKm + (component.baseKm || 0));
}

function getWearTone(pct) {
  if (pct >= 90) return "alert";
  if (pct >= 65) return "pending";
  return "ok";
}

function makeComponentId() {
  return "comp-" + Math.random().toString(36).slice(2, 9);
}

function makeTransferCode() {
  const seg = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TX-${seg()}-${seg()}`;
}

function getOwnershipSummary(bike) {
  const log = bike.ownershipLog || [];
  return {
    currentOwner: log.length ? log[log.length - 1].name : bike.ownerName,
    previousOwners: log.slice(0, -1),
    transferCount: Math.max(0, log.length - 1),
  };
}

const SHOPS = [
  { id: "shop-1",  name: "East City Cycles",        email: "hello@eastcitycycles.co.za",   area: "Observatory, Cape Town",  address: "142 Lower Main Road, Observatory, Cape Town, 7925",   specialties: ["Full builds", "Drivetrain", "Gearing"],             rating: 4.9, reviews: 212 },
  { id: "shop-2",  name: "Two Wheels Workshop",    email: "info@twowheels.co.za",          area: "Sea Point, Cape Town",    address: "58 Regent Road, Sea Point, Cape Town, 8005",           specialties: ["Road bikes", "Bike fitting", "Wheel building"],      rating: 4.7, reviews: 158 },
  { id: "shop-3",  name: "Tableside Cycles",       email: "rides@tableside.co.za",         area: "Woodstock, Cape Town",    address: "21 Albert Road, Woodstock, Cape Town, 7925",           specialties: ["Mountain bikes", "Suspension service", "Tubeless"], rating: 4.8, reviews: 97  },
  { id: "shop-4",  name: "Spoke & Hub",            email: "shop@spokeandhub.co.za",        area: "Claremont, Cape Town",    address: "9 Main Road, Claremont, Cape Town, 7708",              specialties: ["E-bikes", "Commuter builds", "Accessories"],        rating: 4.6, reviews: 143 },
  { id: "shop-5",  name: "Pedal Republic",         email: "info@pedalrepublic.co.za",      area: "Stellenbosch",            address: "12 Bird Street, Stellenbosch, 7600",                   specialties: ["Road", "Gravel", "Custom builds"],                  rating: 4.8, reviews: 89  },
  { id: "shop-6",  name: "The Wheelhouse",         email: "team@thewheelhouse.co.za",      area: "Green Point, Cape Town",  address: "77 Main Road, Green Point, Cape Town, 8005",           specialties: ["BMX", "Fixed gear", "Track"],                       rating: 4.5, reviews: 61  },
  { id: "shop-7",  name: "Summit Cycles",          email: "ride@summitcycles.co.za",       area: "Paarl",                   address: "5 Lady Grey Street, Paarl, 7646",                      specialties: ["MTB", "Suspension", "Trail riding"],                 rating: 4.7, reviews: 74  },
  { id: "shop-8",  name: "Velodrome Workshop",     email: "info@velodromeworkshop.co.za",  area: "Milnerton, Cape Town",    address: "33 Koeberg Road, Milnerton, Cape Town, 7441",          specialties: ["Track racing", "Road", "Wheel building"],            rating: 4.6, reviews: 52  },
  { id: "shop-9",  name: "Chain Reaction Cycles",  email: "hello@chainreactioncpt.co.za",  area: "Bellville, Cape Town",    address: "104 Voortrekker Road, Bellville, Cape Town, 7530",     specialties: ["Family bikes", "E-bikes", "Accessories"],           rating: 4.4, reviews: 118 },
  { id: "shop-10", name: "Gravel & Grit",          email: "info@gravelandgrit.co.za",      area: "Franschhoek",             address: "18 Huguenot Road, Franschhoek, 7690",                  specialties: ["Gravel", "Adventure riding", "Bikepacking"],        rating: 4.9, reviews: 44  },
];

function searchShops(query, shopList = SHOPS) {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return shopList.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.area.toLowerCase().includes(q) ||
      s.specialties.some((sp) => sp.toLowerCase().includes(q))
  ).slice(0, 5);
}

const SERVICE_TYPES = [
  "Full Tune-Up",
  "Brake Service",
  "Drivetrain / Chain",
  "Tyre Change",
  "Wheel Service",
  "Suspension Service",
  "Other",
];

const BIKE_TYPES = [
  { id: "road", label: "Road", icon: Route },
  { id: "gravel", label: "Gravel", icon: Compass },
  { id: "mtb", label: "MTB", icon: Mountain },
];

function getBikeTypeMeta(typeId) {
  return BIKE_TYPES.find((t) => t.id === typeId) || BIKE_TYPES[0];
}

function getBikeLabel(bike) {
  const typeMeta = getBikeTypeMeta(bike.bikeType);
  return bike.isEbike ? `E-${typeMeta.label}` : typeMeta.label;
}

const STRAVA_GEAR = [
  { id: "gear-1", name: "Roubaix · Black" },
  { id: "gear-2", name: "Stumpjumper FSR" },
  { id: "gear-3", name: "Checkpoint SL7" },
];

const RIDES_BY_GEAR = {
  "gear-1": [
    { id: "r1", date: daysAgoISO(2), name: "Chapman's Peak climb", distanceKm: 42.3, elevationM: 610 },
    { id: "r2", date: daysAgoISO(6), name: "Sea Point promenade loop", distanceKm: 18.1, elevationM: 40 },
    { id: "r3", date: daysAgoISO(13), name: "Constantia greenbelt spin", distanceKm: 35.6, elevationM: 320 },
    { id: "r4", date: daysAgoISO(20), name: "Century City commute", distanceKm: 12.4, elevationM: 15 },
    { id: "r5", date: daysAgoISO(34), name: "Cape Point out-and-back", distanceKm: 96.2, elevationM: 780 },
  ],
  "gear-2": [
    { id: "r6", date: daysAgoISO(4), name: "Tokai forest trails", distanceKm: 24.7, elevationM: 540 },
    { id: "r7", date: daysAgoISO(11), name: "Jonkershoek climb", distanceKm: 31.2, elevationM: 890 },
    { id: "r8", date: daysAgoISO(25), name: "Constantia Nek loop", distanceKm: 19.8, elevationM: 410 },
  ],
  "gear-3": [
    { id: "r9", date: daysAgoISO(5), name: "West Coast gravel run", distanceKm: 58.4, elevationM: 290 },
    { id: "r10", date: daysAgoISO(15), name: "Darling backroads", distanceKm: 73.1, elevationM: 410 },
  ],
};

function getMileageInfo(bike) {
  if (!bike.stravaGearId) return null;
  const rides = RIDES_BY_GEAR[bike.stravaGearId] || [];
  const lastServiceDate = bike.serviceLog.length
    ? [...bike.serviceLog].sort((a, b) => new Date(b.date) - new Date(a.date))[0].date
    : bike.registeredOn;
  const kmSince = rides
    .filter((r) => new Date(r.date) > new Date(lastServiceDate))
    .reduce((sum, r) => sum + r.distanceKm, 0);
  const totalKm = rides.reduce((sum, r) => sum + r.distanceKm, 0);
  let tone = "ok";
  if (kmSince > 1000) tone = "alert";
  else if (kmSince > 600) tone = "pending";
  return { kmSince: Math.round(kmSince), totalKm: Math.round(totalKm), rideCount: rides.length, tone };
}

function seedBikes() {
  return [
    {
      id: "SB-7F2K-9QXM",
      brand: "Specialized",
      model: "Roubaix",
      color: "Gloss Black",
      bikeType: "road",
      isEbike: false,
      serialNumber: "WSBC-204871",
      detailsVerified: true,
      detailsVerifiedBy: "East City Cycles",
      detailsVerifiedAt: monthsAgoISO(10),
      stravaGearId: null,
      transferCode: null,
      transferPending: false,
      ownerName: "Jesse",
      ownershipLog: [
        { name: "Marco Siebrits", date: monthsAgoISO(28), type: "original" },
        { name: "Jesse", date: monthsAgoISO(14), type: "transfer" },
      ],
      registeredOn: monthsAgoISO(14),
      serviceLog: [
        {
          id: "log-1",
          date: monthsAgoISO(10),
          type: "Full Tune-Up",
          notes: "Cables replaced, gears indexed, full safety check.",
          loggedBy: "shop",
          shopName: "East City Cycles",
          status: "verified",
          verifiedAt: monthsAgoISO(10),
        },
        {
          id: "log-2",
          date: monthsAgoISO(6),
          type: "Brake Service",
          notes: "Pads replaced front and rear, rotors trued.",
          loggedBy: "shop",
          shopName: "Two Wheels Workshop",
          status: "verified",
          verifiedAt: monthsAgoISO(6),
        },
        {
          id: "log-3",
          date: monthsAgoISO(4),
          type: "Drivetrain / Chain",
          notes: "Replaced worn chain myself, lubricated the drivetrain.",
          loggedBy: "customer",
          shopName: null,
          status: "self",
        },
        {
          id: "log-4",
          date: daysAgoISO(2),
          type: "Tyre Change",
          notes:
            "Front tyre replaced after a puncture on the cycle path. Please confirm when you get a chance.",
          loggedBy: "customer",
          shopName: "East City Cycles",
          status: "pending",
        },
      ],
      components: [
        { id: "c1", type: "Chain",      installedOn: monthsAgoISO(4),  maxKm: 3000,  baseKm: 0,    brand: "Shimano", model: "CN-HG601" },
        { id: "c2", type: "Rear Tyre",  installedOn: monthsAgoISO(8),  maxKm: 5000,  baseKm: 1200, brand: "Continental", model: "GP5000" },
        { id: "c3", type: "Front Tyre", installedOn: monthsAgoISO(14), maxKm: 7000,  baseKm: 3100, brand: "Continental", model: "GP5000" },
        { id: "c4", type: "Brake Pads", installedOn: monthsAgoISO(6),  maxKm: 4000,  baseKm: 0,    brand: "Shimano", model: "R55C4" },
        { id: "c5", type: "Cassette",   installedOn: monthsAgoISO(14), maxKm: 15000, baseKm: 4200, brand: "Shimano", model: "105 R7000" },
      ],
    },
    {
      id: "SB-3T9R-DEMO",
      brand: "Canyon",
      model: "Grail CF SL",
      color: "Stealth Grey",
      bikeType: "gravel",
      isEbike: false,
      serialNumber: "CYN-884219",
      detailsVerified: true,
      detailsVerifiedBy: "Tableside Cycles",
      detailsVerifiedAt: monthsAgoISO(3),
      stravaGearId: null,
      transferCode: "TX-DEMO-CODE",
      transferPending: true,
      ownerName: "Pieter van Zyl",
      ownershipLog: [
        { name: "Pieter van Zyl", date: monthsAgoISO(18), type: "original" },
      ],
      registeredOn: monthsAgoISO(18),
      serviceLog: [
        { id: "dl-1", date: monthsAgoISO(6), type: "Full Tune-Up", notes: "Pre-sale service. Full drivetrain clean, cables replaced.", loggedBy: "shop", shopName: "Tableside Cycles", status: "verified", verifiedAt: monthsAgoISO(6) },
        { id: "dl-2", date: monthsAgoISO(3), type: "Tyre Change", notes: "Tubeless setup, Panaracer Gravel King 40mm both ends.", loggedBy: "shop", shopName: "Tableside Cycles", status: "verified", verifiedAt: monthsAgoISO(3) },
      ],
      components: [
        { id: "dc1", type: "Chain",      installedOn: monthsAgoISO(6),  maxKm: 3000, baseKm: 0, brand: "Shimano", model: "GRX" },
        { id: "dc2", type: "Rear Tyre",  installedOn: monthsAgoISO(3),  maxKm: 5000, baseKm: 0, brand: "Panaracer", model: "Gravel King 40" },
        { id: "dc3", type: "Front Tyre", installedOn: monthsAgoISO(3),  maxKm: 7000, baseKm: 0, brand: "Panaracer", model: "Gravel King 40" },
      ],
    },
  ];
}

/* =========================================================
   PRESENTATIONAL PIECES
   ========================================================= */

function QRPattern({ seed, size = 17, cell = 8 }) {
  const grid = useMemo(() => generatePattern(seed, size), [seed, size]);
  const total = size * cell;
  return (
    <svg viewBox={`0 0 ${total} ${total}`} width={total} height={total}>
      <rect x="0" y="0" width={total} height={total} fill="var(--paper)" />
      {grid.map((row, y) =>
        row.map((on, x) =>
          on ? (
            <rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell} height={cell} fill="var(--ink)" />
          ) : null
        )
      )}
    </svg>
  );
}

function ReminderBadge({ info }) {
  const cls = { ok: "rb--ok", pending: "rb--pending", alert: "rb--alert", neutral: "rb--neutral" }[info.tone] || "rb--neutral";
  return (
    <div className={`sb-reminder ${cls}`}>
      <Clock size={13} style={{ marginRight: 5, verticalAlign: "-2px" }} />
      <span className="font-mono">{info.label}</span>
    </div>
  );
}

function ServiceTag({ entry }) {
  const toneMap = {
    verified: { label: "Verified", icon: CheckCircle2, cls: "tag--verified" },
    pending: { label: "Awaiting confirmation", icon: Clock, cls: "tag--pending" },
    self: { label: "Logged by owner", icon: User, cls: "tag--self" },
  };
  const tone = toneMap[entry.status] || toneMap.self;
  const Icon = tone.icon;
  return (
    <div className={`sb-tag ${tone.cls}`}>
      <span className="sb-tag-hole">
        <Flourish size={9} />
      </span>
      <div className="sb-tag-top">
        <span className="sb-tag-type font-display">{entry.type}</span>
        <span className="sb-tag-date font-mono">{formatDate(entry.date)}</span>
      </div>
      <p className="sb-tag-notes font-body">{entry.notes}</p>
      <div className="sb-tag-bottom">
        <span className="sb-tag-status font-mono">
          <Icon size={13} style={{ marginRight: 4, verticalAlign: "-2px" }} />
          {tone.label}
        </span>
        {entry.cost != null && entry.cost > 0 && (
          <span className="sb-tag-cost font-mono">R{Number(entry.cost).toLocaleString()}</span>
        )}
        {entry.shopName && (
          <span className="sb-tag-shop font-mono">
            <Wrench size={12} style={{ marginRight: 4, verticalAlign: "-2px" }} />
            {entry.shopName}
          </span>
        )}
      </div>
      
    </div>
  );
}

function TopBar({ title, onBack, right }) {
  return (
    <div className="sb-topbar">
      {onBack ? (
        <button className="sb-iconbtn" onClick={onBack} aria-label="Back">
          <ChevronLeft size={20} />
        </button>
      ) : (
        <span className="sb-iconbtn-spacer" />
      )}
      <h1 className="sb-topbar-title font-display">{title}</h1>
      <div className="sb-topbar-right">{right}</div>
    </div>
  );
}

function EmptyState({ Icon, title, body }) {
  return (
    <div className="sb-empty">
      <Icon size={26} />
      <h3 className="font-display">{title}</h3>
      <p className="font-body">{body}</p>
    </div>
  );
}

function ComponentWearBar({ pct, tone }) {
  const color = { ok: "var(--verified)", pending: "var(--pending)", alert: "var(--alert)" }[tone];
  const bgColor = { ok: "var(--verified-bg)", pending: "var(--pending-bg)", alert: "var(--alert-bg)" }[tone];
  return (
    <div className="sb-wear-track" style={{ background: bgColor }}>
      <div className="sb-wear-fill" style={{ width: `${Math.min(pct, 100)}%`, background: color }} />
    </div>
  );
}

function ComponentCard({ comp, stravaGearId, onContact }) {
  const km = getComponentKm(comp, stravaGearId);
  const pct = Math.round((km / comp.maxKm) * 100);
  const tone = getWearTone(pct);
  const alertColor = { ok: "var(--verified)", pending: "var(--pending)", alert: "var(--alert)" }[tone];
  return (
    <div className={`sb-comp-card comp--${tone}`}>
      <div className="sb-comp-top">
        <div>
          <span className="font-display sb-comp-type">{comp.type}</span>
          {comp.brand && (
            <span className="font-mono sb-comp-brand">{comp.brand} {comp.model}</span>
          )}
        </div>
        <div className="sb-comp-km-badge" style={{ color: alertColor }}>
          <span className="font-display sb-comp-pct">{pct}%</span>
        </div>
      </div>
      <ComponentWearBar pct={pct} tone={tone} />
      <div className="sb-comp-footer">
        <span className="font-mono sb-comp-meta">{km} / {comp.maxKm} km</span>
        <span className="font-mono sb-comp-meta">Since {formatDate(comp.installedOn)}</span>
        {comp.cost != null && comp.cost > 0 && (
          <span className="font-mono sb-comp-meta sb-comp-cost">R{Number(comp.cost).toLocaleString()}</span>
        )}
      </div>
      {pct >= 65 && (
        <div className={`sb-comp-alert font-mono comp-alert--${tone}`}>
          {pct >= 90 ? <AlertTriangle size={12} style={{ marginRight: 5 }} /> : <Clock size={12} style={{ marginRight: 5 }} />}
          {pct >= 90 ? "Needs replacement soon" : "Service due soon"}
        </div>
      )}
      {onContact && (
        <button className="sb-comp-message-btn font-mono" onClick={onContact}>
          <MessageSquare size={12} style={{ marginRight: 5 }} />
          Message preferred shop
        </button>
      )}
    </div>
  );
}

function Flourish({ size = 16, color = "var(--gold)" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="1.3">
        <circle cx="12" cy="7" r="4" />
        <circle cx="12" cy="17" r="4" />
        <circle cx="7" cy="12" r="4" />
        <circle cx="17" cy="12" r="4" />
      </g>
      <circle cx="12" cy="12" r="1.8" fill={color} />
    </svg>
  );
}

/* =========================================================
   APP
   ========================================================= */

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [preferredShopId, setPreferredShopId] = useState("shop-1");
  const [notifyShopOnWear, setNotifyShopOnWear] = useState(true);
  const [calendarSyncEnabled, setCalendarSyncEnabled] = useState(false);
  const [shopSearchQuery, setShopSearchQuery] = useState("");
  const [shopSearchFocused, setShopSearchFocused] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [emailDraft, setEmailDraft] = useState("");
  const [passwordDraft, setPasswordDraft] = useState("");
  const [showPasswordDraft, setShowPasswordDraft] = useState(false);
  const [riderTermsAccepted, setRiderTermsAccepted] = useState(false);
  const [shopTermsAccepted, setShopTermsAccepted] = useState(false);
  const [newShopTermsAccepted, setNewShopTermsAccepted] = useState(false);
  const [termsReturnScreen, setTermsReturnScreen] = useState("customer-auth");
  const [activeShop, setActiveShop] = useState(null);
  const [bikes, setBikes] = useState(seedBikes);
  const [selectedBikeId, setSelectedBikeId] = useState(null);
  const [draftBike, setDraftBike] = useState({ brand: "", model: "", color: "", bikeType: "road", isEbike: false, serialNumber: "" });
  const [newBikeId, setNewBikeId] = useState(null);
  const [logForm, setLogForm] = useState({
    type: SERVICE_TYPES[0],
    date: new Date().toISOString().slice(0, 10),
    notes: "",
    cost: "",
    mode: "self",
    shopId: SHOPS[0].id,
  });
  const [lookupInput, setLookupInput] = useState("");
  const [lookupBikeId, setLookupBikeId] = useState(null);
  const [lookupError, setLookupError] = useState("");
  const [profileShop, setProfileShop] = useState(null);
  const [authMode, setAuthMode] = useState("signin");
  const [shopAvatars, setShopAvatars] = useState({});
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [signInError, setSignInError] = useState("");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [shopAuthSelectedId, setShopAuthSelectedId] = useState(null);
  const [shopAuthPassword, setShopAuthPassword] = useState("");
  const [showShopAuthPassword, setShowShopAuthPassword] = useState(false);
  const [shopProfileOverrides, setShopProfileOverrides] = useState({});
  const [shopSignupForm, setShopSignupForm] = useState({ address: "", area: "", specialties: "" });
  const [customShops, setCustomShops] = useState([]);
  const [newShopForm, setNewShopForm] = useState({ name: "", email: "", address: "", area: "", specialties: "" });
  const [newShopError, setNewShopError] = useState("");
  const [shopAddForm, setShopAddForm] = useState({
    type: SERVICE_TYPES[0],
    date: new Date().toISOString().slice(0, 10),
    notes: "",
  });
  const [toast, setToast] = useState("");
  const [pushNotif, setPushNotif] = useState(null); // { title, body }
  const [stravaConnected, setStravaConnected] = useState(false);
  const [connectingStrava, setConnectingStrava] = useState(false);
  const [bikeDetailTab, setBikeDetailTab] = useState("history"); // "history" | "components"
  const [compForm, setCompForm] = useState({ type: COMPONENT_PRESETS[0].type, brand: "", model: "", baseKm: "", date: new Date().toISOString().slice(0, 10), maxKm: COMPONENT_PRESETS[0].maxKm, cost: "" });
  const [claimInput, setClaimInput] = useState("");
  const [claimError, setClaimError] = useState("");
  const [claimBikeId, setClaimBikeId] = useState(null);
  const [transferBikeId, setTransferBikeId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuView, setMenuView] = useState("main");
  const [suggestionText, setSuggestionText] = useState("");
  const [suggestionSearch, setSuggestionSearch] = useState("");
  const [mySuggestionVotes, setMySuggestionVotes] = useState([]); // ids the current identity has upvoted
  const [suggestions, setSuggestions] = useState([
    { id: "sg1", text: "Dark mode for the whole app", votes: 34, author: "Priya N.", ts: daysAgoISO(5) },
    { id: "sg2", text: "Sync service reminders to my phone calendar", votes: 27, author: "Marco S.", ts: daysAgoISO(9) },
    { id: "sg3", text: "Export my full service history as a PDF", votes: 21, author: "Devan P.", ts: daysAgoISO(3) },
    { id: "sg4", text: "Let me add a second Strava-linked bike to compare wear", votes: 15, author: "Aisha K.", ts: daysAgoISO(12) },
    { id: "sg5", text: "Barcode scanner for component brand/model instead of typing", votes: 9, author: "Tumi M.", ts: daysAgoISO(20) },
    { id: "sg6", text: "Group rides — log a shared ride across multiple bikes", votes: 4, author: "Liam R.", ts: daysAgoISO(2) },
  ]);
  const [notifications, setNotifications] = useState([
    { id: "n1", type: "wear",    read: false, ts: daysAgoISO(1),  title: "Chain nearing limit",            body: "Your Shimano CN-HG601 on the Specialized Roubaix is at 83% wear. Consider booking a service soon.",         bikeId: "SB-7F2K-9QXM", compType: "Chain" },
    { id: "n2", type: "wear",    read: false, ts: daysAgoISO(2),  title: "Cassette — attention needed",    body: "Shimano 105 R7000 has exceeded 85% of its recommended lifespan. Replacing now protects your chainring.",   bikeId: "SB-7F2K-9QXM", compType: "Cassette" },
    { id: "n3", type: "service", read: true,  ts: daysAgoISO(4),  title: "Service verified",               body: "East City Cycles confirmed your Tyre Change on the Specialized Roubaix.",                                   bikeId: "SB-7F2K-9QXM", compType: null },
    { id: "n4", type: "shop",    read: true,  ts: daysAgoISO(6),  title: "Shop notification sent",         body: "East City Cycles were alerted about your Rear Tyre wear (88%). They'll be in touch to book you in.",         bikeId: "SB-7F2K-9QXM", compType: "Rear Tyre" },
    { id: "n5", type: "message", read: true,  ts: daysAgoISO(9),  title: "Message sent to East City Cycles", body: "Your message about your Brake Pads was sent. The shop will respond via email or phone.",                  bikeId: "SB-7F2K-9QXM", compType: "Brake Pads" },
    { id: "n6", type: "service", read: true,  ts: daysAgoISO(14), title: "Service verified",               body: "Two Wheels Workshop confirmed your Brake Service on the Specialized Roubaix.",                            bikeId: "SB-7F2K-9QXM", compType: null },
    { id: "n7", type: "transfer",read: true,  ts: daysAgoISO(30), title: "Transfer complete",              body: "The Canyon Grail CF SL was transferred to your account from Pieter van Zyl.",                             bikeId: "SB-3T9R-DEMO",  compType: null },
  ]);
  const [messageThreads, setMessageThreads] = useState({});
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [notifSubTab, setNotifSubTab] = useState("alerts"); // "alerts" | "messages"
  const [threadReplyDraft, setThreadReplyDraft] = useState("");
  const [contactShopState, setContactShopState] = useState({ bikeId: null, comp: null, message: "", sent: false });

  const selectedBike = bikes.find((b) => b.id === selectedBikeId) || null;
  const lookupBike = bikes.find((b) => b.id === lookupBikeId) || null;

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }

  function syncReminderToCalendar(bike) {
    const info = getNextServiceInfo(bike);
    if (!info.nextDue) {
      showToast("Log a service first to set a reminder date");
      return;
    }
    const dateStr = info.nextDue.replace(/-/g, "");
    const uid = `spokebook-${bike.id}-${info.nextDue}@spokebook.app`;
    const summary = `Spokebook: ${bike.brand} ${bike.model} service due`;
    const description = `Your ${bike.brand} ${bike.model} (${bike.id}) is due for its next service. Recommended interval: every ${SERVICE_INTERVAL_MONTHS} months since your last logged service.`;
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Spokebook//Service Reminder//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
      `DTSTART;VALUE=DATE:${dateStr}`,
      `DTEND;VALUE=DATE:${dateStr}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      "BEGIN:VALARM",
      "TRIGGER:-P3D",
      "ACTION:DISPLAY",
      "DESCRIPTION:Spokebook service reminder",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${bike.brand}-${bike.model}-service-reminder.ics`.replace(/\s+/g, "-");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Reminder added to your calendar");
  }

  function showPushNotification(title, body) {
    setPushNotif({ title, body, id: Date.now() });
    setTimeout(() => setPushNotif((cur) => (cur && cur.title === title && cur.body === body ? null : cur)), 4200);
  }

  function logoutCustomer() {
    setCustomerName("");
    setCustomerEmail("");
    setPreferredShopId(null);
    setNotifyShopOnWear(false);
    setNameDraft("");
    setEmailDraft("");
    setPasswordDraft("");
    setRiderTermsAccepted(false);
    setScreen("landing");
  }

  function logoutShop() {
    setActiveShop(null);
    setShopAuthSelectedId(null);
    setShopAuthPassword("");
    setShopTermsAccepted(false);
    setNewShopTermsAccepted(false);
    setScreen("landing");
  }

  const SHOP_AVATAR_COLORS = [
    { bg: "#1A3A2A", label: "Forest" },
    { bg: "#1A1F3A", label: "Navy" },
    { bg: "#3A1A1A", label: "Burgundy" },
    { bg: "#2A1A3A", label: "Plum" },
    { bg: "#1A2E3A", label: "Slate" },
    { bg: "#3A2E1A", label: "Bronze" },
    { bg: "#2A3A1A", label: "Moss" },
    { bg: "#3A1A2A", label: "Rose" },
  ];

  function getShopAvatar(shopId) {
    return shopAvatars[shopId] || null;
  }

  function setShopAvatar(shopId, avatarObj) {
    setShopAvatars((prev) => ({ ...prev, [shopId]: avatarObj }));
  }

  function handleShopImageUpload(shopId, file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setShopAvatar(shopId, { imageDataUrl: e.target.result, fileName: file.name });
      showToast("Profile picture updated");
    };
    reader.readAsDataURL(file);
  }

  function ShopAvatar({ shop, size = 38, fontSize = 16 }) {
    const avatar = getShopAvatar(shop.id);
    const initials = shop.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    if (avatar?.imageDataUrl) {
      return (
        <div style={{
          width: size, height: size, borderRadius: "50%", flexShrink: 0, overflow: "hidden",
          border: "1px solid var(--gold)",
        }}>
          <img
            src={avatar.imageDataUrl}
            alt={shop.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      );
    }
    return (
      <div style={{
        width: size, height: size, borderRadius: "50%", flexShrink: 0,
        background: avatar?.bg || "var(--steel)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--gold-light)", fontSize, fontFamily: "'Cormorant Garamond',serif",
        fontWeight: 600, letterSpacing: "0.04em",
        border: avatar?.bg ? "1px solid var(--gold)" : "none",
      }}>
        {initials}
      </div>
    );
  }

  function handleForgotPassword() {
    const email = forgotPasswordEmail.trim().toLowerCase();
    if (!email || !email.includes("@")) {
      setForgotPasswordError("Please enter a valid email address.");
      return;
    }
    setForgotPasswordError("");
    setForgotPasswordSent(true);
  }

  function handleSignIn() {
    const email = signInEmail.trim().toLowerCase();
    if (!email || !signInPassword.trim()) return;
    const matchedShop = getAllShops().find((s) => s.email === email);
    if (matchedShop) {
      handleShopLogin(matchedShop);
      setSignInEmail("");
      setSignInPassword("");
      setSignInError("");
    } else if (email.includes("@")) {
      // Treat as rider — use the part before @ as the display name
      const namePart = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      setCustomerName(namePart);
      setCustomerEmail(email);
      setSignInEmail("");
      setSignInPassword("");
      setSignInError("");
      setScreen("customer-home");
      setTimeout(() => showToast(`Welcome back, ${namePart.split(" ")[0]}`), 300);
    } else {
      setSignInError("Please enter a valid email address.");
    }
  }

  function handleCustomerLogin() {
    if (!nameDraft.trim() || !emailDraft.trim() || !passwordDraft.trim()) return;
    setCustomerName(nameDraft.trim());
    setCustomerEmail(emailDraft.trim().toLowerCase());
    setPasswordDraft("");
    setScreen("customer-home");
    setTimeout(() => showToast(`Welcome email sent to ${emailDraft.trim().toLowerCase()}`), 400);
  }

  function handleShopLogin(shop) {
    const merged = shop?.id ? { ...shop, ...(shopProfileOverrides[shop.id] || {}) } : shop;
    setActiveShop(merged);
    setShopAuthSelectedId(null);
    setShopAuthPassword("");
    setShopTermsAccepted(false);
    setNewShopTermsAccepted(false);
    setScreen("shop-dashboard");
  }

  function getAllShops() {
    return [...SHOPS, ...customShops];
  }

  function getShopProfile(shopId) {
    const base = getAllShops().find((s) => s.id === shopId);
    if (!base) return null;
    const override = shopProfileOverrides[shopId];
    return override ? { ...base, ...override } : base;
  }

  function submitNewShop() {
    const { name, email, address, area, specialties } = newShopForm;
    if (!name.trim() || !email.trim() || !address.trim() || !area.trim() || !specialties.trim() || !shopAuthPassword.trim()) return;
    const emailLower = email.trim().toLowerCase();
    if (getAllShops().some((s) => s.email === emailLower)) {
      setNewShopError("A shop is already registered with this email.");
      return;
    }
    const specialtiesArr = specialties.split(",").map((s) => s.trim()).filter(Boolean);
    const newShop = {
      id: `shop-custom-${Date.now()}`,
      name: name.trim(),
      email: emailLower,
      address: address.trim(),
      area: area.trim(),
      specialties: specialtiesArr,
      rating: null,
      reviews: 0,
    };
    setCustomShops((prev) => [...prev, newShop]);
    setNewShopForm({ name: "", email: "", address: "", area: "", specialties: "" });
    setNewShopError("");
    handleShopLogin(newShop);
  }

  function submitShopSignup() {
    if (!shopAuthSelectedId || !shopSignupForm.address.trim() || !shopSignupForm.area.trim() || !shopSignupForm.specialties.trim() || !shopAuthPassword.trim()) return;
    const specialtiesArr = shopSignupForm.specialties.split(",").map((s) => s.trim()).filter(Boolean);
    setShopProfileOverrides((prev) => ({
      ...prev,
      [shopAuthSelectedId]: {
        address: shopSignupForm.address.trim(),
        area: shopSignupForm.area.trim(),
        specialties: specialtiesArr,
      },
    }));
    const base = SHOPS.find((s) => s.id === shopAuthSelectedId);
    setShopSignupForm({ address: "", area: "", specialties: "" });
    handleShopLogin({
      ...base,
      address: shopSignupForm.address.trim(),
      area: shopSignupForm.area.trim(),
      specialties: specialtiesArr,
    });
  }

  function handleAddBike() {
    if (!draftBike.brand.trim() || !draftBike.model.trim() || !draftBike.serialNumber.trim()) return;
    const id = makeBikeId();
    const bike = {
      id,
      brand: draftBike.brand.trim(),
      model: draftBike.model.trim(),
      color: draftBike.color.trim() || "Unspecified",
      bikeType: draftBike.bikeType,
      isEbike: draftBike.isEbike,
      serialNumber: draftBike.serialNumber.trim().toUpperCase(),
      detailsVerified: false,
      detailsVerifiedBy: null,
      detailsVerifiedAt: null,
      stravaGearId: null,
      transferCode: null,
      transferPending: false,
      ownerName: customerName,
      ownershipLog: [{ name: customerName, date: new Date().toISOString().slice(0, 10), type: "original" }],
      registeredOn: new Date().toISOString().slice(0, 10),
      serviceLog: [],
    };
    setBikes((prev) => [...prev, bike]);
    setNewBikeId(id);
    setDraftBike({ brand: "", model: "", color: "", bikeType: "road", isEbike: false, serialNumber: "" });
    setScreen("bike-registered");
  }

  function openBike(id) {
    setSelectedBikeId(id);
    setBikeDetailTab("history");
    setScreen("bike-detail");
  }

  function openLogForm() {
    setLogForm({
      type: SERVICE_TYPES[0],
      date: new Date().toISOString().slice(0, 10),
      notes: "",
      cost: "",
      mode: "self",
      shopId: SHOPS[0].id,
    });
    setScreen("log-service");
  }

  function submitLog() {
    if (!selectedBike) return;
    const entry = {
      id: `log-${Date.now()}`,
      date: logForm.date,
      type: logForm.type,
      notes: logForm.notes.trim() || "No additional notes.",
      cost: logForm.cost.trim() ? Number(logForm.cost) : null,
      loggedBy: "customer",
      shopName: logForm.mode === "shop" ? getAllShops().find((s) => s.id === logForm.shopId)?.name : null,
      status: logForm.mode === "shop" ? "pending" : "self",
    };
    setBikes((prev) =>
      prev.map((b) => (b.id === selectedBike.id ? { ...b, serviceLog: [...b.serviceLog, entry] } : b))
    );
    showToast(logForm.mode === "shop" ? "Sent to shop for confirmation" : "Service logged");
    setScreen("bike-detail");
  }

  function submitAddComponent() {
    if (!selectedBike) return;
    const preset = COMPONENT_PRESETS.find((p) => p.type === compForm.type) || COMPONENT_PRESETS[0];
    const comp = {
      id: makeComponentId(),
      type: compForm.type,
      brand: compForm.brand.trim(),
      model: compForm.model.trim(),
      installedOn: compForm.date,
      maxKm: Number(compForm.maxKm) || preset.maxKm,
      baseKm: Number(compForm.baseKm) || 0,
      cost: compForm.cost.trim() ? Number(compForm.cost) : null,
    };
    setBikes((prev) =>
      prev.map((b) =>
        b.id === selectedBike.id ? { ...b, components: [...(b.components || []), comp] } : b
      )
    );
    showToast("Component added");
    setBikeDetailTab("components");
    setScreen("bike-detail");
  }

  function initiateTransfer(bikeId) {
    const code = makeTransferCode();
    setBikes((prev) =>
      prev.map((b) => (b.id === bikeId ? { ...b, transferCode: code, transferPending: true } : b))
    );
    setTransferBikeId(bikeId);
    setScreen("transfer-code");
  }

  function cancelTransfer(bikeId) {
    setBikes((prev) =>
      prev.map((b) => (b.id === bikeId ? { ...b, transferCode: null, transferPending: false } : b))
    );
    showToast("Transfer cancelled");
    setScreen("bike-detail");
  }

  function handleClaim() {
    const code = claimInput.trim().toUpperCase();
    const found = bikes.find((b) => b.transferCode === code && b.transferPending);
    if (!found) {
      setClaimError("No bike found with that transfer code. Check the code and try again.");
      setClaimBikeId(null);
      return;
    }
    if (found.ownerName === customerName) {
      setClaimError("This bike is already registered to your account.");
      return;
    }
    setClaimError("");
    setClaimBikeId(found.id);
    setScreen("claim-confirm");
  }

  function acceptClaim() {
    const bike = bikes.find((b) => b.id === claimBikeId);
    if (!bike) return;
    setBikes((prev) =>
      prev.map((b) =>
        b.id === claimBikeId
          ? {
              ...b,
              ownerName: customerName,
              transferCode: null,
              transferPending: false,
              ownershipLog: [
                ...(b.ownershipLog || []),
                { name: customerName, date: new Date().toISOString().slice(0, 10), type: "transfer" },
              ],
            }
          : b
      )
    );
    setClaimInput("");
    setClaimBikeId(null);
    showToast("Bike transferred to your account");
    setScreen("customer-home");
  }

  function handleLookup() {
    const id = lookupInput.trim().toUpperCase();
    const found = bikes.find((b) => b.id === id);
    if (!found) {
      setLookupError("No bike found with that ID. Check the code and try again.");
      setLookupBikeId(null);
      return;
    }
    setLookupError("");
    setLookupBikeId(found.id);
    setScreen("shop-lookup-result");
  }

  function verifyEntry(bikeId, entryId) {
    setBikes((prev) =>
      prev.map((b) =>
        b.id === bikeId
          ? {
              ...b,
              serviceLog: b.serviceLog.map((e) =>
                e.id === entryId
                  ? { ...e, status: "verified", verifiedAt: new Date().toISOString().slice(0, 10) }
                  : e
              ),
            }
          : b
      )
    );
    showToast("Service verified");
  }

  function verifyBikeDetails(bikeId) {
    if (!activeShop) return;
    setBikes((prev) =>
      prev.map((b) =>
        b.id === bikeId
          ? {
              ...b,
              detailsVerified: true,
              detailsVerifiedBy: activeShop.name,
              detailsVerifiedAt: new Date().toISOString().slice(0, 10),
            }
          : b
      )
    );
    showToast("Bike details verified");
  }

  function connectStrava() {
    setConnectingStrava(true);
    setTimeout(() => {
      setStravaConnected(true);
      setConnectingStrava(false);
      showToast("Connected to Strava");
    }, 900);
  }

  function linkBikeToGear(bikeId, gearId) {
    setBikes((prev) => prev.map((b) => (b.id === bikeId ? { ...b, stravaGearId: gearId } : b)));
    showToast("Strava bike linked");
  }

  function unlinkBikeFromGear(bikeId) {
    setBikes((prev) => prev.map((b) => (b.id === bikeId ? { ...b, stravaGearId: null } : b)));
    showToast("Strava bike unlinked");
  }

  function availableGearFor(currentBike) {
    const used = new Set(bikes.filter((b) => b.id !== currentBike.id && b.stravaGearId).map((b) => b.stravaGearId));
    return STRAVA_GEAR.filter((g) => !used.has(g.id));
  }

  function openShopAddForm() {
    setShopAddForm({ type: SERVICE_TYPES[0], date: new Date().toISOString().slice(0, 10), notes: "" });
    setScreen("shop-add-service");
  }

  function submitShopAddForm() {
    if (!lookupBike || !activeShop) return;
    const entry = {
      id: `log-${Date.now()}`,
      date: shopAddForm.date,
      type: shopAddForm.type,
      notes: shopAddForm.notes.trim() || "No additional notes.",
      loggedBy: "shop",
      shopName: activeShop.name,
      status: "verified",
      verifiedAt: shopAddForm.date,
    };
    setBikes((prev) =>
      prev.map((b) => (b.id === lookupBike.id ? { ...b, serviceLog: [...b.serviceLog, entry] } : b))
    );
    showToast("Service added to bike's record");
    setScreen("shop-lookup-result");
  }

  const pendingForShop = useMemo(() => {
    if (!activeShop) return [];
    const list = [];
    bikes.forEach((b) => {
      b.serviceLog.forEach((e) => {
        if (e.status === "pending" && e.shopName === activeShop.name) {
          list.push({ bikeId: b.id, bikeLabel: `${b.brand} ${b.model}`, ...e });
        }
      });
    });
    return list;
  }, [bikes, activeShop]);

  function renderShopSearch({ label = "PREFERRED BIKE SHOP", sublabel = "Your preferred shop can be notified when components near their service limit.", compact = false } = {}) {
    const selected = preferredShopId ? getShopProfile(preferredShopId) : null;
    const results = searchShops(shopSearchQuery).map((s) => getShopProfile(s.id));
    const showDropdown = shopSearchFocused && shopSearchQuery.trim().length > 0;

    return (
      <div className="sb-shop-search-wrap">
        {!compact && <label className="sb-label font-mono">{label} <span style={{ color: "var(--muted)", fontWeight: 400 }}>(optional)</span></label>}
        {compact && <label className="sb-label font-mono">{label}</label>}
        <p className="sb-helper font-body" style={{ marginBottom: 10 }}>{sublabel}</p>

        {selected ? (
          <div className="sb-shop-selected-row">
            <div className="sb-shop-select-icon" style={{ width: 32, height: 32, flexShrink: 0 }}>
              <CheckCircle2 size={16} style={{ color: "var(--gold-light)" }} />
            </div>
            <div className="sb-shop-select-text">
              <span className="font-display sb-shop-select-name">{selected.name}</span>
              <span className="font-mono sb-shop-select-area">{selected.area}</span>
              {selected.address && (
                <span className="font-mono sb-shop-select-address">{selected.address}</span>
              )}
            </div>
            <button
              className="sb-shop-clear font-mono"
              onClick={() => { setPreferredShopId(null); setNotifyShopOnWear(false); setShopSearchQuery(""); }}
            >
              Change
            </button>
          </div>
        ) : (
          <div className="sb-shop-search-field-wrap">
            <div className="sb-shop-search-field">
              <Search size={14} className="sb-shop-search-icon" />
              <input
                className="sb-shop-search-input font-body"
                placeholder="Search by name, area or speciality…"
                value={shopSearchQuery}
                onChange={(e) => setShopSearchQuery(e.target.value)}
                onFocus={() => setShopSearchFocused(true)}
                onBlur={() => setTimeout(() => setShopSearchFocused(false), 150)}
              />
              {shopSearchQuery && (
                <button className="sb-shop-search-clear" onClick={() => setShopSearchQuery("")}>
                  <X size={13} />
                </button>
              )}
            </div>

            {showDropdown && (
              <div className="sb-shop-dropdown">
                {results.length === 0 ? (
                  <div className="sb-shop-dropdown-empty font-mono">No shops found — try a different name or area</div>
                ) : (
                  results.map((s) => (
                    <button
                      key={s.id}
                      className="sb-shop-dropdown-item"
                      onMouseDown={() => {
                        setPreferredShopId(s.id);
                        setNotifyShopOnWear(true);
                        setShopSearchQuery("");
                        setShopSearchFocused(false);
                      }}
                    >
                      <div className="sb-shop-dropdown-icon"><Store size={14} /></div>
                      <div className="sb-shop-dropdown-text">
                        <span className="font-display sb-shop-dropdown-name">{s.name}</span>
                        <span className="font-mono sb-shop-dropdown-area">
                          <MapPin size={10} style={{ marginRight: 3, verticalAlign: "-1px" }} />
                          {s.area}
                        </span>
                        {s.address && (
                          <span className="font-mono sb-shop-dropdown-address">{s.address}</span>
                        )}
                        <span className="font-mono sb-shop-dropdown-tags">
                          {s.specialties.slice(0, 2).join(" · ")}
                        </span>
                      </div>
                      <span className="sb-shop-dropdown-rating font-mono">
                        <Star size={10} fill="currentColor" style={{ marginRight: 2, verticalAlign: "-1px" }} />
                        {s.rating}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}

            {!showDropdown && !shopSearchQuery && (
              <div className="sb-shop-search-hint font-mono">
                Try "MTB", "Sea Point", "e-bike", or a shop name
              </div>
            )}
          </div>
        )}

        {preferredShopId && (
          <>
            <div className="sb-notify-toggle-row" style={{ marginTop: 12 }} onClick={() => setNotifyShopOnWear(!notifyShopOnWear)}>
              <div style={{ flex: 1 }}>
                <span className="font-body sb-notify-label">Notify shop at 80% component wear</span>
                <span className="font-mono sb-notify-sub">
                  {getAllShops().find(s => s.id === preferredShopId)?.name} receives an alert so they can prepare parts in advance
                </span>
              </div>
              <div className={`sb-toggle-switch ${notifyShopOnWear ? "sb-toggle-switch-on" : ""}`}>
                <div className="sb-toggle-knob" />
              </div>
            </div>
            {notifyShopOnWear && (
              <div className="sb-notify-active-badge font-mono">
                <CheckCircle2 size={12} style={{ marginRight: 6, flexShrink: 0 }} />
                Active — {getAllShops().find(s => s.id === preferredShopId)?.name} will be notified automatically
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  function addNotification(notif) {
    setNotifications(prev => [{ id: `n-${Date.now()}`, read: false, ts: new Date().toISOString().slice(0, 10), ...notif }, ...prev]);
    showPushNotification(notif.title, notif.body);
  }

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  // ── Message threads: one thread per (shop, rider) pair, chat-style ──
  function getThreadId(shopId, riderEmail) {
    return `${shopId}::${riderEmail}`;
  }

  function addThreadMessage(shopId, riderEmail, riderName, msg) {
    const tid = getThreadId(shopId, riderEmail);
    const shop = getAllShops().find(s => s.id === shopId);
    const isFromRider = msg.sender === "rider";

    setMessageThreads(prev => {
      const existing = prev[tid] || { shopId, riderEmail, riderName, messages: [] };
      return {
        ...prev,
        [tid]: {
          ...existing,
          riderName: riderName || existing.riderName,
          messages: [
            ...existing.messages,
            {
              id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              ts: new Date().toISOString().slice(0, 10),
              readByRider: isFromRider,
              readByShop: !isFromRider,
              ...msg,
            },
          ],
        },
      };
    });

    // Push notification simulating what the recipient's device would show
    if (isFromRider) {
      showPushNotification(`New message from ${riderName || "a rider"}`, msg.text || "Sent a message about a component.");
    } else {
      showPushNotification(`${shop?.name || "Your shop"} replied`, msg.text || "Sent you a reply.");
    }
  }

  function getRiderThreads() {
    return Object.entries(messageThreads)
      .filter(([, t]) => t.riderEmail === customerEmail)
      .map(([tid, t]) => ({ tid, ...t }))
      .sort((a, b) => {
        const aLast = a.messages[a.messages.length - 1]?.ts || "";
        const bLast = b.messages[b.messages.length - 1]?.ts || "";
        return aLast < bLast ? 1 : -1;
      });
  }

  function getShopThreads(shopId) {
    return Object.entries(messageThreads)
      .filter(([, t]) => t.shopId === shopId)
      .map(([tid, t]) => ({ tid, ...t }))
      .sort((a, b) => {
        const aLast = a.messages[a.messages.length - 1]?.ts || "";
        const bLast = b.messages[b.messages.length - 1]?.ts || "";
        return aLast < bLast ? 1 : -1;
      });
  }

  function threadUnread(thread, viewer) {
    return thread.messages.filter(m => viewer === "rider" ? !m.readByRider : !m.readByShop).length;
  }

  function markThreadRead(tid, viewer) {
    setMessageThreads(prev => {
      const t = prev[tid];
      if (!t) return prev;
      return {
        ...prev,
        [tid]: {
          ...t,
          messages: t.messages.map(m =>
            viewer === "rider" ? { ...m, readByRider: true } : { ...m, readByShop: true }
          ),
        },
      };
    });
  }

  const riderThreadUnread = getRiderThreads().reduce((sum, t) => sum + threadUnread(t, "rider"), 0);
  const shopThreadUnread = activeShop ? getShopThreads(activeShop.id).reduce((sum, t) => sum + threadUnread(t, "shop"), 0) : 0;

  function openContactShop(bikeId, comp) {
    setContactShopState({ bikeId, comp, message: "", sent: false });
    setScreen("contact-shop");
  }

  function submitContactShop() {
    const bike = bikes.find(b => b.id === contactShopState.bikeId);
    const shop = getAllShops().find(s => s.id === preferredShopId);
    const shopName = shop?.name || "your preferred shop";
    const comp = contactShopState.comp;
    const km = bike ? getComponentKm(comp, bike.stravaGearId) : 0;
    const pct = comp ? Math.round((km / comp.maxKm) * 100) : null;

    // Rider's own confirmation in the Alerts feed
    addNotification({
      type: "message",
      title: `Message sent to ${shopName}`,
      body: `Your message about your ${comp.type} was sent. The shop will respond via the message thread.`,
      bikeId: contactShopState.bikeId,
      compType: comp.type,
    });

    // Push the actual message into the shared thread with the shop
    if (shop) {
      addThreadMessage(shop.id, customerEmail, customerName, {
        sender: "rider",
        text: contactShopState.message.trim(),
        bikeId: contactShopState.bikeId,
        bikeLabel: bike ? `${bike.brand} ${bike.model}` : "their bike",
        compType: comp.type,
        compBrand: comp.brand,
        compModel: comp.model,
        compKm: km,
        compMaxKm: comp.maxKm,
        compPct: pct,
        compInstalledOn: comp.installedOn,
      });
    }

    setContactShopState(prev => ({ ...prev, sent: true }));
    setTimeout(() => {
      setScreen("bike-detail");
      setBikeDetailTab("components");
      showToast(`Message sent to ${shopName}`);
    }, 1600);
  }

  function sendThreadReply(tid, sender, text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const thread = messageThreads[tid];
    if (!thread) return;
    addThreadMessage(thread.shopId, thread.riderEmail, thread.riderName, { sender, text: trimmed });
    if (sender === "shop") {
      showToast("Reply sent to rider");
    } else {
      showToast(`Message sent to ${getAllShops().find(s => s.id === thread.shopId)?.name || "shop"}`);
    }
  }

  function openMenu() {
    setMenuView("main");
    setSuggestionText("");
    setMenuOpen(true);
  }

  function toggleSuggestionVote(id) {
    const hasVoted = mySuggestionVotes.includes(id);
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, votes: s.votes + (hasVoted ? -1 : 1) } : s))
    );
    setMySuggestionVotes((prev) =>
      hasVoted ? prev.filter((v) => v !== id) : [...prev, id]
    );
  }

  function submitSuggestion() {
    if (!suggestionText.trim()) return;
    const id = `sg-${Date.now()}`;
    const author = activeShop ? (activeShop.name || "Shop") : (customerName || "You");
    setSuggestions((prev) => [
      { id, text: suggestionText.trim(), votes: 1, author, ts: new Date().toISOString().slice(0, 10) },
      ...prev,
    ]);
    setMySuggestionVotes((prev) => [...prev, id]);
    setSuggestionText("");
    setSuggestionSearch("");
    setMenuView("suggestion");
    showToast("Suggestion added — thank you");
  }

  function renderMenu(isShop = false) {
    const name = isShop ? activeShop?.name : customerName;
    const subtitle = isShop ? "Shop account" : "Rider account";
    if (!menuOpen) return null;
    return (
      <>
        <div className="sb-menu-overlay" onClick={() => setMenuOpen(false)} />
        <div className="sb-menu-drawer">
          <div className="sb-menu-header">
            {menuView === "thread" ? (
              <button className="sb-iconbtn" onClick={() => { setMenuView("notifications"); setActiveThreadId(null); }}><ChevronLeft size={18} /></button>
            ) : menuView === "suggestion-new" ? (
              <button className="sb-iconbtn" onClick={() => { setSuggestionText(""); setMenuView("suggestion"); }}><ChevronLeft size={18} /></button>
            ) : menuView !== "main" ? (
              <button className="sb-iconbtn" onClick={() => setMenuView("main")}><ChevronLeft size={18} /></button>
            ) : <span className="sb-iconbtn-spacer" />}
            <span className="sb-menu-title font-display">
              {menuView === "main" ? "Menu"
                : menuView === "profile" ? "Profile"
                : menuView === "notifications" ? "Notifications"
                : menuView === "suggestion" ? "Suggestion Box"
                : menuView === "suggestion-new" ? "New Suggestion"
                : menuView === "thread" ? (
                    isShop
                      ? messageThreads[activeThreadId]?.riderName || "Conversation"
                      : getAllShops().find(s => s.id === messageThreads[activeThreadId]?.shopId)?.name || "Conversation"
                  )
                : "Menu"}
            </span>
            <button className="sb-iconbtn" onClick={() => setMenuOpen(false)}><X size={18} /></button>
          </div>

          {menuView === "main" && (
            <div className="sb-menu-body">
              <div className="sb-menu-identity">
                {isShop && activeShop
                  ? <ShopAvatar shop={activeShop} size={40} fontSize={16} />
                  : <div className="sb-menu-avatar font-display">{(name || "?")[0].toUpperCase()}</div>
                }
                <div>
                  <span className="sb-menu-name font-display">{name}</span>
                  <span className="sb-menu-subtitle font-mono">{subtitle}</span>
                </div>
              </div>
              <div className="sb-menu-divider" />
              <button className="sb-menu-item" onClick={() => setMenuView("profile")}>
                <User size={16} className="sb-menu-item-icon" />
                <span className="font-body">Profile details</span>
                <ChevronRight size={15} className="sb-menu-item-arrow" />
              </button>
              <button className="sb-menu-item" onClick={() => { if (!isShop) markAllRead(); setNotifSubTab(notifSubTab); setMenuView("notifications"); }}>
                <Bell size={16} className="sb-menu-item-icon" />
                <span className="font-body">Notifications</span>
                {(isShop ? shopThreadUnread : unreadCount + riderThreadUnread) > 0 && (
                  <span className="sb-menu-notif-badge font-mono">{isShop ? shopThreadUnread : unreadCount + riderThreadUnread}</span>
                )}
                <ChevronRight size={15} className="sb-menu-item-arrow" />
              </button>
              <button className="sb-menu-item" onClick={() => setMenuView("suggestion")}>
                <Send size={16} className="sb-menu-item-icon" />
                <span className="font-body">Suggestion box</span>
                <ChevronRight size={15} className="sb-menu-item-arrow" />
              </button>
              <div className="sb-menu-divider" />
              <button className="sb-menu-item sb-menu-item-danger" onClick={() => { setMenuOpen(false); isShop ? logoutShop() : logoutCustomer(); }}>
                <span className="font-body">Log out</span>
              </button>
            </div>
          )}

          {menuView === "profile" && (
            <div className="sb-menu-body">
              <div className="sb-menu-profile-card">
                {isShop && activeShop ? (
                  <ShopAvatar shop={activeShop} size={60} fontSize={22} />
                ) : (
                  <div className="sb-menu-avatar sb-menu-avatar-lg font-display">{(name || "?")[0].toUpperCase()}</div>
                )}
                <span className="sb-menu-name font-display" style={{ fontSize: 20 }}>{name}</span>
                {!isShop && customerEmail && (
                  <span className="sb-menu-subtitle font-mono">{customerEmail}</span>
                )}
                <span className="sb-menu-subtitle font-mono" style={{ marginTop: !isShop && customerEmail ? 2 : 0 }}>{subtitle}</span>
              </div>

              {!isShop && (
                <>
                  <div className="sb-menu-stat-row">
                    <div className="sb-menu-stat">
                      <span className="font-display sb-menu-stat-num">{bikes.length}</span>
                      <span className="font-mono sb-menu-stat-label">BIKES</span>
                    </div>
                    <div className="sb-menu-stat">
                      <span className="font-display sb-menu-stat-num">{bikes.reduce((n, b) => n + b.serviceLog.length, 0)}</span>
                      <span className="font-mono sb-menu-stat-label">LOGS</span>
                    </div>
                    <div className="sb-menu-stat">
                      <span className="font-display sb-menu-stat-num">{bikes.reduce((n, b) => n + (b.components || []).length, 0)}</span>
                      <span className="font-mono sb-menu-stat-label">PARTS</span>
                    </div>
                  </div>

                  <label className="sb-label font-mono" style={{ marginTop: 22 }}>PREFERRED BIKE SHOP</label>
                  {renderShopSearch({ label: "", sublabel: "Your preferred shop can be notified when components are nearing their service limit.", compact: true })}

                  <label className="sb-label font-mono" style={{ marginTop: 22 }}>CALENDAR</label>
                  <div className="sb-notify-toggle-row" onClick={() => setCalendarSyncEnabled(!calendarSyncEnabled)}>
                    <div style={{ flex: 1 }}>
                      <span className="font-body sb-notify-label">Sync service reminders to calendar</span>
                      <span className="font-mono sb-notify-sub">
                        Adds an "Add to calendar" option on each bike so reminders show up in your phone's calendar app
                      </span>
                    </div>
                    <div className={`sb-toggle-switch ${calendarSyncEnabled ? "sb-toggle-switch-on" : ""}`}>
                      <div className="sb-toggle-knob" />
                    </div>
                  </div>
                  {calendarSyncEnabled && (
                    <div className="sb-notify-active-badge font-mono">
                      <CheckCircle2 size={12} style={{ marginRight: 6, flexShrink: 0 }} />
                      Active — open any bike and tap "Add to calendar" to download the reminder
                    </div>
                  )}
                </>
              )}

              {isShop && activeShop && (
                <>
                  <label className="sb-label font-mono">PROFILE PICTURE</label>
                  <p className="sb-helper font-body" style={{ marginBottom: 12 }}>
                    Upload a photo or logo for your shop. Riders will see this in the shop directory and on your profile page.
                  </p>

                  {/* Current picture / upload area */}
                  {getShopAvatar(activeShop.id)?.imageDataUrl ? (
                    <div className="sb-upload-preview">
                      <img
                        src={getShopAvatar(activeShop.id).imageDataUrl}
                        alt="Shop profile"
                        style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--gold)", flexShrink: 0 }}
                      />
                      <div className="sb-upload-preview-text">
                        <span className="font-body" style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 4 }}>
                          {getShopAvatar(activeShop.id).fileName || "Profile picture"}
                        </span>
                        <span className="font-mono" style={{ fontSize: 10, color: "var(--verified)", display: "block", marginBottom: 8 }}>✓ Visible to riders</span>
                        <label className="sb-upload-change-btn font-mono">
                          Change photo
                          <input type="file" accept="image/*" style={{ display: "none" }}
                            onChange={(e) => handleShopImageUpload(activeShop.id, e.target.files[0])} />
                        </label>
                        <button className="sb-upload-remove-btn font-mono"
                          onClick={() => { setShopAvatars((prev) => { const n = { ...prev }; delete n[activeShop.id]; return n; }); showToast("Profile picture removed"); }}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="sb-upload-dropzone">
                      <input type="file" accept="image/*" style={{ display: "none" }}
                        onChange={(e) => handleShopImageUpload(activeShop.id, e.target.files[0])} />
                      <div className="sb-upload-dropzone-inner">
                        <div className="sb-upload-icon">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                          </svg>
                        </div>
                        <span className="font-body sb-upload-label">Tap to upload a photo or logo</span>
                        <span className="font-mono sb-upload-hint">JPG, PNG or GIF · max 5 MB</span>
                      </div>
                    </label>
                  )}

                  {/* Colour fallback */}
                  {!getShopAvatar(activeShop.id)?.imageDataUrl && (
                    <>
                      <p className="sb-helper font-body" style={{ marginTop: 16, marginBottom: 8 }}>
                        No photo yet? Choose a profile colour to use in the meantime.
                      </p>
                      <div className="sb-avatar-color-grid">
                        {SHOP_AVATAR_COLORS.map((c) => {
                          const current = getShopAvatar(activeShop.id);
                          const isActive = current?.bg === c.bg;
                          return (
                            <button key={c.bg}
                              className={`sb-avatar-color-swatch ${isActive ? "sb-avatar-color-swatch-active" : ""}`}
                              style={{ background: c.bg }} title={c.label}
                              onClick={() => setShopAvatar(activeShop.id, c)}>
                              {isActive && <CheckCircle2 size={14} style={{ color: "var(--gold-light)" }} />}
                            </button>
                          );
                        })}
                        <button
                          className={`sb-avatar-color-swatch ${!getShopAvatar(activeShop.id) ? "sb-avatar-color-swatch-active" : ""}`}
                          style={{ background: "var(--steel)" }} title="Default"
                          onClick={() => setShopAvatars((prev) => { const n = { ...prev }; delete n[activeShop.id]; return n; })}>
                          {!getShopAvatar(activeShop.id) && <CheckCircle2 size={14} style={{ color: "var(--gold-light)" }} />}
                        </button>
                      </div>
                    </>
                  )}

                  {/* Preview row when a colour is set */}
                  {getShopAvatar(activeShop.id)?.bg && !getShopAvatar(activeShop.id)?.imageDataUrl && (
                    <div className="sb-avatar-preview">
                      <ShopAvatar shop={activeShop} size={44} fontSize={18} />
                      <div>
                        <span className="font-display" style={{ fontSize: 14, display: "block" }}>{activeShop.name}</span>
                        <span className="font-mono" style={{ fontSize: 10, color: "var(--muted)" }}>
                          {getShopAvatar(activeShop.id)?.label} · Visible to riders
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {menuView === "suggestion" && (() => {
            const q = suggestionSearch.trim().toLowerCase();
            const filtered = q
              ? suggestions.filter((s) => s.text.toLowerCase().includes(q))
              : suggestions;
            const sorted = [...filtered].sort((a, b) => b.votes - a.votes);
            const noMatches = q.length > 0 && sorted.length === 0;

            return (
              <div className="sb-menu-body" style={{ paddingBottom: 90 }}>
                <p className="sb-helper font-body">
                  See what other riders and shops want next, and upvote the ideas you'd love too.
                </p>
                <div className="sb-shop-search-field" style={{ marginBottom: 14 }}>
                  <Search size={14} className="sb-shop-search-icon" />
                  <input
                    className="sb-shop-search-input font-body"
                    placeholder="Search suggestions…"
                    value={suggestionSearch}
                    onChange={(e) => setSuggestionSearch(e.target.value)}
                  />
                  {suggestionSearch && (
                    <button className="sb-shop-search-clear" onClick={() => setSuggestionSearch("")}>
                      <X size={13} />
                    </button>
                  )}
                </div>

                {noMatches && (
                  <p className="sb-helper font-body" style={{ marginBottom: 10 }}>
                    No matching suggestions yet — be the first to add it.
                  </p>
                )}

                <div className="sb-suggestion-list">
                  {sorted.map((s) => {
                    const voted = mySuggestionVotes.includes(s.id);
                    return (
                      <div key={s.id} className="sb-suggestion-row">
                        <button
                          className={`sb-upvote-btn ${voted ? "sb-upvote-btn-active" : ""}`}
                          onClick={() => toggleSuggestionVote(s.id)}
                        >
                          <ChevronUp size={15} />
                          <span className="font-mono">{s.votes}</span>
                        </button>
                        <div className="sb-suggestion-text">
                          <span className="font-body sb-suggestion-body">{s.text}</span>
                          <span className="font-mono sb-suggestion-meta">{s.author} · {formatDate(s.ts)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  className="sb-btn sb-btn-outline sb-btn-block"
                  style={{ marginTop: 16 }}
                  onClick={() => {
                    setSuggestionText(suggestionSearch.trim());
                    setMenuView("suggestion-new");
                  }}
                >
                  <Plus size={15} style={{ marginRight: 8 }} />
                  {noMatches ? "Create New" : "Suggest something new"}
                </button>
              </div>
            );
          })()}

          {menuView === "suggestion-new" && (
            <div className="sb-menu-body">
              <p className="sb-helper font-body">
                Add your idea to the public list. Other riders and shops will be able to see and upvote it.
              </p>
              <label className="sb-label font-mono">YOUR SUGGESTION</label>
              <textarea
                className="sb-input sb-textarea font-body"
                rows={5}
                value={suggestionText}
                onChange={(e) => setSuggestionText(e.target.value)}
                placeholder="e.g. I'd love a dark mode, or the transfer flow confused me when..."
                autoFocus
              />
              <button
                className="sb-btn sb-btn-primary sb-btn-block"
                style={{ marginTop: 14 }}
                onClick={submitSuggestion}
                disabled={!suggestionText.trim()}
              >
                <Send size={14} style={{ marginRight: 8 }} /> Add to suggestion list
              </button>
            </div>
          )}

          {menuView === "notifications" && (() => {
            const iconMap = {
              wear:     { Icon: AlertTriangle, color: "var(--alert)",    bg: "var(--alert-bg)"    },
              service:  { Icon: CheckCircle2,  color: "var(--verified)", bg: "var(--verified-bg)" },
              shop:     { Icon: Bell,          color: "var(--pending)",  bg: "var(--pending-bg)"  },
              message:  { Icon: MessageSquare, color: "var(--steel)",    bg: "var(--paper-dark)"  },
              transfer: { Icon: ArrowRightLeft,color: "var(--gold)",     bg: "var(--gold-subtle)" },
            };
            const alertList = isShop ? [] : notifications;
            const threadList = isShop ? getShopThreads(activeShop?.id) : getRiderThreads();

            return (
              <div className="sb-notif-panel">
                <div className="sb-notif-tabs">
                  <button className={`sb-notif-tab ${notifSubTab === "alerts" ? "sb-notif-tab-active" : ""}`} onClick={() => setNotifSubTab("alerts")}>
                    Alerts {!isShop && unreadCount > 0 && <span className="sb-notif-tab-dot" />}
                  </button>
                  <button className={`sb-notif-tab ${notifSubTab === "messages" ? "sb-notif-tab-active" : ""}`} onClick={() => setNotifSubTab("messages")}>
                    Messages {(isShop ? shopThreadUnread : riderThreadUnread) > 0 && <span className="sb-notif-tab-dot" />}
                  </button>
                </div>

                {notifSubTab === "alerts" && (
                  alertList.length === 0 ? (
                    <div className="sb-menu-body">
                      <EmptyState Icon={Bell} title="No alerts yet" body={isShop ? "Wear and service alerts will appear here." : "Wear alerts, service confirmations and transfers will appear here."} />
                    </div>
                  ) : (
                    <div className="sb-notif-list">
                      {alertList.map((n) => {
                        const { Icon, color, bg } = iconMap[n.type] || iconMap.service;
                        return (
                          <div key={n.id} className={`sb-notif-item ${!n.read ? "sb-notif-unread" : ""}`}>
                            <div className="sb-notif-icon" style={{ background: bg, color }}>
                              <Icon size={14} />
                            </div>
                            <div className="sb-notif-text">
                              <span className="font-display sb-notif-title">{n.title}</span>
                              <span className="font-body sb-notif-body">{n.body}</span>
                              <span className="font-mono sb-notif-date">{formatDate(n.ts)}</span>
                            </div>
                            {!n.read && <span className="sb-notif-dot" />}
                          </div>
                        );
                      })}
                    </div>
                  )
                )}

                {notifSubTab === "messages" && (
                  threadList.length === 0 ? (
                    <div className="sb-menu-body">
                      <EmptyState Icon={MessageSquare} title="No conversations yet" body={isShop ? "Messages from riders will appear here as threads." : "Message your preferred shop from any component to start a conversation."} />
                    </div>
                  ) : (
                    <div className="sb-thread-list">
                      {threadList.map((t) => {
                        const lastMsg = t.messages[t.messages.length - 1];
                        const unread = threadUnread(t, isShop ? "shop" : "rider");
                        const shop = getAllShops().find(s => s.id === t.shopId);
                        const counterpartName = isShop ? t.riderName : shop?.name;
                        return (
                          <button
                            key={t.tid}
                            className={`sb-thread-row ${unread > 0 ? "sb-thread-row-unread" : ""}`}
                            onClick={() => { markThreadRead(t.tid, isShop ? "shop" : "rider"); setActiveThreadId(t.tid); setMenuView("thread"); }}
                          >
                            {isShop ? (
                              <div className="sb-menu-avatar" style={{ width: 38, height: 38, fontSize: 15 }}>
                                {(t.riderName || "?")[0].toUpperCase()}
                              </div>
                            ) : shop ? (
                              <ShopAvatar shop={shop} size={38} fontSize={15} />
                            ) : (
                              <div className="sb-menu-avatar" style={{ width: 38, height: 38 }}><Store size={16} /></div>
                            )}
                            <div className="sb-thread-row-text">
                              <div className="sb-thread-row-top">
                                <span className="font-display sb-thread-row-name">{counterpartName}</span>
                                <span className="font-mono sb-thread-row-date">{lastMsg ? formatDate(lastMsg.ts) : ""}</span>
                              </div>
                              <span className="font-body sb-thread-row-preview">
                                {lastMsg?.sender === "shop" && isShop ? "You: " : lastMsg?.sender === "rider" && !isShop ? "You: " : ""}
                                {lastMsg?.text}
                              </span>
                              {lastMsg?.compType && (
                                <span className="font-mono sb-thread-row-comp">Re: {lastMsg.compType}</span>
                              )}
                            </div>
                            {unread > 0 && <span className="sb-notif-dot" style={{ position: "static", flexShrink: 0 }} />}
                          </button>
                        );
                      })}
                    </div>
                  )
                )}
              </div>
            );
          })()}

          {menuView === "thread" && activeThreadId && (() => {
            const thread = messageThreads[activeThreadId];
            if (!thread) return <div className="sb-menu-body"><EmptyState Icon={MessageSquare} title="Conversation not found" body="This thread may have been removed." /></div>;
            const shop = getAllShops().find(s => s.id === thread.shopId);
            return (
              <div className="sb-thread-detail">
                <div className="sb-thread-messages">
                  {thread.messages.map((m) => {
                    const fromMe = isShop ? m.sender === "shop" : m.sender === "rider";
                    return (
                      <div key={m.id} className={`sb-bubble-row ${fromMe ? "sb-bubble-row-me" : ""}`}>
                        <div className={`sb-bubble ${fromMe ? "sb-bubble-me" : "sb-bubble-them"}`}>
                          {m.compType && (
                            <div className="sb-bubble-comp-card">
                              <div className="sb-notif-comp-top">
                                <span className="font-display sb-notif-comp-type">{m.compType}</span>
                                {m.compPct !== null && m.compPct !== undefined && (
                                  <span className="font-mono sb-notif-comp-pct" style={{ color: m.compPct >= 90 ? "var(--alert)" : m.compPct >= 65 ? "var(--pending)" : "var(--verified)" }}>
                                    {m.compPct}% worn
                                  </span>
                                )}
                              </div>
                              <span className="font-mono sb-notif-comp-meta">
                                {m.compBrand} {m.compModel}{m.bikeLabel ? ` · ${m.bikeLabel}` : ""}
                              </span>
                              {m.compKm != null && m.compMaxKm != null && (
                                <span className="font-mono sb-notif-comp-meta">{m.compKm} / {m.compMaxKm} km</span>
                              )}
                            </div>
                          )}
                          <span className="font-body sb-bubble-text">{m.text}</span>
                          <span className="font-mono sb-bubble-time">{formatDate(m.ts)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="sb-thread-input-row">
                  <textarea
                    className="sb-input sb-textarea font-body sb-thread-input"
                    rows={2}
                    value={threadReplyDraft}
                    onChange={(e) => setThreadReplyDraft(e.target.value)}
                    placeholder={isShop ? `Reply to ${thread.riderName || "rider"}…` : `Message ${shop?.name || "shop"}…`}
                  />
                  <button
                    className="sb-thread-send-btn"
                    disabled={!threadReplyDraft.trim()}
                    onClick={() => { sendThreadReply(activeThreadId, isShop ? "shop" : "rider", threadReplyDraft); setThreadReplyDraft(""); }}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </>
    );
  }

  function renderScreen() {
    switch (screen) {
      case "landing":
        return (
          <div className="sb-screen-pad sb-center-col">
            <div className="sb-brandmark">
              <Bike size={32} />
            </div>
            <div className="sb-wordmark-row">
              <Flourish size={14} />
              <h1 className="sb-wordmark font-display">SPOKEBOOK</h1>
              <Flourish size={14} />
            </div>
            <p className="sb-tagline font-body">
              Your bike's service record — written down, verified, never lost.
            </p>
            <div className="sb-landing-actions">
              <button className="sb-btn sb-btn-primary" onClick={() => { setSignInEmail(""); setSignInError(""); setScreen("signin"); }}>
                Sign in
              </button>
              <button className="sb-btn sb-btn-secondary" onClick={() => { setAuthMode("signup"); setScreen("auth-type"); }}>
                Create account
              </button>
            </div>
          </div>
        );

      case "signin":
        return (
          <>
            <TopBar title="Sign in" onBack={() => setScreen("landing")} />
            <div className="sb-screen-pad">
              <p className="sb-helper font-body">
                Enter your email address to continue. Your account type is detected automatically.
              </p>
              <label className="sb-label font-mono">EMAIL ADDRESS</label>
              <input
                className="sb-input font-body"
                type="email"
                value={signInEmail}
                onChange={(e) => { setSignInEmail(e.target.value); setSignInError(""); }}
                placeholder="e.g. jesse@example.com"
                onKeyDown={(e) => { if (e.key === "Enter") handleSignIn(); }}
                autoFocus
              />
              <label className="sb-label font-mono">PASSWORD</label>
              <div className="sb-password-field">
                <input
                  className="sb-input font-body"
                  type={showSignInPassword ? "text" : "password"}
                  value={signInPassword}
                  onChange={(e) => { setSignInPassword(e.target.value); setSignInError(""); }}
                  placeholder="Enter your password"
                  onKeyDown={(e) => { if (e.key === "Enter") handleSignIn(); }}
                />
                <button
                  type="button"
                  className="sb-password-toggle"
                  onClick={() => setShowSignInPassword(!showSignInPassword)}
                  aria-label={showSignInPassword ? "Hide password" : "Show password"}
                >
                  {showSignInPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p style={{ textAlign: "right", margin: "8px 0 0" }}>
                <button
                  style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer", font: "inherit", fontSize: 12, textDecoration: "underline", padding: 0, fontFamily: "'Inter',sans-serif" }}
                  onClick={() => { setForgotPasswordEmail(signInEmail); setForgotPasswordSent(false); setScreen("forgot-password"); }}
                >
                  Forgot password?
                </button>
              </p>
              {signInError && <p className="sb-error font-body" style={{ marginTop: 8 }}>{signInError}</p>}
              <button
                className="sb-btn sb-btn-primary sb-btn-block"
                style={{ marginTop: 18 }}
                onClick={handleSignIn}
                disabled={!signInEmail.trim() || !signInPassword.trim()}
              >
                Continue
              </button>
              <div className="sb-signin-hint">
                <p className="font-mono" style={{ fontSize: 10, color: "var(--muted)", marginBottom: 8, letterSpacing: "0.06em" }}>PROTOTYPE DEMO ACCOUNTS</p>
                <p className="font-mono" style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>Rider: any valid email + any password (e.g. <span style={{ color: "var(--ink)", cursor: "pointer", textDecoration: "underline" }} onClick={() => setSignInEmail("jesse@example.com")}>jesse@example.com</span>)</p>
                <p className="font-mono" style={{ fontSize: 11, color: "var(--muted)" }}>Shop: <span style={{ color: "var(--ink)", cursor: "pointer", textDecoration: "underline" }} onClick={() => setSignInEmail("hello@eastcitycycles.co.za")}>hello@eastcitycycles.co.za</span></p>
              </div>
              <p className="sb-helper font-body" style={{ textAlign: "center", marginTop: 20 }}>
                No account yet?{" "}
                <button style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer", font: "inherit", textDecoration: "underline", padding: 0 }}
                  onClick={() => { setAuthMode("signup"); setScreen("auth-type"); }}>
                  Create one
                </button>
              </p>
            </div>
          </>
        );

      case "forgot-password":
        return (
          <>
            <TopBar title="Reset password" onBack={() => setScreen("signin")} />
            <div className="sb-screen-pad">
              {forgotPasswordSent ? (
                <div className="sb-menu-sent" style={{ paddingTop: 40 }}>
                  <div className="sb-brandmark" style={{ marginBottom: 16, width: 56, height: 56 }}>
                    <Mail size={24} />
                  </div>
                  <span className="font-display" style={{ fontSize: 20 }}>Check your email</span>
                  <p className="sb-helper font-body" style={{ textAlign: "center", marginTop: 8, maxWidth: 280 }}>
                    If an account exists for <strong style={{ color: "var(--ink)" }}>{forgotPasswordEmail.trim().toLowerCase()}</strong>, a password reset link has been sent. The link will be valid for 60 minutes.
                  </p>
                  <button
                    className="sb-btn sb-btn-secondary"
                    style={{ marginTop: 24 }}
                    onClick={() => setScreen("signin")}
                  >
                    Back to sign in
                  </button>
                  <p className="sb-helper font-body" style={{ textAlign: "center", marginTop: 14 }}>
                    Didn't get it?{" "}
                    <button
                      style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer", font: "inherit", textDecoration: "underline", padding: 0 }}
                      onClick={() => setForgotPasswordSent(false)}
                    >
                      Try again
                    </button>
                  </p>
                </div>
              ) : (
                <>
                  <p className="sb-helper font-body">
                    Enter the email address linked to your account. We'll send a link to reset your password.
                  </p>
                  <label className="sb-label font-mono">EMAIL ADDRESS</label>
                  <input
                    className="sb-input font-body"
                    type="email"
                    value={forgotPasswordEmail}
                    onChange={(e) => { setForgotPasswordEmail(e.target.value); setForgotPasswordError(""); }}
                    placeholder="e.g. jesse@example.com"
                    onKeyDown={(e) => { if (e.key === "Enter") handleForgotPassword(); }}
                    autoFocus
                  />
                  {forgotPasswordError && <p className="sb-error font-body" style={{ marginTop: 8 }}>{forgotPasswordError}</p>}
                  <button
                    className="sb-btn sb-btn-primary sb-btn-block"
                    style={{ marginTop: 18 }}
                    onClick={handleForgotPassword}
                    disabled={!forgotPasswordEmail.trim()}
                  >
                    <Send size={14} style={{ marginRight: 8 }} /> Send reset link
                  </button>
                  <p className="sb-helper font-body" style={{ textAlign: "center", marginTop: 20 }}>
                    Remembered it?{" "}
                    <button
                      style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer", font: "inherit", textDecoration: "underline", padding: 0 }}
                      onClick={() => setScreen("signin")}
                    >
                      Back to sign in
                    </button>
                  </p>
                </>
              )}
            </div>
          </>
        );

      case "terms":
        return (
          <>
            <TopBar title="Terms & Conditions" onBack={() => setScreen(termsReturnScreen)} />
            <div className="sb-screen-pad">
              <div className="sb-terms-header">
                <FileText size={22} style={{ color: "var(--gold)", marginBottom: 8 }} />
                <p className="font-mono sb-terms-updated">Last updated {formatDate(new Date().toISOString().slice(0, 10))}</p>
              </div>
              {SPOKEBOOK_TERMS.map((section, i) => (
                <div key={i} className="sb-terms-section">
                  <h2 className="font-display sb-terms-heading">{section.heading}</h2>
                  <p className="font-body sb-terms-body">{section.body}</p>
                </div>
              ))}
              <button className="sb-btn sb-btn-secondary sb-btn-block" style={{ marginTop: 8, marginBottom: 20 }} onClick={() => setScreen(termsReturnScreen)}>
                Back
              </button>
            </div>
          </>
        );

      case "auth-type":
        return (
          <>
            <TopBar title="Create account" onBack={() => setScreen("landing")} />
            <div className="sb-screen-pad">
              <p className="sb-helper font-body" style={{ marginBottom: 24 }}>
                What type of account would you like to create?
              </p>
              <button className="sb-auth-type-card" onClick={() => setScreen("customer-auth")}>
                <div className="sb-auth-type-icon"><User size={22} /></div>
                <div className="sb-auth-type-text">
                  <span className="font-display sb-auth-type-label">Rider</span>
                  <span className="font-body sb-auth-type-desc">
                    Register your bikes, track services, and manage component wear
                  </span>
                </div>
                <ChevronRight size={18} className="sb-auth-type-arrow" />
              </button>
              <button className="sb-auth-type-card" onClick={() => setScreen("shop-auth")}>
                <div className="sb-auth-type-icon"><Store size={22} /></div>
                <div className="sb-auth-type-text">
                  <span className="font-display sb-auth-type-label">Bike Shop</span>
                  <span className="font-body sb-auth-type-desc">
                    Verify customer services, look up bike records, and manage your shop profile
                  </span>
                </div>
                <ChevronRight size={18} className="sb-auth-type-arrow" />
              </button>
              <p className="sb-helper font-body" style={{ textAlign: "center", marginTop: 20 }}>
                Already have an account?{" "}
                <button style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer", font: "inherit", textDecoration: "underline", padding: 0 }}
                  onClick={() => { setSignInEmail(""); setSignInError(""); setScreen("signin"); }}>
                  Sign in
                </button>
              </p>
            </div>
          </>
        );

      case "customer-auth":
        return (
          <>
            <TopBar title="Create your account" onBack={() => setScreen("auth-type")} />
            <div className="sb-screen-pad">
              <p className="sb-helper font-body">
                Prototype — enter any details to continue. In the real app this creates a secure account.
              </p>

              <label className="sb-label font-mono">FULL NAME</label>
              <input
                className="sb-input font-body"
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                placeholder="e.g. Jesse"
              />

              <label className="sb-label font-mono">EMAIL ADDRESS</label>
              <input
                className="sb-input font-body"
                type="email"
                value={emailDraft}
                onChange={(e) => setEmailDraft(e.target.value)}
                placeholder="e.g. jesse@example.com"
              />
              <p className="sb-helper font-body" style={{ marginTop: 6 }}>
                We'll send a welcome email and use this for service notifications.
              </p>

              <label className="sb-label font-mono">PASSWORD</label>
              <div className="sb-password-field">
                <input
                  className="sb-input font-body"
                  type={showPasswordDraft ? "text" : "password"}
                  value={passwordDraft}
                  onChange={(e) => setPasswordDraft(e.target.value)}
                  placeholder="Create a password"
                  onKeyDown={(e) => { if (e.key === "Enter") handleCustomerLogin(); }}
                />
                <button
                  type="button"
                  className="sb-password-toggle"
                  onClick={() => setShowPasswordDraft(!showPasswordDraft)}
                  aria-label={showPasswordDraft ? "Hide password" : "Show password"}
                >
                  {showPasswordDraft ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="sb-helper font-body" style={{ marginTop: 6 }}>
                Use at least 8 characters. In the real app this is securely encrypted.
              </p>

              <label className="sb-label font-mono">PREFERRED BIKE SHOP <span style={{ color: "var(--muted)", fontWeight: 400 }}>(optional)</span></label>
              <p className="sb-helper font-body" style={{ marginBottom: 10 }}>
                Your preferred shop can be notified automatically when your components are nearing their service limit.
              </p>
              {renderShopSearch({ label: "", sublabel: "", compact: true })}

              <button
                className="sb-terms-checkbox-row"
                onClick={() => setRiderTermsAccepted(!riderTermsAccepted)}
                style={{ marginTop: 22 }}
              >
                {riderTermsAccepted ? <CheckSquare size={18} style={{ color: "var(--gold)" }} /> : <Square size={18} style={{ color: "var(--muted)" }} />}
                <span className="font-body sb-terms-checkbox-text">
                  I have read and agree to the{" "}
                  <span
                    className="sb-terms-link"
                    onClick={(e) => { e.stopPropagation(); setTermsReturnScreen("customer-auth"); setScreen("terms"); }}
                  >
                    Terms &amp; Conditions
                  </span>
                </span>
              </button>

              <button
                className="sb-btn sb-btn-primary sb-btn-block"
                style={{ marginTop: 14 }}
                onClick={handleCustomerLogin}
                disabled={!nameDraft.trim() || !emailDraft.trim() || !passwordDraft.trim() || !riderTermsAccepted}
              >
                Create account &amp; continue
              </button>
            </div>
          </>
        );

      case "shop-auth":
        return (
          <>
            <TopBar title="Register your shop" onBack={() => setScreen("auth-type")} />
            <div className="sb-screen-pad">
              <p className="sb-helper font-body">
                Select your shop from the list, then complete your shop's details. This is what riders will see when searching for a shop.
              </p>
              {SHOPS.map((s) => (
                <button
                  key={s.id}
                  className={`sb-shop-select ${shopAuthSelectedId === s.id ? "sb-shop-select-active" : ""}`}
                  onClick={() => {
                    setShopAuthSelectedId(s.id);
                    setShopSignupForm({ address: "", area: "", specialties: "" });
                  }}
                >
                  <span className="sb-shop-select-icon">
                    {shopAuthSelectedId === s.id
                      ? <CheckCircle2 size={18} style={{ color: "var(--gold-light)" }} />
                      : <Store size={18} />}
                  </span>
                  <span className="sb-shop-select-text">
                    <span className="font-display sb-shop-select-name">{s.name}</span>
                    <span className="font-mono sb-shop-select-area">{s.email}</span>
                  </span>
                </button>
              ))}

              {!shopAuthSelectedId && (
                <button
                  className="sb-shop-not-listed"
                  onClick={() => { setNewShopForm({ name: "", email: "", address: "", area: "", specialties: "" }); setNewShopError(""); setShopAuthPassword(""); setScreen("shop-signup-new"); }}
                >
                  <Plus size={15} style={{ marginRight: 8 }} />
                  Can't find your shop? Add it
                </button>
              )}

              {shopAuthSelectedId && (
                <>
                  <p className="sb-helper font-body" style={{ marginTop: 18 }}>
                    Please enter your shop's details manually — this ensures your listing is accurate for riders.
                  </p>

                  <label className="sb-label font-mono">SHOP ADDRESS</label>
                  <input
                    className="sb-input font-body"
                    value={shopSignupForm.address}
                    onChange={(e) => setShopSignupForm({ ...shopSignupForm, address: e.target.value })}
                    placeholder="e.g. 142 Lower Main Road, Observatory, Cape Town, 7925"
                  />
                  <p className="sb-helper font-body" style={{ marginTop: 6 }}>
                    Your full street address. This is shown to riders searching for a shop.
                  </p>

                  <label className="sb-label font-mono">AREA / SUBURB</label>
                  <input
                    className="sb-input font-body"
                    value={shopSignupForm.area}
                    onChange={(e) => setShopSignupForm({ ...shopSignupForm, area: e.target.value })}
                    placeholder="e.g. Observatory, Cape Town"
                  />

                  <label className="sb-label font-mono">SPECIALITIES</label>
                  <input
                    className="sb-input font-body"
                    value={shopSignupForm.specialties}
                    onChange={(e) => setShopSignupForm({ ...shopSignupForm, specialties: e.target.value })}
                    placeholder="e.g. Road bikes, Wheel building, Bike fitting"
                  />
                  <p className="sb-helper font-body" style={{ marginTop: 6 }}>
                    Separate each speciality with a comma.
                  </p>

                  <label className="sb-label font-mono">CREATE A PASSWORD</label>
                  <div className="sb-password-field">
                    <input
                      className="sb-input font-body"
                      type={showShopAuthPassword ? "text" : "password"}
                      value={shopAuthPassword}
                      onChange={(e) => setShopAuthPassword(e.target.value)}
                      placeholder="Create a password"
                      onKeyDown={(e) => { if (e.key === "Enter") submitShopSignup(); }}
                    />
                    <button
                      type="button"
                      className="sb-password-toggle"
                      onClick={() => setShowShopAuthPassword(!showShopAuthPassword)}
                      aria-label={showShopAuthPassword ? "Hide password" : "Show password"}
                    >
                      {showShopAuthPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  <button
                    className="sb-terms-checkbox-row"
                    onClick={() => setShopTermsAccepted(!shopTermsAccepted)}
                    style={{ marginTop: 16 }}
                  >
                    {shopTermsAccepted ? <CheckSquare size={18} style={{ color: "var(--gold)" }} /> : <Square size={18} style={{ color: "var(--muted)" }} />}
                    <span className="font-body sb-terms-checkbox-text">
                      I have read and agree to the{" "}
                      <span
                        className="sb-terms-link"
                        onClick={(e) => { e.stopPropagation(); setTermsReturnScreen("shop-auth"); setScreen("terms"); }}
                      >
                        Terms &amp; Conditions
                      </span>
                    </span>
                  </button>

                  <button
                    className="sb-btn sb-btn-primary sb-btn-block"
                    style={{ marginTop: 14 }}
                    onClick={submitShopSignup}
                    disabled={!shopSignupForm.address.trim() || !shopSignupForm.area.trim() || !shopSignupForm.specialties.trim() || !shopAuthPassword.trim() || !shopTermsAccepted}
                  >
                    Create shop account &amp; continue
                  </button>
                </>
              )}
            </div>
          </>
        );

      case "shop-signup-new":
        return (
          <>
            <TopBar title="Add your shop" onBack={() => setScreen("shop-auth")} />
            <div className="sb-screen-pad">
              <div className="sb-new-shop-intro">
                <div className="sb-brandmark" style={{ width: 44, height: 44, marginBottom: 10 }}>
                  <Store size={20} />
                </div>
                <p className="sb-helper font-body" style={{ margin: 0 }}>
                  Not seeing your shop on Spokebook yet? Register it here and it'll appear in the directory for riders to find, message, and verify services with straight away.
                </p>
              </div>

              <label className="sb-label font-mono">SHOP NAME</label>
              <input
                className="sb-input font-body"
                value={newShopForm.name}
                onChange={(e) => { setNewShopForm({ ...newShopForm, name: e.target.value }); setNewShopError(""); }}
                placeholder="e.g. Southside Bicycle Co."
              />

              <label className="sb-label font-mono">SHOP EMAIL</label>
              <input
                className="sb-input font-body"
                type="email"
                value={newShopForm.email}
                onChange={(e) => { setNewShopForm({ ...newShopForm, email: e.target.value }); setNewShopError(""); }}
                placeholder="e.g. hello@southsidebicycle.co.za"
              />
              <p className="sb-helper font-body" style={{ marginTop: 6 }}>
                You'll sign in with this email in future.
              </p>

              <label className="sb-label font-mono">SHOP ADDRESS</label>
              <input
                className="sb-input font-body"
                value={newShopForm.address}
                onChange={(e) => setNewShopForm({ ...newShopForm, address: e.target.value })}
                placeholder="e.g. 24 Main Road, Muizenberg, Cape Town, 7945"
              />
              <p className="sb-helper font-body" style={{ marginTop: 6 }}>
                Your full street address. Shown to riders searching for a shop.
              </p>

              <label className="sb-label font-mono">AREA / SUBURB</label>
              <input
                className="sb-input font-body"
                value={newShopForm.area}
                onChange={(e) => setNewShopForm({ ...newShopForm, area: e.target.value })}
                placeholder="e.g. Muizenberg, Cape Town"
              />

              <label className="sb-label font-mono">SPECIALITIES</label>
              <input
                className="sb-input font-body"
                value={newShopForm.specialties}
                onChange={(e) => setNewShopForm({ ...newShopForm, specialties: e.target.value })}
                placeholder="e.g. Road bikes, Repairs, Custom builds"
              />
              <p className="sb-helper font-body" style={{ marginTop: 6 }}>
                Separate each speciality with a comma.
              </p>

              <label className="sb-label font-mono">CREATE A PASSWORD</label>
              <div className="sb-password-field">
                <input
                  className="sb-input font-body"
                  type={showShopAuthPassword ? "text" : "password"}
                  value={shopAuthPassword}
                  onChange={(e) => setShopAuthPassword(e.target.value)}
                  placeholder="Create a password"
                  onKeyDown={(e) => { if (e.key === "Enter") submitNewShop(); }}
                />
                <button
                  type="button"
                  className="sb-password-toggle"
                  onClick={() => setShowShopAuthPassword(!showShopAuthPassword)}
                  aria-label={showShopAuthPassword ? "Hide password" : "Show password"}
                >
                  {showShopAuthPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {newShopError && <p className="sb-error font-body" style={{ marginTop: 8 }}>{newShopError}</p>}

              <button
                className="sb-terms-checkbox-row"
                onClick={() => setNewShopTermsAccepted(!newShopTermsAccepted)}
                style={{ marginTop: 14 }}
              >
                {newShopTermsAccepted ? <CheckSquare size={18} style={{ color: "var(--gold)" }} /> : <Square size={18} style={{ color: "var(--muted)" }} />}
                <span className="font-body sb-terms-checkbox-text">
                  I have read and agree to the{" "}
                  <span
                    className="sb-terms-link"
                    onClick={(e) => { e.stopPropagation(); setTermsReturnScreen("shop-signup-new"); setScreen("terms"); }}
                  >
                    Terms &amp; Conditions
                  </span>
                </span>
              </button>

              <button
                className="sb-btn sb-btn-primary sb-btn-block"
                style={{ marginTop: 14 }}
                onClick={submitNewShop}
                disabled={!newShopForm.name.trim() || !newShopForm.email.trim() || !newShopForm.address.trim() || !newShopForm.area.trim() || !newShopForm.specialties.trim() || !shopAuthPassword.trim() || !newShopTermsAccepted}
              >
                <Plus size={15} style={{ marginRight: 8 }} />
                Register shop &amp; continue
              </button>

              <p className="sb-helper font-body" style={{ textAlign: "center", marginTop: 18 }}>
                Already listed?{" "}
                <button
                  style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer", font: "inherit", textDecoration: "underline", padding: 0 }}
                  onClick={() => setScreen("shop-auth")}
                >
                  Choose from the list instead
                </button>
              </p>
            </div>
          </>
        );

      case "customer-home":
        return (
          <>
            <div className="sb-topbar">
              <span className="sb-iconbtn-spacer" />
              <h1 className="sb-topbar-title font-display">Hey, {customerName.split(" ")[0]}</h1>
              <button className="sb-iconbtn sb-iconbtn-badged" onClick={openMenu} aria-label="Menu">
                <Menu size={20} />
                {(unreadCount + riderThreadUnread) > 0 && <span className="sb-topbar-menu-badge" />}
              </button>
            </div>
            <div className="sb-screen-pad">
              <button className="sb-shop-finder" onClick={() => setScreen("shop-directory")}>
                <Search size={15} style={{ marginRight: 8 }} /> Find a verified shop nearby
              </button>
              <h2 className="sb-section-title font-mono">YOUR BIKES</h2>
              {bikes.length === 0 ? (
                <EmptyState Icon={Bike} title="No bikes yet" body="Register your first bike to start its service record." />
              ) : (
                bikes.map((b) => {
                  const info = getNextServiceInfo(b);
                  const TypeIcon = getBikeTypeMeta(b.bikeType).icon;
                  const alertCount = (b.components || []).filter((c) => {
                    const km = getComponentKm(c, b.stravaGearId);
                    return (km / c.maxKm) * 100 >= 65;
                  }).length;
                  return (
                    <button key={b.id} className="sb-bike-card" onClick={() => openBike(b.id)}>
                      <div className="sb-bike-card-icon">
                        <TypeIcon size={22} />
                        {b.isEbike && <span className="sb-ebike-badge"><Zap size={9} fill="currentColor" /></span>}
                        {alertCount > 0 && <span className="sb-bike-card-badge">{alertCount}</span>}
                      </div>
                      <div className="sb-bike-card-text">
                        <span className="font-display sb-bike-card-name">
                          {b.brand} {b.model}
                        </span>
                        <span className="font-mono sb-bike-card-id">{b.id}</span>
                      </div>
                      <ReminderBadge info={info} />
                    </button>
                  );
                })
              )}
              <div style={{ display:"flex", gap:8, marginTop:4 }}>
                <button className="sb-btn sb-btn-outline" style={{ flex:1 }} onClick={() => setScreen("add-bike")}>
                  <Plus size={15} style={{ marginRight: 7 }} /> New bike
                </button>
                <button className="sb-btn sb-btn-outline" style={{ flex:1 }} onClick={() => { setClaimInput(""); setClaimError(""); setScreen("claim-bike"); }}>
                  <ArrowRightLeft size={15} style={{ marginRight: 7 }} /> Claim transfer
                </button>
              </div>
            </div>
          </>
        );

      case "add-bike":
        return (
          <>
            <TopBar title="Register a bike" onBack={() => setScreen("customer-home")} />
            <div className="sb-screen-pad">
              <label className="sb-label font-mono">BRAND</label>
              <input
                className="sb-input font-body"
                value={draftBike.brand}
                onChange={(e) => setDraftBike({ ...draftBike, brand: e.target.value })}
                placeholder="e.g. Specialized"
              />
              <label className="sb-label font-mono">MODEL</label>
              <input
                className="sb-input font-body"
                value={draftBike.model}
                onChange={(e) => setDraftBike({ ...draftBike, model: e.target.value })}
                placeholder="e.g. Roubaix"
              />
              <label className="sb-label font-mono">BIKE TYPE</label>
              <div className="sb-chip-row">
                {BIKE_TYPES.map((t) => {
                  const TIcon = t.icon;
                  return (
                    <button
                      key={t.id}
                      className={`sb-chip ${draftBike.bikeType === t.id ? "sb-chip-active" : ""}`}
                      onClick={() => setDraftBike({ ...draftBike, bikeType: t.id })}
                    >
                      <TIcon size={14} style={{ marginRight: 6, verticalAlign: "-2px" }} />
                      {t.label}
                    </button>
                  );
                })}
              </div>

              <label className="sb-label font-mono">E-BIKE?</label>
              <div
                className={`sb-ebike-toggle ${draftBike.isEbike ? "sb-ebike-toggle-on" : ""}`}
                onClick={() => setDraftBike({ ...draftBike, isEbike: !draftBike.isEbike })}
              >
                <div className="sb-ebike-toggle-left">
                  <div className={`sb-ebike-icon ${draftBike.isEbike ? "sb-ebike-icon-on" : ""}`}>
                    <Zap size={16} />
                  </div>
                  <div>
                    <span className="font-body sb-notify-label">
                      {draftBike.isEbike
                        ? `E-${BIKE_TYPES.find(t => t.id === draftBike.bikeType)?.label || "Bike"}`
                        : "This is an e-bike"}
                    </span>
                    <span className="font-mono sb-notify-sub">
                      {draftBike.isEbike
                        ? "Motor-assisted — battery & motor components will be trackable"
                        : "Tap to mark as motor-assisted"}
                    </span>
                  </div>
                </div>
                <div className={`sb-toggle-switch ${draftBike.isEbike ? "sb-toggle-switch-on" : ""}`}>
                  <div className="sb-toggle-knob" />
                </div>
              </div>
              <label className="sb-label font-mono">SERIAL NUMBER</label>
              <input
                className="sb-input font-mono"
                style={{ textTransform: "uppercase" }}
                value={draftBike.serialNumber}
                onChange={(e) => setDraftBike({ ...draftBike, serialNumber: e.target.value })}
                placeholder="Usually stamped under the bottom bracket"
              />
              <label className="sb-label font-mono">FRAME COLOUR</label>
              <input
                className="sb-input font-body"
                value={draftBike.color}
                onChange={(e) => setDraftBike({ ...draftBike, color: e.target.value })}
                placeholder="e.g. Gloss Black"
              />
              <p className="sb-helper font-body" style={{ marginTop: 8 }}>
                A shop can confirm the type and serial number match the bike once it's registered.
              </p>
              <button
                className="sb-btn sb-btn-primary sb-btn-block"
                style={{ marginTop: 10 }}
                onClick={handleAddBike}
                disabled={!draftBike.brand.trim() || !draftBike.model.trim() || !draftBike.serialNumber.trim()}
              >
                Generate bike ID
              </button>
            </div>
          </>
        );

      case "bike-registered": {
        const newBike = bikes.find((b) => b.id === newBikeId);
        const newTypeMeta = newBike ? getBikeTypeMeta(newBike.bikeType) : null;
        const NewTypeIcon = newTypeMeta ? newTypeMeta.icon : Bike;
        return (
          <>
            <TopBar title="Bike registered" onBack={() => setScreen("customer-home")} />
            <div className="sb-screen-pad sb-center-col">
              <div className="sb-qr-wrap">
                <QRPattern seed={newBikeId || "x"} />
              </div>
              <span className="font-mono sb-bikeid-text">{newBikeId}</span>
              {newBike && (
                <div className="sb-detail-tags" style={{ justifyContent: "center" }}>
                  <span className="sb-detail-tag">
                    <NewTypeIcon size={13} />
                    <span className="font-mono">{getBikeLabel(newBike)}</span>
                  </span>
                  {newBike.isEbike && (
                    <span className="sb-detail-tag sb-detail-tag-ebike">
                      <Zap size={12} fill="currentColor" />
                      <span className="font-mono">Electric</span>
                    </span>
                  )}
                  <span className="sb-detail-tag">
                    <span className="font-mono">SN {newBike.serialNumber}</span>
                  </span>
                </div>
              )}
              <p className="sb-helper font-body" style={{ textAlign: "center" }}>
                This code is now linked to your bike. Show it to any shop on our network so they can pull up
                and verify its service history.
              </p>
              <button className="sb-btn sb-btn-primary sb-btn-block" onClick={() => setScreen("customer-home")}>
                Done
              </button>
            </div>
          </>
        );
      }

      case "bike-detail": {
        const detailTypeMeta = selectedBike ? getBikeTypeMeta(selectedBike.bikeType) : null;
        const DetailTypeIcon = detailTypeMeta ? detailTypeMeta.icon : Bike;
        return (
          <>
            <TopBar
              title={selectedBike ? `${selectedBike.brand} ${selectedBike.model}` : "Bike"}
              onBack={() => setScreen("customer-home")}
              right={
                selectedBike && (
                  <button className="sb-iconbtn" onClick={() => setScreen("export-preview")} aria-label="Export as PDF">
                    <FileDown size={18} />
                  </button>
                )
              }
            />
            {selectedBike && (
              <div className="sb-screen-pad" style={{ paddingBottom: 4 }}>
                <div className="sb-bike-detail-head">
                  <div>
                    <span className="font-mono sb-bike-detail-id">{selectedBike.id}</span>
                    <span className="font-body sb-bike-detail-meta">
                      {selectedBike.color} · Registered {formatDate(selectedBike.registeredOn)}
                    </span>
                  </div>
                  <div className="sb-qr-wrap sb-qr-wrap-small">
                    <QRPattern seed={selectedBike.id} size={15} cell={5} />
                  </div>
                </div>
                <div className="sb-detail-tags">
                  <span className="sb-detail-tag">
                    <DetailTypeIcon size={13} />
                    <span className="font-mono">{getBikeLabel(selectedBike)}</span>
                  </span>
                  {selectedBike.isEbike && (
                    <span className="sb-detail-tag sb-detail-tag-ebike">
                      <Zap size={12} fill="currentColor" />
                      <span className="font-mono">Electric</span>
                    </span>
                  )}
                  <span className="sb-detail-tag">
                    <span className="font-mono">SN {selectedBike.serialNumber}</span>
                  </span>
                  <span className={`sb-detail-tag ${selectedBike.detailsVerified ? "sb-detail-tag-verified" : ""}`}>
                    {selectedBike.detailsVerified ? <ShieldCheck size={13} /> : <Shield size={13} />}
                    <span className="font-mono">
                      {selectedBike.detailsVerified ? `Verified by ${selectedBike.detailsVerifiedBy}` : "Details not verified"}
                    </span>
                  </span>
                </div>
                <div className="sb-reminder-row">
                  <ReminderBadge info={getNextServiceInfo(selectedBike)} />
                  {selectedBike.serviceLog.length > 0 && calendarSyncEnabled && (
                    <button className="sb-calendar-sync-link font-mono" onClick={() => syncReminderToCalendar(selectedBike)}>
                      <CalendarPlus size={12} style={{ marginRight: 5 }} />
                      Add to calendar
                    </button>
                  )}
                </div>

                <div className="sb-strava-card">
                  {!stravaConnected ? (
                    <>
                      <div className="sb-strava-head">
                        <Activity size={15} />
                        <span className="font-display">Strava</span>
                      </div>
                      <p className="sb-helper font-body" style={{ margin: "0 0 12px" }}>
                        Connect Strava to automatically track this bike's mileage and recent rides.
                      </p>
                      <button
                        className="sb-btn sb-btn-strava sb-btn-block"
                        onClick={connectStrava}
                        disabled={connectingStrava}
                      >
                        <Activity size={14} style={{ marginRight: 8 }} />
                        {connectingStrava ? "Connecting…" : "Connect Strava"}
                      </button>
                    </>
                  ) : !selectedBike.stravaGearId ? (
                    <>
                      <div className="sb-strava-head">
                        <Activity size={15} />
                        <span className="font-display">Which Strava bike is this?</span>
                      </div>
                      {availableGearFor(selectedBike).length === 0 ? (
                        <p className="sb-helper font-body" style={{ margin: 0 }}>
                          All of your Strava bikes are already linked to other entries in Spokebook.
                        </p>
                      ) : (
                        availableGearFor(selectedBike).map((g) => (
                          <button
                            key={g.id}
                            className="sb-gear-option"
                            onClick={() => linkBikeToGear(selectedBike.id, g.id)}
                          >
                            {g.name}
                          </button>
                        ))
                      )}
                    </>
                  ) : (
                    (() => {
                      const m = getMileageInfo(selectedBike);
                      const rides = RIDES_BY_GEAR[selectedBike.stravaGearId] || [];
                      return (
                        <>
                          <div className="sb-strava-head">
                            <Activity size={15} />
                            <span className="font-display">Synced from Strava</span>
                            <button className="sb-strava-unlink font-mono" onClick={() => unlinkBikeFromGear(selectedBike.id)}>
                              Unlink
                            </button>
                          </div>
                          <div className="sb-strava-stats">
                            <div>
                              <span className="font-display sb-strava-stat-num">{m.totalKm}</span>
                              <span className="font-mono sb-strava-stat-label">TOTAL KM</span>
                            </div>
                            <div>
                              <span className="font-display sb-strava-stat-num">{m.rideCount}</span>
                              <span className="font-mono sb-strava-stat-label">RIDES</span>
                            </div>
                          </div>
                          <div className={`sb-reminder rb--${m.tone}`} style={{ marginBottom: 14 }}>
                            <Activity size={13} style={{ marginRight: 5, verticalAlign: "-2px" }} />
                            <span className="font-mono">{m.kmSince} km since last service</span>
                          </div>
                          <div className="sb-ride-list">
                            {rides.slice(0, 3).map((r) => (
                              <div key={r.id} className="sb-ride-item">
                                <div>
                                  <span className="font-body sb-ride-name">{r.name}</span>
                                  <span className="font-mono sb-ride-date">{formatDate(r.date)}</span>
                                </div>
                                <span className="font-mono sb-ride-distance">{r.distanceKm} km</span>
                              </div>
                            ))}
                          </div>
                        </>
                      );
                    })()
                  )}
                </div>

                <div className="sb-tabs">
                  <button className={`sb-tab ${bikeDetailTab === "history" ? "sb-tab-active" : ""}`} onClick={() => setBikeDetailTab("history")}>
                    <ClipboardList size={13} style={{ marginRight: 5 }} /> History
                  </button>
                  <button className={`sb-tab ${bikeDetailTab === "components" ? "sb-tab-active" : ""}`} onClick={() => setBikeDetailTab("components")}>
                    <Wrench size={13} style={{ marginRight: 5 }} /> Parts
                    {(selectedBike.components || []).filter((c) => (getComponentKm(c, selectedBike.stravaGearId) / c.maxKm) * 100 >= 65).length > 0 && (
                      <span className="sb-tab-alert">!</span>
                    )}
                  </button>
                  <button className={`sb-tab ${bikeDetailTab === "ownership" ? "sb-tab-active" : ""}`} onClick={() => setBikeDetailTab("ownership")}>
                    <History size={13} style={{ marginRight: 5 }} /> Ownership
                  </button>
                </div>

                {bikeDetailTab === "history" && (
                  <>
                    {selectedBike.serviceLog.length === 0 ? (
                      <EmptyState Icon={ClipboardList} title="Nothing logged yet" body="Add your first service to start this bike's record." />
                    ) : (
                      <div className="sb-tag-chain">
                        {[...selectedBike.serviceLog]
                          .sort((a, b) => new Date(b.date) - new Date(a.date))
                          .map((entry) => (
                            <ServiceTag key={entry.id} entry={entry} />
                          ))}
                      </div>
                    )}
                  </>
                )}

                {bikeDetailTab === "components" && (
                  <>
                    {(selectedBike.components || []).length === 0 ? (
                      <EmptyState Icon={Wrench} title="No components yet" body="Add your chain, tyres, brake pads and more to track wear automatically." />
                    ) : (
                      <div className="sb-comp-list">
                        {[...(selectedBike.components || [])]
                          .sort((a, b) => {
                            const pa = (getComponentKm(a, selectedBike.stravaGearId) / a.maxKm);
                            const pb = (getComponentKm(b, selectedBike.stravaGearId) / b.maxKm);
                            return pb - pa;
                          })
                          .map((comp) => (
                            <ComponentCard
                              key={comp.id}
                              comp={comp}
                              stravaGearId={selectedBike.stravaGearId}
                              onContact={preferredShopId ? () => openContactShop(selectedBike.id, comp) : null}
                            />
                          ))}
                      </div>
                    )}
                  </>
                )}

                {bikeDetailTab === "ownership" && (() => {
                  const log = selectedBike.ownershipLog || [];
                  return (
                    <div>
                      {selectedBike.transferPending && (
                        <div className="sb-transfer-pending">
                          <div className="sb-transfer-pending-head">
                            <Clock size={13} style={{ marginRight: 6 }} />
                            <span className="font-mono">Transfer in progress</span>
                          </div>
                          <p className="sb-helper font-body" style={{ margin:"6px 0 10px" }}>
                            Share the transfer code with the new owner. Once they claim it, the bike moves to their account.
                          </p>
                          <div className="sb-txcode-display font-mono">{selectedBike.transferCode}</div>
                          <button className="sb-btn sb-btn-secondary sb-btn-block" style={{ marginTop:10 }} onClick={() => cancelTransfer(selectedBike.id)}>
                            <XCircle size={14} style={{ marginRight:7 }} /> Cancel transfer
                          </button>
                        </div>
                      )}
                      <h2 className="sb-section-title font-mono">CHAIN OF CUSTODY</h2>
                      <div className="sb-ownership-chain">
                        {[...log].reverse().map((entry, i) => (
                          <div key={i} className={`sb-owner-entry ${i === 0 ? "sb-owner-current" : ""}`}>
                            <div className="sb-owner-dot" />
                            <div className="sb-owner-text">
                              <span className="font-display sb-owner-name">
                                {i === 0 ? `${entry.name} (current)` : entry.name}
                              </span>
                              <span className="font-mono sb-owner-meta">
                                {entry.type === "original" ? "First registered" : "Transferred"} · {formatDate(entry.date)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="sb-helper font-body" style={{ marginTop:16 }}>
                        This ownership history is verified and tamper-proof. Shops can view it when looking up your bike.
                      </p>
                      {!selectedBike.transferPending && (
                        <button className="sb-btn sb-btn-outline sb-btn-block" style={{ marginTop: 8 }} onClick={() => initiateTransfer(selectedBike.id)}>
                          <ArrowRightLeft size={14} style={{ marginRight: 8 }} /> Transfer this bike
                        </button>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
            <div className="sb-sticky-footer sb-footer-row">
              {selectedBike && !selectedBike.transferPending ? (
                <>
                  <button className="sb-btn sb-btn-secondary sb-btn-half" onClick={() => { setBikeDetailTab("components"); setCompForm({ type: COMPONENT_PRESETS[0].type, brand: "", model: "", baseKm: "", date: new Date().toISOString().slice(0, 10), maxKm: COMPONENT_PRESETS[0].maxKm }); setScreen("add-component"); }}>
                    <Plus size={15} style={{ marginRight: 6 }} /> Component
                  </button>
                  <button className="sb-btn sb-btn-primary sb-btn-half" onClick={openLogForm}>
                    <ClipboardList size={15} style={{ marginRight: 6 }} /> Log service
                  </button>
                </>
              ) : (
                <button className="sb-btn sb-btn-primary sb-btn-block" onClick={openLogForm}>
                  <ClipboardList size={15} style={{ marginRight: 6 }} /> Log service
                </button>
              )}
            </div>
          </>
        );
      }

      case "export-preview": {
        if (!selectedBike) {
          return (
            <>
              <TopBar title="Export report" onBack={() => setScreen("customer-home")} />
              <div className="sb-screen-pad"><EmptyState Icon={FileDown} title="No bike selected" body="Open a bike first to export its record." /></div>
            </>
          );
        }
        const bike = selectedBike;
        const typeMeta = getBikeTypeMeta(bike.bikeType);
        const servicesChrono = [...bike.serviceLog].sort((a, b) => new Date(a.date) - new Date(b.date));
        const componentsChrono = [...(bike.components || [])].sort((a, b) => new Date(a.installedOn) - new Date(b.installedOn));
        const serviceCostTotal = servicesChrono.reduce((sum, s) => sum + (Number(s.cost) || 0), 0);
        const componentCostTotal = componentsChrono.reduce((sum, c) => sum + (Number(c.cost) || 0), 0);
        const grandTotal = serviceCostTotal + componentCostTotal;
        const rand = (n) => `R${Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        return (
          <>
            <TopBar title="Export report" onBack={() => setScreen("bike-detail")} />
            <div className="sb-screen-pad sb-no-print">
              <p className="sb-helper font-body">
                Below is your full service history and component record for this bike, in chronological order. Tap the button to save it as a PDF.
              </p>
              <button className="sb-btn sb-btn-primary sb-btn-block" style={{ marginBottom: 20 }} onClick={() => window.print()}>
                <FileDown size={15} style={{ marginRight: 8 }} /> Download as PDF
              </button>
            </div>

            <div className="sb-export-report">
              <div className="sb-export-header">
                <div className="sb-wordmark-row" style={{ marginBottom: 6 }}>
                  <Flourish size={12} />
                  <h1 className="sb-wordmark font-display" style={{ fontSize: 24 }}>SPOKEBOOK</h1>
                  <Flourish size={12} />
                </div>
                <p className="font-mono sb-export-generated">Full record exported {formatDate(new Date().toISOString().slice(0, 10))}</p>
              </div>

              <div className="sb-export-bike-card">
                <span className="font-display sb-export-bike-name">{bike.brand} {bike.model}</span>
                <div className="sb-export-bike-meta-row">
                  <span className="font-mono">{bike.id}</span>
                  <span className="font-mono">SN {bike.serialNumber}</span>
                  <span className="font-mono">{getBikeLabel ? getBikeLabel(bike) : typeMeta.label}</span>
                  <span className="font-mono">{bike.color}</span>
                </div>
                <div className="sb-export-bike-meta-row">
                  <span className="font-mono">Owner: {bike.ownerName}</span>
                  <span className="font-mono">Registered {formatDate(bike.registeredOn)}</span>
                  {bike.detailsVerified && <span className="font-mono">Verified by {bike.detailsVerifiedBy}</span>}
                </div>
              </div>

              <h2 className="sb-export-section-title font-mono">SERVICE HISTORY — CHRONOLOGICAL</h2>
              {servicesChrono.length === 0 ? (
                <p className="sb-helper font-body">No services logged yet.</p>
              ) : (
                <table className="sb-export-table">
                  <thead>
                    <tr>
                      <th className="font-mono">DATE</th>
                      <th className="font-mono">TYPE</th>
                      <th className="font-mono">NOTES</th>
                      <th className="font-mono">STATUS</th>
                      <th className="font-mono" style={{ textAlign: "right" }}>COST</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicesChrono.map((s) => (
                      <tr key={s.id}>
                        <td className="font-mono">{formatDate(s.date)}</td>
                        <td className="font-display">{s.type}</td>
                        <td className="font-body">{s.notes}</td>
                        <td className="font-mono">
                          {s.status === "verified" ? `Verified${s.shopName ? ` · ${s.shopName}` : ""}` : s.status === "pending" ? "Awaiting confirmation" : "Logged by owner"}
                        </td>
                        <td className="font-mono" style={{ textAlign: "right" }}>{s.cost ? rand(s.cost) : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={4} className="font-mono" style={{ textAlign: "right" }}>Service total</td>
                      <td className="font-mono" style={{ textAlign: "right" }}>{rand(serviceCostTotal)}</td>
                    </tr>
                  </tfoot>
                </table>
              )}

              <h2 className="sb-export-section-title font-mono">COMPONENTS — CHRONOLOGICAL</h2>
              {componentsChrono.length === 0 ? (
                <p className="sb-helper font-body">No components logged yet.</p>
              ) : (
                <table className="sb-export-table">
                  <thead>
                    <tr>
                      <th className="font-mono">INSTALLED</th>
                      <th className="font-mono">TYPE</th>
                      <th className="font-mono">BRAND / MODEL</th>
                      <th className="font-mono">WEAR</th>
                      <th className="font-mono" style={{ textAlign: "right" }}>COST</th>
                    </tr>
                  </thead>
                  <tbody>
                    {componentsChrono.map((c) => {
                      const km = getComponentKm(c, bike.stravaGearId);
                      const pct = Math.round((km / c.maxKm) * 100);
                      return (
                        <tr key={c.id}>
                          <td className="font-mono">{formatDate(c.installedOn)}</td>
                          <td className="font-display">{c.type}</td>
                          <td className="font-body">{c.brand} {c.model}</td>
                          <td className="font-mono">{pct}% ({km}/{c.maxKm} km)</td>
                          <td className="font-mono" style={{ textAlign: "right" }}>{c.cost ? rand(c.cost) : "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={4} className="font-mono" style={{ textAlign: "right" }}>Components total</td>
                      <td className="font-mono" style={{ textAlign: "right" }}>{rand(componentCostTotal)}</td>
                    </tr>
                  </tfoot>
                </table>
              )}

              <div className="sb-export-grand-total">
                <span className="font-display">Total spent on record</span>
                <span className="font-mono sb-export-grand-total-amount">{rand(grandTotal)}</span>
              </div>

              <p className="font-mono sb-export-footer">
                Generated by Spokebook · {bike.id} · This record reflects services and components logged in the app and may not include work performed elsewhere.
              </p>
            </div>
          </>
        );
      }

      case "log-service":
        return (
          <>
            <TopBar title="Log a service" onBack={() => setScreen("bike-detail")} />
            <div className="sb-screen-pad">
              <label className="sb-label font-mono">SERVICE TYPE</label>
              <div className="sb-chip-row">
                {SERVICE_TYPES.map((t) => (
                  <button
                    key={t}
                    className={`sb-chip ${logForm.type === t ? "sb-chip-active" : ""}`}
                    onClick={() => setLogForm({ ...logForm, type: t })}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <label className="sb-label font-mono">DATE</label>
              <input
                type="date"
                className="sb-input font-body"
                value={logForm.date}
                onChange={(e) => setLogForm({ ...logForm, date: e.target.value })}
              />
              <label className="sb-label font-mono">WHO DID THE WORK?</label>
              <div className="sb-toggle-row">
                <button
                  className={`sb-toggle ${logForm.mode === "self" ? "sb-toggle-active" : ""}`}
                  onClick={() => setLogForm({ ...logForm, mode: "self" })}
                >
                  I did it myself
                </button>
                <button
                  className={`sb-toggle ${logForm.mode === "shop" ? "sb-toggle-active" : ""}`}
                  onClick={() => setLogForm({ ...logForm, mode: "shop" })}
                >
                  A shop did it
                </button>
              </div>
              {logForm.mode === "shop" && (
                <>
                  <label className="sb-label font-mono">SHOP</label>
                  <select
                    className="sb-input font-body"
                    value={logForm.shopId}
                    onChange={(e) => setLogForm({ ...logForm, shopId: e.target.value })}
                  >
                    {getAllShops().map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <p className="sb-helper font-body" style={{ marginTop: 8 }}>
                    This entry will show as "awaiting confirmation" until {getAllShops().find((s) => s.id === logForm.shopId)?.name}{" "}
                    verifies it.
                  </p>
                </>
              )}
              <label className="sb-label font-mono">NOTES</label>
              <textarea
                className="sb-input sb-textarea font-body"
                rows={3}
                value={logForm.notes}
                onChange={(e) => setLogForm({ ...logForm, notes: e.target.value })}
                placeholder="What was done?"
              />
              <label className="sb-label font-mono">COST <span style={{ color: "var(--muted)", fontWeight: 400 }}>(optional)</span></label>
              <div className="sb-currency-field">
                <span className="sb-currency-prefix font-mono">R</span>
                <input
                  className="sb-input font-body sb-currency-input"
                  type="number"
                  min="0"
                  step="1"
                  inputMode="decimal"
                  value={logForm.cost}
                  onChange={(e) => setLogForm({ ...logForm, cost: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <button className="sb-btn sb-btn-primary sb-btn-block" style={{ marginTop: 18 }} onClick={submitLog}>
                Save service log
              </button>
            </div>
          </>
        );

      case "shop-directory":
        return (
          <>
            <TopBar title="Verified shops" onBack={() => setScreen("customer-home")} />
            <div className="sb-screen-pad">
              {getAllShops().map((base) => {
                const s = getShopProfile(base.id);
                return (
                  <button
                    key={s.id}
                    className="sb-shop-list-item"
                    onClick={() => {
                      setProfileShop(s);
                      setScreen("shop-profile");
                    }}
                  >
                    <ShopAvatar shop={s} size={40} fontSize={15} />
                    <div className="sb-shop-list-text">
                      <span className="font-display sb-shop-list-name">{s.name}</span>
                      <span className="font-mono sb-shop-list-area">
                        <MapPin size={11} style={{ marginRight: 3, verticalAlign: "-1px" }} />
                        {s.area}
                      </span>
                      {s.address && (
                        <span className="font-mono sb-shop-list-address">{s.address}</span>
                      )}
                    </div>
                    <div className="sb-shop-list-rating font-mono">
                      {s.rating ? (
                        <>
                          <Star size={12} fill="currentColor" style={{ marginRight: 3, verticalAlign: "-1px" }} />
                          {s.rating}
                        </>
                      ) : (
                        <span className="sb-shop-new-badge">NEW</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        );

      case "shop-profile":
        return (
          <>
            <TopBar title={profileShop?.name || "Shop"} onBack={() => setScreen("shop-directory")} />
            {profileShop && (
              <div className="sb-screen-pad">
                <div className="sb-shop-profile-head">
                  <ShopAvatar shop={profileShop} size={64} fontSize={24} />
                  <div>
                    <span className="font-display" style={{ fontSize: 20, display: "block", marginBottom: 4 }}>{profileShop.name}</span>
                    <div className="sb-profile-rating font-mono" style={{ marginBottom: 4 }}>
                      {profileShop.rating ? (
                        <>
                          <Star size={12} fill="currentColor" style={{ marginRight: 4, verticalAlign: "-1px" }} />
                          {profileShop.rating} · {profileShop.reviews} reviews
                        </>
                      ) : (
                        <span className="sb-shop-new-badge">NEW TO SPOKEBOOK</span>
                      )}
                    </div>
                    <p className="font-mono sb-profile-area" style={{ margin: 0 }}>
                      <MapPin size={12} style={{ marginRight: 3, verticalAlign: "-2px" }} />
                      {profileShop.area}
                    </p>
                    {profileShop.address && (
                      <p className="font-mono sb-profile-address" style={{ margin: "4px 0 0" }}>
                        {profileShop.address}
                      </p>
                    )}
                  </div>
                </div>
                <h2 className="sb-section-title font-mono" style={{ marginTop: 20 }}>SPECIALITIES</h2>
                <div className="sb-chip-row">
                  {profileShop.specialties.map((sp) => (
                    <span key={sp} className="sb-chip sb-chip-static">{sp}</span>
                  ))}
                </div>
                <p className="sb-helper font-body" style={{ marginTop: 16 }}>
                  To get this shop to verify a service, select it from the "Log a service" screen on any of
                  your bikes.
                </p>
              </div>
            )}
          </>
        );

      case "shop-dashboard":
        return (
          <>
            <div className="sb-topbar">
              <span className="sb-iconbtn-spacer" />
              <h1 className="sb-topbar-title font-display">{activeShop?.name}</h1>
              <button className="sb-iconbtn sb-iconbtn-badged" onClick={openMenu} aria-label="Menu">
                <Menu size={20} />
                {shopThreadUnread > 0 && <span className="sb-topbar-menu-badge" />}
              </button>
            </div>
            <div className="sb-screen-pad">
              <h2 className="sb-section-title font-mono">LOOK UP A BIKE</h2>
              <p className="sb-helper font-body">Scan the rider's QR tag or enter their bike ID.</p>
              <div className="sb-lookup-row">
                <input
                  className="sb-input font-mono"
                  style={{ textTransform: "uppercase" }}
                  value={lookupInput}
                  onChange={(e) => {
                    setLookupInput(e.target.value);
                    setLookupError("");
                  }}
                  placeholder="SB-XXXX-XXXX"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleLookup();
                  }}
                />
                <button className="sb-iconbtn sb-iconbtn-filled" onClick={handleLookup} aria-label="Search">
                  <ScanLine size={18} />
                </button>
              </div>
              {lookupError && <p className="sb-error font-body">{lookupError}</p>}

              <h2 className="sb-section-title font-mono" style={{ marginTop: 28 }}>
                AWAITING YOUR CONFIRMATION ({pendingForShop.length})
              </h2>
              {pendingForShop.length === 0 ? (
                <EmptyState Icon={ShieldCheck} title="All caught up" body="No rider-submitted services are waiting on your confirmation." />
              ) : (
                pendingForShop.map((p) => (
                  <div key={p.id} className="sb-queue-item">
                    <div className="sb-queue-item-text">
                      <span className="font-display sb-queue-item-type">{p.type}</span>
                      <span className="font-mono sb-queue-item-meta">
                        {p.bikeLabel} · {formatDate(p.date)}
                      </span>
                      <p className="font-body sb-queue-item-notes">{p.notes}</p>
                    </div>
                    <button className="sb-btn sb-btn-primary sb-btn-small" onClick={() => verifyEntry(p.bikeId, p.id)}>
                      <CheckCircle2 size={14} style={{ marginRight: 6 }} />
                      Confirm
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        );

      case "shop-lookup-result": {
        const lookupTypeMeta = lookupBike ? getBikeTypeMeta(lookupBike.bikeType) : null;
        const LookupTypeIcon = lookupTypeMeta ? lookupTypeMeta.icon : Bike;
        const ownershipLog = lookupBike?.ownershipLog || [];
        const transferCount = Math.max(0, ownershipLog.length - 1);
        return (
          <>
            <TopBar title="Bike record" onBack={() => setScreen("shop-dashboard")} />
            {lookupBike && (
              <div className="sb-screen-pad" style={{ paddingBottom: 4 }}>

                {/* ── Bike header ── */}
                <div className="sb-bike-detail-head">
                  <div>
                    <span className="font-display sb-bike-card-name" style={{ display: "block", marginBottom: 4 }}>
                      {lookupBike.brand} {lookupBike.model}
                    </span>
                    <span className="font-mono sb-bike-detail-id">{lookupBike.id}</span>
                    <span className="font-body sb-bike-detail-meta">{lookupBike.color}</span>
                  </div>
                </div>

                {/* ── Chips row ── */}
                <div className="sb-detail-tags">
                  <span className="sb-detail-tag">
                    <LookupTypeIcon size={13} />
                    <span className="font-mono">{getBikeLabel(lookupBike)}</span>
                  </span>
                  {lookupBike.isEbike && (
                    <span className="sb-detail-tag sb-detail-tag-ebike">
                      <Zap size={12} fill="currentColor" />
                      <span className="font-mono">Electric</span>
                    </span>
                  )}
                  <span className="sb-detail-tag">
                    <span className="font-mono">SN {lookupBike.serialNumber}</span>
                  </span>
                  <span className={`sb-detail-tag ${lookupBike.detailsVerified ? "sb-detail-tag-verified" : ""}`}>
                    {lookupBike.detailsVerified ? <ShieldCheck size={13} /> : <Shield size={13} />}
                    <span className="font-mono">
                      {lookupBike.detailsVerified ? `Verified by ${lookupBike.detailsVerifiedBy}` : "Details not verified"}
                    </span>
                  </span>
                </div>

                {/* ── Verify details CTA ── */}
                {!lookupBike.detailsVerified && (
                  <button
                    className="sb-btn sb-btn-secondary sb-btn-small sb-btn-block"
                    style={{ marginBottom: 20 }}
                    onClick={() => verifyBikeDetails(lookupBike.id)}
                  >
                    <ShieldCheck size={14} style={{ marginRight: 6 }} />
                    Verify type &amp; serial number
                  </button>
                )}

                {/* ══ OWNERSHIP ══ */}
                <h2 className="sb-section-title font-mono">OWNERSHIP</h2>

                {/* Current owner card */}
                <div className="sb-shop-owner-card">
                  <div className="sb-shop-owner-avatar font-display">
                    {(lookupBike.ownerName || "?")[0].toUpperCase()}
                  </div>
                  <div className="sb-shop-owner-text">
                    <span className="font-display sb-shop-owner-name">{lookupBike.ownerName}</span>
                    <span className="font-mono sb-shop-owner-since">
                      Current owner · since {ownershipLog.length ? formatDate(ownershipLog[ownershipLog.length - 1].date) : formatDate(lookupBike.registeredOn)}
                    </span>
                  </div>
                  <span className={`sb-detail-tag ${lookupBike.transferPending ? "sb-detail-tag-pending-tx" : ""}`} style={{ flexShrink: 0 }}>
                    <span className="font-mono" style={{ fontSize: 10 }}>
                      {lookupBike.transferPending ? "⚠ Transfer pending" : `${transferCount} transfer${transferCount !== 1 ? "s" : ""}`}
                    </span>
                  </span>
                </div>

                {/* Chain of custody timeline */}
                {ownershipLog.length > 0 && (
                  <>
                    <h2 className="sb-section-title font-mono" style={{ marginTop: 18 }}>CHAIN OF CUSTODY</h2>
                    <div className="sb-ownership-chain">
                      {[...ownershipLog].reverse().map((entry, i) => (
                        <div key={i} className={`sb-owner-entry ${i === 0 ? "sb-owner-current" : ""}`}>
                          <div className="sb-owner-dot" />
                          <div className="sb-owner-text">
                            <span className="font-display sb-owner-name">
                              {entry.name}{i === 0 ? " — current owner" : ""}
                            </span>
                            <span className="font-mono sb-owner-meta">
                              {entry.type === "original" ? "First registered" : "Transferred"} · {formatDate(entry.date)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <div className="sb-section-divider" />

                {/* ══ SERVICE HISTORY ══ */}
                <h2 className="sb-section-title font-mono">SERVICE HISTORY</h2>
                {lookupBike.serviceLog.length === 0 ? (
                  <EmptyState Icon={ClipboardList} title="No history yet" body="This bike has no logged services." />
                ) : (
                  <div className="sb-tag-chain">
                    {[...lookupBike.serviceLog]
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((entry) => (
                        <div key={entry.id}>
                          <ServiceTag entry={entry} />
                          {entry.status === "pending" && entry.shopName === activeShop?.name && (
                            <button
                              className="sb-btn sb-btn-primary sb-btn-small sb-btn-block"
                              style={{ marginTop: -6, marginBottom: 16 }}
                              onClick={() => verifyEntry(lookupBike.id, entry.id)}
                            >
                              <CheckCircle2 size={14} style={{ marginRight: 6 }} />
                              Confirm this service
                            </button>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
            <div className="sb-sticky-footer">
              <button className="sb-btn sb-btn-primary sb-btn-block" onClick={openShopAddForm}>
                <Plus size={16} style={{ marginRight: 8 }} /> Add a verified service
              </button>
            </div>
          </>
        );
      }

      case "shop-add-service":
        return (
          <>
            <TopBar title="Add verified service" onBack={() => setScreen("shop-lookup-result")} />
            <div className="sb-screen-pad">
              <label className="sb-label font-mono">SERVICE TYPE</label>
              <div className="sb-chip-row">
                {SERVICE_TYPES.map((t) => (
                  <button
                    key={t}
                    className={`sb-chip ${shopAddForm.type === t ? "sb-chip-active" : ""}`}
                    onClick={() => setShopAddForm({ ...shopAddForm, type: t })}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <label className="sb-label font-mono">DATE</label>
              <input
                type="date"
                className="sb-input font-body"
                value={shopAddForm.date}
                onChange={(e) => setShopAddForm({ ...shopAddForm, date: e.target.value })}
              />
              <label className="sb-label font-mono">NOTES</label>
              <textarea
                className="sb-input sb-textarea font-body"
                rows={3}
                value={shopAddForm.notes}
                onChange={(e) => setShopAddForm({ ...shopAddForm, notes: e.target.value })}
                placeholder="What was done?"
              />
              <p className="sb-helper font-body" style={{ marginTop: 10 }}>
                This will be added as already verified, signed under {activeShop?.name}.
              </p>
              <button className="sb-btn sb-btn-primary sb-btn-block" onClick={submitShopAddForm}>
                Save to bike's record
              </button>
            </div>
          </>
        );

      case "add-component": {
        const activePreset = COMPONENT_PRESETS.find((p) => p.type === compForm.type) || COMPONENT_PRESETS[0];
        return (
          <>
            <TopBar title="Add a component" onBack={() => setScreen("bike-detail")} />
            <div className="sb-screen-pad">
              <label className="sb-label font-mono">COMPONENT TYPE</label>
              <div className="sb-chip-row">
                {COMPONENT_PRESETS.map((p) => (
                  <button
                    key={p.type}
                    className={`sb-chip ${compForm.type === p.type ? "sb-chip-active" : ""}`}
                    onClick={() => setCompForm({ ...compForm, type: p.type, maxKm: p.maxKm })}
                  >
                    {p.type}
                  </button>
                ))}
              </div>

              {activePreset.range !== "Custom" && (
                <div className="sb-preset-card">
                  <div className="sb-preset-card-head">
                    <span className="font-display sb-preset-card-type">{activePreset.type}</span>
                    <span className="sb-preset-card-range font-mono">{activePreset.range}</span>
                  </div>
                  <p className="font-body sb-preset-card-desc">{activePreset.description}</p>
                  <p className="font-mono sb-preset-card-source">
                    Source: {activePreset.basis}
                  </p>
                </div>
              )}

              <label className="sb-label font-mono">BRAND</label>
              <input className="sb-input font-body" value={compForm.brand} onChange={(e) => setCompForm({ ...compForm, brand: e.target.value })} placeholder="e.g. Shimano" />
              <label className="sb-label font-mono">MODEL</label>
              <input className="sb-input font-body" value={compForm.model} onChange={(e) => setCompForm({ ...compForm, model: e.target.value })} placeholder="e.g. CN-HG601" />
              <label className="sb-label font-mono">INSTALLED ON</label>
              <input type="date" className="sb-input font-body" value={compForm.date} onChange={(e) => setCompForm({ ...compForm, date: e.target.value })} />
              <label className="sb-label font-mono">KM ALREADY ON THIS PART <span style={{ color: "var(--muted)", fontWeight: 400 }}>(if used)</span></label>
              <input type="number" className="sb-input font-body" value={compForm.baseKm} onChange={(e) => setCompForm({ ...compForm, baseKm: e.target.value })} placeholder="0" />
              <label className="sb-label font-mono">COST <span style={{ color: "var(--muted)", fontWeight: 400 }}>(optional)</span></label>
              <div className="sb-currency-field">
                <span className="sb-currency-prefix font-mono">R</span>
                <input
                  className="sb-input font-body sb-currency-input"
                  type="number"
                  min="0"
                  step="1"
                  inputMode="decimal"
                  value={compForm.cost}
                  onChange={(e) => setCompForm({ ...compForm, cost: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <label className="sb-label font-mono">
                SERVICE THRESHOLD (km)
                {activePreset.range !== "Custom" && (
                  <span style={{ color: "var(--gold)", fontWeight: 400, marginLeft: 6 }}>
                    · recommended {activePreset.maxKm.toLocaleString()} km
                  </span>
                )}
              </label>
              <input type="number" className="sb-input font-body" value={compForm.maxKm} onChange={(e) => setCompForm({ ...compForm, maxKm: e.target.value })} placeholder="e.g. 3000" />
              <p className="sb-helper font-body" style={{ marginTop: 6 }}>
                You can adjust the threshold to suit your riding style and conditions.
              </p>
              <button className="sb-btn sb-btn-primary sb-btn-block" style={{ marginTop: 14 }} onClick={submitAddComponent}>
                Add to this bike
              </button>
            </div>
          </>
        );
      }

      case "transfer-code": {
        const txBike = bikes.find((b) => b.id === transferBikeId);
        return (
          <>
            <TopBar title="Transfer ownership" onBack={() => { cancelTransfer(transferBikeId); }} />
            <div className="sb-screen-pad sb-center-col">
              {txBike && (
                <>
                  <div className="sb-brandmark" style={{ marginBottom: 16 }}>
                    <ArrowRightLeft size={24} />
                  </div>
                  <p className="sb-helper font-body" style={{ textAlign: "center", marginBottom: 6 }}>
                    Share this code with the new owner. They enter it under <strong>Claim transfer</strong> to accept the bike and its full history.
                  </p>
                  <div className="sb-txcode-display font-mono">{txBike.transferCode}</div>
                  <p className="sb-helper font-body" style={{ textAlign: "center", marginTop: 10 }}>
                    The code expires once claimed or cancelled. Your record shows the bike as pending transfer until then.
                  </p>
                  <button className="sb-btn sb-btn-secondary sb-btn-block" onClick={() => cancelTransfer(transferBikeId)}>
                    <XCircle size={14} style={{ marginRight: 7 }} /> Cancel transfer
                  </button>
                </>
              )}
            </div>
          </>
        );
      }

      case "claim-bike":
        return (
          <>
            <TopBar title="Claim a transferred bike" onBack={() => setScreen("customer-home")} />
            <div className="sb-screen-pad">
              <p className="sb-helper font-body">
                Enter the transfer code from the current owner. The bike's full service history and verified records will carry over to your account.
              </p>
              <label className="sb-label font-mono">TRANSFER CODE</label>
              <input
                className="sb-input font-mono"
                style={{ textTransform: "uppercase", letterSpacing: "0.12em" }}
                value={claimInput}
                onChange={(e) => { setClaimInput(e.target.value); setClaimError(""); }}
                placeholder="TX-XXXX-XXXX"
                onKeyDown={(e) => { if (e.key === "Enter") handleClaim(); }}
              />
              {claimError && <p className="sb-error font-body">{claimError}</p>}
              <button
                className="sb-btn sb-btn-primary sb-btn-block"
                style={{ marginTop: 18 }}
                onClick={handleClaim}
                disabled={!claimInput.trim()}
              >
                Look up bike
              </button>
              <p className="sb-helper font-body" style={{ marginTop: 14, textAlign: "center" }}>
                Try <strong style={{ fontFamily: "IBM Plex Mono" }}>TX-DEMO-CODE</strong> — the demo bike has a pending transfer waiting.
              </p>
            </div>
          </>
        );

      case "claim-confirm": {
        const claimBike = bikes.find((b) => b.id === claimBikeId);
        const claimTypeMeta = claimBike ? getBikeTypeMeta(claimBike.bikeType) : null;
        const ClaimTypeIcon = claimTypeMeta ? claimTypeMeta.icon : Bike;
        return (
          <>
            <TopBar title="Confirm transfer" onBack={() => setScreen("claim-bike")} />
            {claimBike && (
              <div className="sb-screen-pad">
                <div className="sb-claim-preview">
                  <div className="sb-claim-preview-head">
                    <div className="sb-bike-card-icon" style={{ width: 44, height: 44 }}>
                      <ClaimTypeIcon size={22} />
                    </div>
                    <div>
                      <span className="font-display" style={{ fontSize: 18, display: "block" }}>
                        {claimBike.brand} {claimBike.model}
                      </span>
                      <span className="font-mono" style={{ fontSize: 10, color: "var(--muted)" }}>{claimBike.id}</span>
                    </div>
                  </div>
                  <div className="sb-detail-tags" style={{ marginTop: 12 }}>
                    <span className="sb-detail-tag"><ClaimTypeIcon size={12} /><span className="font-mono">{claimTypeMeta.label}</span></span>
                    <span className="sb-detail-tag"><span className="font-mono">SN {claimBike.serialNumber}</span></span>
                    {claimBike.detailsVerified && (
                      <span className="sb-detail-tag sb-detail-tag-verified"><ShieldCheck size={12} /><span className="font-mono">Verified</span></span>
                    )}
                  </div>
                </div>
                <h2 className="sb-section-title font-mono" style={{ marginTop: 20 }}>WHAT TRANSFERS WITH THE BIKE</h2>
                <div className="sb-transfer-checklist">
                  <div className="sb-transfer-check"><CheckCircle2 size={14} style={{ color: "var(--verified)", marginRight: 10, flexShrink: 0 }} /><span className="font-body">Full service history ({claimBike.serviceLog.length} {claimBike.serviceLog.length === 1 ? "entry" : "entries"})</span></div>
                  <div className="sb-transfer-check"><CheckCircle2 size={14} style={{ color: "var(--verified)", marginRight: 10, flexShrink: 0 }} /><span className="font-body">Component wear records ({(claimBike.components || []).length} tracked parts)</span></div>
                  <div className="sb-transfer-check"><CheckCircle2 size={14} style={{ color: "var(--verified)", marginRight: 10, flexShrink: 0 }} /><span className="font-body">Ownership chain ({(claimBike.ownershipLog || []).length} previous {(claimBike.ownershipLog || []).length === 1 ? "owner" : "owners"})</span></div>
                  {claimBike.detailsVerified && <div className="sb-transfer-check"><CheckCircle2 size={14} style={{ color: "var(--verified)", marginRight: 10, flexShrink: 0 }} /><span className="font-body">Shop-verified serial number &amp; type</span></div>}
                </div>
                <button className="sb-btn sb-btn-primary sb-btn-block" style={{ marginTop: 24 }} onClick={acceptClaim}>
                  <UserCheck size={15} style={{ marginRight: 8 }} /> Accept &amp; transfer to my account
                </button>
                <button className="sb-btn sb-btn-secondary sb-btn-block" style={{ marginTop: 8 }} onClick={() => setScreen("claim-bike")}>
                  Back
                </button>
              </div>
            )}
          </>
        );
      }

      case "contact-shop": {
        const csBike = bikes.find(b => b.id === contactShopState.bikeId);
        const csShop = getAllShops().find(s => s.id === preferredShopId);
        const csComp = contactShopState.comp;
        return (
          <>
            <TopBar title="Message shop" onBack={() => { setScreen("bike-detail"); setBikeDetailTab("components"); }} />
            <div className="sb-screen-pad">
              {contactShopState.sent ? (
                <div className="sb-menu-sent" style={{ paddingTop: 40 }}>
                  <CheckCircle2 size={32} style={{ color: "var(--verified)", marginBottom: 14 }} />
                  <span className="font-display" style={{ fontSize: 20 }}>Message sent</span>
                  <p className="sb-helper font-body" style={{ textAlign: "center", marginTop: 8 }}>
                    {csShop?.name} will respond via email or phone.
                  </p>
                </div>
              ) : (
                <>
                  {/* Shop recipient */}
                  <label className="sb-label font-mono">TO</label>
                  {csShop ? (
                    <div className="sb-cs-recipient">
                      <ShopAvatar shop={csShop} size={36} fontSize={14} />
                      <div>
                        <span className="font-display" style={{ fontSize: 14, display: "block" }}>{csShop.name}</span>
                        <span className="font-mono" style={{ fontSize: 10, color: "var(--muted)" }}>{csShop.area} · Preferred shop</span>
                      </div>
                    </div>
                  ) : (
                    <p className="sb-error font-body">No preferred shop set. Add one in your profile.</p>
                  )}

                  {/* Component context */}
                  {csComp && csBike && (
                    <>
                      <label className="sb-label font-mono">REGARDING</label>
                      <div className="sb-cs-context">
                        <div>
                          <span className="font-display" style={{ fontSize: 14, display: "block" }}>{csComp.type}</span>
                          <span className="font-mono" style={{ fontSize: 10, color: "var(--muted)" }}>
                            {csComp.brand} {csComp.model} · {csBike.brand} {csBike.model} ({csBike.id})
                          </span>
                        </div>
                        <span className="sb-detail-tag" style={{ flexShrink: 0 }}>
                          <span className="font-mono" style={{ fontSize: 10 }}>
                            {Math.round((getComponentKm(csComp, csBike.stravaGearId) / csComp.maxKm) * 100)}% worn
                          </span>
                        </span>
                      </div>
                    </>
                  )}

                  {/* Free text message */}
                  <label className="sb-label font-mono">MESSAGE</label>
                  <textarea
                    className="sb-input sb-textarea font-body"
                    rows={5}
                    value={contactShopState.message}
                    onChange={(e) => setContactShopState(prev => ({ ...prev, message: e.target.value }))}
                    placeholder={`e.g. Hi ${csShop?.name?.split(" ")[0] || "there"}, my ${csComp?.type?.toLowerCase() || "component"} is getting close to its service limit — can I book it in for a replacement this week?`}
                    autoFocus
                  />
                  <p className="sb-helper font-body" style={{ marginTop: 6 }}>
                    Your name, email, and bike details will be included automatically.
                  </p>
                  <button
                    className="sb-btn sb-btn-primary sb-btn-block"
                    style={{ marginTop: 14 }}
                    onClick={submitContactShop}
                    disabled={!contactShopState.message.trim() || !csShop}
                  >
                    <Send size={14} style={{ marginRight: 8 }} /> Send message
                  </button>
                </>
              )}
            </div>
          </>
        );
      }

      default:
        return null;
    }
  }

  return (
    <div className="sb-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,600&family=Inter:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .sb-root{
          --ink:#0C0B10; --paper:#FAFAF8; --paper-dark:#F0EFE9; --paper-light:#FFFFFF;
          --steel:#0F0E1A; --garage:#070610; --garage-soft:#13111F;
          --verified:#1A5C45; --verified-bg:#EAF3EE;
          --pending:#8B6318; --pending-bg:#F5EDD8;
          --alert:#7C1F35; --alert-bg:#F5E4E8;
          --line:#E4E2DC; --muted:#918F8A;
          --gold:#9E7E38; --gold-light:#C9A962; --gold-subtle:#F5EDD8;
          font-family:'Inter',sans-serif; color:var(--ink); box-sizing:border-box;
        }
        .sb-root *{ box-sizing:border-box; }
        .font-display{ font-family:'Cormorant Garamond',serif; font-weight:600; }
        .font-body{ font-family:'Inter',sans-serif; }
        .font-mono{ font-family:'IBM Plex Mono',monospace; letter-spacing:0.02em; }

        /* ---- Shell ---- */
        .sb-backdrop{ min-height:100vh; width:100%; background:#07060F;
          display:flex; flex-direction:column; align-items:center; justify-content:center; padding:32px 16px; }
        .sb-phone{ width:min(390px,92vw); height:min(800px,86vh); background:var(--paper); border-radius:44px;
          border:10px solid #0F0E18; box-shadow:0 40px 80px -20px rgba(0,0,0,0.8), 0 0 0 1px var(--gold); position:relative; overflow:hidden;
          display:flex; flex-direction:column; }
        .sb-phone::before{ content:""; position:absolute; top:0; left:50%; transform:translateX(-50%);
          width:110px; height:20px; background:#0F0E18; border-radius:0 0 12px 12px; z-index:5; }
        .sb-screen{ flex:1; overflow-y:auto; position:relative; display:flex; flex-direction:column; }
        .sb-home-indicator{ position:absolute; bottom:8px; left:50%; transform:translateX(-50%);
          width:100px; height:3px; background:rgba(12,11,16,0.18); border-radius:2px; z-index:5; }
        .sb-caption{ margin-top:20px; color:#3D3A52; font-family:'IBM Plex Mono',monospace; font-size:10px;
          letter-spacing:0.1em; text-align:center; max-width:320px; }

        /* ---- Layout ---- */
        .sb-screen-pad{ padding:24px 20px 32px; flex:1; }
        .sb-center-col{ display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; height:100%; }

        /* ---- Landing ---- */
        .sb-brandmark{ width:60px; height:60px; border-radius:50%; background:var(--steel); color:var(--gold-light);
          border:1px solid var(--gold); display:flex; align-items:center; justify-content:center; margin-bottom:20px; }
        .sb-wordmark{ font-size:34px; font-style:italic; font-weight:700; letter-spacing:0.03em; margin:0; color:var(--ink); }
        .sb-wordmark-row{ display:flex; align-items:center; gap:12px; margin-bottom:10px; }
        .sb-tagline{ font-size:13px; color:var(--muted); max-width:240px; margin:0 0 36px; line-height:1.6; font-weight:300; }
        .sb-landing-actions{ display:flex; flex-direction:column; gap:10px; width:100%; }

        /* ---- Buttons ---- */
        .sb-btn{ font-family:'Inter',sans-serif; font-weight:500; font-size:14px; padding:14px 18px;
          border-radius:4px; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center;
          letter-spacing:0.01em; transition:opacity 0.15s; }
        .sb-btn:active{ opacity:0.82; transform:none; }
        .sb-btn:disabled{ opacity:0.35; cursor:not-allowed; }
        .sb-btn-block{ width:100%; }
        .sb-btn-small{ padding:9px 14px; font-size:12px; }
        .sb-btn-primary{ background:var(--steel); color:var(--paper); }
        .sb-btn-secondary{ background:var(--paper-dark); color:var(--ink); border:1px solid var(--line); }
        .sb-btn-outline{ background:transparent; border:1px solid var(--line); color:var(--ink); margin-top:12px; }
        .sb-btn-strava{ background:#FC4C02; color:#fff; }

        /* ---- Form elements ---- */
        .sb-helper{ font-size:12.5px; color:var(--muted); line-height:1.6; margin:0 0 16px; font-weight:400; }
        .sb-label{ display:block; font-size:10px; color:var(--muted); margin:20px 0 7px; letter-spacing:0.1em; font-weight:500; }
        .sb-input{ width:100%; padding:11px 13px; border-radius:3px; border:1px solid var(--line);
          background:var(--paper-light); font-size:13.5px; color:var(--ink); outline:none; font-family:'Inter',sans-serif; }
        .sb-input:focus{ border-color:var(--ink); }

        /* ---- Currency (Rand) input ---- */
        .sb-currency-field{ display:flex; align-items:center; border:1px solid var(--line); background:var(--paper-light); }
        .sb-currency-prefix{ padding:0 0 0 13px; font-size:13.5px; color:var(--muted); flex-shrink:0; }
        .sb-currency-input{ border:none !important; padding-left:6px !important; }
        .sb-currency-input:focus{ border:none; }
        .sb-tag-cost{ font-size:10.5px; color:var(--gold); letter-spacing:0.02em; flex-shrink:0; }
        .sb-comp-cost{ color:var(--gold) !important; }
        .sb-textarea{ resize:vertical; font-family:'Inter',sans-serif; }

        /* ---- Password field ---- */
        .sb-password-field{ position:relative; display:flex; align-items:center; }
        .sb-password-field .sb-input{ padding-right:42px; }
        .sb-password-toggle{ position:absolute; right:10px; top:50%; transform:translateY(-50%);
          background:none; border:none; cursor:pointer; color:var(--muted); padding:4px;
          display:flex; align-items:center; justify-content:center; }
        .sb-password-toggle:hover{ color:var(--ink); }

        /* ---- Top bar ---- */
        .sb-topbar{ display:flex; align-items:center; padding:18px 16px 12px; gap:8px; border-bottom:1px solid var(--line); }
        .sb-topbar-title{ flex:1; font-size:15px; text-align:center; margin:0; letter-spacing:0.01em; font-family:'Cormorant Garamond',serif; font-weight:600; font-style:italic; }
        .sb-topbar-right{ width:32px; display:flex; justify-content:flex-end; }
        .sb-iconbtn{ width:32px; height:32px; border-radius:50%; border:none; background:transparent; color:var(--ink);
          display:flex; align-items:center; justify-content:center; cursor:pointer; }
        .sb-iconbtn:active{ background:rgba(0,0,0,0.05); }
        .sb-iconbtn-spacer{ width:32px; height:32px; }
        .sb-iconbtn-filled{ background:var(--steel); color:var(--paper); border-radius:3px; }
        .sb-iconbtn-badged{ position:relative; }
        .sb-topbar-menu-badge{ position:absolute; top:4px; right:5px; width:9px; height:9px; border-radius:50%;
          background:var(--alert); border:1.5px solid var(--paper); }

        /* ---- Shop auth ---- */
        .sb-shop-select{ width:100%; display:flex; align-items:center; gap:14px; padding:14px; border-radius:3px;
          border:1px solid var(--line); background:var(--paper-light); margin-bottom:8px; cursor:pointer; text-align:left;
          transition:border-color 0.15s; }
        .sb-shop-select:hover{ border-color:var(--gold); }
        .sb-shop-select-active{ border-color:var(--gold); background:var(--gold-subtle); }

        /* ---- "Can't find your shop?" journey ---- */
        .sb-shop-not-listed{ width:100%; display:flex; align-items:center; justify-content:center;
          padding:13px; border:1px dashed var(--line); background:transparent; color:var(--muted);
          font-family:'Inter',sans-serif; font-size:12.5px; font-weight:500; cursor:pointer; margin-top:4px;
          transition:border-color 0.15s, color 0.15s; }
        .sb-shop-not-listed:hover{ border-color:var(--gold); color:var(--gold); }
        .sb-new-shop-intro{ display:flex; flex-direction:column; align-items:center; text-align:center;
          padding:18px 16px 20px; border-bottom:1px solid var(--line); margin-bottom:18px; }
        .sb-shop-new-badge{ font-size:9.5px; color:var(--gold); border:1px solid var(--gold); padding:2px 7px;
          letter-spacing:0.08em; background:var(--gold-subtle); }
        .sb-shop-select-icon{ width:34px; height:34px; border-radius:50%; background:var(--steel); color:var(--gold-light);
          display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .sb-shop-select-active .sb-shop-select-icon{ background:var(--gold); }
        .sb-shop-select-text{ display:flex; flex-direction:column; gap:2px; flex:1; }
        .sb-shop-select-name{ font-size:13.5px; font-weight:500; }
        .sb-shop-select-area{ font-size:11px; color:var(--muted); }
        .sb-shop-select-address{ font-size:10px; color:var(--muted); opacity:0.75; margin-top:1px; }
        .sb-preferred-badge{ font-size:9px; color:var(--gold); border:1px solid var(--gold); padding:2px 6px;
          letter-spacing:0.08em; flex-shrink:0; background:var(--gold-subtle); }

        /* ---- Shop search autocomplete ---- */
        .sb-shop-search-wrap{ position:relative; }
        .sb-shop-search-field-wrap{ position:relative; }
        .sb-shop-search-field{ display:flex; align-items:center; border:1px solid var(--line); background:var(--paper-light);
          padding:0 12px; gap:8px; transition:border-color 0.15s; }
        .sb-shop-search-field:focus-within{ border-color:var(--ink); }
        .sb-shop-search-icon{ color:var(--muted); flex-shrink:0; }
        .sb-shop-search-input{ flex:1; border:none; background:transparent; padding:11px 0; font-size:13.5px;
          color:var(--ink); outline:none; font-family:'Inter',sans-serif; }
        .sb-shop-search-input::placeholder{ color:var(--muted); }
        .sb-shop-search-clear{ background:none; border:none; cursor:pointer; color:var(--muted); padding:4px; display:flex; }
        .sb-shop-search-hint{ font-size:10.5px; color:var(--muted); padding:8px 2px; letter-spacing:0.02em; }
        .sb-shop-dropdown{ position:absolute; top:100%; left:0; right:0; background:var(--paper-light);
          border:1px solid var(--ink); border-top:none; z-index:10; box-shadow:0 8px 24px rgba(0,0,0,0.12); }
        .sb-shop-dropdown-empty{ padding:14px 14px; font-size:11px; color:var(--muted); }
        .sb-shop-dropdown-item{ width:100%; display:flex; align-items:center; gap:12px; padding:11px 14px;
          background:transparent; border:none; border-bottom:1px solid var(--line); cursor:pointer; text-align:left;
          transition:background 0.1s; }
        .sb-shop-dropdown-item:last-child{ border-bottom:none; }
        .sb-shop-dropdown-item:hover{ background:var(--paper-dark); }
        .sb-shop-dropdown-icon{ width:28px; height:28px; border-radius:50%; background:var(--steel); color:var(--gold-light);
          display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .sb-shop-dropdown-text{ display:flex; flex-direction:column; gap:2px; flex:1; min-width:0; }
        .sb-shop-dropdown-name{ font-size:13px; }
        .sb-shop-dropdown-area{ font-size:10px; color:var(--muted); }
        .sb-shop-dropdown-address{ font-size:9px; color:var(--muted); opacity:0.7; display:block; }
        .sb-shop-dropdown-tags{ font-size:9.5px; color:var(--muted); letter-spacing:0.02em; }
        .sb-shop-dropdown-rating{ font-size:11px; color:var(--gold); display:flex; align-items:center; flex-shrink:0; }
        .sb-shop-selected-row{ display:flex; align-items:center; gap:12px; padding:12px 14px;
          border:1px solid var(--gold); background:var(--gold-subtle); }
        .sb-shop-clear{ background:none; border:none; cursor:pointer; font-size:10.5px; color:var(--gold);
          letter-spacing:0.06em; text-decoration:underline; flex-shrink:0; font-family:'IBM Plex Mono',monospace; }

        /* ---- Sign in hint ---- */
        .sb-signin-hint{ margin-top:24px; padding:14px 16px; border:1px solid var(--line); background:var(--paper-light); }

        /* ---- Component preset info card ---- */
        .sb-preset-card{ padding:14px 16px; border:1px solid var(--gold); background:var(--gold-subtle); margin:12px 0 4px; }
        .sb-preset-card-head{ display:flex; align-items:baseline; justify-content:space-between; gap:10px; margin-bottom:8px; }
        .sb-preset-card-type{ font-size:15px; }
        .sb-preset-card-range{ font-size:11px; color:var(--gold); letter-spacing:0.04em; }
        .sb-preset-card-desc{ font-size:12.5px; color:var(--ink); line-height:1.6; margin:0 0 8px; }
        .sb-preset-card-source{ font-size:9.5px; color:var(--muted); letter-spacing:0.04em; margin:0; }

        /* ---- Auth type selection cards ---- */
        .sb-auth-type-card{ width:100%; display:flex; align-items:center; gap:14px; padding:16px;
          border:1px solid var(--line); background:var(--paper-light); margin-bottom:10px; cursor:pointer;
          text-align:left; transition:border-color 0.15s; }
        .sb-auth-type-card:hover{ border-color:var(--gold); }
        .sb-auth-type-icon{ width:44px; height:44px; border-radius:50%; background:var(--steel); color:var(--gold-light);
          display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .sb-auth-type-text{ display:flex; flex-direction:column; gap:4px; flex:1; }
        .sb-auth-type-label{ font-size:17px; display:block; }
        .sb-auth-type-desc{ font-size:12px; color:var(--muted); line-height:1.5; display:block; }
        .sb-auth-type-arrow{ color:var(--muted); flex-shrink:0; }

        /* ---- Shop profile page header ---- */
        .sb-shop-profile-head{ display:flex; align-items:center; gap:16px; padding:16px;
          background:var(--paper-light); border:1px solid var(--line); margin-bottom:6px; }

        /* ---- Avatar colour picker ---- */
        .sb-avatar-color-grid{ display:flex; flex-wrap:wrap; gap:10px; margin-bottom:14px; }
        .sb-avatar-color-swatch{ width:36px; height:36px; border-radius:50%; border:2px solid transparent;
          cursor:pointer; display:flex; align-items:center; justify-content:center; transition:border-color 0.15s, transform 0.1s; }
        .sb-avatar-color-swatch:hover{ transform:scale(1.1); }
        .sb-avatar-color-swatch-active{ border-color:var(--gold); }
        .sb-avatar-preview{ display:flex; align-items:center; gap:12px; padding:12px 14px;
          border:1px solid var(--gold); background:var(--gold-subtle); margin-top:4px; }

        /* ---- Profile picture upload ---- */
        .sb-upload-dropzone{ display:block; cursor:pointer; border:1px dashed var(--line); padding:24px 16px;
          text-align:center; transition:border-color 0.15s; }
        .sb-upload-dropzone:hover{ border-color:var(--gold); }
        .sb-upload-dropzone-inner{ display:flex; flex-direction:column; align-items:center; gap:8px; }
        .sb-upload-icon{ width:44px; height:44px; border-radius:50%; background:var(--paper-dark);
          display:flex; align-items:center; justify-content:center; color:var(--muted); margin-bottom:4px; }
        .sb-upload-label{ font-size:13px; color:var(--ink); font-weight:500; }
        .sb-upload-hint{ font-size:10px; color:var(--muted); letter-spacing:0.04em; }
        .sb-upload-preview{ display:flex; align-items:center; gap:16px; padding:14px 16px;
          border:1px solid var(--gold); background:var(--gold-subtle); }
        .sb-upload-preview-text{ display:flex; flex-direction:column; flex:1; }
        .sb-upload-change-btn{ font-size:10.5px; color:var(--gold); letter-spacing:0.06em; cursor:pointer;
          text-decoration:underline; margin-right:12px; background:none; border:none; padding:0; font-family:'IBM Plex Mono',monospace; }
        .sb-upload-remove-btn{ font-size:10.5px; color:var(--alert); letter-spacing:0.06em; cursor:pointer;
          text-decoration:underline; background:none; border:none; padding:0; font-family:'IBM Plex Mono',monospace; }
        .sb-notify-toggle-row{ display:flex; align-items:center; gap:14px; padding:14px; border:1px solid var(--line);
          background:var(--paper-light); cursor:pointer; margin-bottom:0; }
        .sb-notify-label{ font-size:13px; display:block; font-weight:500; margin-bottom:4px; }
        .sb-notify-sub{ font-size:10px; color:var(--muted); display:block; line-height:1.5; letter-spacing:0.01em; }
        .sb-toggle-switch{ width:40px; height:22px; border-radius:20px; background:var(--line); position:relative;
          flex-shrink:0; transition:background 0.2s; border:1px solid var(--line); }
        .sb-toggle-switch-on{ background:var(--gold); border-color:var(--gold); }
        .sb-toggle-knob{ position:absolute; top:2px; left:2px; width:16px; height:16px; border-radius:50%;
          background:#fff; transition:transform 0.2s; box-shadow:0 1px 3px rgba(0,0,0,0.2); }
        .sb-toggle-switch-on .sb-toggle-knob{ transform:translateX(18px); }
        .sb-notify-active-badge{ display:flex; align-items:center; font-size:10px; color:var(--verified);
          background:var(--verified-bg); padding:8px 12px; margin-top:6px; letter-spacing:0.03em; }

        /* ---- Home ---- */
        .sb-shop-finder{ width:100%; display:flex; align-items:center; padding:12px 14px; border-radius:3px;
          border:1px solid var(--line); background:transparent; color:var(--muted); font-family:'Inter',sans-serif;
          font-size:12.5px; font-weight:400; cursor:pointer; margin-bottom:24px; }

        .sb-section-title{ font-size:10px; color:var(--muted); letter-spacing:0.12em; margin:0 0 14px; font-weight:500;
          padding-bottom:8px; border-bottom:1px solid var(--line); }

        /* ---- Bike cards ---- */
        .sb-bike-card{ width:100%; display:flex; align-items:center; gap:14px; padding:14px 16px; border-radius:3px;
          background:var(--paper-light); border:1px solid var(--line); margin-bottom:8px; cursor:pointer; text-align:left;
          transition:border-color 0.15s; }
        .sb-bike-card:hover{ border-color:var(--gold); }
        .sb-bike-card-icon{ width:38px; height:38px; border-radius:50%; background:var(--steel); color:var(--gold-light);
          display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .sb-bike-card-text{ display:flex; flex-direction:column; gap:3px; flex:1; min-width:0; }
        .sb-bike-card-name{ font-size:14px; font-family:'Cormorant Garamond',serif; font-weight:600; }
        .sb-bike-card-id{ font-size:10px; color:var(--muted); letter-spacing:0.06em; }

        /* ---- Reminder badges ---- */
        .sb-reminder{ display:inline-flex; align-items:center; font-size:11px; gap:5px; }
        .sb-reminder-row{ display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:18px; flex-wrap:wrap; }
        .sb-calendar-sync-link{ display:inline-flex; align-items:center; background:none; border:none; cursor:pointer;
          color:var(--gold); font-size:10.5px; letter-spacing:0.03em; padding:0; }
        .sb-calendar-sync-link:hover{ text-decoration:underline; }
        .sb-reminder::before{ content:""; display:inline-block; width:6px; height:6px; border-radius:50%; flex-shrink:0; }
        .rb--ok{ color:var(--verified); }
        .rb--ok::before{ background:var(--verified); }
        .rb--pending{ color:var(--pending); }
        .rb--pending::before{ background:var(--pending); }
        .rb--alert{ color:var(--alert); }
        .rb--alert::before{ background:var(--alert); }
        .rb--neutral{ color:var(--muted); }
        .rb--neutral::before{ background:var(--muted); }

        /* ---- Service tag chain ---- */
        .sb-tag-chain{ display:flex; flex-direction:column; gap:0; border-left:1px solid var(--line); margin-left:8px; }
        .sb-tag{ position:relative; background:transparent; padding:14px 14px 14px 22px; border-bottom:1px solid var(--line); }
        .sb-tag:last-child{ border-bottom:none; }
        .tag--pending{ }
        .tag--self{ }
        .tag--verified{ }
        .sb-tag-hole{ position:absolute; top:16px; left:-7px; width:13px; height:13px; border-radius:50%;
          background:var(--paper); border:1px solid var(--line); display:flex; align-items:center; justify-content:center; }
        .tag--verified .sb-tag-hole{ border-color:var(--gold); background:var(--gold-subtle); }
        .sb-tag-top{ display:flex; justify-content:space-between; align-items:baseline; margin-bottom:6px; gap:10px; }
        .sb-tag-type{ font-size:14px; font-family:'Cormorant Garamond',serif; font-weight:600; }
        .sb-tag-date{ font-size:10px; color:var(--muted); flex-shrink:0; letter-spacing:0.04em; }
        .sb-tag-notes{ font-size:12.5px; color:var(--muted); line-height:1.6; margin:0 0 10px; font-weight:400; }
        .sb-tag-bottom{ display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; }
        .sb-tag-status{ font-size:10px; letter-spacing:0.06em; display:flex; align-items:center; gap:4px; }
        .tag--verified .sb-tag-status{ color:var(--verified); }
        .tag--pending .sb-tag-status{ color:var(--pending); }
        .tag--self .sb-tag-status{ color:var(--muted); }
        .sb-tag-shop{ font-size:10px; color:var(--muted); display:flex; align-items:center; gap:4px; }

        /* ---- QR / ID ---- */
        .sb-qr-wrap{ padding:10px; background:var(--paper-light); border-radius:4px; border:1px solid var(--line);
          display:inline-flex; margin-bottom:16px; }
        .sb-qr-wrap-small{ padding:5px; margin-bottom:0; flex-shrink:0; }
        .sb-bikeid-text{ font-size:14px; letter-spacing:0.1em; margin-bottom:14px; display:block; }

        /* ---- Bike detail head ---- */
        .sb-bike-detail-head{ display:flex; justify-content:space-between; align-items:flex-start; gap:12px; margin-bottom:14px; }
        .sb-bike-detail-id{ font-size:11px; display:block; margin-bottom:3px; letter-spacing:0.08em; color:var(--muted); }
        .sb-bike-detail-meta{ font-size:11.5px; color:var(--muted); font-weight:300; }

        /* ---- Detail tags ---- */
        .sb-detail-tags{ display:flex; flex-wrap:wrap; gap:6px; margin-bottom:16px; }
        .sb-detail-tag{ display:inline-flex; align-items:center; gap:5px; padding:5px 9px;
          border:1px solid var(--line); font-size:10.5px; color:var(--ink); letter-spacing:0.02em; }
        .sb-detail-tag-verified{ border-color:var(--gold); color:var(--gold); background:var(--gold-subtle); }
        .sb-detail-tag-ebike{ border-color:#1D6FA4; color:#1D6FA4; background:#E6F2F9; }
        .sb-detail-tag-pending-tx{ border-color:var(--pending); color:var(--pending); background:var(--pending-bg); }

        /* ── Shop ownership card ── */
        .sb-shop-owner-card{ display:flex; align-items:center; gap:12px; padding:14px 16px;
          background:var(--paper-light); border:1px solid var(--line); margin-bottom:6px; }
        .sb-shop-owner-avatar{ width:38px; height:38px; border-radius:50%; background:var(--steel); color:var(--gold-light);
          display:flex; align-items:center; justify-content:center; font-size:17px; flex-shrink:0; }
        .sb-shop-owner-text{ display:flex; flex-direction:column; gap:3px; flex:1; min-width:0; }
        .sb-shop-owner-name{ font-size:15px; }
        .sb-shop-owner-since{ font-size:10px; color:var(--muted); letter-spacing:0.03em; }
        .sb-section-divider{ height:1px; background:var(--line); margin:20px 0; }

        /* ---- E-bike toggle ---- */
        .sb-ebike-toggle{ display:flex; align-items:center; justify-content:space-between; gap:12px;
          padding:13px 14px; border:1px solid var(--line); background:var(--paper-light); cursor:pointer;
          transition:border-color 0.15s; margin-bottom:0; }
        .sb-ebike-toggle-on{ border-color:#1D6FA4; background:#E6F2F9; }
        .sb-ebike-toggle-left{ display:flex; align-items:center; gap:12px; flex:1; }
        .sb-ebike-icon{ width:32px; height:32px; border-radius:50%; background:var(--line); color:var(--muted);
          display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:background 0.2s; }
        .sb-ebike-icon-on{ background:#1D6FA4; color:#fff; }
        .sb-ebike-badge{ position:absolute; bottom:-3px; right:-3px; width:14px; height:14px; border-radius:50%;
          background:#1D6FA4; color:#fff; display:flex; align-items:center; justify-content:center;
          border:1.5px solid var(--paper); }

        /* ---- Strava ---- */
        .sb-strava-card{ background:var(--paper-light); border:1px solid var(--line); padding:14px 16px; margin-bottom:20px; }
        .sb-strava-head{ display:flex; align-items:center; gap:7px; margin-bottom:12px; color:#E8490A; }
        .sb-strava-head span.font-display{ font-size:13px; flex:1; color:var(--ink); font-weight:500; font-family:'Inter',sans-serif; letter-spacing:0.01em; }
        .sb-strava-unlink{ background:none; border:none; padding:0; font-size:10px; color:var(--muted); cursor:pointer; letter-spacing:0.04em; text-transform:uppercase; }
        .sb-gear-option{ width:100%; text-align:left; padding:11px 13px; border:1px solid var(--line);
          background:var(--paper-light); font-family:'Inter',sans-serif; font-size:13px; color:var(--ink);
          cursor:pointer; margin-bottom:6px; transition:border-color 0.15s; }
        .sb-gear-option:hover{ border-color:var(--gold); }
        .sb-gear-option:last-child{ margin-bottom:0; }
        .sb-strava-stats{ display:flex; gap:28px; margin-bottom:14px; border-bottom:1px solid var(--line); padding-bottom:14px; }
        .sb-strava-stat-num{ font-size:22px; display:block; font-family:'Cormorant Garamond',serif; font-weight:600; }
        .sb-strava-stat-label{ font-size:9px; color:var(--muted); letter-spacing:0.1em; text-transform:uppercase; }
        .sb-ride-list{ display:flex; flex-direction:column; }
        .sb-ride-item{ display:flex; justify-content:space-between; align-items:baseline; padding:8px 0; border-top:1px solid var(--line); gap:10px; }
        .sb-ride-list .sb-ride-item:first-child{ border-top:none; padding-top:0; }
        .sb-ride-name{ font-size:12.5px; display:block; font-weight:400; }
        .sb-ride-date{ font-size:10px; color:var(--muted); }
        .sb-ride-distance{ font-size:11.5px; color:var(--ink); flex-shrink:0; font-family:'IBM Plex Mono',monospace; }

        /* ---- Tabs ---- */
        .sb-tabs{ display:flex; gap:0; margin-bottom:20px; border-bottom:1px solid var(--line); }
        .sb-tab{ flex:1; padding:10px 8px; display:flex; align-items:center; justify-content:center; border:none;
          background:transparent; font-family:'Inter',sans-serif; font-size:12.5px; font-weight:500;
          color:var(--muted); cursor:pointer; border-bottom:2px solid transparent; margin-bottom:-1px; }
        .sb-tab-active{ color:var(--ink); border-bottom-color:var(--gold); }
        .sb-tab-alert{ display:inline-flex; align-items:center; justify-content:center; width:15px; height:15px;
          border-radius:50%; background:var(--alert); color:#fff; font-size:8.5px; margin-left:6px; font-weight:600; }

        /* ---- Component cards ---- */
        .sb-comp-list{ display:flex; flex-direction:column; gap:8px; }
        .sb-comp-card{ background:var(--paper-light); border:1px solid var(--line); padding:14px 16px; position:relative; }
        .comp--pending{ border-left:2px solid var(--pending); }
        .comp--alert{ border-left:2px solid var(--alert); }
        .sb-comp-top{ display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; }
        .sb-comp-type{ font-size:14px; display:block; font-family:'Cormorant Garamond',serif; font-weight:600; }
        .sb-comp-brand{ font-size:10px; color:var(--muted); display:block; margin-top:2px; letter-spacing:0.03em; }
        .sb-comp-pct{ font-size:17px; font-family:'Cormorant Garamond',serif; font-weight:600; }
        .sb-wear-track{ height:3px; background:var(--line); overflow:hidden; margin-bottom:10px; }
        .sb-wear-fill{ height:100%; transition:width 0.3s; }
        .sb-comp-footer{ display:flex; justify-content:space-between; }
        .sb-comp-meta{ font-size:10px; color:var(--muted); letter-spacing:0.03em; }
        .sb-comp-alert{ display:flex; align-items:center; font-size:10.5px; margin-top:10px; padding:6px 10px;
          letter-spacing:0.01em; }
        .comp-alert--pending{ background:var(--pending-bg); color:var(--pending); }
        .comp-alert--alert{ background:var(--alert-bg); color:var(--alert); }

        /* ---- Bike card badge ---- */
        .sb-bike-card-icon{ position:relative; }
        .sb-bike-card-badge{ position:absolute; top:-3px; right:-3px; width:15px; height:15px; border-radius:50%;
          background:var(--alert); color:#fff; font-size:8px; font-family:'IBM Plex Mono',monospace;
          display:flex; align-items:center; justify-content:center; font-weight:700; border:1.5px solid var(--paper); }

        /* ---- Dual footer ---- */
        .sb-footer-row{ display:flex; gap:8px; }
        .sb-btn-half{ flex:1; }

        /* ---- Sticky footer ---- */
        .sb-sticky-footer{ padding:12px 20px 20px; background:linear-gradient(to top, var(--paper) 60%, transparent); }

        /* ---- Chips ---- */
        .sb-chip-row{ display:flex; flex-wrap:wrap; gap:6px; margin-bottom:6px; }
        .sb-chip{ padding:7px 12px; border-radius:2px; border:1px solid var(--line); background:transparent;
          color:var(--muted); font-size:12px; font-family:'Inter',sans-serif; cursor:pointer; }
        .sb-chip-active{ background:var(--steel); border-color:var(--steel); color:var(--paper); }
        .sb-chip-static{ cursor:default; color:var(--ink); background:var(--paper-dark); }

        /* ---- Toggles ---- */
        .sb-toggle-row{ display:flex; gap:6px; margin-bottom:6px; }
        .sb-toggle{ flex:1; padding:11px; border-radius:2px; border:1px solid var(--line); background:transparent;
          color:var(--muted); font-size:13px; font-weight:500; font-family:'Inter',sans-serif; cursor:pointer; }
        .sb-toggle-active{ background:var(--steel); border-color:var(--steel); color:var(--paper); }

        /* ---- Shop lists ---- */
        .sb-shop-list-item{ width:100%; display:flex; align-items:center; gap:14px; padding:14px; border-radius:2px;
          background:var(--paper-light); border:1px solid var(--line); margin-bottom:8px; cursor:pointer; text-align:left;
          transition:border-color 0.15s; }
        .sb-shop-list-item:hover{ border-color:var(--gold); }
        .sb-shop-list-icon{ width:36px; height:36px; border-radius:50%; background:var(--steel); color:var(--gold-light);
          display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .sb-shop-list-text{ display:flex; flex-direction:column; gap:3px; flex:1; min-width:0; }
        .sb-shop-list-name{ font-size:13.5px; font-weight:500; }
        .sb-shop-list-area{ font-size:10.5px; color:var(--muted); display:flex; align-items:center; }
        .sb-shop-list-address{ font-size:9.5px; color:var(--muted); opacity:0.7; display:block; margin-top:1px; }
        .sb-shop-list-rating{ font-size:12px; display:flex; align-items:center; color:var(--gold); flex-shrink:0; font-family:'IBM Plex Mono',monospace; }

        .sb-profile-rating{ font-size:13px; color:var(--gold); display:flex; align-items:center; margin-bottom:6px; }
        .sb-profile-area{ font-size:12.5px; color:var(--muted); display:flex; align-items:center; margin:0 0 20px; }
        .sb-profile-address{ font-size:11px; color:var(--muted); opacity:0.75; letter-spacing:0.02em; }

        /* ---- Shop lookup ---- */
        .sb-lookup-row{ display:flex; gap:8px; margin-bottom:6px; }
        .sb-lookup-row .sb-input{ flex:1; }
        .sb-error{ font-size:12px; color:var(--alert); margin:8px 0 0; }

        /* ---- Queue items ---- */
        .sb-queue-item{ background:var(--paper-light); border:1px solid var(--line); border-left:2px solid var(--pending); padding:14px 16px; margin-bottom:8px; }
        .sb-queue-item-text{ display:flex; flex-direction:column; margin-bottom:10px; }
        .sb-queue-item-type{ font-size:14px; font-family:'Cormorant Garamond',serif; font-weight:600; }
        .sb-queue-item-meta{ font-size:10px; color:var(--muted); margin:3px 0 6px; letter-spacing:0.04em; }
        .sb-queue-item-notes{ font-size:12.5px; color:var(--muted); margin:0; line-height:1.6; }

        /* ---- Empty states ---- */
        .sb-empty{ display:flex; flex-direction:column; align-items:center; text-align:center; padding:36px 10px; color:var(--muted); }
        .sb-empty h3{ font-size:16px; color:var(--ink); margin:12px 0 6px; font-family:'Cormorant Garamond',serif; font-style:italic; }
        .sb-empty p{ font-size:12.5px; line-height:1.6; margin:0; max-width:240px; font-weight:300; }

        /* ---- Notifications ---- */
        .sb-menu-notif-badge{ display:inline-flex; align-items:center; justify-content:center; min-width:18px; height:18px;
          border-radius:20px; background:var(--alert); color:#fff; font-size:9px; padding:0 5px; margin-left:auto; margin-right:8px; font-weight:700; }
        .sb-notif-panel{ flex:1; overflow-y:auto; display:flex; flex-direction:column; }

        /* ---- Alerts / Messages sub-tabs ---- */
        .sb-notif-tabs{ display:flex; border-bottom:1px solid var(--line); flex-shrink:0; }
        .sb-notif-tab{ flex:1; padding:12px 8px; background:transparent; border:none; cursor:pointer;
          font-family:'Inter',sans-serif; font-size:12px; font-weight:500; color:var(--muted);
          display:flex; align-items:center; justify-content:center; gap:6px; border-bottom:2px solid transparent; margin-bottom:-1px; }
        .sb-notif-tab-active{ color:var(--ink); border-bottom-color:var(--gold); }
        .sb-notif-tab-dot{ width:6px; height:6px; border-radius:50%; background:var(--alert); }

        /* ---- Thread list (Messages tab) ---- */
        .sb-thread-list{ display:flex; flex-direction:column; }
        .sb-thread-row{ width:100%; display:flex; align-items:center; gap:12px; padding:13px 18px;
          background:transparent; border:none; border-bottom:1px solid var(--line); cursor:pointer; text-align:left; }
        .sb-thread-row-unread{ background:var(--paper-dark); }
        .sb-thread-row-text{ display:flex; flex-direction:column; gap:2px; flex:1; min-width:0; }
        .sb-thread-row-top{ display:flex; justify-content:space-between; align-items:baseline; gap:8px; }
        .sb-thread-row-name{ font-size:14px; }
        .sb-thread-row-date{ font-size:9.5px; color:var(--muted); flex-shrink:0; }
        .sb-thread-row-preview{ font-size:12px; color:var(--muted); font-weight:300; white-space:nowrap;
          overflow:hidden; text-overflow:ellipsis; }
        .sb-thread-row-comp{ font-size:9.5px; color:var(--gold); letter-spacing:0.03em; }

        /* ---- Thread detail (chat view) ---- */
        .sb-thread-detail{ flex:1; display:flex; flex-direction:column; overflow:hidden; }
        .sb-thread-messages{ flex:1; overflow-y:auto; padding:16px 16px 8px; display:flex; flex-direction:column; gap:10px; }
        .sb-bubble-row{ display:flex; justify-content:flex-start; }
        .sb-bubble-row-me{ justify-content:flex-end; }
        .sb-bubble{ max-width:82%; padding:10px 13px; display:flex; flex-direction:column; gap:6px; }
        .sb-bubble-them{ background:var(--paper-light); border:1px solid var(--line); border-bottom-left-radius:2px; }
        .sb-bubble-me{ background:var(--steel); border-bottom-right-radius:2px; }
        .sb-bubble-me .sb-bubble-text{ color:var(--paper); }
        .sb-bubble-me .sb-bubble-time{ color:var(--gold-light); opacity:0.7; }
        .sb-bubble-text{ font-size:13px; line-height:1.5; color:var(--ink); }
        .sb-bubble-time{ font-size:9px; color:var(--muted); letter-spacing:0.04em; align-self:flex-end; }
        .sb-bubble-comp-card{ display:flex; flex-direction:column; gap:2px; padding:8px 10px;
          background:var(--paper); border:1px solid var(--line); }
        .sb-bubble-me .sb-bubble-comp-card{ background:rgba(255,255,255,0.06); border-color:rgba(255,255,255,0.15); }
        .sb-bubble-me .sb-bubble-comp-card .sb-notif-comp-type,
        .sb-bubble-me .sb-bubble-comp-card .sb-notif-comp-meta{ color:var(--paper); }

        /* ---- Thread message input bar ---- */
        .sb-thread-input-row{ display:flex; align-items:flex-end; gap:8px; padding:10px 16px 16px;
          border-top:1px solid var(--line); flex-shrink:0; }
        .sb-thread-input{ flex:1; margin:0; }
        .sb-thread-send-btn{ width:38px; height:38px; border-radius:50%; background:var(--steel); color:var(--gold-light);
          border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .sb-thread-send-btn:disabled{ opacity:0.35; cursor:not-allowed; }
        .sb-notif-list{ display:flex; flex-direction:column; }
        .sb-notif-item{ display:flex; align-items:flex-start; gap:12px; padding:14px 18px; border-bottom:1px solid var(--line); position:relative; }
        .sb-notif-unread{ background:var(--paper-dark); }
        .sb-notif-icon{ width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px; }
        .sb-notif-text{ display:flex; flex-direction:column; gap:4px; flex:1; min-width:0; padding-right:14px; }
        .sb-notif-title{ font-size:13px; }
        .sb-notif-body{ font-size:11.5px; color:var(--muted); line-height:1.5; font-weight:300; }
        .sb-notif-date{ font-size:9.5px; color:var(--muted); letter-spacing:0.04em; margin-top:2px; }
        .sb-notif-reply{ font-size:9.5px; color:var(--gold); letter-spacing:0.04em; margin-top:1px; }

        /* ---- Notification component context card ---- */
        .sb-notif-comp-card{ display:flex; flex-direction:column; gap:2px; padding:9px 11px;
          border:1px solid var(--line); background:var(--paper-light); margin:8px 0 4px; }
        .sb-notif-comp-top{ display:flex; align-items:baseline; justify-content:space-between; gap:8px; }
        .sb-notif-comp-type{ font-size:13px; }
        .sb-notif-comp-pct{ font-size:10.5px; font-weight:600; letter-spacing:0.02em; }
        .sb-notif-comp-meta{ font-size:9.5px; color:var(--muted); letter-spacing:0.02em; }

        .sb-notif-dot{ position:absolute; top:18px; right:14px; width:7px; height:7px; border-radius:50%; background:var(--alert); flex-shrink:0; }

        /* ---- Component message button ---- */
        .sb-comp-message-btn{ width:100%; display:flex; align-items:center; justify-content:center; margin-top:10px;
          padding:8px 12px; background:transparent; border:1px solid var(--line); color:var(--muted);
          font-size:11px; cursor:pointer; letter-spacing:0.04em; transition:border-color 0.15s, color 0.15s; }
        .sb-comp-message-btn:hover{ border-color:var(--gold); color:var(--gold); }

        /* ---- Contact shop screen ---- */
        .sb-cs-recipient{ display:flex; align-items:center; gap:12px; padding:12px 14px; border:1px solid var(--gold); background:var(--gold-subtle); margin-bottom:4px; }
        .sb-cs-context{ display:flex; align-items:center; justify-content:space-between; gap:10px; padding:12px 14px; border:1px solid var(--line); background:var(--paper-light); margin-bottom:4px; }

        /* ---- Toast ---- */
        .sb-toast{ position:absolute; bottom:36px; left:50%; transform:translateX(-50%); background:var(--ink);
          color:var(--paper); padding:9px 18px; border-radius:2px; font-size:12px; font-family:'Inter',sans-serif;
          box-shadow:0 8px 32px rgba(0,0,0,0.3); z-index:10; white-space:nowrap; letter-spacing:0.04em; }

        /* ---- Slide-out menu drawer ---- */
        .sb-menu-overlay{ position:absolute; inset:0; background:rgba(7,6,15,0.55); z-index:20; }
        .sb-menu-drawer{ position:absolute; top:0; right:0; bottom:0; width:82%; max-width:300px;
          background:var(--paper); z-index:21; display:flex; flex-direction:column;
          box-shadow:-8px 0 32px rgba(0,0,0,0.18); animation:drawerIn 0.22s cubic-bezier(.4,0,.2,1); }
        @keyframes drawerIn{ from{ transform:translateX(100%); } to{ transform:translateX(0); } }
        .sb-menu-header{ display:flex; align-items:center; padding:18px 14px 14px; gap:8px;
          border-bottom:1px solid var(--line); }
        .sb-menu-title{ flex:1; font-size:15px; text-align:center; font-style:italic; }
        .sb-menu-body{ flex:1; overflow-y:auto; padding:20px 18px 28px; display:flex; flex-direction:column; }
        .sb-menu-identity{ display:flex; align-items:center; gap:14px; margin-bottom:20px; }
        .sb-menu-avatar{ width:40px; height:40px; border-radius:50%; background:var(--steel); color:var(--gold-light);
          display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
        .sb-menu-avatar-lg{ width:56px; height:56px; font-size:24px; }
        .sb-menu-name{ font-size:15px; display:block; line-height:1.2; }
        .sb-menu-subtitle{ font-size:10px; color:var(--muted); letter-spacing:0.06em; display:block; margin-top:3px; }
        .sb-menu-divider{ height:1px; background:var(--line); margin:8px 0; }
        .sb-menu-item{ width:100%; display:flex; align-items:center; gap:12px; padding:13px 4px;
          background:transparent; border:none; cursor:pointer; text-align:left; color:var(--ink);
          font-size:14px; border-bottom:1px solid var(--line); }
        .sb-menu-item:last-child{ border-bottom:none; }
        .sb-menu-item-icon{ color:var(--muted); flex-shrink:0; }
        .sb-menu-item-arrow{ color:var(--muted); margin-left:auto; }
        .sb-menu-item-danger{ color:var(--alert); margin-top:4px; }
        .sb-menu-item-danger span{ font-weight:500; }
        .sb-menu-profile-card{ display:flex; flex-direction:column; align-items:center; gap:8px; padding:20px 0 16px;
          border-bottom:1px solid var(--line); margin-bottom:20px; }
        .sb-menu-stat-row{ display:flex; gap:0; border:1px solid var(--line); }
        .sb-menu-stat{ flex:1; display:flex; flex-direction:column; align-items:center; padding:14px 8px;
          border-right:1px solid var(--line); }
        .sb-menu-stat:last-child{ border-right:none; }
        .sb-menu-stat-num{ font-size:22px; display:block; }
        .sb-menu-stat-label{ font-size:9px; color:var(--muted); letter-spacing:0.08em; margin-top:2px; }
        .sb-menu-sent{ display:flex; flex-direction:column; align-items:center; justify-content:center;
          flex:1; text-align:center; gap:4px; padding:20px 0; }

        /* ---- Suggestion box (public upvote list) ---- */
        .sb-suggestion-list{ display:flex; flex-direction:column; gap:8px; }
        .sb-suggestion-row{ display:flex; align-items:flex-start; gap:12px; padding:12px 14px;
          border:1px solid var(--line); background:var(--paper-light); }
        .sb-upvote-btn{ display:flex; flex-direction:column; align-items:center; gap:1px; padding:6px 10px;
          border:1px solid var(--line); background:var(--paper); color:var(--muted); cursor:pointer; flex-shrink:0;
          transition:border-color 0.15s, color 0.15s, background 0.15s; }
        .sb-upvote-btn span{ font-size:12px; font-weight:600; }
        .sb-upvote-btn:hover{ border-color:var(--gold); color:var(--gold); }
        .sb-upvote-btn-active{ border-color:var(--gold); background:var(--gold-subtle); color:var(--gold); }
        .sb-suggestion-text{ display:flex; flex-direction:column; gap:4px; flex:1; padding-top:2px; }
        .sb-suggestion-body{ font-size:13px; line-height:1.45; color:var(--ink); }
        .sb-suggestion-meta{ font-size:9.5px; color:var(--muted); letter-spacing:0.03em; }

        /* ---- Transfer / Ownership ---- */
        .sb-txcode-display{ font-size:22px; letter-spacing:0.18em; padding:16px 20px; border:1px solid var(--gold);
          background:var(--gold-subtle); color:var(--ink); text-align:center; width:100%; margin:10px 0; }
        .sb-transfer-pending{ background:var(--pending-bg); border:1px solid var(--pending); padding:14px 16px; margin-bottom:20px; }
        .sb-transfer-pending-head{ display:flex; align-items:center; font-size:11px; color:var(--pending); letter-spacing:0.06em; margin-bottom:4px; }
        .sb-ownership-chain{ display:flex; flex-direction:column; border-left:1px solid var(--line); margin-left:8px; gap:0; }
        .sb-owner-entry{ display:flex; align-items:flex-start; gap:14px; padding:12px 0 12px 18px; position:relative; border-bottom:1px solid var(--line); }
        .sb-owner-entry:last-child{ border-bottom:none; }
        .sb-owner-dot{ position:absolute; left:-5px; top:16px; width:9px; height:9px; border-radius:50%;
          background:var(--line); border:1px solid var(--paper); flex-shrink:0; }
        .sb-owner-current .sb-owner-dot{ background:var(--gold); border-color:var(--paper); }
        .sb-owner-text{ display:flex; flex-direction:column; gap:3px; }
        .sb-owner-name{ font-size:14px; }
        .sb-owner-current .sb-owner-name{ color:var(--ink); }
        .sb-owner-meta{ font-size:10px; color:var(--muted); letter-spacing:0.04em; }
        .sb-claim-preview{ background:var(--paper-light); border:1px solid var(--line); padding:16px; }
        .sb-claim-preview-head{ display:flex; align-items:center; gap:14px; }
        .sb-transfer-checklist{ display:flex; flex-direction:column; gap:10px; }
        .sb-transfer-check{ display:flex; align-items:center; font-size:13px; padding:10px 14px; background:var(--paper-light); border:1px solid var(--line); }

        /* ---- Simulated push notification banner ---- */
        .sb-push-banner{ position:absolute; top:14px; left:10px; right:10px; z-index:50;
          background:rgba(20,17,10,0.92); backdrop-filter:blur(10px); border-radius:16px;
          border:1px solid rgba(201,160,78,0.35); padding:10px 12px; display:flex; gap:10px;
          box-shadow:0 12px 28px rgba(0,0,0,0.4); cursor:pointer;
          animation:pushSlideIn 0.35s cubic-bezier(.2,.9,.3,1.3); }
        @keyframes pushSlideIn{ from{ transform:translateY(-60px); opacity:0; } to{ transform:translateY(0); opacity:1; } }
        .sb-push-icon{ width:28px; height:28px; border-radius:8px; background:var(--gold); color:#0C0B10;
          display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px; }
        .sb-push-text{ display:flex; flex-direction:column; gap:1px; flex:1; min-width:0; }
        .sb-push-top{ display:flex; justify-content:space-between; align-items:center; }
        .sb-push-app{ font-size:9px; color:var(--gold-light); letter-spacing:0.1em; }
        .sb-push-now{ font-size:9px; color:rgba(255,255,255,0.5); letter-spacing:0.04em; }
        .sb-push-title{ font-size:13px; color:#fff; font-weight:600; line-height:1.3; }
        .sb-push-body{ font-size:11.5px; color:rgba(255,255,255,0.75); line-height:1.4; font-weight:300;
          display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }

        /* ---- Export report (PDF preview / print) ---- */
        .sb-export-report{ padding:24px 20px 40px; background:var(--paper); }
        .sb-export-header{ text-align:center; padding-bottom:16px; border-bottom:2px solid var(--gold); margin-bottom:20px; }
        .sb-export-generated{ font-size:10px; color:var(--muted); letter-spacing:0.05em; }
        .sb-export-bike-card{ display:flex; flex-direction:column; gap:6px; padding:14px 16px; border:1px solid var(--line);
          background:var(--paper-light); margin-bottom:24px; }
        .sb-export-bike-name{ font-size:19px; }
        .sb-export-bike-meta-row{ display:flex; flex-wrap:wrap; gap:14px; font-size:10.5px; color:var(--muted); letter-spacing:0.03em; }
        .sb-export-section-title{ font-size:11px; color:var(--gold); letter-spacing:0.1em; margin:24px 0 10px;
          padding-bottom:6px; border-bottom:1px solid var(--line); }
        .sb-export-table{ width:100%; border-collapse:collapse; font-size:11px; }
        .sb-export-table th{ text-align:left; font-size:9px; color:var(--muted); letter-spacing:0.06em;
          padding:6px 8px; border-bottom:1px solid var(--ink); }
        .sb-export-table td{ padding:8px; border-bottom:1px solid var(--line); vertical-align:top; color:var(--ink); }
        .sb-export-table tfoot td{ border-bottom:none; border-top:2px solid var(--ink); padding-top:10px; font-weight:600; }
        .sb-export-grand-total{ display:flex; justify-content:space-between; align-items:baseline; margin-top:28px;
          padding:14px 16px; background:var(--steel); }
        .sb-export-grand-total span:first-child{ color:var(--paper); font-size:15px; font-style:italic; }
        .sb-export-grand-total-amount{ color:var(--gold-light); font-size:18px; font-weight:600; }
        .sb-export-footer{ margin-top:24px; font-size:9px; color:var(--muted); text-align:center; line-height:1.6; letter-spacing:0.02em; }

        /* ---- Print / Save as PDF ---- */
        @media print {
          body{ background:#fff !important; }
          .sb-backdrop{ background:#fff !important; padding:0 !important; min-height:0 !important; }
          .sb-caption, .sb-home-indicator, .sb-topbar, .sb-toast, .sb-push-banner,
          .sb-menu-overlay, .sb-menu-drawer, .sb-no-print{ display:none !important; }
          .sb-phone{ width:100% !important; height:auto !important; border:none !important;
            border-radius:0 !important; box-shadow:none !important; background:#fff !important; }
          .sb-phone::before{ display:none !important; }
          .sb-screen{ overflow:visible !important; height:auto !important; }
          .sb-export-report{ padding:0 !important; }
          .sb-export-table{ page-break-inside:auto; }
          .sb-export-table tr{ page-break-inside:avoid; }
        }

      `}</style>

      <div className="sb-backdrop">
        <div className="sb-phone">
          {pushNotif && (
            <div key={pushNotif.id} className="sb-push-banner" onClick={() => setPushNotif(null)}>
              <div className="sb-push-icon">
                <Bike size={15} />
              </div>
              <div className="sb-push-text">
                <div className="sb-push-top">
                  <span className="font-mono sb-push-app">SPOKEBOOK</span>
                  <span className="font-mono sb-push-now">now</span>
                </div>
                <span className="font-display sb-push-title">{pushNotif.title}</span>
                <span className="font-body sb-push-body">{pushNotif.body}</span>
              </div>
            </div>
          )}
          <div className="sb-screen">
            {renderScreen()}
            {toast && <div className="sb-toast">{toast}</div>}
            {customerName && renderMenu(false)}
            {activeShop && renderMenu(true)}
          </div>
          <div className="sb-home-indicator" />
        </div>
        <p className="sb-caption">
          PROTOTYPE — tap "I'm a rider" or "I'm a bike shop" above to explore both sides of the flow.
        </p>
      </div>
    </div>
  );
}