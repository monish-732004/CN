# NeuralQuiz — Anime Computer Networks Quiz Show

Real-time multiplayer quiz show for classroom Computer Networks events. 50 anime characters from 20+ iconic series, each with unique 3D animations. ₹100 cash prize support.

## Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 14 (App Router)** | Frontend + serverless API routes |
| **Pusher Channels** | Managed WebSocket real-time events |
| **Upstash Redis** | Serverless game state storage |
| **Three.js + @react-three/fiber** | 3D anime arena + character models |
| **Framer Motion** | UI animations + histogram bars |

## Quick Start

### 1. Clone and install

```bash
git clone <your-repo>
cd neuralquiz
npm install --legacy-peer-deps
```

### 2. Set up external services

**Pusher (free tier — 100 concurrent, 200k msg/day):**
1. Create account at [pusher.com](https://pusher.com)
2. Create a new Channels app
3. Copy App ID, Key, Secret, Cluster

**Upstash Redis (free tier):**
1. Create account at [upstash.com](https://upstash.com)
2. Create a new Redis database
3. Copy REST URL and REST Token

### 3. Configure environment

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
PUSHER_APP_ID=your_app_id
PUSHER_KEY=your_key
PUSHER_SECRET=your_secret
PUSHER_CLUSTER=ap2
NEXT_PUBLIC_PUSHER_KEY=your_key
NEXT_PUBLIC_PUSHER_CLUSTER=ap2

UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

TEACHER_SECRET=your-strong-password-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Running a Classroom Event

### Teacher Setup
1. Open `/teacher` on your laptop
2. Enter `TEACHER_SECRET` password
3. Click **CREATE NEW EVENT** — you get a 6-digit PIN
4. Open `/stage?eventId=XXX` on the projector (full screen)
5. Students scan QR or go to `your-url/join/PIN`

### During the Quiz
- **START QUIZ** — begins Q1 for all students simultaneously
- **CLOSE EARLY** — closes current question before timer expires  
- **REVEAL ANSWER** — shows histogram + correct answer + explanation
- **NEXT QUESTION →** — advances to next question
- **PAUSE / RESUME** — pause timer mid-question
- **END GAME** — force-ends and shows winner

### Student Flow
1. Go to the URL or scan QR code on projector
2. Enter the 6-digit PIN
3. Pick a nickname (2–20 chars, alphanumeric + spaces)
4. Pick from 50 anime characters — click to see 3D preview with unique animation
5. Wait in lobby until teacher starts
6. Answer A/B/C/D on their phone — first tap locks in
7. See histogram + personal correct/wrong feedback after each reveal
8. Final leaderboard + winner celebration at the end

## Deploy to Vercel

```bash
npm install -g vercel
vercel deploy
```

Set the same environment variables in Vercel dashboard under **Settings → Environment Variables**.

Change `NEXT_PUBLIC_APP_URL` to your Vercel URL: `https://your-app.vercel.app`

## Swapping in Real 3D Models (GLTF/GLB)

The characters currently use procedural geometry (capsule + sphere). To swap in real models:

1. Export your model as `.glb` with animation clips named: `idle`, `correct`, `incorrect`, `victory`
2. Place in `/public/models/` (e.g., `/public/models/naruto.glb`)
3. Update the character's component in `components/3d/Character.tsx`:

```tsx
// In Character.tsx, add GLTF loading support:
import { useGLTF } from '@react-three/drei'

// Inside the Character component:
const { scene, animations } = useGLTF(gltfUrl)
// Use useAnimations from drei to play clips
```

The `Character` component already accepts a `gltfUrl` prop — wire it up to your GLB path.

## Questions

All 15 Computer Networks questions are in `lib/questions.ts`. To customize:
- Edit question text, options, correct answer, and explanation
- Adjust `timeLimit` per question (seconds)
- `difficulty` affects the badge color shown to students

## Characters

All 50 characters are defined in `lib/characters.ts`. Each has:
- Unique `color`, `accentColor`, `eyeColor` for the 3D model
- `clickAction` — animation that plays when clicked on selection screen
- `gameActions` — descriptions for idle, thinking, correct, incorrect, victory states

## Project Structure

```
app/              Next.js App Router pages + API routes
components/3d/    Three.js components (Arena, Character, preview)
hooks/            React hooks (useSocket, useGameState, useTimer)
lib/              Core logic (redis, pusher, questions, characters, game services)
types/            TypeScript interfaces
```

## Notes

- Cash prize (₹100) is awarded by the event organizer — not handled digitally
- Winner is determined by: most correct answers → fastest average response time → earliest join time
- Supports reconnection: refresh mid-quiz and your score is restored
- WebGL failure shows graceful 2D fallback — quiz still works without 3D
- All 50 anime characters use original procedural models (no copyrighted assets)
