# Lista de Regalos — Boda

Sitio de lista de regalos con sincronización en tiempo real para los invitados.

## Stack
- Vite + React 18
- Tailwind CSS
- Firebase Firestore (reservaciones en tiempo real)
- Listo para desplegar en Vercel

## Setup local

```bash
npm install
cp .env.example .env
# Llena las variables de Firebase
npm run dev
```

## 1. Configurar Firebase (5 min)

1. Entra a https://console.firebase.google.com → **Add project** → ponle el nombre que quieras (ej. `boda-registry`).
2. En el proyecto, click el ícono web `</>` → **Register app** → copia el objeto `firebaseConfig`.
3. Pega los valores en `.env`:

```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=boda-registry.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=boda-registry
VITE_FIREBASE_STORAGE_BUCKET=boda-registry.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

4. **Build → Firestore Database → Create database** → Production mode → ubicación `us-central` (o la más cercana).
5. **Rules** → reemplaza con esto y publica:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /reservations/{doc} {
      allow read: if true;
      allow create: if request.resource.data.keys().hasOnly(['itemId', 'name', 'qty', 'ts'])
                    && request.resource.data.name is string
                    && request.resource.data.name.size() > 0
                    && request.resource.data.name.size() < 100
                    && request.resource.data.qty is int
                    && request.resource.data.qty > 0
                    && request.resource.data.qty <= 20;
      allow update, delete: if false;
    }
  }
}
```

Estas reglas permiten que cualquiera con el link pueda leer y crear reservaciones (lo que necesitas) pero no editarlas ni borrarlas. Si después de la boda quieres borrar todo, hazlo desde la consola.

## 2. Desplegar en Vercel

1. Sube el código a un repo de GitHub.
2. https://vercel.com/new → importa el repo.
3. **Framework Preset:** Vite (auto-detectado).
4. **Environment Variables:** pega las 6 variables `VITE_FIREBASE_*` del `.env`.
5. **Deploy**.

Vercel te dará una URL `https://boda-registry.vercel.app` que puedes compartir con los invitados.

### Dominio custom (opcional)

Si compraste un dominio para la boda (ej. `israelyelena.com`), en Vercel → **Settings → Domains** agrega `regalos.israelyelena.com` o el subdominio que quieras. Vercel te dará el registro DNS para apuntar desde Cloudflare.

## Editar la lista

`src/data.js` tiene los 25 items. Para agregar/quitar productos:

```js
{
  id: "SKU_DE_NOVEX",
  name: "Nombre del producto",
  price: 2500,           // colones
  qty: 1,                // cuántas unidades necesitas
  cat: "cocina",         // vajilla | mesa | cocina | limpieza | jardin
  img: img("SKU"),       // se genera automático
  url: "https://novex.cr/producto/..."
}
```

Si cambias categorías, actualiza también `CATEGORIES` en el mismo archivo.

## Las imágenes

Vienen directo de `ferreteriavidri.com/images/items/thumb/{SKU}.jpg`. Si algún SKU no tiene imagen ahí, la tarjeta muestra un fallback con ícono. Para reemplazar con imagen propia, sustituye el `img: img("SKU")` por una URL directa.

## Después de la boda

- Exporta las reservaciones desde Firestore Console → colección `reservations` → exportar.
- O agrega un endpoint admin si necesitas un dashboard.
