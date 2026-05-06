# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Mobile**: Expo Router + React Native, with local persistence via AsyncStorage

## Current Product

- **ClinicCare Mobile** (`artifacts/mobile`) is an Expo mobile MVP for hospital/clinic operations.
- Core screens: Today dashboard, appointment booking, reception call intake, patient records, and staff/analytics.
- UI direction updated to be simpler and clearer for company submission: blue-and-white healthcare palette, lighter cards, direct page titles, and reduced visual complexity.
- Latest update added clinic contact number `7416749757`, role-based demo login for Admin/Patient/Doctor, reference-style tabs (Home, Doctors, Appointments, Calls, Profile), AI symptom checker, doctor search, and call-to-appointment workflow.
- The first build is frontend-first and stores appointment/call updates locally with AsyncStorage. Real call recording, telephony, payments, insurance, video consultation, wearable sync, biometric login, and compliance-grade backend services are future production integrations.

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
