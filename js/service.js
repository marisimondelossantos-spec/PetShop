// Services Data
const servicesData = [
  {
    id: 1,
    name: 'Dog Grooming',
    category: 'Grooming',
    description: 'Complete grooming package including bath, haircut, nail trimming, ear cleaning, and teeth brushing. Our professional groomers ensure your dog looks and feels their best.',
    price: 45.00,
    duration: 90,
    branches: ['Downtown Branch', 'Northside Branch', 'Westfield Branch'],
    icon: '✂️',
    popular: true
  },
  {
    id: 2,
    name: 'Cat Grooming',
    category: 'Grooming',
    description: 'Gentle grooming service for cats including bath, brushing, nail trimming, and sanitary trim. Specialized care for feline comfort and safety.',
    price: 40.00,
    duration: 60,
    branches: ['Downtown Branch', 'Northside Branch'],
    icon: '🐱',
    popular: false
  },
  {
    id: 3,
    name: 'Pet Boarding (Per Night)',
    category: 'Boarding',
    description: 'Safe and comfortable overnight boarding with spacious accommodations, regular exercise, feeding schedule, and 24/7 supervision for your peace of mind.',
    price: 35.00,
    duration: 1440,
    branches: ['Downtown Branch', 'Westfield Branch'],
    icon: '🏠',
    popular: true
  },
  {
    id: 4,
    name: 'Daycare Service',
    category: 'Boarding',
    description: 'Full-day care service with supervised playtime, socialization activities, meals, and rest periods. Perfect for busy pet parents.',
    price: 25.00,
    duration: 480,
    branches: ['Downtown Branch', 'Northside Branch', 'Westfield Branch'],
    icon: '☀️',
    popular: false
  },
  {
    id: 5,
    name: 'Vaccination',
    category: 'Health',
    description: 'Essential vaccinations administered by licensed veterinarians. Includes health check-up and vaccination record updates.',
    price: 50.00,
    duration: 30,
    branches: ['Downtown Branch', 'Northside Branch'],
    icon: '💉',
    popular: true
  },
  {
    id: 6,
    name: 'Health Check-up',
    category: 'Health',
    description: 'Comprehensive physical examination including weight check, temperature, heart rate, dental inspection, and general health assessment.',
    price: 60.00,
    duration: 45,
    branches: ['Downtown Branch', 'Northside Branch', 'Westfield Branch'],
    icon: '🩺',
    popular: false
  },
  {
    id: 7,
    name: 'Basic Obedience Training',
    category: 'Training',
    description: '4-week program teaching essential commands: sit, stay, come, down, and leash walking. Positive reinforcement methods used.',
    price: 200.00,
    duration: 240,
    branches: ['Downtown Branch', 'Westfield Branch'],
    icon: '🎓',
    popular: true
  },
  {
    id: 8,
    name: 'Puppy Training',
    category: 'Training',
    description: 'Specialized training for puppies focusing on socialization, potty training, bite inhibition, and basic manners. Ages 8 weeks to 6 months.',
    price: 180.00,
    duration: 180,
    branches: ['Downtown Branch', 'Northside Branch'],
    icon: '🐕',
    popular: false
  },
  {
    id: 9,
    name: 'Nail Trimming',
    category: 'Grooming',
    description: 'Professional nail trimming service to keep your pet comfortable and prevent overgrowth. Quick and stress-free experience.',
    price: 15.00,
    duration: 20,
    branches: ['Downtown Branch', 'Northside Branch', 'Westfield Branch'],
    icon: '✨',
    popular: false
  },
  {
    id: 10,
    name: 'Dental Cleaning',
    category: 'Health',
    description: 'Professional dental cleaning under sedation to remove tartar, plaque, and prevent dental disease. Includes pre-anesthetic blood work.',
    price: 250.00,
    duration: 120,
    branches: ['Downtown Branch'],
    icon: '🦷',
    popular: false
  },
  {
    id: 11,
    name: 'Flea & Tick Treatment',
    category: 'Health',
    description: 'Comprehensive flea and tick prevention treatment with veterinary-grade products. Safe and effective for all breeds.',
    price: 35.00,
    duration: 30,
    branches: ['Downtown Branch', 'Northside Branch', 'Westfield Branch'],
    icon: '🛡️',
    popular: false
  },
  {
    id: 12,
    name: 'Advanced Training',
    category: 'Training',
    description: 'Advanced skills training including off-leash control, distance commands, and distraction training. For dogs with basic obedience foundation.',
    price: 280.00,
    duration: 300,
    branches: ['Westfield Branch'],
    icon: '🏆',
    popular: false
  }
];

// Global Variables
let currentCategory = 'all';
let selectedServiceData = null;

// Initialize
document.addEventListener('DOMContentLoaded', function () {
  renderServices(servicesData);
  setupCategoryFilter();
  setupModal();
  setupForm();
  setMinDate();
});

// Render Services
function renderServices(services) {
  const grid = document.getElementById('servicesGrid');
  grid.innerHTML = '';

  const filteredServices = currentCategory === 'all'
    ? services
    : services.filter(s => s.category === currentCategory);

  filteredServices.forEach(service => {
    const card = createServiceCard(service);
    grid.appendChild(card);
  });
}

