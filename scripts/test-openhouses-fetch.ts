// Test if the fetch works client-side
async function testFetch() {
  try {
    console.log('Fetching from MLS API...');

    const response = await fetch(
      'https://xhqwmtzawqfffepcqxwf.supabase.co/functions/v1/mls-openhouses?limit=6',
      {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhocXdtdHphd3FmZmZlcGNxeHdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MDQwODEsImV4cCI6MjA3MDE4MDA4MX0.gihIkhLS_pwr9Mz6uG6vm7BXPzfa2TcpvIrRECRfxfg'
        }
      }
    );

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    const result = await response.json();
    console.log('Result:', JSON.stringify(result, null, 2));

    const mlsOpenHouses = result.openHouses || [];
    console.log('Total open houses:', mlsOpenHouses.length);

    const active = mlsOpenHouses.filter((oh: any) => oh.OpenHouseStatus === 'Active');
    console.log('Active open houses:', active.length);

  } catch (err) {
    console.error('Error:', err);
  }
}

testFetch();
