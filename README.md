# Recipe Metric Converter.

This is a simple metric converter that converts from imperial to metric system. Simply take a photo and the app will convert the imperial units to metric units.
It is a PWA so you can install it on your phone and use it offline.
Idea for this project was basically me scratching my own itch. I have cookbooks @home that use the imperial metric system and wanted to cook them.
The app fully runs on the client side, so no data is sent or stored on a server. `tesseract.js` runs in an WASM container.
Project is deployed on [Vercel](https://vercel.com/docs/storage/vercel-blob).


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

1. Clone the repository
2. Run `npm install` to install all the dependencies
3. Run `npm run dev` to start the app

## Built With

- Next.js
- tesseract.js
- shadcn-ui
- tailwind.css
- next-pwa

## Roadmap
- Save to recipes to local storage
- Bidirectional Metric Conversion
- Convert from NextJs to plain React
