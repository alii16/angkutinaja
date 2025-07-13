document.addEventListener("DOMContentLoaded", function () {
  // Initialize Swiper for vehicle gallery
  const vehicleGallery = new Swiper(".vehicle-gallery", {
    loop: true,
    spaceBetween: 10,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });

  // Function to format currency (IDR)
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  // Function to generate star rating HTML
  const getStarRating = (rating) => {
    let starsHtml = "";
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      starsHtml += `<svg class="w-5 h-5 text-yellow-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20"><path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.07l3.629 3.542-0.85 5.035a1.53 1.53 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-0.85-5.034 3.629-3.542a1.534 1.534 0 0 0 .364-1.432Z"/></svg>`;
    }
    if (hasHalfStar) {
      starsHtml += `<svg class="w-5 h-5 text-yellow-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20"><path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.07l3.629 3.542-0.85 5.035a1.53 1.53 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-0.85-5.034 3.629-3.542a1.534 1.534 0 0 0 .364-1.432ZM11 0v17.033a1.534 1.534 0 0 0 2.226 1.617l4.518-2.375 0.85 5.034a1.53 1.53 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-0.85-5.034 3.629-3.542a1.534 1.534 0 0 0 .364-1.432Z"/></svg>`;
    }
    for (let i = 0; i < 5 - Math.ceil(rating); i++) {
      starsHtml += `<svg class="w-5 h-5 text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20"><path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.07l3.629 3.542-0.85 5.035a1.53 1.53 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-0.85-5.034 3.629-3.542a1.534 1.534 0 0 0 .364-1.432Z"/></svg>`;
    }
    return starsHtml;
  };

  // Function to calculate rental price based on duration
  const calculateRentalPrice = () => {
    const pricePer12Hours =
      parseFloat(
        document.getElementById("vehicle-price").getAttribute("data-price")
      ) || 0;

    const startDateInput = document.getElementById("rental-start-date");
    const endDateInput = document.getElementById("rental-end-date");

    if (!startDateInput.value || !endDateInput.value) {
      // Reset display when dates are not selected
      document.getElementById("rental-duration-display").textContent = "0 jam";
      document.getElementById("rental-units-display").textContent =
        "0 unit (12 jam)";
      document.getElementById("rental-price-per-unit").textContent =
        formatRupiah(pricePer12Hours);
      document.getElementById("rental-subtotal").textContent = formatRupiah(0);
      document.getElementById("rental-tax").textContent = formatRupiah(0);
      document.getElementById("rental-total").textContent = formatRupiah(0);
      return;
    }

    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);

    // Validate dates
    if (endDate <= startDate) {
      alert("Tanggal selesai harus setelah tanggal mulai");
      endDateInput.value = "";
      return;
    }

    // Calculate duration in hours
    const durationInMilliseconds = endDate - startDate;
    const durationInHours = Math.ceil(
      durationInMilliseconds / (1000 * 60 * 60)
    );

    // Calculate units (every 12 hours or fraction thereof)
    const units = Math.ceil(durationInHours / 12);

    // Calculate prices
    const subtotal = pricePer12Hours * units;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    // Update display
    document.getElementById(
      "rental-duration-display"
    ).textContent = `${durationInHours} jam`;
    document.getElementById(
      "rental-units-display"
    ).textContent = `${units} unit (12 jam)`;
    document.getElementById("rental-price-per-unit").textContent =
      formatRupiah(pricePer12Hours);
    document.getElementById("rental-subtotal").textContent =
      formatRupiah(subtotal);
    document.getElementById("rental-tax").textContent = formatRupiah(tax);
    document.getElementById("rental-total").textContent = formatRupiah(total);
  };

  // Get vehicle ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const vehicleId = parseInt(urlParams.get("id"));

  if (!isNaN(vehicleId)) {
    // Simulate API call with setTimeout
    setTimeout(() => {
      fetch("data.json")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((vehicles) => {
          const vehicle = vehicles.find((v) => v.id === vehicleId);
          if (vehicle) {
            // Update page title
            document.getElementById(
              "page-title"
            ).textContent = `${vehicle.nama_kendaraan} - RentEasy`;

            // Hide loading state and show content
            document.getElementById("loading-state").classList.add("hidden");
            document
              .getElementById("vehicle-content")
              .classList.remove("hidden");

            // Populate vehicle gallery
            const galleryWrapper = document.getElementById(
              "vehicle-gallery-wrapper"
            );
            galleryWrapper.innerHTML = `
                                    <div class="swiper-slide">
                                        <img src="${vehicle.photo}" alt="${vehicle.nama_kendaraan}" class="w-full h-96 object-cover">
                                    </div>
                                `;

            // Update vehicle info
            document.getElementById("vehicle-name").textContent =
              vehicle.nama_kendaraan;
            document.getElementById("vehicle-rating").innerHTML = getStarRating(
              vehicle.rating
            );
            document.getElementById("vehicle-rating-value").textContent =
              vehicle.rating.toFixed(1);
            document.getElementById(
              "vehicle-review-count"
            ).textContent = `(${vehicle.review} ulasan)`;
            document.getElementById("vehicle-location").textContent =
              vehicle.alamat;

            // Update price display and store price data
            const pricePerKm =
              vehicle.harga_per_km || vehicle.harga_per_12_jam || 0;
            document.getElementById("vehicle-price").textContent =
              formatRupiah(pricePerKm);
            document
              .getElementById("vehicle-price")
              .setAttribute("data-price", pricePerKm);

            document.getElementById(
              "vehicle-description"
            ).textContent = `Kendaraan ${vehicle.nama_kendaraan} tipe ${vehicle.tipe_kendaraan} ini sangat cocok untuk kebutuhan transportasi Anda di wilayah ${vehicle.alamat}. Dirawat secara rutin untuk memastikan performa maksimal, keamanan, dan kenyamanan perjalanan Anda. Fleksibel untuk berbagai jenis pengiriman barang atau penggunaan pribadi.`;

            // Update vehicle features
            const featuresContainer =
              document.getElementById("vehicle-features");
            const features = [
              { icon: "fas fa-gas-pump", name: "Bahan Bakar", value: "Bensin" },
              { icon: "fas fa-cogs", name: "Transmisi", value: "Otomatis" },
              {
                icon: "fas fa-user-friends",
                name: "Kapasitas",
                value: "5 Orang",
              },
              {
                icon: "fas fa-suitcase",
                name: "Bagasi",
                value: "2 Koper Besar",
              },
              { icon: "fas fa-snowflake", name: "AC", value: "Dual Zone" },
              { icon: "fas fa-bluetooth", name: "Audio", value: "Bluetooth" },
            ];

            featuresContainer.innerHTML = features
              .map(
                (feature) => `
                                    <div class="feature-badge p-3 flex items-center">
                                        <i class="${feature.icon} text-blue-600 mr-2"></i>
                                        <div>
                                            <div class="text-xs text-gray-500">${feature.name}</div>
                                            <div class="font-medium">${feature.value}</div>
                                        </div>
                                    </div>
                                `
              )
              .join("");

            // Update WhatsApp button
            const whatsappButton = document.getElementById("whatsapp-button");
            if (whatsappButton) {
              whatsappButton.setAttribute(
                "href",
                `https://wa.me/${vehicle.whatsapp}`
              );
              whatsappButton.addEventListener("click", function (e) {
                e.preventDefault();
                const message = `Halo, saya tertarik untuk menyewa ${vehicle.nama_kendaraan}. Bisa tolong berikan informasi lebih lanjut?`;
                const whatsappUrl = `https://wa.me/${
                  vehicle.whatsapp
                }?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, "_blank");
              });
            }

            // Initialize testimonial chart
            const testimonialChart = new ApexCharts(
              document.getElementById("testimonial-chart"),
              {
                series: [
                  {
                    name: "Rating",
                    data: [4.5, 4.8, 5, 4.2, 4.7, 5, 4.9],
                  },
                ],
                chart: {
                  height: 350,
                  type: "line",
                  zoom: {
                    enabled: false,
                  },
                  toolbar: {
                    show: false,
                  },
                },
                dataLabels: {
                  enabled: false,
                },
                stroke: {
                  curve: "smooth",
                  width: 3,
                  colors: ["#3b82f6"],
                },
                grid: {
                  row: {
                    colors: ["#f3f3f3", "transparent"],
                    opacity: 0.5,
                  },
                },
                xaxis: {
                  categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
                },
                yaxis: {
                  min: 0,
                  max: 5,
                  tickAmount: 5,
                },
                tooltip: {
                  theme: "light",
                  y: {
                    formatter: function (val) {
                      return val.toFixed(1) + " / 5.0";
                    },
                  },
                },
              }
            );
            testimonialChart.render();

            // Populate testimonial cards
            const testimonialCardsContainer =
              document.getElementById("testimonial-cards");
            const testimonials = [
              {
                name: "Budi Santoso",
                date: "15 Juli 2023",
                rating: 5,
                comment:
                  "Pelayanan sangat memuaskan, kendaraan bersih dan nyaman. Akan sewa lagi di lain waktu!",
              },
              {
                name: "Ani Wijaya",
                date: "2 Juni 2023",
                rating: 4,
                comment:
                  "Kendaraan dalam kondisi baik, respon customer service cepat. Harga cukup kompetitif.",
              },
              {
                name: "Rudi Hartono",
                date: "28 Mei 2023",
                rating: 5,
                comment:
                  "Pengalaman rental yang menyenangkan. Armada terawat dan prosesnya mudah.",
              },
            ];

            testimonialCardsContainer.innerHTML = testimonials
              .map(
                (testimonial) => `
                                    <div class="testimonial-card p-6">
                                        <div class="flex items-center mb-4">
                                            <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                                <i class="fas fa-user text-blue-600"></i>
                                            </div>
                                            <div>
                                                <h4 class="font-bold text-gray-900">${
                                                  testimonial.name
                                                }</h4>
                                                <p class="text-gray-500 text-sm">${
                                                  testimonial.date
                                                }</p>
                                            </div>
                                        </div>
                                        <div class="flex mb-3">
                                            ${getStarRating(testimonial.rating)}
                                        </div>
                                        <p class="text-gray-600">"${
                                          testimonial.comment
                                        }"</p>
                                    </div>
                                `
              )
              .join("");

            // Populate similar vehicles
            const similarVehiclesContainer =
              document.getElementById("similar-vehicles");
            const similarVehicles = vehicles
              .filter(
                (v) =>
                  v.tipe_kendaraan === vehicle.tipe_kendaraan &&
                  v.id !== vehicle.id
              )
              .slice(0, 3);

            if (similarVehicles.length > 0) {
              similarVehiclesContainer.innerHTML = similarVehicles
                .map(
                  (v) => `
                                        <div class="vehicle-card">
                                            <img src="${v.photo}" alt="${
                    v.nama_kendaraan
                  }" class="w-full h-48 object-cover">
                                            <div class="p-6">
                                                <h3 class="text-xl font-bold text-gray-900 mb-2">${
                                                  v.nama_kendaraan
                                                }</h3>
                                                <p class="text-gray-600 mb-3">${
                                                  v.tipe_kendaraan
                                                } - ${v.alamat}</p>
                                                <div class="flex items-center mb-3">
                                                    ${getStarRating(v.rating)}
                                                    <span class="ml-2 text-gray-800 font-semibold">${v.rating.toFixed(
                                                      1
                                                    )}</span>
                                                    <span class="text-gray-500 text-sm ml-1">(${
                                                      v.review
                                                    } reviews)</span>
                                                </div>
                                                <p class="text-2xl font-extrabold text-blue-600 mb-4">${formatRupiah(
                                                  v.harga_per_km ||
                                                    v.harga_per_12_jam
                                                )} / KM</p>
                                                <a href="vehicle-detail.html?id=${
                                                  v.id
                                                }" class="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center px-4 py-2 rounded-lg transition-colors duration-300">
                                                    Lihat Detail
                                                </a>
                                            </div>
                                        </div>
                                    `
                )
                .join("");
            } else {
              similarVehiclesContainer.innerHTML =
                '<p class="text-gray-500 col-span-full text-center">Tidak ada kendaraan serupa yang tersedia saat ini.</p>';
            }

            // Updated event listeners section (replace the existing one)
            // Add event listeners for price calculation
            const startDateInput = document.getElementById("rental-start-date");
            const endDateInput = document.getElementById("rental-end-date");

            if (startDateInput) {
              startDateInput.addEventListener("change", calculateRentalPrice);
            }

            if (endDateInput) {
              endDateInput.addEventListener("change", calculateRentalPrice);
            }

            // Set minimum date to today
            const today = new Date();
            const todayString = today.toISOString().slice(0, 16); // Format for datetime-local
            if (startDateInput) {
              startDateInput.min = todayString;
            }
            if (endDateInput) {
              endDateInput.min = todayString;
            }

            // Initial calculation
            calculateRentalPrice();

            // Update price display section (in the vehicle data population)
            // Replace the existing price update section with this:
            const pricePer12Hours = vehicle.harga_per_12_jam || 0;
            document.getElementById("vehicle-price").textContent =
              formatRupiah(pricePer12Hours);
            document
              .getElementById("vehicle-price")
              .setAttribute("data-price", pricePer12Hours);

            // Initialize date picker if available
            const dateInput = document.getElementById("rental-date");
            if (dateInput && typeof Datepicker !== "undefined") {
              new Datepicker(dateInput, {
                format: "dd/mm/yyyy",
                autohide: true,
              });
            }
          } else {
            document.getElementById("loading-state").innerHTML =
              '<p class="text-red-500 text-center text-lg mt-10">Kendaraan tidak ditemukan.</p>';
          }
        })
        .catch((error) => {
          console.error("Error fetching vehicle details:", error);
          document.getElementById("loading-state").innerHTML =
            '<p class="text-red-500 text-center text-lg mt-10">Gagal memuat detail kendaraan. Silakan coba lagi nanti.</p>';
        });
    }, 1000); // Simulate loading delay
  } else {
    document.getElementById("loading-state").innerHTML =
      '<p class="text-red-500 text-center text-lg mt-10">ID kendaraan tidak valid.</p>';
  }
});
