import { motion } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  Brain,
  CheckCircle2,
  Clock3,
  Download,
  FileJson,
  FileSpreadsheet,
  LayoutGrid,
  PlayCircle,
  Search,
  ShieldCheck,
  UploadCloud,
} from 'lucide-react'
import schematicPreview from '../output/schematic_water_cooling_loop.svg'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button-variants'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const stats = [
  { value: '10,000+', label: 'schematics analyzed' },
  { value: '94%', label: 'accuracy' },
  { value: '2 min', label: 'avg analysis time' },
  { value: '500+', label: 'contractors' },
]

const features = [
  {
    title: 'Auto Tag Extraction',
    description:
      'Detect pipe tags, line numbers, valves, instruments, and equipment from dense P&ID sheets without manual markup.',
    icon: Search,
  },
  {
    title: 'Floor Plan Analysis',
    description:
      'Map callouts to sheet zones and adjacent floor plan references so field teams can navigate revisions faster.',
    icon: LayoutGrid,
  },
  {
    title: 'Export to CSV/JSON',
    description:
      'Push structured outputs straight into estimating, QA, or CMMS workflows with clean CSV and JSON exports.',
    icon: FileSpreadsheet,
  },
]

const steps = [
  {
    title: 'Upload schematic',
    description:
      'Drop in a scanned PDF, CAD export, or image from the field. BluePipe normalizes sheet quality automatically.',
    icon: UploadCloud,
  },
  {
    title: 'AI extracts tags',
    description:
      'The model identifies line tags, valves, instruments, and major equipment with context from neighboring callouts.',
    icon: Brain,
  },
  {
    title: 'Download report',
    description:
      'Review a structured summary, validate flagged edge cases, and export the final dataset for your team.',
    icon: Download,
  },
]

const plans = [
  {
    name: 'Starter',
    price: '$49',
    cadence: '/mo',
    description: 'For small subcontractors validating a few sheets each week.',
    features: ['Up to 50 schematics / month', 'CSV export', 'Email support'],
    cta: 'Start Starter',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$149',
    cadence: '/mo',
    description: 'For fast-moving MEP teams that need batch extraction and review.',
    features: [
      'Up to 500 schematics / month',
      'CSV + JSON export',
      'Priority extraction queue',
    ],
    cta: 'Choose Pro',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    cadence: '',
    description: 'For multi-office contractors with security, API, and onboarding needs.',
    features: ['Unlimited usage', 'Private deployment', 'SSO + API access'],
    cta: 'Talk to Sales',
    featured: false,
  },
]

const faqs = [
  {
    value: 'accuracy',
    question: 'How accurate is the extraction?',
    answer:
      'BluePipe averages 94% field-level accuracy on production P&ID datasets, with confidence scoring so reviewers can spot uncertain tags quickly.',
  },
  {
    value: 'formats',
    question: 'What file types can I upload?',
    answer:
      'The beta accepts PDF, PNG, and JPG schematics. CAD exports and scanned sheets are both supported as long as the drawing is readable.',
  },
  {
    value: 'workflow',
    question: 'Can I export into our existing workflow?',
    answer:
      'Yes. Reports can be downloaded as CSV or JSON and mapped into estimating spreadsheets, asset databases, or QA review systems.',
  },
  {
    value: 'security',
    question: 'Is our project data secure?',
    answer:
      'Uploads are encrypted in transit and at rest. Enterprise plans include private environments and retention controls for regulated projects.',
  },
  {
    value: 'beta',
    question: 'What happens during beta access?',
    answer:
      'Beta teams get onboarding help, direct feedback channels, and early access to batch review features before public launch.',
  },
]

const footerLinks = ['Privacy', 'Terms', 'Contact']

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-slate-600 md:text-lg">
        {description}
      </p>
    </div>
  )
}

