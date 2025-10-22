import React from 'react';

function ConsultationPage() {
  return (
    <div className="consultation-page">
      {/* Hero Section */}
      <section className="hero-section">
        <h1>One Honest Conversation Can Help You See Everything Clearly</h1>
        <h2>Speak Directly with Astrologer Madhav Yadav — The Man Behind the Miracles</h2>
        <p>Starts @ ₹1,48,000/-</p>
        <p><em>Highly Confidential | Life Changing Experience</em></p>
        <div className="hero-buttons">
          <button>Book Your Audio Consultation Call Now</button>
          <button>Book Your Face-to-Face Consultation</button>
        </div>
        <div className="hero-image">
          <img src="https://via.placeholder.com/600x400" alt="Consultation" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat-item">
          <h3>20+ Years of Legacy</h3>
        </div>
        <div className="stat-item">
          <h3>10+ Countries Served</h3>
        </div>
        <div className="stat-item">
          <h3>4.8/5 Average Rating</h3>
        </div>
        <div className="stat-item">
          <h3>10,000+ Consultations Done</h3>
        </div>
        <div className="stat-item">
          <h3>20+ Awards in Astrology</h3>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="feature-item">
          <img src="https://via.placeholder.com/150" alt="Spiritual Precision" />
          <h3>Spiritual Precision</h3>
          <p>Decades of discipline in Vedic Astrology, Occult Sciences, and Karmic Psychology refined into razor sharp insights.</p>
        </div>
        <div className="feature-item">
          <img src="https://via.placeholder.com/150" alt="No Sugarcoating" />
          <h3>No Sugarcoating</h3>
          <p>You do not get vague predictions. You get clarity, truth, and direction straight from the source.</p>
        </div>
        <div className="feature-item">
          <img src="https://via.placeholder.com/150" alt="One Session Real Shifts" />
          <h3>One Session, Real Shifts</h3>
          <p>Clients walk in confused and walk out with purpose. This is the moment when things finally start to make sense.</p>
        </div>
        <div className="feature-item">
          <img src="https://via.placeholder.com/150" alt="Remedies That Rewire Karma" />
          <h3>Remedies That Rewire Karma</h3>
          <p>Every solution comes from your own chart rooted in your planetary blueprint and energetically aligned with your purpose.</p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <h2>Let’s Get to the Root of What’s Holding You Back</h2>
        <p>Pinpoint the blocks in your life</p>
        <div className="category-grid">
          <div className="category-item">
            <img src="https://via.placeholder.com/100" alt="Career" />
            <h4>Career</h4>
            <ul>
              <li>Why does success always feel slow or just out of reach?</li>
              <li>Should you keep going, switch paths, or try something new?</li>
              <li>What kind of work will truly fulfill you and bring stability?</li>
            </ul>
          </div>
          <div className="category-item">
            <img src="https://via.placeholder.com/100" alt="Love & Relationships" />
            <h4>Love & Relationships</h4>
            <ul>
              <li>Why do your relationships feel confusing, heavy, or stuck in a loop?</li>
              <li>Is your current partner the right one or just a passing phase?</li>
              <li>What’s really causing delays or issues in your love life or marriage?</li>
            </ul>
          </div>
          <div className="category-item">
            <img src="https://via.placeholder.com/100" alt="Money & Growth" />
            <h4>Money & Growth</h4>
            <ul>
              <li>Why does money come in but never seem to stay?</li>
              <li>Are you meant to struggle, or is something blocking your growth?</li>
              <li>What changes can help you build real financial stability?</li>
            </ul>
          </div>
          <div className="category-item">
            <img src="https://via.placeholder.com/100" alt="Health & Inner Peace" />
            <h4>Health & Inner Peace</h4>
            <ul>
              <li>Why do you keep facing the same health or energy issues?</li>
              <li>Is stress or something deeper affecting your well-being?</li>
              <li>What’s the best time and way to start healing, inside and out?</li>
            </ul>
          </div>
        </div>
        <p>If you’ve been feeling stuck for too long, it’s not a coincidence. It’s a sign that it’s time to understand what’s really going on and finally shift the direction of your life.</p>
        <button className="cta-button">GET ON A CALL</button>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <h2>Choose the One That Fits You Best</h2>
        <p>Sometimes, one call to the right person can change everything.</p>
        <ul className="services-list">
          <li>Astrology Consultation</li>
          <li>Name & Identity Services</li>
          <li>Business & Brand Services</li>
          <li>Event & Timing Services</li>
          <li>VASTU</li>
        </ul>
        <p>For assistance, call <strong>+91-9266305029</strong></p>
      </section>

      {/* Consultation Call Section */}
      <section className="consultation-call-section">
        <h2>Consultation Call</h2>
        <p>Ideal for individuals seeking clarity and solutions.</p>
        <div className="form-group">
          <label>Mode:</label>
          <select>
            <option>Normal</option>
            <option>Urgent</option>
          </select>
        </div>
        <div className="form-group">
          <label>Duration:</label>
          <select>
            <option>30 Min</option>
            <option>1 Hour</option>
          </select>
        </div>
        <h4>Includes:</h4>
        <ul>
          <li>In-depth chart-based life analysis</li>
          <li>Clear direction for career, health, and personal growth</li>
          <li>Remedies aligned with your planetary blueprint</li>
        </ul>
        <p><strong>Price:</strong> ₹1,48,000</p>
        <button>Book Now</button>
        <p><em>Note: Pick your preferred Audio or Video Call type at the checkout.</em></p>
      </section>

      {/* Couple Consultation Section */}
      <section className="couple-consultation-section">
        <h2>Couple Consultation</h2>
        <p>Perfect for those navigating relationships or marriage decisions.</p>
        <div className="form-group">
          <label>Mode:</label>
          <select>
            <option>Normal</option>
            <option>Urgent</option>
          </select>
        </div>
        <div className="form-group">
          <label>Duration:</label>
          <select>
            <option>30 Min</option>
            <option>1 Hour</option>
          </select>
        </div>
        <h4>Includes:</h4>
        <ul>
          <li>Compatibility and karmic alignment insights</li>
          <li>Clarity on love, marriage, or partnership challenges</li>
          <li>Remedies tailored to both partners’ charts</li>
        </ul>
        <p><strong>Price:</strong> ₹1,85,000</p>
        <button>Book Now</button>
        <p><em>Note: Pick your preferred Audio or Video Call type at the checkout.</em></p>
      </section>

      {/* Face to Face Consultation Section */}
      <section className="face-consultation-section">
        <h2>Face to Face Consultation with Astrologer Madhav Yadav</h2>
        <p>A rare chance to meet him in person.</p>
        <p>This is not for everyone. It is only for those who truly want answers, direction, and powerful results in life.</p>
        <div className="form-group">
          <label>Mode:</label>
          <span>In person (Noida Office)</span>
        </div>
        <div className="form-group">
          <label>Duration:</label>
          <span>1 Hour</span>
        </div>
        <h4>What You Will Get:</h4>
        <ul>
          <li>Your kundli will be checked and explained in front of you</li>
          <li>One on one spiritual and astrological advice</li>
          <li>Remedies and energy solutions shared instantly</li>
          <li>You can ask anything that is troubling you</li>
          <li>Powerful insights you will not find anywhere else</li>
        </ul>
        <p><strong>Price:</strong> ₹5,00,000</p>
        <button>Book Now</button>
        <p><em>Note: This consultation is only available in 1v1 Mode with 1 Hour duration.</em></p>
      </section>
    </div>
  );
}

export default ConsultationPage;
