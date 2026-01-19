/**
 * Fetch reviews from Trustindex CDN at build time
 * Falls back to static testimonials if fetch fails
 */

import type { Testimonial } from './testimonials';

const TRUSTINDEX_CDN_URL =
  'https://cdn.trustindex.io/widgets/37/37953d062d7860827e16e0fcc65/content.html';

export interface TrustindexData {
  reviews: Testimonial[];
  rating: number;
  totalReviews: number;
}

export async function fetchTrustindexReviews(): Promise<TrustindexData | null> {
  try {
    const response = await fetch(TRUSTINDEX_CDN_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AstroBot/1.0)',
      },
    });

    if (!response.ok) {
      console.warn(`Trustindex fetch failed: ${response.status}`);
      return null;
    }

    const html = await response.text();

    // Parse reviews from HTML
    const reviews = parseReviewsFromHTML(html);

    if (reviews.length === 0) {
      console.warn('No reviews parsed from Trustindex HTML');
      return null;
    }

    // Extract rating from widget data or header
    const ratingMatch = html.match(/data-rating="([\d.]+)"/);
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : 5;

    // Extract total reviews count
    const totalMatch = html.match(/(\d+)\s*reseñas?/i) || html.match(/(\d+)\s*reviews?/i);
    const totalReviews = totalMatch ? parseInt(totalMatch[1]) : reviews.length;

    // Filter out reviews that mention "Kit Digital" (subsidy program)
    const filteredReviews = reviews.filter(
      (r) => !r.content.toLowerCase().includes('kit digital')
    );

    console.log(`Trustindex: Parsed ${reviews.length} reviews, ${filteredReviews.length} after filtering`);

    return {
      reviews: filteredReviews,
      rating,
      totalReviews,
    };
  } catch (error) {
    console.warn('Failed to fetch Trustindex reviews:', error);
    return null;
  }
}

function parseReviewsFromHTML(html: string): Testimonial[] {
  const reviews: Testimonial[] = [];

  // Trustindex widget HTML structure patterns
  // The widget uses various class patterns, we'll try multiple approaches

  // Pattern 1: Look for review content blocks with profile names
  // Trustindex typically structures: name in bold/span, followed by review text
  const reviewBlockRegex =
    /<div[^>]*class="[^"]*ti-review-item[^"]*"[^>]*>([\s\S]*?)<\/div>\s*(?:<\/div>\s*){2,}/gi;

  // Alternative pattern for different Trustindex widget versions
  const altReviewRegex =
    /<div[^>]*profile-(?:image|info|content)[^>]*>[\s\S]*?<\/div>/gi;

  // Extract using profile image as anchor (most reliable)
  // Each review typically has: profile pic, name, stars, content
  const profileSections = html.split(/(?=<div[^>]*(?:ti-profile|profile-image))/gi);

  let id = 1;

  for (const section of profileSections) {
    if (!section || section.length < 50) continue;

    // Extract name - usually in a span or div after profile image
    const namePatterns = [
      /<span[^>]*class="[^"]*ti-name[^"]*"[^>]*>([^<]+)<\/span>/i,
      /<div[^>]*class="[^"]*ti-name[^"]*"[^>]*>([^<]+)<\/div>/i,
      /<(?:b|strong)[^>]*>([^<]+)<\/(?:b|strong)>/i,
      /profile-name[^>]*>([^<]+)</i,
      />\s*([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)+)\s*</,
    ];

    let name: string | null = null;
    for (const pattern of namePatterns) {
      const match = section.match(pattern);
      if (match?.[1]?.trim()) {
        name = decodeHTMLEntities(match[1].trim());
        break;
      }
    }

    // Extract review text
    const textPatterns = [
      /<div[^>]*class="[^"]*ti-review-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
      /<p[^>]*class="[^"]*ti-review-text[^"]*"[^>]*>([\s\S]*?)<\/p>/i,
      /<div[^>]*review-content[^>]*>([\s\S]*?)<\/div>/i,
      /"([^"]{20,500})"/g, // Quoted text of reasonable length
    ];

    let content: string | null = null;
    for (const pattern of textPatterns) {
      const match = section.match(pattern);
      if (match?.[1]?.trim()) {
        content = decodeHTMLEntities(stripHTML(match[1].trim()));
        if (content.length >= 20) break;
      }
    }

    // Extract rating (default to 5 if not found)
    const ratingMatch = section.match(/data-rating="(\d)"/i) ||
      section.match(/(\d)\s*(?:star|estrella)/i);
    const rating = ratingMatch ? parseInt(ratingMatch[1]) : 5;

    // Only add if we have both name and content
    if (name && content && content.length >= 15) {
      // Avoid duplicates
      const isDuplicate = reviews.some(
        (r) => r.name === name || r.content === content
      );

      if (!isDuplicate) {
        reviews.push({
          id: String(id++),
          name,
          content,
          rating,
          source: 'google',
        });
      }
    }
  }

  // If the above didn't work, try a simpler text extraction
  if (reviews.length === 0) {
    // Fallback: extract text between common review markers
    const simpleMatches = html.matchAll(
      />\s*([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+){0,3})\s*<[\s\S]{0,200}?>\s*([^<]{30,400})\s*</g
    );

    for (const match of simpleMatches) {
      const name = match[1]?.trim();
      const content = match[2]?.trim();

      if (name && content && content.length >= 30) {
        const isDuplicate = reviews.some(
          (r) => r.name === name || r.content === content
        );

        if (!isDuplicate && !content.includes('<') && !content.includes('>')) {
          reviews.push({
            id: String(id++),
            name,
            content: decodeHTMLEntities(content),
            rating: 5,
            source: 'google',
          });
        }
      }
    }
  }

  return reviews;
}

function stripHTML(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeHTMLEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
    '&ntilde;': 'ñ',
    '&Ntilde;': 'Ñ',
    '&aacute;': 'á',
    '&eacute;': 'é',
    '&iacute;': 'í',
    '&oacute;': 'ó',
    '&uacute;': 'ú',
    '&Aacute;': 'Á',
    '&Eacute;': 'É',
    '&Iacute;': 'Í',
    '&Oacute;': 'Ó',
    '&Uacute;': 'Ú',
  };

  let result = text;
  for (const [entity, char] of Object.entries(entities)) {
    result = result.replace(new RegExp(entity, 'g'), char);
  }

  // Handle numeric entities
  result = result.replace(/&#(\d+);/g, (_, code) =>
    String.fromCharCode(parseInt(code))
  );

  return result;
}
