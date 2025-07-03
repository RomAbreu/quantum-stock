import ScrollDownAnimation from '@/components/navigation/ScrollDownAnimation';
import ScrollUpAnimation from '@/components/navigation/ScrollUpAnimation';
import FeaturesSection from '@/components/sections/homePage/FeaturesSection';
import HeroSection from '@/components/sections/homePage/HeroSection';

export default function HomePage() {
	return (
		<main className="flex flex-col w-screen gap-y-6">
			<section className="relative h-[80vh] bg-hero-background bg-cover bg-center overflow-hidden">
				<div className="absolute inset-0 pointer-events-none bg-black/60 backdrop-blur-sm" />
				<HeroSection />
			</section>

			<div className="container flex flex-col items-center justify-center w-full mx-auto mb-6 gap-y-8 ">
				<ScrollDownAnimation />
				<FeaturesSection />
				<ScrollUpAnimation />
			</div>
		</main>
	);
}
