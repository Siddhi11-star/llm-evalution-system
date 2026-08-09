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
import Pricing from '../pages/Pricing'
import Docs from '../pages/Docs'
import Login from '../pages/Login'

export const router = createBrowserRouter([
  { path: '/', Component: LandingPage },
  { path: '/pricing', Component: Pricing },
  { path: '/docs', Component: Docs },
  { path: '/login', Component: Login },
  { path: '/signup', element: <Login mode="signup" /> },
  {
    path: '/dashboard',
    Component: AppShell,
    children: [
      { index: true, Component: Dashboard },
      { path: 'evaluations', Component: Evaluations },
      { path: 'evaluations/:id', Component: EvalDetail },
      { path: 'compare', Component: ModelComparison },
      { path: 'advisor', Component: AdvisorAgentPage },
      { path: 'judges', Component: JudgeConfig },
      { path: 'settings', Component: Settings },
    ],
  },
])
