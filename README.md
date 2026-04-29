# ✨ Wishlist

Tu lista de deseos personal y compartible. Guarda, organiza, prioriza y comparte todo lo que quieres en un solo lugar — con un diseño romántico en tonos pastel y modo oscuro.

## Funcionalidades

- 🔐 **Autenticación completa** — Registro, login y recuperación de contraseña por email
- 📝 **Gestión de deseos** — Título, descripción, precio, hasta 3 imágenes y 3 URLs por deseo
- ⭐ **Sistema de prioridad** — Marca hasta 5 deseos como prioritarios para verlos primero
- 🏷️ **Etiquetas personalizadas** — Crea y asigna hasta 4 etiquetas por deseo
- 🔍 **Filtros avanzados** — Búsqueda por texto, etiquetas, prioridad y rango de fechas
- 🌐 **Compartir públicamente** — URL única `/u/<nickname>` accesible sin registro
- 🌗 **Modo claro y oscuro** — Paleta romántica con rosa, lavanda y plum
- 📱 **Diseño responsive** — Optimizado para móvil y desktop
- 🖼️ **Lightbox de imágenes** — Vista detallada con un click
- ✅ **Marcar como cumplido** — Celebra los deseos que conseguiste

## Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router + Turbopack)
- **UI**: [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) sobre [@base-ui/react](https://base-ui.com/)
- **Base de datos**: PostgreSQL con [Prisma 7](https://www.prisma.io/)
- **Autenticación**: [NextAuth v5](https://authjs.dev/)
- **Formularios y validación**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Estado global**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Imágenes**: [Cloudinary](https://cloudinary.com/)
- **Email**: [Nodemailer](https://nodemailer.com/)
- **Tipografía**: [Nunito](https://fonts.google.com/specimen/Nunito)

## Setup local

### Requisitos

- Node.js 20+
- PostgreSQL (local, [Neon](https://neon.tech), [Supabase](https://supabase.com), etc.)
- Cuenta gratuita en [Cloudinary](https://cloudinary.com) (para subir imágenes)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/ccceronr/wishlist.git
cd wishlist

# Instalar dependencias
npm install

# Configurar variables de entorno (ver sección siguiente)
cp .env.local.example .env.local

# Aplicar schema y generar cliente Prisma
npx prisma db push
npx prisma generate

# Sembrar etiquetas por defecto
npx prisma db seed

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Variables de entorno

Crea un archivo `.env.local` con:

```env
# Base de datos PostgreSQL
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# NextAuth (genera con: openssl rand -base64 32)
AUTH_SECRET="..."
NEXTAUTH_SECRET="..."

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="..."

# Email (opcional — si no se configura, los links de recuperación se imprimen en consola)
EMAIL_USER="tu-correo@gmail.com"
EMAIL_PASSWORD="contraseña-de-aplicación"
EMAIL_FROM="Wishlist <tu-correo@gmail.com>"
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con Turbopack |
| `npm run build` | Build de producción (regenera Prisma + Next build) |
| `npm run start` | Servidor de producción |
| `npm run lint` | Linter |

## Deploy en Vercel

1. Conecta tu repositorio en [Vercel](https://vercel.com/)
2. Configura las mismas variables de entorno definidas en tu `.env.local`
3. El script de build (`prisma generate && next build`) genera el cliente Prisma automáticamente

## Estructura del proyecto

```
src/
├── app/                  # Rutas (App Router)
│   ├── api/              # Endpoints REST
│   ├── dashboard/        # Panel principal autenticado
│   ├── u/[nickname]/     # Wishlist pública
│   ├── login/
│   ├── register/
│   ├── forgot-password/
│   └── reset-password/
├── components/
│   ├── ui/               # Componentes base (shadcn / base-ui)
│   ├── wishes/           # Cards, modales y filtros de deseos
│   └── layout/           # Sidebar y elementos compartidos
├── lib/                  # Utilidades, validaciones, cliente Prisma
├── stores/               # Stores de Zustand
└── types/                # Tipos TypeScript
```

## Licencia

MIT
