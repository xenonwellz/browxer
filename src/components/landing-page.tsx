import * as React from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { 
  Github, 
  ArrowRight, 
  Terminal, 
  Zap, 
  Shield, 
  Link as LinkIcon,
  Search,
  Box,
  Layers,
  Upload,
  Eye,
  Settings,
  Database
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoginPattern } from '@/components/ui/login-pattern'
import { ThemeSelector } from '@/components/theme-selector'

export function LandingPage() {
  const navigate = useNavigate()
  const [tunnelUrl, setTunnelUrl] = React.useState('')

  const handleUseTunnel = (e: React.FormEvent) => {
    e.preventDefault()
    if (tunnelUrl) {
      navigate({ to: '/login', search: { endpoint: tunnelUrl } })
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#020202] text-zinc-100 selection:bg-primary/30 selection:text-primary-foreground overflow-x-hidden">
      {/* Background radial effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] opacity-30"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] opacity-20"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#020202]/50 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="font-logo text-2xl font-bold tracking-tighter select-none">
              BROW<span className="text-primary drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]">S3</span>R
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            {/* Nav links removed as requested */}
          </div>
          <div className="flex items-center gap-4">
            <ThemeSelector />
            <Button render={<Link to="/login" search={{ endpoint: undefined }} />} className="hidden sm:inline-flex shadow-[0_0_30px_rgba(var(--primary-rgb),0.4)] hover:shadow-primary/50 transition-all duration-300">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-64 pb-48 lg:pt-80 lg:pb-64 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <LoginPattern />
        </div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black px-4 py-1.5 text-xs font-semibold text-primary mb-12 backdrop-blur-sm shadow-[0_0_20px_rgba(0,0,0,1)] hover:border-primary/30 transition-colors cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Not backed by Y Combinator
          </div>
          
          <h1 className="text-6xl font-bold tracking-tight sm:text-8xl mb-8 bg-clip-text text-transparent bg-linear-to-b from-white via-white to-white/40 leading-[1.05] drop-shadow-sm">
            Management of S3 buckets<br />with pure elegance
          </h1>
          
          <p className="mx-auto max-w-2xl text-xl text-zinc-400/80 mb-14 leading-relaxed font-medium">
            BROW<span className="text-primary/90">S3</span>R is a high-performance, open-source S3 file explorer designed for speed, security, and developer productivity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button size="lg" className="h-14 px-10 text-lg shadow-[0_0_35px_rgba(var(--primary-rgb),0.5)] hover:bg-primary/90 transition-all duration-300 rounded-full" render={<Link to="/login" search={{ endpoint: undefined }} />}>
              Open Browser <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-white/10 hover:bg-white/10 transition-all duration-300 rounded-full backdrop-blur-sm shadow-xl" render={
              <a href="https://github.com/xenonwellz/brows3r" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-5 w-5" /> Star on GitHub
              </a>
            } />
          </div>
          
          <div className="mt-20 mx-auto max-w-2xl">
            <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-1 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                <Terminal className="h-3 w-3" /> Quick Docker Install
              </div>
              <div className="p-6 font-mono text-sm text-left flex items-center justify-between group">
                <code className="text-primary">docker run -p 3000:3000 xenonwellz/brows3r</code>
                <button 
                  onClick={() => navigator.clipboard.writeText('docker run -p 3000:3000 xenonwellz/brows3r')}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/5 rounded-lg text-zinc-400"
                  title="Copy to clipboard"
                >
                  <Box className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 lg:py-64 bg-transparent px-4 sm:px-6 lg:px-8 relative">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-clip-text text-transparent bg-linear-to-b from-white to-white/50">Built for elite workflows</h2>
            <p className="text-zinc-500 text-lg font-medium max-w-2xl mx-auto">Stop fighting clunky consoles. Start browsing with speed and precision.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Layers className="h-6 w-6 text-primary" />}
              title="Multi-region Support"
              description="Connect to any S3-compatible service across any region with zero friction."
            />
            <FeatureCard 
              icon={<Upload className="h-6 w-6 text-accent" />}
              title="Direct Uploads"
              description="Upload files directly to your buckets with high-speed multipart support."
            />
            <FeatureCard 
              icon={<Eye className="h-6 w-6 text-emerald-400" />}
              title="Instant Previews"
              description="Quickly view images, documents, and logs without downloading them first."
            />
            <FeatureCard 
              icon={<Shield className="h-6 w-6 text-blue-400" />}
              title="Secure by Design"
              description="Your credentials never leave your browser. Connect directly to your storage provider."
            />
            <FeatureCard 
              icon={<Search className="h-6 w-6 text-orange-400" />}
              title="Advanced Search"
              description="Find objects instantly with prefix-based filtering and structured metadata views."
            />
            <FeatureCard 
              icon={<Settings className="h-6 w-6 text-violet-400" />}
              title="Custom Endpoints"
              description="Fully compatible with MinIO, LocalStack, and other S3-like storage services."
            />
          </div>
        </div>
      </section>

      {/* OutRay Integration Section */}
      <section className="py-32 lg:py-64 relative overflow-hidden bg-white/1.5 border-y border-white/5">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.1),transparent)]"></div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
            <div className="flex-1 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-8">
                Local Development
              </div>
              <h2 className="text-4xl font-bold tracking-tight sm:text-6xl mb-8 leading-[1.1]">
                Tunnel your local S3 with <span className="text-primary drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]">OutRay</span>
              </h2>
              <p className="text-zinc-400 text-lg leading-relaxed mb-10 font-medium">
                Developing locally with MinIO or LocalStack? Don't mess with complex networking. 
                Use <strong>OutRay</strong> to expose your local storage via a secure tunnel and connect 
                BROW<span className="text-primary/90">S3</span>R instantly.
              </p>
              
              <ul className="space-y-6 mb-12">
                <li className="flex items-center gap-4 text-zinc-300 font-medium">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Zap className="h-3.5 w-3.5 text-primary" />
                  </div>
                  One command to expose your local S3 service
                </li>
                <li className="flex items-center gap-4 text-zinc-300 font-medium">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Zap className="h-3.5 w-3.5 text-primary" />
                  </div>
                  Secure HTTPS endpoints automatically generated
                </li>
                <li className="flex items-center gap-4 text-zinc-300 font-medium">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Zap className="h-3.5 w-3.5 text-primary" />
                  </div>
                  Zero-configuration networking for LocalStack/MinIO
                </li>
              </ul>

              <div className="flex flex-wrap gap-4 items-center">
                <a href="https://outray.dev" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary font-bold hover:text-primary/80 group transition-colors px-1 py-1">
                  Learn more at OutRay.dev <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            <div className="flex-1 w-full max-w-2xl">
              <div className="rounded-2xl border border-white/10 bg-black shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden ring-1 ring-white/5">
                <div className="flex items-center gap-1.5 border-b border-white/5 bg-zinc-900/40 px-5 py-4">
                  <div className="h-3 w-3 rounded-full bg-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)] border border-red-500/30"></div>
                  <div className="h-3 w-3 rounded-full bg-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)] border border-amber-500/30"></div>
                  <div className="h-3 w-3 rounded-full bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)] border border-emerald-500/30"></div>
                  <div className="ml-6 flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                    <Terminal className="h-3 w-3" /> Tunnel Console
                  </div>
                </div>
                <div className="p-10 font-mono text-sm sm:text-base leading-relaxed overflow-x-auto">
                  <div className="flex gap-3 mb-2">
                    <span className="text-emerald-500/90 font-bold">user@outray-cli</span>
                    <span className="text-zinc-600">➜</span>
                    <span className="text-zinc-100">~ outray 9000</span>
                  </div>
                  <div className="text-zinc-600 mb-6 italic text-xs"># Tunneling local MinIO/LocalStack...</div>
                  <div className="text-emerald-400 font-bold mb-3 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></div> Linked to port 9000
                  </div>
                  <div className="text-zinc-100 flex items-center gap-3 mb-10 p-4 rounded-xl bg-primary/10 border border-primary/30 w-fit backdrop-blur-sm shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]">
                    <LinkIcon className="h-4.5 w-4.5 text-primary" />
                    Tunnel ready: <span className="text-primary font-black underline decoration-primary/40 underline-offset-4 cursor-pointer">https://s3-local.outray.app</span>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-black">Quick Action</p>
                    <form onSubmit={handleUseTunnel} className="flex items-center gap-2">
                      <div className="relative flex-1 group">
                        <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
                        <Input 
                          placeholder="Paste tunnel URL..." 
                          className="pl-11 h-11 bg-zinc-900/50 border-white/5 text-sm rounded-xl focus:border-primary/50 transition-all shadow-inner"
                          value={tunnelUrl}
                          onChange={(e) => setTunnelUrl(e.target.value)}
                        />
                      </div>
                      <Button type="submit" size="sm" className="h-11 px-6 rounded-xl font-bold transition-all shadow-lg active:scale-95">Connect</Button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack / Open Source */}
      <section className="py-32 lg:py-64 bg-transparent relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-bold tracking-tight sm:text-6xl mb-8 bg-clip-text text-transparent bg-linear-to-b from-white to-white/60">Direct Client-to-S3 Architecture</h2>
          <p className="mx-auto max-w-3xl text-xl text-zinc-500 mb-20 leading-relaxed font-medium">
            Your data stays exactly where it belongs. BROW<span className="text-primary/90">S3</span>R acts as a powerful interface 
            connecting your browser directly to your S3 buckets. Secure, private, and insanely fast.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-4xl mx-auto">
            <TechItem icon={<Database className="h-10 w-10 text-zinc-200" />} label="AWS S3 SDK" />
            <TechItem icon={<Layers className="h-10 w-10 text-zinc-200" />} label="TanStack" />
            <TechItem icon={<Shield className="h-10 w-10 text-zinc-200" />} label="E2E Secure" />
            <TechItem icon={<Box className="h-10 w-10 text-zinc-200" />} label="MIT Licensed" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 border-t border-white/5 bg-transparent px-4 sm:px-6 lg:px-8 relative">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-16">
            <div className="flex flex-col items-center md:items-start gap-8">
              <span className="font-logo text-4xl font-bold tracking-tighter select-none">
                BROW<span className="text-primary drop-shadow-[0_0_10px_rgba(var(--primary-rgb),0.4)]">S3</span>R
              </span>
              <p className="text-zinc-600 text-base max-w-xs text-center md:text-left leading-relaxed font-medium">
                The ultimate open-source S3 browser for developers who care about speed and privacy.
              </p>
            </div>
            <div className="flex justify-center md:justify-end gap-16 text-sm">
              <div className="flex flex-col gap-5">
                <p className="font-bold text-white uppercase tracking-[0.2em] text-[10px]">Social</p>
                <a href="https://x.com/xenonellz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-zinc-500 hover:text-white transition-all font-medium">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                  </svg>
                  X</a>
                <a href="https://github.com/xenonwellz/brows3r" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-zinc-500 hover:text-white transition-all font-medium"><Github className="h-4.5 w-4.5" /> GitHub</a>
                <a href="https://hub.docker.com/r/xenonwellz/brows3r" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-zinc-500 hover:text-white transition-all font-medium"><Box className="h-4.5 w-4.5" /> Docker</a>
              </div>
            </div>
          </div>
          <div className="mt-24 pt-10 border-t border-white/5 flex flex-col items-center gap-6">
             <p className="text-zinc-700 text-xs font-bold tracking-widest">© 2026 BROW-S3-R. REDEFINING CLOUD STORAGE MANAGEMENT.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-12 rounded-[2.5rem] border border-white/5 bg-white/2 hover:bg-white/4 hover:border-white/10 transition-all duration-500 group backdrop-blur-xl relative overflow-hidden ring-1 ring-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-500">
        <ArrowRight className="h-6 w-6 text-zinc-800 -rotate-45" />
      </div>
      <div className={`h-16 w-16 rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.5)]`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-5 tracking-tight group-hover:text-primary transition-colors duration-500">{title}</h3>
      <p className="text-zinc-500 leading-relaxed text-base font-medium transition-colors duration-500 group-hover:text-zinc-400">{description}</p>
    </div>
  )
}

function TechItem({ icon, label }: { icon: React.ReactElement<any>, label: string }) {
  return (
    <div className="flex flex-col items-center gap-6 group">
      <div className="h-20 w-20 rounded-3xl bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:bg-[#0a0a0a] group-hover:border-primary/20 transition-all duration-500 shadow-2xl group-hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)] group-hover:scale-105">
        {React.cloneElement(icon, { 
          className: (icon.props.className || "") + " group-hover:text-primary transition-colors duration-500" 
        })}
      </div>
      <span className="font-bold text-sm tracking-widest text-zinc-600 group-hover:text-zinc-400 transition-colors uppercase">{label}</span>
    </div>
  )
}
