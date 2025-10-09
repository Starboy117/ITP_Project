import React from 'react';
import './Aboutus.css';
import { useAuth } from '../context/AuthContext';

function AboutUs() {
  const { currentUser } = useAuth();

  const facilities = [
    {
      icon: '🏸',
      title: 'Badminton Courts',
      description: '6 professional-grade courts with tournament-level lighting'
    },
    {
      icon: '🎾',
      title: 'Tennis Courts',
      description: '4 outdoor clay courts and 2 indoor hard courts'
    },
    {
      icon: '🏊',
      title: 'Swimming Pool',
      description: 'Olympic-sized pool with dedicated lanes for training'
    },
    {
      icon: '🏋️',
      title: 'Fitness Center',
      description: 'State-of-the-art equipment and personal training services'
    },
    {
      icon: '👥',
      title: 'Locker Rooms',
      description: 'Spacious changing facilities with premium amenities'
    },
    {
      icon: '🍽️',
      title: 'Sports Cafe',
      description: 'Healthy dining options and refreshments'
    }
  ];

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Head Coach',
      image: '/api/placeholder/200/200',
      description: 'Former national champion with 10+ years coaching experience'
    },
    {
      name: 'Mike Chen',
      role: 'Facility Manager',
      image: '/api/placeholder/200/200',
      description: 'Sports management expert ensuring seamless operations'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Fitness Director',
      image: '/api/placeholder/200/200',
      description: 'Certified trainer specializing in sports performance'
    },
    {
      name: 'David Kim',
      role: 'Head of Membership',
      image: '/api/placeholder/200/200',
      description: 'Dedicated to providing exceptional member experiences'
    }
  ];

  const stats = [
    { number: '15+', label: 'Years Experience' },
    { number: '10,000+', label: 'Happy Members' },
    { number: '50+', label: 'Professional Coaches' },
    { number: '24/7', label: 'Facility Access' }
  ];

  return (
    <div className="about-us">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>About Orion Sports</h1>
          <p className="hero-subtitle">
            Where champions train and communities thrive. For over 15 years, we've been 
            dedicated to providing world-class sports facilities and training programs.
          </p>
          {!currentUser && (
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => window.location.href = '/register'}>
                Join Our Community
              </button>
              <button className="btn-secondary" onClick={() => window.location.href = '/available'}>
                Book a Court
              </button>
            </div>
          )}
        </div>
        <div className="hero-image">
          <img src="/api/placeholder/600/400" alt="Orion Sports Facility" />
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>
                To inspire athletic excellence and build a vibrant sports community 
                through exceptional facilities, professional coaching, and inclusive programs 
                that cater to all skill levels and ages.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">👁️</div>
              <h3>Our Vision</h3>
              <p>
                To be the premier sports destination where every individual discovers 
                their potential, achieves their goals, and becomes part of a supportive 
                athletic family.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">💎</div>
              <h3>Our Values</h3>
              <ul>
                <li>Excellence in everything we do</li>
                <li>Community building and support</li>
                <li>Innovation in sports training</li>
                <li>Accessibility for all athletes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <h2>Why Choose Orion Sports?</h2>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="facilities-section">
        <div className="container">
          <h2>World-Class Facilities</h2>
          <p className="section-description">
            Experience the best sports infrastructure designed for performance and comfort
          </p>
          <div className="facilities-grid">
            {facilities.map((facility, index) => (
              <div key={index} className="facility-card">
                <div className="facility-icon">{facility.icon}</div>
                <h3>{facility.title}</h3>
                <p>{facility.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2>Meet Our Expert Team</h2>
          <p className="section-description">
            Passionate professionals dedicated to your success
          </p>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="team-info">
                  <h3>{member.name}</h3>
                  <span className="team-role">{member.role}</span>
                  <p>{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2>What Our Members Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                "Orion Sports transformed my game! The coaching staff is incredible 
                and the facilities are always pristine."
              </div>
              <div className="testimonial-author">
                <strong>Alex Thompson</strong>
                <span>Professional Athlete</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                "The community here is amazing. I've made lifelong friends while 
                improving my fitness in a supportive environment."
              </div>
              <div className="testimonial-author">
                <strong>Maria Garcia</strong>
                <span>Member for 5 years</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                "As a beginner, I was nervous to start, but the coaches made me feel 
                welcome and helped me progress at my own pace."
              </div>
              <div className="testimonial-author">
                <strong>James Wilson</strong>
                <span>New Member</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Journey?</h2>
            <p>Join hundreds of athletes who've transformed their game at Orion Sports</p>
            <div className="cta-buttons">
              <button 
                className="btn-primary large"
                onClick={() => window.location.href = currentUser ? '/available' : '/register'}
              >
                {currentUser ? 'Book a Court Now' : 'Become a Member'}
              </button>
              <button 
                className="btn-secondary large"
                onClick={() => window.location.href = '/contact'}
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;