import { createBrowserRouter } from 'react-router'
import AppShell from '../components/AppShell'
import LandingPage from '../pages/Landing'
import Dashboard from '../pages/Dashboard'
import Evaluations from '../pages/Evaluations'
import Settings from '../pages/Settings'
import EvalDetail from '../pages/EvalDetail'
import ModelComparison from '../pages/ModelComparison'
import AdvisorAgentPage from '../pages/AdvisorAgent'
import JudgeConfig from '../pages/JudgeConfig'
import AgentSwarm from '../pages/AgentSwarm'
import Pricing from '../pages/Pricing'
import Docs from '../pages/Docs'
import Login from '../pages/Login'
import Chat from '../pages/Chat'
import Onboarding from '../pages/Onboarding'

export const router = createBrowserRouter([
  { path: '/', Component: LandingPage },
  { path: '/pricing', Component: Pricing },
  { path: '/docs', Component: Docs },
  { path: '/login', Component: Login },
  { path: '/signup', element: <Login mode="signup" /> },
  { path: '/guest-chat', Component: Chat },
  { path: '/onboarding', Component: Onboarding },
  { path: '/onboarding/:step', Component: Onboarding },
  {
    path: '/dashboard',
    Component: AppShell,
    children: [
      { index: true, Component: Dashboard },
      { path: 'chat', Component: Chat },
      { path: 'evaluations', Component: Evaluations },
      { path: 'evaluations/:id', Component: EvalDetail },
      { path: 'compare', Component: ModelComparison },
      { path: 'advisor', Component: AdvisorAgentPage },
      { path: 'judges', Component: JudgeConfig },
      { path: 'agent-swarm', Component: AgentSwarm },
      { path: 'settings', Component: Settings },
    ],
  },
])
