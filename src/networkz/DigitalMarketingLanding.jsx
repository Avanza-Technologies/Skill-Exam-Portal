import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CustomSelect from './components/CustomSelect';
import './NetworkzHome.css';
import './CyberSecurityLanding.css';
import './DigitalMarketingLanding.css';

const WHATSAPP_PHONE = '918089030405';

const getWhatsAppUrl = (customMsg) => {
  const defaultMsg = [
    'NETWORKZ SYSTEMS KOLLAM',
    '══════════════════════',
    'Admissions Inquiry - Digital Marketing Professional Course',
    '══════════════════════',
    '',
    'Hello Admissions Desk! I want to claim the Special Offer (Actual Fee ₹35,000 → Now Only ₹15,000) for the Digital Marketing Course.',
    '',
    'Campus: Chinnakada, Kollam'
  ].join('\n');
  const msg = customMsg || defaultMsg;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
};

/* ── 9 CORE MODULES DATA ── */
const MARKETING_MODULES = [
  {
    num: '01',
    shortLabel: '01 Search',
    title: 'Search Engine Optimization (SEO)',
    dur: '25 Hours Practical',
    tag: 'ORGANIC GROWTH',
    desc: 'Master On-Page, Off-Page, Technical SEO, Keyword Research, and Google Search Console to rank websites on Page 1 organically.',
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80',
    skills: ['Keyword Research & Intent', 'On-Page & Technical SEO', 'Backlink Audits & Strategy', 'Google Search Console']
  },
  {
    num: '02',
    shortLabel: '02 Google',
    title: 'Google Ads (PPC Campaigns)',
    dur: '25 Hours Practical',
    tag: 'PAID TRAFFIC',
    desc: 'Learn Search Ads, Display Ads, Shopping Ads, YouTube Video Ads, Smart Bidding strategies, and conversion tracking.',
    image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80',
    skills: ['Google Search & Display Ads', 'YouTube Video Advertising', 'Quality Score Optimization', 'PPC Bidding Strategies']
  },
  {
    num: '03',
    shortLabel: '03 Meta',
    title: 'Meta Ads (Facebook & Instagram)',
    dur: '20 Hours Practical',
    tag: 'SOCIAL MEDIA',
    desc: 'Create high-converting Meta Ad campaigns, custom lookalike audiences, Meta Pixel tracking, and retargeting funnels.',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80',
    skills: ['Facebook & IG Ad Setup', 'Lookalike & Custom Audiences', 'Meta Pixel & Conversion API', 'Ad Creative Strategy']
  },
  {
    num: '04',
    shortLabel: '04 Google',
    title: 'Google Business Handling & Local SEO',
    dur: '15 Hours Practical',
    tag: 'LOCAL SEO',
    desc: 'Set up & optimize Google My Business (GMB) profiles to dominate local map pack rankings and drive inbound calls.',
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
    skills: ['GMB Profile Optimization', 'Local Map Pack Ranking', 'Review Management & Citation', 'Local Lead Generation']
  },
  {
    num: '05',
    shortLabel: '05 Website',
    title: 'Website Designing & Deployment',
    dur: '25 Hours Practical',
    tag: 'WEB ARCHITECTURE',
    desc: 'Build responsive business websites and high-converting landing pages using WordPress, Elementor, domains, hosting & SSL.',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    skills: ['WordPress Site Building', 'Elementor Page Builder', 'Domain & Hosting Setup', 'UX/UI Landing Page Design']
  },
  {
    num: '06',
    shortLabel: '06 CRM',
    title: 'CRM Tools & Lead Management',
    dur: '15 Hours Practical',
    tag: 'CRM AUTOMATION',
    desc: 'Integrate CRM systems (HubSpot, Zoho) to track leads, automate sales pipelines, and improve customer conversion rates.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    skills: ['HubSpot & Zoho CRM Setup', 'Lead Scoring & Tracking', 'Sales Funnel Automation', 'Customer Retention Systems']
  },
  {
    num: '07',
    shortLabel: '07 Poster',
    title: 'Poster Design & Visual Branding',
    dur: '15 Hours Practical',
    tag: 'VISUAL BRANDING',
    desc: 'Design eye-catching ad banners, social media posts, stories, video reels, and brand assets using Canva Pro & Photoshop.',
    image: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&w=800&q=80',
    skills: ['Canva Pro Graphic Design', 'Social Media Layouts', 'Ad Banner Creation', 'Photoshop Essentials']
  },
  {
    num: '08',
    shortLabel: '08 AI',
    title: 'AI Tools Integration & Automations',
    dur: '15 Hours Practical',
    tag: 'AI AUTOMATIONS',
    desc: 'Harness ChatGPT, Midjourney, Jasper AI, and Zapier for automated ad copywriting, content creation & marketing workflows.',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
    skills: ['ChatGPT Copywriting', 'Midjourney AI Prompts', 'Zapier Automations', 'AI Content Generation']
  },
  {
    num: '09',
    shortLabel: '09 Email',
    title: 'Email Marketing & Automation',
    dur: '15 Hours Practical',
    tag: 'EMAIL DRIP',
    desc: 'Design automated drip campaigns, newsletter templates, audience list segmentation, and email analytics using Mailchimp.',
    image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&w=800&q=80',
    skills: ['Mailchimp Drips', 'Newsletter Templates', 'Audience List Segment', 'A/B Testing & Analytics']
  }
];

