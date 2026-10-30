/* YATRIQ multi-city tour planner. All ticket amounts are illustrative estimates, not live fares. */
(()=>{
 const $=id=>document.getElementById(id);
 const money=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(Math.max(0,Math.round(n)));
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const mapUrl=(q,embed=false)=>embed?`https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=12&output=embed`:`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
 function setup(){
  if(typeof cityData==='undefined'||!$('multiCityForm'))return;
  const names=Object.keys(cityData).sort();
  // Free, place-specific gallery photos from Wikimedia Commons (no paid API/key).
  // Search a recognisable landmark for each city instead of reusing generic stock images.
  const cityLandmarks={
   "Agra":"Taj Mahal Agra India", "Ahmedabad":"Sabarmati Riverfront Ahmedabad India",
   "Amritsar":"Golden Temple Amritsar India", "Bengaluru":"Vidhana Soudha Bengaluru India",
   "Bhopal":"Upper Lake Bhopal India", "Bhubaneswar":"Lingaraj Temple Bhubaneswar India",
   "Chandigarh":"Rock Garden Chandigarh India", "Chennai":"Marina Beach Chennai India",
   "Coimbatore":"Marudhamalai Temple Coimbatore India", "Dehradun":"Forest Research Institute Dehradun India",
   "Delhi":"India Gate New Delhi India", "Goa":"Baga Beach Goa India",
   "Guwahati":"Kamakhya Temple Guwahati India", "Hyderabad":"Charminar Hyderabad India",
   "Indore":"Rajwada Palace Indore India", "Jaipur":"Hawa Mahal Jaipur India",
   "Kochi":"Chinese fishing nets Fort Kochi India", "Kolkata":"Victoria Memorial Kolkata India",
   "Lucknow":"Bara Imambara Lucknow India", "Madurai":"Meenakshi Amman Temple Madurai India",
   "Mumbai":"Gateway of India Mumbai India", "Mysuru":"Mysore Palace Mysuru India",
   "Nagpur":"Deekshabhoomi Nagpur India", "Pune":"Shaniwar Wada Pune India",
   "Shimla":"The Ridge Shimla India", "Thiruvananthapuram":"Padmanabhaswamy Temple Kerala India",
   "Udaipur":"Lake Palace Udaipur India", "Varanasi":"Dashashwamedh Ghat Varanasi India",
   "Vijayawada":"Kanaka Durga Temple Vijayawada India", "Visakhapatnam":"RK Beach Visakhapatnam India"
  };
  const photoCache=new Map();
  async function loadCityPhoto(img,city){
   const query=cityLandmarks[city]||`${city} India landmark tourism`;
   img.alt=`${query} — travel photo`;
   img.dataset.loading='true';
   try{
    if(!photoCache.has(query)){
     const url=`https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent('file:'+query)}&gsrnamespace=6&gsrlimit=8&gsrinfo=&prop=imageinfo&iiprop=url&iiurlwidth=640&format=json&origin=*`;
     photoCache.set(query,fetch(url).then(r=>{if(!r.ok)throw Error('Image search failed');return r.json()}));
    }
    const data=await photoCache.get(query);const pages=Object.values(data.query?.pages||{});
    // Prefer an actual thumbnail URL from Commons; skip SVGs and non-photo documents.
    const page=pages.find(x=>x.imageinfo?.[0]?.thumburl && !/\.(svg|pdf|djvu)(\?|$)/i.test(x.imageinfo[0].thumburl));
    if(!page)throw Error('No suitable landmark photo found');
    img.src=page.imageinfo[0].thumburl;img.dataset.loading='false';
   }catch(e){
    img.dataset.loading='false';img.classList.add('city-photo-unavailable');
    const card=img.closest('.multi-city-photo-card');if(card)card.classList.add('photo-unavailable');
    // Never substitute an unrelated generic landscape for a city landmark.
   }
  }
  function multiCityPhoto(city){return ''}
  $('multiOrigin').innerHTML=names.map(n=>`<option value="${esc(n)}">${esc(n)}, ${esc(cityData[n].state)}</option>`).join('');
  $('multiOrigin').value='Vijayawada';
  const choices=$('multiCityChoices');
  function renderCityChoices(){
   const origin=$('multiOrigin').value;let count=Math.max(2,Math.min(10,Number($('multiCityCount').value)||3));$('multiCityCount').value=count;
   const current=[...choices.querySelectorAll('select')].map(x=>x.value);
   choices.innerHTML=`<div class="multi-city-choice-heading"><span class="eyebrow">YOUR DESTINATIONS</span><small>Select ${count} cities to visit, in route order.</small></div>`+
    Array.from({length:count},(_,i)=>{const opts=names.filter(n=>n!==origin);let selected=current[i]&&opts.includes(current[i])?current[i]:opts.filter(n=>!current.includes(n))[i%opts.length];if(!selected)selected=opts[i%opts.length];return `<label class="field"><span>City ${i+1}</span><div class="input-shell"><span>⌖</span><select class="multi-city-destination" required>${opts.map(n=>`<option value="${esc(n)}" ${n===selected?'selected':''}>${esc(n)}, ${esc(cityData[n].state)}</option>`).join('')}</select></div></label>`}).join('')+
    `<div class="multi-city-gallery-heading"><span class="eyebrow">EXPLORE ALL AVAILABLE CITIES</span><small>Choose a city card to add it to the next destination slot.</small></div><div class="multi-city-gallery">${names.filter(n=>n!==origin).map(n=>`<button type="button" class="multi-city-photo-card" data-gallery-city="${esc(n)}"><img src="data:," alt="${esc(n)} landmark photo loading" loading="lazy"><span><strong>${esc(n)}</strong><small>${esc(cityData[n].state)}</small></span></button>`).join('')}</div>`;
   choices.querySelectorAll('[data-gallery-city] img').forEach(img=>loadCityPhoto(img,img.closest('[data-gallery-city]').dataset.galleryCity));
   // Avoid duplicate city selections while keeping route order clear.
   const selects=[...choices.querySelectorAll('select')];selects.forEach((sel,i)=>sel.addEventListener('change',()=>{const used=new Set([origin,...selects.filter((x,j)=>j!==i).map(x=>x.value)]);if(used.has(sel.value)){const replacement=names.find(n=>!used.has(n));if(replacement)sel.value=replacement;}}));
   choices.querySelectorAll('[data-gallery-city]').forEach(card=>card.addEventListener('click',()=>{const city=card.dataset.galleryCity;const already=[...choices.querySelectorAll('select')].find(x=>x.value===city);if(already){already.focus({preventScroll:true});return;}const slot=choices.querySelector('select');if(slot){slot.value=city;slot.dispatchEvent(new Event('change',{bubbles:true}));}choices.querySelectorAll('[data-gallery-city]').forEach(x=>x.classList.toggle('is-selected',[...choices.querySelectorAll('select')].some(sel=>sel.value===x.dataset.galleryCity)));}));
   const syncGallerySelection=()=>choices.querySelectorAll('[data-gallery-city]').forEach(x=>x.classList.toggle('is-selected',[...choices.querySelectorAll('select')].some(sel=>sel.value===x.dataset.galleryCity)));
   choices.querySelectorAll('select').forEach(sel=>sel.addEventListener('change',syncGallerySelection));syncGallerySelection();
  }
  $('multiOrigin').addEventListener('change',renderCityChoices);$('multiCityCount').addEventListener('change',renderCityChoices);renderCityChoices();
  function setMap(city,place){
   $('multiCityMapTitle').textContent=city;const cityQuery=`${city}, India`;$('multiCityMap').dataset.mapQuery=cityQuery;$('multiCityMap').dataset.mapMode=$('multiCityMap').dataset.mapMode||'road';$('multiCityMap').src=mapUrl(cityQuery,true,$('multiCityMap').dataset.mapMode);$('multiCityMapLink').href=mapUrl(cityQuery);
   if(place){$('multiPlaceMapTitle').textContent=place;const placeQuery=`${place}, ${city}, India`;$('multiPlaceMap').dataset.mapQuery=placeQuery;$('multiPlaceMap').dataset.mapMode=$('multiPlaceMap').dataset.mapMode||'road';$('multiPlaceMap').src=mapUrl(placeQuery,true,$('multiPlaceMap').dataset.mapMode);$('multiPlaceMapLink').href=mapUrl(placeQuery);}
  }
  $('multiCityForm').addEventListener('submit',e=>{
   e.preventDefault();const days=Number($('multiDays').value),budget=Number($('multiBudget').value),travellers=Number($('multiTravellers').value),origin=$('multiOrigin').value;
   if(days<6){$('multiDays').setCustomValidity('Multi-city tours require at least 6 days.');$('multiDays').reportValidity();$('multiDays').setCustomValidity('');return;}
   const selected=[...choices.querySelectorAll('select')].map(x=>x.value);if(new Set([origin,...selected]).size!==selected.length+1){alert('Please choose a different city for each stop.');return;}
   const route=[origin,...selected];if(days<route.length){alert(`For ${selected.length} destination cities plus your starting city, choose at least ${route.length} days so every city gets a visit day.`);return;}
   const totalCities=route.length,perCityDays=Array.from({length:totalCities},(_,i)=>Math.floor(days/totalCities)+(i<days%totalCities?1:0));
   const allLegs=[];for(let i=1;i<route.length;i++){const a=route[i-1],b=route[i],ai=Object.keys(cityData).indexOf(a),bi=Object.keys(cityData).indexOf(b);const oneWayPerPerson=Math.max(600,Math.min(3500,Math.round(750+Math.abs(ai-bi)*42)));allLegs.push({from:a,to:b,perPerson:oneWayPerPerson,total:oneWayPerPerson*travellers});}
   const ticketTotal=allLegs.reduce((n,l)=>n+l.total,0),dailyLimit=4,seen=new Set(),dayCards=[];let day=1,placeIndex=0;
   route.forEach((city,cityIndex)=>{
    const available=cityData[city].places.map((name,i)=>({name,tags:cityData[city].tags[i],idx:i})).filter(p=>{const key=p.name.toLocaleLowerCase().replace(/[^a-z0-9]/g,'');if(seen.has(key))return false;seen.add(key);return true;});
    const allotted=perCityDays[cityIndex];
    for(let localDay=0;localDay<allotted;localDay++,day++){
     const places=[];for(let k=0;k<dailyLimit&&placeIndex<available.length;k++){places.push(available[placeIndex++]);}
     dayCards.push({day,city,places,rest:places.length===0});
    }
    placeIndex=0;
   });
   const budgetPerPerson=budget/travellers,perDay=budget/days;const style=$('multiStyle').value;const mode=budgetPerPerson<12000?'Bus':budgetPerPerson<30000?'Train':'Airplane';const modeRate=mode==='Bus'?1:mode==='Train'?1.65:3.8;allLegs.forEach(l=>{l.mode=mode;l.perPerson=Math.round(l.perPerson*modeRate);l.total=l.perPerson*travellers;});const adjustedTicketTotal=allLegs.reduce((n,l)=>n+l.total,0);
   const ticketHtml=allLegs.map(l=>`<div class="multi-ticket-row"><div><strong>${esc(l.from)} → ${esc(l.to)}</strong><small>Suggested ${l.mode} · indicative one-way allowance · ${travellers} traveller${travellers===1?'':'s'}</small></div><div><strong>${money(l.total)}</strong><small>${money(l.perPerson)} per person</small></div></div>`).join('');
   const itinerary=dayCards.map(d=>`<article class="multi-day-card"><div class="day-number">${String(d.day).padStart(2,'0')}<small>DAY</small></div><div class="multi-day-main"><div class="multi-day-heading"><div><h4>${esc(d.city)}</h4><p>${d.rest?'A slower day for transfers, rest, cafés or exploring at your own pace.':`${d.places.length} main stop${d.places.length===1?'':'s'} planned · no repeated attractions`}</p></div><button class="multi-map-city" type="button" data-city-map="${esc(d.city)}">View city map ↗</button></div>${d.places.length?`<div class="multi-place-list">${d.places.map((p,i)=>`<button class="multi-place-button" type="button" data-place="${esc(p.name)}" data-city="${esc(d.city)}"><span class="multi-place-number">${i+1}</span><img class="multi-place-thumb" data-place-photo="${esc(p.name)}" data-place-context="${esc(d.city)}" data-backup="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=240&q=75" src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=240&q=75" alt="${esc(p.name)}" loading="lazy"><span><strong>${esc(p.name)}</strong><small>${esc(p.tags.join(' · '))}</small></span><span class="stop-arrow">↗</span></button>`).join('')}</div>`:''}</div></article>`).join('');
   const result=$('multiCityResults');result.hidden=false;result.innerHTML=`<div class="multi-summary-strip"><div class="summary-item"><small>YOUR ROUTE</small><strong>${esc(route.join(' → '))}</strong><span>${totalCities} cities including your starting city</span></div><div class="summary-item"><small>DURATION</small><strong>${days} days</strong><span>${travellers} travellers · ${money(perDay)}/day group budget</span></div><div class="summary-item"><small>ESTIMATED TICKETS</small><strong>${money(adjustedTicketTotal)}</strong><span>${money(adjustedTicketTotal/Math.max(1,travellers))} per traveller for intercity legs</span></div><div class="summary-item"><small>BUDGET REMAINING AFTER TICKETS</small><strong>${money(budget-adjustedTicketTotal)}</strong><span>${money(budgetPerPerson)} total budget per person</span></div></div>
   <div class="multi-cost-panel"><div class="panel-heading"><div><div class="eyebrow">INTERCITY TRAVEL ESTIMATE</div><h3>Ticket costs by route leg</h3></div><span class="panel-tag">ESTIMATES · INR</span></div>${ticketHtml}<p class="small-note">These are illustrative ${mode.toLowerCase()} allowances calculated from a simple route heuristic, not live fares or confirmed ticket prices. Check actual travel mode, distance, dates and availability before booking. Accommodation, food, local transport and entry tickets are not included in the ticket total.</p></div>
   <div class="multi-results-grid"><div class="itinerary-panel"><div class="panel-heading"><div><div class="eyebrow">SLOWER, SMARTER SIGHTSEEING</div><h3>Your day-by-day itinerary</h3></div><span class="panel-tag">4 STOPS/DAY TARGET</span></div>${itinerary}<p class="small-note">The planner targets up to four curated sights per sightseeing day and spreads them across the selected route. Days with transfers or limited available sights may be lighter; nearby places are grouped to reduce backtracking.</p></div><div class="map-column multi-map-column"><div class="map-panel"><div class="panel-heading"><div><div class="eyebrow">MAP 01 · CITY OVERVIEW</div><h3 id="multiCityMapTitle">Choose a city</h3></div><span class="map-pin">⌖</span></div><div class="map-view-controls" role="group" aria-label="Multi-city map view"><button type="button" class="map-view-button is-active" data-map-view="road" data-map-frame="multiCityMap" data-map-link="multiCityMapLink">Road map</button><button type="button" class="map-view-button" data-map-view="satellite" data-map-frame="multiCityMap" data-map-link="multiCityMapLink">Satellite</button><button type="button" class="map-view-button map-3d-button" data-map-view="3d" data-map-frame="multiCityMap" data-map-link="multiCityMapLink">3D in Google Maps ↗</button></div><div class="map-frame"><iframe id="multiCityMap" title="Multi-city destination map" loading="lazy"></iframe></div><a id="multiCityMapLink" class="map-open-link" target="_blank" rel="noopener">Open city in Google Maps ↗</a><div class="panel-heading multi-map-second-heading"><div><div class="eyebrow">MAP 02 · TOURIST PLACE</div><h3 id="multiPlaceMapTitle">Choose a tourist place</h3></div><span class="map-pin">↗</span></div><div class="map-view-controls" role="group" aria-label="Multi-city tourist place map view"><button type="button" class="map-view-button is-active" data-map-view="road" data-map-frame="multiPlaceMap" data-map-link="multiPlaceMapLink">Road map</button><button type="button" class="map-view-button" data-map-view="satellite" data-map-frame="multiPlaceMap" data-map-link="multiPlaceMapLink">Satellite</button><button type="button" class="map-view-button map-3d-button" data-map-view="3d" data-map-frame="multiPlaceMap" data-map-link="multiPlaceMapLink">3D in Google Maps ↗</button></div><div class="map-frame"><iframe id="multiPlaceMap" title="Selected tourist place map" loading="lazy"></iframe></div><a id="multiPlaceMapLink" class="map-open-link" target="_blank" rel="noopener">Open tourist place in Google Maps ↗</a><p class="map-help">Select a city or tourist place in the itinerary to update the maps.</p></div></div></div><div class="multi-extra-panels"><section class="stay-panel multi-hotels"><div class="panel-heading"><div><div class="eyebrow">STAY YOUR WAY</div><h3>Suggested hotels & stays</h3></div><span class="panel-tag">BUDGET-AWARE</span></div><p class="stay-intro">Illustrative nightly ranges only. These are stay categories, not verified properties or live availability.</p><div class="hotel-grid">${[{name:'Budget guesthouse / hostel',price:900,desc:'Best for keeping more of the budget for experiences.'},{name:'Comfort hotel',price:2200,desc:'A practical balance of privacy, location and comfort.'},{name:'Premium boutique stay',price:5200,desc:'Higher-comfort option if the remaining budget allows.'}].map((h,i)=>`<article class="hotel-card ${i===0?'hotel-selected':''}"><img class="multi-hotel-photo" src="https://images.unsplash.com/${['photo-1564507592333-c60657eea523','photo-1566073771259-6a8506099945','photo-1542314831-068cd1dbfeeb'][i]}?auto=format&fit=crop&w=800&q=80" alt="${h.name}" loading="lazy"><span class="hotel-category">${i===0?'BUDGET PICK':i===1?'COMFORT':'PREMIUM'}</span><h4>${h.name}</h4><p>${h.desc}</p><div class="hotel-price"><strong>~${money(h.price)}</strong><small> / room / night</small></div><button type="button" class="button quiet hotel-book multi-hotel-select" data-hotel="${esc(h.name)}" data-nightly="${h.price}">Choose this stay</button></article>`).join('')}</div><button class="button primary multi-checkout" type="button" id="multiCheckout">Continue to demo payment ↗</button></section><section class="travel-tips multi-local-knowhow"><div class="tips-icon">✦</div><div><div class="eyebrow">LOCAL KNOW-HOW</div><h3>Travel smart in every city</h3><p><strong>Getting around:</strong> Use metro/local buses where available, walk short central routes, and compare app-based taxis for late-night or luggage-heavy trips.</p><p><strong>Food & culture:</strong> Try busy local eateries, check regional meal times, dress respectfully at religious sites, and ask before photographing people or ceremonies.</p><p><strong>Safety & timing:</strong> Start outdoor attractions early, verify official opening hours and entry fees, keep some cash for small vendors, and check weather and local advisories.</p><p><strong>Transport recommendation:</strong> ${mode==='Bus'?'Bus is prioritised for a tight budget; compare journey duration and operator reviews.':mode==='Train'?'Train is the balanced recommendation for cost and comfort; reserve early and compare station locations.':'Air travel is suggested for a higher per-person budget or longer hops; compare airport transfers and baggage fees.'} Actual best mode depends on route, date and live availability.</p></div></section></div><p class="disclaimer">YATRIQ planning estimates only; not live ticket prices, reservations or booking confirmations. Maps require internet access. Demo checkout does not collect money.</p>`;
   result.querySelectorAll('img[data-place-photo]').forEach(img=>{const title=img.dataset.placePhoto,context=img.dataset.placeContext,backup=img.dataset.backup;fetch('https://en.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(title.replace(/ /g,'_')),{headers:{accept:'application/json'}}).then(r=>r.ok?r.json():null).then(d=>{if(d&&d.thumbnail&&d.thumbnail.source)img.src=d.thumbnail.source;else img.src=backup;}).catch(()=>{img.src=backup;});});
   result.querySelectorAll('[data-city-map]').forEach(b=>b.addEventListener('click',()=>setMap(b.dataset.city,null)));
   result.querySelectorAll('[data-place]').forEach(b=>b.addEventListener('click',()=>{setMap(b.dataset.city,b.dataset.place);b.blur();}));
   result.querySelectorAll('.multi-hotel-select').forEach(b=>b.addEventListener('click',()=>{result.querySelectorAll('.multi-hotel-select').forEach(x=>{x.closest('.hotel-card').classList.remove('hotel-selected');x.textContent='Choose this stay';});b.closest('.hotel-card').classList.add('hotel-selected');b.textContent='Selected stay ✓';}));
   result.querySelector('#multiCheckout')?.addEventListener('click',()=>{const stay=result.querySelector('.hotel-selected h4')?.textContent||'Budget guesthouse / hostel';const nightly=Number(result.querySelector('.hotel-selected [data-nightly]')?.dataset.nightly)||900;const amount=adjustedTicketTotal+(nightly*Math.max(1,days-1)*Math.max(1,Math.ceil(travellers/2)));if(window.openPayment)window.openPayment(`${route.join(' → ')} · ${stay}`,amount);else alert('Demo payment is not available right now.');});
   setMap(route[0],cityData[route[0]].places[0]);
   
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();
