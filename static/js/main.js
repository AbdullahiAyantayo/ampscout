let map;
let markers = [];

// Initialize map
function initMap() {
    map = L.map('map').setView([42.3314, -83.0458], 12); // Detroit coordinates
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

// Format suitability score with color
function formatScore(score) {
    const color = score >= 0.8 ? 'high' : score >= 0.5 ? 'medium' : 'low';
    return `<span class="suitability-score ${color}">${(score * 100).toFixed(1)}%</span>`;
}

// Add marker to map
function addMarker(lat, lng, properties) {
    const marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup(`
        <strong>${properties.address}</strong><br>
        Type: ${properties.property_type}<br>
        Lot Size: ${properties.lot_size} sq ft<br>
        Zoning: ${properties.zoning}<br>
        Suitability: ${formatScore(properties.suitability_score)}
    `);
    markers.push(marker);
}

// Clear all markers
function clearMarkers() {
    markers.forEach(marker => marker.remove());
    markers = [];
}

// Update table with site data
function updateTable(sites) {
    const tbody = document.getElementById('sitesTableBody');
    tbody.innerHTML = '';
    
    sites.forEach(site => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${site.id}</td>
            <td>${site.address}</td>
            <td>${site.property_type}</td>
            <td>${site.lot_size}</td>
            <td>${site.zoning}</td>
            <td>${site.ownership}</td>
            <td>${site.vacancy}</td>
            <td>${formatScore(site.poi_score)}</td>
            <td>${formatScore(site.suitability_score)}</td>
        `;
        tbody.appendChild(row);
    });
}

// Handle form submission
document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zipCode = document.getElementById('zipCode').value;
    const minLotSize = document.getElementById('minLotSize').value;
    const propertyType = document.getElementById('propertyType').value;
    const zoning = document.getElementById('zoning').value;
    
    try {
        const response = await fetch(`/api/potential-sites?city=${city}&state=${state}&zip_code=${zipCode}&min_lot_size=${minLotSize}&property_type=${propertyType}&zoning=${zoning}`);
        const data = await response.json();
        
        clearMarkers();
        data.forEach(site => {
            addMarker(site.latitude, site.longitude, site);
        });
        updateTable(data);
        
        // Fit map bounds to show all markers
        if (markers.length > 0) {
            const group = new L.featureGroup(markers);
            map.fitBounds(group.getBounds());
        }
    } catch (error) {
        console.error('Error fetching sites:', error);
        alert('Error fetching sites. Please try again.');
    }
});

// Initialize map when page loads
document.addEventListener('DOMContentLoaded', initMap); 