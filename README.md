# YATRIQ — Your World. Your Journey. Powered by AI.

A responsive, front-end travel planner demo with India itineraries and a separate country-trips explorer for 39 countries.

## Run it
1. Extract the ZIP.
2. Open `yatriq-multicity/index.html` in Chrome, Edge, or Firefox.
3. Internet access is recommended for destination photos, Google Maps, fonts, and the demo QR image.

No package installation or build step is required.

## Features
- Updated YATRIQ branding with a forest-green, ivory, and champagne design system.
- Separate **Country trips** section for Japan, France, Italy, Switzerland, UAE, Thailand, Indonesia, Maldives, Singapore, USA, UK, Australia, New Zealand, Canada, Nepal, Sri Lanka, Vietnam, Spain, Greece, Germany, South Korea, China, Malaysia, Turkey, Egypt, South Africa, Norway, Iceland, Portugal, Netherlands, Austria, Sweden, Finland, Brazil, Mexico, Cambodia, Philippines, Mauritius, and Qatar.
- Country plans respond to budget, trip length, and traveller count, and offer budget, comfort, and premium stay choices.
- Existing India city itinerary planner, day-wise schedules, destination maps, selected-place maps, and hotel suggestions retained.
- New **Multiple-city tour** option under “Where are you headed?”: choose 2–10 destination cities plus a starting city, require at least 6 days (and enough days to visit every city), and see a day-wise route, indicative intercity ticket estimates, a city map, and a tourist-place map.
- Multi-city itineraries avoid duplicate attraction names and use a slower pace on long trips (one main attraction per day for trips of 11+ days; up to two on shorter multi-city trips).
- Estimated outbound and return bus/train costs for India plans, and indicative round-trip flight estimates for international plans.
- Login details modal with name, email, phone, passport image/PDF and optional visa approval image/PDF selection.
- Select a suggested hotel and open a clearly labelled simulated checkout with a demo QR code.
- Responsive layout for mobile, tablet, and desktop.

## Important demo limitations
- This is a **front-end demo**, not a production travel-booking system. It does not authenticate accounts, upload documents, verify visas, reserve hotels, access live transport fares, or process real payments.
- Never upload real passport or visa documents to a public demo. The file controls only select local files; this version does not transmit them to a server.
- Fares, hotel costs, and itinerary estimates are illustrative and may be inaccurate. Confirm official visa requirements, live ticket prices, availability, taxes, and safety information before travelling.
- The QR code represents a sample booking reference only. No money is collected and no booking is confirmed.
- For production, add secure server-side authentication, encrypted document storage with explicit consent, a privacy policy, live transport/hotel APIs, and a certified payment provider in a secure backend.


## YATRIQ 2.0 view and demo flow

- The landing page is a dedicated Taj Mahal hero screen. Select **Plan my trip** and choose National or International.
- **National trips** and **Country trips** are separate views, not sections revealed by scrolling through one long page.
- The Login details form changes by trip type: national demo profiles ask for a fictional 12-digit Aadhaar number; international demo profiles ask for passport and visa sample files.
- Saving a demo profile opens the corresponding national or international planning agent.
- Checkout asks for a demo UPI ID or test card number before generating a QR. Never enter real identity or payment information. QR codes and payment confirmations are simulations only.
- Run by opening `index.html` in a modern browser. Internet is needed for remote photos, maps, and the sample QR generator.

## YATRIQ 2.1 — image resilience and attraction-led budgets

- Added image error fallbacks for international country cards, featured Indian cities, and itinerary attraction photos. If an individual remote image URL fails, the card loads a backup landscape image rather than leaving an empty image box.
- Updated the requested Australia, New Zealand, Canada, Sri Lanka, Egypt and Cambodia country-card image choices, plus Kochi and Mysuru featured-city image choices.
- Reworked country itineraries to use named, country-specific landmarks, museums, monuments, nature reserves and bookable experiences rather than generic street roaming.
- Daily attraction count now follows the available budget per traveller compared with the destination's indicative trip cost: budget-first = 1 main attraction/day, balanced = 2, comfort = 3, premium = up to 4 where practical.
- Added a warning when estimated return flights may consume a large part of the total budget. All prices remain illustrative estimates, not live availability or quotes.


## YATRIQ 3.0 — explainable recommendation engine

