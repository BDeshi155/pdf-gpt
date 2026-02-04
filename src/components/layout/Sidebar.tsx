'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  FolderOpen,
  Upload,
  MessageSquare,
  Settings,
  CreditCard,
  Users,
  Store,
  Tag,
  Shield,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types';
import { isAdmin, isSuperAdmin } from '@/lib/auth';

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const userRole = session?.user?.role || UserRole.FREE_USER;
  const isUserAdmin = isAdmin(userRole, session?.user?.isAdmin || false);
  const isUserSuperAdmin = isSuperAdmin(userRole);

  const mainLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/library', label: 'My Library', icon: FolderOpen },
    { href: '/upload', label: 'Upload', icon: Upload },
    { href: '/chat', label: 'AI Chat', icon: MessageSquare },
  ];

  const accountLinks = [
    { href: '/settings', label: 'Settings', icon: Settings },
    { href: '/billing', label: 'Billing', icon: CreditCard },
  ];

  const adminLinks = [
    { href: '/admin/shop', label: 'PDF Shop', icon: Store },
    { href: '/admin/promotions', label: 'Promotions', icon: Tag },
    { href: '/admin/marketing', label: 'Marketing', icon: Users },
  ];

  const superAdminLinks = [
    { href: '/admin/users', label: 'User Management', icon: Users },
    { href: '/admin/admins', label: 'Admin Management', icon: Shield },
    { href: '/admin/super', label: 'System Settings', icon: Settings },
  ];

  const NavLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: any }) => {
    const isActive = pathname === href || pathname.startsWith(href + '/');
    
    return (
      <Link
        href={href}
        className={cn('sidebar-link', isActive && 'active')}
        title={collapsed ? label : undefined}
      >
        <Icon size={20} />
        {!collapsed && <span>{label}</span>}
      </Link>
    );
  };

  return (
    <aside className={cn('sidebar transition-all duration-300', collapsed ? 'w-16' : 'w-64')}>
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        {!collapsed && (
          <Link href="/dashboard" className="text-xl font-bold font-display gradient-text">
            PDF-GPT
          </Link>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-white/5 text-dark-400 hover:text-white"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="mb-6">
          {!collapsed && (
            <p className="px-4 text-xs font-semibold text-dark-500 uppercase tracking-wider mb-2">
              Main
            </p>
          )}
          {mainLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </div>

        <div className="mb-6">
          {!collapsed && (
            <p className="px-4 text-xs font-semibold text-dark-500 uppercase tracking-wider mb-2">
              Account
            </p>
          )}
          {accountLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </div>

        {isUserAdmin && (
          <div className="mb-6">
            {!collapsed && (
              <p className="px-4 text-xs font-semibold text-dark-500 uppercase tracking-wider mb-2">
                Admin
              </p>
            )}
            {adminLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </div>
        )}

        {isUserSuperAdmin && (
          <div className="mb-6">
            {!collapsed && (
              <p className="px-4 text-xs font-semibold text-dark-500 uppercase tracking-wider mb-2">
                Super Admin
              </p>
            )}
            {superAdminLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-white/10">
        {session?.user && !collapsed && (
          <div className="flex items-center gap-3">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || 'User'}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-sm font-semibold">
                {session.user.name?.[0] || session.user.email?.[0]?.toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {session.user.name || 'User'}
              </p>
              <p className="text-xs text-dark-400 truncate">{session.user.email}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
