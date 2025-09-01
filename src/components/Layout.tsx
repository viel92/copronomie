'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { FEATURES, hasPermission } from '@/config/features';
import { 
  Home, 
  FileText, 
  Building, 
  Users, 
  BarChart3,
  Zap,
  Search,
  Bell,
  Settings,
  User,
  ChevronDown,
  Vote,
  Brain,
  Target,
  Presentation,
  Camera,
  MessageCircle,
  Megaphone,
  BarChart3 as Analytics
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const authState = useAuth();
  const { currentCopro, userCopros, switchCopro, user, isLoading } = authState;
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [showCoproSelector, setShowCoproSelector] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Consultations', href: '/consultations', icon: FileText },
    { name: 'Comparateur IA', href: '/comparator-v2', icon: Zap },
    { name: 'Contrats', href: '/contracts', icon: Building },
    { name: 'Entreprises', href: '/companies', icon: Users },
    { name: 'Rapports', href: '/reports', icon: BarChart3 },
    // Nouvelles features conditionnelles
    ...(FEATURES.BLOCKCHAIN_VOTES && user && hasPermission(user.role, 'BLOCKCHAIN_VOTES') ? [{ name: 'Votes CS', href: '/votes', icon: Vote }] : []),
    ...(FEATURES.AI_NEGOTIATION && user && hasPermission(user.role, 'AI_NEGOTIATION') ? [{ name: 'Négociation IA', href: '/negotiation', icon: Brain }] : []),
    ...(FEATURES.SMART_MATCHING && user && hasPermission(user.role, 'SMART_MATCHING') ? [{ name: 'Matching IA', href: '/matching', icon: Target }] : []),
    ...(FEATURES.AG_MODE && user && hasPermission(user.role, 'AG_MODE') ? [{ name: 'Mode AG', href: '/ag-presentation', icon: Presentation }] : []),
    ...(FEATURES.PHOTO_ANALYSIS && user && hasPermission(user.role, 'PHOTO_ANALYSIS') ? [{ name: 'Photos IA', href: '/chantier-photos', icon: Camera }] : []),
    ...(FEATURES.INVERSE_MARKETPLACE && user && hasPermission(user.role, 'INVERSE_MARKETPLACE') ? [{ name: 'Place de marché', href: '/marketplace', icon: Megaphone }] : []),
    ...(FEATURES.PREDICTIVE_ANALYTICS && user && hasPermission(user.role, 'PREDICTIVE_ANALYTICS') ? [{ name: 'Analytics IA', href: '/analytics', icon: Analytics }] : []),
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 z-50 flex w-72 flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-slate-200">
          <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-bold text-slate-900">COPRONOMIE</span>
            </div>
          </div>
          
          {/* Sélecteur de copropriété */}
          {FEATURES.MULTI_TENANT && userCopros && userCopros.length > 1 && (
            <div className="px-6">
              <div className="relative">
                <button
                  onClick={() => setShowCoproSelector(!showCoproSelector)}
                  className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="text-left">
                    <p className="font-medium text-slate-900 text-sm">{currentCopro?.name}</p>
                    <p className="text-xs text-slate-500">{currentCopro?.settings?.nombre_lots || 0} lots</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>
                
                {showCoproSelector && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                    {userCopros.map(copro => (
                      <button
                        key={copro.id}
                        onClick={() => {
                          switchCopro(copro.id);
                          setShowCoproSelector(false);
                        }}
                        className={`w-full text-left p-3 hover:bg-slate-50 transition-colors ${
                          currentCopro?.id === copro.id ? 'bg-blue-50 border-l-2 border-blue-500' : ''
                        }`}
                      >
                        <p className="font-medium text-slate-900 text-sm">{copro.name}</p>
                        <p className="text-xs text-slate-500">{copro.settings?.nombre_lots || 0} lots • {copro.address}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          <nav className="flex flex-1 flex-col px-6 pb-4">
            <ul role="list" className="flex flex-1 flex-col gap-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || 
                  (item.href !== '/dashboard' && pathname.startsWith(item.href));
                
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`
                        group flex gap-x-3 rounded-lg p-3 text-sm font-semibold leading-6 transition-all duration-200
                        ${isActive 
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                          : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'
                        }
                      `}
                    >
                      <Icon 
                        className={`h-5 w-5 shrink-0 transition-colors ${
                          isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'
                        }`} 
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
            
            {/* Quick stats in sidebar */}
            <div className="mt-auto pt-4 border-t border-slate-200">
              <div className="mb-3 text-xs text-slate-500 font-medium">
                {currentCopro?.name}
              </div>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Lots</span>
                  <span className="font-medium">{currentCopro?.settings?.nombre_lots || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Budget annuel</span>
                  <span className="font-medium">{currentCopro?.settings?.budget_annuel?.toLocaleString() || 0}€</span>
                </div>
                <div className="flex justify-between">
                  <span>Consultations actives</span>
                  <span className="font-medium text-blue-600">12</span>
                </div>
                <div className="flex justify-between">
                  <span>Prochaine AG</span>
                  <span className="font-medium text-purple-600">
                    {currentCopro?.settings?.prochaine_ag ? new Date(currentCopro.settings.prochaine_ag).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) : '--'}
                  </span>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 bg-white px-4 shadow-sm">
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1 items-center">
              <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-slate-400 pl-3" />
              <input
                className="block h-full w-full border-0 py-0 pl-11 pr-0 text-slate-900 placeholder:text-slate-400 focus:ring-0 text-sm"
                placeholder="Rechercher..."
                type="search"
              />
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <button className="p-2.5 text-slate-400 hover:text-slate-500 transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200" />
              <div className="flex items-center gap-x-3">
                <button className="p-2.5 text-slate-400 hover:text-slate-500 transition-colors">
                  <Settings className="h-5 w-5" />
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-x-2 text-sm font-semibold text-slate-900 hover:text-blue-700 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span>{user?.user_metadata?.first_name} {user?.user_metadata?.last_name}</span>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-medium text-slate-900">{user?.user_metadata?.first_name} {user?.user_metadata?.last_name}</p>
                        <p className="text-xs text-slate-500 capitalize">{authState.profile?.role?.replace('_', ' ') || 'Utilisateur'}</p>
                      </div>
                      <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        Mon profil
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        Paramètres
                      </button>
                      {userCopros && userCopros.length > 1 && (
                        <button 
                          onClick={() => setShowCoproSelector(!showCoproSelector)}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          Changer de copropriété
                        </button>
                      )}
                      <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}