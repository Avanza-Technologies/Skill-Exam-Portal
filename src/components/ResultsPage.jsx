import { Link } from 'react-router-dom';
import './ResultsPage.css';

const initials = name =>
  name.trim().split(/\s+/).slice(0,2).map(w => w[0]?.toUpperCase()||'').join('');

export default function ResultsPage({ candidate, onRetake }) {
  return (
    <div className="done-page">
      <div className="done-card">

        {/* Company Header */}
        <div className="done-brand">
          Networkz Systems • Skill Connect 2026
        </div>

        {/* Success Icon */}
        <div className="done-check">✓</div>

        <h1 className="done-title">Exam Submitted Successfully</h1>
        <p className="done-sub">
          Thank you for completing the Skill Connect Exam 2026.
          Your responses have been recorded securely.
        </p>

        <div className="done-divider" />

        {/* Candidate Info Card */}
        <div className="done-cand">
          <div className="done-avatar">{candidate ? initials(candidate.name) : 'ST'}</div>
          <div className="done-cand-info">
            <div className="done-cand-name">{candidate ? candidate.name : 'Student Candidate'}</div>
            <div className="done-cand-email">{candidate ? candidate.email : 'candidate@email.com'}</div>
          </div>
          <div className="done-submitted">✓ Confirmed</div>
        </div>

        {/* Notice */}
        <div className="done-notice">
          <span className="done-notice-icon">📋</span>
          <p>
            <strong>Result Evaluation Notice:</strong> Your test score will be processed and communicated directly to your registered email and phone number. Contact the campus desk below for instant verification.
          </p>
        </div>

        {/* Contact Information */}
        <div className="done-contact">
          <div className="done-contact-label">Kollam Admission Desk</div>
          <div className="done-contact-org">Networkz Systems</div>
          <div className="done-contact-addr">
            Pattathuvila Plaza, Vadayattukotta Rd, Chinnakkada, Kollam
          </div>
          <div className="done-contact-phone">
            <span>📞</span>
            <span>+91 80 89 03 04 05</span>
          </div>
          <div className="done-socials">
            <a
              href="https://www.instagram.com/networkz_systems_kollam/"
              target="_blank"
              rel="noopener noreferrer"
              className="done-social-btn done-social-btn--ig"
              aria-label="Instagram"
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
              className="done-social-btn done-social-btn--fb"
              aria-label="Facebook"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Facebook</span>
            </a>
          </div>
        </div>

        <div className="done-btn-group">
          {onRetake && (
            <button className="done-btn" onClick={onRetake}>
              Register Another Candidate →
            </button>
          )}
          <Link to="/" className="done-home-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>Back to Home</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
