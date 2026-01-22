// James Webb Space Telescope imagery data
// Images from NASA's official JWST releases

export interface JWSTImage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  releaseDate: string;
  distance: string; // Light years or description
  constellation?: string;
  type: 'nebula' | 'galaxy' | 'star' | 'exoplanet' | 'deep-field' | 'cluster';
  coordinates?: {
    ra: string;  // Right Ascension
    dec: string; // Declination
  };
}

export const jwstImages: JWSTImage[] = [
  {
    id: 'deep-field-1',
    title: "Webb's First Deep Field",
    description: "Galaxy cluster SMACS 0723 - thousands of galaxies, including the faintest objects ever observed in infrared. Some galaxies shown as they appeared over 13 billion years ago.",
    imageUrl: "https://stsci-opo.org/STScI-01G7JJADTH90FR98AKKJFKSS0B.png",
    thumbnailUrl: "https://stsci-opo.org/STScI-01G7JJADTH90FR98AKKJFKSS0B.png",
    releaseDate: "2022-07-11",
    distance: "4.6 billion light-years",
    constellation: "Volans",
    type: 'deep-field',
    coordinates: { ra: "07h 23m 19.5s", dec: "-73° 27' 15.6\"" }
  },
  {
    id: 'carina-nebula',
    title: "Cosmic Cliffs in Carina Nebula",
    description: "The edge of a nearby, young, star-forming region NGC 3324 in the Carina Nebula. Reveals for the first time previously invisible areas of star birth.",
    imageUrl: "https://stsci-opo.org/STScI-01G7ETPF7DVBJAC42JR5N6EQRH.png",
    thumbnailUrl: "https://stsci-opo.org/STScI-01G7ETPF7DVBJAC42JR5N6EQRH.png",
    releaseDate: "2022-07-12",
    distance: "7,600 light-years",
    constellation: "Carina",
    type: 'nebula',
    coordinates: { ra: "10h 37m 19.0s", dec: "-58° 38' 12\"" }
  },
  {
    id: 'stephans-quintet',
    title: "Stephan's Quintet",
    description: "A visual grouping of five galaxies. Webb reveals never-before-seen details of galaxy interactions, triggering star formation and showing outflows driven by a black hole.",
    imageUrl: "https://stsci-opo.org/STScI-01G7DB1FHPMJCCY59CQGZC1YJQ.png",
    thumbnailUrl: "https://stsci-opo.org/STScI-01G7DB1FHPMJCCY59CQGZC1YJQ.png",
    releaseDate: "2022-07-12",
    distance: "290 million light-years",
    constellation: "Pegasus",
    type: 'galaxy',
    coordinates: { ra: "22h 35m 57.5s", dec: "+33° 57' 36\"" }
  },
  {
    id: 'southern-ring',
    title: "Southern Ring Nebula",
    description: "A planetary nebula - clouds of gas and dust expelled by a dying star. Webb reveals the dying star at the center for the first time, cloaked in dust.",
    imageUrl: "https://stsci-opo.org/STScI-01G7DDYAKY5AGPT0G1T0YST85P.png",
    thumbnailUrl: "https://stsci-opo.org/STScI-01G7DDYAKY5AGPT0G1T0YST85P.png",
    releaseDate: "2022-07-12",
    distance: "2,500 light-years",
    constellation: "Vela",
    type: 'nebula',
    coordinates: { ra: "10h 07m 01.8s", dec: "-40° 26' 11\"" }
  },
  {
    id: 'pillars-creation',
    title: "Pillars of Creation",
    description: "Iconic columns of cool interstellar gas and dust in the Eagle Nebula. Webb's infrared view reveals newly forming stars hidden within the pillars.",
    imageUrl: "https://stsci-opo.org/STScI-01GK7B4RCJN1GCDVT4MBMZTX6X.png",
    thumbnailUrl: "https://stsci-opo.org/STScI-01GK7B4RCJN1GCDVT4MBMZTX6X.png",
    releaseDate: "2022-10-19",
    distance: "6,500 light-years",
    constellation: "Serpens",
    type: 'nebula',
    coordinates: { ra: "18h 18m 48s", dec: "-13° 49' 0\"" }
  },
  {
    id: 'tarantula-nebula',
    title: "Tarantula Nebula",
    description: "The largest and brightest star-forming region in the Local Group. Home to the hottest, most massive stars known. A glimpse of cosmic noon.",
    imageUrl: "https://stsci-opo.org/STScI-01GA76RM0C11W977JRHGJ5J26X.png",
    thumbnailUrl: "https://stsci-opo.org/STScI-01GA76RM0C11W977JRHGJ5J26X.png",
    releaseDate: "2022-09-06",
    distance: "161,000 light-years",
    constellation: "Dorado",
    type: 'nebula',
    coordinates: { ra: "05h 38m 38s", dec: "-69° 05' 42\"" }
  },
  {
    id: 'phantom-galaxy',
    title: "Phantom Galaxy (M74)",
    description: "A grand-design spiral galaxy with well-defined spiral arms. Webb reveals the delicate filaments of gas and dust in the spiral arms.",
    imageUrl: "https://stsci-opo.org/STScI-01G9P7ZBT4S4BB32QQ2WPN41F7.png",
    thumbnailUrl: "https://stsci-opo.org/STScI-01G9P7ZBT4S4BB32QQ2WPN41F7.png",
    releaseDate: "2022-08-29",
    distance: "32 million light-years",
    constellation: "Pisces",
    type: 'galaxy',
    coordinates: { ra: "01h 36m 41.8s", dec: "+15° 47' 01\"" }
  },
  {
    id: 'cartwheel-galaxy',
    title: "Cartwheel Galaxy",
    description: "A rare ring galaxy formed by collision. Webb peers through cosmic dust to reveal new details about star formation and the galaxy's central black hole.",
    imageUrl: "https://stsci-opo.org/STScI-01G9K8YZJSA4QF42V72VP1CCFZ.png",
    thumbnailUrl: "https://stsci-opo.org/STScI-01G9K8YZJSA4QF42V72VP1CCFZ.png",
    releaseDate: "2022-08-02",
    distance: "500 million light-years",
    constellation: "Sculptor",
    type: 'galaxy',
    coordinates: { ra: "00h 37m 41.1s", dec: "-33° 42' 59\"" }
  },
  {
    id: 'jupiter',
    title: "Jupiter in Infrared",
    description: "Webb's infrared view reveals Jupiter's auroras, faint rings, and two small moons. The Great Red Spot appears white due to reflecting sunlight.",
    imageUrl: "https://stsci-opo.org/STScI-01G9HHRNQQ9VZ9KVYGP2W0JBEY.png",
    thumbnailUrl: "https://stsci-opo.org/STScI-01G9HHRNQQ9VZ9KVYGP2W0JBEY.png",
    releaseDate: "2022-08-22",
    distance: "43 light-minutes",
    type: 'exoplanet',
  },
  {
    id: 'orion-nebula',
    title: "Inner Orion Nebula",
    description: "The heart of the Orion Nebula star-forming region. Webb reveals the intricate web of dust and gas where new stars and planetary systems are born.",
    imageUrl: "https://stsci-opo.org/STScI-01GF56T9MPP4RWMJPPDQE8ADGM.png",
    thumbnailUrl: "https://stsci-opo.org/STScI-01GF56T9MPP4RWMJPPDQE8ADGM.png",
    releaseDate: "2022-09-12",
    distance: "1,344 light-years",
    constellation: "Orion",
    type: 'nebula',
    coordinates: { ra: "05h 35m 16s", dec: "-05° 23' 23\"" }
  },
  {
    id: 'wolf-rayet',
    title: "Wolf-Rayet 124",
    description: "A massive star 30 times the mass of the Sun, shedding its outer layers in a cosmic wind. The ejected material forms halos of gas and dust around the star.",
    imageUrl: "https://stsci-opo.org/STScI-01GVGH3VAGJ74F4Z6NN5VZ2JCH.png",
    thumbnailUrl: "https://stsci-opo.org/STScI-01GVGH3VAGJ74F4Z6NN5VZ2JCH.png",
    releaseDate: "2023-03-14",
    distance: "15,000 light-years",
    constellation: "Sagitta",
    type: 'star',
    coordinates: { ra: "19h 11m 30.9s", dec: "+16° 51' 38\"" }
  },
  {
    id: 'ring-nebula',
    title: "Ring Nebula (M57)",
    description: "A planetary nebula formed as a dying star ejects its outer layers. Webb reveals unprecedented detail in the complex structure of gas shells.",
    imageUrl: "https://stsci-opo.org/STScI-01H5HXPQCHJZRK68R1S98C1FDF.png",
    thumbnailUrl: "https://stsci-opo.org/STScI-01H5HXPQCHJZRK68R1S98C1FDF.png",
    releaseDate: "2023-08-21",
    distance: "2,200 light-years",
    constellation: "Lyra",
    type: 'nebula',
    coordinates: { ra: "18h 53m 35.1s", dec: "+33° 01' 45\"" }
  },
  {
    id: 'rho-ophiuchi',
    title: "Rho Ophiuchi Cloud Complex",
    description: "Our closest star-forming region. Celebrates Webb's first anniversary with jets of molecular hydrogen from young stars bursting through interstellar dust.",
    imageUrl: "https://stsci-opo.org/STScI-01H44AY2TJMSQRP04V3VGZR8B3.png",
    thumbnailUrl: "https://stsci-opo.org/STScI-01H44AY2TJMSQRP04V3VGZR8B3.png",
    releaseDate: "2023-07-12",
    distance: "390 light-years",
    constellation: "Ophiuchus",
    type: 'nebula',
    coordinates: { ra: "16h 26m 26s", dec: "-24° 23' 00\"" }
  },
  {
    id: 'el-gordo',
    title: "El Gordo Galaxy Cluster",
    description: "The largest, hottest, and most massive distant galaxy cluster known. Contains galaxies from 10+ billion years ago with gravitational lensing effects.",
    imageUrl: "https://stsci-opo.org/STScI-01GWQDM4NK2HS2G3NDGAWM37YP.png",
    thumbnailUrl: "https://stsci-opo.org/STScI-01GWQDM4NK2HS2G3NDGAWM37YP.png",
    releaseDate: "2023-07-31",
    distance: "7.3 billion light-years",
    constellation: "Phoenix",
    type: 'cluster',
    coordinates: { ra: "01h 02m 52.5s", dec: "-49° 14' 58\"" }
  },
  {
    id: 'herbig-haro',
    title: "Herbig-Haro 211",
    description: "A young protostar only 1,000 years old shooting out supersonic jets. The youngest protostar ever captured by Webb, still enshrouded in gas.",
    imageUrl: "https://stsci-opo.org/STScI-01HA57JC3Z8NKJY0RT4T9NBGBP.png",
    thumbnailUrl: "https://stsci-opo.org/STScI-01HA57JC3Z8NKJY0RT4T9NBGBP.png",
    releaseDate: "2023-09-14",
    distance: "1,000 light-years",
    constellation: "Perseus",
    type: 'star',
    coordinates: { ra: "03h 43m 56.8s", dec: "+32° 00' 50\"" }
  },
  {
    id: 'cassiopeia-a',
    title: "Cassiopeia A Supernova Remnant",
    description: "The youngest known supernova remnant from a massive star explosion. Webb reveals new details in the debris from the stellar death.",
    imageUrl: "https://stsci-opo.org/STScI-01HGGZDXV44R52XYZXDH7KC1NT.png",
    thumbnailUrl: "https://stsci-opo.org/STScI-01HGGZDXV44R52XYZXDH7KC1NT.png",
    releaseDate: "2023-12-10",
    distance: "11,000 light-years",
    constellation: "Cassiopeia",
    type: 'nebula',
    coordinates: { ra: "23h 23m 24s", dec: "+58° 48' 54\"" }
  },
];

// Get images by type
export const getImagesByType = (type: JWSTImage['type']): JWSTImage[] => {
  return jwstImages.filter(img => img.type === type);
};

// Get sorted by distance (closest first)
export const getImagesByDistance = (): JWSTImage[] => {
  return [...jwstImages].sort((a, b) => {
    const parseDistance = (d: string): number => {
      if (d.includes('minutes')) return 0.0000001;
      if (d.includes('light-years')) {
        const num = parseFloat(d.replace(/[^0-9.]/g, ''));
        if (d.includes('billion')) return num * 1_000_000_000;
        if (d.includes('million')) return num * 1_000_000;
        return num;
      }
      return 0;
    };
    return parseDistance(a.distance) - parseDistance(b.distance);
  });
};
