export type MediaItem = {
  type: "image" | "video";
  src: string;
  alt: string;
  label: string;
};

export type Domain = {
  id: string;
  cardTitle: string;
  cardSub: string;
  badge: string;
  heading: string;
  paragraphs: string[];
  cta: string;
  layout: "quad" | "pair";
  accent: string;
  media: MediaItem[];
};

export const CONTACT = {
  email: "ashishsimhadri123@gmail.com",
  phone: "7075844545",
};

const P = "/assets/placeholders";

export const DOMAINS: Domain[] = [
  {
    id: "blender",
    cardTitle: "Blender",
    cardSub: "3D Modeling & Animation",
    badge: "3D Modeling",
    heading: "3D Modelling & Blender",
    paragraphs: [
      "I create 3D models and visual experiences using Blender, combining modelling, texturing, lighting, and rendering to bring ideas into a digital space. My work focuses on creating visually engaging assets while paying attention to form, detail, composition, and presentation.",
      "I enjoy exploring 3D as a way to turn concepts into tangible visuals from designing individual assets and environments to experimenting with different styles, materials, and lighting setups. Through my work, I continue to develop my skills in 3D modelling, scene creation, rendering, and visual storytelling.",
    ],
    cta: "Explore projects",
    layout: "quad",
    accent: "#7a3b22",
    media: [1, 2, 3, 4].map((n) => ({
      type: "image" as const,
      src: `${P}/blender-${n}.jpg`,
      alt: `Blender 3D render ${n}`,
      label: `Render ${n}`,
    })),
  },
  {
    id: "unreal",
    cardTitle: "Unreal Engine",
    cardSub: "Game Dev",
    badge: "Game Development",
    heading: "Game Development & Unreal Engine",
    paragraphs: [
      "I explore game development using Unreal Engine, combining 3D environments, interactive elements, and visual design to create immersive digital experiences. I’m interested in how gameplay, visuals, sound, and environment design come together to build engaging worlds.",
      "My work involves experimenting with Unreal Engine, 3D assets, level design, materials, lighting, and interactive systems, while developing a stronger understanding of the game development pipeline. I enjoy turning creative concepts into playable experiences and exploring new ways to make digital environments feel more dynamic and immersive.",
    ],
    cta: "Explore projects",
    layout: "pair",
    accent: "#6b1f2e",
    media: [
      { type: "video", src: `${P}/unreal-gameplay.mp4`, alt: "Unreal Engine gameplay video", label: "Gameplay" },
      { type: "image", src: `${P}/unreal-shot.jpg`, alt: "Unreal Engine screenshot", label: "Screenshot" },
    ],
  },
  {
    id: "editing",
    cardTitle: "Video Editing",
    cardSub: "DaVinci Resolve",
    badge: "Post-production",
    heading: "Video Editing & DaVinci Resolve",
    paragraphs: [
      "I work with DaVinci Resolve to transform raw footage into engaging visual stories. My editing process focuses on creating strong pacing, smooth transitions, effective sound design, and a visual style that supports the mood and message of each project.",
      "I enjoy experimenting with editing, colour grading, visual effects, motion, and storytelling, while paying attention to the small details that make a video feel polished. From short-form content and creative projects to presentations and films, I use editing as a way to turn ideas and footage into compelling visual experiences.",
    ],
    cta: "View media",
    layout: "pair",
    accent: "#244a38",
    media: [
      { type: "video", src: `${P}/editing-showreel.mp4`, alt: "Video editing showreel", label: "Showreel" },
      { type: "image", src: `${P}/editing-frame.jpg`, alt: "Edited frame", label: "Frame" },
    ],
  },
  {
    id: "pygame",
    cardTitle: "Python Game Dev",
    cardSub: "Pygame",
    badge: "Python",
    heading: "Game Development & Pygame",
    paragraphs: [
      "I use Python and Pygame to explore the fundamentals of game development and interactive programming. Through building small games and prototypes, I work with concepts such as game logic, player movement, collision detection, input handling, animations, and game mechanics.",
      "Pygame has helped me understand how code can be transformed into interactive experiences. I enjoy experimenting with different mechanics and ideas while developing my programming skills and learning how the different systems of a game work together.",
    ],
    cta: "Explore projects",
    layout: "pair",
    accent: "#6b5326",
    media: [
      { type: "video", src: `${P}/pygame-demo.mp4`, alt: "Pygame demo video", label: "Demo" },
      { type: "image", src: `${P}/pygame-ss.jpg`, alt: "Pygame screenshot", label: "Screenshot" },
    ],
  },
];
