import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Registration.css';

const FIELDS = [
  { id: 'name', label: 'Full Name', placeholder: 'e.g. John Doe', type: 'text', half: false },
  { id: 'email', label: 'Email Address', placeholder: 'e.g. john@example.com', type: 'email', half: false },
  { id: 'phone', label: 'Phone Number', placeholder: '+91 98765 43210', type: 'tel', half: true },
  { id: 'dob', label: 'Date of Birth', placeholder: '', type: 'date', half: true },
];

function validate(f) {
  const e = {};
  if (!f.name.trim() || f.name.trim().length < 2) e.name = 'Enter your full name.';
  
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(f.email.trim())) {
    e.email = 'Enter a valid email address.';
  }
  
  if (!/^(?:\+91)?[6789]\d{9}$/.test(f.phone.replace(/[\s\-()]/g, ''))) {
    e.phone = 'Enter a valid 10-digit mobile number.';
  }

  if (!f.dob) {
    e.dob = 'Select date of birth.';
  } else {
    const dobDate = new Date(f.dob);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    if (age < 15) {
      e.dob = 'Candidate must be at least 15 years old.';
    } else if (age > 100) {
      e.dob = 'Enter a valid date of birth.';
    }
  }
  return e;
}

function Field({ f, form, errors, touched, onChange, onBlur }) {
  const isErr = errors[f.id] && touched[f.id];

  if (f.id === 'dob') {
    const currentYear = new Date().getFullYear();
    const maxDate = `${currentYear - 5}-12-31`;
    const minDate = '1940-01-01';

    return (
      <div className="f-group">
        <label className="f-label" htmlFor="dob">
          {f.label} <span className="req">*</span>
        </label>
        <input
          id="dob"
          className={`f-input ${isErr ? 'err' : ''}`}
          type="date"
          min={minDate}
          max={maxDate}
          value={form.dob}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete="off"
        />
        {isErr && (
          <span className="f-error">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {errors.dob}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="f-group">
      <label className="f-label" htmlFor={f.id}>
        {f.label} <span className="req">*</span>
      </label>
      <input
        id={f.id}
        className={`f-input ${isErr ? 'err' : ''}`}
        type={f.type}
        placeholder={f.placeholder}
        value={form[f.id]}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete="off"
      />
      {isErr && (
        <span className="f-error">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {errors[f.id]}
        </span>
      )}
    </div>
  );
}

export default function Registration({ onStart }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', dob: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [busy, setBusy] = useState(false);

  const onChange = ({ target: { id, value } }) => {
    setForm(p => ({ ...p, [id]: value }));
    if (touched[id]) setErrors(p => ({ ...p, [id]: validate({ ...form, [id]: value })[id] }));
  };

  const onBlur = ({ target: { id } }) => {
    setTouched(p => ({ ...p, [id]: true }));
    setErrors(p => ({ ...p, [id]: validate(form)[id] }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true, dob: true });
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length) return;
    setBusy(true);
    await new Promise(r => setTimeout(r, 400));
    onStart({ ...form });
  };

  const fullFields = FIELDS.filter(f => !f.half);
  const halfFields = FIELDS.filter(f => f.half);

  return (
    <div className="reg-wrap">

      {/* ── LEFT SIDEBAR ── */}
      <aside className="reg-side">
        <div className="reg-side-nav">
          <Link to="/" className="reg-side-home-btn" title="Return to Main Website">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Back to Home</span>
          </Link>
          <div className="reg-logo-badge">
            ⚡ NETWORKZ SYSTEMS KOLLAM
          </div>
        </div>

        <h1 className="reg-side-title">
          Skill Connect<br />
          <span>Exam 2026</span>
        </h1>

        <p className="reg-side-desc">
          A comprehensive IT assessment covering Networking, Cybersecurity,
          Programming, Cloud Computing, AI/ML and more.
        </p>

        <div className="reg-details">
          <div className="reg-detail-row">
            <div className="reg-detail-icon">📋</div>
            <div className="reg-detail-text">
              <div className="reg-detail-label">Questions</div>
              <div className="reg-detail-val">50 Multiple Choice</div>
            </div>
          </div>
          <div className="reg-detail-row">
            <div className="reg-detail-icon">⏱</div>
            <div className="reg-detail-text">
              <div className="reg-detail-label">Duration</div>
              <div className="reg-detail-val">30 Minutes</div>
            </div>
          </div>
          <div className="reg-detail-row">
            <div className="reg-detail-icon">🏆</div>
            <div className="reg-detail-text">
              <div className="reg-detail-label">Marking</div>
              <div className="reg-detail-val">1 Mark per Question</div>
            </div>
          </div>
          <div className="reg-detail-row">
            <div className="reg-detail-icon">🌐</div>
            <div className="reg-detail-text">
              <div className="reg-detail-label">Topics</div>
              <div className="reg-detail-val">Networking, Cyber, Cloud, Dev</div>
            </div>
          </div>
        </div>

        <div className="reg-side-footer">
          <div className="reg-side-footer-label">Organised by</div>
          <div className="reg-side-footer-org">Networkz Systems</div>
          <div className="reg-side-footer-addr">
            Pattathuvila Plaza, Vadayattukotta Rd,<br />
            Chinnakkada, Kollam<br />
            Ph: 80 89 03 04 05
          </div>
        </div>
      </aside>

      {/* ── RIGHT FORM ── */}
      <main className="reg-main">
        <div className="reg-form-box">

          <div className="reg-top-bar">
            <Link to="/" className="reg-home-pill-btn" title="Return to Main Website">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span>Back to Home</span>
            </Link>
            <span className="reg-portal-pill">Candidate Portal</span>
          </div>

          <div className="reg-form-heading">
            <h2>Create Your Account</h2>
            <p>Please fill in the details below to register for Skill Connect Exam 2026.</p>
          </div>

          <div className="reg-form-card">
            <form onSubmit={onSubmit} noValidate>
              <div className="reg-fields">
                {fullFields.map(f => (
                  <Field
                    key={f.id}
                    f={f}
                    form={form}
                    errors={errors}
                    touched={touched}
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                ))}
                <div className="reg-row">
                  {halfFields.map(f => (
                    <Field
                      key={f.id}
                      f={f}
                      form={form}
                      errors={errors}
                      touched={touched}
                      onChange={onChange}
                      onBlur={onBlur}
                    />
                  ))}
                </div>
              </div>

              <button type="submit" className="reg-submit-btn" disabled={busy}>
                {busy
                  ? <><span className="spinner" /> Setting up…</>
                  : 'Start Exam →'
                }
              </button>
            </form>
          </div>

          <div className="reg-meta-strip">
            {[
              { num: '50', lbl: 'Questions' },
              { num: '30', lbl: 'Minutes' },
              { num: 'MCQ', lbl: 'Format' },
              { num: '1pt', lbl: 'Per Q' },
            ].map(m => (
              <div className="reg-meta-cell" key={m.lbl}>
                <div className="reg-meta-num">{m.num}</div>
                <div className="reg-meta-lbl">{m.lbl}</div>
              </div>
            ))}
          </div>

        </div>
      </main>

    </div>
  );
}
