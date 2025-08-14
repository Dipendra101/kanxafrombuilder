import { Link } from "react-router-dom";
import { Bell, Menu, User, Search, Phone, MessageCircle, Moon, Sun, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ChatNotifications from "@/components/chat/ChatNotifications";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Header() {
  const { user, logout, isAuthenticated, isGuest } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gradient-to-br from-kanxa-blue to-kanxa-orange rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">KS</span>
          </div>
          <span className="text-xl font-bold text-kanxa-navy">
            Kanxa Safari
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-kanxa-navy hover:text-kanxa-blue">
                  {t('header.transportation')}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[400px]">
                    <div className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          to="/transportation"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-kanxa-light-blue to-kanxa-blue p-6 no-underline outline-none focus:shadow-md"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium text-white">
                            {t('header.transportation')}
                          </div>
                          <p className="text-sm leading-tight text-white/90">
                            {t('nav.transportation.desc')}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/buses"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">
                          {t('header.busServices')}
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {t('nav.busServices.desc')}
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/cargo"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">
                          {t('header.cargoTrucks')}
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {t('nav.cargoTrucks.desc')}
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/tours"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">
                          {t('header.customTours')}
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {t('nav.customTours.desc')}
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-kanxa-navy hover:text-kanxa-orange">
                  {t('header.construction')}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[400px]">
                    <div className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          to="/construction"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-kanxa-light-orange to-kanxa-orange p-6 no-underline outline-none focus:shadow-md"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium text-white">
                            {t('header.construction')}
                          </div>
                          <p className="text-sm leading-tight text-white/90">
                            {t('nav.construction.desc')}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/materials"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">
                          {t('header.buildingMaterials')}
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {t('nav.buildingMaterials.desc')}
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/machinery"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">
                          {t('header.machinery')}
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {t('nav.machinery.desc')}
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/garage" className={navigationMenuTriggerStyle()}>
                  {t('header.garage')}
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/about" className={navigationMenuTriggerStyle()}>
                  {t('header.about')}
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hover:bg-accent hover:text-accent-foreground"
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>

          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="hover:bg-accent hover:text-accent-foreground relative"
            title={language === 'en' ? 'नेपालीमा परिवर्तन गर्नुहोस्' : 'Switch to English'}
          >
            <Languages className="h-4 w-4" />
            <span className="absolute -bottom-1 -right-1 text-[8px] font-bold bg-primary text-primary-foreground rounded-full w-3 h-3 flex items-center justify-center">
              {language.toUpperCase()}
            </span>
          </Button>

          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Phone className="h-4 w-4" />
          </Button>

          {/* Chat Button */}
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hidden sm:flex"
          >
            <Link to="/chat">
              <MessageCircle className="h-4 w-4" />
            </Link>
          </Button>

          {/* Chat Notifications - Enhanced with general notifications */}
          <ChatNotifications />

          {/* Authentication Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                {user?.role === "admin" && (
                  <Button variant="ghost" asChild>
                    <Link to="/admin">{t('header.adminPanel')}</Link>
                  </Button>
                )}
                <span className="text-sm text-kanxa-gray">
                  {t('header.welcome')}, {user?.name?.split(" ")[0]}!
                </span>
                <Button variant="ghost" onClick={logout}>
                  {t('header.signOut')}
                </Button>
              </>
            ) : isGuest ? (
              <>
                <Badge
                  variant="outline"
                  className="text-orange-600 border-orange-300"
                >
                  {t('header.guestMode')}
                </Badge>
                <Button variant="ghost" asChild>
                  <Link to="/login">{t('header.signIn')}</Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-kanxa-blue to-kanxa-navy hover:from-kanxa-navy hover:to-kanxa-blue"
                >
                  <Link to="/signup">{t('header.getStarted')}</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-kanxa-blue to-kanxa-navy hover:from-kanxa-navy hover:to-kanxa-blue"
                >
                  <Link to="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isAuthenticated ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/bookings">My Bookings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>Sign out</DropdownMenuItem>
                </>
              ) : isGuest ? (
                <>
                  <DropdownMenuItem disabled>
                    <Badge variant="outline" className="text-orange-600">
                      Guest Mode
                    </Badge>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/login">Sign In</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/signup">Create Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    Exit Guest Mode
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/login">Sign In</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/signup">Create Account</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="grid gap-6 p-6">
                <Link to="/" className="flex items-center space-x-2">
                  <div className="h-6 w-6 bg-gradient-to-br from-kanxa-blue to-kanxa-orange rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">KS</span>
                  </div>
                  <span className="text-lg font-bold text-kanxa-navy">
                    Kanxa Safari
                  </span>
                </Link>
                <nav className="grid gap-4">
                  <Link
                    to="/transportation"
                    className="text-kanxa-navy hover:text-kanxa-blue"
                  >
                    Transportation
                  </Link>
                  <Link
                    to="/construction"
                    className="text-kanxa-navy hover:text-kanxa-orange"
                  >
                    Construction
                  </Link>
                  <Link
                    to="/garage"
                    className="text-kanxa-navy hover:text-kanxa-green"
                  >
                    Garage & Workshop
                  </Link>
                  <Link
                    to="/about"
                    className="text-kanxa-navy hover:text-kanxa-blue"
                  >
                    About
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
