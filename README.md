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
- API:      http://localhost:3000

## Notas
- Saldo inicial: COP $500.000 (`mocks/db.json`).
- Con json-server no hay transacciones atómicas. En producción esto sería lógica de backend.
