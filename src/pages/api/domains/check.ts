import type { APIRoute } from 'astro';
import { donDominioAPI } from '../../../lib/dondominio-api';

export const prerender = false;

/**
 * POST /api/domains/check
 * Verifica la disponibilidad de un dominio con múltiples TLDs
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const { domain } = await request.json();

    if (!domain || typeof domain !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Domain name is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Limpiar el dominio (eliminar espacios, www, http, etc.)
    const cleanDomain = domain
      .trim()
      .toLowerCase()
      .replace(/^(https?:\/\/)?(www\.)?/, '')
      .replace(/\/$/, '')
      .split('.')[0]; // Tomar solo el nombre sin TLD

    // Validar que el dominio es válido
    if (!/^[a-z0-9-]+$/.test(cleanDomain)) {
      return new Response(
        JSON.stringify({ error: 'Invalid domain name. Use only letters, numbers, and hyphens.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Lista de TLDs a verificar (limitado a 5 por restricción de DonDominio API)
    const tlds = ['.es', '.com', '.net', '.org', '.io'];

    // Generar lista de dominios completos
    const domainsToCheck = tlds.map(tld => `${cleanDomain}${tld}`);

    // Consultar disponibilidad
    const results = await donDominioAPI.checkDomains(domainsToCheck);

    return new Response(JSON.stringify({
      success: true,
      query: cleanDomain,
      results,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300', // Cache por 5 minutos
      },
    });
  } catch (error) {
    console.error('[API] Error checking domains:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to check domain availability',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
