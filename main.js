/**
 * Bharani Bhavan Veg Restaurant - Premium Website JavaScript
 * Implements interactive menu tabs, testimonial slider, responsive navigation,
 * and scroll-triggered animations.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. STICKY HEADER & ACTIVE LINK TRACKING
    // ==========================================================================
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    const handleScroll = () => {
        // Sticky Header toggling
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active nav-link tracking on scroll
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger initially to catch load positions


    // ==========================================================================
    // 2. MOBILE DRAWER NAVIGATION MENU
    // ==========================================================================
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const menuLinks = navMenu.querySelectorAll('a');

    const toggleMenu = () => {
        navMenu.classList.toggle('open');
        const isOpen = navMenu.classList.contains('open');
        menuToggle.setAttribute('aria-expanded', isOpen);
        
        // Disable page scroll when menu is open on mobile
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

    menuToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking links or anywhere outside
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            document.body.style.overflow = '';
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });


    // ==========================================================================
    // 3. TABBED MENU FILTERING & SEARCH CONTROLLER
    // ==========================================================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const highlightsGrid = document.getElementById('menuHighlightsGrid');
    const catalogList = document.getElementById('menuCatalogList');
    const menuCards = document.querySelectorAll('.menu-item-card');
    const catalogSections = document.querySelectorAll('.catalog-section');
    const searchInput = document.getElementById('menuSearch');
    const emptyState = document.getElementById('menuEmptyState');

    let currentActiveCategory = 'highlights';

    const renderMenu = () => {
        const searchQuery = searchInput.value.toLowerCase().trim();

        if (searchQuery !== '') {
            // SEARCH FILTERING MODE
            emptyState.classList.add('hide');
            highlightsGrid.classList.remove('hide');
            catalogList.classList.remove('hide');

            let visibleHighlightsCount = 0;
            let visibleCatalogCount = 0;

            // Filter image card highlights
            menuCards.forEach(card => {
                const searchName = card.getAttribute('data-search-name').toLowerCase();
                const cardTitle = card.querySelector('.menu-item-title').textContent.toLowerCase();
                const cardText = card.querySelector('.menu-item-text').textContent.toLowerCase();

                if (searchName.includes(searchQuery) || cardTitle.includes(searchQuery) || cardText.includes(searchQuery)) {
                    card.classList.remove('hide');
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                    visibleHighlightsCount++;
                } else {
                    card.classList.add('hide');
                }
            });

            // Filter catalog sections & items
            catalogSections.forEach(section => {
                let sectionMatchCount = 0;
                const itemsInSection = section.querySelectorAll('.catalog-item');
                
                itemsInSection.forEach(item => {
                    const searchName = item.getAttribute('data-search-name').toLowerCase();
                    const itemName = item.querySelector('.catalog-item-name').textContent.toLowerCase();
                    const itemDesc = item.querySelector('.catalog-item-desc').textContent.toLowerCase();

                    if (searchName.includes(searchQuery) || itemName.includes(searchQuery) || itemDesc.includes(searchQuery)) {
                        item.classList.remove('hide');
                        sectionMatchCount++;
                        visibleCatalogCount++;
                    } else {
                        item.classList.add('hide');
                    }
                });

                if (sectionMatchCount > 0) {
                    section.classList.remove('hide');
                } else {
                    section.classList.add('hide');
                }
            });

            // Toggle grids and show empty state if nothing found
            if (visibleHighlightsCount === 0) {
                highlightsGrid.classList.add('hide');
            }
            if (visibleCatalogCount === 0) {
                catalogList.classList.add('hide');
            }

            if (visibleHighlightsCount === 0 && visibleCatalogCount === 0) {
                emptyState.classList.remove('hide');
            } else {
                emptyState.classList.add('hide');
            }

        } else {
            // NORMAL TAB FILTERING MODE
            emptyState.classList.add('hide');

            if (currentActiveCategory === 'highlights') {
                highlightsGrid.classList.remove('hide');
                catalogList.classList.add('hide');

                menuCards.forEach(card => {
                    card.classList.remove('hide');
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                });
            } else {
                highlightsGrid.classList.add('hide');
                catalogList.classList.remove('hide');

                // Filter catalog sections
                catalogSections.forEach(section => {
                    const sectionCategory = section.getAttribute('data-catalog-category');
                    if (sectionCategory === currentActiveCategory) {
                        section.classList.remove('hide');
                        // Show all items inside this section
                        section.querySelectorAll('.catalog-item').forEach(item => item.classList.remove('hide'));
                    } else {
                        section.classList.add('hide');
                    }
                });
            }
        }
    };

    // Category button click handling
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            currentActiveCategory = btn.getAttribute('data-category');
            
            // Clear search input on tab switch to avoid confusion
            searchInput.value = '';
            
            // Render the menu layout
            renderMenu();
        });
    });

    // Real-time search handler
    if (searchInput) {
        searchInput.addEventListener('input', renderMenu);
    }


    // ==========================================================================
    // 4. TESTIMONIAL CAROUSEL SLIDER
    // ==========================================================================
    const carousel = document.getElementById('reviewsCarousel');
    const slides = document.querySelectorAll('.review-slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('carouselDots');
    const dots = dotsContainer.querySelectorAll('.dot');

    let currentSlide = 0;
    const slideCount = slides.length;
    let autoSlideInterval;

    const updateSlider = () => {
        // Slide container transformation
        carousel.style.transform = `translateX(-${currentSlide * 100}%)`;

        // Update dot markers
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === currentSlide) {
                dot.classList.add('active');
            }
        });
    };

    const goToNextSlide = () => {
        currentSlide = (currentSlide + 1) % slideCount;
        updateSlider();
    };

    const goToPrevSlide = () => {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        updateSlider();
    };

    // Click event listeners
    if (nextBtn) nextBtn.addEventListener('click', () => {
        goToNextSlide();
        resetAutoSlide();
    });

    if (prevBtn) prevBtn.addEventListener('click', () => {
        goToPrevSlide();
        resetAutoSlide();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlider();
            resetAutoSlide();
        });
    });

    // Auto Rotation with hover pause
    const startAutoSlide = () => {
        autoSlideInterval = setInterval(goToNextSlide, 5000);
    };

    const resetAutoSlide = () => {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    };

    startAutoSlide();

    // Pause slider on hover
    const reviewSection = document.getElementById('reviews');
    if (reviewSection) {
        reviewSection.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        reviewSection.addEventListener('mouseleave', startAutoSlide);
    }

    // Touch events for mobile swiping
    let startX = 0;
    let endX = 0;

    if (carousel) {
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;

            if (Math.abs(diffX) > 50) { // minimum threshold for swipe
                if (diffX > 0) {
                    goToNextSlide();
                } else {
                    goToPrevSlide();
                }
                resetAutoSlide();
            }
        }, { passive: true });
    }


    // ==========================================================================
    // 5. INTERSECTION OBSERVER SCROLL ANIMATIONS
    // ==========================================================================
    const fadeElements = document.querySelectorAll('.fade-in-element');

    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null, // relative to viewport
            threshold: 0.1, // trigger when 10% of element is visible
            rootMargin: '0px 0px -50px 0px' // offset triggers slightly
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Stop observing once animated
                }
            });
        }, observerOptions);

        fadeElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers
        fadeElements.forEach(el => el.classList.add('visible'));
    }

});
