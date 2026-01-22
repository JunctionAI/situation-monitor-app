// James Webb Space Telescope imagery data
// Images from NASA's official public servers

export interface JWSTImage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  releaseDate: string;
  distance: string;
  constellation?: string;
  type: 'nebula' | 'galaxy' | 'star' | 'exoplanet' | 'deep-field' | 'cluster';
  coordinates?: {
    ra: string;
    dec: string;
  };
}

export const jwstImages: JWSTImage[] = [
  {
    id: 'deep-field-1',
    title: "Webb's First Deep Field",
    description: "Galaxy cluster SMACS 0723 - thousands of galaxies, including the faintest objects ever observed in infrared. Some galaxies shown as they appeared over 13 billion years ago.",
    imageUrl: "https://www.nasa.gov/wp-content/uploads/2023/03/main_image_deep_field_smacs0723-5mb.jpg",
    thumbnailUrl: "https://www.nasa.gov/wp-content/uploads/2023/03/main_image_deep_field_smacs0723-5mb.jpg",
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
    imageUrl: "https://www.nasa.gov/wp-content/uploads/2023/03/main_image_star-forming_702702.jpg",
    thumbnailUrl: "https://www.nasa.gov/wp-content/uploads/2023/03/main_image_star-forming_702702.jpg",
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
    imageUrl: "https://www.nasa.gov/wp-content/uploads/2023/03/main_image_galaxies_702608.jpg",
    thumbnailUrl: "https://www.nasa.gov/wp-content/uploads/2023/03/main_image_galaxies_702608.jpg",
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
    imageUrl: "https://www.nasa.gov/wp-content/uploads/2023/03/main_image_stellar_702702.jpg",
    thumbnailUrl: "https://www.nasa.gov/wp-content/uploads/2023/03/main_image_stellar_702702.jpg",
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
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Pillars_of_creation_2014_HST_WFC3-UVIS_full-res_denoised.jpg/1280px-Pillars_of_creation_2014_HST_WFC3-UVIS_full-res_denoised.jpg",
    thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Pillars_of_creation_2014_HST_WFC3-UVIS_full-res_denoised.jpg/640px-Pillars_of_creation_2014_HST_WFC3-UVIS_full-res_denoised.jpg",
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
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Tarantula_Nebula_-_James_Webb_Space_Telescope.jpg/1280px-Tarantula_Nebula_-_James_Webb_Space_Telescope.jpg",
    thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Tarantula_Nebula_-_James_Webb_Space_Telescope.jpg/640px-Tarantula_Nebula_-_James_Webb_Space_Telescope.jpg",
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
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Messier_74_by_HST.jpg/1280px-Messier_74_by_HST.jpg",
    thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Messier_74_by_HST.jpg/640px-Messier_74_by_HST.jpg",
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
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Cartwheel_Galaxy_%28NIRCam_and_MIRI_Composite_Image%29.png/1280px-Cartwheel_Galaxy_%28NIRCam_and_MIRI_Composite_Image%29.png",
    thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Cartwheel_Galaxy_%28NIRCam_and_MIRI_Composite_Image%29.png/640px-Cartwheel_Galaxy_%28NIRCam_and_MIRI_Composite_Image%29.png",
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
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/1280px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg",
    thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/640px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg",
    releaseDate: "2022-08-22",
    distance: "43 light-minutes",
    type: 'exoplanet',
  },
  {
    id: 'orion-nebula',
    title: "Inner Orion Nebula",
    description: "The heart of the Orion Nebula star-forming region. Webb reveals the intricate web of dust and gas where new stars and planetary systems are born.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg/1280px-Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg",
    thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg/640px-Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg",
    releaseDate: "2022-09-12",
    distance: "1,344 light-years",
    constellation: "Orion",
    type: 'nebula',
    coordinates: { ra: "05h 35m 16s", dec: "-05° 23' 23\"" }
  },
  {
    id: 'andromeda',
    title: "Andromeda Galaxy",
    description: "Our nearest major galactic neighbor, containing over a trillion stars. On a collision course with the Milky Way in about 4.5 billion years.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/M31_09-01-2011_%28cropped%29.jpg/1280px-M31_09-01-2011_%28cropped%29.jpg",
    thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/M31_09-01-2011_%28cropped%29.jpg/640px-M31_09-01-2011_%28cropped%29.jpg",
    releaseDate: "2023-01-15",
    distance: "2.5 million light-years",
    constellation: "Andromeda",
    type: 'galaxy',
    coordinates: { ra: "00h 42m 44.3s", dec: "+41° 16' 9\"" }
  },
  {
    id: 'ring-nebula',
    title: "Ring Nebula (M57)",
    description: "A planetary nebula formed as a dying star ejects its outer layers. Webb reveals unprecedented detail in the complex structure of gas shells.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Ring_Nebula.jpg/1280px-Ring_Nebula.jpg",
    thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Ring_Nebula.jpg/640px-Ring_Nebula.jpg",
    releaseDate: "2023-08-21",
    distance: "2,200 light-years",
    constellation: "Lyra",
    type: 'nebula',
    coordinates: { ra: "18h 53m 35.1s", dec: "+33° 01' 45\"" }
  },
  {
    id: 'crab-nebula',
    title: "Crab Nebula",
    description: "Supernova remnant from the explosion observed in 1054 AD. At its center lies a pulsar rotating 30 times per second.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Crab_Nebula.jpg/1280px-Crab_Nebula.jpg",
    thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Crab_Nebula.jpg/640px-Crab_Nebula.jpg",
    releaseDate: "2023-07-12",
    distance: "6,500 light-years",
    constellation: "Taurus",
    type: 'nebula',
    coordinates: { ra: "05h 34m 31.9s", dec: "+22° 00' 52\"" }
  },
  {
    id: 'sombrero-galaxy',
    title: "Sombrero Galaxy",
    description: "An unbarred spiral galaxy with a brilliant white core encircled by thick dust lanes. One of the most photogenic galaxies in the sky.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/M104_ngc4594_sombrero_galaxy_hi-res.jpg/1280px-M104_ngc4594_sombrero_galaxy_hi-res.jpg",
    thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/M104_ngc4594_sombrero_galaxy_hi-res.jpg/640px-M104_ngc4594_sombrero_galaxy_hi-res.jpg",
    releaseDate: "2023-03-14",
    distance: "31 million light-years",
    constellation: "Virgo",
    type: 'galaxy',
    coordinates: { ra: "12h 39m 59.4s", dec: "-11° 37' 23\"" }
  },
  {
    id: 'whirlpool-galaxy',
    title: "Whirlpool Galaxy (M51)",
    description: "A grand-design spiral galaxy interacting with its companion NGC 5195. The interaction has enhanced the spiral structure.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Messier51_sbread.jpg/1280px-Messier51_sread.jpg",
    thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Messier51_sread.jpg/640px-Messier51_sread.jpg",
    releaseDate: "2023-09-14",
    distance: "23 million light-years",
    constellation: "Canes Venatici",
    type: 'galaxy',
    coordinates: { ra: "13h 29m 52.7s", dec: "+47° 11' 43\"" }
  },
  {
    id: 'horsehead-nebula',
    title: "Horsehead Nebula",
    description: "One of the most identifiable nebulae because of its shape resembling a horse's head. A dark nebula in the constellation Orion.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Barnard_33.jpg/1280px-Barnard_33.jpg",
    thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Barnard_33.jpg/640px-Barnard_33.jpg",
    releaseDate: "2023-12-10",
    distance: "1,500 light-years",
    constellation: "Orion",
    type: 'nebula',
    coordinates: { ra: "05h 40m 59s", dec: "-02° 27' 30\"" }
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
