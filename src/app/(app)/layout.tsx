'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Apple,
  Award,
  Bell,
  Home,
  LogOut,
  PanelLeft,
  Settings,
  User,
  Loader2,
} from 'lucide-react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useUser, useAuth } from '@/firebase';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/diet', icon: Apple, label: 'Diet Plan' },
  { href: '/rewards', icon: Award, label: 'Rewards' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const handleLogout = () => {
    auth.signOut();
    router.push('/');
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-sidebar sm:flex">
        <nav className="flex flex-col h-full">
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold font-headline">
              <Icons.logo className="h-6 w-6 text-sidebar-foreground" />
              <span className="text-sidebar-foreground">HealthStreak</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    pathname === item.href && 'bg-sidebar-accent text-sidebar-accent-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4 border-t">
              <div className="flex items-center gap-3">
                 <Avatar className="h-9 w-9">
                  {user?.photoURL ? <AvatarImage src={user.photoURL} alt="User Avatar" /> : userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" />}
                  <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-sidebar-foreground">{user?.displayName || user?.email || 'Guest User'}</p>
                  <p className="text-xs text-sidebar-foreground/70">Beginner</p>
                </div>
              </div>
          </div>
        </nav>
      </aside>

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-60">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs bg-sidebar text-sidebar-foreground border-r-0">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="#"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <Icons.logo className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">HealthStreak</span>
                </Link>
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="relative ml-auto flex-1 md:grow-0">
            {/* Can add a search bar here if needed */}
          </div>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
                <Avatar className="h-8 w-8">
                   {user?.photoURL ? <AvatarImage src={user.photoURL} alt="User Avatar" /> : userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" />}
                  <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/profile" className='w-full flex items-center'><Settings className="mr-2 h-4 w-4" />Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                 <div className='w-full flex items-center'><LogOut className="mr-2 h-4 w-4" />Logout</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
