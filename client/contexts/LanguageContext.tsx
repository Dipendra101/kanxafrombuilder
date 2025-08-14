import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ne';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translations dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    'header.transportation': 'Transportation',
    'header.construction': 'Construction',
    'header.garage': 'Garage & Workshop',
    'header.about': 'About',
    'header.busServices': 'Bus Services',
    'header.cargoTrucks': 'Cargo Trucks',
    'header.customTours': 'Custom Tours',
    'header.buildingMaterials': 'Building Materials',
    'header.machinery': 'Machinery',
    'header.signIn': 'Sign In',
    'header.getStarted': 'Get Started',
    'header.profile': 'Profile',
    'header.myBookings': 'My Bookings',
    'header.myOrders': 'My Orders',
    'header.settings': 'Settings',
    'header.signOut': 'Sign Out',
    'header.guestMode': 'Guest Mode',
    'header.adminPanel': 'Admin Panel',
    'header.welcome': 'Welcome',
    'header.createAccount': 'Create Account',
    'header.exitGuestMode': 'Exit Guest Mode',
    
    // Transportation descriptions
    'nav.transportation.desc': 'Book buses, cargo trucks, and custom tours',
    'nav.busServices.desc': 'Daily and nightly bus routes',
    'nav.cargoTrucks.desc': 'Freight and logistics services',
    'nav.customTours.desc': 'Reserved tour services',
    'nav.construction.desc': 'Building materials and machinery',
    'nav.buildingMaterials.desc': 'Cement, blocks, pipes, and more',
    'nav.machinery.desc': 'JCBs, mixers, and tractors',
    
    // Common
    'common.bookNow': 'Book Now',
    'common.learnMore': 'Learn More',
    'common.getQuote': 'Get Quote',
    'common.contactUs': 'Contact Us',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.close': 'Close',
    
    // Home page
    'home.hero.title': 'Reliable Transportation & Construction Services in Nepal',
    'home.hero.subtitle': 'Your trusted partner for transportation, construction materials, and professional services across Nepal',
    'home.services.title': 'Our Services',
    'home.services.subtitle': 'Comprehensive solutions for all your transportation and construction needs',
    'home.bookNow': 'Book Now',
    'home.exploreServices': 'Explore Services',
    'home.whyChooseUs': 'Why Choose Kanxa Safari?',
    'home.professionalService': 'Professional Service',
    'home.reliableTransport': 'Reliable Transportation',
    'home.competitivePrices': 'Competitive Prices',
    'home.customerSupport': '24/7 Customer Support',
  },
  ne: {
    // Header (Nepali translations)
    'header.transportation': 'यातायात',
    'header.construction': 'निर्माण',
    'header.garage': 'ग्यारेज र कार्यशाला',
    'header.about': 'हाम्रो बारे',
    'header.busServices': 'बस सेवा',
    'header.cargoTrucks': 'कार्गो ट्रक',
    'header.customTours': 'कस्टम टुर',
    'header.buildingMaterials': 'निर्माण सामग्री',
    'header.machinery': 'मेसिनरी',
    'header.signIn': 'साइन इन',
    'header.getStarted': 'सुरु गर्नुहोस्',
    'header.profile': 'प्रोफाइल',
    'header.myBookings': 'मेरो बुकिङ',
    'header.myOrders': 'मेरो अर्डर',
    'header.settings': 'सेटिङ',
    'header.signOut': 'साइन आउट',
    'header.guestMode': 'गेस्ट मोड',
    'header.adminPanel': 'एडमिन प्यानल',
    'header.welcome': 'स्वागत',
    'header.createAccount': 'खाता बनाउनुहोस्',
    'header.exitGuestMode': 'ग���स्ट मोडबाट बाहिर निस्कनुहोस्',
    
    // Transportation descriptions (Nepali)
    'nav.transportation.desc': 'बस, कार्गो ट्रक र कस्टम टुर बुक गर्नुहोस्',
    'nav.busServices.desc': 'दैनिक र रात्रिकालीन बस मार्गहरू',
    'nav.cargoTrucks.desc': 'मालवाहक र रसद सेवाहरू',
    'nav.customTours.desc': 'आरक्षित टुर सेवाहरू',
    'nav.construction.desc': 'निर्माण सामग्री र मेसिनरी',
    'nav.buildingMaterials.desc': 'सिमेन्ट, ब्लक, पाइप र अन्य',
    'nav.machinery.desc': 'जेसीबी, मिक्सर र ट्र्याक्टर',
    
    // Common (Nepali)
    'common.bookNow': 'अहिले बुक गर्नुहोस्',
    'common.learnMore': 'थप जान्नुहोस्',
    'common.getQuote': 'दर प्राप्त गर्नुहोस्',
    'common.contactUs': 'सम्पर्क गर्नुहोस्',
    'common.search': 'खोज्नुहोस्',
    'common.filter': 'फिल्टर',
    'common.loading': '���ोड हुँदै...',
    'common.error': 'त्रुटि',
    'common.success': 'सफल',
    'common.cancel': 'रद्द गर्नुहोस्',
    'common.save': 'सेभ गर्नुहोस्',
    'common.edit': 'सम्पादन',
    'common.delete': 'मेटाउनुहोस्',
    'common.view': 'हेर्नुहोस्',
    'common.close': 'बन्द गर्नुहोस्',
    
    // Home page (Nepali)
    'home.hero.title': 'नेपालमा भरपर्दो यातायात र निर्माण सेवाहरू',
    'home.hero.subtitle': 'नेपालभरि यातायात, निर्माण सामग्री र व्यावसायिक सेवाहरूको लागि तपाईंको भरपर्दो साझेदार',
    'home.services.title': 'हाम्रा सेवाहरू',
    'home.services.subtitle': 'तपाईंका सबै यातायात र निर्माण आवश्यकताहरूको लागि व्यापक समाधानहरू',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Check localStorage first
    const savedLanguage = localStorage.getItem('kanxa-language');
    if (savedLanguage === 'en' || savedLanguage === 'ne') {
      return savedLanguage;
    }
    
    // Default to English
    return 'en';
  });

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('kanxa-language', language);
    
    // Update document language attribute
    document.documentElement.lang = language === 'ne' ? 'ne-NP' : 'en-US';
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prevLanguage => prevLanguage === 'en' ? 'ne' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const value: LanguageContextType = {
    language,
    toggleLanguage,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
