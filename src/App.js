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
  Trash2,
  HelpCircle,
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
  return `CZ-${part()}-${part()}`;
}

const SERVICE_INTERVAL_MONTHS = 6;

const CADENZO_TERMS = [
  {
    heading: "1. Acceptance of these Terms",
    body: "Cadenzo's website, mobile apps, and related services (the \"Services\") are provided to you (the \"User\", \"Rider\", or \"Shop\") by Cadenzo, subject to these Terms & Conditions (the \"Terms\"). By creating an account, or by accessing or using the Services in any way, you agree to be bound by these Terms. If you do not agree, please do not create an account or use the Services.",
  },
  {
    heading: "2. What Cadenzo does",
    body: "Cadenzo lets Riders register bicycles, log and verify service history, track component wear, transfer bike ownership, and message Bike Shops. Bike Shops can list a public profile, verify Riders' services and component details, and communicate with Riders directly through the app. Cadenzo may optionally connect to third-party services such as Strava to automatically calculate distance-based component wear. Cadenzo does not manufacture, sell, install, or inspect any bicycle or component, and does not guarantee the accuracy of any service history, ownership record, or wear estimate entered by a Rider or Shop.",
  },
  {
    heading: "3. Creating an account",
    body: "You must provide accurate, current information when registering, including a valid email address. Riders and Shops are each responsible for keeping their login credentials confidential and for all activity that occurs under their account. Bike Shops must provide accurate business details, including a genuine trading address, which will be shown publicly to Riders searching the Cadenzo directory. Cadenzo may refuse registration, suspend, or terminate any account it reasonably believes is fraudulent, abusive, or in breach of these Terms.",
  },
  {
    heading: "4. Rider responsibilities",
    body: "Riders are responsible for the accuracy of the bicycle details, service entries, component information, and cost figures they log. Self-logged services are clearly distinguished in the app from services verified by a Bike Shop, and Cadenzo makes no representation that a self-logged entry has been independently checked. Riders remain solely responsible for the safe mechanical condition of their bicycle; Cadenzo is a record-keeping tool, not a substitute for professional inspection or maintenance advice.",
  },
  {
    heading: "5. Bike Shop responsibilities",
    body: "Bike Shops agree to only confirm or verify services they have genuinely performed or inspected, and to keep their public profile — including address, specialities, and contact details — accurate and up to date. Verified status within Cadenzo reflects a Shop's own confirmation and is not independently audited or guaranteed by Cadenzo.",
  },
  {
    heading: "6. Ownership transfers",
    body: "Cadenzo's ownership transfer feature allows a Rider to generate a transfer code and pass a bicycle's full record to a new owner. Cadenzo maintains a chain-of-custody log for informational purposes only. This feature does not constitute a legal transfer of title, does not verify that the transferring party is the lawful owner of the bicycle, and should not be relied upon as proof of ownership in any legal, insurance, or law-enforcement context.",
  },
  {
    heading: "7. Strava and other third-party connections",
    body: "If you choose to connect a third-party service such as Strava, Cadenzo accesses only the ride and gear data required to calculate component wear, using the access you explicitly grant. Cadenzo never receives or stores your third-party account password. You may disconnect any third-party service at any time from that service's own settings, or by removing the connection within Cadenzo. Cadenzo is not responsible for the availability, accuracy, or continued support of any third-party service, and reserves the right to change or remove any third-party integration at any time.",
  },
  {
    heading: "8. Messaging and notifications",
    body: "Cadenzo facilitates direct messages between Riders and their preferred Bike Shop, and may send push notifications relating to component wear, service reminders, ownership transfers, and messages. Message content is visible to both parties in a conversation and, where relevant, may include component and bike details automatically attached by the app. Cadenzo is not responsible for the content, tone, or accuracy of messages sent by Riders or Shops.",
  },
  {
    heading: "9. Costs and currency",
    body: "Any cost figures entered against a service or component are recorded in South African Rand (ZAR) and are for the User's own personal record-keeping purposes only. Cadenzo does not process payments, does not verify entered costs against any invoice or receipt, and accepts no liability for the accuracy of exported cost totals or PDF reports.",
  },
  {
    heading: "10. Data export",
    body: "Riders may export their service history and component records as a PDF for their own use. Exported reports reflect only the information logged within Cadenzo and may not include work carried out elsewhere.",
  },
  {
    heading: "11. Fees",
    body: "Cadenzo is currently provided free of charge. Should paid plans be introduced in future, applicable fees will be clearly displayed before you are charged, and these Terms will be updated accordingly.",
  },
  {
    heading: "12. Suggestions and public content",
    body: "Content submitted to the public Suggestion Box, including upvotes, is visible to other Users. By submitting a suggestion, you grant Cadenzo a non-exclusive, royalty-free right to use, adapt, and act on that suggestion without obligation or compensation.",
  },
  {
    heading: "13. Account deletion",
    body: "You may delete your account and associated data at any time from within the app, or by contacting support@cadenzo.app. Some records, such as a bicycle's chain-of-custody history, may be retained in de-identified form where a bicycle remains registered to another User.",
  },
  {
    heading: "14. Liability",
    body: "The Services are provided \"as is\", without warranty of any kind. Cadenzo does not provide bicycle mechanical, safety, or maintenance advice, and is not liable for any accident, injury, loss, or damage arising from reliance on information stored, calculated, or displayed within the app, including service reminders, wear percentages, or verification status.",
  },
  {
    heading: "15. Changes to these Terms",
    body: "Cadenzo may update these Terms from time to time. Where changes are significant, we will make reasonable efforts to notify Users within the app. Continued use of the Services after an update constitutes acceptance of the revised Terms.",
  },
  {
    heading: "16. Contact",
    body: "Questions about these Terms can be sent to support@cadenzo.app.",
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

// Converts Strava's native distance unit (metres) to km.
// Real Strava API responses report `distance` in metres — this conversion
// must happen once, at ingestion time, not scattered across render logic.
function metersToKm(meters) {
  return meters / 1000;
}

// O(1) read: wear is derived from a component's baseKm plus whatever has
// already been synced into `syncedKm`. No ride history is summed here —
// that summing happens once, incrementally, in applyStravaRidesToBike()
// below, exactly the way a real backend would process a webhook event
// rather than recomputing a rider's entire ride history on every screen.
function getComponentKm(component) {
  return Math.round((component.baseKm || 0) + (component.syncedKm || 0));
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

// Shaped to match Strava's real Activities API: distance is reported in
// metres. Converting this to km happens once, in applyStravaRidesToBike(),
// not repeatedly wherever a ride is displayed.
const RIDES_BY_GEAR = {
  "gear-1": [
    { id: "r1", date: daysAgoISO(2), name: "Chapman's Peak climb", distanceMeters: 42300, elevationM: 610 },
    { id: "r2", date: daysAgoISO(6), name: "Sea Point promenade loop", distanceMeters: 18100, elevationM: 40 },
    { id: "r3", date: daysAgoISO(13), name: "Constantia greenbelt spin", distanceMeters: 35600, elevationM: 320 },
    { id: "r4", date: daysAgoISO(20), name: "Century City commute", distanceMeters: 12400, elevationM: 15 },
    { id: "r5", date: daysAgoISO(34), name: "Cape Point out-and-back", distanceMeters: 96200, elevationM: 780 },
  ],
  "gear-2": [
    { id: "r6", date: daysAgoISO(4), name: "Tokai forest trails", distanceMeters: 24700, elevationM: 540 },
    { id: "r7", date: daysAgoISO(11), name: "Jonkershoek climb", distanceMeters: 31200, elevationM: 890 },
    { id: "r8", date: daysAgoISO(25), name: "Constantia Nek loop", distanceMeters: 19800, elevationM: 410 },
  ],
  "gear-3": [
    { id: "r9", date: daysAgoISO(5), name: "West Coast gravel run", distanceMeters: 58400, elevationM: 290 },
    { id: "r10", date: daysAgoISO(15), name: "Darling backroads", distanceMeters: 73100, elevationM: 410 },
  ],
};

// Simulates what arrives on a Strava webhook event for a new activity —
// used by the "New activity synced" demo control to prove the incremental
// path works without needing a real Strava account connected.
let demoRideCounter = 100;
function makeDemoRide(gearId) {
  demoRideCounter += 1;
  const names = ["Signal Hill sunrise loop", "Camps Bay coastal spin", "Newlands forest climb", "Rondebosch common circuit"];
  return {
    id: `r-demo-${demoRideCounter}`,
    date: new Date().toISOString().slice(0, 10),
    name: names[demoRideCounter % names.length],
    distanceMeters: 15000 + Math.round(Math.random() * 40000),
    elevationM: 50 + Math.round(Math.random() * 500),
  };
}

// ── Incremental sync — the actual fix for the "recalculates everything on
// every render" gap. This is called (a) once when a bike is first linked
// to a gear (a one-time backfill of existing history), and (b) once per
// new ride as it arrives (simulating a webhook firing). Either way, it
// only ever processes rides not already recorded in `syncedRideIds` —
// it never re-sums a bike's entire ride history, which is what a real
// backend must do to stay fast as ride history grows into the thousands. ──
function applyStravaRidesToBike(bike, newRides) {
  const alreadySynced = new Set(bike.syncedRideIds || []);
  const unseenRides = newRides.filter((r) => !alreadySynced.has(r.id));
  if (unseenRides.length === 0) return bike;

  let addedKm = 0;
  const updatedComponents = (bike.components || []).map((comp) => {
    const installDate = new Date(comp.installedOn);
    const kmForThisComponent = unseenRides
      .filter((r) => new Date(r.date) >= installDate)
      .reduce((sum, r) => sum + metersToKm(r.distanceMeters), 0);
    return kmForThisComponent > 0
      ? { ...comp, syncedKm: (comp.syncedKm || 0) + kmForThisComponent }
      : comp;
  });

  unseenRides.forEach((r) => { addedKm += metersToKm(r.distanceMeters); });

  return {
    ...bike,
    components: updatedComponents,
    totalSyncedKm: (bike.totalSyncedKm || 0) + addedKm,
    syncedRideIds: [...(bike.syncedRideIds || []), ...unseenRides.map((r) => r.id)],
  };
}

// O(1) read — derived entirely from the bike's stored running totals.
// `kmSince` is a subtraction, not a re-filter-and-sum of ride history.
function getMileageInfo(bike) {
  if (!bike.stravaGearId) return null;
  const totalKm = bike.totalSyncedKm || 0;
  const kmSince = Math.max(0, totalKm - (bike.kmAtLastService || 0));
  let tone = "ok";
  if (kmSince > 1000) tone = "alert";
  else if (kmSince > 600) tone = "pending";
  return { kmSince: Math.round(kmSince), totalKm: Math.round(totalKm), rideCount: (bike.syncedRideIds || []).length, tone };
}

function seedBikes() {
  return [
    {
      id: "CZ-7F2K-9QXM",
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
      syncedRideIds: [],
      totalSyncedKm: 0,
      kmAtLastService: 0,
      transferCode: null,
      transferPending: false,
      isUnclaimed: false,
      ownerName: "Jesse",
      ownerEmail: "jesse@example.com",
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
      id: "CZ-3T9R-DEMO",
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
      syncedRideIds: [],
      totalSyncedKm: 0,
      kmAtLastService: 0,
      transferCode: "TX-DEMO-CODE",
      transferPending: true,
      isUnclaimed: false,
      ownerName: "Pieter van Zyl",
      ownerEmail: "pieter@example.com",
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
    {
      id: "CZ-9L4K-ORPH",
      brand: "Trek",
      model: "Domane SL5",
      color: "Matte Cyan",
      bikeType: "road",
      isEbike: false,
      serialNumber: "TRK-551029",
      detailsVerified: true,
      detailsVerifiedBy: "East City Cycles",
      detailsVerifiedAt: monthsAgoISO(20),
      stravaGearId: null,
      syncedRideIds: [],
      totalSyncedKm: 0,
      kmAtLastService: 0,
      transferCode: null,
      transferPending: false,
      isUnclaimed: true,
      ownerName: "Former rider (account deleted)",
      ownerEmail: null,
      ownershipLog: [
        { name: "Kagiso Molefe", date: monthsAgoISO(22), type: "original" },
        { name: "Account deleted — bike unclaimed", date: monthsAgoISO(1), type: "orphan-unclaimed" },
      ],
      registeredOn: monthsAgoISO(22),
      serviceLog: [
        { id: "ol-1", date: monthsAgoISO(19), type: "Full Tune-Up", notes: "Annual service, new bar tape and cables.", loggedBy: "shop", shopName: "East City Cycles", status: "verified", verifiedAt: monthsAgoISO(19) },
        { id: "ol-2", date: monthsAgoISO(8), type: "Brake Service", notes: "Front and rear brake pads replaced.", loggedBy: "shop", shopName: "East City Cycles", status: "verified", verifiedAt: monthsAgoISO(8) },
      ],
      components: [
        { id: "oc1", type: "Chain",      installedOn: monthsAgoISO(8), maxKm: 2500, baseKm: 0, brand: "Shimano", model: "105" },
        { id: "oc2", type: "Rear Tyre",  installedOn: monthsAgoISO(8), maxKm: 4000, baseKm: 0, brand: "Continental", model: "Ultra Sport" },
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
    <div className={`cz-reminder ${cls}`}>
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
    <div className={`cz-tag ${tone.cls}`}>
      <span className="cz-tag-hole">
        <Flourish size={9} />
      </span>
      <div className="cz-tag-top">
        <span className="cz-tag-type font-display">{entry.type}</span>
        <span className="cz-tag-date font-mono">{formatDate(entry.date)}</span>
      </div>
      <p className="cz-tag-notes font-body">{entry.notes}</p>
      <div className="cz-tag-bottom">
        <span className="cz-tag-status font-mono">
          <Icon size={13} style={{ marginRight: 4, verticalAlign: "-2px" }} />
          {tone.label}
        </span>
        {entry.cost != null && entry.cost > 0 && (
          <span className="cz-tag-cost font-mono">R{Number(entry.cost).toLocaleString()}</span>
        )}
        {entry.shopName && (
          <span className="cz-tag-shop font-mono">
            <Wrench size={12} style={{ marginRight: 4, verticalAlign: "-2px" }} />
            {entry.shopName}
          </span>
        )}
      </div>
      
    </div>
  );
}

function GoogleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.5-5.2l-6.2-5.3C29.3 35.4 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.6 39.6 16.3 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.2 5.3C40.9 36.6 44 30.9 44 24c0-1.3-.1-2.7-.4-3.5z"/>
    </svg>
  );
}

function AppleIcon({ size = 18, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M17.05 12.536c-.03-3.02 2.47-4.47 2.58-4.54-1.41-2.06-3.6-2.34-4.38-2.37-1.86-.19-3.63 1.1-4.57 1.1-.94 0-2.39-1.07-3.93-1.04-2.02.03-3.88 1.18-4.92 2.99-2.1 3.64-.54 9.03 1.51 11.98 1 1.44 2.2 3.06 3.77 3 1.51-.06 2.08-.98 3.9-.98 1.82 0 2.34.98 3.93.95 1.62-.03 2.65-1.47 3.64-2.92 1.15-1.67 1.62-3.29 1.65-3.37-.04-.02-3.15-1.21-3.18-4.8zM14.14 3.9c.83-1 1.39-2.4 1.24-3.79-1.2.05-2.65.8-3.51 1.8-.77.88-1.44 2.3-1.26 3.66 1.32.1 2.69-.67 3.53-1.67z"/>
    </svg>
  );
}

function SocialAuthButtons({ mode, onGoogle, onApple, disabled }) {
  return (
    <div className="cz-social-block">
      <div className="cz-social-divider">
        <span className="font-mono">OR {mode === "signup" ? "SIGN UP" : "SIGN IN"} WITH</span>
      </div>
      <button className="cz-social-btn cz-social-btn-google" onClick={onGoogle} disabled={disabled}>
        <GoogleIcon size={17} />
        <span className="font-body">Continue with Google</span>
      </button>
      <button className="cz-social-btn cz-social-btn-apple" onClick={onApple} disabled={disabled}>
        <AppleIcon size={17} />
        <span className="font-body">Continue with Apple</span>
      </button>
    </div>
  );
}

function getPasswordChecks(password) {
  const pw = password || "";
  return [
    { label: "At least 8 characters", passed: pw.length >= 8 },
    { label: "One uppercase letter", passed: /[A-Z]/.test(pw) },
    { label: "One lowercase letter", passed: /[a-z]/.test(pw) },
    { label: "One number", passed: /[0-9]/.test(pw) },
    { label: "One special character", passed: /[^A-Za-z0-9]/.test(pw) },
  ];
}

function isPasswordValid(password) {
  return getPasswordChecks(password).every((c) => c.passed);
}

function PasswordStrengthChecklist({ password }) {
  if (!password) return null;
  const checks = getPasswordChecks(password);
  const passedCount = checks.filter((c) => c.passed).length;
  const strength = passedCount <= 2 ? "weak" : passedCount <= 4 ? "medium" : "strong";
  return (
    <div className="cz-pw-checklist">
      <div className="cz-pw-strength-track">
        <div className={`cz-pw-strength-fill cz-pw-strength-${strength}`} style={{ width: `${(passedCount / checks.length) * 100}%` }} />
      </div>
      <div className="cz-pw-checks-grid">
        {checks.map((c, i) => (
          <div key={i} className={`cz-pw-check ${c.passed ? "cz-pw-check-pass" : ""}`}>
            {c.passed ? <CheckCircle2 size={12} /> : <Circle size={12} />}
            <span className="font-mono">{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopBar({ title, onBack, right }) {
  return (
    <div className="cz-topbar">
      {onBack ? (
        <button className="cz-iconbtn" onClick={onBack} aria-label="Back">
          <ChevronLeft size={20} />
        </button>
      ) : (
        <span className="cz-iconbtn-spacer" />
      )}
      <h1 className="cz-topbar-title font-display">{title}</h1>
      <div className="cz-topbar-right">{right}</div>
    </div>
  );
}

function EmptyState({ Icon, title, body }) {
  return (
    <div className="cz-empty">
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
    <div className="cz-wear-track" style={{ background: bgColor }}>
      <div className="cz-wear-fill" style={{ width: `${Math.min(pct, 100)}%`, background: color }} />
    </div>
  );
}

function ComponentCard({ comp, stravaGearId, onContact }) {
  const km = getComponentKm(comp);
  const pct = Math.round((km / comp.maxKm) * 100);
  const tone = getWearTone(pct);
  const alertColor = { ok: "var(--verified)", pending: "var(--pending)", alert: "var(--alert)" }[tone];
  return (
    <div className={`cz-comp-card comp--${tone}`}>
      <div className="cz-comp-top">
        <div>
          <span className="font-display cz-comp-type">{comp.type}</span>
          {comp.brand && (
            <span className="font-mono cz-comp-brand">{comp.brand} {comp.model}</span>
          )}
        </div>
        <div className="cz-comp-km-badge" style={{ color: alertColor }}>
          <span className="font-display cz-comp-pct">{pct}%</span>
        </div>
      </div>
      <ComponentWearBar pct={pct} tone={tone} />
      <div className="cz-comp-footer">
        <span className="font-mono cz-comp-meta">{km} / {comp.maxKm} km</span>
        <span className="font-mono cz-comp-meta">Since {formatDate(comp.installedOn)}</span>
        {comp.cost != null && comp.cost > 0 && (
          <span className="font-mono cz-comp-meta cz-comp-cost">R{Number(comp.cost).toLocaleString()}</span>
        )}
      </div>
      {pct >= 65 && (
        <div className={`cz-comp-alert font-mono comp-alert--${tone}`}>
          {pct >= 90 ? <AlertTriangle size={12} style={{ marginRight: 5 }} /> : <Clock size={12} style={{ marginRight: 5 }} />}
          {pct >= 90 ? "Needs replacement soon" : "Service due soon"}
        </div>
      )}
      {onContact && (
        <button className="cz-comp-message-btn font-mono" onClick={onContact}>
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
  const [isStandalone] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator?.standalone === true;
  });
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
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [unclaimedBikeId, setUnclaimedBikeId] = useState(null);
  const [claimOnBehalfForm, setClaimOnBehalfForm] = useState({ name: "", email: "" });
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
    { id: "n1", type: "wear",    read: false, ts: daysAgoISO(1),  title: "Chain nearing limit",            body: "Your Shimano CN-HG601 on the Specialized Roubaix is at 83% wear. Consider booking a service soon.",         bikeId: "CZ-7F2K-9QXM", compType: "Chain" },
    { id: "n2", type: "wear",    read: false, ts: daysAgoISO(2),  title: "Cassette — attention needed",    body: "Shimano 105 R7000 has exceeded 85% of its recommended lifespan. Replacing now protects your chainring.",   bikeId: "CZ-7F2K-9QXM", compType: "Cassette" },
    { id: "n3", type: "service", read: true,  ts: daysAgoISO(4),  title: "Service verified",               body: "East City Cycles confirmed your Tyre Change on the Specialized Roubaix.",                                   bikeId: "CZ-7F2K-9QXM", compType: null },
    { id: "n4", type: "shop",    read: true,  ts: daysAgoISO(6),  title: "Shop notification sent",         body: "East City Cycles were alerted about your Rear Tyre wear (88%). They'll be in touch to book you in.",         bikeId: "CZ-7F2K-9QXM", compType: "Rear Tyre" },
    { id: "n5", type: "message", read: true,  ts: daysAgoISO(9),  title: "Message sent to East City Cycles", body: "Your message about your Brake Pads was sent. The shop will respond via email or phone.",                  bikeId: "CZ-7F2K-9QXM", compType: "Brake Pads" },
    { id: "n6", type: "service", read: true,  ts: daysAgoISO(14), title: "Service verified",               body: "Two Wheels Workshop confirmed your Brake Service on the Specialized Roubaix.",                            bikeId: "CZ-7F2K-9QXM", compType: null },
    { id: "n7", type: "transfer",read: true,  ts: daysAgoISO(30), title: "Transfer complete",              body: "The Canyon Grail CF SL was transferred to your account from Pieter van Zyl.",                             bikeId: "CZ-3T9R-DEMO",  compType: null },
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
    const uid = `cadenzo-${bike.id}-${info.nextDue}@cadenzo.app`;
    const summary = `Cadenzo: ${bike.brand} ${bike.model} service due`;
    const description = `Your ${bike.brand} ${bike.model} (${bike.id}) is due for its next service. Recommended interval: every ${SERVICE_INTERVAL_MONTHS} months since your last logged service.`;
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Cadenzo//Service Reminder//EN",
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
      "DESCRIPTION:Cadenzo service reminder",
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

  function handleSocialAuth(provider, mode) {
    const providerName = provider === "google" ? "Google" : "Apple";
    const placeholderEmail = provider === "google" ? "rider@gmail.com" : "rider@icloud.com";
    setCustomerName(`${providerName} User`);
    setCustomerEmail(placeholderEmail);
    setRiderTermsAccepted(false);
    setNameDraft("");
    setEmailDraft("");
    setPasswordDraft("");
    setSignInEmail("");
    setSignInPassword("");
    setScreen("customer-home");
    setTimeout(() => showToast(`${mode === "signup" ? "Account created" : "Signed in"} with ${providerName}`), 300);
  }

  function confirmDeleteAccount(isShopAccount) {
    if (isShopAccount) {
      showToast("Your shop account has been deleted");
      logoutShop();
    } else {
      // Bikes are never deleted with the account — they persist as unclaimed
      // so their service history and chain of custody survive, and a new
      // owner can later have the bike claimed on their behalf by a shop.
      setBikes((prev) =>
        prev.map((b) =>
          b.ownerEmail === customerEmail
            ? {
                ...b,
                isUnclaimed: true,
                transferCode: null,
                transferPending: false,
                ownerName: "Former rider (account deleted)",
                ownerEmail: null,
                ownershipLog: [
                  ...(b.ownershipLog || []),
                  { name: "Account deleted — bike unclaimed", date: new Date().toISOString().slice(0, 10), type: "orphan-unclaimed" },
                ],
              }
            : b
        )
      );
      showToast("Your account and data have been deleted");
      logoutCustomer();
    }
    setDeleteConfirmText("");
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
    if (!nameDraft.trim() || !emailDraft.trim() || !isPasswordValid(passwordDraft)) return;
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
    if (!name.trim() || !email.trim() || !address.trim() || !area.trim() || !specialties.trim() || !isPasswordValid(shopAuthPassword)) return;
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
    if (!shopAuthSelectedId || !shopSignupForm.address.trim() || !shopSignupForm.area.trim() || !shopSignupForm.specialties.trim() || !isPasswordValid(shopAuthPassword)) return;
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
      syncedRideIds: [],
      totalSyncedKm: 0,
      kmAtLastService: 0,
      transferCode: null,
      transferPending: false,
      isUnclaimed: false,
      ownerName: customerName,
      ownerEmail: customerEmail,
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
      prev.map((b) =>
        b.id === selectedBike.id
          ? { ...b, serviceLog: [...b.serviceLog, entry], kmAtLastService: b.totalSyncedKm || 0 }
          : b
      )
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
      syncedKm: 0,
      cost: compForm.cost.trim() ? Number(compForm.cost) : null,
    };
    // One-time backfill: if this bike is already Strava-linked with ride
    // history, credit this new component for rides already synced since
    // its install date — a single computation at creation time, not a
    // recurring recalculation.
    if (selectedBike.stravaGearId) {
      const allRides = RIDES_BY_GEAR[selectedBike.stravaGearId] || [];
      const alreadySynced = new Set(selectedBike.syncedRideIds || []);
      const installDate = new Date(comp.installedOn);
      comp.syncedKm = allRides
        .filter((r) => alreadySynced.has(r.id) && new Date(r.date) >= installDate)
        .reduce((sum, r) => sum + metersToKm(r.distanceMeters), 0);
    }
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
              ownerEmail: customerEmail,
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

  function submitClaimOnBehalf() {
    if (!unclaimedBikeId || !claimOnBehalfForm.name.trim() || !claimOnBehalfForm.email.trim()) return;
    const shopName = activeShop?.name || "Shop";
    setBikes((prev) =>
      prev.map((b) =>
        b.id === unclaimedBikeId
          ? {
              ...b,
              isUnclaimed: false,
              ownerName: claimOnBehalfForm.name.trim(),
              ownerEmail: claimOnBehalfForm.email.trim().toLowerCase(),
              detailsVerified: true,
              detailsVerifiedBy: shopName,
              detailsVerifiedAt: new Date().toISOString().slice(0, 10),
              ownershipLog: [
                ...(b.ownershipLog || []),
                {
                  name: claimOnBehalfForm.name.trim(),
                  date: new Date().toISOString().slice(0, 10),
                  type: "orphan-claim",
                  verifiedByShop: shopName,
                },
              ],
            }
          : b
      )
    );
    setClaimOnBehalfForm({ name: "", email: "" });
    setUnclaimedBikeId(null);
    showToast("Bike claimed and assigned to new owner");
    setScreen("shop-unclaimed-bikes");
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
    setBikes((prev) =>
      prev.map((b) => {
        if (b.id !== bikeId) return b;
        // One-time backfill: process whatever ride history already exists
        // for this gear. After this, every subsequent update is purely
        // incremental — new rides only, never a full re-sum.
        const existingRides = RIDES_BY_GEAR[gearId] || [];
        const linked = { ...b, stravaGearId: gearId, syncedRideIds: [], totalSyncedKm: 0 };
        return applyStravaRidesToBike(linked, existingRides);
      })
    );
    showToast("Strava bike linked");
  }

  function unlinkBikeFromGear(bikeId) {
    setBikes((prev) => prev.map((b) => (b.id === bikeId ? { ...b, stravaGearId: null } : b)));
    showToast("Strava bike unlinked");
  }

  // Simulates one new activity arriving via Strava's webhook. Only this
  // single ride is processed — the fix for the "recalculates the whole
  // history on every render" gap is that this never touches past rides.
  function syncNewStravaRide(bikeId) {
    const bike = bikes.find((b) => b.id === bikeId);
    if (!bike || !bike.stravaGearId) return;
    const newRide = makeDemoRide(bike.stravaGearId);
    RIDES_BY_GEAR[bike.stravaGearId] = [newRide, ...(RIDES_BY_GEAR[bike.stravaGearId] || [])];
    setBikes((prev) =>
      prev.map((b) => (b.id === bikeId ? applyStravaRidesToBike(b, [newRide]) : b))
    );
    const km = Math.round(metersToKm(newRide.distanceMeters));
    showToast(`New ride synced — ${km} km added`);
    showPushNotification("New Strava activity synced", `"${newRide.name}" (${km} km) has been added to your component wear.`);
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
      prev.map((b) =>
        b.id === lookupBike.id
          ? { ...b, serviceLog: [...b.serviceLog, entry], kmAtLastService: b.totalSyncedKm || 0 }
          : b
      )
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
      <div className="cz-shop-search-wrap">
        {!compact && <label className="cz-label font-mono">{label} <span style={{ color: "var(--muted)", fontWeight: 400 }}>(optional)</span></label>}
        {compact && <label className="cz-label font-mono">{label}</label>}
        <p className="cz-helper font-body" style={{ marginBottom: 10 }}>{sublabel}</p>

        {selected ? (
          <div className="cz-shop-selected-row">
            <div className="cz-shop-select-icon" style={{ width: 32, height: 32, flexShrink: 0 }}>
              <CheckCircle2 size={16} style={{ color: "var(--gold-light)" }} />
            </div>
            <div className="cz-shop-select-text">
              <span className="font-display cz-shop-select-name">{selected.name}</span>
              <span className="font-mono cz-shop-select-area">{selected.area}</span>
              {selected.address && (
                <span className="font-mono cz-shop-select-address">{selected.address}</span>
              )}
            </div>
            <button
              className="cz-shop-clear font-mono"
              onClick={() => { setPreferredShopId(null); setNotifyShopOnWear(false); setShopSearchQuery(""); }}
            >
              Change
            </button>
          </div>
        ) : (
          <div className="cz-shop-search-field-wrap">
            <div className="cz-shop-search-field">
              <Search size={14} className="cz-shop-search-icon" />
              <input
                className="cz-shop-search-input font-body"
                placeholder="Search by name, area or speciality…"
                value={shopSearchQuery}
                onChange={(e) => setShopSearchQuery(e.target.value)}
                onFocus={() => setShopSearchFocused(true)}
                onBlur={() => setTimeout(() => setShopSearchFocused(false), 150)}
              />
              {shopSearchQuery && (
                <button className="cz-shop-search-clear" onClick={() => setShopSearchQuery("")}>
                  <X size={13} />
                </button>
              )}
            </div>

            {showDropdown && (
              <div className="cz-shop-dropdown">
                {results.length === 0 ? (
                  <div className="cz-shop-dropdown-empty font-mono">No shops found — try a different name or area</div>
                ) : (
                  results.map((s) => (
                    <button
                      key={s.id}
                      className="cz-shop-dropdown-item"
                      onMouseDown={() => {
                        setPreferredShopId(s.id);
                        setNotifyShopOnWear(true);
                        setShopSearchQuery("");
                        setShopSearchFocused(false);
                      }}
                    >
                      <div className="cz-shop-dropdown-icon"><Store size={14} /></div>
                      <div className="cz-shop-dropdown-text">
                        <span className="font-display cz-shop-dropdown-name">{s.name}</span>
                        <span className="font-mono cz-shop-dropdown-area">
                          <MapPin size={10} style={{ marginRight: 3, verticalAlign: "-1px" }} />
                          {s.area}
                        </span>
                        {s.address && (
                          <span className="font-mono cz-shop-dropdown-address">{s.address}</span>
                        )}
                        <span className="font-mono cz-shop-dropdown-tags">
                          {s.specialties.slice(0, 2).join(" · ")}
                        </span>
                      </div>
                      <span className="cz-shop-dropdown-rating font-mono">
                        <Star size={10} fill="currentColor" style={{ marginRight: 2, verticalAlign: "-1px" }} />
                        {s.rating}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}

            {!showDropdown && !shopSearchQuery && (
              <div className="cz-shop-search-hint font-mono">
                Try "MTB", "Sea Point", "e-bike", or a shop name
              </div>
            )}
          </div>
        )}

        {preferredShopId && (
          <>
            <div className="cz-notify-toggle-row" style={{ marginTop: 12 }} onClick={() => setNotifyShopOnWear(!notifyShopOnWear)}>
              <div style={{ flex: 1 }}>
                <span className="font-body cz-notify-label">Notify shop at 80% component wear</span>
                <span className="font-mono cz-notify-sub">
                  {getAllShops().find(s => s.id === preferredShopId)?.name} receives an alert so they can prepare parts in advance
                </span>
              </div>
              <div className={`cz-toggle-switch ${notifyShopOnWear ? "cz-toggle-switch-on" : ""}`}>
                <div className="cz-toggle-knob" />
              </div>
            </div>
            {notifyShopOnWear && (
              <div className="cz-notify-active-badge font-mono">
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
    const km = bike ? getComponentKm(comp) : 0;
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
        <div className="cz-menu-overlay" onClick={() => setMenuOpen(false)} />
        <div className="cz-menu-drawer">
          <div className="cz-menu-header">
            {menuView === "thread" ? (
              <button className="cz-iconbtn" onClick={() => { setMenuView("notifications"); setActiveThreadId(null); }}><ChevronLeft size={18} /></button>
            ) : menuView === "suggestion-new" ? (
              <button className="cz-iconbtn" onClick={() => { setSuggestionText(""); setMenuView("suggestion"); }}><ChevronLeft size={18} /></button>
            ) : menuView === "delete-account" ? (
              <button className="cz-iconbtn" onClick={() => setMenuView("profile")}><ChevronLeft size={18} /></button>
            ) : menuView !== "main" ? (
              <button className="cz-iconbtn" onClick={() => setMenuView("main")}><ChevronLeft size={18} /></button>
            ) : <span className="cz-iconbtn-spacer" />}
            <span className="cz-menu-title font-display">
              {menuView === "main" ? "Menu"
                : menuView === "profile" ? "Profile"
                : menuView === "notifications" ? "Notifications"
                : menuView === "suggestion" ? "Suggestion Box"
                : menuView === "suggestion-new" ? "New Suggestion"
                : menuView === "delete-account" ? "Delete Account"
                : menuView === "thread" ? (
                    isShop
                      ? messageThreads[activeThreadId]?.riderName || "Conversation"
                      : getAllShops().find(s => s.id === messageThreads[activeThreadId]?.shopId)?.name || "Conversation"
                  )
                : "Menu"}
            </span>
            <button className="cz-iconbtn" onClick={() => setMenuOpen(false)}><X size={18} /></button>
          </div>

          {menuView === "main" && (
            <div className="cz-menu-body">
              <div className="cz-menu-identity">
                {isShop && activeShop
                  ? <ShopAvatar shop={activeShop} size={40} fontSize={16} />
                  : <div className="cz-menu-avatar font-display">{(name || "?")[0].toUpperCase()}</div>
                }
                <div>
                  <span className="cz-menu-name font-display">{name}</span>
                  <span className="cz-menu-subtitle font-mono">{subtitle}</span>
                </div>
              </div>
              <div className="cz-menu-divider" />
              <button className="cz-menu-item" onClick={() => setMenuView("profile")}>
                <User size={16} className="cz-menu-item-icon" />
                <span className="font-body">Profile details</span>
                <ChevronRight size={15} className="cz-menu-item-arrow" />
              </button>
              <button className="cz-menu-item" onClick={() => { if (!isShop) markAllRead(); setNotifSubTab(notifSubTab); setMenuView("notifications"); }}>
                <Bell size={16} className="cz-menu-item-icon" />
                <span className="font-body">Notifications</span>
                {(isShop ? shopThreadUnread : unreadCount + riderThreadUnread) > 0 && (
                  <span className="cz-menu-notif-badge font-mono">{isShop ? shopThreadUnread : unreadCount + riderThreadUnread}</span>
                )}
                <ChevronRight size={15} className="cz-menu-item-arrow" />
              </button>
              <button className="cz-menu-item" onClick={() => setMenuView("suggestion")}>
                <Send size={16} className="cz-menu-item-icon" />
                <span className="font-body">Suggestion box</span>
                <ChevronRight size={15} className="cz-menu-item-arrow" />
              </button>
              <div className="cz-menu-divider" />
              <button className="cz-menu-item cz-menu-item-danger" onClick={() => { setMenuOpen(false); isShop ? logoutShop() : logoutCustomer(); }}>
                <span className="font-body">Log out</span>
              </button>
            </div>
          )}

          {menuView === "profile" && (
            <div className="cz-menu-body">
              <div className="cz-menu-profile-card">
                {isShop && activeShop ? (
                  <ShopAvatar shop={activeShop} size={60} fontSize={22} />
                ) : (
                  <div className="cz-menu-avatar cz-menu-avatar-lg font-display">{(name || "?")[0].toUpperCase()}</div>
                )}
                <span className="cz-menu-name font-display" style={{ fontSize: 20 }}>{name}</span>
                {!isShop && customerEmail && (
                  <span className="cz-menu-subtitle font-mono">{customerEmail}</span>
                )}
                <span className="cz-menu-subtitle font-mono" style={{ marginTop: !isShop && customerEmail ? 2 : 0 }}>{subtitle}</span>
              </div>

              {!isShop && (
                <>
                  <div className="cz-menu-stat-row">
                    <div className="cz-menu-stat">
                      <span className="font-display cz-menu-stat-num">{bikes.length}</span>
                      <span className="font-mono cz-menu-stat-label">BIKES</span>
                    </div>
                    <div className="cz-menu-stat">
                      <span className="font-display cz-menu-stat-num">{bikes.reduce((n, b) => n + b.serviceLog.length, 0)}</span>
                      <span className="font-mono cz-menu-stat-label">LOGS</span>
                    </div>
                    <div className="cz-menu-stat">
                      <span className="font-display cz-menu-stat-num">{bikes.reduce((n, b) => n + (b.components || []).length, 0)}</span>
                      <span className="font-mono cz-menu-stat-label">PARTS</span>
                    </div>
                  </div>

                  <label className="cz-label font-mono" style={{ marginTop: 22 }}>PREFERRED BIKE SHOP</label>
                  {renderShopSearch({ label: "", sublabel: "Your preferred shop can be notified when components are nearing their service limit.", compact: true })}

                  <label className="cz-label font-mono" style={{ marginTop: 22 }}>CALENDAR</label>
                  <div className="cz-notify-toggle-row" onClick={() => setCalendarSyncEnabled(!calendarSyncEnabled)}>
                    <div style={{ flex: 1 }}>
                      <span className="font-body cz-notify-label">Sync service reminders to calendar</span>
                      <span className="font-mono cz-notify-sub">
                        Adds an "Add to calendar" option on each bike so reminders show up in your phone's calendar app
                      </span>
                    </div>
                    <div className={`cz-toggle-switch ${calendarSyncEnabled ? "cz-toggle-switch-on" : ""}`}>
                      <div className="cz-toggle-knob" />
                    </div>
                  </div>
                  {calendarSyncEnabled && (
                    <div className="cz-notify-active-badge font-mono">
                      <CheckCircle2 size={12} style={{ marginRight: 6, flexShrink: 0 }} />
                      Active — open any bike and tap "Add to calendar" to download the reminder
                    </div>
                  )}
                </>
              )}

              {isShop && activeShop && (
                <>
                  <label className="cz-label font-mono">PROFILE PICTURE</label>
                  <p className="cz-helper font-body" style={{ marginBottom: 12 }}>
                    Upload a photo or logo for your shop. Riders will see this in the shop directory and on your profile page.
                  </p>

                  {/* Current picture / upload area */}
                  {getShopAvatar(activeShop.id)?.imageDataUrl ? (
                    <div className="cz-upload-preview">
                      <img
                        src={getShopAvatar(activeShop.id).imageDataUrl}
                        alt="Shop profile"
                        style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--gold)", flexShrink: 0 }}
                      />
                      <div className="cz-upload-preview-text">
                        <span className="font-body" style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 4 }}>
                          {getShopAvatar(activeShop.id).fileName || "Profile picture"}
                        </span>
                        <span className="font-mono" style={{ fontSize: 10, color: "var(--verified)", display: "block", marginBottom: 8 }}>✓ Visible to riders</span>
                        <label className="cz-upload-change-btn font-mono">
                          Change photo
                          <input type="file" accept="image/*" style={{ display: "none" }}
                            onChange={(e) => handleShopImageUpload(activeShop.id, e.target.files[0])} />
                        </label>
                        <button className="cz-upload-remove-btn font-mono"
                          onClick={() => { setShopAvatars((prev) => { const n = { ...prev }; delete n[activeShop.id]; return n; }); showToast("Profile picture removed"); }}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="cz-upload-dropzone">
                      <input type="file" accept="image/*" style={{ display: "none" }}
                        onChange={(e) => handleShopImageUpload(activeShop.id, e.target.files[0])} />
                      <div className="cz-upload-dropzone-inner">
                        <div className="cz-upload-icon">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                          </svg>
                        </div>
                        <span className="font-body cz-upload-label">Tap to upload a photo or logo</span>
                        <span className="font-mono cz-upload-hint">JPG, PNG or GIF · max 5 MB</span>
                      </div>
                    </label>
                  )}

                  {/* Colour fallback */}
                  {!getShopAvatar(activeShop.id)?.imageDataUrl && (
                    <>
                      <p className="cz-helper font-body" style={{ marginTop: 16, marginBottom: 8 }}>
                        No photo yet? Choose a profile colour to use in the meantime.
                      </p>
                      <div className="cz-avatar-color-grid">
                        {SHOP_AVATAR_COLORS.map((c) => {
                          const current = getShopAvatar(activeShop.id);
                          const isActive = current?.bg === c.bg;
                          return (
                            <button key={c.bg}
                              className={`cz-avatar-color-swatch ${isActive ? "cz-avatar-color-swatch-active" : ""}`}
                              style={{ background: c.bg }} title={c.label}
                              onClick={() => setShopAvatar(activeShop.id, c)}>
                              {isActive && <CheckCircle2 size={14} style={{ color: "var(--gold-light)" }} />}
                            </button>
                          );
                        })}
                        <button
                          className={`cz-avatar-color-swatch ${!getShopAvatar(activeShop.id) ? "cz-avatar-color-swatch-active" : ""}`}
                          style={{ background: "var(--steel)" }} title="Default"
                          onClick={() => setShopAvatars((prev) => { const n = { ...prev }; delete n[activeShop.id]; return n; })}>
                          {!getShopAvatar(activeShop.id) && <CheckCircle2 size={14} style={{ color: "var(--gold-light)" }} />}
                        </button>
                      </div>
                    </>
                  )}

                  {/* Preview row when a colour is set */}
                  {getShopAvatar(activeShop.id)?.bg && !getShopAvatar(activeShop.id)?.imageDataUrl && (
                    <div className="cz-avatar-preview">
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

              <div className="cz-danger-zone">
                <label className="cz-label font-mono" style={{ color: "var(--alert)" }}>DANGER ZONE</label>
                <button
                  className="cz-delete-account-btn"
                  onClick={() => { setDeleteConfirmText(""); setMenuView("delete-account"); }}
                >
                  <Trash2 size={15} style={{ marginRight: 8, flexShrink: 0 }} />
                  <span className="font-body">Delete account</span>
                </button>
                <p className="cz-helper font-body" style={{ marginTop: 8 }}>
                  Permanently deletes your account and data. This cannot be undone.
                </p>
              </div>
            </div>
          )}

          {menuView === "delete-account" && (
            <div className="cz-menu-body">
              <div className="cz-delete-warning">
                <AlertTriangle size={24} style={{ color: "var(--alert)", marginBottom: 10 }} />
                <span className="font-display cz-delete-warning-title">This can't be undone</span>
                <p className="font-body cz-delete-warning-body">
                  {isShop
                    ? "Deleting your shop account permanently removes your public profile, message threads, and service verifications from Cadenzo. Riders who have you set as their preferred shop will need to choose a new one."
                    : "Deleting your account permanently removes your bikes, service history, components, message threads, and any pending ownership transfers from Cadenzo. This does not affect bikes you've already transferred to another rider."}
                </p>
              </div>

              <label className="cz-label font-mono">TYPE "DELETE" TO CONFIRM</label>
              <input
                className="cz-input font-body"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                autoFocus
              />

              <button
                className="cz-btn cz-btn-danger cz-btn-block"
                style={{ marginTop: 14 }}
                disabled={deleteConfirmText.trim().toUpperCase() !== "DELETE"}
                onClick={() => confirmDeleteAccount(isShop)}
              >
                <Trash2 size={15} style={{ marginRight: 8 }} />
                Permanently delete my account
              </button>
              <button
                className="cz-btn cz-btn-secondary cz-btn-block"
                style={{ marginTop: 8 }}
                onClick={() => setMenuView("profile")}
              >
                Cancel
              </button>
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
              <div className="cz-menu-body" style={{ paddingBottom: 90 }}>
                <p className="cz-helper font-body">
                  See what other riders and shops want next, and upvote the ideas you'd love too.
                </p>
                <div className="cz-shop-search-field" style={{ marginBottom: 14 }}>
                  <Search size={14} className="cz-shop-search-icon" />
                  <input
                    className="cz-shop-search-input font-body"
                    placeholder="Search suggestions…"
                    value={suggestionSearch}
                    onChange={(e) => setSuggestionSearch(e.target.value)}
                  />
                  {suggestionSearch && (
                    <button className="cz-shop-search-clear" onClick={() => setSuggestionSearch("")}>
                      <X size={13} />
                    </button>
                  )}
                </div>

                {noMatches && (
                  <p className="cz-helper font-body" style={{ marginBottom: 10 }}>
                    No matching suggestions yet — be the first to add it.
                  </p>
                )}

                <div className="cz-suggestion-list">
                  {sorted.map((s) => {
                    const voted = mySuggestionVotes.includes(s.id);
                    return (
                      <div key={s.id} className="cz-suggestion-row">
                        <button
                          className={`cz-upvote-btn ${voted ? "cz-upvote-btn-active" : ""}`}
                          onClick={() => toggleSuggestionVote(s.id)}
                        >
                          <ChevronUp size={15} />
                          <span className="font-mono">{s.votes}</span>
                        </button>
                        <div className="cz-suggestion-text">
                          <span className="font-body cz-suggestion-body">{s.text}</span>
                          <span className="font-mono cz-suggestion-meta">{s.author} · {formatDate(s.ts)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  className="cz-btn cz-btn-outline cz-btn-block"
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
            <div className="cz-menu-body">
              <p className="cz-helper font-body">
                Add your idea to the public list. Other riders and shops will be able to see and upvote it.
              </p>
              <label className="cz-label font-mono">YOUR SUGGESTION</label>
              <textarea
                className="cz-input cz-textarea font-body"
                rows={5}
                value={suggestionText}
                onChange={(e) => setSuggestionText(e.target.value)}
                placeholder="e.g. I'd love a dark mode, or the transfer flow confused me when..."
                autoFocus
              />
              <button
                className="cz-btn cz-btn-primary cz-btn-block"
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
              <div className="cz-notif-panel">
                <div className="cz-notif-tabs">
                  <button className={`cz-notif-tab ${notifSubTab === "alerts" ? "cz-notif-tab-active" : ""}`} onClick={() => setNotifSubTab("alerts")}>
                    Alerts {!isShop && unreadCount > 0 && <span className="cz-notif-tab-dot" />}
                  </button>
                  <button className={`cz-notif-tab ${notifSubTab === "messages" ? "cz-notif-tab-active" : ""}`} onClick={() => setNotifSubTab("messages")}>
                    Messages {(isShop ? shopThreadUnread : riderThreadUnread) > 0 && <span className="cz-notif-tab-dot" />}
                  </button>
                </div>

                {notifSubTab === "alerts" && (
                  alertList.length === 0 ? (
                    <div className="cz-menu-body">
                      <EmptyState Icon={Bell} title="No alerts yet" body={isShop ? "Wear and service alerts will appear here." : "Wear alerts, service confirmations and transfers will appear here."} />
                    </div>
                  ) : (
                    <div className="cz-notif-list">
                      {alertList.map((n) => {
                        const { Icon, color, bg } = iconMap[n.type] || iconMap.service;
                        return (
                          <div key={n.id} className={`cz-notif-item ${!n.read ? "cz-notif-unread" : ""}`}>
                            <div className="cz-notif-icon" style={{ background: bg, color }}>
                              <Icon size={14} />
                            </div>
                            <div className="cz-notif-text">
                              <span className="font-display cz-notif-title">{n.title}</span>
                              <span className="font-body cz-notif-body">{n.body}</span>
                              <span className="font-mono cz-notif-date">{formatDate(n.ts)}</span>
                            </div>
                            {!n.read && <span className="cz-notif-dot" />}
                          </div>
                        );
                      })}
                    </div>
                  )
                )}

                {notifSubTab === "messages" && (
                  threadList.length === 0 ? (
                    <div className="cz-menu-body">
                      <EmptyState Icon={MessageSquare} title="No conversations yet" body={isShop ? "Messages from riders will appear here as threads." : "Message your preferred shop from any component to start a conversation."} />
                    </div>
                  ) : (
                    <div className="cz-thread-list">
                      {threadList.map((t) => {
                        const lastMsg = t.messages[t.messages.length - 1];
                        const unread = threadUnread(t, isShop ? "shop" : "rider");
                        const shop = getAllShops().find(s => s.id === t.shopId);
                        const counterpartName = isShop ? t.riderName : shop?.name;
                        return (
                          <button
                            key={t.tid}
                            className={`cz-thread-row ${unread > 0 ? "cz-thread-row-unread" : ""}`}
                            onClick={() => { markThreadRead(t.tid, isShop ? "shop" : "rider"); setActiveThreadId(t.tid); setMenuView("thread"); }}
                          >
                            {isShop ? (
                              <div className="cz-menu-avatar" style={{ width: 38, height: 38, fontSize: 15 }}>
                                {(t.riderName || "?")[0].toUpperCase()}
                              </div>
                            ) : shop ? (
                              <ShopAvatar shop={shop} size={38} fontSize={15} />
                            ) : (
                              <div className="cz-menu-avatar" style={{ width: 38, height: 38 }}><Store size={16} /></div>
                            )}
                            <div className="cz-thread-row-text">
                              <div className="cz-thread-row-top">
                                <span className="font-display cz-thread-row-name">{counterpartName}</span>
                                <span className="font-mono cz-thread-row-date">{lastMsg ? formatDate(lastMsg.ts) : ""}</span>
                              </div>
                              <span className="font-body cz-thread-row-preview">
                                {lastMsg?.sender === "shop" && isShop ? "You: " : lastMsg?.sender === "rider" && !isShop ? "You: " : ""}
                                {lastMsg?.text}
                              </span>
                              {lastMsg?.compType && (
                                <span className="font-mono cz-thread-row-comp">Re: {lastMsg.compType}</span>
                              )}
                            </div>
                            {unread > 0 && <span className="cz-notif-dot" style={{ position: "static", flexShrink: 0 }} />}
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
            if (!thread) return <div className="cz-menu-body"><EmptyState Icon={MessageSquare} title="Conversation not found" body="This thread may have been removed." /></div>;
            const shop = getAllShops().find(s => s.id === thread.shopId);
            return (
              <div className="cz-thread-detail">
                <div className="cz-thread-messages">
                  {thread.messages.map((m) => {
                    const fromMe = isShop ? m.sender === "shop" : m.sender === "rider";
                    return (
                      <div key={m.id} className={`cz-bubble-row ${fromMe ? "cz-bubble-row-me" : ""}`}>
                        <div className={`cz-bubble ${fromMe ? "cz-bubble-me" : "cz-bubble-them"}`}>
                          {m.compType && (
                            <div className="cz-bubble-comp-card">
                              <div className="cz-notif-comp-top">
                                <span className="font-display cz-notif-comp-type">{m.compType}</span>
                                {m.compPct !== null && m.compPct !== undefined && (
                                  <span className="font-mono cz-notif-comp-pct" style={{ color: m.compPct >= 90 ? "var(--alert)" : m.compPct >= 65 ? "var(--pending)" : "var(--verified)" }}>
                                    {m.compPct}% worn
                                  </span>
                                )}
                              </div>
                              <span className="font-mono cz-notif-comp-meta">
                                {m.compBrand} {m.compModel}{m.bikeLabel ? ` · ${m.bikeLabel}` : ""}
                              </span>
                              {m.compKm != null && m.compMaxKm != null && (
                                <span className="font-mono cz-notif-comp-meta">{m.compKm} / {m.compMaxKm} km</span>
                              )}
                            </div>
                          )}
                          <span className="font-body cz-bubble-text">{m.text}</span>
                          <span className="font-mono cz-bubble-time">{formatDate(m.ts)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="cz-thread-input-row">
                  <textarea
                    className="cz-input cz-textarea font-body cz-thread-input"
                    rows={2}
                    value={threadReplyDraft}
                    onChange={(e) => setThreadReplyDraft(e.target.value)}
                    placeholder={isShop ? `Reply to ${thread.riderName || "rider"}…` : `Message ${shop?.name || "shop"}…`}
                  />
                  <button
                    className="cz-thread-send-btn"
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
          <div className="cz-screen-pad cz-center-col">
            <div className="cz-brandmark">
              <Bike size={32} />
            </div>
            <div className="cz-wordmark-row">
              <Flourish size={14} />
              <h1 className="cz-wordmark font-display">CADENZO</h1>
              <Flourish size={14} />
            </div>
            <p className="cz-tagline font-body">
              Your bike's service record — written down, verified, never lost.
            </p>
            <div className="cz-landing-actions">
              <button className="cz-btn cz-btn-primary" onClick={() => { setSignInEmail(""); setSignInError(""); setScreen("signin"); }}>
                Sign in
              </button>
              <button className="cz-btn cz-btn-secondary" onClick={() => { setAuthMode("signup"); setScreen("auth-type"); }}>
                Create account
              </button>
            </div>
          </div>
        );

      case "signin":
        return (
          <>
            <TopBar title="Sign in" onBack={() => setScreen("landing")} />
            <div className="cz-screen-pad">
              <p className="cz-helper font-body">
                Enter your email address to continue. Your account type is detected automatically.
              </p>
              <label className="cz-label font-mono">EMAIL ADDRESS</label>
              <input
                className="cz-input font-body"
                type="email"
                value={signInEmail}
                onChange={(e) => { setSignInEmail(e.target.value); setSignInError(""); }}
                placeholder="e.g. jesse@example.com"
                onKeyDown={(e) => { if (e.key === "Enter") handleSignIn(); }}
                autoFocus
              />
              <label className="cz-label font-mono">PASSWORD</label>
              <div className="cz-password-field">
                <input
                  className="cz-input font-body"
                  type={showSignInPassword ? "text" : "password"}
                  value={signInPassword}
                  onChange={(e) => { setSignInPassword(e.target.value); setSignInError(""); }}
                  placeholder="Enter your password"
                  onKeyDown={(e) => { if (e.key === "Enter") handleSignIn(); }}
                />
                <button
                  type="button"
                  className="cz-password-toggle"
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
              {signInError && <p className="cz-error font-body" style={{ marginTop: 8 }}>{signInError}</p>}
              <button
                className="cz-btn cz-btn-primary cz-btn-block"
                style={{ marginTop: 18 }}
                onClick={handleSignIn}
                disabled={!signInEmail.trim() || !signInPassword.trim()}
              >
                Continue
              </button>

              <SocialAuthButtons
                mode="signin"
                onGoogle={() => handleSocialAuth("google", "signin")}
                onApple={() => handleSocialAuth("apple", "signin")}
              />

              <div className="cz-signin-hint">
                <p className="font-mono" style={{ fontSize: 10, color: "var(--muted)", marginBottom: 8, letterSpacing: "0.06em" }}>PROTOTYPE DEMO ACCOUNTS</p>
                <p className="font-mono" style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>Rider: any valid email + any password (e.g. <span style={{ color: "var(--ink)", cursor: "pointer", textDecoration: "underline" }} onClick={() => setSignInEmail("jesse@example.com")}>jesse@example.com</span>)</p>
                <p className="font-mono" style={{ fontSize: 11, color: "var(--muted)" }}>Shop: <span style={{ color: "var(--ink)", cursor: "pointer", textDecoration: "underline" }} onClick={() => setSignInEmail("hello@eastcitycycles.co.za")}>hello@eastcitycycles.co.za</span></p>
              </div>
              <p className="cz-helper font-body" style={{ textAlign: "center", marginTop: 20 }}>
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
            <div className="cz-screen-pad">
              {forgotPasswordSent ? (
                <div className="cz-menu-sent" style={{ paddingTop: 40 }}>
                  <div className="cz-brandmark" style={{ marginBottom: 16, width: 56, height: 56 }}>
                    <Mail size={24} />
                  </div>
                  <span className="font-display" style={{ fontSize: 20 }}>Check your email</span>
                  <p className="cz-helper font-body" style={{ textAlign: "center", marginTop: 8, maxWidth: 280 }}>
                    If an account exists for <strong style={{ color: "var(--ink)" }}>{forgotPasswordEmail.trim().toLowerCase()}</strong>, a password reset link has been sent. The link will be valid for 60 minutes.
                  </p>
                  <button
                    className="cz-btn cz-btn-secondary"
                    style={{ marginTop: 24 }}
                    onClick={() => setScreen("signin")}
                  >
                    Back to sign in
                  </button>
                  <p className="cz-helper font-body" style={{ textAlign: "center", marginTop: 14 }}>
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
                  <p className="cz-helper font-body">
                    Enter the email address linked to your account. We'll send a link to reset your password.
                  </p>
                  <label className="cz-label font-mono">EMAIL ADDRESS</label>
                  <input
                    className="cz-input font-body"
                    type="email"
                    value={forgotPasswordEmail}
                    onChange={(e) => { setForgotPasswordEmail(e.target.value); setForgotPasswordError(""); }}
                    placeholder="e.g. jesse@example.com"
                    onKeyDown={(e) => { if (e.key === "Enter") handleForgotPassword(); }}
                    autoFocus
                  />
                  {forgotPasswordError && <p className="cz-error font-body" style={{ marginTop: 8 }}>{forgotPasswordError}</p>}
                  <button
                    className="cz-btn cz-btn-primary cz-btn-block"
                    style={{ marginTop: 18 }}
                    onClick={handleForgotPassword}
                    disabled={!forgotPasswordEmail.trim()}
                  >
                    <Send size={14} style={{ marginRight: 8 }} /> Send reset link
                  </button>
                  <p className="cz-helper font-body" style={{ textAlign: "center", marginTop: 20 }}>
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
            <div className="cz-screen-pad">
              <div className="cz-terms-header">
                <FileText size={22} style={{ color: "var(--gold)", marginBottom: 8 }} />
                <p className="font-mono cz-terms-updated">Last updated {formatDate(new Date().toISOString().slice(0, 10))}</p>
              </div>
              {CADENZO_TERMS.map((section, i) => (
                <div key={i} className="cz-terms-section">
                  <h2 className="font-display cz-terms-heading">{section.heading}</h2>
                  <p className="font-body cz-terms-body">{section.body}</p>
                </div>
              ))}
              <button className="cz-btn cz-btn-secondary cz-btn-block" style={{ marginTop: 8, marginBottom: 20 }} onClick={() => setScreen(termsReturnScreen)}>
                Back
              </button>
            </div>
          </>
        );

      case "auth-type":
        return (
          <>
            <TopBar title="Create account" onBack={() => setScreen("landing")} />
            <div className="cz-screen-pad">
              <p className="cz-helper font-body" style={{ marginBottom: 24 }}>
                What type of account would you like to create?
              </p>
              <button className="cz-auth-type-card" onClick={() => setScreen("customer-auth")}>
                <div className="cz-auth-type-icon"><User size={22} /></div>
                <div className="cz-auth-type-text">
                  <span className="font-display cz-auth-type-label">Rider</span>
                  <span className="font-body cz-auth-type-desc">
                    Register your bikes, track services, and manage component wear
                  </span>
                </div>
                <ChevronRight size={18} className="cz-auth-type-arrow" />
              </button>
              <button className="cz-auth-type-card" onClick={() => setScreen("shop-auth")}>
                <div className="cz-auth-type-icon"><Store size={22} /></div>
                <div className="cz-auth-type-text">
                  <span className="font-display cz-auth-type-label">Bike Shop</span>
                  <span className="font-body cz-auth-type-desc">
                    Verify customer services, look up bike records, and manage your shop profile
                  </span>
                </div>
                <ChevronRight size={18} className="cz-auth-type-arrow" />
              </button>
              <p className="cz-helper font-body" style={{ textAlign: "center", marginTop: 20 }}>
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
            <div className="cz-screen-pad">
              <p className="cz-helper font-body">
                Prototype — enter any details to continue. In the real app this creates a secure account.
              </p>

              <label className="cz-label font-mono">FULL NAME</label>
              <input
                className="cz-input font-body"
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                placeholder="e.g. Jesse"
              />

              <label className="cz-label font-mono">EMAIL ADDRESS</label>
              <input
                className="cz-input font-body"
                type="email"
                value={emailDraft}
                onChange={(e) => setEmailDraft(e.target.value)}
                placeholder="e.g. jesse@example.com"
              />
              <p className="cz-helper font-body" style={{ marginTop: 6 }}>
                We'll send a welcome email and use this for service notifications.
              </p>

              <label className="cz-label font-mono">PASSWORD</label>
              <div className="cz-password-field">
                <input
                  className="cz-input font-body"
                  type={showPasswordDraft ? "text" : "password"}
                  value={passwordDraft}
                  onChange={(e) => setPasswordDraft(e.target.value)}
                  placeholder="Create a password"
                  onKeyDown={(e) => { if (e.key === "Enter") handleCustomerLogin(); }}
                />
                <button
                  type="button"
                  className="cz-password-toggle"
                  onClick={() => setShowPasswordDraft(!showPasswordDraft)}
                  aria-label={showPasswordDraft ? "Hide password" : "Show password"}
                >
                  {showPasswordDraft ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="cz-helper font-body" style={{ marginTop: 6 }}>
                Use at least 8 characters. In the real app this is securely encrypted.
              </p>
              <PasswordStrengthChecklist password={passwordDraft} />

              <label className="cz-label font-mono">PREFERRED BIKE SHOP <span style={{ color: "var(--muted)", fontWeight: 400 }}>(optional)</span></label>
              <p className="cz-helper font-body" style={{ marginBottom: 10 }}>
                Your preferred shop can be notified automatically when your components are nearing their service limit.
              </p>
              {renderShopSearch({ label: "", sublabel: "", compact: true })}

              <button
                className="cz-terms-checkbox-row"
                onClick={() => setRiderTermsAccepted(!riderTermsAccepted)}
                style={{ marginTop: 22 }}
              >
                {riderTermsAccepted ? <CheckSquare size={18} style={{ color: "var(--gold)" }} /> : <Square size={18} style={{ color: "var(--muted)" }} />}
                <span className="font-body cz-terms-checkbox-text">
                  I have read and agree to the{" "}
                  <span
                    className="cz-terms-link"
                    onClick={(e) => { e.stopPropagation(); setTermsReturnScreen("customer-auth"); setScreen("terms"); }}
                  >
                    Terms &amp; Conditions
                  </span>
                </span>
              </button>

              <button
                className="cz-btn cz-btn-primary cz-btn-block"
                style={{ marginTop: 14 }}
                onClick={handleCustomerLogin}
                disabled={!nameDraft.trim() || !emailDraft.trim() || !isPasswordValid(passwordDraft) || !riderTermsAccepted}
              >
                Create account &amp; continue
              </button>

              <SocialAuthButtons
                mode="signup"
                onGoogle={() => handleSocialAuth("google", "signup")}
                onApple={() => handleSocialAuth("apple", "signup")}
                disabled={!riderTermsAccepted}
              />
              {!riderTermsAccepted && (
                <p className="cz-helper font-body" style={{ textAlign: "center", marginTop: 10 }}>
                  Accept the Terms &amp; Conditions above to continue with Google or Apple.
                </p>
              )}
            </div>
          </>
        );

      case "shop-auth":
        return (
          <>
            <TopBar title="Register your shop" onBack={() => setScreen("auth-type")} />
            <div className="cz-screen-pad">
              <p className="cz-helper font-body">
                Select your shop from the list, then complete your shop's details. This is what riders will see when searching for a shop.
              </p>
              {SHOPS.map((s) => (
                <button
                  key={s.id}
                  className={`cz-shop-select ${shopAuthSelectedId === s.id ? "cz-shop-select-active" : ""}`}
                  onClick={() => {
                    setShopAuthSelectedId(s.id);
                    setShopSignupForm({ address: "", area: "", specialties: "" });
                  }}
                >
                  <span className="cz-shop-select-icon">
                    {shopAuthSelectedId === s.id
                      ? <CheckCircle2 size={18} style={{ color: "var(--gold-light)" }} />
                      : <Store size={18} />}
                  </span>
                  <span className="cz-shop-select-text">
                    <span className="font-display cz-shop-select-name">{s.name}</span>
                    <span className="font-mono cz-shop-select-area">{s.email}</span>
                  </span>
                </button>
              ))}

              {!shopAuthSelectedId && (
                <button
                  className="cz-shop-not-listed"
                  onClick={() => { setNewShopForm({ name: "", email: "", address: "", area: "", specialties: "" }); setNewShopError(""); setShopAuthPassword(""); setScreen("shop-signup-new"); }}
                >
                  <Plus size={15} style={{ marginRight: 8 }} />
                  Can't find your shop? Add it
                </button>
              )}

              {shopAuthSelectedId && (
                <>
                  <p className="cz-helper font-body" style={{ marginTop: 18 }}>
                    Please enter your shop's details manually — this ensures your listing is accurate for riders.
                  </p>

                  <label className="cz-label font-mono">SHOP ADDRESS</label>
                  <input
                    className="cz-input font-body"
                    value={shopSignupForm.address}
                    onChange={(e) => setShopSignupForm({ ...shopSignupForm, address: e.target.value })}
                    placeholder="e.g. 142 Lower Main Road, Observatory, Cape Town, 7925"
                  />
                  <p className="cz-helper font-body" style={{ marginTop: 6 }}>
                    Your full street address. This is shown to riders searching for a shop.
                  </p>

                  <label className="cz-label font-mono">AREA / SUBURB</label>
                  <input
                    className="cz-input font-body"
                    value={shopSignupForm.area}
                    onChange={(e) => setShopSignupForm({ ...shopSignupForm, area: e.target.value })}
                    placeholder="e.g. Observatory, Cape Town"
                  />

                  <label className="cz-label font-mono">SPECIALITIES</label>
                  <input
                    className="cz-input font-body"
                    value={shopSignupForm.specialties}
                    onChange={(e) => setShopSignupForm({ ...shopSignupForm, specialties: e.target.value })}
                    placeholder="e.g. Road bikes, Wheel building, Bike fitting"
                  />
                  <p className="cz-helper font-body" style={{ marginTop: 6 }}>
                    Separate each speciality with a comma.
                  </p>

                  <label className="cz-label font-mono">CREATE A PASSWORD</label>
                  <div className="cz-password-field">
                    <input
                      className="cz-input font-body"
                      type={showShopAuthPassword ? "text" : "password"}
                      value={shopAuthPassword}
                      onChange={(e) => setShopAuthPassword(e.target.value)}
                      placeholder="Create a password"
                      onKeyDown={(e) => { if (e.key === "Enter") submitShopSignup(); }}
                    />
                    <button
                      type="button"
                      className="cz-password-toggle"
                      onClick={() => setShowShopAuthPassword(!showShopAuthPassword)}
                      aria-label={showShopAuthPassword ? "Hide password" : "Show password"}
                    >
                      {showShopAuthPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <PasswordStrengthChecklist password={shopAuthPassword} />

                  <button
                    className="cz-terms-checkbox-row"
                    onClick={() => setShopTermsAccepted(!shopTermsAccepted)}
                    style={{ marginTop: 16 }}
                  >
                    {shopTermsAccepted ? <CheckSquare size={18} style={{ color: "var(--gold)" }} /> : <Square size={18} style={{ color: "var(--muted)" }} />}
                    <span className="font-body cz-terms-checkbox-text">
                      I have read and agree to the{" "}
                      <span
                        className="cz-terms-link"
                        onClick={(e) => { e.stopPropagation(); setTermsReturnScreen("shop-auth"); setScreen("terms"); }}
                      >
                        Terms &amp; Conditions
                      </span>
                    </span>
                  </button>

                  <button
                    className="cz-btn cz-btn-primary cz-btn-block"
                    style={{ marginTop: 14 }}
                    onClick={submitShopSignup}
                    disabled={!shopSignupForm.address.trim() || !shopSignupForm.area.trim() || !shopSignupForm.specialties.trim() || !isPasswordValid(shopAuthPassword) || !shopTermsAccepted}
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
            <div className="cz-screen-pad">
              <div className="cz-new-shop-intro">
                <div className="cz-brandmark" style={{ width: 44, height: 44, marginBottom: 10 }}>
                  <Store size={20} />
                </div>
                <p className="cz-helper font-body" style={{ margin: 0 }}>
                  Not seeing your shop on Cadenzo yet? Register it here and it'll appear in the directory for riders to find, message, and verify services with straight away.
                </p>
              </div>

              <label className="cz-label font-mono">SHOP NAME</label>
              <input
                className="cz-input font-body"
                value={newShopForm.name}
                onChange={(e) => { setNewShopForm({ ...newShopForm, name: e.target.value }); setNewShopError(""); }}
                placeholder="e.g. Southside Bicycle Co."
              />

              <label className="cz-label font-mono">SHOP EMAIL</label>
              <input
                className="cz-input font-body"
                type="email"
                value={newShopForm.email}
                onChange={(e) => { setNewShopForm({ ...newShopForm, email: e.target.value }); setNewShopError(""); }}
                placeholder="e.g. hello@southsidebicycle.co.za"
              />
              <p className="cz-helper font-body" style={{ marginTop: 6 }}>
                You'll sign in with this email in future.
              </p>

              <label className="cz-label font-mono">SHOP ADDRESS</label>
              <input
                className="cz-input font-body"
                value={newShopForm.address}
                onChange={(e) => setNewShopForm({ ...newShopForm, address: e.target.value })}
                placeholder="e.g. 24 Main Road, Muizenberg, Cape Town, 7945"
              />
              <p className="cz-helper font-body" style={{ marginTop: 6 }}>
                Your full street address. Shown to riders searching for a shop.
              </p>

              <label className="cz-label font-mono">AREA / SUBURB</label>
              <input
                className="cz-input font-body"
                value={newShopForm.area}
                onChange={(e) => setNewShopForm({ ...newShopForm, area: e.target.value })}
                placeholder="e.g. Muizenberg, Cape Town"
              />

              <label className="cz-label font-mono">SPECIALITIES</label>
              <input
                className="cz-input font-body"
                value={newShopForm.specialties}
                onChange={(e) => setNewShopForm({ ...newShopForm, specialties: e.target.value })}
                placeholder="e.g. Road bikes, Repairs, Custom builds"
              />
              <p className="cz-helper font-body" style={{ marginTop: 6 }}>
                Separate each speciality with a comma.
              </p>

              <label className="cz-label font-mono">CREATE A PASSWORD</label>
              <div className="cz-password-field">
                <input
                  className="cz-input font-body"
                  type={showShopAuthPassword ? "text" : "password"}
                  value={shopAuthPassword}
                  onChange={(e) => setShopAuthPassword(e.target.value)}
                  placeholder="Create a password"
                  onKeyDown={(e) => { if (e.key === "Enter") submitNewShop(); }}
                />
                <button
                  type="button"
                  className="cz-password-toggle"
                  onClick={() => setShowShopAuthPassword(!showShopAuthPassword)}
                  aria-label={showShopAuthPassword ? "Hide password" : "Show password"}
                >
                  {showShopAuthPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <PasswordStrengthChecklist password={shopAuthPassword} />

              {newShopError && <p className="cz-error font-body" style={{ marginTop: 8 }}>{newShopError}</p>}

              <button
                className="cz-terms-checkbox-row"
                onClick={() => setNewShopTermsAccepted(!newShopTermsAccepted)}
                style={{ marginTop: 14 }}
              >
                {newShopTermsAccepted ? <CheckSquare size={18} style={{ color: "var(--gold)" }} /> : <Square size={18} style={{ color: "var(--muted)" }} />}
                <span className="font-body cz-terms-checkbox-text">
                  I have read and agree to the{" "}
                  <span
                    className="cz-terms-link"
                    onClick={(e) => { e.stopPropagation(); setTermsReturnScreen("shop-signup-new"); setScreen("terms"); }}
                  >
                    Terms &amp; Conditions
                  </span>
                </span>
              </button>

              <button
                className="cz-btn cz-btn-primary cz-btn-block"
                style={{ marginTop: 14 }}
                onClick={submitNewShop}
                disabled={!newShopForm.name.trim() || !newShopForm.email.trim() || !newShopForm.address.trim() || !newShopForm.area.trim() || !newShopForm.specialties.trim() || !isPasswordValid(shopAuthPassword) || !newShopTermsAccepted}
              >
                <Plus size={15} style={{ marginRight: 8 }} />
                Register shop &amp; continue
              </button>

              <p className="cz-helper font-body" style={{ textAlign: "center", marginTop: 18 }}>
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
            <div className="cz-topbar">
              <span className="cz-iconbtn-spacer" />
              <h1 className="cz-topbar-title font-display">Hey, {customerName.split(" ")[0]}</h1>
              <button className="cz-iconbtn cz-iconbtn-badged" onClick={openMenu} aria-label="Menu">
                <Menu size={20} />
                {(unreadCount + riderThreadUnread) > 0 && <span className="cz-topbar-menu-badge" />}
              </button>
            </div>
            <div className="cz-screen-pad">
              <button className="cz-shop-finder" onClick={() => setScreen("shop-directory")}>
                <Search size={15} style={{ marginRight: 8 }} /> Find a verified shop nearby
              </button>
              <h2 className="cz-section-title font-mono">YOUR BIKES</h2>
              {bikes.filter((b) => !b.isUnclaimed).length === 0 ? (
                <EmptyState Icon={Bike} title="No bikes yet" body="Register your first bike to start its service record." />
              ) : (
                bikes.filter((b) => !b.isUnclaimed).map((b) => {
                  const info = getNextServiceInfo(b);
                  const TypeIcon = getBikeTypeMeta(b.bikeType).icon;
                  const alertCount = (b.components || []).filter((c) => {
                    const km = getComponentKm(c);
                    return (km / c.maxKm) * 100 >= 65;
                  }).length;
                  return (
                    <button key={b.id} className="cz-bike-card" onClick={() => openBike(b.id)}>
                      <div className="cz-bike-card-icon">
                        <TypeIcon size={22} />
                        {b.isEbike && <span className="cz-ebike-badge"><Zap size={9} fill="currentColor" /></span>}
                        {alertCount > 0 && <span className="cz-bike-card-badge">{alertCount}</span>}
                      </div>
                      <div className="cz-bike-card-text">
                        <span className="font-display cz-bike-card-name">
                          {b.brand} {b.model}
                        </span>
                        <span className="font-mono cz-bike-card-id">{b.id}</span>
                      </div>
                      <ReminderBadge info={info} />
                    </button>
                  );
                })
              )}
              <div style={{ display:"flex", gap:8, marginTop:4 }}>
                <button className="cz-btn cz-btn-outline" style={{ flex:1 }} onClick={() => setScreen("add-bike")}>
                  <Plus size={15} style={{ marginRight: 7 }} /> New bike
                </button>
                <button className="cz-btn cz-btn-outline" style={{ flex:1 }} onClick={() => { setClaimInput(""); setClaimError(""); setScreen("claim-bike"); }}>
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
            <div className="cz-screen-pad">
              <label className="cz-label font-mono">BRAND</label>
              <input
                className="cz-input font-body"
                value={draftBike.brand}
                onChange={(e) => setDraftBike({ ...draftBike, brand: e.target.value })}
                placeholder="e.g. Specialized"
              />
              <label className="cz-label font-mono">MODEL</label>
              <input
                className="cz-input font-body"
                value={draftBike.model}
                onChange={(e) => setDraftBike({ ...draftBike, model: e.target.value })}
                placeholder="e.g. Roubaix"
              />
              <label className="cz-label font-mono">BIKE TYPE</label>
              <div className="cz-chip-row">
                {BIKE_TYPES.map((t) => {
                  const TIcon = t.icon;
                  return (
                    <button
                      key={t.id}
                      className={`cz-chip ${draftBike.bikeType === t.id ? "cz-chip-active" : ""}`}
                      onClick={() => setDraftBike({ ...draftBike, bikeType: t.id })}
                    >
                      <TIcon size={14} style={{ marginRight: 6, verticalAlign: "-2px" }} />
                      {t.label}
                    </button>
                  );
                })}
              </div>

              <label className="cz-label font-mono">E-BIKE?</label>
              <div
                className={`cz-ebike-toggle ${draftBike.isEbike ? "cz-ebike-toggle-on" : ""}`}
                onClick={() => setDraftBike({ ...draftBike, isEbike: !draftBike.isEbike })}
              >
                <div className="cz-ebike-toggle-left">
                  <div className={`cz-ebike-icon ${draftBike.isEbike ? "cz-ebike-icon-on" : ""}`}>
                    <Zap size={16} />
                  </div>
                  <div>
                    <span className="font-body cz-notify-label">
                      {draftBike.isEbike
                        ? `E-${BIKE_TYPES.find(t => t.id === draftBike.bikeType)?.label || "Bike"}`
                        : "This is an e-bike"}
                    </span>
                    <span className="font-mono cz-notify-sub">
                      {draftBike.isEbike
                        ? "Motor-assisted — battery & motor components will be trackable"
                        : "Tap to mark as motor-assisted"}
                    </span>
                  </div>
                </div>
                <div className={`cz-toggle-switch ${draftBike.isEbike ? "cz-toggle-switch-on" : ""}`}>
                  <div className="cz-toggle-knob" />
                </div>
              </div>
              <label className="cz-label font-mono">SERIAL NUMBER</label>
              <input
                className="cz-input font-mono"
                style={{ textTransform: "uppercase" }}
                value={draftBike.serialNumber}
                onChange={(e) => setDraftBike({ ...draftBike, serialNumber: e.target.value })}
                placeholder="Usually stamped under the bottom bracket"
              />
              <label className="cz-label font-mono">FRAME COLOUR</label>
              <input
                className="cz-input font-body"
                value={draftBike.color}
                onChange={(e) => setDraftBike({ ...draftBike, color: e.target.value })}
                placeholder="e.g. Gloss Black"
              />
              <p className="cz-helper font-body" style={{ marginTop: 8 }}>
                A shop can confirm the type and serial number match the bike once it's registered.
              </p>
              <button
                className="cz-btn cz-btn-primary cz-btn-block"
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
            <div className="cz-screen-pad cz-center-col">
              <div className="cz-qr-wrap">
                <QRPattern seed={newBikeId || "x"} />
              </div>
              <span className="font-mono cz-bikeid-text">{newBikeId}</span>
              {newBike && (
                <div className="cz-detail-tags" style={{ justifyContent: "center" }}>
                  <span className="cz-detail-tag">
                    <NewTypeIcon size={13} />
                    <span className="font-mono">{getBikeLabel(newBike)}</span>
                  </span>
                  {newBike.isEbike && (
                    <span className="cz-detail-tag cz-detail-tag-ebike">
                      <Zap size={12} fill="currentColor" />
                      <span className="font-mono">Electric</span>
                    </span>
                  )}
                  <span className="cz-detail-tag">
                    <span className="font-mono">SN {newBike.serialNumber}</span>
                  </span>
                </div>
              )}
              <p className="cz-helper font-body" style={{ textAlign: "center" }}>
                This code is now linked to your bike. Show it to any shop on our network so they can pull up
                and verify its service history.
              </p>
              <button className="cz-btn cz-btn-primary cz-btn-block" onClick={() => setScreen("customer-home")}>
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
                  <button className="cz-iconbtn" onClick={() => setScreen("export-preview")} aria-label="Export as PDF">
                    <FileDown size={18} />
                  </button>
                )
              }
            />
            {selectedBike && (
              <div className="cz-screen-pad" style={{ paddingBottom: 4 }}>
                <div className="cz-bike-detail-head">
                  <div>
                    <span className="font-mono cz-bike-detail-id">{selectedBike.id}</span>
                    <span className="font-body cz-bike-detail-meta">
                      {selectedBike.color} · Registered {formatDate(selectedBike.registeredOn)}
                    </span>
                  </div>
                  <div className="cz-qr-wrap cz-qr-wrap-small">
                    <QRPattern seed={selectedBike.id} size={15} cell={5} />
                  </div>
                </div>
                <div className="cz-detail-tags">
                  <span className="cz-detail-tag">
                    <DetailTypeIcon size={13} />
                    <span className="font-mono">{getBikeLabel(selectedBike)}</span>
                  </span>
                  {selectedBike.isEbike && (
                    <span className="cz-detail-tag cz-detail-tag-ebike">
                      <Zap size={12} fill="currentColor" />
                      <span className="font-mono">Electric</span>
                    </span>
                  )}
                  <span className="cz-detail-tag">
                    <span className="font-mono">SN {selectedBike.serialNumber}</span>
                  </span>
                  <span className={`cz-detail-tag ${selectedBike.detailsVerified ? "cz-detail-tag-verified" : ""}`}>
                    {selectedBike.detailsVerified ? <ShieldCheck size={13} /> : <Shield size={13} />}
                    <span className="font-mono">
                      {selectedBike.detailsVerified ? `Verified by ${selectedBike.detailsVerifiedBy}` : "Details not verified"}
                    </span>
                  </span>
                </div>
                <div className="cz-reminder-row">
                  <ReminderBadge info={getNextServiceInfo(selectedBike)} />
                  {selectedBike.serviceLog.length > 0 && calendarSyncEnabled && (
                    <button className="cz-calendar-sync-link font-mono" onClick={() => syncReminderToCalendar(selectedBike)}>
                      <CalendarPlus size={12} style={{ marginRight: 5 }} />
                      Add to calendar
                    </button>
                  )}
                </div>

                <div className="cz-strava-card">
                  {!stravaConnected ? (
                    <>
                      <div className="cz-strava-head">
                        <Activity size={15} />
                        <span className="font-display">Strava</span>
                      </div>
                      <p className="cz-helper font-body" style={{ margin: "0 0 12px" }}>
                        Connect Strava to automatically track this bike's mileage and recent rides.
                      </p>
                      <button
                        className="cz-btn cz-btn-strava cz-btn-block"
                        onClick={connectStrava}
                        disabled={connectingStrava}
                      >
                        <Activity size={14} style={{ marginRight: 8 }} />
                        {connectingStrava ? "Connecting…" : "Connect Strava"}
                      </button>
                    </>
                  ) : !selectedBike.stravaGearId ? (
                    <>
                      <div className="cz-strava-head">
                        <Activity size={15} />
                        <span className="font-display">Which Strava bike is this?</span>
                      </div>
                      {availableGearFor(selectedBike).length === 0 ? (
                        <p className="cz-helper font-body" style={{ margin: 0 }}>
                          All of your Strava bikes are already linked to other entries in Cadenzo.
                        </p>
                      ) : (
                        availableGearFor(selectedBike).map((g) => (
                          <button
                            key={g.id}
                            className="cz-gear-option"
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
                          <div className="cz-strava-head">
                            <Activity size={15} />
                            <span className="font-display">Synced from Strava</span>
                            <button className="cz-strava-unlink font-mono" onClick={() => unlinkBikeFromGear(selectedBike.id)}>
                              Unlink
                            </button>
                          </div>
                          <div className="cz-strava-stats">
                            <div>
                              <span className="font-display cz-strava-stat-num">{m.totalKm}</span>
                              <span className="font-mono cz-strava-stat-label">TOTAL KM</span>
                            </div>
                            <div>
                              <span className="font-display cz-strava-stat-num">{m.rideCount}</span>
                              <span className="font-mono cz-strava-stat-label">RIDES</span>
                            </div>
                          </div>
                          <div className={`cz-reminder rb--${m.tone}`} style={{ marginBottom: 14 }}>
                            <Activity size={13} style={{ marginRight: 5, verticalAlign: "-2px" }} />
                            <span className="font-mono">{m.kmSince} km since last service</span>
                          </div>
                          <div className="cz-ride-list">
                            {rides.slice(0, 3).map((r) => (
                              <div key={r.id} className="cz-ride-item">
                                <div>
                                  <span className="font-body cz-ride-name">{r.name}</span>
                                  <span className="font-mono cz-ride-date">{formatDate(r.date)}</span>
                                </div>
                                <span className="font-mono cz-ride-distance">{Math.round(metersToKm(r.distanceMeters))} km</span>
                              </div>
                            ))}
                          </div>
                          <button className="cz-sync-ride-btn font-mono" onClick={() => syncNewStravaRide(selectedBike.id)}>
                            <Activity size={12} style={{ marginRight: 6 }} />
                            Simulate new ride sync
                          </button>
                        </>
                      );
                    })()
                  )}
                </div>

                <div className="cz-tabs">
                  <button className={`cz-tab ${bikeDetailTab === "history" ? "cz-tab-active" : ""}`} onClick={() => setBikeDetailTab("history")}>
                    <ClipboardList size={13} style={{ marginRight: 5 }} /> History
                  </button>
                  <button className={`cz-tab ${bikeDetailTab === "components" ? "cz-tab-active" : ""}`} onClick={() => setBikeDetailTab("components")}>
                    <Wrench size={13} style={{ marginRight: 5 }} /> Parts
                    {(selectedBike.components || []).filter((c) => (getComponentKm(c) / c.maxKm) * 100 >= 65).length > 0 && (
                      <span className="cz-tab-alert">!</span>
                    )}
                  </button>
                  <button className={`cz-tab ${bikeDetailTab === "ownership" ? "cz-tab-active" : ""}`} onClick={() => setBikeDetailTab("ownership")}>
                    <History size={13} style={{ marginRight: 5 }} /> Ownership
                  </button>
                </div>

                {bikeDetailTab === "history" && (
                  <>
                    {selectedBike.serviceLog.length === 0 ? (
                      <EmptyState Icon={ClipboardList} title="Nothing logged yet" body="Add your first service to start this bike's record." />
                    ) : (
                      <div className="cz-tag-chain">
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
                      <div className="cz-comp-list">
                        {[...(selectedBike.components || [])]
                          .sort((a, b) => {
                            const pa = (getComponentKm(a) / a.maxKm);
                            const pb = (getComponentKm(b) / b.maxKm);
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
                        <div className="cz-transfer-pending">
                          <div className="cz-transfer-pending-head">
                            <Clock size={13} style={{ marginRight: 6 }} />
                            <span className="font-mono">Transfer in progress</span>
                          </div>
                          <p className="cz-helper font-body" style={{ margin:"6px 0 10px" }}>
                            Share the transfer code with the new owner. Once they claim it, the bike moves to their account.
                          </p>
                          <div className="cz-txcode-display font-mono">{selectedBike.transferCode}</div>
                          <button className="cz-btn cz-btn-secondary cz-btn-block" style={{ marginTop:10 }} onClick={() => cancelTransfer(selectedBike.id)}>
                            <XCircle size={14} style={{ marginRight:7 }} /> Cancel transfer
                          </button>
                        </div>
                      )}
                      <h2 className="cz-section-title font-mono">CHAIN OF CUSTODY</h2>
                      <div className="cz-ownership-chain">
                        {[...log].reverse().map((entry, i) => (
                          <div key={i} className={`cz-owner-entry ${i === 0 ? "cz-owner-current" : ""}`}>
                            <div className="cz-owner-dot" />
                            <div className="cz-owner-text">
                              <span className="font-display cz-owner-name">
                                {i === 0 ? `${entry.name} (current)` : entry.name}
                              </span>
                              <span className="font-mono cz-owner-meta">
                                {entry.type === "original" ? "First registered"
                                  : entry.type === "orphan-unclaimed" ? "Became unclaimed"
                                  : entry.type === "orphan-claim" ? `Claimed via ${entry.verifiedByShop || "shop"}`
                                  : "Transferred"} · {formatDate(entry.date)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="cz-helper font-body" style={{ marginTop:16 }}>
                        This ownership history is verified and tamper-proof. Shops can view it when looking up your bike.
                      </p>
                      {!selectedBike.transferPending && (
                        <button className="cz-btn cz-btn-outline cz-btn-block" style={{ marginTop: 8 }} onClick={() => initiateTransfer(selectedBike.id)}>
                          <ArrowRightLeft size={14} style={{ marginRight: 8 }} /> Transfer this bike
                        </button>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
            <div className="cz-sticky-footer cz-footer-row">
              {selectedBike && !selectedBike.transferPending ? (
                <>
                  <button className="cz-btn cz-btn-secondary cz-btn-half" onClick={() => { setBikeDetailTab("components"); setCompForm({ type: COMPONENT_PRESETS[0].type, brand: "", model: "", baseKm: "", date: new Date().toISOString().slice(0, 10), maxKm: COMPONENT_PRESETS[0].maxKm }); setScreen("add-component"); }}>
                    <Plus size={15} style={{ marginRight: 6 }} /> Component
                  </button>
                  <button className="cz-btn cz-btn-primary cz-btn-half" onClick={openLogForm}>
                    <ClipboardList size={15} style={{ marginRight: 6 }} /> Log service
                  </button>
                </>
              ) : (
                <button className="cz-btn cz-btn-primary cz-btn-block" onClick={openLogForm}>
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
              <div className="cz-screen-pad"><EmptyState Icon={FileDown} title="No bike selected" body="Open a bike first to export its record." /></div>
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
            <div className="cz-screen-pad cz-no-print">
              <p className="cz-helper font-body">
                Below is your full service history and component record for this bike, in chronological order. Tap the button to save it as a PDF.
              </p>
              <button className="cz-btn cz-btn-primary cz-btn-block" style={{ marginBottom: 20 }} onClick={() => window.print()}>
                <FileDown size={15} style={{ marginRight: 8 }} /> Download as PDF
              </button>
            </div>

            <div className="cz-export-report">
              <div className="cz-export-header">
                <div className="cz-wordmark-row" style={{ marginBottom: 6 }}>
                  <Flourish size={12} />
                  <h1 className="cz-wordmark font-display" style={{ fontSize: 24 }}>CADENZO</h1>
                  <Flourish size={12} />
                </div>
                <p className="font-mono cz-export-generated">Full record exported {formatDate(new Date().toISOString().slice(0, 10))}</p>
              </div>

              <div className="cz-export-bike-card">
                <span className="font-display cz-export-bike-name">{bike.brand} {bike.model}</span>
                <div className="cz-export-bike-meta-row">
                  <span className="font-mono">{bike.id}</span>
                  <span className="font-mono">SN {bike.serialNumber}</span>
                  <span className="font-mono">{getBikeLabel ? getBikeLabel(bike) : typeMeta.label}</span>
                  <span className="font-mono">{bike.color}</span>
                </div>
                <div className="cz-export-bike-meta-row">
                  <span className="font-mono">Owner: {bike.ownerName}</span>
                  <span className="font-mono">Registered {formatDate(bike.registeredOn)}</span>
                  {bike.detailsVerified && <span className="font-mono">Verified by {bike.detailsVerifiedBy}</span>}
                </div>
              </div>

              <h2 className="cz-export-section-title font-mono">SERVICE HISTORY — CHRONOLOGICAL</h2>
              {servicesChrono.length === 0 ? (
                <p className="cz-helper font-body">No services logged yet.</p>
              ) : (
                <table className="cz-export-table">
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

              <h2 className="cz-export-section-title font-mono">COMPONENTS — CHRONOLOGICAL</h2>
              {componentsChrono.length === 0 ? (
                <p className="cz-helper font-body">No components logged yet.</p>
              ) : (
                <table className="cz-export-table">
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
                      const km = getComponentKm(c);
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

              <div className="cz-export-grand-total">
                <span className="font-display">Total spent on record</span>
                <span className="font-mono cz-export-grand-total-amount">{rand(grandTotal)}</span>
              </div>

              <p className="font-mono cz-export-footer">
                Generated by Cadenzo · {bike.id} · This record reflects services and components logged in the app and may not include work performed elsewhere.
              </p>
            </div>
          </>
        );
      }

      case "log-service":
        return (
          <>
            <TopBar title="Log a service" onBack={() => setScreen("bike-detail")} />
            <div className="cz-screen-pad">
              <label className="cz-label font-mono">SERVICE TYPE</label>
              <div className="cz-chip-row">
                {SERVICE_TYPES.map((t) => (
                  <button
                    key={t}
                    className={`cz-chip ${logForm.type === t ? "cz-chip-active" : ""}`}
                    onClick={() => setLogForm({ ...logForm, type: t })}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <label className="cz-label font-mono">DATE</label>
              <input
                type="date"
                className="cz-input font-body"
                value={logForm.date}
                onChange={(e) => setLogForm({ ...logForm, date: e.target.value })}
              />
              <label className="cz-label font-mono">WHO DID THE WORK?</label>
              <div className="cz-toggle-row">
                <button
                  className={`cz-toggle ${logForm.mode === "self" ? "cz-toggle-active" : ""}`}
                  onClick={() => setLogForm({ ...logForm, mode: "self" })}
                >
                  I did it myself
                </button>
                <button
                  className={`cz-toggle ${logForm.mode === "shop" ? "cz-toggle-active" : ""}`}
                  onClick={() => setLogForm({ ...logForm, mode: "shop" })}
                >
                  A shop did it
                </button>
              </div>
              {logForm.mode === "shop" && (
                <>
                  <label className="cz-label font-mono">SHOP</label>
                  <select
                    className="cz-input font-body"
                    value={logForm.shopId}
                    onChange={(e) => setLogForm({ ...logForm, shopId: e.target.value })}
                  >
                    {getAllShops().map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <p className="cz-helper font-body" style={{ marginTop: 8 }}>
                    This entry will show as "awaiting confirmation" until {getAllShops().find((s) => s.id === logForm.shopId)?.name}{" "}
                    verifies it.
                  </p>
                </>
              )}
              <label className="cz-label font-mono">NOTES</label>
              <textarea
                className="cz-input cz-textarea font-body"
                rows={3}
                value={logForm.notes}
                onChange={(e) => setLogForm({ ...logForm, notes: e.target.value })}
                placeholder="What was done?"
              />
              <label className="cz-label font-mono">COST <span style={{ color: "var(--muted)", fontWeight: 400 }}>(optional)</span></label>
              <div className="cz-currency-field">
                <span className="cz-currency-prefix font-mono">R</span>
                <input
                  className="cz-input font-body cz-currency-input"
                  type="number"
                  min="0"
                  step="1"
                  inputMode="decimal"
                  value={logForm.cost}
                  onChange={(e) => setLogForm({ ...logForm, cost: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <button className="cz-btn cz-btn-primary cz-btn-block" style={{ marginTop: 18 }} onClick={submitLog}>
                Save service log
              </button>
            </div>
          </>
        );

      case "shop-directory":
        return (
          <>
            <TopBar title="Verified shops" onBack={() => setScreen("customer-home")} />
            <div className="cz-screen-pad">
              {getAllShops().map((base) => {
                const s = getShopProfile(base.id);
                return (
                  <button
                    key={s.id}
                    className="cz-shop-list-item"
                    onClick={() => {
                      setProfileShop(s);
                      setScreen("shop-profile");
                    }}
                  >
                    <ShopAvatar shop={s} size={40} fontSize={15} />
                    <div className="cz-shop-list-text">
                      <span className="font-display cz-shop-list-name">{s.name}</span>
                      <span className="font-mono cz-shop-list-area">
                        <MapPin size={11} style={{ marginRight: 3, verticalAlign: "-1px" }} />
                        {s.area}
                      </span>
                      {s.address && (
                        <span className="font-mono cz-shop-list-address">{s.address}</span>
                      )}
                    </div>
                    <div className="cz-shop-list-rating font-mono">
                      {s.rating ? (
                        <>
                          <Star size={12} fill="currentColor" style={{ marginRight: 3, verticalAlign: "-1px" }} />
                          {s.rating}
                        </>
                      ) : (
                        <span className="cz-shop-new-badge">NEW</span>
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
              <div className="cz-screen-pad">
                <div className="cz-shop-profile-head">
                  <ShopAvatar shop={profileShop} size={64} fontSize={24} />
                  <div>
                    <span className="font-display" style={{ fontSize: 20, display: "block", marginBottom: 4 }}>{profileShop.name}</span>
                    <div className="cz-profile-rating font-mono" style={{ marginBottom: 4 }}>
                      {profileShop.rating ? (
                        <>
                          <Star size={12} fill="currentColor" style={{ marginRight: 4, verticalAlign: "-1px" }} />
                          {profileShop.rating} · {profileShop.reviews} reviews
                        </>
                      ) : (
                        <span className="cz-shop-new-badge">NEW TO CADENZO</span>
                      )}
                    </div>
                    <p className="font-mono cz-profile-area" style={{ margin: 0 }}>
                      <MapPin size={12} style={{ marginRight: 3, verticalAlign: "-2px" }} />
                      {profileShop.area}
                    </p>
                    {profileShop.address && (
                      <p className="font-mono cz-profile-address" style={{ margin: "4px 0 0" }}>
                        {profileShop.address}
                      </p>
                    )}
                  </div>
                </div>
                <h2 className="cz-section-title font-mono" style={{ marginTop: 20 }}>SPECIALITIES</h2>
                <div className="cz-chip-row">
                  {profileShop.specialties.map((sp) => (
                    <span key={sp} className="cz-chip cz-chip-static">{sp}</span>
                  ))}
                </div>
                <p className="cz-helper font-body" style={{ marginTop: 16 }}>
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
            <div className="cz-topbar">
              <span className="cz-iconbtn-spacer" />
              <h1 className="cz-topbar-title font-display">{activeShop?.name}</h1>
              <button className="cz-iconbtn cz-iconbtn-badged" onClick={openMenu} aria-label="Menu">
                <Menu size={20} />
                {shopThreadUnread > 0 && <span className="cz-topbar-menu-badge" />}
              </button>
            </div>
            <div className="cz-screen-pad">
              <h2 className="cz-section-title font-mono">LOOK UP A BIKE</h2>
              <p className="cz-helper font-body">Scan the rider's QR tag or enter their bike ID.</p>
              <div className="cz-lookup-row">
                <input
                  className="cz-input font-mono"
                  style={{ textTransform: "uppercase" }}
                  value={lookupInput}
                  onChange={(e) => {
                    setLookupInput(e.target.value);
                    setLookupError("");
                  }}
                  placeholder="CZ-XXXX-XXXX"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleLookup();
                  }}
                />
                <button className="cz-iconbtn cz-iconbtn-filled" onClick={handleLookup} aria-label="Search">
                  <ScanLine size={18} />
                </button>
              </div>
              {lookupError && <p className="cz-error font-body">{lookupError}</p>}

              <button className="cz-unclaimed-entry" onClick={() => setScreen("shop-unclaimed-bikes")}>
                <div className="cz-unclaimed-entry-icon"><HelpCircle size={17} /></div>
                <div className="cz-unclaimed-entry-text">
                  <span className="font-display">Unclaimed bikes</span>
                  <span className="font-mono">
                    {bikes.filter((b) => b.isUnclaimed).length} bike{bikes.filter((b) => b.isUnclaimed).length === 1 ? "" : "s"} with no current owner
                  </span>
                </div>
                <ChevronRight size={16} className="cz-unclaimed-entry-arrow" />
              </button>

              <h2 className="cz-section-title font-mono" style={{ marginTop: 28 }}>
                AWAITING YOUR CONFIRMATION ({pendingForShop.length})
              </h2>
              {pendingForShop.length === 0 ? (
                <EmptyState Icon={ShieldCheck} title="All caught up" body="No rider-submitted services are waiting on your confirmation." />
              ) : (
                pendingForShop.map((p) => (
                  <div key={p.id} className="cz-queue-item">
                    <div className="cz-queue-item-text">
                      <span className="font-display cz-queue-item-type">{p.type}</span>
                      <span className="font-mono cz-queue-item-meta">
                        {p.bikeLabel} · {formatDate(p.date)}
                      </span>
                      <p className="font-body cz-queue-item-notes">{p.notes}</p>
                    </div>
                    <button className="cz-btn cz-btn-primary cz-btn-small" onClick={() => verifyEntry(p.bikeId, p.id)}>
                      <CheckCircle2 size={14} style={{ marginRight: 6 }} />
                      Confirm
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        );

      case "shop-unclaimed-bikes": {
        const unclaimedBikes = bikes.filter((b) => b.isUnclaimed);
        return (
          <>
            <TopBar title="Unclaimed bikes" onBack={() => setScreen("shop-dashboard")} />
            <div className="cz-screen-pad">
              <p className="cz-helper font-body">
                These bikes have no current owner — usually because the previous rider's account was deleted. If a walk-in customer can prove they own one (matching serial number on the frame), you can claim it on their behalf.
              </p>
              {unclaimedBikes.length === 0 ? (
                <EmptyState Icon={HelpCircle} title="No unclaimed bikes" body="Bikes appear here if a rider's account is deleted while they still own a registered bike." />
              ) : (
                unclaimedBikes.map((b) => {
                  const typeMeta = getBikeTypeMeta(b.bikeType);
                  const TypeIcon = typeMeta.icon;
                  return (
                    <button
                      key={b.id}
                      className="cz-bike-card"
                      onClick={() => { setUnclaimedBikeId(b.id); setClaimOnBehalfForm({ name: "", email: "" }); setScreen("shop-claim-unclaimed"); }}
                    >
                      <div className="cz-bike-card-icon">
                        <TypeIcon size={22} />
                      </div>
                      <div className="cz-bike-card-text">
                        <span className="font-display cz-bike-card-name">{b.brand} {b.model}</span>
                        <span className="font-mono cz-bike-card-id">{b.id} · SN {b.serialNumber}</span>
                      </div>
                      <ChevronRight size={16} style={{ color: "var(--muted)", flexShrink: 0 }} />
                    </button>
                  );
                })
              )}
            </div>
          </>
        );
      }

      case "shop-claim-unclaimed": {
        const bike = bikes.find((b) => b.id === unclaimedBikeId);
        if (!bike) {
          return (
            <>
              <TopBar title="Claim bike" onBack={() => setScreen("shop-unclaimed-bikes")} />
              <div className="cz-screen-pad"><EmptyState Icon={HelpCircle} title="Bike not found" body="This bike may have already been claimed." /></div>
            </>
          );
        }
        const typeMeta = getBikeTypeMeta(bike.bikeType);
        const TypeIcon = typeMeta.icon;
        return (
          <>
            <TopBar title="Claim on behalf of rider" onBack={() => setScreen("shop-unclaimed-bikes")} />
            <div className="cz-screen-pad">
              <div className="cz-claim-preview">
                <div className="cz-claim-preview-head">
                  <div className="cz-bike-card-icon" style={{ width: 44, height: 44 }}>
                    <TypeIcon size={22} />
                  </div>
                  <div>
                    <span className="font-display" style={{ fontSize: 18, display: "block" }}>{bike.brand} {bike.model}</span>
                    <span className="font-mono" style={{ fontSize: 10, color: "var(--muted)" }}>{bike.id}</span>
                  </div>
                </div>
                <div className="cz-detail-tags" style={{ marginTop: 12 }}>
                  <span className="cz-detail-tag"><TypeIcon size={12} /><span className="font-mono">{typeMeta.label}</span></span>
                  <span className="cz-detail-tag"><span className="font-mono">SN {bike.serialNumber}</span></span>
                  <span className="cz-detail-tag" style={{ borderColor: "var(--pending)", color: "var(--pending)", background: "var(--pending-bg)" }}>
                    <HelpCircle size={12} /><span className="font-mono">Unclaimed</span>
                  </span>
                </div>
              </div>

              <h2 className="cz-section-title font-mono" style={{ marginTop: 20 }}>VERIFY BEFORE CLAIMING</h2>
              <p className="cz-helper font-body" style={{ marginBottom: 14 }}>
                Confirm the serial number stamped on the frame matches <strong style={{ color: "var(--ink)" }}>{bike.serialNumber}</strong> before proceeding. Claiming assigns this bike, and its full history below, to the new owner.
              </p>

              <h2 className="cz-section-title font-mono">SERVICE HISTORY ({bike.serviceLog.length})</h2>
              {bike.serviceLog.length === 0 ? (
                <p className="cz-helper font-body">No services logged.</p>
              ) : (
                <div className="cz-tag-chain">
                  {[...bike.serviceLog].sort((a, b2) => new Date(b2.date) - new Date(a.date)).map((entry) => (
                    <ServiceTag key={entry.id} entry={entry} />
                  ))}
                </div>
              )}

              <h2 className="cz-section-title font-mono" style={{ marginTop: 18 }}>PREVIOUS OWNERSHIP</h2>
              <div className="cz-ownership-chain">
                {[...(bike.ownershipLog || [])].reverse().map((entry, i) => (
                  <div key={i} className="cz-owner-entry">
                    <div className="cz-owner-dot" />
                    <div className="cz-owner-text">
                      <span className="font-display cz-owner-name">{entry.name}</span>
                      <span className="font-mono cz-owner-meta">
                        {entry.type === "original" ? "First registered" : entry.type === "orphan-unclaimed" ? "Became unclaimed" : "Transferred"} · {formatDate(entry.date)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <h2 className="cz-section-title font-mono" style={{ marginTop: 20 }}>NEW OWNER DETAILS</h2>
              <label className="cz-label font-mono">RIDER'S FULL NAME</label>
              <input
                className="cz-input font-body"
                value={claimOnBehalfForm.name}
                onChange={(e) => setClaimOnBehalfForm({ ...claimOnBehalfForm, name: e.target.value })}
                placeholder="e.g. Thandiwe Mokoena"
              />
              <label className="cz-label font-mono">RIDER'S EMAIL</label>
              <input
                className="cz-input font-body"
                type="email"
                value={claimOnBehalfForm.email}
                onChange={(e) => setClaimOnBehalfForm({ ...claimOnBehalfForm, email: e.target.value })}
                placeholder="e.g. thandiwe@example.com"
              />
              <p className="cz-helper font-body" style={{ marginTop: 6 }}>
                Claiming this bike will mark it as verified by {activeShop?.name}, and record you as the verifying shop in its ownership history.
              </p>
              <button
                className="cz-btn cz-btn-primary cz-btn-block"
                style={{ marginTop: 14 }}
                onClick={submitClaimOnBehalf}
                disabled={!claimOnBehalfForm.name.trim() || !claimOnBehalfForm.email.trim()}
              >
                <UserCheck size={15} style={{ marginRight: 8 }} />
                Claim bike for this rider
              </button>
            </div>
          </>
        );
      }

      case "shop-lookup-result": {
        const lookupTypeMeta = lookupBike ? getBikeTypeMeta(lookupBike.bikeType) : null;
        const LookupTypeIcon = lookupTypeMeta ? lookupTypeMeta.icon : Bike;
        const ownershipLog = lookupBike?.ownershipLog || [];
        const transferCount = Math.max(0, ownershipLog.length - 1);
        return (
          <>
            <TopBar title="Bike record" onBack={() => setScreen("shop-dashboard")} />
            {lookupBike && (
              <div className="cz-screen-pad" style={{ paddingBottom: 4 }}>

                {/* ── Bike header ── */}
                <div className="cz-bike-detail-head">
                  <div>
                    <span className="font-display cz-bike-card-name" style={{ display: "block", marginBottom: 4 }}>
                      {lookupBike.brand} {lookupBike.model}
                    </span>
                    <span className="font-mono cz-bike-detail-id">{lookupBike.id}</span>
                    <span className="font-body cz-bike-detail-meta">{lookupBike.color}</span>
                  </div>
                </div>

                {/* ── Chips row ── */}
                <div className="cz-detail-tags">
                  <span className="cz-detail-tag">
                    <LookupTypeIcon size={13} />
                    <span className="font-mono">{getBikeLabel(lookupBike)}</span>
                  </span>
                  {lookupBike.isEbike && (
                    <span className="cz-detail-tag cz-detail-tag-ebike">
                      <Zap size={12} fill="currentColor" />
                      <span className="font-mono">Electric</span>
                    </span>
                  )}
                  <span className="cz-detail-tag">
                    <span className="font-mono">SN {lookupBike.serialNumber}</span>
                  </span>
                  <span className={`cz-detail-tag ${lookupBike.detailsVerified ? "cz-detail-tag-verified" : ""}`}>
                    {lookupBike.detailsVerified ? <ShieldCheck size={13} /> : <Shield size={13} />}
                    <span className="font-mono">
                      {lookupBike.detailsVerified ? `Verified by ${lookupBike.detailsVerifiedBy}` : "Details not verified"}
                    </span>
                  </span>
                </div>

                {/* ── Verify details CTA ── */}
                {!lookupBike.detailsVerified && (
                  <button
                    className="cz-btn cz-btn-secondary cz-btn-small cz-btn-block"
                    style={{ marginBottom: 20 }}
                    onClick={() => verifyBikeDetails(lookupBike.id)}
                  >
                    <ShieldCheck size={14} style={{ marginRight: 6 }} />
                    Verify type &amp; serial number
                  </button>
                )}

                {/* ══ OWNERSHIP ══ */}
                <h2 className="cz-section-title font-mono">OWNERSHIP</h2>

                {/* Current owner card */}
                <div className="cz-shop-owner-card">
                  <div className="cz-shop-owner-avatar font-display">
                    {(lookupBike.ownerName || "?")[0].toUpperCase()}
                  </div>
                  <div className="cz-shop-owner-text">
                    <span className="font-display cz-shop-owner-name">{lookupBike.ownerName}</span>
                    <span className="font-mono cz-shop-owner-since">
                      Current owner · since {ownershipLog.length ? formatDate(ownershipLog[ownershipLog.length - 1].date) : formatDate(lookupBike.registeredOn)}
                    </span>
                  </div>
                  <span className={`cz-detail-tag ${lookupBike.transferPending ? "cz-detail-tag-pending-tx" : ""}`} style={{ flexShrink: 0 }}>
                    <span className="font-mono" style={{ fontSize: 10 }}>
                      {lookupBike.transferPending ? "⚠ Transfer pending" : `${transferCount} transfer${transferCount !== 1 ? "s" : ""}`}
                    </span>
                  </span>
                </div>

                {/* Chain of custody timeline */}
                {ownershipLog.length > 0 && (
                  <>
                    <h2 className="cz-section-title font-mono" style={{ marginTop: 18 }}>CHAIN OF CUSTODY</h2>
                    <div className="cz-ownership-chain">
                      {[...ownershipLog].reverse().map((entry, i) => (
                        <div key={i} className={`cz-owner-entry ${i === 0 ? "cz-owner-current" : ""}`}>
                          <div className="cz-owner-dot" />
                          <div className="cz-owner-text">
                            <span className="font-display cz-owner-name">
                              {entry.name}{i === 0 ? " — current owner" : ""}
                            </span>
                            <span className="font-mono cz-owner-meta">
                              {entry.type === "original" ? "First registered"
                                : entry.type === "orphan-unclaimed" ? "Became unclaimed"
                                : entry.type === "orphan-claim" ? `Claimed via ${entry.verifiedByShop || "shop"}`
                                : "Transferred"} · {formatDate(entry.date)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <div className="cz-section-divider" />

                {/* ══ SERVICE HISTORY ══ */}
                <h2 className="cz-section-title font-mono">SERVICE HISTORY</h2>
                {lookupBike.serviceLog.length === 0 ? (
                  <EmptyState Icon={ClipboardList} title="No history yet" body="This bike has no logged services." />
                ) : (
                  <div className="cz-tag-chain">
                    {[...lookupBike.serviceLog]
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((entry) => (
                        <div key={entry.id}>
                          <ServiceTag entry={entry} />
                          {entry.status === "pending" && entry.shopName === activeShop?.name && (
                            <button
                              className="cz-btn cz-btn-primary cz-btn-small cz-btn-block"
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
            <div className="cz-sticky-footer">
              <button className="cz-btn cz-btn-primary cz-btn-block" onClick={openShopAddForm}>
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
            <div className="cz-screen-pad">
              <label className="cz-label font-mono">SERVICE TYPE</label>
              <div className="cz-chip-row">
                {SERVICE_TYPES.map((t) => (
                  <button
                    key={t}
                    className={`cz-chip ${shopAddForm.type === t ? "cz-chip-active" : ""}`}
                    onClick={() => setShopAddForm({ ...shopAddForm, type: t })}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <label className="cz-label font-mono">DATE</label>
              <input
                type="date"
                className="cz-input font-body"
                value={shopAddForm.date}
                onChange={(e) => setShopAddForm({ ...shopAddForm, date: e.target.value })}
              />
              <label className="cz-label font-mono">NOTES</label>
              <textarea
                className="cz-input cz-textarea font-body"
                rows={3}
                value={shopAddForm.notes}
                onChange={(e) => setShopAddForm({ ...shopAddForm, notes: e.target.value })}
                placeholder="What was done?"
              />
              <p className="cz-helper font-body" style={{ marginTop: 10 }}>
                This will be added as already verified, signed under {activeShop?.name}.
              </p>
              <button className="cz-btn cz-btn-primary cz-btn-block" onClick={submitShopAddForm}>
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
            <div className="cz-screen-pad">
              <label className="cz-label font-mono">COMPONENT TYPE</label>
              <div className="cz-chip-row">
                {COMPONENT_PRESETS.map((p) => (
                  <button
                    key={p.type}
                    className={`cz-chip ${compForm.type === p.type ? "cz-chip-active" : ""}`}
                    onClick={() => setCompForm({ ...compForm, type: p.type, maxKm: p.maxKm })}
                  >
                    {p.type}
                  </button>
                ))}
              </div>

              {activePreset.range !== "Custom" && (
                <div className="cz-preset-card">
                  <div className="cz-preset-card-head">
                    <span className="font-display cz-preset-card-type">{activePreset.type}</span>
                    <span className="cz-preset-card-range font-mono">{activePreset.range}</span>
                  </div>
                  <p className="font-body cz-preset-card-desc">{activePreset.description}</p>
                  <p className="font-mono cz-preset-card-source">
                    Source: {activePreset.basis}
                  </p>
                </div>
              )}

              <label className="cz-label font-mono">BRAND</label>
              <input className="cz-input font-body" value={compForm.brand} onChange={(e) => setCompForm({ ...compForm, brand: e.target.value })} placeholder="e.g. Shimano" />
              <label className="cz-label font-mono">MODEL</label>
              <input className="cz-input font-body" value={compForm.model} onChange={(e) => setCompForm({ ...compForm, model: e.target.value })} placeholder="e.g. CN-HG601" />
              <label className="cz-label font-mono">INSTALLED ON</label>
              <input type="date" className="cz-input font-body" value={compForm.date} onChange={(e) => setCompForm({ ...compForm, date: e.target.value })} />
              <label className="cz-label font-mono">KM ALREADY ON THIS PART <span style={{ color: "var(--muted)", fontWeight: 400 }}>(if used)</span></label>
              <input type="number" className="cz-input font-body" value={compForm.baseKm} onChange={(e) => setCompForm({ ...compForm, baseKm: e.target.value })} placeholder="0" />
              <label className="cz-label font-mono">COST <span style={{ color: "var(--muted)", fontWeight: 400 }}>(optional)</span></label>
              <div className="cz-currency-field">
                <span className="cz-currency-prefix font-mono">R</span>
                <input
                  className="cz-input font-body cz-currency-input"
                  type="number"
                  min="0"
                  step="1"
                  inputMode="decimal"
                  value={compForm.cost}
                  onChange={(e) => setCompForm({ ...compForm, cost: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <label className="cz-label font-mono">
                SERVICE THRESHOLD (km)
                {activePreset.range !== "Custom" && (
                  <span style={{ color: "var(--gold)", fontWeight: 400, marginLeft: 6 }}>
                    · recommended {activePreset.maxKm.toLocaleString()} km
                  </span>
                )}
              </label>
              <input type="number" className="cz-input font-body" value={compForm.maxKm} onChange={(e) => setCompForm({ ...compForm, maxKm: e.target.value })} placeholder="e.g. 3000" />
              <p className="cz-helper font-body" style={{ marginTop: 6 }}>
                You can adjust the threshold to suit your riding style and conditions.
              </p>
              <button className="cz-btn cz-btn-primary cz-btn-block" style={{ marginTop: 14 }} onClick={submitAddComponent}>
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
            <div className="cz-screen-pad cz-center-col">
              {txBike && (
                <>
                  <div className="cz-brandmark" style={{ marginBottom: 16 }}>
                    <ArrowRightLeft size={24} />
                  </div>
                  <p className="cz-helper font-body" style={{ textAlign: "center", marginBottom: 6 }}>
                    Share this code with the new owner. They enter it under <strong>Claim transfer</strong> to accept the bike and its full history.
                  </p>
                  <div className="cz-txcode-display font-mono">{txBike.transferCode}</div>
                  <p className="cz-helper font-body" style={{ textAlign: "center", marginTop: 10 }}>
                    The code expires once claimed or cancelled. Your record shows the bike as pending transfer until then.
                  </p>
                  <button className="cz-btn cz-btn-secondary cz-btn-block" onClick={() => cancelTransfer(transferBikeId)}>
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
            <div className="cz-screen-pad">
              <p className="cz-helper font-body">
                Enter the transfer code from the current owner. The bike's full service history and verified records will carry over to your account.
              </p>
              <label className="cz-label font-mono">TRANSFER CODE</label>
              <input
                className="cz-input font-mono"
                style={{ textTransform: "uppercase", letterSpacing: "0.12em" }}
                value={claimInput}
                onChange={(e) => { setClaimInput(e.target.value); setClaimError(""); }}
                placeholder="TX-XXXX-XXXX"
                onKeyDown={(e) => { if (e.key === "Enter") handleClaim(); }}
              />
              {claimError && <p className="cz-error font-body">{claimError}</p>}
              <button
                className="cz-btn cz-btn-primary cz-btn-block"
                style={{ marginTop: 18 }}
                onClick={handleClaim}
                disabled={!claimInput.trim()}
              >
                Look up bike
              </button>
              <p className="cz-helper font-body" style={{ marginTop: 14, textAlign: "center" }}>
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
              <div className="cz-screen-pad">
                <div className="cz-claim-preview">
                  <div className="cz-claim-preview-head">
                    <div className="cz-bike-card-icon" style={{ width: 44, height: 44 }}>
                      <ClaimTypeIcon size={22} />
                    </div>
                    <div>
                      <span className="font-display" style={{ fontSize: 18, display: "block" }}>
                        {claimBike.brand} {claimBike.model}
                      </span>
                      <span className="font-mono" style={{ fontSize: 10, color: "var(--muted)" }}>{claimBike.id}</span>
                    </div>
                  </div>
                  <div className="cz-detail-tags" style={{ marginTop: 12 }}>
                    <span className="cz-detail-tag"><ClaimTypeIcon size={12} /><span className="font-mono">{claimTypeMeta.label}</span></span>
                    <span className="cz-detail-tag"><span className="font-mono">SN {claimBike.serialNumber}</span></span>
                    {claimBike.detailsVerified && (
                      <span className="cz-detail-tag cz-detail-tag-verified"><ShieldCheck size={12} /><span className="font-mono">Verified</span></span>
                    )}
                  </div>
                </div>
                <h2 className="cz-section-title font-mono" style={{ marginTop: 20 }}>WHAT TRANSFERS WITH THE BIKE</h2>
                <div className="cz-transfer-checklist">
                  <div className="cz-transfer-check"><CheckCircle2 size={14} style={{ color: "var(--verified)", marginRight: 10, flexShrink: 0 }} /><span className="font-body">Full service history ({claimBike.serviceLog.length} {claimBike.serviceLog.length === 1 ? "entry" : "entries"})</span></div>
                  <div className="cz-transfer-check"><CheckCircle2 size={14} style={{ color: "var(--verified)", marginRight: 10, flexShrink: 0 }} /><span className="font-body">Component wear records ({(claimBike.components || []).length} tracked parts)</span></div>
                  <div className="cz-transfer-check"><CheckCircle2 size={14} style={{ color: "var(--verified)", marginRight: 10, flexShrink: 0 }} /><span className="font-body">Ownership chain ({(claimBike.ownershipLog || []).length} previous {(claimBike.ownershipLog || []).length === 1 ? "owner" : "owners"})</span></div>
                  {claimBike.detailsVerified && <div className="cz-transfer-check"><CheckCircle2 size={14} style={{ color: "var(--verified)", marginRight: 10, flexShrink: 0 }} /><span className="font-body">Shop-verified serial number &amp; type</span></div>}
                </div>
                <button className="cz-btn cz-btn-primary cz-btn-block" style={{ marginTop: 24 }} onClick={acceptClaim}>
                  <UserCheck size={15} style={{ marginRight: 8 }} /> Accept &amp; transfer to my account
                </button>
                <button className="cz-btn cz-btn-secondary cz-btn-block" style={{ marginTop: 8 }} onClick={() => setScreen("claim-bike")}>
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
            <div className="cz-screen-pad">
              {contactShopState.sent ? (
                <div className="cz-menu-sent" style={{ paddingTop: 40 }}>
                  <CheckCircle2 size={32} style={{ color: "var(--verified)", marginBottom: 14 }} />
                  <span className="font-display" style={{ fontSize: 20 }}>Message sent</span>
                  <p className="cz-helper font-body" style={{ textAlign: "center", marginTop: 8 }}>
                    {csShop?.name} will respond via email or phone.
                  </p>
                </div>
              ) : (
                <>
                  {/* Shop recipient */}
                  <label className="cz-label font-mono">TO</label>
                  {csShop ? (
                    <div className="cz-cs-recipient">
                      <ShopAvatar shop={csShop} size={36} fontSize={14} />
                      <div>
                        <span className="font-display" style={{ fontSize: 14, display: "block" }}>{csShop.name}</span>
                        <span className="font-mono" style={{ fontSize: 10, color: "var(--muted)" }}>{csShop.area} · Preferred shop</span>
                      </div>
                    </div>
                  ) : (
                    <p className="cz-error font-body">No preferred shop set. Add one in your profile.</p>
                  )}

                  {/* Component context */}
                  {csComp && csBike && (
                    <>
                      <label className="cz-label font-mono">REGARDING</label>
                      <div className="cz-cs-context">
                        <div>
                          <span className="font-display" style={{ fontSize: 14, display: "block" }}>{csComp.type}</span>
                          <span className="font-mono" style={{ fontSize: 10, color: "var(--muted)" }}>
                            {csComp.brand} {csComp.model} · {csBike.brand} {csBike.model} ({csBike.id})
                          </span>
                        </div>
                        <span className="cz-detail-tag" style={{ flexShrink: 0 }}>
                          <span className="font-mono" style={{ fontSize: 10 }}>
                            {Math.round((getComponentKm(csComp) / csComp.maxKm) * 100)}% worn
                          </span>
                        </span>
                      </div>
                    </>
                  )}

                  {/* Free text message */}
                  <label className="cz-label font-mono">MESSAGE</label>
                  <textarea
                    className="cz-input cz-textarea font-body"
                    rows={5}
                    value={contactShopState.message}
                    onChange={(e) => setContactShopState(prev => ({ ...prev, message: e.target.value }))}
                    placeholder={`e.g. Hi ${csShop?.name?.split(" ")[0] || "there"}, my ${csComp?.type?.toLowerCase() || "component"} is getting close to its service limit — can I book it in for a replacement this week?`}
                    autoFocus
                  />
                  <p className="cz-helper font-body" style={{ marginTop: 6 }}>
                    Your name, email, and bike details will be included automatically.
                  </p>
                  <button
                    className="cz-btn cz-btn-primary cz-btn-block"
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
    <div className="cz-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,600&family=Inter:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .cz-root{
          --ink:#0C0B10; --paper:#FAFAF8; --paper-dark:#F0EFE9; --paper-light:#FFFFFF;
          --steel:#0F0E1A; --garage:#070610; --garage-soft:#13111F;
          --verified:#1A5C45; --verified-bg:#EAF3EE;
          --pending:#8B6318; --pending-bg:#F5EDD8;
          --alert:#7C1F35; --alert-bg:#F5E4E8;
          --line:#E4E2DC; --muted:#918F8A;
          --gold:#9E7E38; --gold-light:#C9A962; --gold-subtle:#F5EDD8;
          font-family:'Inter',sans-serif; color:var(--ink); box-sizing:border-box;
        }
        .cz-root *{ box-sizing:border-box; }
        .font-display{ font-family:'Cormorant Garamond',serif; font-weight:600; }
        .font-body{ font-family:'Inter',sans-serif; }
        .font-mono{ font-family:'IBM Plex Mono',monospace; letter-spacing:0.02em; }

        /* ---- Shell ---- */
        .cz-backdrop{ min-height:100vh; width:100%; background:#07060F;
          display:flex; flex-direction:column; align-items:center; justify-content:center; padding:32px 16px; }

        /* ---- Standalone mode (installed on a real device — no decorative bezel) ---- */
        .cz-standalone-root{ min-height:100vh; min-height:100dvh; width:100%; background:var(--paper);
          display:flex; flex-direction:column; }
        .cz-standalone-phone{ width:100%; flex:1; display:flex; flex-direction:column; background:var(--paper); }
        .cz-standalone-phone .cz-screen{ height:auto; }
        .cz-phone{ width:min(390px,92vw); height:min(844px,86vh); background:var(--paper); border-radius:44px;
          border:10px solid #0F0E18; box-shadow:0 40px 80px -20px rgba(0,0,0,0.8), 0 0 0 1px var(--gold); position:relative; overflow:hidden;
          display:flex; flex-direction:column; }
        .cz-phone::before{ content:""; position:absolute; top:0; left:50%; transform:translateX(-50%);
          width:110px; height:20px; background:#0F0E18; border-radius:0 0 12px 12px; z-index:5; }
        .cz-screen{ flex:1; overflow-y:auto; position:relative; display:flex; flex-direction:column; }
        .cz-home-indicator{ position:absolute; bottom:8px; left:50%; transform:translateX(-50%);
          width:100px; height:3px; background:rgba(12,11,16,0.18); border-radius:2px; z-index:5; }
        .cz-caption{ margin-top:20px; color:#3D3A52; font-family:'IBM Plex Mono',monospace; font-size:10px;
          letter-spacing:0.1em; text-align:center; max-width:320px; }

        /* ---- Layout ---- */
        .cz-screen-pad{ padding:24px 20px calc(32px + env(safe-area-inset-bottom)); flex:1; }
        .cz-center-col{ display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; height:100%; }

        /* ---- Landing ---- */
        .cz-brandmark{ width:60px; height:60px; border-radius:50%; background:var(--steel); color:var(--gold-light);
          border:1px solid var(--gold); display:flex; align-items:center; justify-content:center; margin-bottom:20px; }
        .cz-wordmark{ font-size:34px; font-style:italic; font-weight:700; letter-spacing:0.03em; margin:0; color:var(--ink); }
        .cz-wordmark-row{ display:flex; align-items:center; gap:12px; margin-bottom:10px; }
        .cz-tagline{ font-size:13px; color:var(--muted); max-width:240px; margin:0 0 36px; line-height:1.6; font-weight:300; }
        .cz-landing-actions{ display:flex; flex-direction:column; gap:10px; width:100%; }

        /* ---- Buttons ---- */
        .cz-btn{ font-family:'Inter',sans-serif; font-weight:500; font-size:14px; padding:14px 18px;
          border-radius:4px; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center;
          letter-spacing:0.01em; transition:opacity 0.15s; }
        .cz-btn:active{ opacity:0.82; transform:none; }
        .cz-btn:disabled{ opacity:0.35; cursor:not-allowed; }
        .cz-btn-block{ width:100%; }
        .cz-btn-small{ padding:9px 14px; font-size:12px; }
        .cz-btn-primary{ background:var(--steel); color:var(--paper); }
        .cz-btn-danger{ background:var(--alert); color:#fff; }
        .cz-btn-secondary{ background:var(--paper-dark); color:var(--ink); border:1px solid var(--line); }
        .cz-btn-outline{ background:transparent; border:1px solid var(--line); color:var(--ink); margin-top:12px; }
        .cz-btn-strava{ background:#FC4C02; color:#fff; }

        /* ---- Form elements ---- */
        .cz-helper{ font-size:12.5px; color:var(--muted); line-height:1.6; margin:0 0 16px; font-weight:400; }
        .cz-label{ display:block; font-size:10px; color:var(--muted); margin:20px 0 7px; letter-spacing:0.1em; font-weight:500; }
        .cz-input{ width:100%; padding:11px 13px; border-radius:3px; border:1px solid var(--line);
          background:var(--paper-light); font-size:13.5px; color:var(--ink); outline:none; font-family:'Inter',sans-serif; }
        .cz-input:focus{ border-color:var(--ink); }

        /* ---- Currency (Rand) input ---- */
        .cz-currency-field{ display:flex; align-items:center; border:1px solid var(--line); background:var(--paper-light); }
        .cz-currency-prefix{ padding:0 0 0 13px; font-size:13.5px; color:var(--muted); flex-shrink:0; }
        .cz-currency-input{ border:none !important; padding-left:6px !important; }
        .cz-currency-input:focus{ border:none; }
        .cz-tag-cost{ font-size:10.5px; color:var(--gold); letter-spacing:0.02em; flex-shrink:0; }
        .cz-comp-cost{ color:var(--gold) !important; }
        .cz-textarea{ resize:vertical; font-family:'Inter',sans-serif; }

        /* ---- Password field ---- */
        .cz-password-field{ position:relative; display:flex; align-items:center; }
        .cz-password-field .cz-input{ padding-right:42px; }
        .cz-password-toggle{ position:absolute; right:10px; top:50%; transform:translateY(-50%);
          background:none; border:none; cursor:pointer; color:var(--muted); padding:4px;
          display:flex; align-items:center; justify-content:center; }
        .cz-password-toggle:hover{ color:var(--ink); }

        /* ---- Password strength checklist ---- */
        .cz-pw-checklist{ margin-top:10px; }
        .cz-pw-strength-track{ height:3px; background:var(--line); margin-bottom:10px; overflow:hidden; }
        .cz-pw-strength-fill{ height:100%; transition:width 0.2s, background 0.2s; }
        .cz-pw-strength-weak{ background:var(--alert); }
        .cz-pw-strength-medium{ background:var(--pending); }
        .cz-pw-strength-strong{ background:var(--verified); }
        .cz-pw-checks-grid{ display:grid; grid-template-columns:1fr 1fr; gap:6px 10px; }
        .cz-pw-check{ display:flex; align-items:center; gap:6px; color:var(--muted); }
        .cz-pw-check span{ font-size:10px; letter-spacing:0.02em; }
        .cz-pw-check-pass{ color:var(--verified); }

        /* ---- Top bar ---- */
        .cz-topbar{ display:flex; align-items:center; padding:calc(18px + env(safe-area-inset-top)) 16px 12px; gap:8px; border-bottom:1px solid var(--line); }
        .cz-topbar-title{ flex:1; font-size:15px; text-align:center; margin:0; letter-spacing:0.01em; font-family:'Cormorant Garamond',serif; font-weight:600; font-style:italic; }
        .cz-topbar-right{ width:32px; display:flex; justify-content:flex-end; }
        .cz-iconbtn{ width:32px; height:32px; border-radius:50%; border:none; background:transparent; color:var(--ink);
          display:flex; align-items:center; justify-content:center; cursor:pointer; }
        .cz-iconbtn:active{ background:rgba(0,0,0,0.05); }
        .cz-iconbtn-spacer{ width:32px; height:32px; }
        .cz-iconbtn-filled{ background:var(--steel); color:var(--paper); border-radius:3px; }
        .cz-iconbtn-badged{ position:relative; }
        .cz-topbar-menu-badge{ position:absolute; top:4px; right:5px; width:9px; height:9px; border-radius:50%;
          background:var(--alert); border:1.5px solid var(--paper); }

        /* ---- Shop auth ---- */
        .cz-shop-select{ width:100%; display:flex; align-items:center; gap:14px; padding:14px; border-radius:3px;
          border:1px solid var(--line); background:var(--paper-light); margin-bottom:8px; cursor:pointer; text-align:left;
          transition:border-color 0.15s; }
        .cz-shop-select:hover{ border-color:var(--gold); }
        .cz-shop-select-active{ border-color:var(--gold); background:var(--gold-subtle); }

        /* ---- "Can't find your shop?" journey ---- */
        .cz-shop-not-listed{ width:100%; display:flex; align-items:center; justify-content:center;
          padding:13px; border:1px dashed var(--line); background:transparent; color:var(--muted);
          font-family:'Inter',sans-serif; font-size:12.5px; font-weight:500; cursor:pointer; margin-top:4px;
          transition:border-color 0.15s, color 0.15s; }
        .cz-shop-not-listed:hover{ border-color:var(--gold); color:var(--gold); }
        .cz-new-shop-intro{ display:flex; flex-direction:column; align-items:center; text-align:center;
          padding:18px 16px 20px; border-bottom:1px solid var(--line); margin-bottom:18px; }
        .cz-shop-new-badge{ font-size:9.5px; color:var(--gold); border:1px solid var(--gold); padding:2px 7px;
          letter-spacing:0.08em; background:var(--gold-subtle); }
        .cz-shop-select-icon{ width:34px; height:34px; border-radius:50%; background:var(--steel); color:var(--gold-light);
          display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .cz-shop-select-active .cz-shop-select-icon{ background:var(--gold); }
        .cz-shop-select-text{ display:flex; flex-direction:column; gap:2px; flex:1; }
        .cz-shop-select-name{ font-size:13.5px; font-weight:500; }
        .cz-shop-select-area{ font-size:11px; color:var(--muted); }
        .cz-shop-select-address{ font-size:10px; color:var(--muted); opacity:0.75; margin-top:1px; }
        .cz-preferred-badge{ font-size:9px; color:var(--gold); border:1px solid var(--gold); padding:2px 6px;
          letter-spacing:0.08em; flex-shrink:0; background:var(--gold-subtle); }

        /* ---- Shop search autocomplete ---- */
        .cz-shop-search-wrap{ position:relative; }
        .cz-shop-search-field-wrap{ position:relative; }
        .cz-shop-search-field{ display:flex; align-items:center; border:1px solid var(--line); background:var(--paper-light);
          padding:0 12px; gap:8px; transition:border-color 0.15s; }
        .cz-shop-search-field:focus-within{ border-color:var(--ink); }
        .cz-shop-search-icon{ color:var(--muted); flex-shrink:0; }
        .cz-shop-search-input{ flex:1; border:none; background:transparent; padding:11px 0; font-size:13.5px;
          color:var(--ink); outline:none; font-family:'Inter',sans-serif; }
        .cz-shop-search-input::placeholder{ color:var(--muted); }
        .cz-shop-search-clear{ background:none; border:none; cursor:pointer; color:var(--muted); padding:4px; display:flex; }
        .cz-shop-search-hint{ font-size:10.5px; color:var(--muted); padding:8px 2px; letter-spacing:0.02em; }
        .cz-shop-dropdown{ position:absolute; top:100%; left:0; right:0; background:var(--paper-light);
          border:1px solid var(--ink); border-top:none; z-index:10; box-shadow:0 8px 24px rgba(0,0,0,0.12); }
        .cz-shop-dropdown-empty{ padding:14px 14px; font-size:11px; color:var(--muted); }
        .cz-shop-dropdown-item{ width:100%; display:flex; align-items:center; gap:12px; padding:11px 14px;
          background:transparent; border:none; border-bottom:1px solid var(--line); cursor:pointer; text-align:left;
          transition:background 0.1s; }
        .cz-shop-dropdown-item:last-child{ border-bottom:none; }
        .cz-shop-dropdown-item:hover{ background:var(--paper-dark); }
        .cz-shop-dropdown-icon{ width:28px; height:28px; border-radius:50%; background:var(--steel); color:var(--gold-light);
          display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .cz-shop-dropdown-text{ display:flex; flex-direction:column; gap:2px; flex:1; min-width:0; }
        .cz-shop-dropdown-name{ font-size:13px; }
        .cz-shop-dropdown-area{ font-size:10px; color:var(--muted); }
        .cz-shop-dropdown-address{ font-size:9px; color:var(--muted); opacity:0.7; display:block; }
        .cz-shop-dropdown-tags{ font-size:9.5px; color:var(--muted); letter-spacing:0.02em; }
        .cz-shop-dropdown-rating{ font-size:11px; color:var(--gold); display:flex; align-items:center; flex-shrink:0; }
        .cz-shop-selected-row{ display:flex; align-items:center; gap:12px; padding:12px 14px;
          border:1px solid var(--gold); background:var(--gold-subtle); }
        .cz-shop-clear{ background:none; border:none; cursor:pointer; font-size:10.5px; color:var(--gold);
          letter-spacing:0.06em; text-decoration:underline; flex-shrink:0; font-family:'IBM Plex Mono',monospace; }

        /* ---- Sign in hint ---- */
        .cz-signin-hint{ margin-top:24px; padding:14px 16px; border:1px solid var(--line); background:var(--paper-light); }

        /* ---- Account deletion ---- */
        .cz-danger-zone{ margin-top:28px; padding-top:20px; border-top:1px solid var(--line); }
        .cz-delete-account-btn{ width:100%; display:flex; align-items:center; padding:12px 14px;
          border:1px solid var(--alert); background:var(--alert-bg); color:var(--alert); cursor:pointer;
          font-size:13px; font-weight:500; }
        .cz-delete-warning{ display:flex; flex-direction:column; align-items:center; text-align:center;
          padding:18px 16px; background:var(--alert-bg); border:1px solid var(--alert); margin-bottom:20px; }
        .cz-delete-warning-title{ font-size:16px; color:var(--ink); margin-bottom:8px; }
        .cz-delete-warning-body{ font-size:12.5px; color:var(--ink); line-height:1.6; font-weight:300; margin:0; }

        /* ---- Social auth (Google / Apple) ---- */
        .cz-social-block{ margin-top:18px; }
        .cz-social-divider{ display:flex; align-items:center; justify-content:center; gap:10px; margin-bottom:14px; }
        .cz-social-divider::before, .cz-social-divider::after{ content:""; flex:1; height:1px; background:var(--line); }
        .cz-social-divider span{ font-size:9.5px; color:var(--muted); letter-spacing:0.08em; white-space:nowrap; }
        .cz-social-btn{ width:100%; display:flex; align-items:center; justify-content:center; gap:10px;
          padding:12px 16px; border-radius:3px; font-size:13.5px; font-weight:500; cursor:pointer;
          margin-bottom:9px; transition:opacity 0.15s; }
        .cz-social-btn:last-child{ margin-bottom:0; }
        .cz-social-btn:disabled{ opacity:0.4; cursor:not-allowed; }
        .cz-social-btn-google{ background:#fff; color:#1F1F1F; border:1px solid var(--line); }
        .cz-social-btn-apple{ background:#000; color:#fff; border:1px solid #000; }

        /* ---- Component preset info card ---- */
        .cz-preset-card{ padding:14px 16px; border:1px solid var(--gold); background:var(--gold-subtle); margin:12px 0 4px; }
        .cz-preset-card-head{ display:flex; align-items:baseline; justify-content:space-between; gap:10px; margin-bottom:8px; }
        .cz-preset-card-type{ font-size:15px; }
        .cz-preset-card-range{ font-size:11px; color:var(--gold); letter-spacing:0.04em; }
        .cz-preset-card-desc{ font-size:12.5px; color:var(--ink); line-height:1.6; margin:0 0 8px; }
        .cz-preset-card-source{ font-size:9.5px; color:var(--muted); letter-spacing:0.04em; margin:0; }

        /* ---- Auth type selection cards ---- */
        .cz-auth-type-card{ width:100%; display:flex; align-items:center; gap:14px; padding:16px;
          border:1px solid var(--line); background:var(--paper-light); margin-bottom:10px; cursor:pointer;
          text-align:left; transition:border-color 0.15s; }
        .cz-auth-type-card:hover{ border-color:var(--gold); }
        .cz-auth-type-icon{ width:44px; height:44px; border-radius:50%; background:var(--steel); color:var(--gold-light);
          display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .cz-auth-type-text{ display:flex; flex-direction:column; gap:4px; flex:1; }
        .cz-auth-type-label{ font-size:17px; display:block; }
        .cz-auth-type-desc{ font-size:12px; color:var(--muted); line-height:1.5; display:block; }
        .cz-auth-type-arrow{ color:var(--muted); flex-shrink:0; }

        /* ---- Shop profile page header ---- */
        .cz-shop-profile-head{ display:flex; align-items:center; gap:16px; padding:16px;
          background:var(--paper-light); border:1px solid var(--line); margin-bottom:6px; }

        /* ---- Avatar colour picker ---- */
        .cz-avatar-color-grid{ display:flex; flex-wrap:wrap; gap:10px; margin-bottom:14px; }
        .cz-avatar-color-swatch{ width:36px; height:36px; border-radius:50%; border:2px solid transparent;
          cursor:pointer; display:flex; align-items:center; justify-content:center; transition:border-color 0.15s, transform 0.1s; }
        .cz-avatar-color-swatch:hover{ transform:scale(1.1); }
        .cz-avatar-color-swatch-active{ border-color:var(--gold); }
        .cz-avatar-preview{ display:flex; align-items:center; gap:12px; padding:12px 14px;
          border:1px solid var(--gold); background:var(--gold-subtle); margin-top:4px; }

        /* ---- Profile picture upload ---- */
        .cz-upload-dropzone{ display:block; cursor:pointer; border:1px dashed var(--line); padding:24px 16px;
          text-align:center; transition:border-color 0.15s; }
        .cz-upload-dropzone:hover{ border-color:var(--gold); }
        .cz-upload-dropzone-inner{ display:flex; flex-direction:column; align-items:center; gap:8px; }
        .cz-upload-icon{ width:44px; height:44px; border-radius:50%; background:var(--paper-dark);
          display:flex; align-items:center; justify-content:center; color:var(--muted); margin-bottom:4px; }
        .cz-upload-label{ font-size:13px; color:var(--ink); font-weight:500; }
        .cz-upload-hint{ font-size:10px; color:var(--muted); letter-spacing:0.04em; }
        .cz-upload-preview{ display:flex; align-items:center; gap:16px; padding:14px 16px;
          border:1px solid var(--gold); background:var(--gold-subtle); }
        .cz-upload-preview-text{ display:flex; flex-direction:column; flex:1; }
        .cz-upload-change-btn{ font-size:10.5px; color:var(--gold); letter-spacing:0.06em; cursor:pointer;
          text-decoration:underline; margin-right:12px; background:none; border:none; padding:0; font-family:'IBM Plex Mono',monospace; }
        .cz-upload-remove-btn{ font-size:10.5px; color:var(--alert); letter-spacing:0.06em; cursor:pointer;
          text-decoration:underline; background:none; border:none; padding:0; font-family:'IBM Plex Mono',monospace; }
        .cz-notify-toggle-row{ display:flex; align-items:center; gap:14px; padding:14px; border:1px solid var(--line);
          background:var(--paper-light); cursor:pointer; margin-bottom:0; }
        .cz-notify-label{ font-size:13px; display:block; font-weight:500; margin-bottom:4px; }
        .cz-notify-sub{ font-size:10px; color:var(--muted); display:block; line-height:1.5; letter-spacing:0.01em; }
        .cz-toggle-switch{ width:40px; height:22px; border-radius:20px; background:var(--line); position:relative;
          flex-shrink:0; transition:background 0.2s; border:1px solid var(--line); }
        .cz-toggle-switch-on{ background:var(--gold); border-color:var(--gold); }
        .cz-toggle-knob{ position:absolute; top:2px; left:2px; width:16px; height:16px; border-radius:50%;
          background:#fff; transition:transform 0.2s; box-shadow:0 1px 3px rgba(0,0,0,0.2); }
        .cz-toggle-switch-on .cz-toggle-knob{ transform:translateX(18px); }
        .cz-notify-active-badge{ display:flex; align-items:center; font-size:10px; color:var(--verified);
          background:var(--verified-bg); padding:8px 12px; margin-top:6px; letter-spacing:0.03em; }

        /* ---- Home ---- */
        .cz-shop-finder{ width:100%; display:flex; align-items:center; padding:12px 14px; border-radius:3px;
          border:1px solid var(--line); background:transparent; color:var(--muted); font-family:'Inter',sans-serif;
          font-size:12.5px; font-weight:400; cursor:pointer; margin-bottom:24px; }

        /* ---- Shop: unclaimed bikes entry ---- */
        .cz-unclaimed-entry{ width:100%; display:flex; align-items:center; gap:12px; padding:13px 14px;
          border:1px solid var(--pending); background:var(--pending-bg); cursor:pointer; text-align:left; margin-top:4px; }
        .cz-unclaimed-entry-icon{ width:34px; height:34px; border-radius:50%; background:var(--pending); color:#fff;
          display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .cz-unclaimed-entry-text{ display:flex; flex-direction:column; gap:2px; flex:1; }
        .cz-unclaimed-entry-text span:first-child{ font-size:14px; color:var(--ink); }
        .cz-unclaimed-entry-text span:last-child{ font-size:10px; color:var(--pending); letter-spacing:0.02em; }
        .cz-unclaimed-entry-arrow{ color:var(--pending); flex-shrink:0; }


        .cz-section-title{ font-size:10px; color:var(--muted); letter-spacing:0.12em; margin:0 0 14px; font-weight:500;
          padding-bottom:8px; border-bottom:1px solid var(--line); }

        /* ---- Bike cards ---- */
        .cz-bike-card{ width:100%; display:flex; align-items:center; gap:14px; padding:14px 16px; border-radius:3px;
          background:var(--paper-light); border:1px solid var(--line); margin-bottom:8px; cursor:pointer; text-align:left;
          transition:border-color 0.15s; }
        .cz-bike-card:hover{ border-color:var(--gold); }
        .cz-bike-card-icon{ width:38px; height:38px; border-radius:50%; background:var(--steel); color:var(--gold-light);
          display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .cz-bike-card-text{ display:flex; flex-direction:column; gap:3px; flex:1; min-width:0; }
        .cz-bike-card-name{ font-size:14px; font-family:'Cormorant Garamond',serif; font-weight:600; }
        .cz-bike-card-id{ font-size:10px; color:var(--muted); letter-spacing:0.06em; }

        /* ---- Reminder badges ---- */
        .cz-reminder{ display:inline-flex; align-items:center; font-size:11px; gap:5px; }
        .cz-reminder-row{ display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:18px; flex-wrap:wrap; }
        .cz-calendar-sync-link{ display:inline-flex; align-items:center; background:none; border:none; cursor:pointer;
          color:var(--gold); font-size:10.5px; letter-spacing:0.03em; padding:0; }
        .cz-calendar-sync-link:hover{ text-decoration:underline; }
        .cz-reminder::before{ content:""; display:inline-block; width:6px; height:6px; border-radius:50%; flex-shrink:0; }
        .rb--ok{ color:var(--verified); }
        .rb--ok::before{ background:var(--verified); }
        .rb--pending{ color:var(--pending); }
        .rb--pending::before{ background:var(--pending); }
        .rb--alert{ color:var(--alert); }
        .rb--alert::before{ background:var(--alert); }
        .rb--neutral{ color:var(--muted); }
        .rb--neutral::before{ background:var(--muted); }

        /* ---- Service tag chain ---- */
        .cz-tag-chain{ display:flex; flex-direction:column; gap:0; border-left:1px solid var(--line); margin-left:8px; }
        .cz-tag{ position:relative; background:transparent; padding:14px 14px 14px 22px; border-bottom:1px solid var(--line); }
        .cz-tag:last-child{ border-bottom:none; }
        .tag--pending{ }
        .tag--self{ }
        .tag--verified{ }
        .cz-tag-hole{ position:absolute; top:16px; left:-7px; width:13px; height:13px; border-radius:50%;
          background:var(--paper); border:1px solid var(--line); display:flex; align-items:center; justify-content:center; }
        .tag--verified .cz-tag-hole{ border-color:var(--gold); background:var(--gold-subtle); }
        .cz-tag-top{ display:flex; justify-content:space-between; align-items:baseline; margin-bottom:6px; gap:10px; }
        .cz-tag-type{ font-size:14px; font-family:'Cormorant Garamond',serif; font-weight:600; }
        .cz-tag-date{ font-size:10px; color:var(--muted); flex-shrink:0; letter-spacing:0.04em; }
        .cz-tag-notes{ font-size:12.5px; color:var(--muted); line-height:1.6; margin:0 0 10px; font-weight:400; }
        .cz-tag-bottom{ display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; }
        .cz-tag-status{ font-size:10px; letter-spacing:0.06em; display:flex; align-items:center; gap:4px; }
        .tag--verified .cz-tag-status{ color:var(--verified); }
        .tag--pending .cz-tag-status{ color:var(--pending); }
        .tag--self .cz-tag-status{ color:var(--muted); }
        .cz-tag-shop{ font-size:10px; color:var(--muted); display:flex; align-items:center; gap:4px; }

        /* ---- QR / ID ---- */
        .cz-qr-wrap{ padding:10px; background:var(--paper-light); border-radius:4px; border:1px solid var(--line);
          display:inline-flex; margin-bottom:16px; }
        .cz-qr-wrap-small{ padding:5px; margin-bottom:0; flex-shrink:0; }
        .cz-bikeid-text{ font-size:14px; letter-spacing:0.1em; margin-bottom:14px; display:block; }

        /* ---- Bike detail head ---- */
        .cz-bike-detail-head{ display:flex; justify-content:space-between; align-items:flex-start; gap:12px; margin-bottom:14px; }
        .cz-bike-detail-id{ font-size:11px; display:block; margin-bottom:3px; letter-spacing:0.08em; color:var(--muted); }
        .cz-bike-detail-meta{ font-size:11.5px; color:var(--muted); font-weight:300; }

        /* ---- Detail tags ---- */
        .cz-detail-tags{ display:flex; flex-wrap:wrap; gap:6px; margin-bottom:16px; }
        .cz-detail-tag{ display:inline-flex; align-items:center; gap:5px; padding:5px 9px;
          border:1px solid var(--line); font-size:10.5px; color:var(--ink); letter-spacing:0.02em; }
        .cz-detail-tag-verified{ border-color:var(--gold); color:var(--gold); background:var(--gold-subtle); }
        .cz-detail-tag-ebike{ border-color:#1D6FA4; color:#1D6FA4; background:#E6F2F9; }
        .cz-detail-tag-pending-tx{ border-color:var(--pending); color:var(--pending); background:var(--pending-bg); }

        /* ── Shop ownership card ── */
        .cz-shop-owner-card{ display:flex; align-items:center; gap:12px; padding:14px 16px;
          background:var(--paper-light); border:1px solid var(--line); margin-bottom:6px; }
        .cz-shop-owner-avatar{ width:38px; height:38px; border-radius:50%; background:var(--steel); color:var(--gold-light);
          display:flex; align-items:center; justify-content:center; font-size:17px; flex-shrink:0; }
        .cz-shop-owner-text{ display:flex; flex-direction:column; gap:3px; flex:1; min-width:0; }
        .cz-shop-owner-name{ font-size:15px; }
        .cz-shop-owner-since{ font-size:10px; color:var(--muted); letter-spacing:0.03em; }
        .cz-section-divider{ height:1px; background:var(--line); margin:20px 0; }

        /* ---- E-bike toggle ---- */
        .cz-ebike-toggle{ display:flex; align-items:center; justify-content:space-between; gap:12px;
          padding:13px 14px; border:1px solid var(--line); background:var(--paper-light); cursor:pointer;
          transition:border-color 0.15s; margin-bottom:0; }
        .cz-ebike-toggle-on{ border-color:#1D6FA4; background:#E6F2F9; }
        .cz-ebike-toggle-left{ display:flex; align-items:center; gap:12px; flex:1; }
        .cz-ebike-icon{ width:32px; height:32px; border-radius:50%; background:var(--line); color:var(--muted);
          display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:background 0.2s; }
        .cz-ebike-icon-on{ background:#1D6FA4; color:#fff; }
        .cz-ebike-badge{ position:absolute; bottom:-3px; right:-3px; width:14px; height:14px; border-radius:50%;
          background:#1D6FA4; color:#fff; display:flex; align-items:center; justify-content:center;
          border:1.5px solid var(--paper); }

        /* ---- Strava ---- */
        .cz-strava-card{ background:var(--paper-light); border:1px solid var(--line); padding:14px 16px; margin-bottom:20px; }
        .cz-strava-head{ display:flex; align-items:center; gap:7px; margin-bottom:12px; color:#E8490A; }
        .cz-strava-head span.font-display{ font-size:13px; flex:1; color:var(--ink); font-weight:500; font-family:'Inter',sans-serif; letter-spacing:0.01em; }
        .cz-strava-unlink{ background:none; border:none; padding:0; font-size:10px; color:var(--muted); cursor:pointer; letter-spacing:0.04em; text-transform:uppercase; }
        .cz-gear-option{ width:100%; text-align:left; padding:11px 13px; border:1px solid var(--line);
          background:var(--paper-light); font-family:'Inter',sans-serif; font-size:13px; color:var(--ink);
          cursor:pointer; margin-bottom:6px; transition:border-color 0.15s; }
        .cz-gear-option:hover{ border-color:var(--gold); }
        .cz-gear-option:last-child{ margin-bottom:0; }
        .cz-strava-stats{ display:flex; gap:28px; margin-bottom:14px; border-bottom:1px solid var(--line); padding-bottom:14px; }
        .cz-strava-stat-num{ font-size:22px; display:block; font-family:'Cormorant Garamond',serif; font-weight:600; }
        .cz-strava-stat-label{ font-size:9px; color:var(--muted); letter-spacing:0.1em; text-transform:uppercase; }
        .cz-ride-list{ display:flex; flex-direction:column; }
        .cz-ride-item{ display:flex; justify-content:space-between; align-items:baseline; padding:8px 0; border-top:1px solid var(--line); gap:10px; }
        .cz-ride-list .cz-ride-item:first-child{ border-top:none; padding-top:0; }
        .cz-ride-name{ font-size:12.5px; display:block; font-weight:400; }
        .cz-ride-date{ font-size:10px; color:var(--muted); }
        .cz-ride-distance{ font-size:11.5px; color:var(--ink); flex-shrink:0; font-family:'IBM Plex Mono',monospace; }

        /* ---- Tabs ---- */
        .cz-tabs{ display:flex; gap:0; margin-bottom:20px; border-bottom:1px solid var(--line); }
        .cz-tab{ flex:1; padding:10px 8px; display:flex; align-items:center; justify-content:center; border:none;
          background:transparent; font-family:'Inter',sans-serif; font-size:12.5px; font-weight:500;
          color:var(--muted); cursor:pointer; border-bottom:2px solid transparent; margin-bottom:-1px; }
        .cz-tab-active{ color:var(--ink); border-bottom-color:var(--gold); }
        .cz-tab-alert{ display:inline-flex; align-items:center; justify-content:center; width:15px; height:15px;
          border-radius:50%; background:var(--alert); color:#fff; font-size:8.5px; margin-left:6px; font-weight:600; }

        /* ---- Component cards ---- */
        .cz-comp-list{ display:flex; flex-direction:column; gap:8px; }
        .cz-comp-card{ background:var(--paper-light); border:1px solid var(--line); padding:14px 16px; position:relative; }
        .comp--pending{ border-left:2px solid var(--pending); }
        .comp--alert{ border-left:2px solid var(--alert); }
        .cz-comp-top{ display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; }
        .cz-comp-type{ font-size:14px; display:block; font-family:'Cormorant Garamond',serif; font-weight:600; }
        .cz-comp-brand{ font-size:10px; color:var(--muted); display:block; margin-top:2px; letter-spacing:0.03em; }
        .cz-comp-pct{ font-size:17px; font-family:'Cormorant Garamond',serif; font-weight:600; }
        .cz-wear-track{ height:3px; background:var(--line); overflow:hidden; margin-bottom:10px; }
        .cz-wear-fill{ height:100%; transition:width 0.3s; }
        .cz-comp-footer{ display:flex; justify-content:space-between; }
        .cz-comp-meta{ font-size:10px; color:var(--muted); letter-spacing:0.03em; }
        .cz-comp-alert{ display:flex; align-items:center; font-size:10.5px; margin-top:10px; padding:6px 10px;
          letter-spacing:0.01em; }
        .comp-alert--pending{ background:var(--pending-bg); color:var(--pending); }
        .comp-alert--alert{ background:var(--alert-bg); color:var(--alert); }

        /* ---- Bike card badge ---- */
        .cz-bike-card-icon{ position:relative; }
        .cz-bike-card-badge{ position:absolute; top:-3px; right:-3px; width:15px; height:15px; border-radius:50%;
          background:var(--alert); color:#fff; font-size:8px; font-family:'IBM Plex Mono',monospace;
          display:flex; align-items:center; justify-content:center; font-weight:700; border:1.5px solid var(--paper); }

        /* ---- Dual footer ---- */
        .cz-footer-row{ display:flex; gap:8px; }
        .cz-btn-half{ flex:1; }

        /* ---- Sticky footer ---- */
        .cz-sticky-footer{ padding:12px 20px calc(20px + env(safe-area-inset-bottom)); background:linear-gradient(to top, var(--paper) 60%, transparent); }

        /* ---- Chips ---- */
        .cz-chip-row{ display:flex; flex-wrap:wrap; gap:6px; margin-bottom:6px; }
        .cz-chip{ padding:7px 12px; border-radius:2px; border:1px solid var(--line); background:transparent;
          color:var(--muted); font-size:12px; font-family:'Inter',sans-serif; cursor:pointer; }
        .cz-chip-active{ background:var(--steel); border-color:var(--steel); color:var(--paper); }
        .cz-chip-static{ cursor:default; color:var(--ink); background:var(--paper-dark); }

        /* ---- Toggles ---- */
        .cz-toggle-row{ display:flex; gap:6px; margin-bottom:6px; }
        .cz-toggle{ flex:1; padding:11px; border-radius:2px; border:1px solid var(--line); background:transparent;
          color:var(--muted); font-size:13px; font-weight:500; font-family:'Inter',sans-serif; cursor:pointer; }
        .cz-toggle-active{ background:var(--steel); border-color:var(--steel); color:var(--paper); }

        /* ---- Shop lists ---- */
        .cz-shop-list-item{ width:100%; display:flex; align-items:center; gap:14px; padding:14px; border-radius:2px;
          background:var(--paper-light); border:1px solid var(--line); margin-bottom:8px; cursor:pointer; text-align:left;
          transition:border-color 0.15s; }
        .cz-shop-list-item:hover{ border-color:var(--gold); }
        .cz-shop-list-icon{ width:36px; height:36px; border-radius:50%; background:var(--steel); color:var(--gold-light);
          display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .cz-shop-list-text{ display:flex; flex-direction:column; gap:3px; flex:1; min-width:0; }
        .cz-shop-list-name{ font-size:13.5px; font-weight:500; }
        .cz-shop-list-area{ font-size:10.5px; color:var(--muted); display:flex; align-items:center; }
        .cz-shop-list-address{ font-size:9.5px; color:var(--muted); opacity:0.7; display:block; margin-top:1px; }
        .cz-shop-list-rating{ font-size:12px; display:flex; align-items:center; color:var(--gold); flex-shrink:0; font-family:'IBM Plex Mono',monospace; }

        .cz-profile-rating{ font-size:13px; color:var(--gold); display:flex; align-items:center; margin-bottom:6px; }
        .cz-profile-area{ font-size:12.5px; color:var(--muted); display:flex; align-items:center; margin:0 0 20px; }
        .cz-profile-address{ font-size:11px; color:var(--muted); opacity:0.75; letter-spacing:0.02em; }

        /* ---- Shop lookup ---- */
        .cz-lookup-row{ display:flex; gap:8px; margin-bottom:6px; }
        .cz-lookup-row .cz-input{ flex:1; }
        .cz-error{ font-size:12px; color:var(--alert); margin:8px 0 0; }

        /* ---- Terms & Conditions checkbox (signup screens) ---- */
        .cz-terms-checkbox-row{ display:flex; align-items:flex-start; gap:10px; width:100%;
          background:none; border:none; padding:0; cursor:pointer; text-align:left; }
        .cz-terms-checkbox-text{ font-size:12.5px; color:var(--ink); line-height:1.5; padding-top:1px; }
        .cz-terms-link{ color:var(--gold); text-decoration:underline; cursor:pointer; }
        .cz-terms-link:hover{ color:var(--gold-light); }

        /* ---- Terms & Conditions page ---- */
        .cz-terms-header{ display:flex; flex-direction:column; align-items:center; text-align:center;
          padding-bottom:16px; border-bottom:1px solid var(--line); margin-bottom:20px; }
        .cz-terms-updated{ font-size:10px; color:var(--muted); letter-spacing:0.05em; }
        .cz-terms-section{ margin-bottom:18px; }
        .cz-terms-heading{ font-size:14px; font-weight:600; color:var(--ink); margin:0 0 6px; }
        .cz-terms-body{ font-size:12.5px; color:var(--muted); line-height:1.65; font-weight:300; margin:0; }

        /* ---- Queue items ---- */
        .cz-queue-item{ background:var(--paper-light); border:1px solid var(--line); border-left:2px solid var(--pending); padding:14px 16px; margin-bottom:8px; }
        .cz-queue-item-text{ display:flex; flex-direction:column; margin-bottom:10px; }
        .cz-queue-item-type{ font-size:14px; font-family:'Cormorant Garamond',serif; font-weight:600; }
        .cz-queue-item-meta{ font-size:10px; color:var(--muted); margin:3px 0 6px; letter-spacing:0.04em; }
        .cz-queue-item-notes{ font-size:12.5px; color:var(--muted); margin:0; line-height:1.6; }

        /* ---- Empty states ---- */
        .cz-empty{ display:flex; flex-direction:column; align-items:center; text-align:center; padding:36px 10px; color:var(--muted); }
        .cz-empty h3{ font-size:16px; color:var(--ink); margin:12px 0 6px; font-family:'Cormorant Garamond',serif; font-style:italic; }
        .cz-empty p{ font-size:12.5px; line-height:1.6; margin:0; max-width:240px; font-weight:300; }

        /* ---- Notifications ---- */
        .cz-menu-notif-badge{ display:inline-flex; align-items:center; justify-content:center; min-width:18px; height:18px;
          border-radius:20px; background:var(--alert); color:#fff; font-size:9px; padding:0 5px; margin-left:auto; margin-right:8px; font-weight:700; }
        .cz-notif-panel{ flex:1; overflow-y:auto; display:flex; flex-direction:column; }

        /* ---- Alerts / Messages sub-tabs ---- */
        .cz-notif-tabs{ display:flex; border-bottom:1px solid var(--line); flex-shrink:0; }
        .cz-notif-tab{ flex:1; padding:12px 8px; background:transparent; border:none; cursor:pointer;
          font-family:'Inter',sans-serif; font-size:12px; font-weight:500; color:var(--muted);
          display:flex; align-items:center; justify-content:center; gap:6px; border-bottom:2px solid transparent; margin-bottom:-1px; }
        .cz-notif-tab-active{ color:var(--ink); border-bottom-color:var(--gold); }
        .cz-notif-tab-dot{ width:6px; height:6px; border-radius:50%; background:var(--alert); }

        /* ---- Thread list (Messages tab) ---- */
        .cz-thread-list{ display:flex; flex-direction:column; }
        .cz-thread-row{ width:100%; display:flex; align-items:center; gap:12px; padding:13px 18px;
          background:transparent; border:none; border-bottom:1px solid var(--line); cursor:pointer; text-align:left; }
        .cz-thread-row-unread{ background:var(--paper-dark); }
        .cz-thread-row-text{ display:flex; flex-direction:column; gap:2px; flex:1; min-width:0; }
        .cz-thread-row-top{ display:flex; justify-content:space-between; align-items:baseline; gap:8px; }
        .cz-thread-row-name{ font-size:14px; }
        .cz-thread-row-date{ font-size:9.5px; color:var(--muted); flex-shrink:0; }
        .cz-thread-row-preview{ font-size:12px; color:var(--muted); font-weight:300; white-space:nowrap;
          overflow:hidden; text-overflow:ellipsis; }
        .cz-thread-row-comp{ font-size:9.5px; color:var(--gold); letter-spacing:0.03em; }

        /* ---- Thread detail (chat view) ---- */
        .cz-thread-detail{ flex:1; display:flex; flex-direction:column; overflow:hidden; }
        .cz-thread-messages{ flex:1; overflow-y:auto; padding:16px 16px 8px; display:flex; flex-direction:column; gap:10px; }
        .cz-bubble-row{ display:flex; justify-content:flex-start; }
        .cz-bubble-row-me{ justify-content:flex-end; }
        .cz-bubble{ max-width:82%; padding:10px 13px; display:flex; flex-direction:column; gap:6px; }
        .cz-bubble-them{ background:var(--paper-light); border:1px solid var(--line); border-bottom-left-radius:2px; }
        .cz-bubble-me{ background:var(--steel); border-bottom-right-radius:2px; }
        .cz-bubble-me .cz-bubble-text{ color:var(--paper); }
        .cz-bubble-me .cz-bubble-time{ color:var(--gold-light); opacity:0.7; }
        .cz-bubble-text{ font-size:13px; line-height:1.5; color:var(--ink); }
        .cz-bubble-time{ font-size:9px; color:var(--muted); letter-spacing:0.04em; align-self:flex-end; }
        .cz-bubble-comp-card{ display:flex; flex-direction:column; gap:2px; padding:8px 10px;
          background:var(--paper); border:1px solid var(--line); }
        .cz-bubble-me .cz-bubble-comp-card{ background:rgba(255,255,255,0.06); border-color:rgba(255,255,255,0.15); }
        .cz-bubble-me .cz-bubble-comp-card .cz-notif-comp-type,
        .cz-bubble-me .cz-bubble-comp-card .cz-notif-comp-meta{ color:var(--paper); }

        /* ---- Thread message input bar ---- */
        .cz-thread-input-row{ display:flex; align-items:flex-end; gap:8px; padding:10px 16px 16px;
          border-top:1px solid var(--line); flex-shrink:0; }
        .cz-thread-input{ flex:1; margin:0; }
        .cz-thread-send-btn{ width:38px; height:38px; border-radius:50%; background:var(--steel); color:var(--gold-light);
          border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .cz-thread-send-btn:disabled{ opacity:0.35; cursor:not-allowed; }
        .cz-notif-list{ display:flex; flex-direction:column; }
        .cz-notif-item{ display:flex; align-items:flex-start; gap:12px; padding:14px 18px; border-bottom:1px solid var(--line); position:relative; }
        .cz-notif-unread{ background:var(--paper-dark); }
        .cz-notif-icon{ width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px; }
        .cz-notif-text{ display:flex; flex-direction:column; gap:4px; flex:1; min-width:0; padding-right:14px; }
        .cz-notif-title{ font-size:13px; }
        .cz-notif-body{ font-size:11.5px; color:var(--muted); line-height:1.5; font-weight:300; }
        .cz-notif-date{ font-size:9.5px; color:var(--muted); letter-spacing:0.04em; margin-top:2px; }
        .cz-notif-reply{ font-size:9.5px; color:var(--gold); letter-spacing:0.04em; margin-top:1px; }

        /* ---- Notification component context card ---- */
        .cz-notif-comp-card{ display:flex; flex-direction:column; gap:2px; padding:9px 11px;
          border:1px solid var(--line); background:var(--paper-light); margin:8px 0 4px; }
        .cz-notif-comp-top{ display:flex; align-items:baseline; justify-content:space-between; gap:8px; }
        .cz-notif-comp-type{ font-size:13px; }
        .cz-notif-comp-pct{ font-size:10.5px; font-weight:600; letter-spacing:0.02em; }
        .cz-notif-comp-meta{ font-size:9.5px; color:var(--muted); letter-spacing:0.02em; }

        .cz-notif-dot{ position:absolute; top:18px; right:14px; width:7px; height:7px; border-radius:50%; background:var(--alert); flex-shrink:0; }

        /* ---- Component message button ---- */
        .cz-comp-message-btn{ width:100%; display:flex; align-items:center; justify-content:center; margin-top:10px;
          padding:8px 12px; background:transparent; border:1px solid var(--line); color:var(--muted);
          font-size:11px; cursor:pointer; letter-spacing:0.04em; transition:border-color 0.15s, color 0.15s; }
        .cz-comp-message-btn:hover{ border-color:var(--gold); color:var(--gold); }

        .cz-sync-ride-btn{ width:100%; display:flex; align-items:center; justify-content:center; margin-top:12px;
          padding:9px 12px; background:transparent; border:1px dashed #FC4C02; color:#FC4C02;
          font-size:11px; cursor:pointer; letter-spacing:0.03em; transition:background 0.15s; }
        .cz-sync-ride-btn:hover{ background:#FFF3EE; }

        /* ---- Contact shop screen ---- */
        .cz-cs-recipient{ display:flex; align-items:center; gap:12px; padding:12px 14px; border:1px solid var(--gold); background:var(--gold-subtle); margin-bottom:4px; }
        .cz-cs-context{ display:flex; align-items:center; justify-content:space-between; gap:10px; padding:12px 14px; border:1px solid var(--line); background:var(--paper-light); margin-bottom:4px; }

        /* ---- Toast ---- */
        .cz-toast{ position:absolute; bottom:36px; left:50%; transform:translateX(-50%); background:var(--ink);
          color:var(--paper); padding:9px 18px; border-radius:2px; font-size:12px; font-family:'Inter',sans-serif;
          box-shadow:0 8px 32px rgba(0,0,0,0.3); z-index:10; white-space:nowrap; letter-spacing:0.04em; }

        /* ---- Slide-out menu drawer ---- */
        .cz-menu-overlay{ position:absolute; inset:0; background:rgba(7,6,15,0.55); z-index:20; }
        .cz-menu-drawer{ position:absolute; top:0; right:0; bottom:0; width:82%; max-width:300px;
          background:var(--paper); z-index:21; display:flex; flex-direction:column;
          box-shadow:-8px 0 32px rgba(0,0,0,0.18); animation:drawerIn 0.22s cubic-bezier(.4,0,.2,1); }
        @keyframes drawerIn{ from{ transform:translateX(100%); } to{ transform:translateX(0); } }
        .cz-menu-header{ display:flex; align-items:center; padding:18px 14px 14px; gap:8px;
          border-bottom:1px solid var(--line); }
        .cz-menu-title{ flex:1; font-size:15px; text-align:center; font-style:italic; }
        .cz-menu-body{ flex:1; overflow-y:auto; padding:20px 18px 28px; display:flex; flex-direction:column; }
        .cz-menu-identity{ display:flex; align-items:center; gap:14px; margin-bottom:20px; }
        .cz-menu-avatar{ width:40px; height:40px; border-radius:50%; background:var(--steel); color:var(--gold-light);
          display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
        .cz-menu-avatar-lg{ width:56px; height:56px; font-size:24px; }
        .cz-menu-name{ font-size:15px; display:block; line-height:1.2; }
        .cz-menu-subtitle{ font-size:10px; color:var(--muted); letter-spacing:0.06em; display:block; margin-top:3px; }
        .cz-menu-divider{ height:1px; background:var(--line); margin:8px 0; }
        .cz-menu-item{ width:100%; display:flex; align-items:center; gap:12px; padding:13px 4px;
          background:transparent; border:none; cursor:pointer; text-align:left; color:var(--ink);
          font-size:14px; border-bottom:1px solid var(--line); }
        .cz-menu-item:last-child{ border-bottom:none; }
        .cz-menu-item-icon{ color:var(--muted); flex-shrink:0; }
        .cz-menu-item-arrow{ color:var(--muted); margin-left:auto; }
        .cz-menu-item-danger{ color:var(--alert); margin-top:4px; }
        .cz-menu-item-danger span{ font-weight:500; }
        .cz-menu-profile-card{ display:flex; flex-direction:column; align-items:center; gap:8px; padding:20px 0 16px;
          border-bottom:1px solid var(--line); margin-bottom:20px; }
        .cz-menu-stat-row{ display:flex; gap:0; border:1px solid var(--line); }
        .cz-menu-stat{ flex:1; display:flex; flex-direction:column; align-items:center; padding:14px 8px;
          border-right:1px solid var(--line); }
        .cz-menu-stat:last-child{ border-right:none; }
        .cz-menu-stat-num{ font-size:22px; display:block; }
        .cz-menu-stat-label{ font-size:9px; color:var(--muted); letter-spacing:0.08em; margin-top:2px; }
        .cz-menu-sent{ display:flex; flex-direction:column; align-items:center; justify-content:center;
          flex:1; text-align:center; gap:4px; padding:20px 0; }

        /* ---- Suggestion box (public upvote list) ---- */
        .cz-suggestion-list{ display:flex; flex-direction:column; gap:8px; }
        .cz-suggestion-row{ display:flex; align-items:flex-start; gap:12px; padding:12px 14px;
          border:1px solid var(--line); background:var(--paper-light); }
        .cz-upvote-btn{ display:flex; flex-direction:column; align-items:center; gap:1px; padding:6px 10px;
          border:1px solid var(--line); background:var(--paper); color:var(--muted); cursor:pointer; flex-shrink:0;
          transition:border-color 0.15s, color 0.15s, background 0.15s; }
        .cz-upvote-btn span{ font-size:12px; font-weight:600; }
        .cz-upvote-btn:hover{ border-color:var(--gold); color:var(--gold); }
        .cz-upvote-btn-active{ border-color:var(--gold); background:var(--gold-subtle); color:var(--gold); }
        .cz-suggestion-text{ display:flex; flex-direction:column; gap:4px; flex:1; padding-top:2px; }
        .cz-suggestion-body{ font-size:13px; line-height:1.45; color:var(--ink); }
        .cz-suggestion-meta{ font-size:9.5px; color:var(--muted); letter-spacing:0.03em; }

        /* ---- Transfer / Ownership ---- */
        .cz-txcode-display{ font-size:22px; letter-spacing:0.18em; padding:16px 20px; border:1px solid var(--gold);
          background:var(--gold-subtle); color:var(--ink); text-align:center; width:100%; margin:10px 0; }
        .cz-transfer-pending{ background:var(--pending-bg); border:1px solid var(--pending); padding:14px 16px; margin-bottom:20px; }
        .cz-transfer-pending-head{ display:flex; align-items:center; font-size:11px; color:var(--pending); letter-spacing:0.06em; margin-bottom:4px; }
        .cz-ownership-chain{ display:flex; flex-direction:column; border-left:1px solid var(--line); margin-left:8px; gap:0; }
        .cz-owner-entry{ display:flex; align-items:flex-start; gap:14px; padding:12px 0 12px 18px; position:relative; border-bottom:1px solid var(--line); }
        .cz-owner-entry:last-child{ border-bottom:none; }
        .cz-owner-dot{ position:absolute; left:-5px; top:16px; width:9px; height:9px; border-radius:50%;
          background:var(--line); border:1px solid var(--paper); flex-shrink:0; }
        .cz-owner-current .cz-owner-dot{ background:var(--gold); border-color:var(--paper); }
        .cz-owner-text{ display:flex; flex-direction:column; gap:3px; }
        .cz-owner-name{ font-size:14px; }
        .cz-owner-current .cz-owner-name{ color:var(--ink); }
        .cz-owner-meta{ font-size:10px; color:var(--muted); letter-spacing:0.04em; }
        .cz-claim-preview{ background:var(--paper-light); border:1px solid var(--line); padding:16px; }
        .cz-claim-preview-head{ display:flex; align-items:center; gap:14px; }
        .cz-transfer-checklist{ display:flex; flex-direction:column; gap:10px; }
        .cz-transfer-check{ display:flex; align-items:center; font-size:13px; padding:10px 14px; background:var(--paper-light); border:1px solid var(--line); }

        /* ---- Simulated push notification banner ---- */
        .cz-push-banner{ position:absolute; top:14px; left:10px; right:10px; z-index:50;
          background:rgba(20,17,10,0.92); backdrop-filter:blur(10px); border-radius:16px;
          border:1px solid rgba(201,160,78,0.35); padding:10px 12px; display:flex; gap:10px;
          box-shadow:0 12px 28px rgba(0,0,0,0.4); cursor:pointer;
          animation:pushSlideIn 0.35s cubic-bezier(.2,.9,.3,1.3); }
        @keyframes pushSlideIn{ from{ transform:translateY(-60px); opacity:0; } to{ transform:translateY(0); opacity:1; } }
        .cz-push-icon{ width:28px; height:28px; border-radius:8px; background:var(--gold); color:#0C0B10;
          display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px; }
        .cz-push-text{ display:flex; flex-direction:column; gap:1px; flex:1; min-width:0; }
        .cz-push-top{ display:flex; justify-content:space-between; align-items:center; }
        .cz-push-app{ font-size:9px; color:var(--gold-light); letter-spacing:0.1em; }
        .cz-push-now{ font-size:9px; color:rgba(255,255,255,0.5); letter-spacing:0.04em; }
        .cz-push-title{ font-size:13px; color:#fff; font-weight:600; line-height:1.3; }
        .cz-push-body{ font-size:11.5px; color:rgba(255,255,255,0.75); line-height:1.4; font-weight:300;
          display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }

        /* ---- Export report (PDF preview / print) ---- */
        .cz-export-report{ padding:24px 20px 40px; background:var(--paper); }
        .cz-export-header{ text-align:center; padding-bottom:16px; border-bottom:2px solid var(--gold); margin-bottom:20px; }
        .cz-export-generated{ font-size:10px; color:var(--muted); letter-spacing:0.05em; }
        .cz-export-bike-card{ display:flex; flex-direction:column; gap:6px; padding:14px 16px; border:1px solid var(--line);
          background:var(--paper-light); margin-bottom:24px; }
        .cz-export-bike-name{ font-size:19px; }
        .cz-export-bike-meta-row{ display:flex; flex-wrap:wrap; gap:14px; font-size:10.5px; color:var(--muted); letter-spacing:0.03em; }
        .cz-export-section-title{ font-size:11px; color:var(--gold); letter-spacing:0.1em; margin:24px 0 10px;
          padding-bottom:6px; border-bottom:1px solid var(--line); }
        .cz-export-table{ width:100%; border-collapse:collapse; font-size:11px; }
        .cz-export-table th{ text-align:left; font-size:9px; color:var(--muted); letter-spacing:0.06em;
          padding:6px 8px; border-bottom:1px solid var(--ink); }
        .cz-export-table td{ padding:8px; border-bottom:1px solid var(--line); vertical-align:top; color:var(--ink); }
        .cz-export-table tfoot td{ border-bottom:none; border-top:2px solid var(--ink); padding-top:10px; font-weight:600; }
        .cz-export-grand-total{ display:flex; justify-content:space-between; align-items:baseline; margin-top:28px;
          padding:14px 16px; background:var(--steel); }
        .cz-export-grand-total span:first-child{ color:var(--paper); font-size:15px; font-style:italic; }
        .cz-export-grand-total-amount{ color:var(--gold-light); font-size:18px; font-weight:600; }
        .cz-export-footer{ margin-top:24px; font-size:9px; color:var(--muted); text-align:center; line-height:1.6; letter-spacing:0.02em; }

        /* ---- Print / Save as PDF ---- */
        @media print {
          body{ background:#fff !important; }
          .cz-backdrop{ background:#fff !important; padding:0 !important; min-height:0 !important; }
          .cz-caption, .cz-home-indicator, .cz-topbar, .cz-toast, .cz-push-banner,
          .cz-menu-overlay, .cz-menu-drawer, .cz-no-print{ display:none !important; }
          .cz-phone{ width:100% !important; height:auto !important; border:none !important;
            border-radius:0 !important; box-shadow:none !important; background:#fff !important; }
          .cz-phone::before{ display:none !important; }
          .cz-screen{ overflow:visible !important; height:auto !important; }
          .cz-export-report{ padding:0 !important; }
          .cz-export-table{ page-break-inside:auto; }
          .cz-export-table tr{ page-break-inside:avoid; }
        }

      `}</style>

      <div className={isStandalone ? "cz-standalone-root" : "cz-backdrop"}>
        <div className={isStandalone ? "cz-standalone-phone" : "cz-phone"}>
          {pushNotif && (
            <div key={pushNotif.id} className="cz-push-banner" onClick={() => setPushNotif(null)}>
              <div className="cz-push-icon">
                <Bike size={15} />
              </div>
              <div className="cz-push-text">
                <div className="cz-push-top">
                  <span className="font-mono cz-push-app">CADENZO</span>
                  <span className="font-mono cz-push-now">now</span>
                </div>
                <span className="font-display cz-push-title">{pushNotif.title}</span>
                <span className="font-body cz-push-body">{pushNotif.body}</span>
              </div>
            </div>
          )}
          <div className="cz-screen">
            {renderScreen()}
            {toast && <div className="cz-toast">{toast}</div>}
            {customerName && renderMenu(false)}
            {activeShop && renderMenu(true)}
          </div>
          {!isStandalone && <div className="cz-home-indicator" />}
        </div>
        {!isStandalone && (
          <p className="cz-caption">
            PROTOTYPE — tap "I'm a rider" or "I'm a bike shop" above to explore both sides of the flow.
          </p>
        )}
      </div>
    </div>
  );
}
