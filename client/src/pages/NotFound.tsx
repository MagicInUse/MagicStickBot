import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div style={{
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto',
      textAlign: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ fontSize: '2.5rem', color: '#333' }}>
        404 - Page Not Found
      </h1>
      
      <div style={{ margin: '1rem 0' }}>
        <Link to="/dashboard" style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#0066cc',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          display: 'inline-block'
        }}>
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;