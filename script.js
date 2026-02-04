// DOM Elements
const burgerMenu = document.getElementById('burgerMenu');
const navMenu = document.getElementById('navMenu');
const cityButtons = document.querySelectorAll('.city-btn');
const citySelect = document.getElementById('city');
const bookingForm = document.getElementById('bookingForm');
const continueToPaymentBtn = document.getElementById('continueToPayment');
const paymentSection = document.getElementById('paymentSection');
const paymentMethods = document.querySelectorAll('.payment-method');
const currencyOptions = document.querySelectorAll('.currency-option');
const participantsInput = document.getElementById('participants');
const totalAmountElement = document.getElementById('totalAmount');
const trainingSelect = document.getElementById('training-type');
const selectedInfo = document.getElementById('selectedInfo');
const dateInput = document.getElementById('date');
const payNowBtn = document.getElementById('payNow');

// Training data for each city
const trainingData = {
    gdansk: [
        { value: 'sea-assault', label: 'Szkolenie Szturmu Morskiego', price: 120 },
        { value: 'vessel-defense', label: 'Obrona Statku przed Piratami', price: 150 },
        { value: 'police-preparation', label: 'Przygotowanie do Służby w Policji', price: 450 },
        { value: 'military-preparation', label: 'Przygotowanie do Służby w Armii', price: 600 }
    ],
    warsaw: [
        { value: 'building-assault', label: 'Szturm Budynków', price: 110 },
        { value: 'building-securing', label: 'Zabezpieczanie Budynków', price: 100 },
        { value: 'bank-assault', label: 'Szturm Banku z Zakładnikami', price: 180 },
        { value: 'police-preparation', label: 'Przygotowanie do Służby w Policji', price: 450 },
        { value: 'military-preparation', label: 'Przygotowanie do Służby w Armii', price: 600 }
    ],
    wroclaw: [
        { value: 'police-sniper', label: 'Kurs Snajperski dla Policji', price: 200 },
        { value: 'forest-combat', label: 'Taktyka Walki w Lesie', price: 130 },
        { value: 'field-combat', label: 'Taktyka Walki w Polu', price: 120 },
        { value: 'police-preparation', label: 'Przygotowanie do Służby w Policji', price: 450 },
        { value: 'military-preparation', label: 'Przygotowanie do Służby w Armii', price: 600 }
    ]
};

// Standard shooting options (available in all cities)
const shootingOptions = [
    { value: 'pistol', label: 'Strzelanie z Pistoletu', price: 45 },
    { value: 'rifle', label: 'Strzelanie z Karabinu', price: 60 },
    { value: 'shotgun', label: 'Strzelanie ze Strzelby', price: 55 },
    { value: 'bow', label: 'Łucznictwo', price: 40 }
];

// Exchange rates
const exchangeRates = {
    EUR: 1,
    USD: 1.1,
    PLN: 4.3
};

// Current selection state
let currentSelection = {
    city: 'gdansk',
    training: '',
    price: 0,
    currency: 'EUR',
    paymentMethod: 'card'
};

// DOM Ready
document.addEventListener('DOMContentLoaded', init);

// Initialize the page
function init() {
    console.log('Initializing Precision Shot website...');
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
    
    // Populate training options for initial city
    updateTrainingOptions('gdansk');
    
    // Add event listeners
    setupEventListeners();
    
    // Initialize animations
    initAnimations();
    
    console.log('Website initialized successfully');
}

