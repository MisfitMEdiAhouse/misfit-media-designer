export type Lead = {
  id: string;
  business: string;
  category: string;
  city: string;
  email: string;
  phone?: string;
  website: string;
  sourceUrl: string;
  score: number;
  status: 'NEW' | 'READY' | 'DRAFTED' | 'SENT' | 'REPLIED' | 'BOOKED' | 'DO_NOT_CONTACT';
  reason: string;
};

export const leads: Lead[] = [
  {
    id: 'pmp-utah',
    business: 'Property Management Pros of Utah',
    category: 'Property Management',
    city: 'Liberty / Ogden service area',
    email: 'rex@pmp-utah.com',
    phone: '801-317-8185',
    website: 'https://www.pmp-utah.com',
    sourceUrl: 'https://www.pmp-utah.com/contact',
    score: 98,
    status: 'READY',
    reason: 'Manages Ogden-area rentals and publicly invites vendor contacts. High repeat cleanout potential from move-outs, turnovers, and owner maintenance.'
  },
  {
    id: 'rcpm-utah',
    business: 'RCPM Utah',
    category: 'Property Management',
    city: 'Ogden / Northern Utah',
    email: 'manager@rcpmutah.com',
    phone: '801-389-4563',
    website: 'https://www.rcpmutah.com',
    sourceUrl: 'https://www.rcpmutah.com/',
    score: 97,
    status: 'READY',
    reason: 'Family-operated Northern Utah manager handling apartments, single-family homes, commercial properties, maintenance, and turnovers.'
  },
  {
    id: 'wheeler-management',
    business: 'Wheeler & Associates Property Management',
    category: 'Property Management',
    city: 'South Ogden',
    email: 'Office@wheelermanagement.com',
    phone: '801-394-9493',
    website: 'https://www.wheelermanagement.com',
    sourceUrl: 'https://www.wheelermanagement.com/contact',
    score: 97,
    status: 'READY',
    reason: 'Local property manager with a vendor contact lane. Strong fit for tenant move-outs, abandoned items, and rental turns.'
  },
  {
    id: 'kier-management',
    business: 'Kier Property Management',
    category: 'Property Management',
    city: 'South Ogden',
    email: 'info@kiermanagement.com',
    phone: '801-621-3390',
    website: 'https://www.kiermanagement.com',
    sourceUrl: 'https://www.kiermanagement.com/contact-us',
    score: 96,
    status: 'READY',
    reason: 'Large portfolio with approximately 1,500 residential units plus commercial space across multiple states. High-value vendor account if landed.'
  },
  {
    id: 'brick-property',
    business: 'Brick Property Management',
    category: 'Property Management',
    city: 'Ogden',
    email: 'brickrealtyco@showinghero.com',
    phone: '801-421-9671',
    website: 'https://www.bpmutah.com',
    sourceUrl: 'https://www.bpmutah.com/',
    score: 94,
    status: 'READY',
    reason: 'Residential and commercial management with maintenance services in Northern Utah. Junk hauling can slot into turnover and exterior cleanup.'
  },
  {
    id: 'iutahpm',
    business: 'iUTAH Property Management',
    category: 'Property Management',
    city: 'Ogden',
    email: '411@iUtahpm.com',
    website: 'https://www.iutahpm.com',
    sourceUrl: 'https://www.iutahpm.com/',
    score: 94,
    status: 'READY',
    reason: 'Northern Utah rental manager with maintenance, inspections, vacancies, and owner services. Good recurring cleanout prospect.'
  },
  {
    id: 'ogden-property-manager',
    business: 'Property Manager En Ogden Utah',
    category: 'Property Management',
    city: 'Ogden',
    email: 'marilyn.propertymanager@gmail.com',
    phone: '801-690-9451',
    website: 'https://www.pmeogdenutah.com',
    sourceUrl: 'https://www.pmeogdenutah.com/',
    score: 91,
    status: 'READY',
    reason: 'Local property manager handling tenant communication, inspections, maintenance, and rental operations. Direct decision-maker style contact.'
  },
  {
    id: 'cornerstone-ogden',
    business: 'Cornerstone Real Estate Professionals — Ogden',
    category: 'Real Estate Brokerage',
    city: 'Ogden',
    email: 'ogden@utahcornerstone.com',
    phone: '801-823-4598',
    website: 'https://doyouknowcornerstone.com',
    sourceUrl: 'https://doyouknowcornerstone.com/',
    score: 90,
    status: 'READY',
    reason: 'Northern Utah brokerage with an Ogden office. Agents routinely encounter pre-listing cleanouts, move-outs, inherited properties, and seller prep.'
  },
  {
    id: 'mtn-buff',
    business: 'MTN BUFF Real Estate',
    category: 'Real Estate Brokerage',
    city: 'Ogden',
    email: 'Contact@MTNBUFF.com',
    phone: '385-600-6005',
    website: 'https://www.mtnbuffrealestate.com',
    sourceUrl: 'https://www.mtnbuffrealestate.com/',
    score: 90,
    status: 'READY',
    reason: 'Investor-heavy Northern Utah real estate team with flipping and contractor experience. Strong source for seller prep and investment-property cleanouts.'
  },
  {
    id: 'mtn-buff-broker',
    business: 'Paden Anderson — MTN BUFF Broker',
    category: 'Broker / Investor',
    city: 'Ogden',
    email: 'Paden@MTNBuff.com',
    phone: '385-600-5733',
    website: 'https://www.mtnbuffrealestate.com',
    sourceUrl: 'https://www.mtnbuffrealestate.com/team',
    score: 92,
    status: 'READY',
    reason: 'Broker, investor, flipper, and licensed GC. Direct fit for distressed-property cleanup and pre-renovation hauling.'
  },
  {
    id: 'hive-maegan',
    business: 'Maegan Lovelady — The Hive Realty Group',
    category: 'Real Estate Agent',
    city: 'Ogden',
    email: 'maeganlovelady@gmail.com',
    phone: '801-627-8195',
    website: 'https://www.thehiverealtygroup.com',
    sourceUrl: 'https://www.wcr.org/profile/maegan-lovelady/',
    score: 86,
    status: 'READY',
    reason: 'Local Ogden REALTOR contact. Individual agents are useful referral nodes for sellers, inherited homes, and move-out cleanouts.'
  },
  {
    id: 'hive-michelle',
    business: 'Michelle Williams — The Hive Realty Group',
    category: 'Real Estate Agent',
    city: 'Ogden',
    email: 'michelle@liveplayutah.com',
    phone: '801-920-2851',
    website: 'https://www.thehiverealtygroup.com',
    sourceUrl: 'https://www.zillow.com/profile/liveplayutahrealtor',
    score: 87,
    status: 'READY',
    reason: 'Experienced Ogden agent with broad Weber-area coverage and high transaction history. Strong seller-prep referral fit.'
  },
  {
    id: 'aubrey-apartments',
    business: 'Aubrey Apartments',
    category: 'Apartment Community',
    city: 'Ogden',
    email: 'aubreyapts-w@m.knck.io',
    phone: '435-419-5381',
    website: 'https://apartmentsinogden.com',
    sourceUrl: 'https://apartmentsinogden.com/contact/',
    score: 84,
    status: 'READY',
    reason: 'Direct apartment management contact. Turnovers and abandoned tenant items can create recurring haul opportunities.'
  },
  {
    id: 'mcgregor-unphc',
    business: 'McGregor Apartments / Utah Non-Profit Housing Corporation',
    category: 'Apartment / Housing Operator',
    city: 'Ogden',
    email: 'mcgregor@unphc.org',
    phone: '385-626-7674',
    website: 'https://unphc.org',
    sourceUrl: 'https://unphc.org/housing/mcgregor-apartments/',
    score: 82,
    status: 'READY',
    reason: '55-unit Ogden property with direct management contact. Potential recurring turnover and property-cleanup work, subject to vendor requirements.'
  }
];
