 export const translations = {
  en: {
    // Navbar
    siteName: 'EnjeraPressList.Com',
    tagline: 'Free Rental Listings',
    myListings: 'My Listings',
    addListing: '+ Add Listing',
    signIn: 'Sign in',
    register: 'Register',

    // Hero
    badge: '100% Free · No Hidden Fees',
    heroTitle: 'Find or List Rentals & Properties for Sale AnyWhere in the World',
    heroSubtitle: 'Browse rentals, list your property or post it for sale — connect directly with owners, no agents, no fees.',
    searchPlaceholder: 'Search city, neighborhood or title...',
    allTypes: 'All types',
    anyPrice: 'Any price',
    search: 'Search',
    listFree: '+ List your property for free →',

    // Listings
    availableRentals: 'Available Rentals',
    listingsFound: 'listings found',
    listingFound: 'listing found',
    addYourListing: '+ Add Your Listing',
    noListingsFound: 'No listings found',
    tryDifferent: 'Try a different search or be the first to list',
    listPropertyFree: 'List Your Property Free',
    viewDetails: 'View Details',

    // Footer
    footerTagline: 'Free rental listings · No fees · Connect directly with landlords',

    // Property types
    apartment: 'Apartment',
    house: 'House',
    studio: 'Studio',
    condo: 'Condo',
    townhouse: 'Townhouse',

    // Price filters
    under1500: 'Under $1,500',
    under2500: 'Under $2,500',
    under3500: 'Under $3,500',
    under5000: 'Under $5,000',
  },

  am: {
    // Navbar
    siteName: 'EnjeraPressList.Com',
    tagline: 'ይህ እንጀራ ፕረስ ሊስቲንግ ነው',
    myListings: 'የእኔ ሊስቶች',
    addListing: '+ አዲስ ሊስቲንግ ያስገቡ',
    signIn: 'ወደ አካውንትዎ ይግቡ',
    register: 'ነፃ አካውንት ይክፈቱ',

    // Hero
    badge: 'ሙሉ በሙሉ በነፃ ',
    heroTitle: 'በመላው አለም ለኪራይ ወይም ለሽያጭ የሚሆኑ ቤቶችን ይፈልጉ ወይም ሊስት ያስገቡ',
    heroSubtitle: 'የሚከራይ ቤት የፈልጉ ፣ ቤትዎን ያከራዩ — ቀጥታ ከባለቤቶች ጋር ይገናኙ።',
    searchPlaceholder: 'ከተማ፣ ሰፈር ወይም ቀበሌ ይፈልጉ...',
    allTypes: 'ሁሉም ዓይነቶች',
    anyPrice: 'ማንኛውም ዋጋ',
    search: 'ፈልግ',
    listFree: '+ ሊስት ያስገቡ →',

    // Listings
    availableRentals: 'የሚክራዩ ዎይም የሚሸጡ ቤቶች',
    listingsFound: 'ዝርዝሮች ተገኝተዋል',
    listingFound: 'ዝርዝር ተገኝቷል',
    addYourListing: '+ ሊስት ያድርጉ',
    noListingsFound: 'ምንም አልተገኘም',
    tryDifferent: 'ሌላ ፍለጋ ይሞክሩ ወይም የመጀመሪያ ሊስት ያስገቡ',
    listPropertyFree: 'ቤትዎን በነፃ ሊስት ያድርጉ',
    viewDetails: 'ተጨማሪ መረጃ',

    // Footer
    footerTagline: 'በነፃ የሚከራይ ቤት የፈልጉ ፣ ቤትዎን ያከራዩ — ቀጥታ ከባለቤቶች ጋር ይገናኙ፣',

    // Property types
    apartment: 'አፓርትመንት',
    house: 'ቤት',
    studio: 'ስቱዲዮ',
    condo: 'ኮንዶ',
    townhouse: 'ታውንሃውስ',

    // Price filters
    under1500: 'ከ$1,500 በታች',
    under2500: 'ከ$2,500 በታች',
    under3500: 'ከ$3,500 በታች',
    under5000: 'ከ$5,000 በታች',
  }
}
export function showPrice(listing) {
  if (!listing) return ''
  const currency = listing.currency || 'USD'
  if (currency === 'Contact') return 'Contact for price'
  if (currency === 'ETB') return `${listing.price?.toLocaleString()} ETB/mo`
  return `$${listing.price?.toLocaleString()}/mo`
}




