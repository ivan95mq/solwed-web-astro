# Configuración del Webhook en Stripe

## ✅ ESTADO: CONFIGURADO AUTOMÁTICAMENTE VIA API

**Fecha de configuración:** 2026-01-05
**Método:** Stripe REST API (automático)

## Información del Webhook Configurado

### Detalles Técnicos

- **Webhook ID:** `we_1SmLO6H3wvr1u5BM5VyYQkee`
- **URL:** `https://erp.solwed.es/StripeAlbaranWebhook`
- **Estado:** ✅ Enabled (Activo)
- **Modo:** Live (Producción)
- **Descripción:** "ERP Solwed - Creacion automatica de albaranes"

### Eventos Configurados

- ✅ **`invoice.paid`** - Cuando se paga una factura de suscripción
- ✅ **`invoice.payment_failed`** - Cuando falla un pago (solo registro)

### Credenciales (Configuradas en BD)

- ✅ **Secret Key:** `sk_live_51M7GDmH3wvr1u5BM...`
- ✅ **Webhook Secret:** `whsec_e2R8UGm7NRbKJV4s...`

## Verificación de Configuración

### Comprobar webhook en Stripe

```bash
curl -s https://api.stripe.com/v1/webhook_endpoints/we_1SmLO6H3wvr1u5BM5VyYQkee \
  -u "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:"
```

### Comprobar configuración en BD

```bash
ssh -i "P:/APPs/Claude/.ssh/id_rsa" ubuntu@54.37.230.9 \
  "sudo mysql facturascripts -e \"
    SELECT
      LEFT(stripe_secret_key, 25) as secret_preview,
      LEFT(stripe_webhook_secret, 20) as webhook_preview
    FROM stripe_albaranes_config
    WHERE id = 1;
  \""
```

### Comprobar que el endpoint responde

```bash
curl -X POST https://erp.solwed.es/StripeAlbaranWebhook \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

**Respuesta esperada:** `{"success":false,"error":"Invalid webhook signature"}`
(Es correcto, significa que el endpoint está activo y validando firmas)

## Cómo Funciona el Webhook

### 1. Stripe envía evento `invoice.paid`

Cuando un cliente paga su suscripción, Stripe envía un POST a:
`https://erp.solwed.es/StripeAlbaranWebhook`

### 2. Verificación de firma

El webhook valida que la petición viene de Stripe usando el `webhook_secret`

### 3. Búsqueda del cliente

Busca el cliente en FacturaScripts por el email del customer de Stripe:
- `Stripe Customer Email` → `Contacto` (por email) → `Cliente`

### 4. Creación del albarán

Crea un albarán automáticamente con:
- ✅ Líneas desde `invoice.lines`
- ✅ Total calculado desde `invoice.amount_paid`
- ✅ Marcado como **pagado** (`pc_paid = 1`)
- ✅ PaymentIntent guardado (`pc_payment_intent_stripe`)

### 5. Envío de email

Envía email al cliente con:
- PDF del albarán
- Detalles del pago (marca de tarjeta, últimos 4 dígitos)

## Probar el Webhook

**Desde Stripe Dashboard:**

1. En la página del webhook, ve a la pestaña **"Testing"** o **"Send test webhook"**
2. Selecciona el evento: **`invoice.paid`**
3. Modifica el JSON de prueba para incluir:

```json
{
  "id": "evt_test",
  "type": "invoice.paid",
  "data": {
    "object": {
      "id": "in_test",
      "subscription": "sub_test",
      "customer": "cus_test",
      "customer_email": "ivan@solwed.es",
      "payment_intent": "pi_test",
      "amount_paid": 2990,
      "lines": {
        "data": [
          {
            "description": "Suscripción ERP Solwed - Plan Test",
            "amount": 2990,
            "quantity": 1
          }
        ]
      }
    }
  }
}
```

4. Click en **"Send test webhook"**
5. Verificar la respuesta (debería ser `200 OK` con `{"success":true}`)

### 7. Verificar en el ERP

**Verificar logs:**
```bash
ssh -i "P:/APPs/Claude/.ssh/id_rsa" ubuntu@54.37.230.9
tail -50 /var/www/erp.solwed.es/MyFiles/Logs/stripe_albaranes.log
```

**Verificar albarán creado:**
```bash
sudo mysql facturascripts -e "
SELECT codigo, nombrecliente, total, pc_paid, pc_payment_intent_stripe, fecha
FROM albaranescli
WHERE observaciones LIKE '%Stripe%'
ORDER BY fecha DESC
LIMIT 3;"
```

## Información Actual del Sistema

### Credenciales Stripe (Configuradas y Actualizadas)

- ✅ **Secret Key**: `sk_live_51M7GDmH3wvr1u5BM...` (configurada)
- ✅ **Webhook Secret**: `whsec_e2R8UGm7NRbKJV4s...` (✅ ACTUALIZADO 2026-01-05)

