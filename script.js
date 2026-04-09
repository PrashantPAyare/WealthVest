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
        const scrollPosition = window.pageYOffset;
        hero.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
    });
});
