import { create } from "zustand";
import { FreeFormElement, ShotRendererProps, defaultVariants } from "@landingreel/ui";

export interface ReelState {
  shots: Omit<ShotRendererProps, "isActive">[];
  setShots: (shots: Omit<ShotRendererProps, "isActive">[]) => void;
  updateShot: (id: string, updates: Partial<Omit<ShotRendererProps, "isActive">>) => void;
  updateElement: (shotId: string, elementId: string, updates: Partial<FreeFormElement>) => void;
  reorderShots: (activeId: string, overId: string) => void;
  setActiveIndex: (index: number) => void;
  activeIndex: number;
  applyVariantToSlide: (shotId: string, variantId: string) => void;
}

const initialShots: Omit<ShotRendererProps, "isActive">[] = [
  // ... initialShots ...
];

export const useReelStore = create<ReelState>((set) => ({
  shots: [], // We expect to load it from Supabase
  activeIndex: 0,
  setShots: (shots) => set({ shots }),
  setActiveIndex: (index) => set({ activeIndex: index }),
  updateShot: (id, updates) =>
    set((state) => ({
      shots: state.shots.map((shot) =>
        shot.id === id ? { ...shot, ...updates } : shot
      ),
    })),
  updateElement: (shotId, elementId, updates) =>
    set((state) => ({
      shots: state.shots.map((shot) => {
        if (shot.id !== shotId) return shot;
        
        return {
          ...shot,
          shotData: {
            ...shot.shotData,
            elements: shot.shotData?.elements?.map(el => 
              el.id === elementId ? { ...el, ...updates } : el
            )
          }
        };
      }),
    })),
  reorderShots: (activeId, overId) =>
    set((state) => {
      const oldIndex = state.shots.findIndex((s) => s.id === activeId);
      const newIndex = state.shots.findIndex((s) => s.id === overId);
      if (oldIndex === -1 || newIndex === -1) return state;

      const newShots = [...state.shots];
      const [moved] = newShots.splice(oldIndex, 1);
      newShots.splice(newIndex, 0, moved);

      return { shots: newShots };
    }),
  applyVariantToSlide: (shotId, variantId) =>
    set((state) => {
      const variant = defaultVariants.find((v) => v.id === variantId);
      if (!variant) return state;

      return {
        shots: state.shots.map((shot) => {
          if (shot.id !== shotId) return shot;

          const currentElements = shot.shotData?.elements || [];

          // Elements that match the new variant by role
          const newElements = variant.elements.map((templateEl) => {
            const existingElement = currentElements.find(
              (el) => el.role === templateEl.role
            );

            if (existingElement) {
              // Update existing element spatial properties
              return {
                ...existingElement,
                x: templateEl.x,
                y: templateEl.y,
                width: templateEl.width,
                height: templateEl.height || existingElement.height,
                fontSize: templateEl.fontSize || existingElement.fontSize,
                fontWeight: templateEl.fontWeight || existingElement.fontWeight,
                textAlign: templateEl.textAlign || existingElement.textAlign,
                color: templateEl.color || existingElement.color
              };
            } else {
              // Create new element from template
              return {
                id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                role: templateEl.role,
                type: templateEl.type,
                x: templateEl.x,
                y: templateEl.y,
                width: templateEl.width,
                height: templateEl.height,
                fontSize: templateEl.fontSize,
                fontWeight: templateEl.fontWeight,
                textAlign: templateEl.textAlign,
                color: templateEl.color,
                content: templateEl.type === 'text' ? 'Nuevo Texto' : 'Click Aquí', // Default generic content
              } as FreeFormElement;
            }
          });

          // Optional: we completely drop old currentElements that don't fit the variant to keep it clean.

          return {
            ...shot,
            shotData: {
              ...shot.shotData,
              elements: newElements,
            },
          };
        }),
      };
    }),
}));
