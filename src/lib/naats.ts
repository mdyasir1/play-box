export type NaatTrack = {
  title: string;
  artist: string;
  src: string;
};

export const NAAT_TRACKS: readonly NaatTrack[] = [
  {
    title: "Umar Farooq Azam",
    artist: "Muhammad Anas Nazeer",
    src: "/naats/01.mp3",
  },
  {
    title: "Qayamat Ka Manzar",
    artist: "Jalalis & Sons",
    src: "/naats/02.mp3",
  },
  {
    title: "Muj Ko Bhi Yaad Karna",
    artist: "Muhammad Anas Nazeer",
    src: "/naats/03.mp3",
  },
  {
    title: "Mayoss Jigar Walo Ko",
    artist: "Muhammad Anas Nazeer",
    src: "/naats/04.mp3",
  },
  {
    title: "La Tahzanu",
    artist: "Muhammad Anas Nazeer",
    src: "/naats/05.mp3",
  },
  {
    title: "Kullu Man Alaiha Faan",
    artist: "Muhammad Anas Nazeer",
    src: "/naats/06.mp3",
  },
  {
    title: "Koi Bataye Daryaon Ko",
    artist: "Muhammad Anas Nazeer",
    src: "/naats/07.mp3",
  },
] as const;