/* ── 5 STAT CARDS (EXACT PASTEL BADGES) ── */
const STAT_CARDS = [
  {
    value: '1,000+',
    label: 'Graduates Trained & Placed in Top Firms',
    icon: '🎓',
    theme: 'pink'
  },
  {
    value: '₹500K+',
    label: 'Live Ad Budgets Managed in Campaigns',
    icon: '🚀',
    theme: 'green'
  },
  {
    value: '70%',
    label: 'Practical Hands-On & Live Projects',
    icon: '⚡',
    theme: 'purple'
  },
  {
    value: '100%',
    label: 'Placement & Direct Referral Drives',
    icon: '🏆',
    theme: 'lime'
  },
  {
    value: '2,000+',
    label: '5-Star Reviews from Alumni',
    icon: '⭐',
    theme: 'blue'
  }
];

/* ── 6 TREE TIERS PAIRING HIGHLIGHTS & TOOLS ── */
const TREE_TIERS = [
  {
    level: '01',
    tag: 'PRACTICAL MODULE',
    highlight: {
      title: '100% Practical Training',
      desc: 'Execute live campaigns on active ad budgets and real business accounts.'
    },
    tools: [
      { name: 'Google Analytics 4', desc: 'Traffic & conversion tracking' },
      { name: 'Meta Ads Manager', desc: 'FB & Instagram campaign manager' }
    ]
  },
  {
    level: '02',
    tag: 'REAL CLIENT BRIEFS',
    highlight: {
      title: 'Live Projects & Case Studies',
      desc: 'Work on real-world client briefs to build a job-ready digital portfolio.'
    },
    tools: [
      { name: 'Google Ads', desc: 'Search, Display & YouTube Ads' },
      { name: 'SEMrush / Ahrefs', desc: 'Keyword research & backlink analysis' }
    ]
  },
  {
    level: '03',
    tag: 'INCLUDED SUITE',
    highlight: {
      title: 'Tools Worth ₹50,000+ Free',
      desc: 'Free access to premium SEO, AI, and graphics software licenses.'
    },
    tools: [
      { name: 'Canva Pro', desc: 'Visual poster & ad creative design' },
      { name: 'ChatGPT 4', desc: 'AI ad copy & content generation' }
    ]
  },
  {
    level: '04',
    tag: 'ISO ACCREDITED',
    highlight: {
      title: 'Industry Recognized Certificate',
      desc: 'Official Networkz Systems & ISO 9001:2015 accredited qualification.'
    },
    tools: [
      { name: 'WordPress', desc: 'CMS & landing page builder' },
      { name: 'Mailchimp', desc: 'Drip campaigns & newsletters' }
    ]
  },
  {
    level: '05',
    tag: 'CAREER DRIVES',
    highlight: {
      title: '100% Placement Assistance',
      desc: 'Resume engineering, mock interviews & direct corporate placement drives.'
    },
    tools: [
      { name: 'HubSpot CRM', desc: 'Lead tracking & CRM pipeline' },
      { name: 'Zapier', desc: 'Marketing automation integration' }
    ]
  },
  {
    level: '06',
    tag: 'CONTINUOUS GUIDANCE',
    highlight: {
      title: 'Lifetime Support & Updates',
      desc: 'Continuous access to updated course modules, alumni network & guidance.'
    },
    tools: [
      { name: 'ISO Accredited', desc: 'ISO certified qualification' },
      { name: 'Alumni Network', desc: 'Direct corporate referral network' }
    ]
  }
];

/* ── RADIAL TOOL NODES (EXACT POSITIONS) ── */
const RADIAL_NODES = [
  { icon: '🔍', x: 22, y: 22 },
  { icon: '🎯', x: 78, y: 20 },
  { icon: '📱', x: 88, y: 50 },
  { icon: '📊', x: 76, y: 80 },
  { icon: '🎨', x: 50, y: 88 },
  { icon: '🤖', x: 24, y: 80 },
  { icon: '🌐', x: 12, y: 50 },
  { icon: '✉️', x: 50, y: 12 }
];

const ROLE_OPTIONS = ['Student (Study)', 'Job Seeker (Job)', 'Business Owner / Entrepreneur', 'Working Professional', 'Other'];

