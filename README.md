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

I'm building this project purely for learning purpose. The problems solved are mostly made up. The technologies chosen may not be the most suitable for this project. I intentionally chose new technologies just for the sake of learning them. I chose Next.js because I want to learn about the new React Server Components. I chose Convex and Liveblocks because I want the real-time update feature for this app. In this project, I experimented with LLM for generating some code which ends up not being used, but gave some ideas for the UI design.

## How to run locally

- Clone this repository
- Run convex database (`npx convex dev`)
- Run Next.js (`npm run dev`)
