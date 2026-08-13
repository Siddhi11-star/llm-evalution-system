export const LANDING_NAV = [
  { label: 'Chatbot', to: '/dashboard/chat' },
  { label: 'Judge', to: '/dashboard/judges' },
  { label: 'Advisor Agent', to: '/dashboard/advisor' },
  { label: 'Model Used', to: '/dashboard/compare' },
  { label: 'Agent Swarm', to: '/dashboard/agent-swarm' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Pricing', to: '/pricing' },
] as const

export const FOOTER_LINK_ROUTES: Record<string, string> = {
  Evaluations: '/dashboard/evaluations',
  'Advisor Agent': '/dashboard/advisor',
  'Rubric Scoring': '/dashboard/judges',
  'Model Comparison': '/dashboard/compare',
  Documentation: '/docs',
  'API Reference': '/docs',
  Chatbot: '/dashboard/chat',
}
