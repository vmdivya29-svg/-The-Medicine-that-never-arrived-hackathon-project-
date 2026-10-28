export interface PinLocation {
  pin: string;
  lat: number;
  lng: number;
  area: string;
}

export interface Pharmacy {
  id: number;
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  radius_km: number;
  delivery_on: number; // 1 or 0
  password?: string;
}

export interface StockItem {
  pharmacy_id: number;
  medicine: string;
  qty: number;
  price: number;
}

export type DeliveryStatus = 'Available' | 'Limited Availability' | 'Delivery Unavailable';

export interface SearchResultItem {
  id: number;
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  radius_km: number;
  delivery_on: number;
  medicine: string;
  qty: number;
  price: number;
  distanceKm: number;
  etaMinutes: number;
  status: DeliveryStatus;
}

export interface AgentReport {
  agent: string;
  finding: string;
  mode: string;
}

export interface SearchResponse {
  results: SearchResultItem[];
  recommendation: SearchResultItem | null;
  agents: AgentReport[];
  disclaimer: string;
}

export interface NearbyPharmacyItem {
  id: number;
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  radius_km: number;
  delivery_on: number;
  distanceKm: number;
  etaMinutes: number;
  status: DeliveryStatus;
}

export interface NearbyPharmaciesResponse {
  user: { lat: number; lng: number };
  radius: number;
  results: NearbyPharmacyItem[];
  disclaimer: string;
}

export interface OrderDetails {
  id: string;
  medicine: string;
  pharmacy_id: number;
  pharmacy: string;
  status: 'Confirmed' | 'Preparing Dispatch' | 'Out for Delivery' | 'Delivered';
  eta_minutes: number;
  eta: string | null;
  demo: boolean;
  disclaimer: string;
}

export interface EmergencyRecord {
  id: number;
  reference: string;
  medicine: string;
  location: string;
  pin: string;
  contact: string;
  created: string;
  status: 'Pending review' | 'Assigned' | 'Dispatched';
}

export interface EmergencyResponse {
  reference: string;
  message: string;
}

export interface DashboardResponse {
  pharmacy: {
    id: number;
    name: string;
    address: string;
    phone: string;
    radius_km: number;
    delivery_on: number;
  };
  stock: {
    medicine: string;
    qty: number;
    price: number;
  }[];
}