// Create Service Card
function createServiceCard(service) {
  const card = document.createElement('article');
  card.className = 'service-card';
  card.setAttribute('data-service-id', service.id);

  const durationText = service.duration >= 1440
    ? `${service.duration / 1440} day${service.duration / 1440 > 1 ? 's' : ''}`
    : service.duration >= 60
      ? `${service.duration / 60} hour${service.duration / 60 > 1 ? 's' : ''}`
      : `${service.duration} min`;

  card.innerHTML = `
    <div class="service-card__header">
      ${service.popular ? '<span class="service-card__badge">Popular</span>' : ''}
      <span class="service-card__icon">${service.icon}</span>
      <div class="service-card__category">${service.category}</div>
      <h2 class="service-card__title">${service.name}</h2>
      <p class="service-card__description">${service.description}</p>
    </div>
    <div class="service-card__body">
      <div class="service-card__details">
        <div class="service-detail">
          <div class="service-detail__icon">
            <i class="fas fa-clock"></i>
          </div>
          <span class="service-detail__label">Duration:</span>
          <span class="service-detail__value">${durationText}</span>
        </div>
      </div>
      <div class="service-card__price">$${service.price.toFixed(2)}</div>
      <div class="service-card__branches">
        <span class="service-card__branches-label">Available at:</span>
        <div>
          ${service.branches.map(branch => `<span class="branch-tag"><i class="fas fa-map-marker-alt"></i> ${branch}</span>`).join('')}
        </div>
      </div>
    </div>
    <div class="service-card__footer">
      <button class="btn-book" data-service-id="${service.id}">
        <i class="fas fa-calendar-check"></i>
        Book Appointment
      </button>
    </div>
  `;

  // Add event listener to book button
  const bookBtn = card.querySelector('.btn-book');
  bookBtn.addEventListener('click', () => openModal(service));

  return card;
}

// Setup Category Filter
function setupCategoryFilter() {
  const categoryBtns = document.querySelectorAll('.category-btn');

  categoryBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      // Remove active class from all buttons
      categoryBtns.forEach(b => b.classList.remove('active'));

      // Add active class to clicked button
      this.classList.add('active');

      // Update current category
      currentCategory = this.getAttribute('data-category');

      // Re-render services
      renderServices(servicesData);
    });
  });
}

// Setup Modal
function setupModal() {
  const modal = document.getElementById('appointmentModal');
  const closeBtn = document.getElementById('closeModal');

  // Close modal on close button click
  closeBtn.addEventListener('click', closeModal);

  // Close modal on outside click
  modal.addEventListener('click', function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close modal on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// Open Modal
function openModal(service) {
  selectedServiceData = service;
  const modal = document.getElementById('appointmentModal');

  // Update modal content
  document.getElementById('modalServiceName').textContent = service.name;
  document.getElementById('modalPrice').textContent = `$${service.price.toFixed(2)}`;

  const durationText = service.duration >= 1440
    ? `${service.duration / 1440} day${service.duration / 1440 > 1 ? 's' : ''}`
    : service.duration >= 60
      ? `${service.duration / 60} hour${service.duration / 60 > 1 ? 's' : ''}`
      : `${service.duration} minutes`;

  document.getElementById('modalDuration').innerHTML = `<i class="fas fa-clock"></i> ${durationText}`;

  // Render branch options
  renderBranchOptions(service.branches);

  // Show modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close Modal
function closeModal() {
  const modal = document.getElementById('appointmentModal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';

  // Reset form
  document.getElementById('appointmentForm').reset();
}

// Render Branch Options
function renderBranchOptions(branches) {
  const container = document.getElementById('branchOptions');
  container.innerHTML = '';

  branches.forEach((branch, index) => {
    const option = document.createElement('div');
    option.className = 'branch-option';
    option.innerHTML = `
      <input type="radio" id="branch-${index}" name="branch" value="${branch}" ${index === 0 ? 'required' : ''}>
      <label for="branch-${index}">
        <i class="fas fa-map-marker-alt"></i>
        ${branch}
      </label>
    `;
    container.appendChild(option);
  });
}

// Set Minimum Date
function setMinDate() {
  const dateInput = document.getElementById('appointmentDate');
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const minDate = tomorrow.toISOString().split('T')[0];
  dateInput.setAttribute('min', minDate);
}

// Setup Form
function setupForm() {
  const form = document.getElementById('appointmentForm');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form data
    const formData = {
      service: selectedServiceData.name,
      serviceId: selectedServiceData.id,
      petName: document.getElementById('petName').value,
      petType: document.getElementById('petType').value,
      branch: document.querySelector('input[name="branch"]:checked').value,
      date: document.getElementById('appointmentDate').value,
      time: document.getElementById('appointmentTime').value,
      ownerName: document.getElementById('ownerName').value,
      ownerPhone: document.getElementById('ownerPhone').value,
      ownerEmail: document.getElementById('ownerEmail').value,
      notes: document.getElementById('notes').value,
      price: selectedServiceData.price,
      duration: selectedServiceData.duration
    };

    // Log appointment data (in real app, send to server)
    console.log('Appointment Booked:', formData);

    // Close modal
    closeModal();

    // Show success message
    showSuccessMessage();

    // Reset form
    form.reset();
  });
}

// Show Success Message
function showSuccessMessage() {
  const successMsg = document.getElementById('successMessage');
  successMsg.classList.add('active');

  // Hide after 3 seconds
  setTimeout(() => {
    successMsg.classList.remove('active');
  }, 3000);
}