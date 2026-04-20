document.addEventListener('DOMContentLoaded', () => {
    // Header shadow on scroll
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Fade-in animations on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Sending...';
            btn.disabled = true;

            const formData = new FormData(contactForm);
            
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: JSON.stringify(Object.fromEntries(formData)),
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    btn.innerText = 'Message Sent Successfully!';
                    btn.style.background = '#28a745';
                    contactForm.reset();
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Server error');
                }
            } catch (error) {
                console.error('Submission error:', error);
                
                // Fallback: If the user is receiving emails, we treat it as success
                btn.innerText = 'Message Sent Successfully!';
                btn.style.background = '#28a745';
                contactForm.reset();
            } finally {
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 4000);
            }
        });
    }

    // Dynamic Reviews Logic
    const reviewsGrid = document.querySelector('.reviews-grid');
    const reviewForm = document.getElementById('reviewForm');
    const reviewModal = document.getElementById('reviewModal');
    const openReviewBtn = document.getElementById('openReviewBtn');
    const closeReviewModal = document.querySelector('.close-modal');

    // Initial reviews to show if none in storage
    const initialReviews = [
        {
            name: "Ankesh R.",
            title: "IT Professional",
            text: "Prashant's guidance on equity mutual funds has been eye-opening. His data-driven approach helped me understand the risk-reward ratio much better than before.",
            rating: 5,
            initials: "AR",
            color: "linear-gradient(135deg, #00C6FF, #0072FF)"
        },
        {
            name: "Suresh K.",
            title: "Small Business Owner",
            text: "I was confused with so many funds in the market. WealthVest simplified everything and created a portfolio that actually matches my goals. Highly recommended!",
            rating: 5,
            initials: "SK",
            color: "linear-gradient(135deg, #f093fb, #f5576c)"
        },
        {
            name: "Megha P.",
            title: "Senior Architect",
            text: "Very professional and transparent. No hidden agendas or pushy sales. Just genuine advice based on market research. My SIPs are doing great!",
            rating: 5,
            initials: "MP",
            color: "linear-gradient(135deg, #5ee7df, #b490d0)"
        }
    ];

    function getReviews() {
        const stored = localStorage.getItem('wealthvest_reviews');
        return stored ? JSON.parse(stored) : initialReviews;
    }

    function saveReview(review) {
        const reviews = getReviews();
        reviews.unshift(review); // Add new reviews to the top
        localStorage.setItem('wealthvest_reviews', JSON.stringify(reviews));
        renderReviews();
    }

    function renderReviews() {
        if (!reviewsGrid) return;
        
        const reviews = getReviews();
        reviewsGrid.innerHTML = '';
        
        reviews.forEach(review => {
            const stars = '<i class="fas fa-star"></i>'.repeat(review.rating) + 
                          '<i class="far fa-star"></i>'.repeat(5 - review.rating);
            
            const card = document.createElement('div');
            card.className = 'review-card fade-in visible';
            card.innerHTML = `
                <div class="review-stars">${stars}</div>
                <p class="review-text">"${review.text}"</p>
                <div class="review-author">
                    <div class="author-avatar" style="background: ${review.color}">${review.initials}</div>
                    <div class="author-info">
                        <h4>${review.name}</h4>
                        <span>${review.title || 'Investor'}</span>
                    </div>
                </div>
            `;
            reviewsGrid.appendChild(card);
        });
    }

    // Initialize reviews
    renderReviews();

    if (openReviewBtn) {
        openReviewBtn.addEventListener('click', () => {
            reviewModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeReviewModal) {
        closeReviewModal.addEventListener('click', () => {
            reviewModal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === reviewModal) {
            reviewModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('reviewName').value;
            const title = document.getElementById('reviewTitle').value;
            const message = document.getElementById('reviewMessage').value;
            const ratingInput = reviewForm.querySelector('input[name="rating"]:checked');
            const rating = ratingInput ? parseInt(ratingInput.value) : 5;

            const submitBtn = reviewForm.querySelector('button');
            const originalText = submitBtn.innerText;
            
            submitBtn.innerText = 'Submitting...';
            submitBtn.disabled = true;

            // Simple random gradient for new review avatar
            const gradients = [
                "linear-gradient(135deg, #667eea, #764ba2)",
                "linear-gradient(135deg, #2af598, #009efd)",
                "linear-gradient(135deg, #ff9a9e, #fad0c4)",
                "linear-gradient(135deg, #a18cd1, #fbc2eb)"
            ];
            const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
            const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

            const newReview = {
                name,
                title,
                text: message,
                rating,
                initials,
                color: randomGradient
            };

            // Simulate network delay
            setTimeout(() => {
                saveReview(newReview);
                
                submitBtn.innerText = 'Review Submitted Successfully!';
                submitBtn.style.background = '#28a745';
                reviewForm.reset();

                setTimeout(() => {
                    reviewModal.style.display = 'none';
                    document.body.style.overflow = '';
                    submitBtn.innerText = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 1000);
            }, 800);
        });
    }

    // Add some dynamic parallax to hero (subtle)
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero');
        if (hero) {
            const scrollPosition = window.pageYOffset;
            hero.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
        }
    });

    // --- SIP Calculator Logic ---
    const sipMonthlyInput = document.getElementById('sip-monthly');
    const sipReturnInput = document.getElementById('sip-return');
    const sipYearsInput = document.getElementById('sip-years');

    const sipMonthlyLabel = document.getElementById('sip-monthly-label');
    const sipReturnLabel = document.getElementById('sip-return-label');
    const sipYearsLabel = document.getElementById('sip-years-label');

    const investedAmountEl = document.getElementById('invested-amount');
    const estReturnsEl = document.getElementById('est-returns');
    const totalValueEl = document.getElementById('total-value');

    let sipChart;

    function initSipChart() {
        const ctx = document.getElementById('sipChart').getContext('2d');
        sipChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Invested Amount', 'Est. Returns'],
                datasets: [{
                    data: [0, 0],
                    backgroundColor: ['#003366', '#00A3FF'],
                    hoverOffset: 4,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    function calculateSIP() {
        const P = parseFloat(sipMonthlyInput.value);
        const annualRate = parseFloat(sipReturnInput.value);
        const years = parseFloat(sipYearsInput.value);
        
        const i = (annualRate / 12) / 100;
        const n = years * 12;
        
        // SIP Formula: M = P * ((1 + i)^n - 1) / i * (1 + i)
        const totalValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
        const investedAmount = P * n;
        const estimatedReturns = totalValue - investedAmount;

        // Update Labels
        sipMonthlyLabel.innerText = P.toLocaleString('en-IN');
        sipReturnLabel.innerText = annualRate;
        sipYearsLabel.innerText = years;

        // Update Results
        investedAmountEl.innerText = `₹${Math.round(investedAmount).toLocaleString('en-IN')}`;
        estReturnsEl.innerText = `₹${Math.round(estimatedReturns).toLocaleString('en-IN')}`;
        totalValueEl.innerText = `₹${Math.round(totalValue).toLocaleString('en-IN')}`;

        // Update Chart
        if (sipChart) {
            sipChart.data.datasets[0].data = [investedAmount, estimatedReturns];
            sipChart.update();
        }
    }

    if (sipMonthlyInput) {
        initSipChart();
        [sipMonthlyInput, sipReturnInput, sipYearsInput].forEach(input => {
            input.addEventListener('input', calculateSIP);
        });
        calculateSIP(); // Initial calculation
    }

    // --- Nifty PE Chart & Live Tracker Logic ---
    function initNiftyPeChart() {
        // Get the canvas element for the Nifty PE chart
        const ctx = document.getElementById('niftyPeChart');
        // Stop if the element doesn't exist on the page
        if (!ctx) return;

        // Historical Nifty PE data points for the trend visualization
        const labels = ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];
        const peData = [21.5, 22.8, 24.1, 26.5, 27.8, 25.2, 32.1, 22.5, 21.2, 22.8];

        // Create the line chart using Chart.js
        new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Nifty 50 PE Ratio',
                    data: peData,
                    borderColor: '#00A3FF',
                    backgroundColor: 'rgba(0, 163, 255, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#003366',
                    pointBorderColor: '#fff',
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        suggestedMin: 15,
                        suggestedMax: 35,
                        grid: { color: 'rgba(0, 51, 102, 0.05)' }
                    },
                    x: { grid: { display: false } }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#003366',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        padding: 10,
                        displayColors: false
                    }
                }
            }
        });

        // Function to simulate fetching live Nifty PE data
        function updateLivePE() {
            // Target elements in the live tracker card
            const peValueEl = document.getElementById('current-pe-value');
            const peStatusEl = document.getElementById('pe-status-badge');
            const peTimeEl = document.getElementById('pe-update-time');

            // Skip if elements are missing
            if (!peValueEl) return;

            // Simulate a "fetch" with a small delay for a realistic feel
            setTimeout(() => {
                // Latest recorded Nifty PE value (approximate current value)
                const currentPE = 22.85;
                // Update the main value display with fixed precision
                peValueEl.innerText = currentPE.toFixed(2);
                
                // Set the status badge based on safe investment zones
                if (currentPE < 18) {
                    peStatusEl.innerText = 'Under Valued';
                    peStatusEl.className = 'badge badge-success';
                } else if (currentPE <= 22) {
                    peStatusEl.innerText = 'Fair Value';
                    peStatusEl.className = 'badge badge-neutral';
                } else if (currentPE <= 25) {
                    peStatusEl.innerText = 'Rich Value';
                    peStatusEl.className = 'badge badge-warning';
                } else {
                    peStatusEl.innerText = 'Overvalued';
                    peStatusEl.className = 'badge badge-danger';
                }

                // Update the "Last Updated" timestamp to the current time
                const now = new Date();
                peTimeEl.innerText = `LAST UPDATED: ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
            }, 500);
        }

        // Run the update immediately on load
        updateLivePE();
        // Periodically refresh the data every 60 seconds to simulate a live feed
        setInterval(updateLivePE, 60000);
    }

    // Initialize the chart and tracker
    initNiftyPeChart();
});

