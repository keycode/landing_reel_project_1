"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Moveable from "react-moveable";
import { useReelStore } from "@landingreel/store";
import { DraggableList, SortableItem, Input, Button, defaultVariants } from "@landingreel/ui";
import { createClient } from "../../../utils/supabase/client";
import { useParams } from "next/navigation";

export default function EditorPage() {
  const { shots, setShots, updateShot, updateElement, reorderShots, activeIndex, setActiveIndex, applyVariantToSlide } = useReelStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [editingElementId, setEditingElementId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const params = useParams();
  const rawId = params?.id as string;
  const initialId = rawId === 'new' ? `view-${Date.now()}` : rawId;
  const [reelId] = useState(initialId || 'view-1');
  const initialized = useRef(false);

  // Load from Supabase
  useEffect(() => {
    async function loadData() {
      if (rawId === 'new') {
        // If it's a new reel, we can start with empty or default shots.
        // Assuming the store already has valid initial or mock data when empty,
        // or we could set up an initial template here.
        setShots([{ id: "slide-1", type: "text", shotData: { elements: [], navLabel: "Slide 1" } }]);
      } else {
        const { data, error } = await supabase.from('landing_reels').select('*').eq('id', reelId).single();
        if (data && data.content_data) {
          setShots(data.content_data);
        }
      }
      initialized.current = true;
      setIsLoading(false);
    }
    loadData();
  }, [reelId, rawId]);

  // Sync activeIndex downstream to iframe
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: "SET_SLIDE", index: activeIndex }, "*");
    }
  }, [activeIndex]);

  // Sync shot changes downstream to iframe and save to Supabase
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: "UPDATE_SHOTS", shots }, "*");
    }
    if (initialized.current && shots && shots.length > 0) {
      const timeout = setTimeout(() => {
        supabase.from('landing_reels').upsert({ id: reelId, content_data: shots }).then();
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [shots]);

  // Sync editingElementId to iframe
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: "SET_EDITING_ELEMENT", id: editingElementId }, "*");
    }
  }, [editingElementId]);

  // Listen to upstream scroll events or mount ready pings from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "SLIDE_CHANGED" && typeof event.data.index === "number") {
        if (event.data.index !== activeIndex) {
          setActiveIndex(event.data.index);
        }
      } else if (event.data?.type === "IFRAME_READY") {
        // Hydrate the visual frame manually once the remote Astro container spins up
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: "UPDATE_SHOTS", shots }, "*");
          iframeRef.current.contentWindow.postMessage({ type: "SET_SLIDE", index: activeIndex }, "*");
          iframeRef.current.contentWindow.postMessage({ type: "SET_EDITING_ELEMENT", id: editingElementId }, "*");
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [activeIndex, setActiveIndex, shots]);

  return (
    <div className="flex flex-col lg:flex-row w-full h-dvh overflow-hidden bg-white text-black font-sans">
      
      {/* Sidebar: Left side on desktop, Bottom on mobile */}
      <aside className="w-full lg:w-[30%] h-[50dvh] lg:h-full border-t lg:border-t-0 lg:border-r border-neutral-200 bg-neutral-50 flex flex-col order-2 lg:order-1 relative z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] lg:shadow-none transition-all duration-300">
        <div className="p-4 border-b border-neutral-200 bg-white">
          <h1 className="text-xl font-bold tracking-tight text-neutral-900">LandingReel Editor</h1>
          <p className="text-sm text-neutral-500">Reorder and edit your interactive shots.</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <DraggableList items={shots.map(s => s.id)} onReorder={reorderShots}>
            {(id, index) => {
              const shot = shots.find((s) => s.id === id);
              if (!shot) return null;
              const isActive = activeIndex === index;
              
              return (
                <SortableItem key={id} id={id}>
                  <div 
                    className={`p-4 mb-2 border rounded-xl bg-white shadow-sm transition-all cursor-pointer hover:border-neutral-400 ${isActive ? 'ring-2 ring-neutral-900 border-neutral-900' : 'border-neutral-200'}`}
                    onClick={() => setActiveIndex(index)}
                  >
                    <div className="flex items-center justify-between pointer-events-none">
                      <div className="font-semibold text-neutral-800">
                        {shot.shotData?.navLabel || `Slide ${index + 1}`}
                      </div>
                      <div className="text-xs font-mono bg-neutral-100 text-neutral-500 px-2 py-1 rounded">
                        {shot.type}
                      </div>
                    </div>
                  </div>
                </SortableItem>
              );
            }}
          </DraggableList>

          <div className="mt-8 border-t border-neutral-200 pt-6">
            <h2 className="text-lg font-bold mb-4">Edit Current Slide</h2>
            {shots[activeIndex] && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Navigation Label
                  </label>
                  <Input 
                    value={shots[activeIndex].shotData?.navLabel || ""} 
                    onChange={(e) => updateShot(shots[activeIndex].id, { 
                      shotData: { ...shots[activeIndex].shotData, navLabel: e.target.value } 
                    })} 
                    placeholder="e.g. Intro, Features"
                  />
                </div>
                
                <div className="pt-4 border-t border-neutral-200">
                  <h3 className="font-semibold text-neutral-800 mb-2">Select Layout</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 mb-6">
                    {defaultVariants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => applyVariantToSlide(shots[activeIndex].id, variant.id)}
                        className="px-2 py-3 text-xs font-semibold bg-white border border-neutral-200 rounded-lg shadow-sm hover:border-primary hover:text-primary transition-all flex flex-col items-center justify-center gap-1"
                      >
                        <span className="opacity-50 text-lg">✨</span>
                        <span className="text-center leading-tight">{variant.name}</span>
                      </button>
                    ))}
                  </div>
                  
                  <h3 className="font-semibold text-neutral-800 mb-4">Elements</h3>
                  {shots[activeIndex].shotData?.elements?.map((el, idx) => (
                    <div 
                      key={el.id} 
                      className={`p-3 border rounded-lg mb-3 transition-colors ${selectedElementId === el.id ? 'border-neutral-900 bg-neutral-100' : 'border-neutral-200'}`}
                      onClick={() => setSelectedElementId(el.id)}
                    >
                      <label className="text-sm font-medium text-neutral-700 mb-1 flex justify-between w-full">
                        <span>Element {idx + 1} ({el.type})</span>
                      </label>
                      <Input 
                        value={el.role || ""} 
                        onChange={(e) => updateElement(shots[activeIndex].id, el.id, { role: e.target.value })} 
                        placeholder={`Role (e.g. primary-text)`}
                        className="mb-2 text-xs text-neutral-500 bg-neutral-50/50"
                      />
                      <Input 
                        value={el.content} 
                        onChange={(e) => updateElement(shots[activeIndex].id, el.id, { content: e.target.value })} 
                        placeholder={`Edit ${el.type} content...`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Editor Canvas: Central area, mobile simulator */}
      <main className="w-full lg:w-[70%] h-[50dvh] lg:h-full bg-neutral-100 flex items-center justify-center p-4 lg:p-12 order-1 lg:order-2 overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none" />
        
        {/* Mobile 9:16 simulator frame */}
        <div className="relative w-full max-w-[400px] aspect-9/16 bg-white rounded-[40px] shadow-2xl overflow-hidden border-8 border-neutral-300 z-10 flex flex-col shadow-neutral-300/50">
          <div className="absolute top-0 inset-x-0 h-6 z-50 flex justify-center mt-2 pointer-events-none">
            <div className="w-24 h-6 bg-neutral-300 rounded-b-xl rounded-t-sm" />
          </div>
          <div className="flex-1 w-full relative overflow-hidden bg-white pb-8">
            {isLoading ? (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-white">
                <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              <>
                <iframe
                  ref={iframeRef}
                  src="http://localhost:4321/draft"
                  className="w-full h-full border-0 absolute inset-0 bg-neutral-900"
                  allow="autoplay; fullscreen"
                  loading="lazy"
                  title="Live Mobile Preview"
                />

             {/* Moveable Editor Canvas Overlay */}
             <div className="absolute inset-0 z-50 pointer-events-none">
                {shots[activeIndex]?.shotData?.elements?.map(el => {
                  const isEditing = editingElementId === el.id;
                  return (
                  <div
                    key={el.id}
                    id={`editor-el-${el.id}`}
                    className={`absolute pointer-events-auto leading-tight transition-colors ${
                      isEditing ? 'border-2 border-primary cursor-text' : 
                      selectedElementId === el.id ? 'border-2 border-primary bg-primary/10 cursor-move' : 'border-2 border-transparent hover:border-primary/50 cursor-move'
                    }`}
                    onClick={() => {
                        if (!isEditing) setSelectedElementId(el.id);
                    }}
                    onDoubleClick={() => {
                        setSelectedElementId(el.id);
                        setEditingElementId(el.id);
                    }}
                    style={{
                      left: el.x,
                      top: el.y,
                      width: el.width,
                      height: el.height || 'auto',
                      minHeight: '2rem',
                      fontSize: el.fontSize || "1.5rem",
                      fontWeight: el.fontWeight || "bold",
                      textAlign: el.textAlign || "left",
                      color: el.color || (el.type === 'button' ? '#000000' : '#ffffff'),
                      display: el.type === 'button' ? 'flex' : 'block',
                      alignItems: el.type === 'button' ? 'center' : 'initial',
                      justifyContent: el.type === 'button' ? 'center' : 'initial'
                    }}
                  >
                    {/* Render the content editably with full opacity when editing, invisibly otherwise */}
                    <div 
                      className={`${isEditing ? 'opacity-100 outline-none' : 'opacity-0 pointer-events-none select-none'} w-full h-full wrap-break-word`}
                      contentEditable={isEditing}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        setEditingElementId(null);
                        updateElement(shots[activeIndex].id, el.id, { content: e.currentTarget.innerText });
                      }}
                      ref={(elNode) => {
                        if (isEditing && elNode && document.activeElement !== elNode) {
                          elNode.focus();
                          const selection = window.getSelection();
                          const range = document.createRange();
                          if (selection && elNode.childNodes.length > 0) {
                              range.selectNodeContents(elNode);
                              range.collapse(false);
                              selection.removeAllRanges();
                              selection.addRange(range);
                          }
                        }
                      }}
                    >
                      {el.content}
                    </div>
                  </div>
                )})}

                {selectedElementId && (
                  <Moveable
                    target={`#editor-el-${selectedElementId}`}
                    draggable={editingElementId !== selectedElementId}
                    resizable={editingElementId !== selectedElementId}
                    keepRatio={false}
                    snappable={true}
                    bounds={{ left: 0, top: 0, right: 0, bottom: 0, position: "css" }}
                    onDrag={({ target, left, top }) => {
                      const parent = target.parentElement;
                      if (!parent) return;
                      const rect = parent.getBoundingClientRect();
                      
                      const xPercent = (left / rect.width) * 100;
                      const yPercent = (top / rect.height) * 100;
                      
                      target.style.left = `${xPercent}%`;
                      target.style.top = `${yPercent}%`;
                      
                      updateElement(shots[activeIndex].id, selectedElementId, { 
                        x: `${xPercent.toFixed(2)}%`, 
                        y: `${yPercent.toFixed(2)}%` 
                      });
                    }}
                    onResize={({ target, width, height, drag }) => {
                      const parent = target.parentElement;
                      if (!parent) return;
                      const rect = parent.getBoundingClientRect();
                      
                      const widthPercent = (width / rect.width) * 100;
                      const xPercent = (drag.left / rect.width) * 100;
                      const yPercent = (drag.top / rect.height) * 100;

                      target.style.width = `${widthPercent}%`;
                      target.style.left = `${xPercent}%`;
                      target.style.top = `${yPercent}%`;
                      
                      updateElement(shots[activeIndex].id, selectedElementId, { 
                        width: `${widthPercent.toFixed(2)}%`,
                        x: `${xPercent.toFixed(2)}%`, 
                        y: `${yPercent.toFixed(2)}%`,
                      });
                    }}
                  />
                )}
             </div>
              </>
            )}
          </div>
        </div>
      </main>
      
    </div>
  );
}
