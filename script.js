
/* =========================================================
   rKind SCENTS
   Main JavaScript
========================================================= */

const EMAILJS_PUBLIC_KEY = "_xcZCSoFsKQyUXarQ";
const EMAILJS_SERVICE_ID = "service_glr8fad";
const EMAILJS_TEMPLATE_ID = "template_v6i8759";

document.addEventListener("DOMContentLoaded", () => {
    initEmailJS();
    initMobileNavigation();
    initNavbarScroll();
    initActiveNavigation();
    initContactForm();
    initScrollReveal();
    initCurrentYear();
});

/* =========================================================
   EMAILJS INITIALIZATION
========================================================= */

function initEmailJS() {
    if (!window.emailjs) {
        console.error("EmailJS library was not loaded.");
        return false;
    }

    try {
        window.emailjs.init({
            publicKey: EMAILJS_PUBLIC_KEY
        });

        console.log("rKind SCENTS EmailJS initialized.");
        return true;
    } catch (error) {
        console.error("EmailJS initialization failed:", error);
        return false;
    }
}

/* =========================================================
   MOBILE NAVIGATION
========================================================= */

function initMobileNavigation() {
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const navMenu = document.querySelector(".nav-menu");

    if (!mobileMenuBtn || !navMenu) return;

    function closeMenu() {
        navMenu.classList.remove("show");
        mobileMenuBtn.textContent = "☰";
        mobileMenuBtn.setAttribute("aria-expanded", "false");
    }

    mobileMenuBtn.addEventListener("click", (event) => {
        event.stopPropagation();

        const isOpen = navMenu.classList.toggle("show");

        mobileMenuBtn.textContent = isOpen ? "×" : "☰";
        mobileMenuBtn.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );
    });

    navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
        if (
            navMenu.classList.contains("show") &&
            !navMenu.contains(event.target) &&
            !mobileMenuBtn.contains(event.target)
        ) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 991) {
            closeMenu();
        }
    });
}

/* =========================================================
   NAVBAR SCROLL EFFECT
========================================================= */

function initNavbarScroll() {
    const navbar = document.querySelector(".navbar");

    if (!navbar) return;

    function updateNavbar() {
        navbar.classList.toggle("navbar-scrolled", window.scrollY > 40);
    }

    window.addEventListener("scroll", updateNavbar, { passive: true });
    updateNavbar();
}

/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

function initActiveNavigation() {
    const sections = document.querySelectorAll("section[id]");
    const navigationLinks = document.querySelectorAll(
        '.nav-menu a[href^="#"]'
    );

    if (!sections.length || !navigationLinks.length) return;

    function updateActiveNav() {
        let currentSection = "";
        const scrollPosition = window.scrollY + 180;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (
                scrollPosition >= sectionTop &&
                scrollPosition < sectionBottom
            ) {
                currentSection = section.id;
            }
        });

        navigationLinks.forEach((link) => {
            const target = link.getAttribute("href");
            link.classList.toggle(
                "active",
                target === `#${currentSection}`
            );
        });
    }

    window.addEventListener("scroll", updateActiveNav, {
        passive: true
    });

    updateActiveNav();
}

/* =========================================================
   CONTACT FORM - EMAILJS
========================================================= */

