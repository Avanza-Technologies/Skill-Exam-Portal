import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CustomSelect from './components/CustomSelect';
import './NetworkzHome.css';
import './CyberSecurityLanding.css';

const WHATSAPP_PHONE = '918089030405';

const getWhatsAppUrl = (customMsg) => {
  const defaultMsg = [
    'NETWORKZ SYSTEMS KOLLAM',
    '══════════════════════',
    'Admissions Inquiry - Ethical Hacking & Cyber Security',
    '══════════════════════',
    '',
    'Hello Admissions Desk! I would like to inquire about your Cyber Security course, 20% discount offer, and batch schedules.',
    '',
    'Campus: Chinnakada, Kollam'
  ].join('\n');
  const msg = customMsg || defaultMsg;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
};

/* ── BRAND LOGO COMPONENT ── */
function NetworkzOfficialLogo() {
  return (
    <Link to="/" className="nz-cyber-logo-link">
      <div className="nz-cyber-logo-text-box">
        <div className="nz-cyber-logo-main">NETWORKZ</div>
        <div className="nz-cyber-logo-sub">SYSTEMS</div>
        <div className="nz-cyber-logo-divider" />
        <div className="nz-cyber-logo-iso">AN ISO 9001 : 2015 CERTIFIED COMPANY</div>
      </div>
      <div className="nz-cyber-emblem-wrap">
        <span className="nz-cyber-reg-mark">®</span>
        <div className="nz-cyber-emblem-box">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="15.2" cy="4" r="1.4" fill="#ffffff" stroke="none" />
            <path d="M11.5 16.5 L 16 9.5 L 20 4.5" />
            <path d="M14.5 11 L 11 13 L 13 9.5" />
            <path d="M 19.8 4.2 C 19.8 4.2 21 3 21 2 C 20 2.2 19 3.2 19.8 4.2 Z" fill="#ffffff" stroke="none" />
            <path d="M 15 13 L 9.5 20.5" />
            <path d="M 12 16.5 L 15 17 L 18 20.5" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

/* ── SYLLABUS MODULE DATA ── */
const SYLLABUS_MODULES = [
  {
    num: '01',
    title: 'Ethical Hacking & OSINT Reconnaissance',
    dur: '20 Hours Practical',
    tag: 'FOUNDATION',
    desc: 'Master target discovery, open-source intelligence gathering, Google Dorking, footprinting, and vulnerability reconnaissance.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    skills: ['OSINT & Google Dorking', 'Footprinting & DNS Recon', 'Social Engineering Vectors', 'Legal Ethics & Compliance']
  },
  {
    num: '02',
    title: 'Network Scanning & Traffic Analysis',
    dur: '25 Hours Practical',
    tag: 'NETWORK LAB',
    desc: 'Perform active & passive network scanning, live host discovery, port enumeration, and packet inspection with Wireshark & Nmap.',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80',
    skills: ['Nmap Advanced Scans', 'Wireshark Packet Analysis', 'Nessus Auditing', 'SNMP & Banner Grabbing']
  },
  {
    num: '03',
    title: 'System Hacking & Malware Exploitation',
    dur: '25 Hours Practical',
    tag: 'EXPLOITATION',
    desc: 'Execute host exploitation, privilege escalation, password hash cracking, and malware analysis using Metasploit Framework.',
    image: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=600&q=80',
    skills: ['Metasploit Exploitation', 'Password Hash Cracking', 'Trojans, Backdoors & Viruses', 'Privilege Escalation']
  },
  {
    num: '04',
    title: 'Web Application Security & OWASP Top 10',
    dur: '20 Hours Practical',
    tag: 'WEB DEFENSE',
    desc: 'Discover and mitigate SQL Injections, Cross-Site Scripting (XSS), CSRF, and web application flaws using Burp Suite Pro.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    skills: ['OWASP Top 10 Vulnerabilities', 'SQL Injection (SQLi)', 'Cross-Site Scripting (XSS)', 'Burp Suite Testing']
  },
  {
    num: '05',
    title: 'Wireless Network & Mobile Auditing',
    dur: '15 Hours Practical',
    tag: 'WIRELESS',
    desc: 'Audit wireless networks, breach WPA2/WPA3 encryption, deploy rogue access points, and analyze mobile application risks.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
    skills: ['WPA2/WPA3 Wi-Fi Cracking', 'Aircrack-ng Suite', 'Rogue Access Points', 'Man-in-the-Middle (MITM)']
  },
  {
    num: '06',
    title: 'SOC Operations & CEH v12 Certification Prep',
    dur: '15 Hours Practical',
    tag: 'SOC DEFENSE',
    desc: 'Build defensive capabilities with SIEM log analysis, incident response playbooks, firewall security, and CEH v12 exam prep.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
    skills: ['SIEM & Log Monitoring', 'Incident Response Playbooks', 'Firewall & IDS/IPS Config', 'CEH v12 Exam Prep']
  }
];

/* ── SECURITY TOOLS STACK ── */
const SECURITY_TOOLS = [
  { name: 'Kali Linux', cat: 'SECURITY OS', desc: 'Debian-derived Linux distribution designed for digital forensics & pen testing.', icon: '💻' },
  { name: 'Metasploit', cat: 'EXPLOITATION', desc: 'World’s most used penetration testing framework for discovering vulnerabilities.', icon: '⚡' },
  { name: 'Wireshark', cat: 'PACKET ANALYSIS', desc: 'Industry-standard network protocol analyzer for deep packet inspection.', icon: '🦈' },
  { name: 'Nmap', cat: 'NETWORK SCANNER', desc: 'Free, open-source utility for network discovery & vulnerability auditing.', icon: '🔍' },
  { name: 'Burp Suite', cat: 'WEB AUDIT', desc: 'Leading graphical tool for testing web application security vulnerabilities.', icon: '🛡️' },
  { name: 'Nessus', cat: 'VULN SCANNER', desc: 'Comprehensive vulnerability assessment scanner for enterprise networks.', icon: '📡' },
  { name: 'Snort', cat: 'IDS / IPS', desc: 'Open-source intrusion prevention system capable of real-time traffic analysis.', icon: '🔒' },
  { name: 'Aircrack-ng', cat: 'WIRELESS', desc: 'Complete suite of tools to assess Wi-Fi network security & encryption.', icon: '📶' },
  { name: 'John the Ripper', cat: 'PASSWORDS', desc: 'Fast password cracker designed to detect weak passwords & hashes.', icon: '🔑' },
  { name: 'Python Hacking', cat: 'AUTOMATION', desc: 'Custom exploit development and security automation using Python scripts.', icon: '🐍' },
];

/* ── CAREER PATHS ── */
const CAREER_ROLES = [
  { role: 'Ethical Hacker / Pen Tester', pkg: '₹6.5L - ₹14.0L / yr', badge: 'HIGH DEMAND', desc: 'Authorized security specialist conducting vulnerability tests on live enterprise systems.' },
  { role: 'SOC Security Analyst', pkg: '₹5.5L - ₹12.0L / yr', badge: 'IMMEDIATE HIRING', desc: 'Monitors 24/7 Security Operations Centers (SOC) to stop cyber attacks in real time.' },
  { role: 'Cyber Security Engineer', pkg: '₹7.0L - ₹18.0L / yr', badge: 'HIGH DEMAND', desc: 'Architects and deploys enterprise security infrastructure, firewalls, and encryption.' },
  { role: 'Information Security Auditor', pkg: '₹8.0L - ₹20.0L / yr', badge: 'PREMIUM ROLE', desc: 'Audits IT organizations for compliance with ISO 27001, NIST, and data protection laws.' },
  { role: 'Cloud Security Architect', pkg: '₹9.0L - ₹22.0L / yr', badge: 'TOP TIER', desc: 'Designs secure cloud infrastructure across AWS, Azure, and multi-cloud networks.' },
  { role: 'Incident Response Specialist', pkg: '₹6.0L - ₹15.0L / yr', badge: 'CRITICAL ROLE', desc: 'Rapid response engineer mitigating live breach incidents and forensic threat analysis.' }
];

const ROLE_OPTIONS = ['Student (Study)', 'Job Seeker (Job)', 'Working Professional (Employee)', 'Other'];

export default function CyberSecurityLanding() {
  const navigate = useNavigate();
  const cyberTrackRef = useRef(null);
  const careerTrackRef = useRef(null);

  const [isCyberTrackHovered, setIsCyberTrackHovered] = useState(false);
  const [isCareerTrackHovered, setIsCareerTrackHovered] = useState(false);

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

  /* ── AUTO-MOVING BANNER SLIDER FOR SYLLABUS CARDS ── */
  useEffect(() => {
    if (isCyberTrackHovered) return;
    const timer = setInterval(() => {
      if (cyberTrackRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = cyberTrackRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 15) {
          cyberTrackRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          cyberTrackRef.current.scrollBy({ left: 380, behavior: 'smooth' });
        }
      }
    }, 3000);
    return () => clearInterval(timer);
  }, [isCyberTrackHovered]);

  /* ── AUTO-MOVING BANNER SLIDER FOR CAREER ROLES CARDS ── */
  useEffect(() => {
    if (isCareerTrackHovered) return;
    const timer = setInterval(() => {
      if (careerTrackRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = careerTrackRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 15) {
          careerTrackRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          careerTrackRef.current.scrollBy({ left: 380, behavior: 'smooth' });
        }
      }
    }, 3200);
    return () => clearInterval(timer);
  }, [isCareerTrackHovered]);

  /* ── ON-PAGE SEO OPTIMIZATION FOR GOOGLE #1 RANKING IN KOLLAM ── */
  useEffect(() => {
    document.title = "Cyber Security Course in Kollam | Networkz Systems (100% Placement)";

    // Set canonical link specifically for /cybersecurity
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (canonicalEl) {
      canonicalEl.setAttribute('href', 'https://nskollam.com/cybersecurity');
    }

    // Set meta description specifically for Cyber Security
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Best Cyber Security & Ethical Hacking Course in Kollam, Kerala at Networkz Systems. ISO 9001:2015 certified training, hands-on penetration testing lab, CEH certification syllabus, and 100% placement support.');
    }

    // Inject Course & FAQ JSON-LD Schema
    const scriptId = 'cyber-security-jsonld-schema';
    let existingScript = document.getElementById(scriptId);
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.text = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Course",
            "name": "Ethical Hacking & Cyber Security Professional Course in Kollam",
            "description": "Comprehensive Cyber Security, Ethical Hacking, Network Security & Penetration Testing certification course in Kollam, Kerala with 100% placement support.",
            "provider": {
              "@type": "EducationalOrganization",
              "name": "Networkz Systems Kollam",
              "sameAs": "https://nskollam.com/"
            },
            "educationalCredentialAwarded": "Certified Ethical Hacker & Networkz Professional Certification",
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "courseMode": "Offline / Classroom & Live Online",
              "location": {
                "@type": "Place",
                "name": "Networkz Systems Kollam Campus",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Kollam",
                  "addressRegion": "Kerala",
                  "addressCountry": "IN"
                }
              }
            }
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Which is the best Cyber Security course in Kollam?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Networkz Systems Kollam offers the #1 Cyber Security & Ethical Hacking course in Kollam, featuring live lab training, ISO 9001:2015 certification, and 100% placement assistance."
                }
              },
              {
                "@type": "Question",
                "name": "Does Networkz Systems Kollam offer placement for Cyber Security students?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, Networkz Systems Kollam has a 100% placement assistance cell connecting Cyber Security students with top MNCs and IT security firms in Kerala and South India."
                }
              },
              {
                "@type": "Question",
                "name": "What is the qualification required for the Cyber Security course in Kollam?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Students from B.Tech, BCA, BSc CS, Diploma, or any degree background interested in Ethical Hacking and Computer Networking can join the Cyber Security course at Networkz Systems Kollam."
                }
              }
            ]
          }
        ]
      });
      document.head.appendChild(script);
    }
  }, []);

  const scrollCyberLeft = () => {
    if (cyberTrackRef.current) {
      cyberTrackRef.current.scrollBy({ left: -380, behavior: 'smooth' });
    }
  };

  const scrollCyberRight = () => {
    if (cyberTrackRef.current) {
      cyberTrackRef.current.scrollBy({ left: 380, behavior: 'smooth' });
    }
  };

  const scrollCareerLeft = () => {
    if (careerTrackRef.current) {
      careerTrackRef.current.scrollBy({ left: -380, behavior: 'smooth' });
    }
  };

  const scrollCareerRight = () => {
    if (careerTrackRef.current) {
      careerTrackRef.current.scrollBy({ left: 380, behavior: 'smooth' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const msg = [
      'NETWORKZ SYSTEMS KOLLAM',
      '══════════════════════',
      '🎉 20% OFFER CLAIM - ETHICAL HACKING & CYBER SECURITY',
      '══════════════════════',
      '',
      `Candidate Name : ${formData.name}`,
      `Phone Number   : ${formData.phone}`,
      `Current Status : ${formData.role}`,
      `Selected Course: Ethical Hacking & Cyber Security Masterclass`,
      'Special Offer  : 20% DISCOUNT CLAIM (THIS MONTH)',
      'Campus Location: Pattathuvila Plaza, 2nd Floor, Vadayattukotta Rd, Chinnakada, Kollam',
      '',
      '══════════════════════',
      'Hello Admissions Desk! I want to claim the 20% discount offer and enroll in the Ethical Hacking & Cyber Security course. Please call me back!'
    ].join('\n');
    const waUrl = getWhatsAppUrl(msg);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const scrollToBooking = () => {
    const el = document.getElementById('nz-booking-sec');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="nz-cyber-luxury-root">
      {/* ─────────────────────────────────────────────────────────
         TOP NAVIGATION (EXACT HOMEPAGE HEADER & LOGO)
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
          <li><a href="#tools" className="nz-nav-link">SECURITY STACK</a></li>
          <li><a href="#careers" className="nz-nav-link">CAREERS</a></li>
          <li><a href="#contact" className="nz-nav-link">KOLLAM CAMPUS</a></li>
        </ul>

        {/* Desktop Actions & Mobile Hamburger Toggle */}
        <div className="nz-nav-actions">
          <button className="nz-nav-cta" onClick={scrollToBooking} style={{ cursor: 'pointer', border: 'none' }}>
            CLAIM 20% OFFER ↗
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
              <span>Hands-on Syllabus</span>
              <span className="nz-mobile-nav-arrow">→</span>
            </a>
          </li>
          <li>
            <a href="#tools" className="nz-mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
              <span>Security Stack & Labs</span>
              <span className="nz-mobile-nav-arrow">→</span>
            </a>
          </li>
          <li>
            <a href="#careers" className="nz-mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
              <span>Job Roles & Salaries</span>
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
            CLAIM 20% DISCOUNT OFFER ↗
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
          <span>Cyber Security Lab • Kollam</span>
          <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">WhatsApp Desk ↗</a>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
         TOP GLOWING RIBBON
      ───────────────────────────────────────────────────────── */}
      <div className="nz-cyber-ribbon">
        <div className="nz-cyber-ribbon-shimmer" />
        <span>🎉 25TH ANNIVERSARY SPECIAL: 20% DISCOUNT OFFER FOR THIS MONTH AT KOLLAM CAMPUS! 🎉</span>
      </div>

      {/* ─────────────────────────────────────────────────────────
         CINEMATIC HERO SECTION
      ───────────────────────────────────────────────────────── */}
      <section id="overview" className="nz-cyber-hero">
        <div className="nz-cyber-hero-bg">
          <div className="nz-cyber-orb-1" />
          <div className="nz-cyber-orb-2" />
          <div className="nz-cyber-grid-pattern" />
        </div>

        <div className="nz-cyber-hero-inner">
          {/* Hero Left Content */}
          <div className="nz-cyber-hero-content">
            <div className="nz-cyber-pill-tag">
              <span className="nz-cyber-pulse" /> AN ISO 9001:2015 CERTIFIED ACADEMY
            </div>

            <h1 className="nz-cyber-hero-title">
              #1 CYBER SECURITY &<br />
              <span className="nz-cyber-gradient-text">ETHICAL HACKING COURSE</span><br />
              IN KOLLAM, KERALA
            </h1>

            <p className="nz-cyber-hero-subtitle">
              Master real-world penetration testing, network security auditing, vulnerability assessment, and SOC defense operations. Learn 100% hands-on in Kollam’s premier ISO-certified cyber lab with 100% placement support.
            </p>

            {/* Quick Metrics Bar */}
            <div className="nz-cyber-metrics-row">
              <div className="nz-cyber-metric-item">
                <span className="nz-metric-val">100%</span>
                <span className="nz-metric-lbl">Placement Support</span>
              </div>
              <div className="nz-cyber-metric-item">
                <span className="nz-metric-val">20% OFF</span>
                <span className="nz-metric-lbl">Limited Month Offer</span>
              </div>
              <div className="nz-cyber-metric-item">
                <span className="nz-metric-val">120+ HRS</span>
                <span className="nz-metric-lbl">Hands-on Cyber Lab</span>
              </div>
              <div className="nz-cyber-metric-item">
                <span className="nz-metric-val">LIFETIME</span>
                <span className="nz-metric-lbl">Membership</span>
              </div>
            </div>

            {/* Hero Dual Action Buttons */}
            <div className="nz-cyber-hero-ctas ix-hero-ctas">
              <button className="ix-btn-pill-solid-dark nz-btn-emerald-glow" onClick={scrollToBooking}>
                CLAIM 20% DISCOUNT OFFER 💬 ↗
              </button>
              <a href="https://wa.me/918089030405" target="_blank" rel="noopener noreferrer" className="ix-btn-pill-outline-hero">
                WHATSAPP COUNSELOR 💬
              </a>
            </div>
          </div>

          {/* Hero Right Media Showcase */}
          <div className="nz-cyber-hero-showcase">
            <div className="nz-cyber-media-card">
              <div className="nz-media-top-bar">
                <div className="nz-live-status">
                  <span className="nz-status-dot" /> KOLLAM CYBER LAB ACTIVE
                </div>
                <span className="nz-media-badge">CEH v12 ALIGNED</span>
              </div>

              <img
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80"
                alt="Networkz Systems Cyber Security Lab"
                className="nz-media-img"
              />

              <div className="nz-media-footer">
                <div>
                  <div className="nz-media-title">Networkz Systems Cyber Lab</div>
                  <div className="nz-media-sub">Pattathuvila Plaza, Chinnakada, Kollam</div>
                </div>
                <div className="nz-media-price-pill">
                  <span style={{ fontSize: '0.65rem', opacity: 0.8, display: 'block', textDecoration: 'line-through' }}>FEES ₹25,000</span>
                  <span>NOW 20% OFF</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
         4 POSTER PILLARS (WHY CHOOSE NETWORKZ SYSTEMS)
      ───────────────────────────────────────────────────────── */}
      <section className="nz-cyber-pillars-sec">
        <div className="nz-cyber-container">
          <div className="nz-cyber-sec-header">
            <span className="nz-cyber-tag-cyan">EXCELLENCE GUARANTEED</span>
            <h2 className="nz-cyber-sec-h2">Why Learn Ethical Hacking at Networkz Systems?</h2>
            <p className="nz-cyber-sec-p">Extracted directly from our official Kollam flagship poster & training standards.</p>
          </div>

          <div className="nz-cyber-pillars-grid">
            <div className="nz-cyber-pillar-card">
              <div className="nz-pillar-top">
                <span className="nz-pillar-icon-box">🛡️</span>
                <span className="nz-pillar-tag">CAREER PIPELINE</span>
              </div>
              <div className="nz-pillar-big">100%</div>
              <h3 className="nz-pillar-h3">100% Placement Assistance</h3>
              <p className="nz-pillar-p">Direct corporate placement drives with 200+ top IT firms, mock technical interviews & resume engineering.</p>
              <span className="nz-pillar-pill">200+ HIRING FIRMS</span>
            </div>

            <div className="nz-cyber-pillar-card nz-pillar-highlight">
              <div className="nz-pillar-top">
                <span className="nz-pillar-icon-box">💻</span>
                <span className="nz-pillar-tag">PRACTICAL FIRST</span>
              </div>
              <div className="nz-pillar-big">100%</div>
              <h3 className="nz-pillar-h3">100% Hands-on Practice</h3>
              <p className="nz-pillar-p">Execute penetration testing on Kali Linux, Metasploit, Nmap, Wireshark, Burp Suite & live CTF vulnerability labs.</p>
              <span className="nz-pillar-pill">LIVE PEN-TEST LABS</span>
            </div>

            <div className="nz-cyber-pillar-card">
              <div className="nz-pillar-top">
                <span className="nz-pillar-icon-box">♾️</span>
                <span className="nz-pillar-tag">MEMBERSHIP</span>
              </div>
              <div className="nz-pillar-big">LIFETIME</div>
              <h3 className="nz-pillar-h3">Lifetime Membership</h3>
              <p className="nz-pillar-p">Retake course modules anytime, access upgraded cyber lab tools, and receive lifetime career mentoring.</p>
              <span className="nz-pillar-pill">UNLIMITED ACCESS</span>
            </div>

            <div className="nz-cyber-pillar-card nz-pillar-highlight">
              <div className="nz-pillar-top">
                <span className="nz-pillar-icon-box">👨‍🏫</span>
                <span className="nz-pillar-tag">CERTIFIED LEADS</span>
              </div>
              <div className="nz-pillar-big">EXPERT</div>
              <h3 className="nz-pillar-h3">Professional Certified Trainers</h3>
              <p className="nz-pillar-p">Learn directly from CEH & CISSP certified active security engineers with 10+ years corporate experience.</p>
              <span className="nz-pillar-pill">CEH CERTIFIED</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
         WHAT YOU WILL LEARN (MOVABLE BANNER CAROUSEL)
      ───────────────────────────────────────────────────────── */}
      <section id="syllabus" className="nz-cyber-syllabus-sec">
        <div className="nz-cyber-container">
          <div className="nz-cyber-sec-header" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div>
              <span className="nz-cyber-tag-cyan">MASTERCLASS CURRICULUM</span>
              <h2 className="nz-cyber-sec-h2">What You Will Learn in This Program</h2>
              <p className="nz-cyber-sec-p" style={{ maxWidth: '600px' }}>
                Step-by-step masterclass taking you from beginner to job-ready ethical hacker. Slide left & right to explore.
              </p>
            </div>

            {/* BANNER CONTROLS */}
            <div className="ix-banner-controls" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className="nz-banner-live-badge">
                <span className="nz-pulse-cyan-dot" /> AUTO MOVING
              </span>
              <button className="ix-banner-arrow" onClick={scrollCyberLeft} aria-label="Previous Module">
                ←
              </button>
              <button className="ix-banner-arrow" onClick={scrollCyberRight} aria-label="Next Module">
                →
              </button>
            </div>
          </div>

          {/* MOVABLE BANNER TRACK */}
          <div
            className="ix-banner-track"
            ref={cyberTrackRef}
            onMouseEnter={() => setIsCyberTrackHovered(true)}
            onMouseLeave={() => setIsCyberTrackHovered(false)}
          >
            {SYLLABUS_MODULES.map((m) => (
              <div key={m.num} className="ix-module-banner-card">
                <div className="nz-module-media" style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                  <img src={m.image} alt={m.title} className="nz-module-img" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span className="nz-module-tag" style={{ position: 'absolute', top: '1rem', left: '1rem', background: '#111111', color: '#ffffff', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 800 }}>{m.tag}</span>
                  <span className="nz-module-dur" style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255, 255, 255, 0.95)', color: '#111111', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>{m.dur}</span>
                  <div className="nz-module-num-watermark" style={{ position: 'absolute', bottom: '1rem', right: '1rem', fontSize: '2rem', fontWeight: 900, color: 'rgba(255, 255, 255, 0.9)', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{m.num}</div>
                </div>

                <div className="nz-module-body" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, justifyContent: 'space-between' }}>
                  <h3 className="nz-module-title" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--ix-primary)', lineHeight: 1.3 }}>{m.title}</h3>
                  <p className="nz-module-desc" style={{ fontSize: '0.92rem', color: 'var(--ix-text-sub)', lineHeight: 1.6 }}>{m.desc}</p>

                  <div className="nz-module-skills-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {m.skills.map((sk) => (
                      <span key={sk} className="nz-skill-chip" style={{ fontSize: '0.75rem', fontWeight: 700, background: '#F1F1F1', color: '#111111', padding: '0.35rem 0.75rem', borderRadius: '6px' }}>
                        ✦ {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
         SECURITY TOOLS STACK SHOWCASE (ULTRA-PREMIUM CARDS)
      ───────────────────────────────────────────────────────── */}
      <section id="tools" className="nz-cyber-tools-sec">
        <div className="nz-cyber-container">
          <div className="nz-cyber-sec-header" style={{ marginBottom: '3.5rem' }}>
            <span className="nz-cyber-tag-cyan">LAB STACK & EQUIPMENT</span>
            <h2 className="nz-cyber-sec-h2">Industry Standard Security Tools You Will Master</h2>
            <p className="nz-cyber-sec-p" style={{ maxWidth: '680px' }}>
              Gain direct hands-on practical command over software suites used by global cybersecurity operation teams.
            </p>
          </div>

          <div className="nz-cyber-tools-grid">
            {SECURITY_TOOLS.map((t) => (
              <div key={t.name} className="nz-cyber-tool-card">
                <div>
                  <div className="nz-tool-card-top">
                    <div className="nz-tool-icon-box">
                      <span className="nz-tool-emoji">{t.icon}</span>
                    </div>
                    <span className="nz-tool-cat">{t.cat}</span>
                  </div>

                  <div className="nz-tool-card-body">
                    <h4 className="nz-tool-title">{t.name}</h4>
                    <p className="nz-tool-desc">{t.desc}</p>
                  </div>
                </div>

                <div className="nz-tool-card-footer">
                  <span className="nz-tool-lab-badge">✦ HANDS-ON LAB MODULE</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
         CAREER ROLES & SALARY POTENTIAL (AUTO-MOVING MODERN CARDS BANNER)
      ───────────────────────────────────────────────────────── */}
      <section id="careers" className="nz-cyber-careers-sec">
        <div className="nz-cyber-container">
          <div className="nz-cyber-sec-header-row" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div className="nz-cyber-sec-header" style={{ marginBottom: 0 }}>
              <span className="nz-cyber-tag-cyan">HIGH DEMAND CAREERS</span>
              <h2 className="nz-cyber-sec-h2">Career Opportunities & Salary Packages</h2>
              <p className="nz-cyber-sec-p">Cybersecurity is among the fastest-growing sectors in global IT.</p>
            </div>

            {/* AUTOMATICALLY MOVING BANNER CONTROLS */}
            <div className="ix-banner-controls" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className="nz-banner-live-badge">
                <span className="nz-pulse-cyan-dot" /> AUTO MOVING
              </span>
              <button className="ix-banner-arrow" onClick={scrollCareerLeft} aria-label="Previous Career Role">
                ←
              </button>
              <button className="ix-banner-arrow" onClick={scrollCareerRight} aria-label="Next Career Role">
                →
              </button>
            </div>
          </div>

          {/* MOVABLE CAREER BANNER TRACK */}
          <div
            className="nz-cyber-careers-banner-track"
            ref={careerTrackRef}
            onMouseEnter={() => setIsCareerTrackHovered(true)}
            onMouseLeave={() => setIsCareerTrackHovered(false)}
          >
            {CAREER_ROLES.map((c) => (
              <div key={c.role} className="nz-cyber-career-card nz-cyber-career-banner-card">
                <div className="nz-career-head">
                  <h3 className="nz-career-title">{c.role}</h3>
                  <span className="nz-career-badge">{c.badge}</span>
                </div>
                <div className="nz-career-pkg">{c.pkg}</div>
                <p className="nz-career-desc">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
         SECTION 9: KOLLAM CAMPUS & 20% DISCOUNT BOOKING FORM (DIGITAL MARKETING STYLE)
      ───────────────────────────────────────────────────────── */}
      <section id="contact" className="ix-booking-sec">
        <div id="nz-booking-sec" className="ix-container">
          <div className="ix-booking-grid">

            {/* Left: Kollam HQ Card */}
            <div className="ix-hq-card">
              <div className="ix-hq-badge">KOLLAM CAMPUS HQ</div>
              <h2 className="ix-hq-title">Networkz Systems Kollam</h2>
              <p className="ix-hq-address">
                Pattathuvila Plaza, 2nd Floor, Vadayattukotta Rd, Chinnakada, Kollam, Kerala 691001
              </p>
              
              <div className="ix-hq-contact-box">
                <div className="ix-hq-contact-item">
                  <span className="ix-hq-icon">📞</span>
                  <span>Admission Hotline: <a href="https://wa.me/918089030405" target="_blank" rel="noopener noreferrer">+91 80890 30405</a></span>
                </div>
                <div className="ix-hq-contact-item">
                  <span className="ix-hq-icon">✉️</span>
                  <span>Official Email: <a href="mailto:support@nskollam.com">support@nskollam.com</a></span>
                </div>
                <div className="ix-hq-contact-item">
                  <span className="ix-hq-icon">🕒</span>
                  <span>Hours: Monday – Saturday (9:00 AM – 5:30 PM)</span>
                </div>
              </div>

              <a href="https://maps.google.com/?q=Networkz+Systems+Kollam+Chinnakada" target="_blank" rel="noopener noreferrer" className="ix-hq-map-btn">
                📍 VIEW ON GOOGLE MAPS ↗
              </a>

              <div className="nz-footer-social-wrap" style={{ marginTop: '1rem', paddingTop: '0.85rem' }}>
                <span className="nz-social-label">CONNECT WITH US</span>
                <div className="nz-social-btns">
                  <a
                    href="https://www.instagram.com/networkz_systems_kollam/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nz-social-btn nz-social-btn--ig"
                    aria-label="Instagram"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span>Instagram</span>
                  </a>
                  <a
                    href="https://www.facebook.com/Networkzsystemskollam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nz-social-btn nz-social-btn--fb"
                    aria-label="Facebook"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Facebook</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Booking Form (Matching Digital Marketing Reference Style) */}
            <div className="ix-offer-card-ref">
              {/* Top Banner Graphic */}
              <div className="ix-offer-top-banner">
                <span className="ix-banner-sub">SPECIAL ADMISSION OFFER</span>
                <div className="ix-banner-price-row">
                  <span className="ix-banner-old-price">REGULAR FEE</span>
                  <span className="ix-banner-main-price">20% OFF</span>
                  <span className="ix-banner-save-badge">THIS MONTH</span>
                </div>
              </div>

              {/* Lower Form Container */}
              <div className="ix-offer-body-ref">
                <div className="ix-ref-header">
                  <span className="ix-ref-unlock">UNLOCK</span>
                  <h2 className="ix-ref-headline">20% DISCOUNT OFFER</h2>
                  <span className="ix-ref-subhead">YOUR CYBER SECURITY SEAT</span>
                  <p className="ix-ref-desc-lead">when you sign up with your details today</p>
                  <p className="ix-ref-desc-sub">
                    Join Networkz Systems Kollam for early access to live ethical hacking lab tools, CEH preparation, and 100% placement drives.
                  </p>
                </div>

                {submitted ? (
                  <div className="ix-offer-success">
                    <h4>20% DISCOUNT OFFER CLAIM SENT!</h4>
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
                      CLAIM 20% DISCOUNT & ENROLL NOW 💬 ↗
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
         FOOTER
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

            {/* Col 2 */}
            <div>
              <h4 className="ix-footer-heading">DISCIPLINE TRACKS</h4>
              <ul className="ix-footer-links">
                <li><a href="#syllabus">Ethical Hacking (CEH v12)</a></li>
                <li><a href="#syllabus">Network Security & Auditing</a></li>
                <li><a href="#syllabus">Web App Security (OWASP)</a></li>
                <li><a href="#syllabus">SOC Operations & Defense</a></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="ix-footer-heading">SECURITY TOOLS STACK</h4>
              <ul className="ix-footer-links">
                <li><a href="#tools">Kali Linux & Metasploit</a></li>
                <li><a href="#tools">Wireshark & Nmap</a></li>
                <li><a href="#tools">Burp Suite Pro</a></li>
                <li><a href="#tools">Nessus & Snort IDS/IPS</a></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className="ix-footer-heading">ACCREDITATION & LEGAL</h4>
              <ul className="ix-footer-links">
                <li><span>ISO 9001:2015 Certified</span></li>
                <li><span>Pearson VUE Authorized</span></li>
                <li><span>100% Placement Guarantee</span></li>
                <li><a href="#contact">Privacy & Terms</a></li>
              </ul>
            </div>

          </div>

          <div className="ix-footer-bottom">
            <span>NETWORKZ SYSTEMS KOLLAM</span>
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
                  <span className="ix-banner-old-price">REGULAR FEE</span>
                  <span className="ix-banner-main-price">20% OFF</span>
                  <span className="ix-banner-save-badge">THIS MONTH</span>
                </div>
              </div>

              <div className="ix-offer-body-ref" style={{ padding: '2rem 1.75rem' }}>
                <div className="ix-ref-header">
                  <span className="ix-ref-unlock">UNLOCK</span>
                  <h2 className="ix-ref-headline">20% DISCOUNT OFFER</h2>
                  <span className="ix-ref-subhead">YOUR CYBER SECURITY SEAT</span>
                  <p className="ix-ref-desc-lead">when you sign up with your details today</p>
                </div>

                {submitted ? (
                  <div className="ix-offer-success">
                    <h4>20% DISCOUNT OFFER CLAIM SENT!</h4>
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
                      CLAIM 20% DISCOUNT & ENROLL NOW 💬 ↗
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
