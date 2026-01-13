import * as React from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  ArrowRight,
  Box,
  Database,
  Eye,
  Github,
  Layers,
  Link as LinkIcon,
  Search,
  Settings,
  Shield,
  Terminal,
  Upload,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoginPattern } from '@/components/ui/login-pattern'
import { ThemeSelector } from '@/components/theme-selector'
import { motion } from 'framer-motion'

export function LandingPage() {
  const navigate = useNavigate()
  const [tunnelUrl, setTunnelUrl] = React.useState('')

  const handleUseTunnel = (e: React.FormEvent) => {
    e.preventDefault()
    if (tunnelUrl) {
      navigate({ to: '/login', search: { endpoint: tunnelUrl } })
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as any,
      },
    },
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground overflow-x-hidden transition-colors duration-500">
      {/* Background radial effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] opacity-30"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] opacity-20"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-border bg-background/50 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="font-logo text-2xl font-bold tracking-tighter select-none">
              BROW
              <span className="text-primary">
                S3
              </span>
              R
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            {/* Nav links removed as requested */}
          </div>
          <div className="flex items-center gap-4">
            <ThemeSelector />
            <Button
              render={<Link to="/login" search={{ endpoint: undefined }} />}
              className="hidden sm:inline-flex shadow-xl hover:shadow-primary/50 transition-all duration-300"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-80 lg:pb-64 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <LoginPattern />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-left sm:text-center"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-8xl mb-6 bg-clip-text text-transparent bg-linear-to-b from-zinc-950 via-zinc-900 to-zinc-700 dark:from-white dark:via-white dark:to-white/40 leading-[1.1] sm:leading-[1.05] drop-shadow-sm"
          >
            Management of S3 buckets
            <br className="hidden sm:block" />
            with pure elegance
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="max-max-2xl text-lg sm:text-xl text-muted-foreground mb-12 sm:mb-14 leading-relaxed font-medium sm:mx-auto"
          >
            BROW<span className="text-primary/90">S3</span>R is a
            high-performance, open-source S3 file explorer designed for speed,
            security, and developer productivity.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-row items-center justify-start sm:justify-center gap-3 sm:gap-6"
          >
            <Button
              size="lg"
              className="h-12 sm:h-14 px-5 sm:px-10 text-sm sm:text-lg shadow-xl hover:bg-primary/90 transition-all duration-300 rounded-full shrink-0"
              render={<Link to="/login" search={{ endpoint: undefined }} />}
            >
              Open Browser{' '}
              <ArrowRight className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 sm:h-14 px-5 sm:px-10 text-sm sm:text-lg border-border hover:bg-muted transition-all duration-300 rounded-full backdrop-blur-sm shadow-xl shrink-0"
              render={
                <a
                  href="https://github.com/xenonwellz/brows3r"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />{' '}
                  GitHub
                </a>
              }
            />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-20 mx-auto max-w-2xl"
          >
            <div className="rounded-2xl border border-white/10 bg-black backdrop-blur-sm p-1 overflow-hidden transition-colors shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                <Terminal className="h-3 w-3" /> Quick Docker Install
              </div>
              <div className="p-6 font-mono text-sm text-left flex items-center justify-between group">
                <code className="text-zinc-100">
                  docker run -p 3000:3000 xenonwellz/brows3r
                </code>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      'docker run -p 3000:3000 xenonwellz/brows3r',
                    )
                  }
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/5 rounded-lg text-zinc-400"
                  title="Copy to clipboard"
                >
                  <Box className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-20 lg:py-64 bg-muted/40 px-4 sm:px-6 lg:px-8 relative border-y border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary-rgb),0.05),transparent)]"></div>
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16 lg:mb-24 px-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-6xl mb-6 bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/50">
              Built for elite workflows
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg font-medium max-w-2xl mx-auto">
              Stop fighting clunky consoles. Start browsing with speed and
              precision.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <motion.div variants={itemVariants}>
              <FeatureCard
                icon={<Layers className="h-6 w-6 text-primary" />}
                title="Multi-region Support"
                description="Connect to any S3-compatible service across any region with zero friction."
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureCard
                icon={<Upload className="h-6 w-6 text-accent" />}
                title="Direct Uploads"
                description="Upload files directly to your buckets with high-speed multipart support."
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureCard
                icon={<Eye className="h-6 w-6 text-emerald-400" />}
                title="Instant Previews"
                description="Quickly view images, documents, and logs without downloading them first."
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureCard
                icon={<Shield className="h-6 w-6 text-blue-400" />}
                title="Secure by Design"
                description="Your credentials never leave your browser. Connect directly to your storage provider."
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureCard
                icon={<Search className="h-6 w-6 text-orange-400" />}
                title="Advanced Search"
                description="Find objects instantly with prefix-based filtering and structured metadata views."
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureCard
                icon={<Settings className="h-6 w-6 text-violet-400" />}
                title="Custom Endpoints"
                description="Fully compatible with MinIO, LocalStack, and other S3-like storage services."
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* OutRay Integration Section */}
      <section className="py-20 lg:py-64 relative overflow-hidden bg-muted/20 border-y border-border">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--color-primary),transparent)] opacity-10"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-32">
            <div className="flex-1 text-center lg:text-left px-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-6 lg:mb-8">
                Local Development
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-6xl mb-6 lg:mb-8 leading-[1.2] lg:leading-[1.1]">
                Tunnel your local S3 with{' '}
                <span className="text-primary">
                  OutRay
                </span>
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8 lg:mb-10 font-medium">
                Developing locally with MinIO or LocalStack? Don't mess with
                complex networking. Use <strong>OutRay</strong> to expose your
                local storage via a secure tunnel and connect BROW
                <span className="text-primary/90">S3</span>R instantly.
              </p>

              <ul className="space-y-4 lg:space-y-6 mb-10 lg:mb-12 text-left max-w-lg mx-auto lg:mx-0">
                <li className="flex items-center gap-4 text-foreground/80 font-medium">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Zap className="h-3.5 w-3.5 text-primary" />
                  </div>
                  One command to expose your local S3 service
                </li>
                <li className="flex items-center gap-4 text-foreground/80 font-medium">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Zap className="h-3.5 w-3.5 text-primary" />
                  </div>
                  Secure HTTPS endpoints automatically generated
                </li>
                <li className="flex items-center gap-4 text-foreground/80 font-medium">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Zap className="h-3.5 w-3.5 text-primary" />
                  </div>
                  Zero-configuration networking for LocalStack/MinIO
                </li>
              </ul>

              <div className="flex flex-wrap gap-4 items-center justify-center lg:justify-start">
                <a
                  href="https://outray.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary font-bold hover:text-primary/80 group transition-colors px-1 py-1"
                >
                  Learn more at OutRay.dev{' '}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            <div className="flex-1 w-full max-w-2xl px-2 sm:px-0 mt-12 lg:mt-0">
              <div className="rounded-2xl border border-border bg-card shadow-[0_0_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden ring-1 ring-border/50">
                <div className="flex items-center gap-1.5 border-b border-border bg-muted/40 px-3 sm:px-5 py-3 sm:py-4">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)] border border-red-500/30"></div>
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)] border border-amber-500/30"></div>
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)] border border-emerald-500/30"></div>
                  <div className="ml-4 sm:ml-6 flex items-center gap-2 text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                    <Terminal className="h-3 w-3" /> Console
                  </div>
                </div>
                <div className="p-5 sm:p-10 font-mono text-xs sm:text-base leading-relaxed overflow-x-hidden">
                  <div className="flex gap-3 mb-2">
                    <span className="text-emerald-500/90 font-bold">
                      user@outray-cli
                    </span>
                    <span className="text-muted-foreground/40">➜</span>
                    <span className="text-foreground">~ outray 9000</span>
                  </div>
                  <div className="text-muted-foreground/40 mb-6 italic text-xs">
                    # Tunneling local MinIO/LocalStack...
                  </div>
                  <div className="text-emerald-400 font-bold mb-3 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></div>{' '}
                    Linked to port 9000
                  </div>
                  <div className="text-foreground flex items-center gap-2 sm:gap-3 mb-8 sm:mb-10 p-3 sm:p-4 rounded-xl bg-primary/10 border border-primary/30 w-full sm:w-fit backdrop-blur-sm shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]">
                    <LinkIcon className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-primary shrink-0" />
                    <div className="text-[11px] sm:text-sm truncate">
                      Tunnel ready:{' '}
                      <span className="text-primary font-black underline decoration-primary/40 underline-offset-4 cursor-pointer">
                        https://s3-local.outray.app
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] text-muted-foreground/60 uppercase tracking-[0.2em] font-black">
                      Quick Action
                    </p>
                    <form
                      onSubmit={handleUseTunnel}
                      className="flex items-center gap-2"
                    >
                      <div className="relative flex-1 group">
                        <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                        <Input
                          placeholder="Paste tunnel URL..."
                          className="pl-11 h-11 bg-muted/20 border-border text-sm rounded-xl focus:border-primary/50 transition-all shadow-inner"
                          value={tunnelUrl}
                          onChange={(e) => setTunnelUrl(e.target.value)}
                        />
                      </div>
                      <Button
                        type="submit"
                        size="sm"
                        className="h-11 px-6 rounded-xl font-bold transition-all shadow-lg active:scale-95"
                      >
                        Connect
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack / Open Source */}
      <section className="py-20 lg:py-64 bg-transparent relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl font-bold tracking-tight sm:text-6xl mb-6 lg:mb-8 bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/60">
            Direct Client-to-S3 Architecture
          </h2>
          <p className="mx-auto max-w-3xl text-base sm:text-xl text-muted-foreground mb-16 lg:mb-20 leading-relaxed font-medium">
            Your data stays exactly where it belongs. BROW
            <span className="text-primary/90">S3</span>R acts as a powerful
            interface connecting your browser directly to your S3 buckets.
            Secure, private, and insanely fast.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-4xl mx-auto">
            <TechItem
              icon={<Database className="h-10 w-10 text-foreground/80" />}
              label="AWS S3 SDK"
            />
            <TechItem
              icon={<Layers className="h-10 w-10 text-foreground/80" />}
              label="TanStack"
            />
            <TechItem
              icon={<Shield className="h-10 w-10 text-foreground/80" />}
              label="E2E Secure"
            />
            <TechItem
              icon={<Box className="h-10 w-10 text-foreground/80" />}
              label="MIT Licensed"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 border-t border-border bg-transparent px-4 sm:px-6 lg:px-8 relative">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row *:sm:flex-1 justify-between items-start gap-12 sm:gap-16 w-full">
            <div className="flex flex-col gap-6">
              <span className="font-logo text-3xl sm:text-4xl font-bold tracking-tighter select-none">
                BROW
                <span className="text-primary">
                  S3
                </span>
                R
              </span>
              <p className="text-muted-foreground/60 text-sm sm:text-base max-w-xs leading-relaxed font-medium">
                The ultimate open-source S3 browser for developers who care
                about speed and privacy.
              </p>
            </div>

            <div className="w-full flex gap-16 justify-between sm:gap-24 *:flex-1">
              <div className="flex flex-col gap-6">
                <p className="font-bold text-foreground uppercase tracking-[0.2em] text-[10px] opacity-50">
                  Social
                </p>
                <div className="flex flex-col gap-4">
                  <a
                    href="https://x.com/xenonellz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-all font-medium text-sm"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 fill-current"
                      aria-hidden="true"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                    </svg>
                    X
                  </a>
                  <a
                    href="https://github.com/xenonwellz/brows3r"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-all font-medium text-sm"
                  >
                    <Github className="h-4 w-4" /> Github
                  </a>
                  <a
                    href="https://hub.docker.com/r/xenonwellz/brows3r"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-all font-medium text-sm"
                  >
                    <Box className="h-4 w-4" /> Docker
                  </a>
                </div>
              </div>
              <div className="flex flex-col gap-6 sm:text-right">
                <p className="font-bold text-foreground uppercase tracking-[0.2em] text-[10px] opacity-50">
                  Product
                </p>
                <div className="flex flex-col gap-4">
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-all font-medium text-sm"
                  >
                    Features
                  </a>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-all font-medium text-sm"
                  >
                    Docs
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-20 sm:mt-24 pt-10 border-t border-border flex flex-col items-start gap-6 text-center w-full">
            <p className="text-muted-foreground/30 text-[10px] font-bold tracking-[0.3em] uppercase text-center w-full">
              © {new Date().getFullYear()} BROW-S3-R. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="p-8 sm:p-12 rounded-[2rem] sm:rounded-[2.5rem] border border-border bg-card/40 hover:bg-card/60 hover:border-primary/20 transition-all duration-500 group backdrop-blur-xl relative overflow-hidden ring-1 ring-border shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      <div className="absolute top-0 right-0 p-4 sm:p-6 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-500">
        <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground/40 -rotate-45" />
      </div>
      <div
        className={`h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-muted/50 border border-border flex items-center justify-center mb-6 sm:mb-10 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)]`}
      >
        {icon}
      </div>
      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5 tracking-tight group-hover:text-primary transition-colors duration-500">
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed text-sm sm:text-base font-medium transition-colors duration-500 group-hover:text-foreground/70">
        {description}
      </p>
    </div>
  )
}

function TechItem({
  icon,
  label,
}: {
  icon: React.ReactElement<any>
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-6 group">
      <div className="h-20 w-20 rounded-3xl bg-muted/20 border border-border flex items-center justify-center group-hover:bg-card group-hover:border-primary/20 transition-all duration-500 shadow-xl group-hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)] group-hover:scale-105">
        {React.cloneElement(icon, {
          className:
            (icon.props.className || '') +
            ' group-hover:text-primary transition-colors duration-500',
        })}
      </div>
      <span className="font-bold text-sm tracking-widest text-muted-foreground/60 group-hover:text-foreground/80 transition-colors uppercase">
        {label}
      </span>
    </div>
  )
}