function initContactForm() {
    const form = document.getElementById("contactForm");
    const status = document.getElementById("formMessage");

    if (!form) {
        console.warn("rKind SCENTS contact form not found.");
        return;
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        clearFormMessage(status);

        // Confirm EmailJS is available
        if (!window.emailjs) {
            showFormMessage(
                status,
                "Email service is currently unavailable. Please try again later.",
                "error"
            );
            return;
        }

        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonHTML = submitButton
            ? submitButton.innerHTML
            : "";

        const name = document.getElementById("name")?.value.trim() || "";
        const company = document.getElementById("company")?.value.trim() || "";
        const email = document.getElementById("email")?.value.trim() || "";
        const phone = document.getElementById("phone")?.value.trim() || "";
        const space = document.getElementById("space")?.value.trim() || "";
        const message = document.getElementById("message")?.value.trim() || "";

        // Required field validation
        if (!name || !email || !phone || !message) {
    showFormMessage(
        status,
        "Please complete your name, email, phone number and requirements.",
        "error"
    );
    return;
}

        // Email format validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            showFormMessage(
                status,
                "Please enter a valid email address.",
                "error"
            );
            return;
        }

        // Prevent duplicate submissions
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Sending...";
            submitButton.style.opacity = "0.7";
            submitButton.style.cursor = "not-allowed";
        }

        // These names must match the variables in your EmailJS template.
        const templateParams = {
            name: name,
            company: company,
            email: email,
            phone: phone,
            space: space,
            message: message
        };

        try {
            const response = await window.emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams
            );

            console.log("EmailJS success:", response.status, response.text);

            showFormMessage(
                status,
                "Thank you! Your enquiry has been sent successfully. Our team will get back to you soon.",
                "success"
            );

            form.reset();

        } catch (error) {
            console.error("rKind SCENTS EmailJS error:", error);

            let errorMessage =
                "Unable to send your enquiry right now. Please try again.";

            if (error?.text) {
                console.error("EmailJS details:", error.text);
                errorMessage = `EmailJS Error: ${error.text}`;
            }

            showFormMessage(status, errorMessage, "error");

        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonHTML;
                submitButton.style.opacity = "";
                submitButton.style.cursor = "";
            }
        }
    });
}

/* =========================================================
   FORM STATUS MESSAGE
========================================================= */

function showFormMessage(element, message, type) {
    if (!element) return;

    element.textContent = message;
    element.classList.remove("success", "error");
    element.classList.add(type);
    element.style.display = "block";

    if (window.innerWidth <= 767) {
        element.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    }
}

function clearFormMessage(element) {
    if (!element) return;

    element.textContent = "";
    element.classList.remove("success", "error");
    element.style.display = "none";
}

/* =========================================================
   SCROLL REVEAL
========================================================= */

function initScrollReveal() {
    const revealElements = document.querySelectorAll(`
        .section-heading,
        .about-text,
        .about-feature,
        .why-card,
        .process-item,
        .industry-card,
        .cta-content,
        .contact-content,
        .contact-form-wrapper
    `);

    if (!revealElements.length) return;

    if (!("IntersectionObserver" in window)) {
        revealElements.forEach((element) => {
            element.classList.add("reveal-visible");
        });
        return;
    }

    revealElements.forEach((element) => {
        element.classList.add("reveal");
    });

    const observer = new IntersectionObserver(
        (entries, observerInstance) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("reveal-visible");
                    observerInstance.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.08,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    revealElements.forEach((element) => {
        observer.observe(element);
    });
}

/* =========================================================
   CURRENT YEAR
========================================================= */

function initCurrentYear() {
    const yearElements = document.querySelectorAll(".current-year");
    const year = new Date().getFullYear();

    yearElements.forEach((element) => {
        element.textContent = year;
    });

    // Update existing copyright text if no year placeholder exists.
    const footerBottom = document.querySelector(".footer-bottom");

    if (footerBottom && !yearElements.length) {
        const copyright = Array.from(footerBottom.children).find(
            (element) => element.textContent.includes("©")
        );

        if (copyright) {
            copyright.textContent =
                `© ${year} rKind SCENTS. All rights reserved.`;
        }
    }
}

/* =========================================================
   SMOOTH ANCHOR SCROLL
========================================================= */

document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');

    if (!link) return;

    const targetID = link.getAttribute("href");

    if (!targetID || targetID === "#") return;

    const target = document.querySelector(targetID);

    if (!target) return;

    event.preventDefault();

    const navbar = document.querySelector(".navbar");
    const navbarHeight = navbar ? navbar.offsetHeight : 0;

    const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        navbarHeight;

    window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
    });
});
