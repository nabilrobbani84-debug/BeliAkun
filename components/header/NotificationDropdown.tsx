'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle2, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguage } from '@/components/providers/language-provider';

interface NotificationDropdownProps {
  userName?: string;
}

export function NotificationDropdown({ userName }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (!userName) return;

    const fetchNotifications = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (!error && data) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.is_read).length);
      }
    };

    fetchNotifications();

    // Set up realtime subscription
    const supabase = createClient();
    let subscription: any;
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        subscription = supabase
          .channel('public:notifications')
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
            (payload) => {
              setNotifications(prev => [payload.new, ...prev].slice(0, 5));
              setUnreadCount(prev => prev + 1);
            }
          )
          .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
            (payload) => {
              setNotifications(prev => prev.map(n => n.id === payload.new.id ? payload.new : n));
              if (payload.new.is_read && payload.old.is_read === false) {
                setUnreadCount(prev => Math.max(0, prev - 1));
              }
            }
          )
          .subscribe();
      }
    });

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [userName]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const getStatusInfo = (type: string) => {
    switch (type) {
      case 'order_success':
        return { icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />, color: 'bg-emerald-50 border-emerald-200' };
      case 'alert':
      case 'order_failed':
        return { icon: <AlertCircle className="w-4 h-4 text-rose-500" />, color: 'bg-rose-50 border-rose-200' };
      default:
        return { icon: <Info className="w-4 h-4 text-blue-500" />, color: 'bg-blue-50 border-blue-200' };
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const markAllAsRead = async () => {
    if (unreadCount === 0) return;
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));

    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="icon"
        size="icon-sm"
        onClick={handleToggle}
        className="touch-target min-h-[38px] min-w-[38px] sm:min-h-[40px] sm:min-w-[40px] relative"
        title="Notifikasi"
        aria-label="Notifikasi"
      >
        <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700 dark:text-slate-300" strokeWidth={2.5} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-[var(--card)]"></span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[var(--card)] border-2 border-[var(--border)] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-50 overflow-hidden cartoon-card">
          <div className="p-3 border-b-2 border-[var(--border)] bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
            <h3 className="font-black text-sm text-[var(--foreground)]">Notifikasi</h3>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 cursor-pointer hover:underline" onClick={markAllAsRead}>
              {t.markAllRead}
            </span>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p className="text-sm font-bold">{t.notificationsEmpty}</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((notif) => {
                  const info = getStatusInfo(notif.type);
                  return (
                    <div key={notif.id} className={`block border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${!notif.is_read ? 'bg-slate-50/50 dark:bg-slate-800/20' : ''}`}>
                      <div className={`p-3 border-l-4 ${info.color} flex gap-3 items-start`}>
                        <div className="shrink-0 mt-0.5">
                          {info.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-extrabold text-[var(--foreground)] truncate ${!notif.is_read ? 'font-black' : ''}`}>
                            {notif.title}
                          </p>
                          <p className="text-[11px] font-medium text-[var(--muted-foreground)] line-clamp-2 mt-0.5">
                            {notif.message}
                          </p>
                          <p className="text-[9px] font-bold text-slate-400 mt-1">
                            {new Date(notif.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
