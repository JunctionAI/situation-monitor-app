import { HistoricalEvent, TimelineMilestone } from '@/types/historical';

// Major events from 1945 to present
export const CONTEMPORARY_EVENTS: HistoricalEvent[] = [
  // 1945-1950: Post-WWII
  {
    id: 'wwii-end',
    year: 1945,
    title: 'End of World War II',
    description: 'Germany surrenders in May, Japan in August after atomic bombings of Hiroshima and Nagasaki. Deadliest conflict in human history ends.',
    type: 'WAR',
    significance: 'PIVOTAL',
    involvedEntities: ['USA', 'GBR', 'FRA', 'RUS', 'DEU', 'JPN'],
    keywords: ['world war', 'wwii', 'hiroshima', 'nagasaki', 'surrender'],
  },
  {
    id: 'un-founded',
    year: 1945,
    title: 'United Nations Founded',
    description: 'The United Nations is established with 51 founding members to maintain international peace and security.',
    type: 'FOUNDING',
    significance: 'PIVOTAL',
    coordinates: [-73.968, 40.749], // NYC
    involvedEntities: ['USA', 'GBR', 'FRA', 'RUS', 'CHN'],
    keywords: ['united nations', 'un', 'international'],
  },
  {
    id: 'india-independence',
    year: 1947,
    title: 'Indian Independence & Partition',
    description: 'British India gains independence and is partitioned into India and Pakistan, leading to massive population displacement and violence.',
    type: 'INDEPENDENCE',
    significance: 'PIVOTAL',
    coordinates: [77.209, 28.614], // Delhi
    involvedEntities: ['IND', 'PAK', 'GBR'],
    keywords: ['india', 'pakistan', 'partition', 'independence'],
  },
  {
    id: 'israel-founded',
    year: 1948,
    title: 'State of Israel Founded',
    description: 'Israel declares independence, immediately followed by the 1948 Arab-Israeli War.',
    type: 'FOUNDING',
    significance: 'PIVOTAL',
    coordinates: [34.781, 32.085], // Tel Aviv
    involvedEntities: ['ISR', 'EGY', 'JOR', 'SYR', 'LBN'],
    keywords: ['israel', 'palestine', 'arab-israeli'],
  },
  {
    id: 'nato-founded',
    year: 1949,
    title: 'NATO Founded',
    description: 'North Atlantic Treaty Organization established as collective defense alliance against Soviet expansion.',
    type: 'ALLIANCE',
    significance: 'PIVOTAL',
    coordinates: [4.418, 50.879], // Brussels
    involvedEntities: ['USA', 'GBR', 'FRA', 'CAN', 'BEL', 'NLD'],
    keywords: ['nato', 'alliance', 'cold war'],
  },
  {
    id: 'prc-founded',
    year: 1949,
    title: "People's Republic of China Founded",
    description: 'Communist forces under Mao Zedong defeat Nationalists, establishing the PRC. Nationalists flee to Taiwan.',
    type: 'REVOLUTION',
    significance: 'PIVOTAL',
    coordinates: [116.397, 39.904], // Beijing
    involvedEntities: ['CHN', 'TWN'],
    keywords: ['china', 'communist', 'mao', 'taiwan'],
  },

  // 1950s: Cold War Begins
  {
    id: 'korean-war',
    year: 1950,
    endYear: 1953,
    title: 'Korean War',
    description: 'North Korea invades South Korea. UN forces intervene, China enters war. Ends in armistice with Korea divided at 38th parallel.',
    type: 'WAR',
    significance: 'PIVOTAL',
    coordinates: [127.024, 37.532], // Seoul
    involvedEntities: ['KOR', 'PRK', 'USA', 'CHN'],
    keywords: ['korea', 'korean war', '38th parallel'],
  },
  {
    id: 'stalin-death',
    year: 1953,
    title: 'Death of Stalin',
    description: 'Soviet leader Joseph Stalin dies, leading to power struggle and eventual de-Stalinization under Khrushchev.',
    type: 'COLLAPSE',
    significance: 'MAJOR',
    coordinates: [37.618, 55.756], // Moscow
    involvedEntities: ['RUS'],
    keywords: ['stalin', 'soviet', 'ussr'],
  },
  {
    id: 'warsaw-pact',
    year: 1955,
    title: 'Warsaw Pact Formed',
    description: 'Soviet Union and Eastern European allies form military alliance in response to NATO.',
    type: 'ALLIANCE',
    significance: 'MAJOR',
    coordinates: [21.012, 52.230], // Warsaw
    involvedEntities: ['RUS', 'POL', 'DDR', 'CZE', 'HUN', 'ROM', 'BGR'],
    keywords: ['warsaw pact', 'soviet', 'cold war'],
  },
  {
    id: 'suez-crisis',
    year: 1956,
    title: 'Suez Crisis',
    description: 'Egypt nationalizes Suez Canal. Britain, France, and Israel invade but withdraw under US and Soviet pressure.',
    type: 'WAR',
    significance: 'MAJOR',
    coordinates: [32.305, 30.588], // Suez
    involvedEntities: ['EGY', 'GBR', 'FRA', 'ISR'],
    keywords: ['suez', 'egypt', 'nasser'],
  },
  {
    id: 'hungarian-uprising',
    year: 1956,
    title: 'Hungarian Uprising',
    description: 'Anti-Soviet revolution in Hungary brutally crushed by Soviet troops.',
    type: 'REVOLUTION',
    significance: 'MAJOR',
    coordinates: [19.040, 47.498], // Budapest
    involvedEntities: ['HUN', 'RUS'],
    keywords: ['hungary', 'uprising', 'soviet'],
  },

  // 1960s: Decolonization & Tensions
  {
    id: 'africa-year',
    year: 1960,
    title: 'Year of Africa',
    description: '17 African nations gain independence from colonial powers.',
    type: 'INDEPENDENCE',
    significance: 'PIVOTAL',
    involvedEntities: ['NGA', 'COD', 'SEN', 'MLI', 'CMR'],
    keywords: ['africa', 'independence', 'decolonization'],
  },
  {
    id: 'berlin-wall',
    year: 1961,
    title: 'Berlin Wall Built',
    description: 'East Germany constructs wall dividing Berlin, becoming symbol of Cold War division.',
    type: 'TENSION',
    significance: 'PIVOTAL',
    coordinates: [13.405, 52.520], // Berlin
    involvedEntities: ['DEU'],
    keywords: ['berlin wall', 'cold war', 'germany'],
  },
  {
    id: 'cuban-missile',
    year: 1962,
    title: 'Cuban Missile Crisis',
    description: 'US discovers Soviet nuclear missiles in Cuba. 13-day standoff brings world closest to nuclear war.',
    type: 'TENSION',
    significance: 'PIVOTAL',
    coordinates: [-82.367, 23.113], // Havana
    involvedEntities: ['USA', 'RUS', 'CUB'],
    keywords: ['cuba', 'missile', 'nuclear', 'kennedy', 'khrushchev'],
  },
  {
    id: 'jfk-assassination',
    year: 1963,
    title: 'JFK Assassination',
    description: 'US President John F. Kennedy assassinated in Dallas, Texas.',
    type: 'DISASTER',
    significance: 'MAJOR',
    coordinates: [-96.808, 32.779], // Dallas
    involvedEntities: ['USA'],
    keywords: ['kennedy', 'jfk', 'assassination'],
  },
  {
    id: 'vietnam-escalation',
    year: 1964,
    endYear: 1975,
    title: 'Vietnam War Escalation',
    description: 'Gulf of Tonkin incident leads to major US military involvement in Vietnam.',
    type: 'WAR',
    significance: 'PIVOTAL',
    coordinates: [106.660, 10.762], // Saigon
    involvedEntities: ['USA', 'VNM'],
    keywords: ['vietnam', 'war', 'tonkin'],
  },
  {
    id: 'six-day-war',
    year: 1967,
    title: 'Six-Day War',
    description: 'Israel defeats Egypt, Jordan, and Syria, capturing Sinai, West Bank, Gaza, and Golan Heights.',
    type: 'WAR',
    significance: 'PIVOTAL',
    coordinates: [35.233, 31.768], // Jerusalem
    involvedEntities: ['ISR', 'EGY', 'JOR', 'SYR'],
    keywords: ['israel', 'six day war', 'arab-israeli'],
  },
  {
    id: 'prague-spring',
    year: 1968,
    title: 'Prague Spring Crushed',
    description: 'Soviet-led Warsaw Pact invasion ends Czechoslovak liberalization movement.',
    type: 'REVOLUTION',
    significance: 'MAJOR',
    coordinates: [14.418, 50.088], // Prague
    involvedEntities: ['CZE', 'RUS'],
    keywords: ['prague spring', 'czechoslovakia', 'soviet'],
  },

  // 1970s: Détente & Conflicts
  {
    id: 'bangladesh-independence',
    year: 1971,
    title: 'Bangladesh Independence War',
    description: 'East Pakistan secedes after brutal crackdown, becoming Bangladesh with Indian support.',
    type: 'WAR',
    significance: 'MAJOR',
    coordinates: [90.407, 23.810], // Dhaka
    involvedEntities: ['BGD', 'PAK', 'IND'],
    keywords: ['bangladesh', 'pakistan', 'independence'],
  },
  {
    id: 'yom-kippur-war',
    year: 1973,
    title: 'Yom Kippur War',
    description: 'Egypt and Syria launch surprise attack on Israel. Results in oil embargo and global energy crisis.',
    type: 'WAR',
    significance: 'PIVOTAL',
    involvedEntities: ['ISR', 'EGY', 'SYR'],
    keywords: ['yom kippur', 'oil crisis', 'arab-israeli'],
  },
  {
    id: 'saigon-fall',
    year: 1975,
    title: 'Fall of Saigon',
    description: 'North Vietnamese forces capture Saigon, ending Vietnam War. US evacuates embassy.',
    type: 'CONQUEST',
    significance: 'PIVOTAL',
    coordinates: [106.660, 10.762], // Saigon
    involvedEntities: ['USA', 'VNM'],
    keywords: ['vietnam', 'saigon', 'fall'],
  },
  {
    id: 'cambodia-genocide',
    year: 1975,
    endYear: 1979,
    title: 'Cambodian Genocide',
    description: 'Khmer Rouge regime kills estimated 1.5-2 million Cambodians.',
    type: 'DISASTER',
    significance: 'PIVOTAL',
    coordinates: [104.917, 11.556], // Phnom Penh
    involvedEntities: ['KHM'],
    keywords: ['cambodia', 'khmer rouge', 'genocide'],
  },
  {
    id: 'iranian-revolution',
    year: 1979,
    title: 'Iranian Revolution',
    description: 'Shah overthrown, Islamic Republic established under Ayatollah Khomeini.',
    type: 'REVOLUTION',
    significance: 'PIVOTAL',
    coordinates: [51.389, 35.689], // Tehran
    involvedEntities: ['IRN'],
    keywords: ['iran', 'revolution', 'khomeini', 'islamic'],
  },
  {
    id: 'soviet-afghanistan',
    year: 1979,
    endYear: 1989,
    title: 'Soviet Invasion of Afghanistan',
    description: 'USSR invades Afghanistan, beginning decade-long war against mujahideen.',
    type: 'WAR',
    significance: 'PIVOTAL',
    coordinates: [69.172, 34.526], // Kabul
    involvedEntities: ['AFG', 'RUS'],
    keywords: ['afghanistan', 'soviet', 'mujahideen'],
  },

  // 1980s: Late Cold War
  {
    id: 'iran-iraq-war',
    year: 1980,
    endYear: 1988,
    title: 'Iran-Iraq War',
    description: 'Iraq invades Iran, beginning 8-year war with over 1 million casualties.',
    type: 'WAR',
    significance: 'PIVOTAL',
    involvedEntities: ['IRN', 'IRQ'],
    keywords: ['iran', 'iraq', 'saddam', 'khomeini'],
  },
  {
    id: 'falklands-war',
    year: 1982,
    title: 'Falklands War',
    description: 'Argentina invades Falkland Islands; Britain recaptures them in 10-week war.',
    type: 'WAR',
    significance: 'MAJOR',
    coordinates: [-57.850, -51.693], // Stanley
    involvedEntities: ['GBR', 'ARG'],
    keywords: ['falklands', 'malvinas', 'argentina', 'thatcher'],
  },
  {
    id: 'chernobyl',
    year: 1986,
    title: 'Chernobyl Nuclear Disaster',
    description: 'Explosion at Chernobyl nuclear plant causes worst nuclear disaster in history.',
    type: 'DISASTER',
    significance: 'PIVOTAL',
    coordinates: [30.095, 51.389], // Chernobyl
    involvedEntities: ['UKR', 'RUS'],
    keywords: ['chernobyl', 'nuclear', 'disaster'],
  },
  {
    id: 'berlin-wall-fall',
    year: 1989,
    title: 'Fall of Berlin Wall',
    description: 'Berlin Wall falls as East Germany opens borders, symbolizing end of Cold War.',
    type: 'REVOLUTION',
    significance: 'PIVOTAL',
    coordinates: [13.405, 52.520], // Berlin
    involvedEntities: ['DEU'],
    keywords: ['berlin wall', 'fall', 'reunification'],
  },
  {
    id: 'tiananmen',
    year: 1989,
    title: 'Tiananmen Square Massacre',
    description: 'Chinese military crushes pro-democracy protests in Beijing.',
    type: 'REVOLUTION',
    significance: 'PIVOTAL',
    coordinates: [116.391, 39.903], // Tiananmen
    involvedEntities: ['CHN'],
    keywords: ['tiananmen', 'china', 'democracy', 'massacre'],
  },

  // 1990s: Post-Cold War
  {
    id: 'german-reunification',
    year: 1990,
    title: 'German Reunification',
    description: 'East and West Germany reunify as single nation.',
    type: 'UNIFICATION',
    significance: 'PIVOTAL',
    coordinates: [13.405, 52.520], // Berlin
    involvedEntities: ['DEU'],
    keywords: ['germany', 'reunification'],
  },
  {
    id: 'gulf-war',
    year: 1991,
    title: 'Gulf War',
    description: 'US-led coalition liberates Kuwait from Iraqi occupation.',
    type: 'WAR',
    significance: 'PIVOTAL',
    coordinates: [47.978, 29.376], // Kuwait City
    involvedEntities: ['USA', 'IRQ', 'KWT'],
    keywords: ['gulf war', 'kuwait', 'iraq', 'saddam'],
  },
  {
    id: 'ussr-collapse',
    year: 1991,
    title: 'Collapse of Soviet Union',
    description: 'USSR dissolves into 15 independent republics, ending Cold War.',
    type: 'COLLAPSE',
    significance: 'PIVOTAL',
    coordinates: [37.618, 55.756], // Moscow
    involvedEntities: ['RUS', 'UKR', 'BLR', 'KAZ'],
    keywords: ['soviet union', 'ussr', 'collapse', 'cold war'],
  },
  {
    id: 'yugoslavia-wars',
    year: 1991,
    endYear: 2001,
    title: 'Yugoslav Wars',
    description: 'Series of ethnic conflicts as Yugoslavia breaks apart.',
    type: 'WAR',
    significance: 'PIVOTAL',
    coordinates: [18.413, 43.856], // Sarajevo
    involvedEntities: ['SRB', 'HRV', 'BIH', 'SVN', 'MKD', 'MNE'],
    keywords: ['yugoslavia', 'bosnia', 'kosovo', 'srebrenica'],
  },
  {
    id: 'eu-founded',
    year: 1993,
    title: 'European Union Founded',
    description: 'Maastricht Treaty establishes European Union.',
    type: 'FOUNDING',
    significance: 'PIVOTAL',
    coordinates: [5.689, 50.851], // Maastricht
    involvedEntities: ['DEU', 'FRA', 'ITA', 'BEL', 'NLD', 'LUX'],
    keywords: ['european union', 'eu', 'maastricht'],
  },
  {
    id: 'rwanda-genocide',
    year: 1994,
    title: 'Rwandan Genocide',
    description: 'Hutu extremists kill an estimated 800,000 Tutsis and moderate Hutus in 100 days.',
    type: 'DISASTER',
    significance: 'PIVOTAL',
    coordinates: [30.059, -1.941], // Kigali
    involvedEntities: ['RWA'],
    keywords: ['rwanda', 'genocide', 'hutu', 'tutsi'],
  },
  {
    id: 'hong-kong-handover',
    year: 1997,
    title: 'Hong Kong Handover',
    description: 'Britain returns Hong Kong to China after 156 years of colonial rule.',
    type: 'TREATY',
    significance: 'MAJOR',
    coordinates: [114.173, 22.320], // Hong Kong
    involvedEntities: ['CHN', 'GBR', 'HKG'],
    keywords: ['hong kong', 'handover', 'china', 'britain'],
  },
  {
    id: 'kosovo-war',
    year: 1999,
    title: 'Kosovo War',
    description: 'NATO intervenes against Serbian forces in Kosovo, leading to UN administration.',
    type: 'WAR',
    significance: 'MAJOR',
    coordinates: [21.166, 42.663], // Pristina
    involvedEntities: ['SRB', 'USA'],
    keywords: ['kosovo', 'serbia', 'nato', 'milosevic'],
  },

  // 2000s: War on Terror
  {
    id: 'sept-11',
    year: 2001,
    title: '9/11 Attacks',
    description: 'Al-Qaeda terrorists attack World Trade Center and Pentagon, killing nearly 3,000.',
    type: 'DISASTER',
    significance: 'PIVOTAL',
    coordinates: [-74.013, 40.711], // NYC
    involvedEntities: ['USA'],
    keywords: ['9/11', 'september 11', 'world trade center', 'al qaeda'],
  },
  {
    id: 'afghanistan-war',
    year: 2001,
    endYear: 2021,
    title: 'US Invasion of Afghanistan',
    description: 'US and allies invade Afghanistan to overthrow Taliban and pursue al-Qaeda.',
    type: 'WAR',
    significance: 'PIVOTAL',
    coordinates: [69.172, 34.526], // Kabul
    involvedEntities: ['USA', 'AFG'],
    keywords: ['afghanistan', 'taliban', 'war on terror'],
  },
  {
    id: 'iraq-war',
    year: 2003,
    endYear: 2011,
    title: 'Iraq War',
    description: 'US-led coalition invades Iraq, overthrows Saddam Hussein.',
    type: 'WAR',
    significance: 'PIVOTAL',
    coordinates: [44.366, 33.312], // Baghdad
    involvedEntities: ['USA', 'IRQ', 'GBR'],
    keywords: ['iraq war', 'saddam', 'wmd', 'baghdad'],
  },
  {
    id: 'eu-expansion',
    year: 2004,
    title: 'EU Eastern Expansion',
    description: '10 new members join EU, including 8 former Eastern Bloc countries.',
    type: 'ALLIANCE',
    significance: 'MAJOR',
    involvedEntities: ['POL', 'CZE', 'HUN', 'SVK', 'SVN', 'EST', 'LVA', 'LTU'],
    keywords: ['european union', 'expansion', 'eastern europe'],
  },
  {
    id: 'tsunami-2004',
    year: 2004,
    title: 'Indian Ocean Tsunami',
    description: 'Massive earthquake and tsunami kill over 230,000 across 14 countries.',
    type: 'DISASTER',
    significance: 'PIVOTAL',
    coordinates: [95.854, 3.316], // Banda Aceh
    involvedEntities: ['IDN', 'LKA', 'THA', 'IND'],
    keywords: ['tsunami', 'earthquake', 'indian ocean'],
  },
  {
    id: 'financial-crisis',
    year: 2008,
    title: 'Global Financial Crisis',
    description: 'Collapse of Lehman Brothers triggers worst financial crisis since Great Depression.',
    type: 'COLLAPSE',
    significance: 'PIVOTAL',
    coordinates: [-74.013, 40.711], // NYC
    involvedEntities: ['USA', 'GBR', 'DEU'],
    keywords: ['financial crisis', 'lehman', 'recession', 'subprime'],
  },

  // 2010s: New Tensions
  {
    id: 'arab-spring',
    year: 2011,
    title: 'Arab Spring',
    description: 'Wave of protests and revolutions across Arab world, toppling several governments.',
    type: 'REVOLUTION',
    significance: 'PIVOTAL',
    coordinates: [10.166, 36.802], // Tunis
    involvedEntities: ['TUN', 'EGY', 'LBY', 'SYR', 'YEM', 'BHR'],
    keywords: ['arab spring', 'revolution', 'protest'],
  },
  {
    id: 'syria-war',
    year: 2011,
    endYear: 2024,
    title: 'Syrian Civil War',
    description: 'Protests against Assad escalate into devastating civil war with international involvement.',
    type: 'WAR',
    significance: 'PIVOTAL',
    coordinates: [36.278, 33.513], // Damascus
    involvedEntities: ['SYR', 'RUS', 'USA', 'TUR', 'IRN'],
    keywords: ['syria', 'civil war', 'assad', 'isis'],
  },
  {
    id: 'crimea-annexation',
    year: 2014,
    title: 'Russia Annexes Crimea',
    description: 'Russia seizes Crimea from Ukraine following Euromaidan revolution.',
    type: 'CONQUEST',
    significance: 'PIVOTAL',
    coordinates: [34.100, 44.952], // Simferopol
    involvedEntities: ['RUS', 'UKR'],
    keywords: ['crimea', 'russia', 'ukraine', 'annexation'],
  },
  {
    id: 'isis-caliphate',
    year: 2014,
    endYear: 2019,
    title: 'ISIS Declares Caliphate',
    description: 'Islamic State captures territory across Iraq and Syria, declares caliphate.',
    type: 'CONQUEST',
    significance: 'PIVOTAL',
    coordinates: [43.145, 36.335], // Mosul
    involvedEntities: ['IRQ', 'SYR'],
    keywords: ['isis', 'islamic state', 'caliphate', 'mosul'],
  },
  {
    id: 'brexit-vote',
    year: 2016,
    title: 'Brexit Vote',
    description: 'UK votes to leave European Union in historic referendum.',
    type: 'TREATY',
    significance: 'PIVOTAL',
    coordinates: [-0.127, 51.507], // London
    involvedEntities: ['GBR'],
    keywords: ['brexit', 'uk', 'european union', 'referendum'],
  },
  {
    id: 'trump-elected',
    year: 2016,
    title: 'Trump Elected President',
    description: 'Donald Trump wins US presidential election.',
    type: 'FOUNDING',
    significance: 'MAJOR',
    coordinates: [-77.009, 38.890], // Washington DC
    involvedEntities: ['USA'],
    keywords: ['trump', 'election', 'president'],
  },

  // 2020s: Pandemic & Conflict
  {
    id: 'covid-pandemic',
    year: 2020,
    endYear: 2023,
    title: 'COVID-19 Pandemic',
    description: 'Global pandemic kills millions, transforms societies, and disrupts global economy.',
    type: 'DISASTER',
    significance: 'PIVOTAL',
    coordinates: [114.305, 30.593], // Wuhan
    involvedEntities: ['CHN', 'USA', 'ITA', 'BRA', 'IND'],
    keywords: ['covid', 'coronavirus', 'pandemic', 'lockdown'],
  },
  {
    id: 'afghanistan-withdrawal',
    year: 2021,
    title: 'US Withdrawal from Afghanistan',
    description: 'US withdraws from Afghanistan; Taliban rapidly seize control.',
    type: 'CONQUEST',
    significance: 'PIVOTAL',
    coordinates: [69.172, 34.526], // Kabul
    involvedEntities: ['USA', 'AFG'],
    keywords: ['afghanistan', 'taliban', 'withdrawal', 'kabul'],
  },
  {
    id: 'ukraine-invasion',
    year: 2022,
    title: 'Russia Invades Ukraine',
    description: 'Russia launches full-scale invasion of Ukraine, largest European war since WWII.',
    type: 'WAR',
    significance: 'PIVOTAL',
    coordinates: [30.523, 50.450], // Kyiv
    involvedEntities: ['RUS', 'UKR', 'USA', 'NATO'],
    keywords: ['ukraine', 'russia', 'invasion', 'war', 'putin', 'zelensky'],
  },
  {
    id: 'gaza-war-2023',
    year: 2023,
    title: 'Israel-Hamas War',
    description: 'Hamas attacks Israel on October 7; Israel responds with major offensive in Gaza.',
    type: 'WAR',
    significance: 'PIVOTAL',
    coordinates: [34.308, 31.354], // Gaza
    involvedEntities: ['ISR', 'PSE'],
    keywords: ['gaza', 'israel', 'hamas', 'october 7'],
  },
];

// Key milestones for timeline markers
export const CONTEMPORARY_MILESTONES: TimelineMilestone[] = CONTEMPORARY_EVENTS
  .filter(e => e.significance === 'PIVOTAL')
  .map(e => ({
    year: e.year,
    label: e.title,
    significance: e.significance,
    eventId: e.id,
  }));

// Get events for a specific year range
export function getEventsForYear(year: number): HistoricalEvent[] {
  return CONTEMPORARY_EVENTS.filter(event => {
    if (event.endYear) {
      return year >= event.year && year <= event.endYear;
    }
    return event.year === year;
  });
}

// Get events within a year range
export function getEventsInRange(startYear: number, endYear: number): HistoricalEvent[] {
  return CONTEMPORARY_EVENTS.filter(event => {
    const eventEnd = event.endYear || event.year;
    return event.year <= endYear && eventEnd >= startYear;
  });
}

// Get active conflicts for a specific year
export function getActiveConflicts(year: number): HistoricalEvent[] {
  return CONTEMPORARY_EVENTS.filter(event => {
    if (event.type !== 'WAR' && event.type !== 'TENSION') return false;
    if (event.endYear) {
      return year >= event.year && year <= event.endYear;
    }
    return event.year === year;
  });
}
