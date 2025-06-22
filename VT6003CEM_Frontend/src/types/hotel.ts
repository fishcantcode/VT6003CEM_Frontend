export type HotelStatus = 'available' | 'unavailable';

export interface HotelInfo {
  id?: number; // Auto-generated database ID used as primary key
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  name: string;
  place_id: string; // Google's place_id (used for Google API operations)
  rating: number;
  user_ratings_total: number;
  compound_code?: string;
  vicinity?: string;
  status: HotelStatus;
}

export interface GoogleHotelData {
  results: HotelInfo[];
}