function App() {
  return (
    <div className="relative overflow-x-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.2),transparent_42%),radial-gradient(circle_at_80%_0%,rgba(139,92,246,0.16),transparent_28%)]" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
          <a href="#" className="flex items-center gap-3 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-sky-500 to-violet-500 shadow-lg shadow-blue-900/30">
              <span className="text-lg font-extrabold">B</span>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-200">
                BluePipe AI
              </p>
              <p className="text-xs text-slate-400">Schematic Reader</p>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a className="transition hover:text-white" href="#features">
              Features
            </a>
            <a className="transition hover:text-white" href="#how-it-works">
              How It Works
            </a>
            <a className="transition hover:text-white" href="#pricing">
              Pricing
            </a>
          </nav>

          <a
            href="#beta"
            className={cn(
              buttonVariants({ variant: 'default' }),
              'h-11 rounded-full bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 hover:bg-blue-500',
            )}
          >
            Get Beta Access
          </a>
        </div>
      </header>

      <main>
        <section className="px-6 pb-16 pt-14 lg:px-8 lg:pb-24 lg:pt-20">
          <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.02fr_0.98fr]">
            <motion.div
              className="max-w-2xl"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.65, ease: 'easeOut' }}
            >
              <Badge className="rounded-full bg-blue-50 px-3 py-1 text-blue-700 ring-1 ring-blue-100">
                Built for MEP contractors and process teams
              </Badge>
              <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-slate-950 md:text-6xl lg:text-7xl">
                Analyze{' '}
                <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-violet-600 bg-clip-text text-transparent">
                  P&amp;ID Schematics
                </span>{' '}
                in Seconds
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 md:text-xl">
                BluePipe Schematic AI reads engineering drawings and extracts
                pipe tags, valves, instruments, and equipment automatically so
                MEP contractors can reclaim hours from every review cycle.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button className="h-12 rounded-full bg-blue-600 px-6 text-base font-semibold text-white shadow-lg shadow-blue-900/20 hover:bg-blue-500">
                  Start Free Trial
                  <ArrowRight className="ml-1" />
                </Button>
                <a
                  href="#how-it-works"
                  className={cn(
                    buttonVariants({ variant: 'outline' }),
                    'h-12 rounded-full border-slate-300 bg-white px-6 text-base font-semibold text-slate-900 shadow-sm hover:bg-slate-50',
                  )}
                >
                  <PlayCircle className="mr-2" />
                  See Live Demo
                </a>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-blue-600" />
                  No CAD cleanup required
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  Secure project data handling
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.75, delay: 0.08, ease: 'easeOut' }}
            >
              <div className="absolute -left-8 top-10 hidden h-44 w-44 rounded-full bg-blue-500/15 blur-3xl md:block" />
              <div className="absolute -right-4 bottom-10 hidden h-40 w-40 rounded-full bg-violet-500/15 blur-3xl md:block" />

              <Card className="relative overflow-hidden rounded-[2rem] border-white/70 bg-white/90 p-0 shadow-[0_30px_80px_rgba(15,23,42,0.16)] backdrop-blur">
                <div className="border-b border-slate-200 bg-slate-950 px-6 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Water Cooling Loop
                      </p>
                      <p className="text-xs text-slate-400">
                        P&amp;ID extraction preview
                      </p>
                    </div>
                    <Badge className="rounded-full bg-blue-500/15 px-3 py-1 text-blue-200 ring-1 ring-blue-400/20">
                      Live analysis
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-0 lg:grid-cols-[1.35fr_0.9fr]">
                  <div className="relative min-h-[26rem] overflow-hidden bg-slate-950">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:32px_32px]" />
                    <img
                      src={schematicPreview}
                      alt="P&ID schematic preview"
                      className="relative z-10 h-full w-full object-cover opacity-80 mix-blend-screen"
                    />
                    <div className="absolute left-[16%] top-[22%] z-20 rounded-full border border-blue-300/60 bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-50 shadow-lg shadow-blue-950/20 backdrop-blur">
                      Line 4&quot;-CW-102
                    </div>
                    <div className="absolute bottom-[28%] right-[16%] z-20 rounded-full border border-violet-300/60 bg-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-50 shadow-lg shadow-violet-950/20 backdrop-blur">
                      Valve XV-12
                    </div>
                  </div>

                  <div className="space-y-4 bg-white p-6">
                    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                      <p className="text-sm font-semibold text-slate-900">
                        Extraction Summary
                      </p>
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-white p-3 shadow-sm">
                          <p className="text-2xl font-bold text-slate-950">
                            127
                          </p>
                          <p className="text-xs text-slate-500">Pipe tags</p>
                        </div>
                        <div className="rounded-xl bg-white p-3 shadow-sm">
                          <p className="text-2xl font-bold text-slate-950">41</p>
                          <p className="text-xs text-slate-500">Valves</p>
                        </div>
                        <div className="rounded-xl bg-white p-3 shadow-sm">
                          <p className="text-2xl font-bold text-slate-950">28</p>
                          <p className="text-xs text-slate-500">Instruments</p>
                        </div>
                        <div className="rounded-xl bg-white p-3 shadow-sm">
                          <p className="text-2xl font-bold text-slate-950">12</p>
                          <p className="text-xs text-slate-500">Equipment</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-900">
                          Output formats
                        </p>
                        <div className="flex items-center gap-2 text-slate-500">
                          <FileSpreadsheet className="h-4 w-4" />
                          <FileJson className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="mt-3 space-y-2 text-sm text-slate-600">
                        <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2">
                          <span>Equipment register.csv</span>
                          <CheckCircle2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2">
                          <span>Tag schema.json</span>
                          <CheckCircle2 className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        <section className="px-6 pb-16 lg:px-8">
          <motion.div
            className="mx-auto grid max-w-7xl gap-4 rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur md:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-slate-50 p-5">
                <p className="text-3xl font-bold tracking-tight text-slate-950">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </section>

        <section id="features" className="px-6 py-18 lg:px-8">
          <SectionHeading
            eyebrow="Features"
            title="Extract what matters from every schematic"
            description="BluePipe turns dense engineering drawings into structured data your estimating, QA, and field teams can actually use."
          />

          <div className="mx-auto mt-14 grid max-w-7xl gap-6 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon

              return (
                <motion.div
                  key={feature.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.25 }}
                  variants={fadeUp}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.08,
                    ease: 'easeOut',
                  }}
                >
                  <Card className="h-full rounded-[1.75rem] border-white/70 bg-white/90 p-2 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
                    <CardHeader>
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-900/20">
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="pt-4 text-xl font-semibold text-slate-950">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-base leading-7 text-slate-600">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </section>

        <section id="how-it-works" className="px-6 py-18 lg:px-8">
          <SectionHeading
            eyebrow="How It Works"
            title="Three steps from upload to usable data"
            description="The workflow is designed for busy teams that need fast answers, not another complex software rollout."
          />

          <div className="mx-auto mt-14 grid max-w-7xl gap-6 lg:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon

              return (
                <motion.div
                  key={step.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.25 }}
                  variants={fadeUp}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.08,
                    ease: 'easeOut',
                  }}
                >
                  <Card className="h-full rounded-[1.75rem] border border-slate-200/80 bg-slate-950 p-2 text-white shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
                    <CardHeader>
                      <div className="flex items-center justify-between gap-4">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lg font-bold text-blue-300">
                          0{index + 1}
                        </span>
                        <Icon className="h-6 w-6 text-blue-300" />
                      </div>
                      <CardTitle className="pt-4 text-xl font-semibold text-white">
                        {step.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-base leading-7 text-slate-300">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </section>

        <section id="pricing" className="px-6 py-18 lg:px-8">
          <SectionHeading
            eyebrow="Pricing"
            title="Plans that scale from pilot to portfolio"
            description="Start with a lightweight beta plan or roll BluePipe across regional offices with private deployment support."
          />

          <div className="mx-auto mt-14 grid max-w-7xl gap-6 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                variants={fadeUp}
                transition={{
                  duration: 0.55,
                  delay: index * 0.08,
                  ease: 'easeOut',
                }}
              >
                <Card
                  className={cn(
                    'h-full rounded-[1.9rem] border p-2 shadow-[0_20px_60px_rgba(15,23,42,0.08)]',
                    plan.featured
                      ? 'border-blue-500 bg-slate-950 text-white shadow-[0_28px_80px_rgba(37,99,235,0.22)]'
                      : 'border-white/70 bg-white/90',
                  )}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between gap-4">
                      <CardTitle
                        className={cn(
                          'text-xl font-semibold',
                          plan.featured ? 'text-white' : 'text-slate-950',
                        )}
                      >
                        {plan.name}
                      </CardTitle>
                      {plan.featured ? (
                        <Badge className="rounded-full bg-blue-500/20 px-3 py-1 text-blue-200 ring-1 ring-blue-400/30">
                          Most Popular
                        </Badge>
                      ) : null}
                    </div>
                    <div className="pt-4">
                      <p
                        className={cn(
                          'text-4xl font-bold tracking-tight',
                          plan.featured ? 'text-white' : 'text-slate-950',
                        )}
                      >
                        {plan.price}
                        <span
                          className={cn(
                            'ml-1 text-base font-medium',
                            plan.featured ? 'text-slate-300' : 'text-slate-500',
                          )}
                        >
                          {plan.cadence}
                        </span>
                      </p>
                      <p
                        className={cn(
                          'mt-3 text-base leading-7',
                          plan.featured ? 'text-slate-300' : 'text-slate-600',
                        )}
                      >
                        {plan.description}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="flex h-full flex-col">
                    <ul className="space-y-3">
                      {plan.features.map((item) => (
                        <li
                          key={item}
                          className={cn(
                            'flex items-center gap-3 text-sm',
                            plan.featured ? 'text-slate-200' : 'text-slate-700',
                          )}
                        >
                          <CheckCircle2 className="h-4 w-4 text-blue-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={cn(
                        'mt-8 h-12 rounded-full px-6 text-base font-semibold',
                        plan.featured
                          ? 'bg-blue-600 text-white hover:bg-blue-500'
                          : 'bg-slate-950 text-white hover:bg-slate-800',
                      )}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="px-6 py-18 lg:px-8">
          <SectionHeading
            eyebrow="FAQ"
            title="Answers for teams evaluating the beta"
            description="A few of the most common questions from contractors, operations leads, and design managers."
          />

          <motion.div
            className="mx-auto mt-12 max-w-4xl rounded-[2rem] border border-white/60 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <Accordion defaultValue={['accuracy']} multiple>
              {faqs.map((faq) => (
                <AccordionItem key={faq.value} value={faq.value}>
                  <AccordionTrigger className="py-5 text-base font-semibold text-slate-950 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-base leading-7 text-slate-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </section>

        <section id="beta" className="px-6 pb-24 pt-10 lg:px-8">
          <motion.div
            className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_55%,#6d28d9_100%)] p-8 text-white shadow-[0_28px_80px_rgba(37,99,235,0.28)] md:p-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-200">
                  Get Beta Access
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                  Ready to automate your schematic reviews?
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-blue-100 md:text-lg">
                  Join the early access list to see how BluePipe fits into your
                  estimating, QA, and turnover workflows.
                </p>
              </div>

              <form
                className="rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur"
                onSubmit={(event) => event.preventDefault()}
              >
                <label
                  htmlFor="email"
                  className="mb-3 block text-sm font-medium text-white"
                >
                  Work email
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    className="h-12 flex-1 rounded-full border border-white/20 bg-white px-4 text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-200/40"
                  />
                  <Button className="h-12 rounded-full bg-white px-6 text-base font-semibold text-slate-950 hover:bg-blue-50">
                    Request Invite
                  </Button>
                </div>
                <p className="mt-3 text-sm text-blue-100/85">
                  We’ll reach out with onboarding details and a live demo slot.
                </p>
              </form>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-slate-200/80 bg-white/60 px-6 py-8 backdrop-blur lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 BluePipe Schematic AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <a key={link} href="#" className="transition hover:text-slate-900">
                {link}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Clock3 className="h-4 w-4 text-blue-600" />
            2 minute average analysis time
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
