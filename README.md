This project is a web service for restaurant ordering system.
The demo app is deployed at https://ros-pi.vercel.app/.
The intended flow for using this app is through scanning a QR code given by welcome staff at a restaurant. But for the demo, you can manually create new tab by pressing the (+) button at the restaurant page.

## Main Features

- Real-time collaboration for ordering items
- Fair split payments calculation

## Technologies

- TypeScript 5.9
- Node.js v24
- Next.js 16
- Tailwind v4
- Shadcn
- Convex
- Liveblocks
- Clerk

## Motivation

I'm building this project purely for learning purpose. The problems solved are mostly made up. The technologies chosen may not be the most suitable for this project.

## How to run locally

- Clone this repository
- Run convex database (`npx convex dev`)
- Run Next.js (`npm run dev`)
