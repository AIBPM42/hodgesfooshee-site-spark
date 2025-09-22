import Header from "@/components/Header";

// Phase 2: Testing with Header component
const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="bg-background text-foreground p-8">
        <h1 className="text-4xl font-bold text-center">React + Header Working!</h1>
        <p className="text-center mt-4 text-muted-foreground">Header component added successfully.</p>
        <div className="mt-8 text-center">
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded">
            Test Button
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
