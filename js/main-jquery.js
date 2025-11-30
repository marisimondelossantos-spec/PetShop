$(document).ready(function() {
  const $mobileToggle = $('.mobile-toggle');
  const $navLinks = $('.nav-links');
  const $navbar = $('.navbar');

  if ($mobileToggle.length) {
    $mobileToggle.on('click', function() {
      $navLinks.toggleClass('active');

      const $icon = $(this).find('i');
      if ($navLinks.hasClass('active')) {
        $icon.removeClass('fa-bars').addClass('fa-times');
      } else {
        $icon.removeClass('fa-times').addClass('fa-bars');
      }
    });

    $('.nav-links a').on('click', function() {
      if ($(window).width() <= 768) {
        $navLinks.removeClass('active');
        $mobileToggle.find('i').removeClass('fa-times').addClass('fa-bars');
      }
    });

    $(document).on('click', function(event) {
      if (!$navbar.is(event.target) && !$navbar.has(event.target).length && $navLinks.hasClass('active')) {
        $navLinks.removeClass('active');
        $mobileToggle.find('i').removeClass('fa-times').addClass('fa-bars');
      }
    });
  }

  $(window).on('scroll', function() {
    if ($(window).scrollTop() > 50) {
      $navbar.addClass('scrolled');
    } else {
      $navbar.removeClass('scrolled');
    }
  });

  $('a[href^="#"]').on('click', function(e) {
    const href = $(this).attr('href');
    if (href !== '#') {
      e.preventDefault();
      const $target = $(href);
      if ($target.length) {
        $('html, body').animate({
          scrollTop: $target.offset().top
        }, 600);
      }
    }
  });

  let resizeTimer;
  $(window).on('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if ($(window).width() > 768 && $navLinks.hasClass('active')) {
        $navLinks.removeClass('active');
        const $icon = $mobileToggle.find('i');
        if ($icon.length) {
          $icon.removeClass('fa-times').addClass('fa-bars');
        }
      }
    }, 250);
  });
});

