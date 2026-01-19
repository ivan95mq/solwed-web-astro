# SOLWED - Credenciales
Servidor: solwed.es (54.37.230.9)
Actualizado: 23/12/2025

---

## SSH
```
Host: 54.37.230.9
Usuario: ubuntu
Password: Solwed8818
Clave SSH: P:/APPs/Claude/.ssh/id_rsa
```

---

## Email (@solwed.es)
Config: `/etc/dovecot/passwd`

| Email | Password |
|-------|----------|
| admin@solwed.es | EIcOTSPeQEkto6qt |
| hola@solwed.es | fEzb4JW3hIFhn3nU |
| info@solwed.es | pJOiH0FPiglcHB+2 |
| desarrollo@solwed.es | ykAOOJPXSGeRw5we |
| facturas@solwed.es | x32PUVwblRrUWsvN |
| ivan@solwed.es | Solwed8818 |
| joseferran@solwed.es | GZNTeJtkPYGBBqNI |
| laura@solwed.es | TuoUQmMjjp0BNGBb |
| mariajose@solwed.es | YucRCFHmtgSkXFmq |
| noreply@solwed.es | NpBdijNOJ1HIMCsn |
| soporte@solwed.es | mgqnMCRrZmawr+YD |
| ventas@solwed.es | 6gLCViV+DCSF75LF |

**Webmail:** https://webmail.solwed.es
**CalDAV:** https://adminmail.solwed.es/dav.php/

### Configuracion Servidor de Correo

| Parametro | Valor |
|-----------|-------|
| **Servidor entrante (IMAP)** | mail.solwed.es |
| **Puerto IMAP SSL** | 993 |
| **Servidor entrante (POP3)** | mail.solwed.es |
| **Puerto POP3 SSL** | 995 |
| **Servidor saliente (SMTP)** | mail.solwed.es |
| **Puerto SMTP TLS** | 587 |
| **Puerto SMTP SSL** | 465 |
| **Seguridad** | SSL/TLS |
| **Autenticacion** | Contrasena normal |

**IMPORTANTE:** El nombre de usuario es SIEMPRE el email completo (ej: admin@solwed.es)

---

### Configuracion en Outlook (Windows/Mac)

1. Abrir Outlook - Archivo - Agregar cuenta
2. Configuracion avanzada - Configurar manualmente
3. Seleccionar IMAP o POP3

**Servidor entrante:**
```
Servidor: mail.solwed.es
Puerto: 993 (IMAP) o 995 (POP3)
Cifrado: SSL/TLS
```

**Servidor saliente:**
```
Servidor: mail.solwed.es
Puerto: 587
Cifrado: STARTTLS
Autenticacion: Si (mismas credenciales)
```

**Credenciales:**
```
Usuario: tu_email@solwed.es (email completo)
Contrasena: (ver tabla de passwords arriba)
```

---

### Configuracion en Gmail (Android/Web)

1. Gmail - Configuracion - Anadir cuenta - Otra
2. Introducir el email completo
3. Seleccionar Personal (IMAP)

```
Servidor IMAP: mail.solwed.es
Puerto: 993
Tipo seguridad: SSL/TLS

Servidor SMTP: mail.solwed.es
Puerto: 587
Tipo seguridad: STARTTLS
```

---

### Configuracion en iPhone/iPad (Mail)

1. Ajustes - Correo - Cuentas - Anadir cuenta - Otra
2. Seleccionar Anadir cuenta de correo

**Datos:**
```
Nombre: (tu nombre)
Email: usuario@solwed.es
Contrasena: (ver tabla arriba)
Descripcion: SOLWED
```

**Servidor entrante:**
```
Nombre de host: mail.solwed.es
Nombre de usuario: usuario@solwed.es (email completo)
Contrasena: (misma)
```

**Servidor saliente:**
```
Nombre de host: mail.solwed.es
Nombre de usuario: usuario@solwed.es (email completo)
Contrasena: (misma)
```

Despues ir a la cuenta - Avanzado:
- Puerto IMAP: 993 con SSL
- Puerto SMTP: 587 con TLS

---

### Configuracion en Thunderbird

1. Archivo - Nuevo - Cuenta de correo existente
2. Introducir nombre, email y contrasena
3. Click en Configurar manualmente

```
ENTRANTE:
Protocolo: IMAP
Servidor: mail.solwed.es
Puerto: 993
SSL: SSL/TLS
Autenticacion: Contrasena normal

SALIENTE:
Servidor: mail.solwed.es
Puerto: 587
SSL: STARTTLS
Autenticacion: Contrasena normal
```

---

### Configuracion en Android (Email nativo)

1. Email - Anadir cuenta - Otra
2. Introducir email y contrasena
3. Seleccionar IMAP