// Set up all event listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Burger menu toggle
    burgerMenu.addEventListener('click', toggleMenu);
    
    // City selector buttons - FIXED: Added proper click handlers
    cityButtons.forEach(btn => {
        console.log(`Adding click listener for city button: ${btn.dataset.city}`);
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(`City button clicked: ${this.dataset.city}`);
            selectCity(this.dataset.city);
        });
    });
    
    // City select dropdown
    citySelect.addEventListener('change', (e) => {
        console.log(`City select changed to: ${e.target.value}`);
        selectCity(e.target.value);
        // Update active city button
        cityButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.city === e.target.value);
        });
    });
    
    // Select training buttons
    document.querySelectorAll('.select-training').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(`Training selected: ${this.dataset.training}, Price: ${this.dataset.price}`);
            selectTraining(this.dataset.training, parseFloat(this.dataset.price));
        });
    });
    
    // Select shooting option buttons
    document.querySelectorAll('.select-option').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(`Weapon selected: ${this.dataset.weapon}, Price: ${this.dataset.price}`);
            selectTraining(this.dataset.weapon, parseFloat(this.dataset.price));
        });
    });
    
    // Training select dropdown
    trainingSelect.addEventListener('change', (e) => {
        console.log(`Training select changed to: ${e.target.value}`);
        if (e.target.value) {
            const selectedOption = [...trainingSelect.options].find(opt => opt.value === e.target.value);
            if (selectedOption && selectedOption.dataset.price) {
                currentSelection.training = e.target.value;
                currentSelection.price = parseFloat(selectedOption.dataset.price);
                showSelectedInfo();
                updateTotalAmount();
            }
        }
    });
    
    // Continue to payment button
    continueToPaymentBtn.addEventListener('click', continueToPayment);
    
    // Payment method selection
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            selectPaymentMethod(this.dataset.method);
        });
    });
    
    // Currency selection
    currencyOptions.forEach(option => {
        option.addEventListener('click', function() {
            selectCurrency(this.dataset.currency);
        });
    });
    
    // Participants input
    participantsInput.addEventListener('change', updateTotalAmount);
    participantsInput.addEventListener('input', updateTotalAmount);
    
    // Form submission
    if (payNowBtn) {
        payNowBtn.addEventListener('click', handleFormSubmit);
    }
    
    // Close menu when clicking on a link
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                toggleMenu();
            }
        });
    });
    
    // Window resize handler
    window.addEventListener('resize', handleResize);
    
    console.log('Event listeners set up successfully');
}

// Toggle mobile menu
function toggleMenu() {
    console.log('Toggling menu');
    burgerMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

// Select city - FIXED: Properly shows content for selected city
function selectCity(city) {
    console.log(`Selecting city: ${city}`);
    
    // Update current selection
    currentSelection.city = city;
    
    // Update UI - city buttons
    cityButtons.forEach(btn => {
        const isActive = btn.dataset.city === city;
        btn.classList.toggle('active', isActive);
        console.log(`Button ${btn.dataset.city} active: ${isActive}`);
    });
    
    // Update city select dropdown
    citySelect.value = city;
    
    // Hide all city content sections
    document.querySelectorAll('.city-content').forEach(content => {
        content.classList.remove('active');
        console.log(`Hiding: ${content.id}`);
    });
    
    // Show content for selected city
    const trainingContent = document.getElementById(`${city}-training`);
    const preparationContent = document.getElementById(`${city}-preparation`);
    
    if (trainingContent) {
        trainingContent.classList.add('active');
        console.log(`Showing training for: ${city}`);
    }
    
    if (preparationContent) {
        preparationContent.classList.add('active');
        console.log(`Showing preparation for: ${city}`);
    }
    
    // Update training options dropdown
    updateTrainingOptions(city);
    
    // Filter client logos
    filterClientLogos(city);
    
    // Smooth scroll to training section if we're not at the top
    if (window.scrollY > 300) {
        document.getElementById('training').scrollIntoView({
            behavior: 'smooth'
        });
    }
}

// Update training options dropdown
function updateTrainingOptions(city) {
    console.log(`Updating training options for: ${city}`);
    
    // Clear existing options except the first one
    trainingSelect.innerHTML = '<option value="">Wybierz rodzaj szkolenia</option>';
    
    // Add city-specific trainings
    const cityTrainings = trainingData[city];
    if (cityTrainings) {
        const cityName = city.charAt(0).toUpperCase() + city.slice(1);
        const optgroup = document.createElement('optgroup');
        optgroup.label = cityName;
        
        cityTrainings.forEach(training => {
            const option = document.createElement('option');
            option.value = training.value;
            option.textContent = training.label;
            option.dataset.price = training.price;
            optgroup.appendChild(option);
        });
        
        trainingSelect.appendChild(optgroup);
    }
    
    // Add standard shooting options
    const shootingOptgroup = document.createElement('optgroup');
    shootingOptgroup.label = 'Standardowe Strzelanie';
    
    shootingOptions.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option.value;
        opt.textContent = option.label;
        opt.dataset.price = option.price;
        shootingOptgroup.appendChild(opt);
    });
    
    trainingSelect.appendChild(shootingOptgroup);
}

