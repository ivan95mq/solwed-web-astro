# CLAUDE.md

Este archivo proporciona orientación a Claude Code (claude.ai/code) cuando trabaja con código en este repositorio.

## Comandos

```bash
pnpm dev      # Inicia servidor de desarrollo en localhost:4321
pnpm build    # Compila el sitio de producción en ./dist/
pnpm preview  # Previsualiza la compilación de producción localmente
```

## Arquitectura

Este es un sitio estático de Astro (output: 'static') para Solwed, un servicio español de web/ERP/CRM. El sitio usa React para componentes interactivos y Tailwind CSS v4 para estilos.

### Directorios Principales

- `src/pages/` - Páginas Astro (enrutamiento basado en archivos)
- `src/layouts/` - Layouts de página (Layout.astro es la base, MarketingLayout.astro añade header/footer, LegalLayout.astro para páginas legales)
- `src/islands/` - Componentes React con interactividad del lado del cliente (usar directiva `client:load`)
- `src/components/` - Componentes Astro estáticos
- `src/lib/` - Funciones de utilidad y datos (catalog.ts, projects.ts)
- `src/styles/global.css` - Estilos globales, propiedades CSS personalizadas y configuración del tema Tailwind

### Sistema de Estilos

- Tailwind CSS v4 configurado via plugin `@tailwindcss/vite`
- El tema usa espacio de color OKLCH con propiedades CSS personalizadas definidas en `global.css`
- Color de marca: `--solwed-yellow` (oklch(0.9087 0.1944 106.84))
- Dos familias de fuentes: Inter (cuerpo) y Geist (encabezados)
- Usar utilidad `cn()` de `src/lib/utils.ts` para combinar clases condicionalmente (clsx + tailwind-merge)

### Integración con React

Los componentes React en `src/islands/` requieren la directiva `client:load` cuando se usan en plantillas Astro para habilitar la hidratación del lado del cliente. TypeScript está configurado con `jsx: "react-jsx"`.

## Entornos

| Entorno | URL | Carpeta |
|---------|-----|---------|
| **Desarrollo** | dev.solwed.es | `/var/www/dev.solwed.es` |
| **Producción** | solwed.es | `/var/www/solwed.es` |

## Deploy a Producción

```bash
# 1. Build del sitio
pnpm build

# 2. Sync a producción
rsync -av --delete ./dist/ /var/www/solwed.es/
```

## Reglas de Trabajo

- **NO ejecutar `pnpm build`** a menos que el usuario lo pida explícitamente. Este es un entorno de desarrollo.

## Solución de Problemas

### Errores de Hidratación en React Islands

Si el navegador muestra errores como:
```
[astro-island] Error hydrating /src/islands/Header.tsx TypeError: Failed to fetch dynamically imported module
/src/islands/StarHero.tsx TypeError: Failed to fetch dynamically imported module
```

**Causa**: Múltiples instancias del servidor de desarrollo corriendo simultáneamente en conflicto.

**Solución**:
1. Matar todos los procesos de Astro:
   ```bash
   pkill -f "astro dev" && pkill -f "astro preview"
   ```
2. Verificar que no quedan procesos:
   ```bash
   ps aux | grep -E "astro|node.*vite" | grep -v grep
   ```
3. Reiniciar el servidor limpiamente:
   ```bash
   pnpm dev --host 0.0.0.0 --port 4321
   ```
4. Hacer hard refresh en el navegador (Ctrl+Shift+R)

**Prevención**: Antes de iniciar el servidor de desarrollo, verificar que no hay instancias previas corriendo.
