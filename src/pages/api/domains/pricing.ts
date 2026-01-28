import type { APIRoute } from 'astro';
import { donDominioAPI } from '../../../lib/dondominio-api';

export const prerender = false;

/**
 * GET /api/domains/pricing?tlds=.com,.es,.net
 * Obtiene los precios de los TLDs especificados
 */
export const GET: APIRoute = async ({ url }) => {
  try {
    const tldsParam = url.searchParams.get('tlds');

    if (!tldsParam) {
      return new Response(
        JSON.stringify({ error: 'TLDs parameter is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Parsear TLDs desde el query string
    const tlds = tldsParam
      .split(',')
      .map(tld => tld.trim())
      .filter(tld => tld.startsWith('.'));

    if (tlds.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No valid TLDs provided' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Obtener precios
    const pricing = await donDominioAPI.getPricing(tlds);

    return new Response(JSON.stringify({
      success: true,
      pricing,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache por 1 hora
      },
    });
  } catch (error) {
    console.error('[API] Error getting pricing:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to get domain pricing',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
