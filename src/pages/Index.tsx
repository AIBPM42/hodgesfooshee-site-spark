// Minimal test component to verify React is working
const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-4xl font-bold text-center">React is Working!</h1>
      <p className="text-center mt-4 text-muted-foreground">If you can see this, React is mounting correctly.</p>
      <div className="mt-8 text-center">
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded">
          Test Button
        </button>
      </div>
    </div>
  );
};

export default Index;
