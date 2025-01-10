import React from 'react';
import { Dumbbell, Brain, Camera, LineChart, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
    <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md fixed w-full z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Dumbbell className="text-blue-600" size={32} />
              <span className="ml-2 text-xl font-bold">AI Fitness Coach</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg transition-colors"
              >
                <Link
                to = "/login">
                Log in
                </Link>
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Link
                to = "/signup">
                Sign up
                </Link>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Personal AI-Powered
              <span className="text-blue-600 block">Fitness Coach</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Transform your fitness journey with real-time form analysis, personalized workouts,
              and AI-driven progress tracking.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Link to='/signup'>
                Get Started Free
                </Link>
              </button>
              <button
                className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose AI Fitness Coach?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Brain className="text-blue-600" size={24} />}
            title="AI-Powered Analysis"
            description="Get real-time feedback on your form and technique using advanced AI algorithms."
          />
          <FeatureCard
            icon={<Camera className="text-blue-600" size={24} />}
            title="Real-time Form Detection"
            description="Our AI analyzes your movements in real-time to ensure proper form and prevent injuries."
          />
          <FeatureCard
            icon={<LineChart className="text-blue-600" size={24} />}
            title="Progress Tracking"
            description="Track your fitness journey with detailed analytics and progress visualization."
          />
          <FeatureCard
            icon={<Shield className="text-blue-600" size={24} />}
            title="Safe & Secure"
            description="Your data is protected with enterprise-grade security and encryption."
          />
          <FeatureCard
            icon={<Dumbbell className="text-blue-600" size={24} />}
            title="Personalized Workouts"
            description="Get customized workout plans tailored to your goals and fitness level."
          />
          <FeatureCard
            icon={<Users className="text-blue-600" size={24} />}
            title="Community Support"
            description="Join a community of fitness enthusiasts and share your progress."
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Fitness Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who have already improved their workout form with AI assistance.
          </p>
          <button
            className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors"
          >
            <Link to = '/login'>
            Start Your Free Trial
            </Link>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Dumbbell size={24} />
              <span className="ml-2 text-lg font-semibold">AI Fitness Coach</span>
            </div>
            <div className="text-sm">
              © 2024 AI Fitness Coach. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;