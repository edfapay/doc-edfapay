import { useState, useEffect } from "react";
import { Sidebar } from "@/components/docs/Sidebar";
import { MobileNav } from "@/components/docs/MobileNav";
import { FunctionCard } from "@/components/docs/FunctionCard";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { apiFunctions } from "@/data/apiFunctions";
import { ArrowRight, Zap, Shield, Smartphone, Copy, Check } from "lucide-react";

const Index = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [copied, setCopied] = useState(false);

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCopyGradle = async () => {
    await navigator.clipboard.writeText(`implementation 'com.edfapay:payment-sdk:1.0.5'`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -50% 0px" }
    );

    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <MobileNav onSectionClick={handleSectionClick} />
      
      <div className="flex">
        <Sidebar activeSection={activeSection} onSectionClick={handleSectionClick} />
        
        <main className="flex-1 lg:pl-0 pt-16 lg:pt-0">
          {/* Hero Section */}
          <section id="overview" className="scroll-mt-24 border-b border-border">
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-5" />
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative max-w-4xl mx-auto px-6 py-20 lg:py-28">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  <Zap className="w-4 h-4" />
                  Android SDK v1.0.5
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                  EdfaPay Payment SDK
                  <span className="block text-primary">Integration Guide</span>
                </h1>
                
                <p className="text-lg text-muted-foreground max-w-2xl mb-8 leading-relaxed">
                  Complete API reference for integrating EdfaPay's payment processing capabilities 
                  into your Android application. Accept card payments, manage transactions, and 
                  handle reconciliation with ease.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => handleSectionClick("initiate")}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleSectionClick("purchase")}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
                  >
                    View Payment APIs
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="max-w-4xl mx-auto px-6 py-16 border-b border-border">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Fast Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Simple callback-based API that integrates seamlessly with your existing Android app.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-[hsl(var(--method-get))]/10 flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5 text-[hsl(var(--method-get))]" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Secure by Design</h3>
                <p className="text-sm text-muted-foreground">
                  PCI-DSS compliant SDK with encrypted communication and secure session management.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Smartphone className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">NFC & EMV Ready</h3>
                <p className="text-sm text-muted-foreground">
                  Support for contactless, chip, and magnetic stripe card reading on compatible devices.
                </p>
              </div>
            </div>
          </section>

          {/* Installation */}
          <section id="installation" className="scroll-mt-24 max-w-4xl mx-auto px-6 py-16 border-b border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6">Installation</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">1. Add the dependency</h3>
                <p className="text-muted-foreground mb-4">
                  Add the EdfaPay SDK to your app's <code className="bg-muted px-1.5 py-0.5 rounded text-sm">build.gradle</code> file:
                </p>
                <div className="relative">
                  <div className="bg-[hsl(var(--code-bg))] border border-[hsl(var(--code-border))] rounded-lg p-4">
                    <code className="text-sm">implementation 'com.edfapay:payment-sdk:1.0.5'</code>
                  </div>
                  <button
                    onClick={handleCopyGradle}
                    className="absolute top-3 right-3 p-2 rounded-md bg-background/80 hover:bg-background border border-border transition-all"
                  >
                    {copied ? <Check className="w-4 h-4 text-[hsl(var(--method-get))]" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">2. Configure ProGuard</h3>
                <p className="text-muted-foreground mb-4">
                  If using ProGuard, add the following rules:
                </p>
                <CodeBlock
                  code={`-keep class com.edfapay.paymentcard.** { *; }
-dontwarn com.edfapay.paymentcard.**`}
                  language="proguard"
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">3. Add Permissions</h3>
                <p className="text-muted-foreground mb-4">
                  Add the required permissions to your <code className="bg-muted px-1.5 py-0.5 rounded text-sm">AndroidManifest.xml</code>:
                </p>
                <CodeBlock
                  code={`<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.NFC" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />`}
                  language="xml"
                />
              </div>
            </div>
          </section>

          {/* API Reference */}
          <div className="max-w-4xl mx-auto px-6 py-16">
            <h2 className="text-2xl font-bold text-foreground mb-2">API Reference</h2>
            <p className="text-muted-foreground mb-10">
              Complete reference for all public methods in the EdfaPayPlugin SDK.
            </p>

            <div className="space-y-8">
              {apiFunctions.map((fn) => (
                <FunctionCard key={fn.id} {...fn} />
              ))}
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t border-border py-8 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-sm text-muted-foreground">
                EdfaPay SDK Documentation • Version 1.0.5 • Built with ❤️ for developers
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Index;