```
Servidor IMAP: mail.solwed.es
Puerto: 993
Tipo seguridad: SSL/TLS

Servidor SMTP: mail.solwed.es
Puerto: 587
Tipo seguridad: TLS
```

---

### Solucion de Problemas

| Error | Solucion |
|-------|----------|
| Certificado no valido | El certificado es de solwed.es - aceptar/confiar |
| No se puede conectar | Verificar puerto y tipo de seguridad |
| Autenticacion fallida | Usar email COMPLETO como usuario |
| Tiempo de espera agotado | Probar puerto 465 en lugar de 587 |

---

## ERP (erp.solwed.es)
URL: https://erp.solwed.es

### Base de datos
```
Host: localhost
DB: facturascripts
Usuario: facturascripts
Password: fs_secure_password_2025
```

### Usuarios Admin
| Usuario | Email | Admin |
|---------|-------|-------|
| admin | ivan@solwed.es | Si |
| IvanMoreno | ivan@solwed.es | Si |
| JoseFerran | soporte@solwed.es | Si |
| MariaJose | admin@solwed.es | Si |
| Jesus | desarrollo@solwed.es | Si |
| AlbertoOrtiz | alberto@rspubli.com | Si |
| AlbertoVera | breakingtown1988@gmail.com | Si |
| Blas | melendez16@educarex.es | Si |
| Chatbotsolwed | ferrangonzalezjose@gmail.com | Si |
| Encarna | fiscal@armultigestion.es | Si |
| Olga | olgamontero@segitemp.es | Si |
| OthmaneAffane | desarrollo@solwed.es | Si |

### Usuarios normales
Brayan, CarmenH, Irene, Juan, Juanma, Luz, MiguelAngel, Noelia, Onofre

---

## n8n (n8n.solwed.es)
URL: https://n8n.solwed.es

### Acceso Web
```
Email: ivan@solwed.es
Password: (configurado en primera instalacion)
```

### Base de datos PostgreSQL
```
Host: n8n-db (container)
Puerto: 5432
DB: n8n
Usuario: n8n
Password: n8n_secure_password_2025
```

### Docker
```bash
# Reiniciar
cd /opt/n8n && docker-compose restart

# Logs
docker logs n8n --tail 100 -f

# Backup DB
docker exec n8n-db pg_dump -U n8n n8n > backup.sql
```

---

## WordPress (solwed.es)
URL: https://solwed.es/wp-admin

### Base de datos
```
Host: localhost
DB: wordpress
Usuario: wordpress
Password: wp_secure_password_2025
Prefijo: XCaKo6cRCj_
```

### Usuarios principales
| Usuario | Email | Registro |
|---------|-------|----------|
| solwed | admin@solwed.es | 07/09/2021 |
| Ivan Moreno | ejemplo@solwed.es | 16/10/2022 |
| Jose Ferran Gonzalez | contacto@joseferran.com | 24/10/2022 |
| GonzaloV | gonzalo@solwed.es | 02/11/2023 |
| Aaron | aaron@solwed.es | 30/04/2024 |
| Cristian-Solwed | cristian@solwed.es | 19/11/2024 |
| Desarrollo | desarrollo@solwed.es | 10/04/2025 |

**Total usuarios:** 49

---

## MariaDB (servidor)
```
Host: localhost
Puerto: 3306
Version: 11.4.7
Root: (acceso via socket)
```

---

## Stripe

### Cuenta LIVE (SOLUTIONS WEBSITE DESIGN SLU)
```
Public Key: pk_live_51M7GDmH3wvr1u5BMyV42nudt6yNQvtk90s8pso35tK05kYxozzEAYupdzQKjA4QfVN9AFykOXvp6Fz0PVnX5SsOu004KtGWHIl
Secret Key: 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
Restricted Key: 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
Webhook Secret: whsec_juUdQa9ZdDhCbD1efbKo1OA6XNjZVSX8
```

### Cuenta TEST (Ivan Moreno Quiros)
```
Public Key: pk_test_51SRfenHRY1CPhXOduJwNjwHFMV8rxr0r0aKEWhTAgcBUm0AnUGJHqExjyECpdtpr7W5mkDzpQCXBvtoZ4JnGQ7Pi00bsYKpvGn
Secret Key: sk_test_51SRfenHRY1CPhXOd0H0yDUgo1bzkVuvPm0gqhRsaqE7ByqekAqwuvufV99KxsKBEy2XTb5ufVnjmWg24FaPXnqtX005uJ6OB08
```

### Customer Portal
```
URL: https://billing.stripe.com/p/login/3cs7utgjNeEweB29AA
Config ID: bpc_1OWLBNH3wvr1u5BM0rppQthO
```

---

## Notas
- SSL: Certbot automatico (Let's Encrypt)
- Firewall: UFW activo
- Fail2ban: Activo
- IP Whitelist: 92.176.44.44
- **Servicios y tarifas:** Ver `servicios.md`
