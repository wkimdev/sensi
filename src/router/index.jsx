import { createBrowserRouter } from 'react-router'
import RootLayout from '@/layouts/RootLayout'
import AuthLayout from '@/layouts/AuthLayout'
import HomePage from '@/pages/HomePage'
import CommunityListPage from '@/pages/community/CommunityListPage'
import CommunityNewPage from '@/pages/community/CommunityNewPage'
import CommunityDetailPage from '@/pages/community/CommunityDetailPage'
import BooksPage from '@/pages/books/BooksPage'
import QuotesPage from '@/pages/quotes/QuotesPage'
import MyPage from '@/pages/mypage/MyPage'
import LoginPage from '@/pages/auth/LoginPage'
import NotFoundPage from '@/pages/NotFoundPage'
import ErrorPage from '@/pages/ErrorPage'
import ProtectedRoute from '@/components/common/ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'community',
        element: <ProtectedRoute><CommunityListPage /></ProtectedRoute>,
      },
      {
        path: 'community/new',
        element: <ProtectedRoute><CommunityNewPage /></ProtectedRoute>,
      },
      {
        path: 'community/:id',
        element: <ProtectedRoute><CommunityDetailPage /></ProtectedRoute>,
      },
      {
        path: 'books',
        element: <ProtectedRoute><BooksPage /></ProtectedRoute>,
      },
      {
        path: 'quotes',
        element: <ProtectedRoute><QuotesPage /></ProtectedRoute>,
      },
      {
        path: 'mypage',
        element: <ProtectedRoute><MyPage /></ProtectedRoute>,
      },
    ],
  },
  {
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: 'login', element: <LoginPage /> },
    ],
  },
])
