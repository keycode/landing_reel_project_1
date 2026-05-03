import React from "react";
import type { ShotRendererProps } from "@landingreel/ui";

export const getMockShots = (): Omit<ShotRendererProps, "isActive">[] => [
  {
    id: "shot_1",
    type: "video" as const,
    backgroundUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    shotData: {
      elements: [
        {
          id: "el-a",
          type: "text",
          content: "Villas Sunset",
          x: "10%",
          y: "60%",
          width: "80%",
          fontSize: "2.5rem",
          fontWeight: "800"
        },
        {
          id: "el-b",
          type: "text",
          content: "Scrollytelling Experience",
          x: "10%",
          y: "75%",
          width: "80%",
          fontSize: "1.25rem"
        }
      ]
    }
  },
  {
    id: "shot_2",
    type: "image" as const,
    backgroundUrl: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg",
    shotData: {
      elements: [
        {
          id: "el-c",
          type: "text",
          content: "Sustainable",
          x: "10%",
          y: "55%",
          width: "80%",
          fontSize: "2.5rem",
          fontWeight: "bold"
        },
        {
          id: "el-d",
          type: "text",
          content: "Integrated harmoniously with nature, pushing boundaries but respecting origins.",
          x: "10%",
          y: "70%",
          width: "80%",
          fontSize: "1.125rem",
        }
      ]
    }
  },
  {
    id: "shot_3",
    type: "interactive" as const,
    backgroundUrl: "",
    shotData: {
      elements: [
        {
          id: "el-e",
          type: "text",
          content: "Discover More",
          x: "0%",
          y: "40%",
          width: "100%",
          fontSize: "2.5rem",
          fontWeight: "bold",
          textAlign: "center"
        },
        {
          id: "el-f",
          type: "button",
          content: "Book a Tour",
          x: "10%",
          y: "60%",
          width: "80%",
          height: "4rem"
        }
      ]
    }
  }
];