- Added a transparent recommendation layer that calculates budget per traveller and per day, applies a destination-cost planning index, and recommends a practical attraction pace.
- Shows an explicit category-by-category budget envelope (travel, accommodation, food, local transport, attractions and contingency) so a reviewer can follow the calculation.
- National and international flows show why the recommendation was made and state the prototype's limits.
- Added a local SVG destination illustration fallback when remote photo hosts fail, so image cards do not remain blank. The fallback is illustrative artwork, not a photograph.
- This remains a front-end student prototype using curated attraction data and explainable rules. It is not a trained ML model or live AI API integration. Live fares, hotel availability, ticket availability, identity verification and payments are not connected.

### Demo checklist for evaluators
1. Start on the landing page and choose **Plan my trip**.
2. Demonstrate a National trip with a low budget, then increase the budget and show the explanation and attraction pace.
3. Open Country trips separately; select a country and compare a low versus high budget.
4. Point to the budget formula and explain that the category percentages are planning envelopes rather than live quotes.
5. Demonstrate hotel selection and clearly identify the QR/payment as simulated.
6. Do not use real Aadhaar, passport, visa or payment data in this demo.


## Open YATRIQ on a phone

The site is responsive and can be opened on Android or iPhone. It is a static website, so the simplest option is to host the whole folder and open its URL on your phone.

### Quick public preview with Netlify Drop
1. Extract `yatriq_mobile_upgrade.zip` on your computer.
2. Open <https://app.netlify.com/drop> in a browser and sign in if prompted.
3. Drag the extracted folder containing `index.html`, `script.js`, `style.css`, and `agent-engine.js` into the drop area. If the uploader rejects the folder, zip the folder contents and use the upload option it provides.
4. Netlify gives you a website URL. Open that URL on your phone, or send it to yourself.
5. Keep the site files together. Do not upload only `index.html`, because the JavaScript and CSS are required.

### Test on your phone over the same Wi-Fi (local preview)
1. On the computer, open a terminal in the extracted website folder.
2. Run `python -m http.server 8000`.
3. Find your computer's local IPv4 address in your network settings.
4. On your phone, connected to the same Wi-Fi, open `http://COMPUTER-IP:8000` (replace `COMPUTER-IP` with that address).
5. This local address normally works only while the server is running and both devices are on the same network.

Maps and external images require an internet connection. Trip prices are estimates, not live quotes or bookings. Multi-city bus/train ticket amounts use a simple illustrative heuristic and are not live route fares.


## Review section demo
- Four separate review sets appear for the home page, National trips, Country trips, and Multi-tour planner.
- The preloaded 3–5 star reviews are illustrative demo text, not verified customer testimonials. The displayed overall demo rating is 4.5/5.
- The first visual in the section uses `assets/yatriq-logo.png`.
- Visitors can write reviews; this front-end demo stores submitted reviews in that browser's local storage only. Reviews are not shared between devices or sent to a server.

## Backend option
This ZIP currently has a **front-end only** setup (HTML, CSS and JavaScript). A backend can be added using **Node.js + Express** with a **PostgreSQL or MySQL database (DBMS)** to store user accounts and submitted reviews centrally, validate ratings, and provide moderation/admin controls. The backend would typically live in a separate `server/` folder with files such as `server.js`, `db.js`, and `.env` (for secrets; never publish it).


## YATRIQ map usability and interaction polish

- Added clear **Road map**, **Satellite**, and **3D in Google Maps** controls to national city/place maps, international trip maps, and multi-city maps. Road/satellite switch the embedded Google Maps layer; the 3D control opens the selected location in Google Maps in a new tab, where 3D availability depends on the location/device and the Google Maps interface.
- Added consistent active-state styling, keyboard focus indicators, and mobile-friendly wrapping for map controls.
- Fixed the **Edit preferences** button so it returns users to the planner, improved navigation buttons to scroll to the relevant planner section, and made the footer planning links open the trip-type chooser. The YATRIQ brand link now reliably returns to the top/home view.
- Map controls use Google Maps embeds and require internet access. The map is an interactive location view; it does not guarantee live routing, traffic, or 3D imagery inside the embedded frame. Use Google Maps for live directions.
- Automated checks completed: JavaScript syntax checks pass and the static HTML has no duplicate IDs. A full browser-driven test could not run in this environment, so please test the key flows in Chrome before presenting.
