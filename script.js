document.addEventListener('DOMContentLoaded', () => {
    const vehiclesContainer = document.getElementById('vehicles-container');

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    const getStarRating = (rating) => {
        let starsHtml = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            starsHtml += `<svg class="w-4 h-4 text-yellow-400 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20"><path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.07l3.629 3.542-0.85 5.035a1.53 1.53 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-0.85-5.034 3.629-3.542a1.534 1.534 0 0 0 .364-1.432Z"/></svg>`;
        }
        if (hasHalfStar) {
            starsHtml += `<svg class="w-4 h-4 text-yellow-400 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20"><path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.07l3.629 3.542-0.85 5.035a1.53 1.53 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-0.85-5.034 3.629-3.542a1.534 1.534 0 00 .364-1.432ZM11 0v17.033a1.534 1.534 0 00 2.226 1.617l4.518-2.375 0.85 5.034a1.53 1.53 0 00 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 00 2.226-1.617l-0.85-5.034 3.629-3.542a1.534 1.534 0 00 .364-1.432Z"/></svg>`;
        }
        for (let i = 0; i < (5 - Math.ceil(rating)); i++) {
            starsHtml += `<svg class="w-4 h-4 text-gray-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20"><path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.07l3.629 3.542-0.85 5.035a1.53 1.53 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-0.85-5.034 3.629-3.542a1.534 1.534 0 0 0 .364-1.432Z"/></svg>`;
        }
        return starsHtml;
    };

    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(vehicles => {
            vehicles.forEach(vehicle => {
                const card = document.createElement('div');
                // *** PERUBAHAN DI SINI UNTUK GAYA KARTU ***
                card.className = 'bg-white rounded-2xl shadow-md overflow-hidden vehicle-card hover-lift transform transition-transform duration-300 relative'; // shadow-md, relative for potential badges
                card.innerHTML = `
                    <img src="${vehicle.photo}" alt="${vehicle.nama_kendaraan}" class="w-full h-56 object-cover">
                    <div class="p-6">
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">${vehicle.nama_kendaraan}</h3>
                        <p class="text-gray-600 mb-3 text-sm flex items-center">
                            <i class="fa-solid fa-truck-pickup text-blue-500 mr-2"></i> ${vehicle.tipe_kendaraan} 
                            <span class="mx-2 text-gray-400">|</span>
                            <i class="fa-solid fa-location-dot text-red-500 mr-2"></i> ${vehicle.alamat}
                        </p>
                        <div class="flex items-center mb-3">
                            ${getStarRating(vehicle.rating)}
                            <span class="ml-2 text-gray-800 font-semibold">${vehicle.rating}</span>
                            <span class="text-gray-500 text-sm ml-1">(${vehicle.review} reviews)</span>
                        </div>
                        <p class="text-3xl font-extrabold text-blue-600 mb-4">${formatRupiah(vehicle.harga_per_km)} / KM</p>
                        <button onclick="openDetailPage(${vehicle.id})" class="w-full bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300">
                            Lihat Detail
                        </button>
                    </div>
                    <div class="absolute top-4 right-4 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        <i class="fa-solid fa-star mr-1"></i> ${vehicle.rating}
                    </div>
                `;
                vehiclesContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error fetching vehicles:', error);
            vehiclesContainer.innerHTML = '<p class="text-red-500 text-center text-lg col-span-full">Gagal memuat daftar kendaraan. Silakan coba lagi nanti.</p>';
        });
});

function openDetailPage(vehicleId) {
    window.location.href = `vehicle-detail.html?id=${vehicleId}`;
}