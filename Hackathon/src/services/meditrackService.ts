import {
  PinLocation,
  Pharmacy,
  StockItem,
  SearchResultItem,
  SearchResponse,
  NearbyPharmaciesResponse,
  OrderDetails,
  EmergencyRecord,
  EmergencyResponse,
  DashboardResponse,
  DeliveryStatus
} from '../types/meditrack';

const DISCLAIMER =
  "Estimated delivery times are not guaranteed. Weather, traffic and stock changes can cause delays. " +
  "Never change a prescribed medicine without approval from a qualified healthcare professional.";

export const KNOWN_PINS: PinLocation[] = [
  { pin: "560001", lat: 12.9784, lng: 77.5996, area: "Bangalore G.P.O / MG Road" },
  { pin: "560034", lat: 12.9345, lng: 77.6265, area: "Koramangala 4th Block" },
  { pin: "560038", lat: 12.9784, lng: 77.6408, area: "Indiranagar 100ft Road" },
  { pin: "560066", lat: 12.9698, lng: 77.7499, area: "Whitefield / ITPL" },
  { pin: "560076", lat: 12.9166, lng: 77.6101, area: "BTM Layout 2nd Stage" },
  { pin: "560078", lat: 12.9063, lng: 77.5857, area: "JP Nagar 6th Phase" },
  { pin: "560100", lat: 12.8452, lng: 77.6602, area: "Electronic City Phase 1" }
];

const INITIAL_PHARMACIES: Pharmacy[] = [
  {
    id: 1,
    name: "Apollo Pharmacy - Indiranagar",
    address: "12, 100ft Road, HAL 2nd Stage, Indiranagar, Bengaluru",
    phone: "9845012345",
    lat: 12.9784,
    lng: 77.6408,
    radius_km: 12,
    delivery_on: 1,
    password: "demo1"
  },
  {
    id: 2,
    name: "MedPlus Chemist - Koramangala",
    address: "432, 80ft Road, 4th Block, Koramangala, Bengaluru",
    phone: "9845023456",
    lat: 12.9345,
    lng: 77.6265,
    radius_km: 10,
    delivery_on: 1,
    password: "demo2"
  },
  {
    id: 3,
    name: "Aster Pharmacy - BTM Ring Road",
    address: "88, Outer Ring Road, BTM Layout 2nd Stage, Bengaluru",
    phone: "9845034567",
    lat: 12.9166,
    lng: 77.6101,
    radius_km: 15,
    delivery_on: 1,
    password: "demo3"
  },
  {
    id: 4,
    name: "Trust Chemist & Druggist - JP Nagar",
    address: "24, 24th Main Road, JP Nagar 6th Phase, Bengaluru",
    phone: "9845045678",
    lat: 12.9063,
    lng: 77.5857,
    radius_km: 15,
    delivery_on: 1,
    password: "demo4"
  },
  {
    id: 5,
    name: "Manipal Health Express - Whitefield",
    address: "Plot 18, ITPL Main Road, Whitefield, Bengaluru",
    phone: "9845056789",
    lat: 12.9698,
    lng: 77.7499,
    radius_km: 15,
    delivery_on: 1,
    password: "demo5"
  },
  {
    id: 6,
    name: "Frank Ross Pharmacy - MG Road",
    address: "45, Mahatma Gandhi Road, Bangalore Central, Bengaluru",
    phone: "9845067890",
    lat: 12.9750,
    lng: 77.6050,
    radius_km: 6,
    delivery_on: 0, // In-store pick up only (delivery off to showcase status)
    password: "demo6"
  },
  {
    id: 7,
    name: "Narayana Hrudayalaya Meds - Electronic City",
    address: "258/A, Hosur Road, Electronic City Phase 1, Bengaluru",
    phone: "9845078901",
    lat: 12.8452,
    lng: 77.6602,
    radius_km: 12,
    delivery_on: 1,
    password: "demo7"
  }
];

