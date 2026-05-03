import { FreeFormElement } from "../components/ShotRenderer";

export interface VariantTemplate {
  id: string;
  name: string;
  icon?: string; // Optional icon identifier
  elements: Omit<FreeFormElement, "id" | "content">[]; // Define positions, roles, types, without specific content or instance IDs
}

export const defaultVariants: VariantTemplate[] = [
  {
    id: "hero-centered",
    name: "Hero Centered",
    icon: "align-center",
    elements: [
      {
        role: "primary-text",
        type: "text",
        x: "10%",
        y: "40%",
        width: "80%",
        fontSize: "2.5rem",
        fontWeight: "800",
        textAlign: "center",
        color: "#ffffff"
      },
      {
        role: "secondary-text",
        type: "text",
        x: "10%",
        y: "55%",
        width: "80%",
        fontSize: "1.125rem",
        fontWeight: "400",
        textAlign: "center",
        color: "rgba(255,255,255,0.8)"
      },
      {
        role: "button-cta",
        type: "button",
        x: "10%",
        y: "75%",
        width: "80%",
        height: "3.5rem",
        fontSize: "1.125rem",
        color: "#000000"
      }
    ]
  },
  {
    id: "hero-bottom",
    name: "Hero Bottom",
    icon: "align-bottom",
    elements: [
      {
        role: "primary-text",
        type: "text",
        x: "5%",
        y: "65%",
        width: "90%",
        fontSize: "2rem",
        fontWeight: "700",
        textAlign: "left",
        color: "#ffffff"
      },
      {
        role: "secondary-text",
        type: "text",
        x: "5%",
        y: "75%",
        width: "90%",
        fontSize: "1rem",
        fontWeight: "400",
        textAlign: "left",
        color: "rgba(255,255,255,0.9)"
      },
      {
        role: "button-cta",
        type: "button",
        x: "5%",
        y: "85%",
        width: "90%",
        height: "3rem",
        fontSize: "1rem",
        color: "#000000"
      }
    ]
  },
  {
    id: "title-only",
    name: "Title Only",
    icon: "type",
    elements: [
      {
        role: "primary-text",
        type: "text",
        x: "10%",
        y: "30%",
        width: "80%",
        fontSize: "3rem",
        fontWeight: "900",
        textAlign: "center",
        color: "#ffffff"
      }
    ]
  }
];
