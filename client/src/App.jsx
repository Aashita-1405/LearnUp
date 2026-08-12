import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api';

const categories = ['All', 'Development', 'Design', 'Data Science', 'Marketing', 'Business'];

function App() {
  const [view, setView] = useState('home');
  const [auth, setAuth] = useState({ user: null, token: null });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [wishlist, setWishlist] = useState([1, 3]);
  const [cart, setCart] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [checkoutForm, setCheckoutForm] = useState({ name: '', cardNumber: '', expiry: '', cvv: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredCourses = allCourses.filter((course) => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.trim().toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartTotal = cart.reduce((total, item) => total + item.price, 0);

  useEffect(() => {
    fetchCourses();
    const saved = localStorage.getItem('learnup-auth');
    if (saved) {
      const parsed = JSON.parse(saved);
      setAuth(parsed);
      setView('dashboard');
      fetchEnrollments(parsed.user);
    }
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_URL}/courses`);
      const data = await response.json();
      setAllCourses(data.courses || []);
      if (data.courses && data.courses.length > 0) {
        setSelectedCourse(data.courses[0]);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const fetchEnrollments = async (user) => {
    try {
      const response = await fetch(`${API_URL}/enrollments`, {
        credentials: 'include',
      });
      const data = await response.json();
      setEnrolledCourses(data.enrollments || []);
    } catch (error) {
      console.error('Failed to fetch enrollments:', error);
    }
  };

  const handleEnroll = async (courseId) => {
    if (!auth.user) {
      setView('login');
      setMessage('Please log in to enroll in courses');
      return;
    }

    try {
      setIsProcessing(true);
      const response = await fetch(`${API_URL}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ courseId }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Enrollment failed');
      }

      setMessage(data.message);
      fetchEnrollments(auth.user);
      setIsProcessing(false);
    } catch (error) {
      setMessage(error.message);
      setIsProcessing(false);
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(signupData),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      const userData = { user: data.user, token: data.token };
      localStorage.setItem('learnup-auth', JSON.stringify(userData));
      setAuth(userData);
      setSignupData({ name: '', email: '', password: '' });
      setMessage('Signup successful! Redirecting to dashboard...');
      setTimeout(() => setView('dashboard'), 1000);
    } catch (error) {
      setMessage(error.message || 'Signup failed');
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(loginData),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      const userData = { user: data.user, token: data.token };
      localStorage.setItem('learnup-auth', JSON.stringify(userData));
      setAuth(userData);
      setLoginData({ email: '', password: '' });
      fetchEnrollments(data.user);
      setMessage('Login successful! Redirecting to dashboard...');
      setTimeout(() => setView('dashboard'), 1000);
    } catch (error) {
      setMessage(error.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('learnup-auth');
    setAuth({ user: null, token: null });
    setView('home');
    setMessage('Logged out successfully');
  };

  const toggleWishlist = (courseId) => {
    setWishlist((current) =>
      current.includes(courseId)
        ? current.filter((id) => id !== courseId)
        : [...current, courseId]
    );
  };

  const addToCart = (course) => {
    setCart((current) => {
      if (current.some((item) => item.id === course.id)) {
        return current;
      }
      return [...current, course];
    });
    setMessage(`${course.title} was added to your cart.`);
  };

  const removeFromCart = (courseId) => {
    setCart((items) => items.filter((item) => item.id !== courseId));
  };

  const handleCheckout = (event) => {
    event.preventDefault();
    if (!cart.length) {
      setMessage('Your cart is empty. Add a course first.');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setCart([]);
      setCheckoutForm({ name: '', cardNumber: '', expiry: '', cvv: '' });
      setIsProcessing(false);
      setMessage('Payment successful! Your courses have been added to your learning dashboard.');
      setView('dashboard');
    }, 1500);
  };

  const renderHome = () => (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Learn smarter, grow faster</span>
          <h1>Upskill with courses built for real-world success.</h1>
          <p>
            Learn from world-class instructors and turn skill gaps into career momentum with guided, project-based learning.
          </p>
          <div className="hero-actions">
            <button onClick={() => setView('signup')}>Get started</button>
            <button className="secondary" onClick={() => setView('login')}>Log in</button>
          </div>
          <ul className="stats">
            <li><strong>12k+</strong><span>Active learners</span></li>
            <li><strong>200+</strong><span>Expert courses</span></li>
            <li><strong>4.8/5</strong><span>Average rating</span></li>
          </ul>
        </div>
        <div className="hero-visual">
          <div className="mini-card one">React Bootcamp</div>
          <div className="mini-card two">UI Design Sprint</div>
          <div className="mini-card three">Python Lab</div>
        </div>
      </section>

      <section className="catalog">
        <div className="section-head">
          <div>
            <span className="eyebrow">Popular categories</span>
            <h2>Explore trending courses</h2>
          </div>
          <div className="search-box">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search courses"
            />
          </div>
        </div>

        <div className="category-row">
          {categories.map((category) => (
            <button
              key={category}
              className={selectedCategory === category ? 'chip active' : 'chip'}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="course-grid">
          {filteredCourses.map((course) => (
            <article key={course.id} className="course-card">
              <div className="course-thumb">
                <span>{course.badge}</span>
              </div>
              <div className="course-body">
                <div className="meta-row">
                  <span>{course.category}</span>
                  <span>{course.level}</span>
                </div>
                <h3>{course.title}</h3>
                <div className="rating-row">
                  <span>★ {course.rating}</span>
                  <span>{course.students} students</span>
                </div>
                <p className="course-description">{course.description}</p>
                <div className="course-footer">
                  <strong>${course.price}</strong>
                  <div className="mini-actions">
                    <button className="soft" onClick={() => { setSelectedCourse(course); setView('course'); }}>View</button>
                    {enrolledCourses.find(c => c.id === course.id) ? (
                      <button disabled style={{backgroundColor: '#10b981'}}>✓ Enrolled</button>
                    ) : (
                      <button onClick={() => handleEnroll(course.id)} disabled={isProcessing}>Enroll</button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );

  const renderAuth = () => (
    <section className="auth-container">
      {view === 'signup' ? (
        <div className="auth-card">
          <div className="auth-head">
            <h2>Create your account</h2>
            <p>Join thousands of learners on LearnUp</p>
          </div>
          <form onSubmit={handleSignup} className="auth-form">
            <input
              type="text"
              placeholder="Full name"
              value={signupData.name}
              onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email address"
              value={signupData.email}
              onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={signupData.password}
              onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
              required
            />
            <button type="submit" className="cta-btn">Sign up</button>
          </form>
          <p className="auth-link">
            Already have an account? <button onClick={() => setView('login')} className="link-btn">Log in</button>
          </p>
          {message && <p className="message">{message}</p>}
        </div>
      ) : (
        <div className="auth-card">
          <div className="auth-head">
            <h2>Welcome back</h2>
            <p>Log in to your LearnUp account</p>
          </div>
          <form onSubmit={handleLogin} className="auth-form">
            <input
              type="email"
              placeholder="Email address"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              required
            />
            <button type="submit" className="cta-btn">Log in</button>
          </form>
          <p className="auth-link">
            Don't have an account? <button onClick={() => setView('signup')} className="link-btn">Sign up</button>
          </p>
          {message && <p className="message">{message}</p>}
        </div>
      )}
    </section>
  );

  const renderCourse = () => (
    <section className="course-detail">
      {selectedCourse && (
        <>
          <div className="detail-header">
            <div className="detail-copy">
              <span className="eyebrow">{selectedCourse.category}</span>
              <h2>{selectedCourse.title}</h2>
              <p>{selectedCourse.description}</p>
              <div className="detail-meta">
                <span>★ {selectedCourse.rating}</span>
                <span>{selectedCourse.students} students</span>
                <span>{selectedCourse.lessons} lessons</span>
                <span>{selectedCourse.duration}</span>
              </div>

              {selectedCourse.tutor_name && (
                <div style={{marginTop: '20px', borderTop: '1px solid #e5e7eb', paddingTop: '20px'}}>
                  <h4>Instructor</h4>
                  <p><strong>{selectedCourse.tutor_name}</strong></p>
                  <p>{selectedCourse.tutor_bio}</p>
                  <p>Expertise: {selectedCourse.tutor_expertise}</p>
                  {selectedCourse.start_date && (
                    <>
                      <p><strong>Starts:</strong> {selectedCourse.start_date}</p>
                      <p><strong>Schedule:</strong> {selectedCourse.schedule}</p>
                      <p><strong>First Class:</strong> {selectedCourse.first_class_time}</p>
                    </>
                  )}
                </div>
              )}

              <div className="purchase-row">
                <strong>${selectedCourse.price}</strong>
                {enrolledCourses.find(c => c.id === selectedCourse.id) ? (
                  <button disabled style={{backgroundColor: '#10b981', cursor: 'default'}}>✓ Enrolled</button>
                ) : (
                  <button onClick={() => handleEnroll(selectedCourse.id)} disabled={isProcessing}>
                    {isProcessing ? 'Enrolling...' : 'Enroll Now'}
                  </button>
                )}
                <button className="secondary" onClick={() => toggleWishlist(selectedCourse.id)}>
                  {wishlist.includes(selectedCourse.id) ? 'Saved' : 'Save to wishlist'}
                </button>
              </div>
            </div>
            <div className="detail-card">
              <div className="detail-thumb" />
              <ul>
                <li>On-demand video lessons</li>
                <li>Certificate of completion</li>
                <li>Hands-on project exercises</li>
                <li>Lifetime access</li>
              </ul>
            </div>
          </div>

          <div className="recommend-row">
            <h3>Continue learning</h3>
            <div className="mini-course-row">
              {allCourses.filter((course) => course.id !== selectedCourse.id).slice(0, 3).map((course) => (
                <button key={course.id} className="mini-course" onClick={() => { setSelectedCourse(course); }}>
                  {course.title}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );

  const renderCart = () => (
    <section className="cart-container">
      <div className="cart-header">
        <h2>Shopping cart ({cart.length})</h2>
        <button onClick={() => setView('home')} className="secondary">Continue shopping</button>
      </div>
      {cart.length > 0 ? (
        <div className="cart-grid">
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-info">
                  <h4>{item.title}</h4>
                  <p>{item.category}</p>
                </div>
                <div className="cart-item-actions">
                  <strong>${item.price}</strong>
                  <button className="secondary" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="checkout-panel">
            <div className="checkout-summary">
              <h3>Order summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${cartTotal}</span>
              </div>
              <div className="summary-row">
                <span>Tax (0%)</span>
                <span>$0</span>
              </div>
              <div className="summary-row total">
                <strong>Total</strong>
                <strong>${cartTotal}</strong>
              </div>
            </div>
            <form onSubmit={handleCheckout} className="checkout-form">
              <input
                type="text"
                placeholder="Full name"
                value={checkoutForm.name}
                onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Card number"
                value={checkoutForm.cardNumber}
                onChange={(e) => setCheckoutForm({ ...checkoutForm, cardNumber: e.target.value })}
                required
              />
              <div className="checkout-row">
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={checkoutForm.expiry}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, expiry: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="CVV"
                  value={checkoutForm.cvv}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, cvv: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="cta-btn" disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Complete purchase'}
              </button>
            </form>
            {message && <p className="message">{message}</p>}
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <p>Your cart is empty</p>
          <button onClick={() => setView('home')} className="cta-btn">Start shopping</button>
        </div>
      )}
    </section>
  );

  const renderWishlist = () => (
    <section className="wishlist-container">
      <div className="wishlist-header">
        <h2>Wishlist ({wishlist.length})</h2>
        <button onClick={() => setView('home')} className="secondary">Browse more</button>
      </div>
      {wishlist.length > 0 ? (
        <div className="wishlist-grid">
          {allCourses.filter((course) => wishlist.includes(course.id)).map((course) => (
            <article key={course.id} className="wishlist-card">
              <h3>{course.title}</h3>
              <p>{course.category} • {course.level}</p>
              <p className="course-description">{course.description}</p>
              <div className="wishlist-footer">
                <strong>${course.price}</strong>
                <div className="wishlist-actions">
                  <button onClick={() => { setSelectedCourse(course); setView('course'); }}>View</button>
                  <button className="secondary" onClick={() => toggleWishlist(course.id)}>Remove</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>Your wishlist is empty</p>
          <button onClick={() => setView('home')} className="cta-btn">Explore courses</button>
        </div>
      )}
    </section>
  );

  const renderDashboard = () => (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand small">LearnUp</div>
        <nav className="sidebar-nav">
          <button className="active">My Learning</button>
          <button onClick={() => setView('wishlist')}>Wishlist</button>
          <button onClick={() => setView('cart')}>Cart</button>
          <button>Certificates</button>
          <button>Messages</button>
        </nav>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </aside>

      <main className="dashboard-main">
        <div className="welcome-bar">
          <div>
            <span className="eyebrow">Welcome back</span>
            <h2>{auth.user?.name || 'Learner'}</h2>
          </div>
          <button className="cta-btn" onClick={() => setView('home')}>Explore courses</button>
        </div>

        <div className="progress-grid">
          <div className="progress-card">
            <span>Courses enrolled</span>
            <strong>{enrolledCourses.length}</strong>
          </div>
          <div className="progress-card">
            <span>Completed</span>
            <strong>0</strong>
          </div>
          <div className="progress-card">
            <span>Certificates</span>
            <strong>0</strong>
          </div>
        </div>

        <div className="learning-list">
          <h3>{enrolledCourses.length > 0 ? 'Your enrolled courses' : 'No courses yet - explore and enroll'}</h3>
          {enrolledCourses.length > 0 ? (
            enrolledCourses.map((course) => (
              <div className="learning-item" key={course.id}>
                <div className="thumb-mini" />
                <div className="learning-copy">
                  <h4>{course.title}</h4>
                  <p>{course.category} • {course.level}</p>
                  {course.start_date && <p>Starts: {course.start_date}</p>}
                </div>
                <button onClick={() => { setSelectedCourse(course); setView('course'); }}>View</button>
              </div>
            ))
          ) : (
            <div style={{padding: '20px', textAlign: 'center', color: '#6b7280'}}>
              <p>Start learning by exploring our course catalog</p>
              <button onClick={() => setView('home')} className="cta-btn">Browse Courses</button>
            </div>
          )}
        </div>

        {profile && (
          <div className="profile-box">
            <h3>Account details</h3>
            <p>{profile.message}</p>
            <pre>{JSON.stringify(profile.user, null, 2)}</pre>
          </div>
        )}
      </main>
    </div>
  );

  return (
    <div className="app">
      <nav className="navbar">
        <div className="brand">LearnUp</div>
        <div className="nav-actions">
          {auth.user ? (
            <>
              <span>{auth.user.name}</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => setView('login')}>Log in</button>
              <button className="cta-btn" onClick={() => setView('signup')}>Sign up</button>
            </>
          )}
        </div>
      </nav>

      {message && (
        <div className="toast">
          {message}
          <button onClick={() => setMessage('')}>×</button>
        </div>
      )}

      {view === 'home' && renderHome()}
      {view === 'signup' && renderAuth()}
      {view === 'login' && renderAuth()}
      {view === 'course' && renderCourse()}
      {view === 'cart' && renderCart()}
      {view === 'wishlist' && renderWishlist()}
      {view === 'dashboard' && auth.user ? renderDashboard() : null}
    </div>
  );
}

export default App;