const INITIAL_STOCK: StockItem[] = [
  // Pharmacy 1 (Apollo Indiranagar) - Out of stock for Paracetamol 650mg to trigger recommendation engine!
  { pharmacy_id: 1, medicine: "Paracetamol 650mg", qty: 0, price: 32.50 },
  { pharmacy_id: 1, medicine: "Amoxicillin 500mg", qty: 24, price: 95.00 },
  { pharmacy_id: 1, medicine: "Azithromycin 500mg", qty: 15, price: 120.00 },
  { pharmacy_id: 1, medicine: "Insulin Glargine 100IU", qty: 4, price: 680.00 },
  { pharmacy_id: 1, medicine: "Inhaler Salbutamol 100mcg", qty: 8, price: 165.00 },
  { pharmacy_id: 1, medicine: "Metformin 500mg", qty: 50, price: 42.00 },
  { pharmacy_id: 1, medicine: "Pantoprazole 40mg", qty: 35, price: 88.00 },

  // Pharmacy 2 (MedPlus Koramangala) - Has stock!
  { pharmacy_id: 2, medicine: "Paracetamol 650mg", qty: 65, price: 30.00 },
  { pharmacy_id: 2, medicine: "Amoxicillin 500mg", qty: 18, price: 92.50 },
  { pharmacy_id: 2, medicine: "Cetirizine 10mg", qty: 40, price: 38.00 },
  { pharmacy_id: 2, medicine: "Insulin Glargine 100IU", qty: 7, price: 675.00 },
  { pharmacy_id: 2, medicine: "Atorvastatin 20mg", qty: 28, price: 110.00 },
  { pharmacy_id: 2, medicine: "Oral Rehydration Salts (ORS)", qty: 90, price: 21.00 },

  // Pharmacy 3 (Aster BTM)
  { pharmacy_id: 3, medicine: "Paracetamol 650mg", qty: 42, price: 31.00 },
  { pharmacy_id: 3, medicine: "Azithromycin 500mg", qty: 6, price: 118.00 },
  { pharmacy_id: 3, medicine: "Inhaler Salbutamol 100mcg", qty: 12, price: 160.00 },
  { pharmacy_id: 3, medicine: "Blood Pressure Telmisartan 40mg", qty: 30, price: 85.00 },
  { pharmacy_id: 3, medicine: "Montelukast 10mg", qty: 22, price: 145.00 },

  // Pharmacy 4 (Trust Chemist JP Nagar)
  { pharmacy_id: 4, medicine: "Paracetamol 650mg", qty: 80, price: 29.50 },
  { pharmacy_id: 4, medicine: "Metformin 500mg", qty: 65, price: 40.00 },
  { pharmacy_id: 4, medicine: "Cetirizine 10mg", qty: 55, price: 35.00 },
  { pharmacy_id: 4, medicine: "Nitrocontin 2.6mg", qty: 14, price: 190.00 },
  { pharmacy_id: 4, medicine: "Amoxicillin 500mg", qty: 30, price: 90.00 },

  // Pharmacy 5 (Manipal Whitefield)
  { pharmacy_id: 5, medicine: "Paracetamol 650mg", qty: 110, price: 32.00 },
  { pharmacy_id: 5, medicine: "Epinephrine Auto-Injector", qty: 3, price: 3450.00 },
  { pharmacy_id: 5, medicine: "Insulin Glargine 100IU", qty: 10, price: 690.00 },
  { pharmacy_id: 5, medicine: "Inhaler Salbutamol 100mcg", qty: 19, price: 168.00 },

  // Pharmacy 6 (Frank Ross MG Road) - delivery_on is 0
  { pharmacy_id: 6, medicine: "Paracetamol 650mg", qty: 50, price: 30.00 },
  { pharmacy_id: 6, medicine: "Azithromycin 500mg", qty: 25, price: 125.00 },

  // Pharmacy 7 (Narayana Electronic City)
  { pharmacy_id: 7, medicine: "Paracetamol 650mg", qty: 45, price: 31.50 },
  { pharmacy_id: 7, medicine: "Metformin 500mg", qty: 40, price: 43.00 },
  { pharmacy_id: 7, medicine: "Blood Pressure Telmisartan 40mg", qty: 35, price: 82.00 }
];

