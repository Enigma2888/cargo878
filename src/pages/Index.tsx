
import { Header } from "@/components/Header";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
            Welcome to Telegram WebApp
          </div>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Start Building Your Experience
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            This is your personalized Telegram Web Application. We've created a beautiful,
            responsive interface that seamlessly integrates with your Telegram profile.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
