// Phase 1: Emergency Recovery - Absolute Minimal Component
const Index = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#0B0B0B', color: 'white', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '32px', textAlign: 'center' }}>EMERGENCY RECOVERY TEST</h1>
      <p style={{ textAlign: 'center', marginTop: '16px' }}>
        If you can see this text, React is working and mounting correctly.
      </p>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button style={{ 
          backgroundColor: '#F26A21', 
          color: 'white', 
          padding: '12px 24px', 
          border: 'none', 
          borderRadius: '8px',
          cursor: 'pointer'
        }}>
          Basic Button Test
        </button>
      </div>
    </div>
  );
};

export default Index;
