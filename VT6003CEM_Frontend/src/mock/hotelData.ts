export interface Hotel {
  id: string;
  name: string;
  location: string;
  images: string[];
  amenities: string[];
  descriptionTitle: string;
  description: string;
  isFullyRefundable: boolean;
  canCollectStamps: boolean;
  rating: {
    score: number;
    label: string;
    reviewCount: number;
  };
  price: {
    original: number;
    current: number;
    total: number;
    currency: string;
    discountPercentage: number;
  };
  isAd: boolean;
}

export const mockHotels: Hotel[] = [
  {
    id: '1',
    name: 'Imperial Hotel, Tokyo',
    location: 'Tokyo',
    images: [
      'https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2072&q=80',
    ],
    amenities: ['Pool', 'Hot tub'],
    descriptionTitle: 'An Unparalleled Luxury Stay in Tokyo',
    description: 'Centrally located and offering refined rooms with elegant decor. A variety of exquisite restaurants and bars await your enjoyment.',
    isFullyRefundable: true,
    canCollectStamps: true,
    rating: {
      score: 9.8,
      label: 'Exceptional',
      reviewCount: 1145,
    },
    price: {
      original: 3092,
      current: 2566,
      total: 6772,
      currency: 'HK$',
      discountPercentage: 17,
    },
    isAd: true,
  },
  {
    id: '2',
    name: 'Park Hyatt Tokyo',
    location: 'Tokyo',
    images: [
      'https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    ],
    amenities: ['Spa', 'Gym', 'Restaurant'],
    descriptionTitle: 'Iconic Hotel with Panoramic Views',
    description: 'Experience unparalleled luxury and breathtaking views of the city and Mount Fuji from this iconic hotel.',
    isFullyRefundable: false,
    canCollectStamps: true,
    rating: {
      score: 9.6,
      label: 'Superb',
      reviewCount: 850,
    },
    price: {
      original: 0,
      current: 4500,
      total: 9000,
      currency: 'HK$',
      discountPercentage: 0,
    },
    isAd: false,
  }
];
