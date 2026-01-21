// Google Places API (New) - Fetch reviews at build time

export interface GoogleReview {
  authorName: string;
  authorPhotoUrl?: string;
  rating: number;
  relativeTimeDescription: string;
  text: string;
  publishTime: string;
}

export interface GooglePlaceData {
  rating: number;
  totalReviews: number;
  reviews: GoogleReview[];
}

interface PlacesApiReview {
  name: string;
  relativePublishTimeDescription: string;
  rating: number;
  text?: {
    text: string;
    languageCode: string;
  };
  originalText?: {
    text: string;
    languageCode: string;
  };
  authorAttribution: {
    displayName: string;
    uri: string;
    photoUri?: string;
  };
  publishTime: string;
}

interface PlacesApiResponse {
  rating?: number;
  userRatingCount?: number;
  reviews?: PlacesApiReview[];
}

/**
 * Fetches Google Place data including reviews using Places API (New)
 * This is called at build time in Astro
 */
export async function fetchGoogleReviews(): Promise<GooglePlaceData | null> {
  const apiKey = import.meta.env.GOOGLE_PLACES_API_KEY;
  const placeId = import.meta.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId || placeId === 'TU_PLACE_ID_AQUI') {
    console.warn('[Google Reviews] Missing API key or Place ID. Skipping fetch.');
    return null;
  }

  const url = `https://places.googleapis.com/v1/places/${placeId}?languageCode=es`;
  const fields = 'rating,userRatingCount,reviews';

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': fields,
        'Accept-Language': 'es-ES',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Google Reviews] API error: ${response.status}`, errorText);
      return null;
    }

    const data: PlacesApiResponse = await response.json();

    const reviews: GoogleReview[] = (data.reviews || []).map((review) => ({
      authorName: review.authorAttribution.displayName,
      authorPhotoUrl: review.authorAttribution.photoUri,
      rating: review.rating,
      relativeTimeDescription: review.relativePublishTimeDescription,
      text: review.text?.text || review.originalText?.text || '',
      publishTime: review.publishTime,
    }));

    return {
      rating: data.rating || 0,
      totalReviews: data.userRatingCount || 0,
      reviews,
    };
  } catch (error) {
    console.error('[Google Reviews] Fetch error:', error);
    return null;
  }
}

/**
 * Fallback data for when API is not configured
 * You can customize this with your actual stats
 */
export function getFallbackData(): GooglePlaceData {
  return {
    rating: 5.0,
    totalReviews: 50,
    reviews: [],
  };
}
