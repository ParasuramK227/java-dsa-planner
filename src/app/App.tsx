import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/app/AppShell'
import { ProtectedRoute } from '@/app/ProtectedRoute'
import { LoginPage } from '@/pages/LoginPage'
import { AuthCallbackPage } from '@/pages/AuthCallbackPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { PlannerPage } from '@/pages/PlannerPage'
import { RoadmapPage } from '@/pages/RoadmapPage'
import { ProblemsPage } from '@/pages/ProblemsPage'
import { WeeklyReviewPage } from '@/pages/WeeklyReviewPage'
import { ActivityPage } from '@/pages/ActivityPage'
import { AchievementsPage } from '@/pages/AchievementsPage'
import { ProfilesPage } from '@/pages/ProfilesPage'
import { SettingsPage } from '@/pages/SettingsPage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="planner" element={<PlannerPage />} />
          <Route path="roadmap" element={<RoadmapPage />} />
          <Route path="problems" element={<ProblemsPage />} />
          <Route path="weekly-review" element={<WeeklyReviewPage />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="achievements" element={<AchievementsPage />} />
          <Route path="profiles" element={<ProfilesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
