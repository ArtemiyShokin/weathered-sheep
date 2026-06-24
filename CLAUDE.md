# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev     # Start dev server at localhost:3000
npm run build   # Production build
npm run test    # Run Jest in watch mode
npm run lint    # ESLint (next/core-web-vitals)
```

Run a single test file:
```bash
npx jest path/to/test --watchAll=false
```

## Architecture

**Weathered Sheep** is a Next.js app where users create digital sheep that wander a 3D globe and produce weather-driven audio.

### State & Data Flow

`pages/_app.js` owns the sheep array (persisted to localStorage via `use-local-storage-state`). Each sheep has `{ id, name, position: [lat, lng], infoPosition, velocity: [latVel, lngVel], temperature, wind, humidity }`. CRUD handlers are passed down as props — there is no global store.

`pages/index.js` is the root UI: it renders the 3D canvas, the `InfoBox` panel, and modals (`AddSheepForm`, `DeletionPopup`).

### 3D Rendering

`components/3DWorld/` wraps a `@react-three/fiber` `Canvas` containing an orange sphere (Earth) and one `3DSheep` per sheep. `components/3DSheep/` loads `public/assets/models/DollySheep.glb` and:

- Converts `[lat, lng]` → Cartesian via `latLngToVector3()` in `utils/calculationFunctions/`
- Applies orientation from the velocity vector using quaternion rotation
- Drives the walk animation from global `sheepMovementActivated` state via `useFrame`

Position and velocity are stored in `useRef` inside `3DSheep` to avoid stale-closure issues in the animation loop.

### Sheep Movement

`utils/animateSheep/animateSheepUpdate.js` runs inside `useFrame`. It samples 3D simplex noise seeded by the sheep's initial position to produce smooth wandering. Velocity is clamped to ±0.05; latitude clamps to [−90, 90]; longitude wraps at ±180.

Each sheep alternates between **wandering** and **stopped** states. When stopped, `3DSheep` fetches weather via the API proxy and calls `sheepSound()`.

### Weather → Audio

`/api/open-meteo` proxies Open-Meteo to avoid CORS. Returns `temperature_2m`, `relative_humidity_2m`, `wind_speed_10m`.

`utils/sheepSound/` builds a Tone.js effects chain on each fetch:
- `FeedbackDelay` — delay time set by normalized humidity
- `BitCrusher` — bit depth driven by temperature (via `convertTo16bitRange`)
- `PitchShift` — semitones driven by temperature (via `normalizeForSemitones`)

### Styling

All component styles use `styled-components`. Global CSS custom properties (colors, font families) are defined in `styles/styles.js`. SVG imports are handled by `@svgr/webpack` (configured in `next.config.js`) and become React components by default; append `?url` to get the raw URL.

### Dormant Features

The Leaflet `Map` component (`components/Map/`) is fully implemented but commented out in `index.js`.
