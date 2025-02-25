import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, Clock, Shield } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
            Transform Photos into
            <span className="text-primary/90 block">Magical Stories</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Using advanced AI technology, we turn your cherished photos into beautifully illustrated storybooks that capture your special moments forever.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/create">Start Your Story</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/templates">View Templates</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Imagitime?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Sparkles className="h-8 w-8" />}
              title="AI-Powered Magic"
              description="Advanced AI technology transforms your photos into consistent, beautiful illustrations"
            />
            <FeatureCard
              icon={<BookOpen className="h-8 w-8" />}
              title="Premium Templates"
              description="Choose from our diverse library of professionally designed story templates"
            />
            <FeatureCard
              icon={<Clock className="h-8 w-8" />}
              title="Quick Creation"
              description="Create your personalized storybook in minutes, not days"
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title="Secure & Private"
              description="Your photos and stories are protected with enterprise-grade security"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Create Your Story?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers who have transformed their memories into timeless stories.
          </p>
          <Button size="lg" className="px-8" asChild>
            <Link href="/create">Get Started Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}