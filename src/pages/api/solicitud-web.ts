import type { APIRoute } from 'astro';
import { sendEmail, isEmailConfigured } from '../../lib/email';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();

    // Extraer campos del formulario
    const datos = {
      nombre: formData.get('nombre') as string,
      email: formData.get('email') as string,
      telefono: formData.get('telefono') as string,
      dominio1: formData.get('dominio1') as string,
      dominio2: formData.get('dominio2') as string,
      negocio: formData.get('negocio') as string,
      equipo: formData.get('equipo') as string,
      puntos_fuertes: formData.get('puntos_fuertes') as string,
      publico: formData.get('publico') as string,
      referencias: formData.get('referencias') as string,
      estructura: formData.get('estructura') as string,
      funciones: formData.get('funciones') as string,
      creatividad: formData.get('creatividad') as string,
      aclaraciones: formData.get('aclaraciones') as string,
      redes_sociales: formData.get('redes_sociales') as string,
      datos_contacto: formData.get('datos_contacto') as string,
    };

    // Validar campos requeridos
    if (!datos.nombre || !datos.email || !datos.dominio1 || !datos.dominio2 || !datos.negocio) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verificar configuracion SMTP
    if (!isEmailConfigured()) {
      console.error('SMTP no configurado');
      return new Response(
        JSON.stringify({ error: 'El servidor de email no esta configurado' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Construir contenido del email
    const campos = [
      { label: 'Nombre de la empresa', value: datos.nombre },
      { label: 'Email', value: datos.email },
      { label: 'Telefono', value: datos.telefono },
      { label: 'Dominio opcion 1', value: datos.dominio1 },
      { label: 'Dominio opcion 2', value: datos.dominio2 },
      { label: 'Negocio/Actividad', value: datos.negocio },
      { label: 'Equipo', value: datos.equipo },
      { label: 'Puntos fuertes', value: datos.puntos_fuertes },
      { label: 'Publico objetivo', value: datos.publico },
      { label: 'Referencias web', value: datos.referencias },
      { label: 'Estructura contenidos', value: datos.estructura },
      { label: 'Funciones deseadas', value: datos.funciones },
      { label: 'Necesidades de creatividad', value: datos.creatividad },
      { label: 'Aclaraciones', value: datos.aclaraciones },
      { label: 'Redes sociales', value: datos.redes_sociales },
      { label: 'Datos de contacto', value: datos.datos_contacto },
    ];

    // Verificar archivos adjuntos
    const logotipoFiles = formData.getAll('logotipo') as File[];
    const proyectosFiles = formData.getAll('proyectos') as File[];
    const tieneArchivos = logotipoFiles.some(f => f.size > 0) || proyectosFiles.some(f => f.size > 0);

    // Texto plano
    let textoPlano = campos
      .filter(c => c.value)
      .map(c => `${c.label}:\n${c.value}`)
      .join('\n\n---\n\n');

    if (tieneArchivos) {
      const nombresLogotipos = logotipoFiles.filter(f => f.size > 0).map(f => f.name).join(', ');
      const nombresProyectos = proyectosFiles.filter(f => f.size > 0).map(f => f.name).join(', ');

      textoPlano += '\n\n---\n\nARCHIVOS ADJUNTOS (solicitar por email o WeTransfer):';
      if (nombresLogotipos) textoPlano += `\n- Logotipos: ${nombresLogotipos}`;
      if (nombresProyectos) textoPlano += `\n- Fotos de proyectos: ${nombresProyectos}`;
    }

    // HTML
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    h1 { color: #f5c518; border-bottom: 2px solid #f5c518; padding-bottom: 10px; }
    h2 { color: #555; margin-top: 30px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
    .field { background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
    .field-label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; }
    .field-value { white-space: pre-wrap; }
    .alert { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin-top: 20px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <h1>Nueva Solicitud de Web</h1>
  <p>Se ha recibido una nueva solicitud de proyecto web desde el formulario de SOLWED.</p>

  <h2>Datos del cliente</h2>
  ${campos.filter(c => c.value).map(c => `
  <div class="field">
    <div class="field-label">${c.label}</div>
    <div class="field-value">${String(c.value).replace(/\n/g, '<br>')}</div>
  </div>
  `).join('')}

  ${tieneArchivos ? `
  <div class="alert">
    <strong>Archivos pendientes de recibir:</strong><br>
    El cliente tiene archivos para adjuntar. Solicitarle que los envie por email o WeTransfer.
    ${logotipoFiles.filter(f => f.size > 0).length > 0 ? `<br>- Logotipos: ${logotipoFiles.filter(f => f.size > 0).map(f => f.name).join(', ')}` : ''}
    ${proyectosFiles.filter(f => f.size > 0).length > 0 ? `<br>- Fotos de proyectos: ${proyectosFiles.filter(f => f.size > 0).map(f => f.name).join(', ')}` : ''}
  </div>
  ` : ''}

  <div class="footer">
    Este email fue enviado automaticamente desde el formulario de solicitud de web de SOLWED.<br>
    <a href="https://solwed.es">solwed.es</a>
  </div>
</body>
</html>
    `;

    // Enviar email
    await sendEmail({
      to: ['admin@solwed.es', 'soporte@solwed.es'],
      subject: `Nueva Solicitud Web - ${datos.nombre}`,
      text: textoPlano,
      html: htmlContent,
      replyTo: datos.email,
    });

    return new Response(
      JSON.stringify({ success: true, message: 'Solicitud enviada correctamente' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error al procesar solicitud:', error);
    return new Response(
      JSON.stringify({ error: 'Error al enviar la solicitud' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