const INITIAL_ORDERS: OrderDetails[] = [
  {
    id: "MT-1001",
    medicine: "Paracetamol 650mg & Cetirizine 10mg",
    pharmacy_id: 2,
    pharmacy: "MedPlus Chemist - Koramangala",
    status: "Out for Delivery",
    eta_minutes: 18,
    eta: null,
    demo: true,
    disclaimer: "Sample order for demonstration. Arrival time is an estimate, not a guarantee."
  },
  {
    id: "MT-1002",
    medicine: "Insulin Glargine 100IU (Cold-Chain)",
    pharmacy_id: 1,
    pharmacy: "Apollo Pharmacy - Indiranagar",
    status: "Preparing Dispatch",
    eta_minutes: 27,
    eta: null,
    demo: true,
    disclaimer: "Sample order for demonstration. Arrival time is an estimate, not a guarantee."
  },
  {
    id: "MT-1003",
    medicine: "Amoxicillin 500mg (10 Capsules)",
    pharmacy_id: 3,
    pharmacy: "Aster Pharmacy - BTM Ring Road",
    status: "Delivered",
    eta_minutes: 0,
    eta: null,
    demo: true,
    disclaimer: "Sample order for demonstration. Arrival time is an estimate, not a guarantee."
  },
  {
    id: "MT-1004",
    medicine: "Inhaler Salbutamol 100mcg",
    pharmacy_id: 5,
    pharmacy: "Manipal Health Express - Whitefield",
    status: "Confirmed",
    eta_minutes: 42,
    eta: null,
    demo: true,
    disclaimer: "Sample order for demonstration. Arrival time is an estimate, not a guarantee."
  },
  {
    id: "MT-1005",
    medicine: "Blood Pressure Telmisartan 40mg",
    pharmacy_id: 4,
    pharmacy: "Trust Chemist & Druggist - JP Nagar",
    status: "Out for Delivery",
    eta_minutes: 14,
    eta: null,
    demo: true,
    disclaimer: "Sample order for demonstration. Arrival time is an estimate, not a guarantee."
  }
];

const INITIAL_EMERGENCIES: EmergencyRecord[] = [
  {
    id: 1,
    reference: "EM-101",
    medicine: "Epinephrine Auto-Injector",
    location: "4th Cross, Green Glen Layout, Bellandur, Bengaluru",
    pin: "560034",
    contact: "9876543210",
    created: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    status: "Pending review"
  },
  {
    id: 2,
    reference: "EM-102",
    medicine: "Inhaler Salbutamol & Oxygen Canister",
    location: "Flat 204, Diamond District, Old Airport Road, Bengaluru",
    pin: "560038",
    contact: "9845112233",
    created: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    status: "Assigned"
  }
];

class MediTrackDatabase {
  private pharmacies: Pharmacy[];
  private stock: StockItem[];
  private orders: OrderDetails[];
  private emergencies: EmergencyRecord[];
  private sessions: Map<string, number> = new Map();

  constructor() {
    this.pharmacies = this.load('meditrack_pharmacies', INITIAL_PHARMACIES);
    this.stock = this.load('meditrack_stock', INITIAL_STOCK);
    this.orders = this.load('meditrack_orders', INITIAL_ORDERS);
    this.emergencies = this.load('meditrack_emergencies', INITIAL_EMERGENCIES);
  }

