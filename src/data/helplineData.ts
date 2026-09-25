export interface HelplineItem {
  id: string;
  title: string;
  hindiTitle: string;
  number: string;
  altNumber?: string;
  hours: string;
  category: 'MCF' | 'Emergency' | 'Safety' | 'Utility';
  icon: string;
  description: string;
}

export const HELPLINE_DATA: HelplineItem[] = [
  {
    id: '1',
    title: 'MCF Control Room & Toll Free',
    hindiTitle: 'एमसीएफ कंट्रोल रूम और टोल फ्री',
    number: '18001802013',
    altNumber: '0129-2415549',
    hours: '24 x 7 Operating',
    category: 'MCF',
    icon: 'headset',
    description: 'Civic complaints, sanitation issues, street lights, water supply and stray animals.',
  },
  {
    id: '2',
    title: 'Police Emergency Helpline',
    hindiTitle: 'पुलिस आपातकालीन हेल्पलाइन',
    number: '112',
    hours: '24 x 7 Operating',
    category: 'Emergency',
    icon: 'shield-alert',
    description: 'Unified Emergency Response Support System (ERSS) for immediate police assistance.',
  },
  {
    id: '3',
    title: 'Fire Station & Rescue',
    hindiTitle: 'दमकल एवं आपदा बचाव',
    number: '101',
    altNumber: '0129-2416101',
    hours: '24 x 7 Operating',
    category: 'Emergency',
    icon: 'flame',
    description: 'Fire control room Faridabad for fire emergencies and disaster rescue.',
  },
  {
    id: '4',
    title: 'Ambulance & Medical Emergency',
    hindiTitle: 'एम्बुलेंस एवं चिकित्सा आपातकाल',
    number: '108',
    altNumber: '102',
    hours: '24 x 7 Operating',
    category: 'Emergency',
    icon: 'ambulance',
    description: 'Free emergency ambulance service across Haryana and civil hospitals.',
  },
  {
    id: '5',
    title: 'Women Helpline',
    hindiTitle: 'महिला हेल्पलाइन',
    number: '1091',
    hours: '24 x 7 Operating',
    category: 'Safety',
    icon: 'heart-handshake',
    description: 'Dedicated women protection cell for safety, harassment complaints, and legal aid.',
  },
  {
    id: '6',
    title: 'Child Helpline',
    hindiTitle: 'चाइल्ड हेल्पलाइन',
    number: '1098',
    hours: '24 x 7 Operating',
    category: 'Safety',
    icon: 'baby',
    description: 'Protection of children in distress, missing children, and child welfare.',
  },
  {
    id: '7',
    title: 'Disaster Management Cell',
    hindiTitle: 'आपदा प्रबंधन सेल',
    number: '1077',
    altNumber: '0129-2227814',
    hours: '24 x 7 Operating',
    category: 'Emergency',
    icon: 'alert-triangle',
    description: 'District Disaster Management Authority (DDMA) Faridabad.',
  },
  {
    id: '8',
    title: 'Electricity Complaint (DHBVN)',
    hindiTitle: 'बिजली शिकायत (डीएचबीवीएन)',
    number: '1912',
    altNumber: '18001804334',
    hours: '24 x 7 Operating',
    category: 'Utility',
    icon: 'zap',
    description: 'Power cut, transformer breakdown, high voltage issues, billing inquiries.',
  },
  {
    id: '9',
    title: 'Senior Citizen Helpline (Elder Line)',
    hindiTitle: 'वरिष्ठ नागरिक हेल्पलाइन',
    number: '14567',
    hours: '8:00 AM - 8:00 PM',
    category: 'Safety',
    icon: 'users',
    description: 'Support, counseling, care, and legal assistance for senior citizens.',
  },
];
