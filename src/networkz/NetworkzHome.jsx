import React, { useState, useEffect } from 'react';
import './NetworkzHome.css';
import { COURSE_DETAILS } from './data/courseData';

/* ─── DATA FOR ALL 13 HANDCRAFTED SECTIONS ───────────────────────── */

const FEATURES_DATA = [
  {
    num: '01',
    title: 'ISO 9001:2015 CERTIFIED ACADEMY',
    desc: 'Globally accredited technical curriculum engineered to meet rigorous international enterprise standards.'
  },
  {
    num: '02',
    title: 'PEARSON VUE AUTHORIZED LABS',
    desc: 'Official testing center infrastructure for Cisco CCNA, AWS, Azure, and CEH international certifications.'
  },
  {
    num: '03',
    title: '100% PLACEMENT CELL GUARANTEE',
    desc: 'Dedicated career placement cell offering resume engineering, mock interviews, and direct hiring drives.'
  }
];

const TESTIMONIALS_DATA = [
  {
    quote: "Networkz Systems transformed my career trajectory. Within 3 months of completing the Python Full Stack program, I secured a Senior Developer role at an MNC.",
    name: "Janeeta James",
    role: "Senior Full Stack Engineer",
    company: "Technopark"
  },
  {
    quote: "The live hands-on cyber lab experience in Kollam gave me real-world penetration testing skills that set me apart during technical interviews.",
    name: "Akhil P",
    role: "SOC Security Analyst",
    company: "Cyber Defense"
  },
  {
    quote: "Exceptional faculty and structured curriculum. The AWS Cloud Architecture course provided practical knowledge that directly translates to client projects.",
    name: "Rahul R",
    role: "Cloud Solutions Architect",
    company: "Infosys"
  }
];

const CATEGORIES_DATA = [
  {
    id: 1,
    title: "SOFTWARE PRODUCT TRAINING",
    count: "12 Advanced Programs",
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    link: "#catalog"
  },
  {
    id: 2,
    title: "AI & ELECTRONICS",
    count: "6 Specialized Master Tracks",
    img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
    link: "#catalog"
  },
  {
    id: 3,
    title: "NETWORKING & CYBER SECURITY",
    count: "6 Enterprise Certifications",
    img: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
    link: "#catalog"
  },
  {
    id: 4,
    title: "BUSINESS & DIGITAL MARKETING",
    count: "3 Professional Diplomas",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    link: "#catalog"
  }
];

const PROCESS_STEPS = [
  {
    num: "01",
    title: "DISCOVERY & ADVISORY",
    desc: "1-on-1 career consultation with senior tech leads to select the optimal specialization aligned with your goal."
  },
  {
    num: "02",
    title: "HANDS-ON LAB MASTERY",
    desc: "Intensive 100% practical training in live server room environments and high-performance computing labs."
  },
  {
    num: "03",
    title: "REAL CLIENT PROJECTS",
    desc: "Build production-grade applications and conduct live security audits to construct an elite portfolio."
  },
  {
    num: "04",
    title: "GLOBAL CAREER PLACEMENT",
    desc: "Direct recruitment drives with top IT enterprises, resume engineering, and continuous interview mentoring."
  }
];

const FAQ_DATA = [
  {
    q: "What certifications will I receive upon completing a program at Networkz Systems?",
    a: "You receive official Networkz Systems course completion certificates along with preparation for international certifications including Cisco CCNA, AWS Solutions Architect, Microsoft Azure, and Pearson VUE accredited credentials."
  },
  {
    q: "Are the training programs 100% practical or theoretical?",
    a: "All programs are structured with an 80% practical live lab focus and 20% conceptual foundation. You work directly on enterprise hardware, server racks, and live codebases."
  },
  {
    q: "How does the 100% Placement Support program work?",
    a: "Our dedicated placement cell conducts mock technical interviews, resume refinement, soft-skills workshops, and routes your profile to our network of 200+ partner tech companies across Kerala, Tamil Nadu, and Karnataka."
  },
  {
    q: "Can non-computer science students enroll in Software and AI courses?",
    a: "Yes. Our foundation modules start from core logic building (C/C++ & Python fundamentals) before progressing to advanced full-stack framework engineering."
  }
];