  private load<T>(key: string, fallback: T): T {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // LocalStorage unavailable/disabled
    }
    return fallback;
  }

  private persist(key: string, data: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {
      // Ignore storage errors
    }
  }

  public resetToDefault() {
    this.pharmacies = [...INITIAL_PHARMACIES];
    this.stock = [...INITIAL_STOCK];
    this.orders = [...INITIAL_ORDERS];
    this.emergencies = [...INITIAL_EMERGENCIES];
    this.persist('meditrack_pharmacies', this.pharmacies);
    this.persist('meditrack_stock', this.stock);
    this.persist('meditrack_orders', this.orders);
    this.persist('meditrack_emergencies', this.emergencies);
  }

  // --- Algorithms matching ApiController.java ---

  public static km(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    return 2 * 6371 * Math.asin(Math.sqrt(h));
  }

  public static round1(x: number): number {
    return Math.round(x * 10) / 10.0;
  }

  public static eta(dist: number): number {
    return Math.round(15 + dist * 4);
  }

  public static status(
    dist: number,
    pharmacyRadius: number,
    on: boolean,
    qty: number
  ): DeliveryStatus {
    if (!on || dist > pharmacyRadius || qty <= 0) return "Delivery Unavailable";
    if (dist > pharmacyRadius * 0.8 || qty <= 5) return "Limited Availability";
    return "Available";
  }

  public locate(pin?: string, lat?: number | null, lng?: number | null): [number, number] {
    if (lat != null && lng != null) {
      if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
        throw new Error("Invalid coordinates.");
      }
      return [lat, lng];
    }
    if (!pin || !/^\d{6}$/.test(pin.trim())) {
      throw new Error("Enter a valid 6-digit PIN code.");
    }
    const target = pin.trim();
    const found = KNOWN_PINS.find((p) => p.pin === target);
    if (!found) {
      throw new Error(
        `PIN ${target} is not in the demo database. Try 560001, 560034, 560038, 560066, 560076, 560078 or 560100.`
      );
    }
    return [found.lat, found.lng];
  }

  public checkRadius(r: number) {
    const valid = [2, 5, 10, 15, 20];
    if (!valid.includes(r)) {
      throw new Error("Radius must be 2, 5, 10, 15 or 20 km.");
    }
  }

  // --- Endpoints ---

  public search(
    medicine: string,
    pin?: string,
    lat?: number | null,
    lng?: number | null,
    radius: number = 20,
    immediate: boolean = false
  ): SearchResponse {
    const m = medicine.trim();
    if (m.length < 2 || m.length > 60) {
      throw new Error("Enter a medicine name (2-60 characters).");
    }
    this.checkRadius(radius);
    const u = this.locate(pin, lat, lng);

    // Join pharmacies and stock
    const out: SearchResultItem[] = [];
    const lowerMed = m.toLowerCase();

    for (const p of this.pharmacies) {
      for (const s of this.stock) {
        if (s.pharmacy_id === p.id && s.medicine.toLowerCase().includes(lowerMed)) {
          const d = MediTrackDatabase.round1(MediTrackDatabase.km(u[0], u[1], p.lat, p.lng));
          const qty = s.qty;
          if (d > radius || (immediate && qty === 0)) continue;

          out.push({
            id: p.id,
            name: p.name,
            address: p.address,
            phone: p.phone,
            lat: p.lat,
            lng: p.lng,
            radius_km: p.radius_km,
            delivery_on: p.delivery_on,
            medicine: s.medicine,
            qty: s.qty,
            price: s.price,
            distanceKm: d,
            etaMinutes: MediTrackDatabase.eta(d),
            status: MediTrackDatabase.status(d, p.radius_km, p.delivery_on === 1, qty)
          });
        }
      }
    }

    out.sort((a, b) => a.distanceKm - b.distanceKm);

    // Recommendation logic: nearest pharmacy is out of stock -> suggest next one that has stock AND can deliver
    let rec: SearchResultItem | null = null;
    if (out.length > 0 && out[0].qty === 0) {
      for (const r of out) {
        if (r.qty > 0 && r.status !== "Delivery Unavailable") {
          rec = r;
          break;
        }
      }
    }

    return {
      results: out,
      recommendation: rec,
      agents: this.runAgents(out, radius),
      disclaimer: DISCLAIMER
    };
  }

  private runAgents(out: SearchResultItem[], radius: number) {
    const inStock = out.filter((r) => r.qty > 0);
    const avail = out.filter((r) => r.status === "Available").length;
    const limited = out.filter((r) => r.status === "Limited Availability").length;
    const none = out.length - avail - limited;
    const nearest =
      out.length === 0 ? "none" : `${out[0].name} (${out[0].distanceKm} km)`;
    const distFinding =
      inStock.length === 0
        ? `No in-stock pharmacy within ${radius} km.`
        : `Nearest in-stock pharmacy is ${inStock[0].distanceKm} km away, estimated ${inStock[0].etaMinutes} min (not guaranteed).`;

    return [
      {
        agent: "Medicine Availability Agent",
        finding: `${out.length} pharmacies list this medicine; ${inStock.length} show stock in sample data.`,
        mode: "Rule-based demo (simulated, not verified real-world data)"
      },
      {
        agent: "Pharmacy Finder Agent",
        finding: `${out.length} pharmacies within ${radius} km. Nearest listed: ${nearest}.`,
        mode: "Rule-based demo (simulated, not verified real-world data)"
      },
      {
        agent: "Delivery Distance Agent",
        finding: distFinding,
        mode: "Rule-based demo (simulated, not verified real-world data)"
      },
      {
        agent: "Delivery Status Agent",
        finding: `${avail} Available, ${limited} Limited, ${none} Unavailable.`,
        mode: "Rule-based demo (simulated, not verified real-world data)"
      }
    ];
  }

  public getPharmacies(
    pin?: string,
    lat?: number | null,
    lng?: number | null,
    radius: number = 20
  ): NearbyPharmaciesResponse {
    this.checkRadius(radius);
    const u = this.locate(pin, lat, lng);
    const out: NearbyPharmaciesResponse["results"] = [];

    for (const p of this.pharmacies) {
      const d = MediTrackDatabase.round1(MediTrackDatabase.km(u[0], u[1], p.lat, p.lng));
      if (d > radius) continue;
      out.push({
        id: p.id,
        name: p.name,
        address: p.address,
        phone: p.phone,
        lat: p.lat,
        lng: p.lng,
        radius_km: p.radius_km,
        delivery_on: p.delivery_on,
        distanceKm: d,
        etaMinutes: MediTrackDatabase.eta(d),
        status: MediTrackDatabase.status(d, p.radius_km, p.delivery_on === 1, 99)
      });
    }

    out.sort((a, b) => a.distanceKm - b.distanceKm);

    return {
      user: { lat: u[0], lng: u[1] },
      radius,
      results: out,
      disclaimer: DISCLAIMER
    };
  }

  public getOrder(idInput: string): OrderDetails {
    const id = idInput.trim().toUpperCase();
    if (!/^MT-\d{4}$/.test(id)) {
      throw new Error("Order ID format: MT-1001");
    }
    const order = this.orders.find((o) => o.id === id);
    if (!order) {
      throw new Error("Order not found. Try sample orders MT-1001 to MT-1005.");
    }
    const done = order.status === "Delivered";
    let etaString: string | null = null;
    if (!done) {
      const now = new Date();
      now.setMinutes(now.getMinutes() + order.eta_minutes);
      etaString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    return {
      ...order,
      eta: etaString
    };
  }

  public createEmergency(medicine: string, location: string, pin: string, contact: string): EmergencyResponse {
    if (!medicine || medicine.trim().length < 2) throw new Error("Enter the medicine name.");
    if (!location || location.trim().length < 3) throw new Error("Enter the patient location.");
    if (!pin || !/^\d{6}$/.test(pin.trim())) throw new Error("Enter a valid 6-digit PIN code.");
    if (!contact || !/^[6-9]\d{9}$/.test(contact.trim())) throw new Error("Enter a valid 10-digit mobile number.");

    const newId = this.emergencies.length > 0 ? Math.max(...this.emergencies.map((e) => e.id)) + 1 : 101;
    const ref = `EM-${newId}`;
    const record: EmergencyRecord = {
      id: newId,
      reference: ref,
      medicine: medicine.trim(),
      location: location.trim(),
      pin: pin.trim(),
      contact: contact.trim(),
      created: new Date().toISOString(),
      status: "Pending review"
    };

    this.emergencies.unshift(record);
    this.persist('meditrack_emergencies', this.emergencies);

    return {
      reference: ref,
      message:
        "Request recorded and flagged as priority for review by participating pharmacies. Delivery is NOT confirmed until a pharmacy contacts you. " +
        "If this is a life-threatening emergency, call your local emergency number (112 in India) or go to the nearest hospital now."
    };
  }

  public getEmergencies(): EmergencyRecord[] {
    return [...this.emergencies];
  }

  public login(pharmacyId: number, password: string): { token: string } {
    if (!pharmacyId || !password || password.trim() === '') {
      throw new Error("Enter pharmacy ID and password.");
    }
    const p = this.pharmacies.find((item) => item.id === pharmacyId && item.password === password);
    if (!p) {
      throw new Error("Invalid pharmacy ID or password.");
    }
    const token = "tok_" + Math.random().toString(36).substring(2) + Date.now();
    this.sessions.set(token, pharmacyId);
    return { token };
  }

  private auth(authHeader?: string | null): number {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Please log in again.");
    }
    const token = authHeader.substring(7);
    const id = this.sessions.get(token);
    if (!id) {
      throw new Error("Please log in again.");
    }
    return id;
  }

  public getDashboard(authHeader?: string | null): DashboardResponse {
    const id = this.auth(authHeader);
    const pharmacy = this.pharmacies.find((p) => p.id === id);
    if (!pharmacy) throw new Error("Pharmacy not found");

    const stock = this.stock
      .filter((s) => s.pharmacy_id === id)
      .map((s) => ({ medicine: s.medicine, qty: s.qty, price: s.price }))
      .sort((a, b) => a.medicine.localeCompare(b.medicine));

    return {
      pharmacy: {
        id: pharmacy.id,
        name: pharmacy.name,
        address: pharmacy.address,
        phone: pharmacy.phone,
        radius_km: pharmacy.radius_km,
        delivery_on: pharmacy.delivery_on
      },
      stock
    };
  }

  public updateStock(authHeader: string | null, medicine: string, qty: number, price: number): { ok: boolean } {
    const id = this.auth(authHeader);
    if (!medicine || medicine.trim().length < 2 || medicine.length > 60) {
      throw new Error("Enter a medicine name (2-60 characters).");
    }
    if (qty == null || qty < 0 || qty > 100000) {
      throw new Error("Quantity must be 0 or more.");
    }
    if (price == null || price < 0 || price > 1000000) {
      throw new Error("Enter a valid price.");
    }

    const trimmedMed = medicine.trim();
    const existing = this.stock.find(
      (s) => s.pharmacy_id === id && s.medicine.toLowerCase() === trimmedMed.toLowerCase()
    );

    if (existing) {
      existing.qty = qty;
      existing.price = price;
    } else {
      this.stock.push({
        pharmacy_id: id,
        medicine: trimmedMed,
        qty,
        price
      });
    }

    this.persist('meditrack_stock', this.stock);
    return { ok: true };
  }

  public updateDelivery(authHeader: string | null, enabled: boolean, radius: number): { ok: boolean } {
    const id = this.auth(authHeader);
    if (enabled == null) throw new Error("Delivery flag missing.");
    if (radius == null || radius < 1 || radius > 30) throw new Error("Radius must be 1-30 km.");

    const p = this.pharmacies.find((item) => item.id === id);
    if (!p) throw new Error("Pharmacy not found");

    p.delivery_on = enabled ? 1 : 0;
    p.radius_km = radius;
    this.persist('meditrack_pharmacies', this.pharmacies);
    return { ok: true };
  }

  public getAllPharmaciesPublic(): Pharmacy[] {
    return this.pharmacies.map(({ password: _, ...rest }) => rest);
  }
}

export const meditrackService = new MediTrackDatabase();
