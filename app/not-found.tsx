import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        textAlign: 'center',
        padding: '20px',
      }}
    >
      <h1
        style={{
          fontSize: '3rem',
          fontWeight: 800,
          color: 'var(--brand-orange)',
        }}
      >
        ४०४
      </h1>
      <h2 style={{ fontSize: '1.5rem', margin: '12px 0 20px' }}>
        क्षमा गर्नुहोस्, पृष्ठ भेटिएन।
      </h2>
      <Link
        href="/"
        style={{
          backgroundColor: 'var(--brand-blue)',
          color: '#FFF',
          padding: '10px 24px',
          borderRadius: 'var(--radius-full)',
          fontWeight: 700,
        }}
      >
        गृहपृष्ठमा फर्कनुहोस्
      </Link>
    </div>
  );
}
