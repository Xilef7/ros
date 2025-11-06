# Pages

## Home (`/`)

The landing page.
If the user is logged in, redirect to `Visited Tabs`.
If the user is not logged in, stay in this page.
Show a big button that says `Scan QR`.
Below that, show 2 small buttons: `Sign Up` and `Login`.

## Visited Tabs (`/visited`)

A page for showing visited tabs.
At the bottom, there's a navbar with these 2 options: `Visited` and `Find Restaurants`.
In the middle of the navbar, show a emphasized button that says `Scan QR`

## Find Restaurants (`/restaurants`)

A page for finding restaurants.

## Scanner (`/scanner`)

A page for scanning QR code.
This page will ask permission to use the camera.
The QR code is a URL to the `Tab` page.

## Tab (`tabs/[id]`)

A page for showing tab details: total price, created at, and orders.
This page has a button to close the tab.
This page has a link to the `Tab Menu` page.
If the user hasn't ordered anything, redirect to `Tab Menu` page.
The current order is rendered differently that other orders.
If the current order is empty, show `Order More` button
If clicked, the app will move to the `Current Order` page.

## Current Order (`tabs/[id]/orders/current`)

A page for checking the current order before sending it to the kitchen.

## Tab Menu (`tabs/[id]/menu`)

A page for showing menu items.
A user can create new order item from here.
If the menu item can be customized, the page will move to the customization page.
If not, the menu item quantity will be incremented.
The page has a floating button for checking the current order.

## Tab Menu Customization (`tabs/[tabId]/menu/[menuItemId])

A page for creating customized order item.

## Order Item Customization (`tabs/[tabId]/orders/current/items/[orderItemId])

A page for updating existing order item.

## Run locally / check errors

1. Install dependencies:
   - npm install

2. Start dev server:
   - npm run dev

3. Type-check only:
   - npm run type-check

4. Lint:
   - npm run lint

Requirements:
- Node.js >= 24
- After npm install, run the commands above to surface TypeScript / ESLint errors.