### Endpoints Disponibles

| Endpoint | URL | Estado |
|----------|-----|--------|
| **Webhook Albaranes** | https://erp.solwed.es/StripeAlbaranWebhook | ✅ Activo |
| **Webhook SolwedES** | https://erp.solwed.es/StripeWebhook | ✅ Activo (para facturas) |

## Eventos Soportados

### StripeAlbaranWebhook

| Evento | Acción | Estado |
|--------|--------|--------|
| `invoice.paid` | Crea albarán marcado como pagado | ✅ Implementado |
| `invoice.payment_failed` | Solo loguea el fallo | ✅ Implementado |

### Validaciones de Seguridad

✅ **Verificación de firma**: El webhook verifica que las peticiones vengan de Stripe usando el `webhook_secret`

✅ **Prevención de duplicados**: Se verifica el `payment_intent` para evitar crear albaranes duplicados

✅ **Logs completos**: Todos los eventos se registran en `/var/www/erp.solwed.es/MyFiles/Logs/stripe_albaranes.log`

## Troubleshooting

### El webhook no responde (Error 404)

1. Verificar que el plugin está activado:
```bash
ssh ubuntu@54.37.230.9
ls -la /var/www/erp.solwed.es/Plugins/StripeAlbaranes/
```

2. Verificar la URL exacta (case-sensitive):
```
https://erp.solwed.es/StripeAlbaranWebhook
```

### Error de firma inválida

1. Verificar que el webhook secret está actualizado en la BD
2. Copiar el secret desde Stripe Dashboard → Webhooks → [tu endpoint] → Signing secret
3. Actualizar en: Admin → Configuración Stripe

### El albarán se crea pero no aparece como pagado

Verificar que estos campos estén en `true`:
```bash
sudo mysql facturascripts -e "
SELECT codigo, pc_paid, pc_created, pc_payment_intent_stripe
FROM albaranescli
WHERE codigo = 'CODIGO_ALBARAN';"
```

Deberían mostrar:
- `pc_paid = 1`
- `pc_created = 1`
- `pc_payment_intent_stripe = pi_...`

## Resumen de Configuración

### ✅ CONFIGURACIÓN COMPLETADA AUTOMÁTICAMENTE

**Fecha:** 2026-01-05
**Método:** Stripe REST API

1. ✅ Webhook creado en Stripe: `we_1SmLO6H3wvr1u5BM5VyYQkee`
2. ✅ URL del webhook: `https://erp.solwed.es/StripeAlbaranWebhook`
3. ✅ Eventos configurados: `invoice.paid`, `invoice.payment_failed`
4. ✅ Webhook secret actualizado en BD: `whsec_e2R8UGm7NRbKJV4s...`
5. ✅ Endpoint respondiendo correctamente
6. ✅ Verificación de firma activa

### Estado del Sistema

| Componente | Estado |
|------------|--------|
| Plugin StripeAlbaranes | ✅ Activo |
| Webhook en Stripe | ✅ Enabled |
| Secret Key configurada | ✅ OK |
| Webhook Secret configurado | ✅ OK |
| Endpoint accesible | ✅ OK |
| Campos BD (`pc_paid`, etc.) | ✅ OK |

### Requisitos para que Funcione

1. ✅ Cliente debe existir en FacturaScripts
2. ✅ El email del contacto en FS debe coincidir con el email del customer en Stripe
3. ✅ El evento debe ser de tipo suscripción (`invoice.subscription` no vacío)

### Para Probar con Evento Real

Desde Stripe Dashboard:
1. Ve a: https://dashboard.stripe.com/webhooks/we_1SmLO6H3wvr1u5BM5VyYQkee
2. Tab "Testing" → "Send test webhook"
3. Selecciona evento: `invoice.paid`
4. Modifica el JSON para incluir un email válido (ej: `ivan@solwed.es`)
5. Click "Send test webhook"

---

**Acceso a Stripe Dashboard:**
- URL: https://dashboard.stripe.com/
- Login: https://billing.stripe.com/p/login/3cs7utgjNeEweB29AA
- Webhook ID: `we_1SmLO6H3wvr1u5BM5VyYQkee`

**Comandos Útiles:**

```bash
# Ver webhook en Stripe
curl -s https://api.stripe.com/v1/webhook_endpoints/we_1SmLO6H3wvr1u5BM5VyYQkee \
  -u "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:"

# Ver últimos albaranes creados
ssh ubuntu@54.37.230.9 "sudo mysql facturascripts -e \"
  SELECT codigo, nombrecliente, total, pc_paid, fecha
  FROM albaranescli
  WHERE observaciones LIKE '%Stripe%'
  ORDER BY fecha DESC
  LIMIT 5;
\""

# Ver logs del webhook
ssh ubuntu@54.37.230.9 "tail -50 /var/www/erp.solwed.es/MyFiles/Logs/stripe_albaranes.log"
```

✌️
