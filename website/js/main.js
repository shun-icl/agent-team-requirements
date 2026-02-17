$(function () {
  // --- Header scroll effect ---
  $(window).on("scroll", function () {
    if ($(this).scrollTop() > 10) {
      $(".header").addClass("is-scrolled");
    } else {
      $(".header").removeClass("is-scrolled");
    }
  });

  // --- Hamburger menu ---
  $(".hamburger").on("click", function () {
    $(this).toggleClass("is-active");
    $(".header-nav").toggleClass("is-open");
    $("body").toggleClass("nav-open");
  });

  $(".header-nav a").on("click", function () {
    $(".hamburger").removeClass("is-active");
    $(".header-nav").removeClass("is-open");
    $("body").removeClass("nav-open");
  });

  // --- Smooth scroll ---
  $('a[href^="#"]').on("click", function (e) {
    e.preventDefault();
    var target = $($(this).attr("href"));
    if (target.length) {
      $("html, body").animate(
        { scrollTop: target.offset().top - 72 },
        600
      );
    }
  });

  // --- Fade-in on scroll ---
  function checkFadeIn() {
    $(".fade-in").each(function () {
      var top = $(this).offset().top;
      var windowBottom = $(window).scrollTop() + $(window).height();
      if (windowBottom > top + 60) {
        $(this).addClass("is-visible");
      }
    });
  }

  $(window).on("scroll", checkFadeIn);
  checkFadeIn();

  // --- Counter animation ---
  var counted = false;
  function animateCounters() {
    if (counted) return;
    var section = $(".results");
    if (!section.length) return;
    var top = section.offset().top;
    var windowBottom = $(window).scrollTop() + $(window).height();
    if (windowBottom > top + 100) {
      counted = true;
      $(".result-number").each(function () {
        var $this = $(this);
        var target = parseInt($this.data("count"), 10);
        var suffix = $this.data("suffix") || "";
        if (isNaN(target)) return;
        $({ count: 0 }).animate(
          { count: target },
          {
            duration: 1500,
            easing: "swing",
            step: function () {
              $this.text(Math.floor(this.count) + suffix);
            },
            complete: function () {
              $this.text(target + suffix);
            },
          }
        );
      });
    }
  }

  $(window).on("scroll", animateCounters);
  animateCounters();
});