export default function DigitalMarketingLanding() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', phone: '', role: 'Student (Study)' });
  const [submitted, setSubmitted] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  /* ── 15-SECOND RECURRING AUTO POPUP MODAL ── */
  useEffect(() => {
    if (submitted) return;
    const timer = setTimeout(() => {
      setShowOfferModal(true);
    }, 15000);

    return () => clearTimeout(timer);
  }, [showOfferModal, submitted]);

  /* ── 3D COVERFLOW CAROUSEL STATE (IMAGE 2 REFERENCE) ── */
  const [activeModuleIndex, setActiveModuleIndex] = useState(3); // Module 04 active by default

  const handlePrevCover = () => {
    setActiveModuleIndex((prev) => (prev === 0 ? MARKETING_MODULES.length - 1 : prev - 1));
  };

  const handleNextCover = () => {
    setActiveModuleIndex((prev) => (prev === MARKETING_MODULES.length - 1 ? 0 : prev + 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const msg = [
      'NETWORKZ SYSTEMS KOLLAM',
      '══════════════════════',
      '🎉 SPECIAL OFFER CLAIM - DIGITAL MARKETING PROFESSIONAL COURSE',
      '══════════════════════',
      '',
      `Candidate Name : ${formData.name}`,
      `Phone Number   : ${formData.phone}`,
      `Current Status : ${formData.role}`,
      `Course Selected: Digital Marketing Professional Course`,
      'Special Offer  : ACTUAL FEE ₹35,000 → NOW ONLY ₹15,000',
      'Bonus Package  : FREE PREMIUM TOOLS ACCESS (WORTH ₹50,000+)',
      'Campus Location: Pattathuvila Plaza, 2nd Floor, Vadayattukotta Rd, Chinnakada, Kollam',
      '',
      '══════════════════════',
      'Hello Admissions Desk! I want to claim the ₹15,000 special offer price and enroll in the Digital Marketing Course. Please call me back!'
    ].join('\n');
    const waUrl = getWhatsAppUrl(msg);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const scrollToBooking = () => {
    const el = document.getElementById('nz-booking-sec');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  /* ── ON-PAGE SEO OPTIMIZATION FOR DIGITAL MARKETING IN KOLLAM ── */
  useEffect(() => {
    document.title = "Digital Marketing Course in Kollam | Networkz Systems (100% Placement)";

    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (canonicalEl) {
      canonicalEl.setAttribute('href', 'https://nskollam.com/digital-marketing');
    }

    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Best Digital Marketing course in Kollam, Kerala at Networkz Systems. Master SEO, Google Ads, Meta Ads, Social Media, AI Tools & Content Marketing with 100% placement support.');
    }
  }, []);

  return (
    <div className="ix-theme-root">
      {/* ─────────────────────────────────────────────────────────
         STICKY LUXURY NAVIGATION BAR
      ───────────────────────────────────────────────────────── */}
      <nav className="nz-luxury-nav">
        <Link to="/" className="nz-nav-brand">
          <img src="/nsk.jpeg" alt="Networkz Systems" className="nz-brand-emblem-img" />
          <span className="nz-brand-name">NETWORKZ SYSTEMS</span>
          <span className="nz-brand-tag">KOLLAM CAMPUS</span>
        </Link>

        {/* Desktop Links */}
        <ul className="nz-nav-menu">
          <li><a href="#overview" className="nz-nav-link">OVERVIEW</a></li>
          <li><a href="#syllabus" className="nz-nav-link">SYLLABUS</a></li>
          <li><a href="#tools" className="nz-nav-link">TOOLS & AI</a></li>
          <li><a href="#contact" className="nz-nav-link">KOLLAM CAMPUS</a></li>
        </ul>

        {/* Desktop Actions & Mobile Hamburger Toggle */}
        <div className="nz-nav-actions">
          <button className="nz-nav-cta" onClick={scrollToBooking} style={{ cursor: 'pointer', border: 'none' }}>
            CLAIM SPECIAL FEE OFFER ↗
          </button>
          <button
            className="nz-btn-secondary nz-nav-home-btn"
            onClick={() => navigate('/')}
            style={{ padding: '0.65rem 1.1rem', fontSize: '0.78rem', background: '#222222', color: '#ffffff', border: '1px solid #333333' }}
          >
            ← HOME
          </button>
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
            <a href="#overview" className="nz-mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
              <span>Course Overview</span>
              <span className="nz-mobile-nav-arrow">→</span>
            </a>
          </li>
          <li>
            <a href="#syllabus" className="nz-mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
              <span>9 Practical Modules</span>
              <span className="nz-mobile-nav-arrow">→</span>
            </a>
          </li>
          <li>
            <a href="#tools" className="nz-mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
              <span>Digital Marketing & AI Tools</span>
              <span className="nz-mobile-nav-arrow">→</span>
            </a>
          </li>
          <li>
            <a href="#contact" className="nz-mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
              <span>Kollam Campus Admissions</span>
              <span className="nz-mobile-nav-arrow">→</span>
            </a>
          </li>
        </ul>

        <div className="nz-mobile-nav-actions">
          <button
            className="nz-mobile-cta-btn"
            onClick={() => {
              setMobileMenuOpen(false);
              scrollToBooking();
            }}
          >
            CLAIM SPECIAL FEE OFFER (₹15,000) ↗
          </button>
          <button
            className="nz-mobile-secondary-btn"
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/');
            }}
          >
            ← RETURN TO HOMEPAGE
          </button>
        </div>

        <div className="nz-mobile-nav-footer">
          <span>Digital Marketing Lab • Kollam</span>
          <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">WhatsApp Desk ↗</a>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
         SECTION 1: DEEP TEAL HERO HEADER (EXACT INTEGRATEX STYLE)
      ───────────────────────────────────────────────────────── */}
      <section id="overview" className="ix-hero-sec">
        <div className="ix-hero-bg-overlay">
          <div className="ix-hero-orb-1" />
          <div className="ix-hero-orb-2" />
        </div>

        {/* HERO CONTENT */}
        <div className="ix-container">
          <div className="ix-hero-grid">
            {/* HERO LEFT */}
            <div className="ix-hero-content">
              <h1 className="ix-hero-serif-title">
                Unlock the power of<br />Digital Marketing Excellence
              </h1>

              <p className="ix-hero-subtitle">
                Learn. Practice. Grow. From Basics to Advanced Level. Master SEO, Google Ads, Meta Ads, AI Automations, Web Design & CRM tools with 100% practical hands-on training.
              </p>

              <div className="ix-hero-ctas">
                <button className="ix-btn-pill-solid-dark" onClick={scrollToBooking}>
                  Start Free Trial
                </button>
                <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="ix-btn-pill-outline-hero">
                  Book a Demo
                </a>
              </div>

              {/* 3D HELIX RIBBON GRAPHIC */}
              <div className="ix-hero-ribbon-wrap">
                <svg className="ix-hero-ribbon-svg" viewBox="0 0 1000 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 90C120 150 250 30 380 90C510 150 640 30 770 90C900 150 1000 90 1000 90" stroke="url(#cyan-helix-1)" strokeWidth="12" strokeLinecap="round" opacity="0.9" />
                  <path d="M0 105C140 40 270 160 410 95C550 30 680 150 820 95C930 50 1000 105 1000 105" stroke="url(#cyan-helix-2)" strokeWidth="8" strokeLinecap="round" opacity="0.75" />
                  <defs>
                    <linearGradient id="cyan-helix-1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="50%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                    <linearGradient id="cyan-helix-2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* LOGO STRIP AT HERO BOTTOM */}
              <div className="ix-brand-strip">
                <div className="ix-brand-cloud">
                  <span className="ix-cloud-item">✦ Google Analytics</span>
                  <span className="ix-cloud-item">✦ Meta Ads</span>
                  <span className="ix-cloud-item">✦ Google Ads</span>
                  <span className="ix-cloud-item">✦ HubSpot</span>
                  <span className="ix-cloud-item">✦ Mailchimp</span>
                  <span className="ix-cloud-item">✦ Canva Pro</span>
                </div>
              </div>
            </div>

            {/* HERO RIGHT SHOWCASE MEDIA CARD */}
            <div className="ix-hero-media">
              <div className="ix-hero-glass-card">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80"
                  alt="Digital Marketing Campaign Analytics & Performance Hub"
                  className="ix-hero-media-img"
                />
                <div className="ix-hero-badge-overlay">
                  <span className="ix-pulse-dot" /> LIVE AD CAMPAIGNS ACTIVE
                </div>
                <div className="ix-hero-card-footer">
                  <div className="ix-footer-stat">
                    <span className="ix-stat-val">₹15,000</span>
                    <span className="ix-stat-lbl">SPECIAL OFFER (ACTUAL ₹35,000)</span>
                  </div>
                  <span className="ix-footer-pill">KOLLAM LABS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
         ENTERPRISE TRUST METRICS STRIP (CLEAN STATIC DESIGN)
      ───────────────────────────────────────────────────────── */}
      <section className="ix-trust-metrics-strip">
        <div className="ix-container">
          <div className="ix-trust-metrics-grid">
            <div className="ix-trust-metric-item">
              <div className="ix-metric-val-large">1,000+</div>
              <div className="ix-metric-lbl-sub">Graduates Placed in Top Firms</div>
            </div>

            <div className="ix-trust-metric-item">
              <div className="ix-metric-val-large">₹500K+</div>
              <div className="ix-metric-lbl-sub">Live Ad Budgets Managed</div>
            </div>

            <div className="ix-trust-metric-item">
              <div className="ix-metric-val-large">70%</div>
              <div className="ix-metric-lbl-sub">Practical Hands-On Campaign Ratio</div>
            </div>

            <div className="ix-trust-metric-item">
              <div className="ix-metric-val-large">100%</div>
              <div className="ix-metric-lbl-sub">Placement & Referral Support</div>
            </div>

            <div className="ix-trust-metric-item">
              <div className="ix-metric-val-large">4.9 ★</div>
              <div className="ix-metric-lbl-sub">2,000+ 5-Star Alumni Reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
         SECTION 3: ULTRA-PREMIUM 3-CARD FEATURE SUITE
      ───────────────────────────────────────────────────────── */}
      <section className="ix-features-sec">
        <div className="ix-container">
          <div className="ix-sec-header text-center">
            <span className="ix-sub-tag">ENTERPRISE GROWTH PLATFORM</span>
            <h2 className="ix-serif-heading">Key Features of Networkz Systems</h2>
            <p className="ix-sec-desc">
              Connect and manage multi-channel marketing campaigns, automated CRM pipelines, and real-time ROAS attribution models.
            </p>
          </div>

          <div className="ix-prem-features-grid">

            {/* Card 1: Search & Paid Traffic */}
            <div className="ix-prem-feature-card">
              <div className="ix-prem-card-preview dark-emerald-mesh">
                <div className="ix-preview-top-bar">
                  <span className="ix-status-dot green" />
                  <span className="ix-preview-label">Live Google Ads Console</span>
                </div>

                <div className="ix-preview-hero-stat">
                  <div className="ix-hero-stat-value">Rank #1</div>
                  <div className="ix-hero-stat-sub">Organic Search & Paid Traffic</div>
                </div>

                <div className="ix-preview-badges">
                  <span className="ix-badge-pill">Quality Score: 9.8/10</span>
                  <span className="ix-badge-pill highlight">+420% ROI</span>
                </div>
              </div>

              <div className="ix-prem-card-body">
                <span className="ix-prem-category">01 • TRAFFIC & AD ACQUISITION</span>
                <h3 className="ix-prem-title">Search Engine Optimization & Paid Ads</h3>
                <p className="ix-prem-desc">
                  Dominate Google Page 1 with On-Page, Off-Page & Technical SEO. Master Search, Display, Shopping, and YouTube Ads to maximize conversion efficiency.
                </p>
                <div className="ix-prem-skills-row">
                  <span>Google Ads</span>
                  <span>Meta Ads</span>
                  <span>SEO Audit</span>
                </div>
                <button className="ix-prem-cta-btn" onClick={scrollToBooking}>
                  Explore Search & Ads ↗
                </button>
              </div>
            </div>

            {/* Card 2: CRM & Lead Automation */}
            <div className="ix-prem-feature-card">
              <div className="ix-prem-card-preview dark-cyan-mesh">
                <div className="ix-preview-top-bar">
                  <span className="ix-status-dot cyan" />
                  <span className="ix-preview-label">Automated CRM Funnel</span>
                </div>

                <div className="ix-preview-pipeline-widget">
                  <div className="ix-pipeline-node">
                    <span className="ix-node-lbl">Inbound Lead</span>
                    <span className="ix-node-val">Rahul N.</span>
                  </div>
                  <div className="ix-pipeline-connector">→</div>
                  <div className="ix-pipeline-node">
                    <span className="ix-node-lbl">Stage</span>
                    <span className="ix-node-val active">Qualified</span>
                  </div>
                </div>

                <div className="ix-preview-badges">
                  <span className="ix-badge-pill">HubSpot CRM</span>
                  <span className="ix-badge-pill">Zoho Pipelines</span>
                </div>
              </div>

              <div className="ix-prem-card-body">
                <span className="ix-prem-category">02 • CRM & CONVERSION FUNNELS</span>
                <h3 className="ix-prem-title">Automated Sales Funnels & Lead CRM</h3>
                <p className="ix-prem-desc">
                  Set up HubSpot and Zoho CRM tools to track inbound leads, assign automated lead scores, schedule email drips, and convert prospects into loyal buyers.
                </p>
                <div className="ix-prem-skills-row">
                  <span>HubSpot</span>
                  <span>Zoho CRM</span>
                  <span>Email Drips</span>
                </div>
                <button className="ix-prem-cta-btn" onClick={scrollToBooking}>
                  Explore CRM Funnels ↗
                </button>
              </div>
            </div>

            {/* Card 3: GA4 & ROAS Analytics */}
            <div className="ix-prem-feature-card">
              <div className="ix-prem-card-preview dark-mint-mesh">
                <div className="ix-preview-top-bar">
                  <span className="ix-status-dot mint" />
                  <span className="ix-preview-label">GA4 Financial Revenue Hub</span>
                </div>

                <div className="ix-preview-hero-stat">
                  <div className="ix-hero-stat-value" style={{ color: '#34d399' }}>4.8x ROAS</div>
                  <div className="ix-hero-stat-sub">Live Ad Budgets Optimization</div>
                </div>

                <div className="ix-preview-badges">
                  <span className="ix-badge-pill">GA4 Events</span>
                  <span className="ix-badge-pill">Meta Pixel API</span>
                </div>
              </div>

              <div className="ix-prem-card-body">
                <span className="ix-prem-category">03 • FINANCIAL REVENUE & ATTRIBUTION</span>
                <h3 className="ix-prem-title">Real-Time Campaign ROI & Analytics</h3>
                <p className="ix-prem-desc">
                  Track every ad rupee spent across channels with GA4 & Meta Pixel conversion APIs. Make data-backed budget decisions with multi-touch attribution models.
                </p>
                <div className="ix-prem-skills-row">
                  <span>GA4</span>
                  <span>Meta Pixel</span>
                  <span>Looker Studio</span>
                </div>
                <button className="ix-prem-cta-btn" onClick={scrollToBooking}>
                  Explore GA4 Analytics ↗
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
         SECTION 5: WHAT YOU WILL LEARN — 3D COVERFLOW CAROUSEL (IMAGE 2 REFERENCE)
      ───────────────────────────────────────────────────────── */}
      <section id="syllabus" className="ix-coverflow-sec">
        <div className="ix-container">
          {/* Header */}
          <div className="ix-sec-header" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 className="ix-coverflow-heading">What You Will Learn</h2>
            <p className="ix-coverflow-sub" style={{ maxWidth: '650px', margin: '0.6rem auto 0', textAlign: 'center' }}>
              9 core modules designed to turn you into a complete Digital Marketing Specialist.
            </p>
            <p className="ix-coverflow-hint">Rotate left & right to explore.</p>
          </div>

          {/* 3D Cover Flow Stage */}
          <div className="ix-coverflow-stage-wrapper">
            {/* Nav Prev */}
            <button className="ix-cover-nav-btn ix-cover-prev" onClick={handlePrevCover} aria-label="Previous Module">
              &lt;
            </button>

            {/* 3D Track */}
            <div className="ix-coverflow-track">
              {MARKETING_MODULES.map((m, idx) => {
                const diff = idx - activeModuleIndex;
                const absDiff = Math.abs(diff);
                const isActive = idx === activeModuleIndex;

                let cardStyle = {};
                if (isActive) {
                  cardStyle = {
                    transform: 'translateX(-50%) scale(1) translateZ(0)',
                    opacity: 1,
                    zIndex: 50,
                    borderColor: '#10b981',
                    boxShadow: '0 25px 60px rgba(16, 185, 129, 0.22), 0 0 0 2px #10b981',
                    filter: 'none'
                  };
                } else if (absDiff <= 3) {
                  const xOffset = diff * 290;
                  const scale = Math.max(0.72, 1 - absDiff * 0.14);
                  const rotY = diff < 0 ? 18 : -18;
                  const op = Math.max(0.3, 1 - absDiff * 0.3);
                  cardStyle = {
                    transform: `translateX(calc(-50% + ${xOffset}px)) scale(${scale}) rotateY(${rotY}deg)`,
                    opacity: op,
                    zIndex: 30 - absDiff,
                    filter: absDiff >= 2 ? 'blur(3px)' : 'none'
                  };
                } else {
                  cardStyle = {
                    display: 'none'
                  };
                }

                return (
                  <div
                    key={m.num}
                    className={`ix-coverflow-card ${isActive ? 'is-active' : ''}`}
                    style={cardStyle}
                    onClick={() => setActiveModuleIndex(idx)}
                  >
                    <div className="ix-cover-card-media">
                      <img src={m.image} alt={m.title} className="ix-cover-img" loading="lazy" />
                      <span className="ix-cover-tag">{m.tag}</span>
                      <span className="ix-cover-num">{m.num}</span>
                      <span className="ix-cover-dur">{m.dur}</span>
                    </div>

                    <div className="ix-cover-card-body">
                      <h3 className="ix-cover-title">{m.title}</h3>
                      <p className="ix-cover-desc">{m.desc}</p>

                      <div className="ix-cover-skills">
                        {m.skills.map((sk) => (
                          <span key={sk} className="ix-cover-skill-chip">
                            + {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Nav Next */}
            <button className="ix-cover-nav-btn ix-cover-next" onClick={handleNextCover} aria-label="Next Module">
              &gt;
            </button>
          </div>

          {/* Bottom 9 Filter Pills Row (Image 2 style) */}
          <div className="ix-coverflow-pills-row">
            {MARKETING_MODULES.map((m, idx) => (
              <button
                key={m.num}
                className={`ix-cover-pill-btn ${idx === activeModuleIndex ? 'is-active' : ''}`}
                onClick={() => setActiveModuleIndex(idx)}
              >
                {m.shortLabel}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
         SECTION 7: PROGRAM HIGHLIGHTS & MASTER TOOLS (TREE STEM MODEL - IMAGE 2 REFERENCE)
      ───────────────────────────────────────────────────────── */}
      <section id="benefits" className="ix-tree-sec">
        <div className="ix-container">
          <div className="ix-sec-header" style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <h2 className="ix-tree-heading" style={{ textAlign: 'center' }}>Program Highlights & Master Tools</h2>
            <p className="ix-tree-sub" style={{ maxWidth: '650px', margin: '0.6rem auto 0', textAlign: 'center' }}>
              Pairing practical course highlights with agency tool suites along a center stem.
            </p>
          </div>

          <div className="ix-tree-stem-container">
            {/* Center Stem Line */}
            <div className="ix-tree-center-line" />

            {/* Tree Rows */}
            <div className="ix-tree-rows-list">
              {TREE_TIERS.map((tier) => (
                <div key={tier.level} className="ix-tree-row">
                  {/* Left: Guarantee Card */}
                  <div className="ix-tree-left-col">
                    <div className="ix-tree-left-card">
                      <h3 className="ix-tree-card-title">{tier.highlight.title}</h3>
                      <p className="ix-tree-card-desc">{tier.highlight.desc}</p>
                    </div>
                  </div>

                  {/* Center Node Badge */}
                  <div className="ix-tree-node-col">
                    <div className="ix-tree-node-badge">{tier.level}</div>
                  </div>

                  {/* Right: Tools Suite Card */}
                  <div className="ix-tree-right-col">
                    <div className="ix-tree-right-card">
                      {tier.tools.map((t) => (
                        <div key={t.name} className="ix-tree-tool-item">
                          <div className="ix-tree-tool-name">{t.name}</div>
                          <div className="ix-tree-tool-desc">{t.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
         SECTION 9: KOLLAM CAMPUS & OFFER BOOKING FORM (MATCHING REFERENCE 2)
      ───────────────────────────────────────────────────────── */}
      <section id="contact" className="ix-booking-sec">
        <div id="nz-booking-sec" className="ix-container">
          <div className="ix-booking-grid">

            {/* Left: Kollam HQ */}
            <div className="ix-hq-card">
              <div className="ix-hq-badge">KOLLAM CAMPUS HQ</div>
              <h2 className="ix-hq-title">Networkz Systems Kollam</h2>
              <p className="ix-hq-address">
                Pattathuvila Plaza, 2nd Floor, Vadayattukotta Rd, Chinnakada, Kollam, Kerala 691001
              </p>
              
              <div className="ix-hq-contact-box">
                <div className="ix-hq-contact-item">
                  <span className="ix-hq-icon">📞</span>
                  <span>Phone / WhatsApp: <a href="https://wa.me/918089030405" target="_blank" rel="noopener noreferrer">+91 80890 30405</a></span>
                </div>
                <div className="ix-hq-contact-item">
                  <span className="ix-hq-icon">🕒</span>
                  <span>Hours: Monday – Saturday (9:00 AM – 5:30 PM)</span>
                </div>
              </div>

              <a href="https://maps.google.com/?q=Networkz+Systems+Kollam+Chinnakada" target="_blank" rel="noopener noreferrer" className="ix-hq-map-btn">
                📍 VIEW ON GOOGLE MAPS ↗
              </a>
            </div>

            {/* Right: Booking Form (Exact Match to Image 2 Reference) */}
            <div className="ix-offer-card-ref">
              {/* Top Banner Graphic (Image 2 visual style) */}
              <div className="ix-offer-top-banner">
                <span className="ix-banner-sub">SPECIAL ADMISSION OFFER</span>
                <div className="ix-banner-price-row">
                  <span className="ix-banner-old-price">₹35,000</span>
                  <span className="ix-banner-main-price">₹15,000</span>
                  <span className="ix-banner-save-badge">57% OFF</span>
                </div>
              </div>

              {/* Lower Form Container (Image 2 style) */}
              <div className="ix-offer-body-ref">
                <div className="ix-ref-header">
                  <span className="ix-ref-unlock">UNLOCK</span>
                  <h2 className="ix-ref-headline">₹15,000 OFFER</h2>
                  <span className="ix-ref-subhead">YOUR COURSE SEAT</span>
                  <p className="ix-ref-desc-lead">when you sign up with your details today</p>
                  <p className="ix-ref-desc-sub">
                    Join Networkz Systems Kollam for early access to live agency campaign projects, 100% placement drives, and free software licenses.
                  </p>
                </div>

                {submitted ? (
                  <div className="ix-offer-success">
                    <h4>₹15,000 OFFER CLAIM SENT!</h4>
                    <p>Thank you <strong>{formData.name}</strong>! Your seat reservation details have been sent to WhatsApp.</p>
                    <button className="ix-ref-cta-btn" onClick={() => setSubmitted(false)}>
                      BOOK ANOTHER SEAT
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="ix-ref-form">
                    <div className="ix-ref-field-group">
                      <label className="ix-ref-label">YOUR FULL NAME *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Nair"
                        className="ix-ref-input"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className="ix-ref-field-group">
                      <label className="ix-ref-label">PHONE / WHATSAPP NUMBER *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 80890 30405"
                        className="ix-ref-input"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    <div className="ix-ref-field-group">
                      <label className="ix-ref-label">CURRENT STATUS / ROLE</label>
                      <CustomSelect
                        dropUp
                        theme="light"
                        options={ROLE_OPTIONS}
                        value={formData.role}
                        onChange={(val) => setFormData({ ...formData, role: val })}
                      />
                    </div>

                    <button type="submit" className="ix-ref-cta-btn">
                      CLAIM ₹15,000 OFFER & ENROLL NOW 💬 ↗
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
         SECTION 10: LUXURY FOOTER
      ───────────────────────────────────────────────────────── */}
      <footer className="ix-footer">
        <div className="ix-container">
          <div className="ix-footer-grid">

            {/* Col 1 */}
            <div>
              <div className="ix-footer-logo">NETWORKZ <span style={{ color: '#a5f3fc', fontWeight: 800 }}>SYSTEMS</span></div>
              <p className="ix-footer-desc" style={{ marginBottom: '0.75rem' }}>
                Networkz Systems Kollam — ISO 9001:2015 accredited technology & digital marketing training institute. Empowering career breakthroughs.
              </p>
              <div className="nz-footer-contact-clean">
                <div className="nz-contact-row">
                  <svg className="nz-contact-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <a href="https://maps.google.com/?q=Networkz+Systems+Pattathuvila+Plaza+Chinnakada+Kollam" target="_blank" rel="noopener noreferrer" className="nz-address-link">
                    2nd Floor, Pattathuvila Plaza, Vadayattukotta Rd, Chinnakada, Kollam, Kerala 691001
                  </a>
                </div>

                <div className="nz-contact-row">
                  <svg className="nz-contact-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <a href="tel:+918089030405" className="nz-phone-link">+91 80890 30405</a>
                </div>

                <div className="nz-contact-row">
                  <svg className="nz-contact-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span>Monday – Saturday: 9:00 AM – 5:30 PM</span>
                </div>
              </div>
            </div>

            {/* Col 2 */}
            <div>
                <h4 className="ix-footer-heading">Resources</h4>
                <ul className="ix-footer-links">
                  <li><a href="#overview">Overview</a></li>
                  <li><a href="#syllabus">Features</a></li>
                  <li><a href="#benefits">Integration</a></li>
                  <li><a href="#tools">Services</a></li>
                </ul>
              </div>

              {/* Col 3 */}
              <div>
                <h4 className="ix-footer-heading">Instruction</h4>
                <ul className="ix-footer-links">
                  <li><a href="#syllabus">SEO & Google Ads</a></li>
                  <li><a href="#syllabus">Meta Ads</a></li>
                  <li><a href="#syllabus">WordPress</a></li>
                  <li><a href="#syllabus">CRM & AI Tools</a></li>
                </ul>
              </div>

              {/* Col 4 */}
              <div>
                <h4 className="ix-footer-heading">Legal</h4>
                <ul className="ix-footer-links">
                  <li><a href="#contact">Privacy Policy</a></li>
                  <li><a href="#contact">Terms of Service</a></li>
                  <li><span>ISO 9001:2015 Accredited</span></li>
                </ul>
              </div>

            </div>

            <div className="ix-footer-bottom">
              <span>NETWORKZ SYSTEMS KOLLAM</span>
              <span>© 2026 Networkz Systems Kollam. ISO 9001:2015 Certified. All rights reserved.</span>
            </div>
          </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────
         15-SECOND AUTO POPUP OFFER MODAL
      ───────────────────────────────────────────────────────── */}
      {showOfferModal && (
        <div className="nz-popup-overlay" onClick={() => setShowOfferModal(false)}>
          <div className="nz-popup-container" onClick={(e) => e.stopPropagation()}>
            <button className="nz-popup-close-btn" onClick={() => setShowOfferModal(false)} aria-label="Close Pop-up">
              ✕
            </button>

            {/* Offer Card Container */}
            <div className="ix-offer-card-ref" style={{ boxShadow: 'none' }}>
              <div className="ix-offer-top-banner">
                <span className="ix-banner-sub">SPECIAL ADMISSION OFFER</span>
                <div className="ix-banner-price-row">
                  <span className="ix-banner-old-price">₹35,000</span>
                  <span className="ix-banner-main-price">₹15,000</span>
                  <span className="ix-banner-save-badge">57% OFF</span>
                </div>
              </div>

              <div className="ix-offer-body-ref" style={{ padding: '2rem 1.75rem' }}>
                <div className="ix-ref-header">
                  <span className="ix-ref-unlock">UNLOCK</span>
                  <h2 className="ix-ref-headline">₹15,000 OFFER</h2>
                  <span className="ix-ref-subhead">YOUR COURSE SEAT</span>
                  <p className="ix-ref-desc-lead">when you sign up with your details today</p>
                </div>

                {submitted ? (
                  <div className="ix-offer-success">
                    <h4>₹15,000 OFFER CLAIM SENT!</h4>
                    <p>Thank you <strong>{formData.name}</strong>! Your seat reservation details have been sent to WhatsApp.</p>
                    <button className="ix-ref-cta-btn" onClick={() => { setSubmitted(false); setShowOfferModal(false); }}>
                      CLOSE
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="ix-ref-form">
                    <div className="ix-ref-field-group">
                      <label className="ix-ref-label">YOUR FULL NAME *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Nair"
                        className="ix-ref-input"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className="ix-ref-field-group">
                      <label className="ix-ref-label">PHONE / WHATSAPP NUMBER *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 80890 30405"
                        className="ix-ref-input"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    <div className="ix-ref-field-group">
                      <label className="ix-ref-label">CURRENT STATUS / ROLE</label>
                      <CustomSelect
                        dropUp
                        theme="light"
                        options={ROLE_OPTIONS}
                        value={formData.role}
                        onChange={(val) => setFormData({ ...formData, role: val })}
                      />
                    </div>

                    <button type="submit" className="ix-ref-cta-btn">
                      CLAIM ₹15,000 OFFER & ENROLL NOW 💬 ↗
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
