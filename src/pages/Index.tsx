import { Layout } from "@/components/layout/Layout";
import { HeroSlider } from "@/components/home/HeroSlider";
import { SearchTabs } from "@/components/home/SearchTabs";
import { ServicesSection } from "@/components/home/ServicesSection";
import { PopularToursSection } from "@/components/home/PopularToursSection";
import { RecentlyViewedTours } from "@/components/home/RecentlyViewedTours";
import { WhyChooseUsSection } from "@/components/home/WhyChooseUsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSlider />
      <SearchTabs />
      <ServicesSection />
      <PopularToursSection />
      <RecentlyViewedTours />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
