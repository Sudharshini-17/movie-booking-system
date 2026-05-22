import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BarChart3, Users, Film, Ticket, LogOut, TrendingUp, AlertTriangle } from 'lucide-react';
import styles from './Dashboard.module.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [lastRefreshed, setLastRefreshed] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          Show<span className={styles.accent}>Admin</span>
        </div>
        
        <nav className={styles.navMenu}>
          <a href="#" className={`${styles.navItem} ${styles.active}`}>
            <BarChart3 size={20} /> Analytics
          </a>
          <a href="#" className={styles.navItem}>
            <Film size={20} /> Movies
          </a>
          <a href="#" className={styles.navItem}>
            <Ticket size={20} /> Showtimes
          </a>
          <a href="#" className={styles.navItem}>
            <Users size={20} /> Users
          </a>
        </nav>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>Dashboard Overview</h1>
            <p className={styles.subtitle}>Welcome back, Admin</p>
          </div>
          <div className={styles.cacheIndicator}>
            <span className={styles.pulseDot}></span>
            Live Data (Refreshed: {lastRefreshed})
          </div>
        </header>

        {/* Metric Cards */}
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <h3 className={styles.metricTitle}>Daily Revenue</h3>
              <TrendingUp size={20} className={styles.trendUp} />
            </div>
            <p className={styles.metricValue}>₹45,200</p>
            <p className={styles.metricSub}>+12% from yesterday</p>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <h3 className={styles.metricTitle}>Tickets Sold</h3>
              <Ticket size={20} className={styles.trendUp} />
            </div>
            <p className={styles.metricValue}>342</p>
            <p className={styles.metricSub}>+5% from yesterday</p>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <h3 className={styles.metricTitle}>Occupancy Rate</h3>
              <Users size={20} className={styles.trendNeutral} />
            </div>
            <p className={styles.metricValue}>78%</p>
            <p className={styles.metricSub}>Average across 12 screens</p>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <h3 className={styles.metricTitle}>Cancellations</h3>
              <AlertTriangle size={20} className={styles.trendDown} />
            </div>
            <p className={styles.metricValue}>1.2%</p>
            <p className={styles.metricSub}>-0.5% from yesterday</p>
          </div>
        </div>

        {/* Charts & Tables */}
        <div className={styles.dashboardGrid}>
          <div className={styles.chartPanel}>
            <h3 className={styles.panelTitle}>Revenue Trend (This Week)</h3>
            <div className={styles.mockChart}>
              {/* CSS Mock Bar Chart */}
              <div className={styles.barWrapper}><div className={styles.bar} style={{height: '40%'}}></div><span>Mon</span></div>
              <div className={styles.barWrapper}><div className={styles.bar} style={{height: '55%'}}></div><span>Tue</span></div>
              <div className={styles.barWrapper}><div className={styles.bar} style={{height: '35%'}}></div><span>Wed</span></div>
              <div className={styles.barWrapper}><div className={styles.bar} style={{height: '60%'}}></div><span>Thu</span></div>
              <div className={styles.barWrapper}><div className={styles.bar} style={{height: '80%'}}></div><span>Fri</span></div>
              <div className={styles.barWrapper}><div className={styles.bar} style={{height: '100%'}}></div><span>Sat</span></div>
              <div className={styles.barWrapper}><div className={styles.bar} style={{height: '90%'}}></div><span>Sun</span></div>
            </div>
          </div>

          <div className={styles.tablePanel}>
            <h3 className={styles.panelTitle}>Top Performing Movies</h3>
            <table className={styles.mockTable}>
              <thead>
                <tr>
                  <th>Movie</th>
                  <th>Bookings</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Dune: Part Two</td>
                  <td>1,240</td>
                  <td>₹2,48,000</td>
                </tr>
                <tr>
                  <td>Furiosa: A Mad Max Saga</td>
                  <td>980</td>
                  <td>₹1,96,000</td>
                </tr>
                <tr>
                  <td>Oppenheimer</td>
                  <td>850</td>
                  <td>₹1,70,000</td>
                </tr>
                <tr>
                  <td>Godzilla x Kong</td>
                  <td>620</td>
                  <td>₹1,24,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
