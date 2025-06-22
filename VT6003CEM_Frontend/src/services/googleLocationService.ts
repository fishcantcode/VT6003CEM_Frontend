import type { HotelInfo } from '../types/hotel';

const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
const apiUrl = 'https://places.googleapis.com/v1/places:searchText';

export const getGoogleLocation = async (
  searchText: string
): Promise<HotelInfo[]> => {
  if (!apiKey) {
    throw new Error('Google Places API key is not configured.');
  }

  const requestBody = {
    textQuery: searchText,
    languageCode: 'en',
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask':
        'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.plusCode,places.location,places.shortFormattedAddress',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data from Google Places API');
  }

  const data = await response.json();

  const hotels: HotelInfo[] = (data.places || []).map((place: any) => ({
    place_id: place.id,
    name: place.displayName?.text,
    formatted_address: place.formattedAddress,
    rating: place.rating,
    user_ratings_total: place.userRatingCount,
    compound_code: place.plusCode?.compoundCode,
    geometry: {
      location: {
        lat: place.location.latitude,
        lng: place.location.longitude,
      },
    },
    vicinity: place.shortFormattedAddress,
    status: 'available',
  }));

  return hotels;
};

