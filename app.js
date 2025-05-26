// AgriMatch App JS

const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_KEY = 'public-anon-key';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Populate crop dropdown
async function loadCrops() {
  const { data, error } = await supabase.from('crops').select();
  const cropSelect = document.getElementById('crop');
  if (data) {
    data.forEach(crop => {
      const option = document.createElement('option');
      option.value = crop.id;
      option.textContent = crop.name;
      cropSelect.appendChild(option);
    });
  }
}

// Submit listing
const listingForm = document.getElementById('listingForm');
listingForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const cropId = document.getElementById('crop').value;
  const quantity = parseFloat(document.getElementById('quantity').value);
  const price = parseFloat(document.getElementById('price').value);
  const [lat, lon] = document.getElementById('location').value.split(',').map(Number);
  const { data, error } = await supabase.from('listings').insert([{
    crop_id: cropId,
    quantity_kg: quantity,
    asking_price: price,
    location: `POINT(${lon} ${lat})`
  }]);
  if (!error) {
    alert('Listing posted!');
    listingForm.reset();
  } else {
    console.error(error);
    alert('Error posting listing.');
  }
});

// Load market price ticker
async function loadPrices() {
  const { data, error } = await supabase.from('market_prices').select().limit(5).order('collected_at', { ascending: false });
  const ticker = document.getElementById('ticker');
  if (data) {
    ticker.innerHTML = data.map(p => `<p>${p.market}: ${p.price} KSh/kg</p>`).join('');
  }
}

// Initialize Leaflet map
function initMap() {
  const map = L.map('mapid').setView([-1.2921, 36.8219], 8); // Default to Nairobi
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Demo marker
  L.marker([-1.2921, 36.8219]).addTo(map).bindPopup('Example Market').openPopup();
}

loadCrops();
loadPrices();
initMap();
