# BTG Funds – Angular + JSON Server

Aplicación demo para manejo de fondos (FPV/FIC):

- Listado de fondos
- Suscripción con validación de monto mínimo y método de notificación (email/SMS)
- Cancelación de participación y actualización de saldo
- Historial de transacciones

## Stack

- Angular standalone + Angular Material
- RxJS (estado en servicios)
- Formularios reactivos
- json-server (API mock)

## Ejecutar

```bash
npm i
npm run dev
```

- Frontend: http://localhost:4200
- API: http://localhost:3000

## Notas

- Saldo inicial: COP $500.000 (`mocks/db.json`).
- Con json-server no hay transacciones atómicas. En producción esto sería lógica de backend.

# BTG Funds — Angular + JSON Server (WSL Ready)

Aplicación demo para manejo de fondos (FPV/FIC) para un usuario único con **saldo inicial COP $500.000**.

## Características

- **Listar fondos** con mínimo y categoría.
- **Suscribir** a un fondo si cumple monto mínimo y **seleccionar notificación** (email/SMS).
- **Cancelar participación** y **actualizar saldo**.
- **Historial** de transacciones (suscripciones/cancelaciones).
- **Validaciones** (mínimo requerido, saldo insuficiente) y **feedback visual**.
- **Estado** con servicios + RxJS (`BehaviorSubject`).
- **Angular standalone** + **Angular Material**, **ruteo**, **formularios reactivos**.
- **API mock** con `json-server`.
- Diseño **responsivo** y UX clara.

---

## Requisitos

- **Node.js ≥ 18** y **npm ≥ 9**
- **Angular CLI** (misma major del proyecto, por ej. 20):
  ```bash
  npm i -g @angular/cli@^20
  (Opcional) @angular/animations si quieres animaciones reales:
  npm i @angular/animations@^20
  Probado en WSL (Ubuntu). Funciona igual en Linux/macOS/Windows.
  ```

Instalación y ejecución

# 1) Instalar dependencias

npm i

# 2) Levantar mock API + app en paralelo

npm run dev

- Frontend: http://localhost:4200
- API mock: http://localhost:3000

# Scripts

{
"mock": "json-server --watch mocks/db.json --port 3000 --routes mocks/routes.json",
"web": "ng serve",
"dev": "concurrently -k npm:mock npm:web",
"start": "ng serve"
}

# API mock (json-server)

# Base URL: http://localhost:3000 (con routes.json -> también disponible como /api/\*)

# Recursos

- GET /funds
- GET /wallet → [{ "id": 1, "balance": 500000 }]
- GET/POST/PATCH/DELETE /positions
- GET/POST /transactions

-Archivo: mocks/db.json (datos iniciales de fondos y saldo).

# Configuración de entorno

- src/environments/environment.ts

export const environment = {
apiUrl: 'http://localhost:3000/api' // con routes.json; o 'http://localhost:3000' si no usas rutas
};

# Arquitectura (resumen)

- Standalone (sin NgModules): bootstrapApplication + app.config.ts.

# Rutas:

/funds (lista y acciones de suscripción/cancelación)
/history (tabla de transacciones)

# Servicios:

- WalletService (saldo) — BehaviorSubject
- FundsService (listar fondos)
- PositionsService (posición por fondo)
- TransactionsService (historial)
- InvestmentService (reglas de negocio y orquestación)

# Estructura:

src/
├─ app/
│ ├─ app.component.ts
│ ├─ app.routes.ts
│ ├─ app.config.ts
│ ├─ models/
│ ├─ services/
│ └─ features/
│ ├─ funds/
│ │ ├─ funds.page.ts
│ │ └─ subscription.dialog.ts
│ └─ history/
│ └─ history.page.ts
├─ environments/
│ └─ environment.ts
└─ main.ts
mocks/
├─ db.json
└─ routes.json

# Cómo probar (QA rápido)

Listar fondos: ver 5 tarjetas con mínimo y categoría.

Suscripción válida:
En un fondo, clic Suscribirme.
Ingresar monto ≥ mínimo y seleccionar email o sms.
Debe restar del saldo, crear/actualizar posición y registrar transacción.

Suscripción < mínimo: muestra error.

Saldo insuficiente: muestra error.

Cancelar en un fondo con posición:
Debe eliminar la posición, acreditar saldo y registrar transacción.

Historial: ver suscripciones/cancelaciones, ordenado por fecha desc.

# Detalles técnicos clave

app.config.ts (providers raíz)

import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';
import { provideNoopAnimations } from '@angular/platform-browser/animations'; // usa provideAnimations() si instalaste @angular/animations
import { routes } from './app.routes';

// Carga global de locale para SSR/CSR
import '@angular/common/locales/global/es-CO';

export const appConfig: ApplicationConfig = {
providers: [
provideRouter(routes),
provideHttpClient(withInterceptorsFromDi(), withFetch()),
provideNoopAnimations(),
{ provide: LOCALE_ID, useValue: 'es-CO' }
]
};

main.ts (mínimo)
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
.catch(err => console.error(err));

- Por qué así ?:

withFetch() mejora compatibilidad y performance en SSR/dev server.

@angular/common/locales/global/es-CO + LOCALE_ID corrigen el formato de moneda/fecha.

provideNoopAnimations() evita instalar @angular/animations; si deseas transiciones, instala el paquete y usa provideAnimations().

# Problemas comunes (y solución)

Error de comillas en WSL con concurrently
Usamos dev: "concurrently -k npm:mock npm:web" (sin comillas en subcomandos).

@angular/animations no encontrado
Instala @angular/animations@^20 o usa provideNoopAnimations().

Missing locale data 'es-CO'
Asegúrate de importar @angular/common/locales/global/es-CO y setear { provide: LOCALE_ID, useValue: 'es-CO' }.

Tests (opcionales)
Ejecuta:

ng test
Ejemplo incluido: validación de monto mínimo en InvestmentService.

# Notas

Transacciones atómicas: al usar json-server no hay transacciones reales; en producción esto lo manejaría el backend.

Formato COP: currency usa es-CO (símbolo y miles .).

Licencia
Uso educativo/demostrativo. Adáptalo libremente para tu evaluación.