// Filter client logos by city
function filterClientLogos(city) {
    console.log(`Filtering client logos for: ${city}`);
    const clientLogos = document.querySelectorAll('.client-logo');
    
    clientLogos.forEach(logo => {
        const logoCity = logo.dataset.city;
        const isVisible = logoCity === 'all' || logoCity === city;
        logo.style.display = isVisible ? 'flex' : 'none';
        logo.style.opacity = isVisible ? '1' : '0.3';
        
        if (isVisible) {
            setTimeout(() => {
                logo.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    logo.style.transform = 'scale(1)';
                }, 300);
            }, 100);
        }
    });
}

// Select training
function selectTraining(training, price) {
    console.log(`Selecting training: ${training}, Price: ${price}`);
    
    // Update current selection
    currentSelection.training = training;
    currentSelection.price = price;
    
    // Update dropdown
    trainingSelect.value = training;
    
    // Show selected info
    showSelectedInfo();
    
    // Scroll to booking form
    setTimeout(() => {
        document.getElementById('booking').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }, 300);
}

// Show selected training info
function showSelectedInfo() {
    const selectedOption = [...trainingSelect.options].find(opt => opt.value === currentSelection.training);
    if (selectedOption && currentSelection.price > 0) {
        const participants = participantsInput.value || 1;
        const totalInEUR = currentSelection.price * participants;
        
        selectedInfo.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <i class="fas fa-check-circle" style="color: var(--primary-color); font-size: 1.5rem;"></i>
                <div>
                    <h4 style="margin: 0 0 5px 0; color: var(--primary-color);">✓ Wybrano</h4>
                    <p style="margin: 0 0 5px 0; font-weight: 600;">${selectedOption.textContent}</p>
                    <p style="margin: 0; color: #ccc; font-size: 0.9rem;">
                        ${participants} × ${currentSelection.price} € = ${totalInEUR.toFixed(2)} €
                    </p>
                </div>
            </div>
        `;
        selectedInfo.classList.add('active');
        
        // Animate the info box
        selectedInfo.style.animation = 'none';
        setTimeout(() => {
            selectedInfo.style.animation = 'fadeIn 0.3s ease';
        }, 10);
        
        console.log('Selected info updated');
    }
}

// Select payment method
function selectPaymentMethod(method) {
    console.log(`Selecting payment method: ${method}`);
    
    currentSelection.paymentMethod = method;
    
    paymentMethods.forEach(m => {
        m.classList.toggle('active', m.dataset.method === method);
    });
    
    // Show/hide installment options
    const installmentOptions = document.getElementById('installmentOptions');
    if (installmentOptions) {
        installmentOptions.style.display = method === 'installments' ? 'block' : 'none';
    }
}

// Select currency
function selectCurrency(currency) {
    console.log(`Selecting currency: ${currency}`);
    
    currentSelection.currency = currency;
    
    currencyOptions.forEach(opt => {
        opt.classList.toggle('active', opt.dataset.currency === currency);
    });
    
    updateTotalAmount();
}

// Update total amount display
function updateTotalAmount() {
    if (currentSelection.price === 0) return;
    
    const participants = parseInt(participantsInput.value) || 1;
    const totalInEUR = currentSelection.price * participants;
    const totalInSelectedCurrency = totalInEUR * exchangeRates[currentSelection.currency];
    
    let formattedAmount;
    switch(currentSelection.currency) {
        case 'EUR':
            formattedAmount = `€${totalInSelectedCurrency.toFixed(2)}`;
            break;
        case 'USD':
            formattedAmount = `$${totalInSelectedCurrency.toFixed(2)}`;
            break;
        case 'PLN':
            formattedAmount = `${totalInSelectedCurrency.toFixed(2)} zł`;
            break;
        default:
            formattedAmount = `${totalInSelectedCurrency.toFixed(2)} €`;
    }
    
    totalAmountElement.innerHTML = `<i class="fas fa-receipt"></i> Do zapłaty: <span>${formattedAmount}</span>`;
    
    // Update exchange rate display
    const exchangeRateElement = document.getElementById('exchangeRate');
    if (exchangeRateElement) {
        exchangeRateElement.innerHTML = `
            <i class="fas fa-exchange-alt"></i> Kurs: 
            1 EUR = ${exchangeRates.PLN.toFixed(2)} PLN, 
            1 USD = ${(exchangeRates.USD * exchangeRates.PLN).toFixed(2)} PLN
        `;
    }
    
    // Update selected info if it's visible
    if (selectedInfo && selectedInfo.classList.contains('active')) {
        showSelectedInfo();
    }
    
    console.log(`Total updated: ${formattedAmount}`);
}

// Continue to payment
function continueToPayment() {
    console.log('Continuing to payment...');
    
    // Validate form
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const trainingType = trainingSelect.value;
    const date = dateInput.value;
    
    if (!name) {
        alert('Proszę podać imię i nazwisko.');
        document.getElementById('name').focus();
        return;
    }
    
    if (!email) {
        alert('Proszę podać adres email.');
        document.getElementById('email').focus();
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Proszę podać poprawny adres email.');
        document.getElementById('email').focus();
        return;
    }
    
    if (!phone) {
        alert('Proszę podać numer telefonu.');
        document.getElementById('phone').focus();
        return;
    }
    
    // Phone validation
    const phoneRegex = /^[\d\s\-\+\(\)]{9,}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        alert('Proszę podać poprawny numer telefonu (minimum 9 cyfr).');
        document.getElementById('phone').focus();
        return;
    }
    
    if (!trainingType) {
        alert('Proszę wybrać rodzaj szkolenia.');
        trainingSelect.focus();
        return;
    }
    
    if (!date) {
        alert('Proszę wybrać datę.');
        dateInput.focus();
        return;
    }
    
    // Show payment section
    paymentSection.classList.add('active');
    paymentSection.style.display = 'block';
    
    // Update total amount
    updateTotalAmount();
    
    // Animate the payment section
    paymentSection.style.animation = 'none';
    setTimeout(() => {
        paymentSection.style.animation = 'slideInUp 0.3s ease';
    }, 10);
    
    // Scroll to payment section
    setTimeout(() => {
        paymentSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }, 100);
    
    console.log('Payment section shown');
}

// Handle form submission
function handleFormSubmit(e) {
    if (e) e.preventDefault();
    
    console.log('Handling form submission...');
    
    if (!currentSelection.training || currentSelection.price === 0) {
        alert('Proszę wybrać szkolenie przed dokonaniem płatności.');
        return;
    }
    
    // Get form values
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        city: citySelect.options[citySelect.selectedIndex].text,
        training: trainingSelect.options[trainingSelect.selectedIndex].textContent,
        date: dateInput.value,
        participants: participantsInput.value,
        paymentMethod: currentSelection.paymentMethod,
        currency: currentSelection.currency,
        totalAmount: calculateTotal()
    };
    
    // Show loading state
    const submitBtn = payNowBtn;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Przetwarzanie...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        showConfirmation(formData);
        
        // Reset form
        resetForm();
        
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        console.log('Form submitted successfully');
    }, 2000);
}

// Calculate total amount
function calculateTotal() {
    const participants = parseInt(participantsInput.value) || 1;
    const totalInEUR = currentSelection.price * participants;
    const totalInSelectedCurrency = totalInEUR * exchangeRates[currentSelection.currency];
    
    // Apply installment fee if selected
    if (currentSelection.paymentMethod === 'installments') {
        const installmentOption = document.querySelector('input[name="installment"]:checked');
        if (installmentOption) {
            const installments = parseInt(installmentOption.value);
            const fees = { 3: 0, 6: 0.02, 12: 0.05 };
            const fee = fees[installments] || 0;
            return (totalInSelectedCurrency * (1 + fee)) / installments;
        }
    }
    
    return totalInSelectedCurrency;
}

// Show confirmation message
function showConfirmation(formData) {
    const paymentMethodNames = {
        'card': 'Karta kredytowa',
        'apple-pay': 'Apple Pay',
        'google-pay': 'Google Pay',
        'installments': 'Raty'
    };
    
    const currencySymbols = {
        'EUR': '€',
        'USD': '$',
        'PLN': 'zł'
    };
    
    const message = `
        ✅ Rezerwacja została potwierdzona!
        
        Dziękujemy, ${formData.name}!
        
        📋 Szczegóły rezerwacji:
        • Szkolenie: ${formData.training}
        • Miasto: ${formData.city}
        • Data: ${new Date(formData.date).toLocaleDateString('pl-PL')}
        • Liczba osób: ${formData.participants}
        • Płatność: ${paymentMethodNames[formData.paymentMethod]} w ${formData.currency}
        • Do zapłaty: ${formData.totalAmount.toFixed(2)} ${currencySymbols[formData.currency]}
        
        Potwierdzenie zostało wysłane na adres: ${formData.email}
        
        Do zobaczenia na strzelnicy! 🎯
    `;
    
    alert(message);
    
    // You could also show a modal here instead of alert
    // showModal(message);
}

// Reset form
function resetForm() {
    console.log('Resetting form...');
    
    bookingForm.reset();
    currentSelection = {
        city: 'gdansk',
        training: '',
        price: 0,
        currency: 'EUR',
        paymentMethod: 'card'
    };
    
    if (selectedInfo) {
        selectedInfo.classList.remove('active');
        selectedInfo.innerHTML = '';
    }
    
    if (paymentSection) {
        paymentSection.classList.remove('active');
        paymentSection.style.display = 'none';
    }
    
    // Reset to initial state
    selectCity('gdansk');
    updateTrainingOptions('gdansk');
    selectPaymentMethod('card');
    selectCurrency('EUR');
    
    // Reset date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    
    console.log('Form reset successfully');
}

// Initialize animations
function initAnimations() {
    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.training-card, .preparation-card, .option-card, .instructor-card').forEach(el => {
        observer.observe(el);
    });
}

// Handle window resize
function handleResize() {
    if (window.innerWidth > 768) {
        if (burgerMenu.classList.contains('active')) {
            burgerMenu.classList.remove('active');
        }
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
        document.body.style.overflow = '';
    }
}

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Close menu on Escape
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        toggleMenu();
    }
    
    // Navigate city buttons with arrow keys when focused
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const activeCityBtn = document.querySelector('.city-btn.active');
        if (activeCityBtn && document.activeElement === activeCityBtn) {
            e.preventDefault();
            const cityBtns = Array.from(cityButtons);
            const currentIndex = cityBtns.indexOf(activeCityBtn);
            let nextIndex;
            
            if (e.key === 'ArrowRight') {
                nextIndex = (currentIndex + 1) % cityBtns.length;
            } else {
                nextIndex = (currentIndex - 1 + cityBtns.length) % cityBtns.length;
            }
            
            selectCity(cityBtns[nextIndex].dataset.city);
            cityBtns[nextIndex].focus();
        }
    }
});

// Add debug logging for troubleshooting
console.log('Precision Shot JavaScript loaded');