export default function NetworkzHome() {
  const [activeCategoryTab, setActiveCategoryTab] = useState('SOFTWARE');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [selectedCourseModal, setSelectedCourseModal] = useState(null);
  const [selectedEnrollmentCourse, setSelectedEnrollmentCourse] = useState(null);
  const [enrollmentSubmitted, setEnrollmentSubmitted] = useState(false);
  const [contactFormSubmitted, setContactFormSubmitted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Flatten courses for searching/filtering
  const allCourses = Object.entries(COURSE_DETAILS).flatMap(([catId, cat]) =>
    cat.courses.map((c) => ({ ...c, catId, catName: cat.category }))
  );

  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.level.toLowerCase().includes(searchQuery.toLowerCase());

    // If searching, search across all categories regardless of active category tab
    if (searchQuery.trim() !== '') {
      return matchesSearch;
    }

    const matchesTab =
      activeCategoryTab === 'ALL' ||
      (activeCategoryTab === 'SOFTWARE' && course.catId === '1') ||
      (activeCategoryTab === 'AI' && course.catId === '2') ||
      (activeCategoryTab === 'NETWORK' && course.catId === '3') ||
      (activeCategoryTab === 'BUSINESS' && course.catId === '4') ||
      (activeCategoryTab === 'INTERNSHIP' && course.catId === '5');

    return matchesTab;
  });

  useEffect(() => {
    document.title = "Networkz Systems Kollam | #1 CCNA, Python, Java & Cyber Security Institute in Kerala";
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (canonicalEl) {
      canonicalEl.setAttribute('href', 'https://nskollam.com/');
    }
  }, []);

  // Close mobile drawer on desktop resize or escape key
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1100) {
        setMobileMenuOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="nz-luxury-root">

      {/* ─── SECTION 1: LUXURY STICKY HEADER NAVIGATION ─────────────── */}
      <nav className="nz-luxury-nav">
        <a href="/" className="nz-nav-brand">
          <img src="/nsk.jpeg" alt="Networkz Systems" className="nz-brand-emblem-img" />
          <span className="nz-brand-name">NETWORKZ SYSTEMS</span>
          <span className="nz-brand-tag">KOLLAM CAMPUS</span>
        </a>

        {/* Desktop Navigation Links */}
        <ul className="nz-nav-menu">
          <li><a href="#features" className="nz-nav-link">PILLARS</a></li>
          <li><a href="#catalog" className="nz-nav-link">PROGRAMS</a></li>
          <li><a href="/cybersecurity" className="nz-nav-link">CYBER SECURITY</a></li>
          <li><a href="/digital-marketing" className="nz-nav-link">DIGITAL MARKETING</a></li>
          <li><a href="#why-us" className="nz-nav-link">ABOUT</a></li>
          <li><a href="#success" className="nz-nav-link">SUCCESS</a></li>
          <li><a href="#faq" className="nz-nav-link">FAQ</a></li>
        </ul>

        {/* Desktop CTA & Mobile Hamburger Toggle */}
        <div className="nz-nav-actions">
          <a
            href="https://script.google.com/a/macros/nskollam.com/s/AKfycbxGEQdDZ0eAyhgPTKpZM1denEs7A5Ui15Ak1gEMWkYYvDsBpR7ViaN2Rzm0LWCjJ_k_/exec"
            target="_blank"
            rel="noopener noreferrer"
            className="nz-nav-login-btn"
            title="Employee Timesheet Login"
            aria-label="Employee Timesheet Login"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            <span>EMPLOYEE LOGIN</span>
          </a>
          <a href="/exam" className="nz-nav-cta">
            SKILL EXAM PORTAL →
          </a>
          <button
            type="button"
            className={`nz-hamburger-btn ${mobileMenuOpen ? 'is-active' : ''}`}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            <div className="nz-hamburger-icon">
              <span />
              <span />
              <span />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Backdrop */}
      <div
        className={`nz-mobile-nav-backdrop ${mobileMenuOpen ? 'is-open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer Dropdown List */}
      <div className={`nz-mobile-nav-drawer ${mobileMenuOpen ? 'is-open' : ''}`}>
        <ul className="nz-mobile-nav-list">
          <li>
            <a href="#features" className="nz-mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
              <span>Pillars of Excellence</span>
              <span className="nz-mobile-nav-arrow">→</span>
            </a>
          </li>
          <li>
            <a href="#catalog" className="nz-mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
              <span>Course Catalog</span>
              <span className="nz-mobile-nav-arrow">→</span>
            </a>
          </li>
          <li>
            <a href="/cybersecurity" className="nz-mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
              <span>Cyber Security & Ethical Hacking</span>
              <span className="nz-mobile-nav-item-badge">HOT</span>
            </a>
          </li>
          <li>
            <a href="/digital-marketing" className="nz-mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
              <span>Digital Marketing & AI</span>
              <span className="nz-mobile-nav-item-badge">HOT</span>
            </a>
          </li>
          <li>
            <a href="#why-us" className="nz-mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
              <span>Why Choose Us</span>
              <span className="nz-mobile-nav-arrow">→</span>
            </a>
          </li>
          <li>
            <a href="#success" className="nz-mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
              <span>Placement Success</span>
              <span className="nz-mobile-nav-arrow">→</span>
            </a>
          </li>
          <li>
            <a href="#faq" className="nz-mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
              <span>FAQ & Answers</span>
              <span className="nz-mobile-nav-arrow">→</span>
            </a>
          </li>
          <li>
            <a
              href="https://script.google.com/a/macros/nskollam.com/s/AKfycbxGEQdDZ0eAyhgPTKpZM1denEs7A5Ui15Ak1gEMWkYYvDsBpR7ViaN2Rzm0LWCjJ_k_/exec"
              target="_blank"
              rel="noopener noreferrer"
              className="nz-mobile-nav-item"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Employee Timesheet Login</span>
              <span className="nz-mobile-nav-item-badge" style={{ background: '#2563eb' }}>STAFF ↗</span>
            </a>
          </li>
          <li>
            <a href="#contact" className="nz-mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
              <span>Contact Kollam Campus</span>
              <span className="nz-mobile-nav-arrow">→</span>
            </a>
          </li>
        </ul>

        <div className="nz-mobile-nav-actions">
          <a
            href="https://script.google.com/a/macros/nskollam.com/s/AKfycbxGEQdDZ0eAyhgPTKpZM1denEs7A5Ui15Ak1gEMWkYYvDsBpR7ViaN2Rzm0LWCjJ_k_/exec"
            target="_blank"
            rel="noopener noreferrer"
            className="nz-mobile-login-btn"
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            EMPLOYEE LOGIN (TIMESHEET) ↗
          </a>
          <a href="/exam" className="nz-mobile-cta-btn" onClick={() => setMobileMenuOpen(false)}>
            SKILL EXAM PORTAL →
          </a>
          <a href="tel:08089030405" className="nz-mobile-secondary-btn">
            📞 CALL CAMPUS: +91 80890 30405
          </a>
        </div>

        <div className="nz-mobile-nav-socials">
          <a
            href="https://www.instagram.com/networkz_systems_kollam/"
            target="_blank"
            rel="noopener noreferrer"
            className="nz-mobile-social-link nz-mobile-social-ig"
            aria-label="Instagram Profile"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span>Instagram</span>
          </a>
          <a
            href="https://www.facebook.com/Networkzsystemskollam"
            target="_blank"
            rel="noopener noreferrer"
            className="nz-mobile-social-link nz-mobile-social-fb"
            aria-label="Facebook Page"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>Facebook</span>
          </a>
        </div>

        <div className="nz-mobile-nav-footer">
          <span>Kollam Campus • Chinnakada</span>
          <a href="https://wa.me/918089030405" target="_blank" rel="noopener noreferrer">WhatsApp Support ↗</a>
        </div>
      </div>

      {/* ─── SECTION 2: HERO FULL VIEWPORT EXPERIENCE ───────────────── */}
      <section className="nz-hero-section">
        <div className="nz-hero-glow-emerald" />
        <div className="nz-hero-glow-dark" />
        <div className="nz-container">
          <div className="nz-hero-grid">
            <div className="nz-hero-left">
              <span className="nz-eyebrow">AN ISO 9001:2015 CERTIFIED ACADEMY</span>

              <h1 className="nz-hero-title">
                ARCHITECTING<br />
                THE NEXT ERA OF<br />
                <span>DIGITAL MASTERY.</span>
              </h1>

              <p className="nz-body-lead">
                Kerala’s premier technology academy delivering high-impact programs in Software Full Stack, Artificial Intelligence, Cyber Security, and Cloud Architecture with 100% placement guarantee.
              </p>

              <div className="nz-hero-actions">
                <a href="#catalog" className="nz-btn-primary nz-btn-emerald">
                  EXPLORE CATALOG →
                </a>
                <a href="#contact" className="nz-btn-secondary">
                  ADMISSIONS ADVISORY
                </a>
              </div>
            </div>

            <div className="nz-hero-right">
              <div className="nz-hero-media-card">
                <img
                  src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1000&q=80"
                  alt="Enterprise Network Server Rack Infrastructure"
                  className="nz-hero-img"
                />
                <div className="nz-hero-floating-badge">
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>
                      ANNIVERSARY SPECIAL
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                      20% DISCOUNT THIS MONTH
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: '800', background: 'var(--color-primary)', color: 'var(--color-secondary)', padding: '0.4rem 0.8rem', borderRadius: '6px' }}>
                    KOLLAM LABS
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* INTEGRATED CORE PILLARS DECK IN HERO MAIN AREA */}
          <div className="nz-hero-pillars-deck" id="features">
            <div className="nz-hero-pillars-header">
              <span className="nz-eyebrow" style={{ marginBottom: '0.3rem' }}>CORE PILLARS</span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '900', letterSpacing: '-0.02em', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                ENGINEERED FOR EXCELLENCE.
              </h2>
            </div>

            <div className="nz-hero-pillars-grid">
              {FEATURES_DATA.map((feat, idx) => (
                <div key={idx} className="nz-hero-pillar-card">
                  <div className="nz-hero-pillar-top">
                    <span className="nz-hero-pillar-num">{feat.num}</span>
                    <span className="nz-hero-pillar-indicator" />
                  </div>
                  <h3 className="nz-hero-pillar-title">{feat.title}</h3>
                  <p className="nz-hero-pillar-desc">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="nz-hero-scroll-indicator">
            <div className="nz-scroll-line" />
            <span>SCROLL TO EXPLORE DISCIPLINES</span>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: PROGRAMS & COURSE CATALOG (Magazine Grid) ────── */}
      <section id="catalog" className="nz-catalog-section nz-section-padding">
        <div className="nz-container">
          <div className="nz-catalog-header">
            <div>
              <span className="nz-eyebrow">ACADEMIC DISCIPLINES</span>
              <h2 className="nz-heading-lg">PROGRAM CATALOG.</h2>
            </div>

            <div className="nz-catalog-controls">
              <div className="nz-filter-pills">
                {[
                  { id: 'SOFTWARE', label: 'SOFTWARE' },
                  { id: 'AI', label: 'AI & ROBOTICS' },
                  { id: 'NETWORK', label: 'NETWORKING & CYBER' },
                  { id: 'BUSINESS', label: 'BUSINESS' },
                  { id: 'INTERNSHIP', label: 'INTERNSHIPS' },
                  { id: 'ALL', label: 'ALL DISCIPLINES' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`nz-filter-pill ${activeCategoryTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveCategoryTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="nz-search-bar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search courses or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="nz-search-input"
                />
              </div>
            </div>
          </div>

          <div className="nz-course-grid">
            {filteredCourses.map((course) => (
              <div key={course.id} className="nz-course-card">
                <div className="nz-course-media">
                  <img src={course.image} alt={course.name} className="nz-course-img" />
                  <span className="nz-course-badge">{course.level}</span>
                </div>
                <div className="nz-course-content">
                  <div>
                    <h3 className="nz-course-title">{course.name}</h3>
                    <p className="nz-course-desc" style={{ marginTop: '0.6rem' }}>{course.desc}</p>
                  </div>
                  <div>
                    <div className="nz-course-meta">
                      <span>DURATION: {course.duration}</span>
                      <span>{course.cert}</span>
                    </div>
                    <button
                      className="nz-btn-primary"
                      style={{ width: '100%', marginTop: '1.25rem', padding: '0.85rem 1.5rem', fontSize: '0.8rem' }}
                      onClick={() => setSelectedCourseModal(course)}
                    >
                      VIEW SYLLABUS →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: WHY CHOOSE US (COS High-Fashion Composition) ─── */}
      <section id="why-us" className="nz-why-section nz-section-padding">
        <div className="nz-container">
          <div className="nz-why-grid">
            <div>
              <span className="nz-eyebrow">THE NETWORKZ ADVANTAGE</span>
              <h2 className="nz-heading-lg">WHERE AMBITION MEETS INFRASTRUCTURE.</h2>
              <p className="nz-body-lead" style={{ marginTop: '1.5rem' }}>
                We bridge the gap between academic theory and enterprise execution. Our state-of-the-art campus in Kollam offers dedicated server rooms, AI compute clusters, and direct Pearson VUE test authorization.
              </p>
            </div>

            <div className="nz-why-stats">
              <div className="nz-why-stat-box">
                <div className="nz-why-stat-num">24+</div>
                <div style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '0.1em', marginTop: '0.5rem', color: 'var(--color-primary)' }}>
                  YEARS OF EXCELLENCE
                </div>
              </div>
              <div className="nz-why-stat-box">
                <div className="nz-why-stat-num">100%</div>
                <div style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '0.1em', marginTop: '0.5rem', color: 'var(--color-primary)' }}>
                  PLACEMENT SUPPORT
                </div>
              </div>
              <div className="nz-why-stat-box">
                <div className="nz-why-stat-num">3</div>
                <div style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '0.1em', marginTop: '0.5rem', color: 'var(--color-primary)' }}>
                  STATES PRESENCE
                </div>
              </div>
              <div className="nz-why-stat-box">
                <div className="nz-why-stat-num">50K+</div>
                <div style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '0.1em', marginTop: '0.5rem', color: 'var(--color-primary)' }}>
                  GRADUATES PLACED
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 6: STUDENT SUCCESS (Nike Campaign Spotlight) ──── */}
      <section id="success" className="nz-success-section nz-section-padding">
        <div className="nz-container">
          <span className="nz-eyebrow">CAREER IMPACT</span>
          <h2 className="nz-heading-lg">STUDENT SPOTLIGHT.</h2>

          <div className="nz-spotlight-card">
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '800', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '1rem' }}>
                FEATURED GRADUATE ALUMNI
              </div>
              <p className="nz-spotlight-quote">
                "Learning Python Full Stack at Networkz Systems gave me the exact production-grade skills required by international hiring managers."
              </p>
              <div className="nz-spotlight-author">
                <span className="nz-spotlight-name">Sudheesh P S </span>
                <span className="nz-spotlight-role">Full Stack Developer — Placed at TRENSER, Technopark </span>
              </div>
            </div>
            {/* 
            <div>
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80"
                alt="Sudheesh P S - Full Stack Developer Spotlight"
                style={{ width: '100%', height: '340px', borderRadius: '12px', objectFit: 'cover', objectPosition: 'center 20%' }}
              />
            </div> */}
          </div>
        </div>
      </section>

      {/* ─── SECTION 7: PLACEMENT LOGO TICKER ─────────────────────── */}
      <section className="nz-placements-section">
        <div className="nz-container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem', fontSize: '0.8rem', fontWeight: '800', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
            RECRUITMENT PARTNERS & ENTERPRISE EMPLOYERS
          </div>
          <div className="nz-logo-cloud">
            <span className="nz-partner-tag">TCS</span>
            <span className="nz-partner-tag">INFOSYS</span>
            <span className="nz-partner-tag">WIPRO</span>
            <span className="nz-partner-tag">UST GLOBAL</span>
            <span className="nz-partner-tag">COGNIZANT</span>
            <span className="nz-partner-tag">ACCENTURE</span>
            <span className="nz-partner-tag">IBM</span>
          </div>
        </div>
      </section>

      {/* ─── SECTION 8: TESTIMONIAL CAROUSEL GRID ──────────────────── */}
      <section className="nz-testimonials-section nz-section-padding">
        <div className="nz-container">
          <span className="nz-eyebrow">TESTIMONIALS</span>
          <h2 className="nz-heading-lg">WHAT OUR ALUMNI SAY.</h2>

          <div className="nz-testimonial-grid">
            {TESTIMONIALS_DATA.map((t, idx) => (
              <div key={idx} className="nz-testimonial-card">
                <p className="nz-testimonial-text">"{t.quote}"</p>
                <div>
                  <div style={{ fontWeight: '800', color: 'var(--color-primary)' }}>{t.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>{t.role} — {t.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 9: COURSE CATEGORIES GRID (Aesop Tile Grid) ───── */}
      <section className="nz-categories-section nz-section-padding">
        <div className="nz-container">
          <span className="nz-eyebrow">EXPLORE DISCIPLINES</span>
          <h2 className="nz-heading-lg">SPECIALIZED ACADEMIC PATHWAYS.</h2>

          <div className="nz-category-grid">
            {CATEGORIES_DATA.map((cat) => (
              <a key={cat.id} href={cat.link} className="nz-category-card" aria-label={cat.title}>
                <img src={cat.img} alt={cat.title} className="nz-category-bg" loading="lazy" />
                <div className="nz-category-overlay" />
                <div className="nz-category-content">
                  <span className="nz-category-badge">
                    {cat.count}
                  </span>
                  <h3 className="nz-category-title">{cat.title}</h3>
                  <div className="nz-category-cta">
                    <span>Explore Track</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 10: LEARNING PROCESS ─────────────────────────── */}
      <section id="process" className="nz-process-section nz-section-padding">
        <div className="nz-container">
          <span className="nz-eyebrow">METHODOLOGY</span>
          <h2 className="nz-heading-lg">THE 4-STEP LEARNING ROADMAP.</h2>

          <div className="nz-process-grid">
            {PROCESS_STEPS.map((step, idx) => (
              <div key={idx} className="nz-process-step">
                <span className="nz-process-num">{step.num}</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--color-primary)' }}>{step.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-sub)', lineHeight: '1.6' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 11: ACHIEVEMENTS & STAT COUNTER ──────────────── */}
      <section className="nz-achievements-section nz-section-padding">
        <div className="nz-container">
          <div className="nz-achievements-grid">
            <div>
              <div className="nz-achievement-num">24<span>+</span></div>
              <div className="nz-achievement-label">Years Experience</div>
            </div>
            <div>
              <div className="nz-achievement-num">50K<span>+</span></div>
              <div className="nz-achievement-label">Students Trained</div>
            </div>
            <div>
              <div className="nz-achievement-num">100<span>%</span></div>
              <div className="nz-achievement-label">Placement Cell</div>
            </div>
            <div>
              <div className="nz-achievement-num">200<span>+</span></div>
              <div className="nz-achievement-label">Partner Companies</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 12: FAQ ACCORDION ─────────────────────────────── */}
      <section id="faq" className="nz-faq-section nz-section-padding">
        <div className="nz-container">
          <div style={{ textAlign: 'center' }}>
            <span className="nz-eyebrow">COMMON QUESTIONS</span>
            <h2 className="nz-heading-lg">FREQUENTLY ASKED QUESTIONS.</h2>
          </div>

          <div className="nz-faq-list">
            {FAQ_DATA.map((faq, idx) => (
              <div key={idx} className="nz-faq-item">
                <div
                  className="nz-faq-question"
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                >
                  <span>{faq.q}</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: '900' }}>
                    {openFaqIndex === idx ? '−' : '+'}
                  </span>
                </div>
                {openFaqIndex === idx && (
                  <div className="nz-faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 13: CONTACT FORM & FOOTER ────────────────────── */}
      <section id="contact" className="nz-contact-section nz-section-padding">
        <div className="nz-container">
          <div style={{ textAlign: 'center' }}>
            <span className="nz-eyebrow">ADMISSIONS ADVISORY</span>
            <h2 className="nz-heading-lg">CONNECT WITH A SENIOR COUNSELOR.</h2>
          </div>

          <div className="nz-contact-card">
            {contactFormSubmitted ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--color-accent)' }}>
                  APPLICATION SUBMITTED SUCCESSFULLY
                </h3>
                <p style={{ marginTop: '1rem', color: 'var(--color-text-sub)' }}>
                  Thank you. Our Kollam admissions counselor will reach out to you within 2 hours.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setContactFormSubmitted(true);
                }}
              >
                <div className="nz-form-group">
                  <label className="nz-form-label">Full Name</label>
                  <input type="text" placeholder="John Doe" required className="nz-form-input" />
                </div>

                <div className="nz-form-group">
                  <label className="nz-form-label">Phone Number</label>
                  <input type="tel" placeholder="+91 98765 43210" required className="nz-form-input" />
                </div>

                <div className="nz-form-group">
                  <label className="nz-form-label">Preferred Course Specialization</label>
                  <input type="text" placeholder="e.g. Python Full Stack / Cyber Security" required className="nz-form-input" />
                </div>

                <div className="nz-form-group">
                  <label className="nz-form-label">Your Message or Inquiry</label>
                  <textarea rows="4" placeholder="Tell us about your educational background or career goal..." className="nz-form-textarea"></textarea>
                </div>

                <button type="submit" className="nz-btn-primary nz-btn-emerald" style={{ width: '100%', marginTop: '1rem' }}>
                  SUBMIT ADMISSIONS INQUIRY →
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="nz-footer">
        <div className="nz-container">
          <div className="nz-footer-grid">
            <div className="nz-footer-brand">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img src="/nsk.jpeg" alt="Networkz Systems" className="nz-brand-emblem-img" />
                <span className="nz-brand-name" style={{ color: '#ffffff' }}>NETWORKZ SYSTEMS</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.6', margin: '0.75rem 0' }}>
                An ISO 9001:2015 Certified Academy delivering enterprise IT & Cyber Security education across South India.
              </p>
              <div className="nz-footer-contact-clean">
                <div className="nz-contact-row">
                  <svg className="nz-contact-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <a href="https://maps.google.com/?q=Networkz+Systems+Pattathuvila+Plaza+Chinnakada+Kollam" target="_blank" rel="noopener noreferrer" className="nz-address-link">
                    2nd Floor, Pattathuvila Plaza, Vadayattukotta Rd, Chinnakada, Kollam, Kerala 691001
                  </a>
                </div>

                <div className="nz-contact-row">
                  <svg className="nz-contact-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <a href="tel:+918089030405" className="nz-phone-link">+91 80890 30405</a>
                </div>

                <div className="nz-contact-row">
                  <svg className="nz-contact-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>Monday – Sunday: 9:00 AM – 5:30 PM</span>
                </div>
              </div>

              {/* Social Channels */}
              <div className="nz-footer-social-wrap">
                <span className="nz-social-label">OFFICIAL SOCIAL CHANNELS</span>
                <div className="nz-social-btns">
                  <a
                    href="https://www.instagram.com/networkz_systems_kollam/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nz-social-btn nz-social-btn--ig"
                    aria-label="Follow Networkz Systems Kollam on Instagram"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span>Instagram</span>
                  </a>
                  <a
                    href="https://www.facebook.com/Networkzsystemskollam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nz-social-btn nz-social-btn--fb"
                    aria-label="Follow Networkz Systems Kollam on Facebook"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Facebook</span>
                  </a>
                </div>
              </div>
            </div>

            <div>
              <div className="nz-footer-title">DISCIPLINE TRACKS</div>
              <ul className="nz-footer-links">
                <li><a href="#catalog">Software Product Training</a></li>
                <li><a href="#catalog">AI & Electronics</a></li>
                <li><a href="#catalog">Networking & Security</a></li>
                <li><a href="#catalog">Business & Digital Marketing</a></li>
                <li><a href="#catalog">Internship Programs</a></li>
              </ul>
            </div>

            <div>
              <div className="nz-footer-title">CAMPUS LOCATIONS</div>
              <ul className="nz-footer-links">
                <li><a href="#contact">Kollam Campus</a></li>
                <li><a href="#contact">Trivandrum Campus</a></li>
                <li><a href="#contact">Ernakulam Campus</a></li>
                <li><a href="#contact">Chennai Campus</a></li>
              </ul>
            </div>

            <div>
              <div className="nz-footer-title">STUDENT & EMPLOYEE PORTAL</div>
              <ul className="nz-footer-links">
                <li>
                  <a
                    href="https://script.google.com/a/macros/nskollam.com/s/AKfycbxGEQdDZ0eAyhgPTKpZM1denEs7A5Ui15Ak1gEMWkYYvDsBpR7ViaN2Rzm0LWCjJ_k_/exec"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nz-footer-employee-link"
                  >
                    Employee Timesheet Login ↗
                  </a>
                </li>
                <li><a href="/exam">Skill Exam Portal</a></li>
                <li><a href="#faq">Frequently Asked Questions</a></li>
                <li><a href="#success">Placement Records</a></li>
                <li><a href="#contact">Admissions Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="nz-footer-bottom">
            <span>© {new Date().getFullYear()} NETWORKZ SYSTEMS. ALL RIGHTS RESERVED.</span>
            <div className="nz-footer-bottom-socials">
              <a
                href="https://www.instagram.com/networkz_systems_kollam/"
                target="_blank"
                rel="noopener noreferrer"
                className="nz-footer-social-link"
              >
                Instagram ↗
              </a>
              <span className="nz-footer-dot">•</span>
              <a
                href="https://www.facebook.com/Networkzsystemskollam"
                target="_blank"
                rel="noopener noreferrer"
                className="nz-footer-social-link"
              >
                Facebook ↗
              </a>
            </div>
            <span>DESIGN DIRECTOR EDITORIAL SPECIFICATION</span>
          </div>
        </div>
      </footer>

      {/* SYLLABUS MODAL POPUP */}
      {selectedCourseModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ background: '#ffffff', color: '#111111', borderRadius: '16px', maxWidth: '580px', width: '100%', padding: '2.5rem', boxShadow: '0 25px 60px rgba(0,0,0,0.35)', position: 'relative' }}>
            <button
              onClick={() => setSelectedCourseModal(null)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.5rem', background: 'none', border: 'none', fontSize: '1.5rem', fontWeight: '900', cursor: 'pointer', color: '#111111' }}
            >
              ✕
            </button>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>
              {selectedCourseModal.catName}
            </span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '0.4rem', marginBottom: '1rem' }}>
              {selectedCourseModal.name}
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-sub)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              {selectedCourseModal.desc}
            </p>
            <div style={{ background: 'var(--color-bg-light)', padding: '1rem 1.25rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>DURATION: {selectedCourseModal.duration}</span>
              <span>LEVEL: {selectedCourseModal.level}</span>
            </div>
            <button
              onClick={() => {
                setSelectedEnrollmentCourse(selectedCourseModal);
                setSelectedCourseModal(null);
                setEnrollmentSubmitted(false);
              }}
              className="nz-btn-primary nz-btn-emerald"
              style={{ width: '100%', textAlign: 'center', border: 'none', cursor: 'pointer' }}
            >
              ENROLL IN THIS PROGRAM →
            </button>
          </div>
        </div>
      )}

      {/* REGISTRATION POP-UP FORM MODAL (IMAGE 2 PROMOTIONAL SIGN-UP DESIGN) */}
      {selectedEnrollmentCourse && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2100, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ background: '#ffffff', color: '#111111', borderRadius: '16px', maxWidth: '480px', width: '100%', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.4)', position: 'relative', animation: 'fade-up 0.3s ease' }}>

            {/* Close Button */}
            <button
              onClick={() => setSelectedEnrollmentCourse(null)}
              style={{ position: 'absolute', top: '1rem', right: '1.2rem', zIndex: 10, background: 'rgba(0,0,0,0.2)', color: '#ffffff', border: 'none', width: '32px', height: '32px', borderRadius: '50%', fontSize: '1.2rem', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ✕
            </button>

            {/* Top Dark Header Card Banner */}
            <div style={{ background: '#111111', color: '#ffffff', padding: '2rem 1.5rem 1.8rem', textAlign: 'center', position: 'relative' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>
                ANNIVERSARY SPECIAL
              </div>
              <div style={{ fontSize: '3rem', fontWeight: '900', color: '#ffffff', lineHeight: '1', margin: '0.3rem 0 0.1rem' }}>
                20% OFF
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: '700', opacity: 0.85, letterSpacing: '0.05em' }}>
                KOLLAM CAMPUS BATCH ADMISSION
              </div>
            </div>

            {/* Modal Form Body */}
            <div style={{ padding: '2rem 2.2rem 2.2rem', textAlign: 'center' }}>
              {enrollmentSubmitted ? (
                <div style={{ padding: '1.5rem 0' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎉</div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--color-accent)', textTransform: 'uppercase' }}>
                    REGISTRATION CONFIRMED!
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-sub)', marginTop: '0.8rem', lineHeight: '1.6' }}>
                    Thank you! Your 20% discount offer seat for <strong>{selectedEnrollmentCourse.name}</strong> has been reserved. Our admissions team will contact you shortly.
                  </p>
                  <button
                    onClick={() => setSelectedEnrollmentCourse(null)}
                    className="nz-btn-primary"
                    style={{ width: '100%', marginTop: '1.8rem', background: '#111111', color: '#ffffff' }}
                  >
                    CLOSE WINDOW
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setEnrollmentSubmitted(true);
                  }}
                >
                  <div style={{ fontSize: '0.8rem', fontWeight: '800', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#555555' }}>
                    UNLOCK
                  </div>
                  <h3 style={{ fontSize: '1.9rem', fontWeight: '900', color: '#111111', lineHeight: '1.1', margin: '0.2rem 0 0.4rem', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                    20% OFF ADMISSION
                  </h3>
                  <p style={{ fontSize: '0.88rem', fontWeight: '700', color: '#111111', marginBottom: '0.3rem' }}>
                    {selectedEnrollmentCourse.name}
                  </p>
                  <p style={{ fontSize: '0.82rem', color: '#666666', marginBottom: '1.5rem', lineHeight: '1.4' }}>
                    Register your details below to claim your discount seat for Kollam batch
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      required
                      style={{ width: '100%', background: '#f0f0f2', border: '1px solid #e0e0e4', borderRadius: '10px', padding: '0.9rem 1.1rem', fontSize: '0.9rem', color: '#111111', outline: 'none' }}
                    />
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      required
                      style={{ width: '100%', background: '#f0f0f2', border: '1px solid #e0e0e4', borderRadius: '10px', padding: '0.9rem 1.1rem', fontSize: '0.9rem', color: '#111111', outline: 'none' }}
                    />
                    <input
                      type="tel"
                      placeholder="Enter your mobile number"
                      required
                      style={{ width: '100%', background: '#f0f0f2', border: '1px solid #e0e0e4', borderRadius: '10px', padding: '0.9rem 1.1rem', fontSize: '0.9rem', color: '#111111', outline: 'none' }}
                    />

                  </div>

                  <button
                    type="submit"
                    style={{ width: '100%', background: '#111111', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '1.05rem', fontSize: '0.95rem', fontWeight: '900', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background 0.2s ease', boxShadow: '0 8px 25px rgba(0,0,0,0.2)' }}
                  >
                    CONFIRM & REGISTER →
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
