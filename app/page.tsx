"use client";

import { SignedIn, SignedOut, SignInButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Brain, Zap, Trophy, Shield, ArrowRight, Star, Sparkles } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        {/* Background Ambient Light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-border/60 rounded-full shadow-sm animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">The Future of Critical Thinking</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground leading-[0.9] animate-slide-up">
              Forge Your <span className="text-primary italic">Mind</span>.<br />Master the <span className="text-primary italic">Arena</span>.
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium animate-fade-in delay-200">
              MindForge is a high-intensity cognitive training platform where AI-driven scenarios challenge your logic, ethics, and systemic thinking.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slide-up delay-300">
              <SignedIn>
                <Link href="/dashboard">
                  <Button size="lg" className="h-14 px-10 rounded-full font-black tracking-widest uppercase shadow-xl shadow-primary/20 group">
                    Enter Dashboard <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button size="lg" className="h-14 px-10 rounded-full font-black tracking-widest uppercase shadow-xl shadow-primary/20 group">
                    Begin Initialization <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </SignInButton>
              </SignedOut>
              <Button size="lg" variant="outline" className="h-14 px-10 rounded-full font-bold tracking-widest uppercase bg-white/50 backdrop-blur-sm border-border/60">
                View Protocols
              </Button>
            </div>
          </div>
        </div>

      </section>

      {/* Feature Grid */}
      <section className="py-24 bg-white border-y border-border/40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<Brain className="w-8 h-8" />}
              title="AI Oracle"
              description="Our neural engine generates infinite, highly-relatable critical thinking scenarios tailored to your level."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Energy-Based Trials"
              description="Strategic engagement through a tiered energy system. Each trial is a high-stakes investment of your cognitive focus."
            />
            <FeatureCard
              icon={<Trophy className="w-8 h-8" />}
              title="Cognitive Status"
              description="Ascend through authority tiers from Initiate to Grandmaster. Every successful resolution builds your XP fingerprint."
            />
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-24 bg-[#fafafa]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto rounded-[3rem] bg-foreground text-background p-12 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none uppercase italic">Join the global think-tank.</h2>
                <p className="text-background/60 text-lg font-medium leading-relaxed">Over 50,000 analysts are already refining their logic pipelines in the Arena.</p>
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-foreground bg-primary/20 flex items-center justify-center overflow-hidden">
                      <Image src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="avatar" width={48} height={48} />
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full border-4 border-foreground bg-primary flex items-center justify-center text-[10px] font-black">
                    +50k
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <Stat icon={<Shield className="w-5 h-5" />} label="Security Protocols" value="99.9%" />
                <Stat icon={<Star className="w-5 h-5" />} label="Average Logic Score" value="78.4" />
                <Stat icon={<Zap className="w-5 h-5" />} label="Scenarios Resolved" value="1.2M" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/40 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs font-bold text-muted-foreground/40 uppercase tracking-[0.4em]">© 2026 MindForge Systems • Cognitive Sovereignty Guaranteed</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="space-y-6 group p-4 rounded-3xl hover:bg-primary/[0.02] transition-colors duration-500">
      <div className="w-16 h-16 rounded-[1.5rem] bg-primary/5 text-primary flex items-center justify-center transition-transform group-hover:scale-110 duration-500">
        {icon}
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-black tracking-tight uppercase italic">{title}</h3>
        <p className="text-muted-foreground font-medium leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-background/10 pb-4">
      <div className="flex items-center gap-3">
        <div className="text-primary">{icon}</div>
        <span className="text-xs font-bold uppercase tracking-widest text-background/60">{label}</span>
      </div>
      <span className="text-2xl font-black tabular-nums tracking-tighter">{value}</span>
    </div>
  );
}
