import type { APIRoute } from 'astro';
import { sendEmail, isEmailConfigured } from '../../../lib/email';

export const prerender = false;

/**
 * POST /api/domains/purchase
 * Procesa una solicitud de compra de dominios y envía email al equipo
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    const {
      domains, // Array de { domain, tld, price, available }
      customerName,
      customerEmail,
      customerPhone,
    } = data;

    // Validar campos requeridos
    if (!domains || !Array.isArray(domains) || domains.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No domains provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!customerName || !customerEmail) {
      return new Response(
        JSON.stringify({ error: 'Customer name and email are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verificar configuración SMTP
    if (!isEmailConfigured()) {
      console.error('[API] SMTP not configured');
      return new Response(
        JSON.stringify({ error: 'Email server is not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Calcular total
    const total = domains.reduce((sum: number, d: any) => sum + (d.price || 0), 0);

    // Construir contenido del email
    const domainsList = domains
      .map((d: any) => `- ${d.domain} (${d.price?.toFixed(2)} EUR/año)`)
      .join('\n');

    const textoPlano = `
NUEVA SOLICITUD DE COMPRA DE DOMINIOS
======================================

CLIENTE
-------
Nombre: ${customerName}
Email: ${customerEmail}
${customerPhone ? `Teléfono: ${customerPhone}` : ''}

DOMINIOS SOLICITADOS
-------------------
${domainsList}

TOTAL: ${total.toFixed(2)} EUR/año

---

Este email fue enviado automáticamente desde el formulario de dominios de SOLWED.
Responder al cliente a: ${customerEmail}
    `.trim();

    // HTML del email
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #f5c518;
      border-bottom: 2px solid #f5c518;
      padding-bottom: 10px;
    }
    h2 {
      color: #555;
      margin-top: 30px;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .info-box {
      background: #f9f9f9;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .info-row {
      display: flex;
      margin-bottom: 8px;
    }
    .info-label {
      font-weight: bold;
      color: #666;
      min-width: 100px;
    }
    .domain-list {
      list-style: none;
      padding: 0;
    }
    .domain-item {
      background: #fff;
      border: 1px solid #e0e0e0;
      padding: 12px;
      margin-bottom: 8px;
      border-radius: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .domain-name {
      font-weight: bold;
      color: #333;
    }
    .domain-price {
      color: #f5c518;
      font-weight: bold;
    }
    .total {
      background: #f5c518;
      color: #000;
      padding: 15px;
      border-radius: 8px;
      text-align: right;
      font-size: 18px;
      font-weight: bold;
      margin-top: 20px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      font-size: 12px;
      color: #999;
    }
  </style>
</head>
<body>
  <h1>Nueva Solicitud de Compra de Dominios</h1>
  <p>Se ha recibido una nueva solicitud de compra de dominios desde SOLWED.</p>

  <h2>Datos del Cliente</h2>
  <div class="info-box">
    <div class="info-row">
      <span class="info-label">Nombre:</span>
      <span>${customerName}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Email:</span>
      <span><a href="mailto:${customerEmail}">${customerEmail}</a></span>
    </div>
    ${customerPhone ? `
    <div class="info-row">
      <span class="info-label">Teléfono:</span>
      <span>${customerPhone}</span>
    </div>
    ` : ''}
  </div>

  <h2>Dominios Solicitados</h2>
  <ul class="domain-list">
    ${domains.map((d: any) => `
    <li class="domain-item">
      <span class="domain-name">${d.domain}</span>
      <span class="domain-price">${d.price?.toFixed(2)} EUR/año</span>
    </li>
    `).join('')}
  </ul>

  <div class="total">
    TOTAL: ${total.toFixed(2)} EUR/año
  </div>

  <div class="footer">
    Este email fue enviado automáticamente desde el formulario de dominios de SOLWED.<br>
    Para responder al cliente, usa: <a href="mailto:${customerEmail}">${customerEmail}</a><br>
    <a href="https://solwed.es">solwed.es</a>
  </div>
</body>
</html>
    `.trim();

    // Enviar email al equipo
    await sendEmail({
      to: ['admin@solwed.es', 'soporte@solwed.es'],
      subject: `Solicitud de Dominio - ${customerName} (${domains.length} dominio${domains.length > 1 ? 's' : ''})`,
      text: textoPlano,
      html: htmlContent,
      replyTo: customerEmail,
    });

    // TODO: Enviar email de confirmación al cliente
    // await sendEmail({
    //   to: [customerEmail],
    //   subject: 'Hemos recibido tu solicitud de dominio',
    //   ...
    // });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Domain purchase request sent successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[API] Error processing domain purchase:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to process domain purchase',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
