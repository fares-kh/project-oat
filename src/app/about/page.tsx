import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroVideoWrapper from "@/components/HeroVideo/HeroVideoWrapper";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-beige font-sans flex flex-col">
      <Header />
        <section className="w-full py-0 relative min-h-[400px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
            <HeroVideoWrapper />
        </section>
      
      <main className="flex-1 py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 font-brand-tight">
            About Me
          </h1>
          
          {/* First Section - Why Ellie's Oats was founded */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {/* Left Column - Image (1/3 width) */}
            <div className="lg:col-span-1">
              <div className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden shadow-lg">
                <Image 
                  src="/about-me.jpg" 
                  alt="Ellie - Founder of Ellie's Oats"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            
            {/* Right Column - Text (2/3 width) */}
            <div className="lg:col-span-2 bg-background rounded-2xl shadow-lg p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-brand-green">
                Why Ellie&apos;s Oats was founded
              </h2>
              
              <div className="space-y-4 text-text-dark leading-relaxed">
                <p>
                  As a passionate gym-goer, our founder Ellie is big on fuelling her body right—but she is also a massive foodie. The problem? Most spots don&apos;t offer meals that feel both nourishing and satisfying. So, Ellie&apos;s Oats was founded as a go-to spot where nutritious meets delicious—without leaving us feeling sluggish and off-track the next day. Why should a fuelling and tasty meal be saved for only the weekend?
                </p>
                
                <p>
                  Healthy eating doesn&apos;t have to be boring. And socialising doesn&apos;t have to mean throwing your goals out the window. We&apos;re all about balance—fuel your body, enjoy your life, and never settle for boring oats.
                </p>
              </div>
            </div>
          </div>

          {/* Second Section - A bit about our Founder */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {/* Left Column - Text (2/3 width) */}
            <div className="lg:col-span-2 bg-background rounded-2xl shadow-lg p-8 md:p-12 order-2 lg:order-1">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-brand-green">
                A bit about our Founder
              </h2>
              
              <div className="space-y-4 text-text-dark leading-relaxed">
                <p>
                  After gaining a first-class Psychology Degree from the University of Liverpool, I didn&apos;t really know what I wanted to do with my life. I tried a couple of jobs including one which was always portrayed as a &apos;life-long career&apos;. However, I always wanted more than what my office-job had to offer.
                </p>
                
                <p>
                  It was on a solo trip to Australia (why does every life-changing story start with that!) back in 2023 where I realised that there was so much more to life than drinking every weekend & living for short-term goals. The day I landed back in the UK, I got myself an online coach and that&apos;s where the gym and nutrition started to play a key role in my life.
                </p>
                
                <p>
                  In February 2025, I left my job and did a few months travelling around Australia, Thailand & Vietnam (where my love of matcha emerged). With no real plan and no job to come back to, I knew this was the time I&apos;d been waiting for to start my own business. My joint love of oats and wanting to fuel my fitness goals merged together to create Ellie&apos;s Oats.
                </p>
                
                <p>
                  I started with my first pop-up market stall at Altrincham Market in July 2025 - and since then the business has grown with loyal customers, multiple stalls, events & deliveries. With special thanks to my family for their support & constant help with the never-ending list that comes with being a solo business owner!
                </p>
              </div>
            </div>

            {/* Right Column - Image (1/3 width) */}
            <div className="lg:col-span-1 order-1 lg:order-2">
              <div className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden shadow-lg">
                <Image 
                  src="/about-me-2.jpg" 
                  alt="Ellie's Oats at market stall"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Third Section - What Ellie's Oats can offer */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Left Column - Image (1/3 width) */}
            <div className="lg:col-span-1">
              <div className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden shadow-lg">
                <Image 
                  src="/about-me-3.jpg" 
                  alt="Ellie's Oats products"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            {/* Right Column - Text (2/3 width) */}
            <div className="lg:col-span-2 bg-background rounded-2xl shadow-lg p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-brand-green">
                What Ellie&apos;s Oats can offer
              </h2>
              
              <div className="space-y-6 text-text-dark leading-relaxed">
                <div>
                  <h3 className="text-xl font-bold mb-3 text-zinc-800">Events</h3>
                  <p>
                    At Ellie&apos;s Oats, we provide Oat Bowls and Matcha Lattes for events where wellness and fuel are needed. Whether that&apos;s a networking event, pilates studio opening day, an office wellbeing morning or a fun-filled Hen Do.
                  </p>
                  <p className="mt-2">
                    To enquire about our packages, email us at{' '}
                    <a href="mailto:elliesoats@hotmail.com" className="text-brand-green hover:underline font-medium">
                      elliesoats@hotmail.com
                    </a>{' '}
                    or message via our Instagram page{' '}
                    <a href="https://instagram.com/ellies.oats" target="_blank" rel="noopener noreferrer" className="text-brand-green hover:underline font-medium">
                      @ellies.oats
                    </a>.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3 text-zinc-800">Deliveries</h3>
                  <p>
                    Our Oat Bowls are available for delivery throughout most of east Lancashire and Greater Manchester. Please navigate to the ordering tab on this website to place your order.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3 text-zinc-800">Wholesale</h3>
                  <p>
                    Do you own a Farm Shop or local Market? We&apos;d love to have our Oat Bowls stocked in your store. To find out about our wholesale prices, please email us at{' '}
                    <a href="mailto:elliesoats@hotmail.com" className="text-brand-green hover:underline font-medium">
                      elliesoats@hotmail.com
                    </a>{' '}
                    or message via our Instagram page{' '}
                    <a href="https://instagram.com/ellies.oats" target="_blank" rel="noopener noreferrer" className="text-brand-green hover:underline font-medium">
                      @ellies.oats
                    </a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
