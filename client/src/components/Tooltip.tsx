import React, { useState, useRef, createContext, useContext, ReactNode, useEffect } from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingArrow,
  arrow,
  useDelayGroup,
  FloatingPortal
} from '@floating-ui/react';

// Create a context to manage the global tooltip state
type ContextualTipsContextType = {
  hasSeenTips: boolean;
  markTipSeen: (id: string) => void;
  getTipShown: (id: string) => boolean;
};

const ContextualTipsContext = createContext<ContextualTipsContextType>({
  hasSeenTips: false,
  markTipSeen: () => {},
  getTipShown: () => false
});

// Provider component to wrap the app
export function ContextualTipsProvider({ children }: { children: ReactNode }) {
  const [seenTips, setSeenTips] = useState<Record<string, boolean>>(() => {
    // Check localStorage to see if user has seen tips before
    const saved = localStorage.getItem('bloom-invoice-seen-tips');
    return saved ? JSON.parse(saved) : {};
  });

  const hasSeenTips = Object.keys(seenTips).length > 0;

  const markTipSeen = (id: string) => {
    setSeenTips(prev => {
      const updated = { ...prev, [id]: true };
      localStorage.setItem('bloom-invoice-seen-tips', JSON.stringify(updated));
      return updated;
    });
  };

  const getTipShown = (id: string) => {
    return !!seenTips[id];
  };

  return (
    <ContextualTipsContext.Provider value={{ hasSeenTips, markTipSeen, getTipShown }}>
      {children}
    </ContextualTipsContext.Provider>
  );
}

// Hook to access contextual tips context
export function useContextualTips() {
  return useContext(ContextualTipsContext);
}

// Prop types for the ContextualTip component
interface ContextualTipProps {
  content: string;
  children: ReactNode;
  className?: string;
  id: string;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  delayIn?: number;
  delayOut?: number;
  firstTimeOnly?: boolean; // Only show for first-time users
  alwaysShow?: boolean; // Always show this tip regardless of first-time status
}

export function ContextualTip({
  content,
  children,
  className = '',
  id,
  placement = 'top',
  delayIn = 100,
  delayOut = 500,
  firstTimeOnly = true,
  alwaysShow = false
}: ContextualTipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);
  const { hasSeenTips, markTipSeen, getTipShown } = useContextualTips();
  
  // Determine if this tooltip should be shown
  const shouldShow = alwaysShow || !firstTimeOnly || (firstTimeOnly && !hasSeenTips) || (firstTimeOnly && !getTipShown(id));

  const { x, y, strategy, refs, context } = useFloating({
    open: isOpen && shouldShow,
    onOpenChange: setIsOpen,
    placement,
    middleware: [
      offset(8),
      flip(),
      shift(),
      arrow({ element: arrowRef })
    ],
    whileElementsMounted: autoUpdate
  });

  // Connect interaction hooks to the floating context
  const hover = useHover(context, { delay: { open: delayIn, close: delayOut } });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  // Mark tooltip as seen when it opens
  useEffect(() => {
    if (isOpen && firstTimeOnly && !getTipShown(id)) {
      const timer = setTimeout(() => markTipSeen(id), 1000); // Mark as seen after 1 second
      return () => clearTimeout(timer);
    }
  }, [isOpen, firstTimeOnly, id, getTipShown, markTipSeen]);

  return (
    <>
      <div 
        ref={refs.setReference} 
        {...getReferenceProps()} 
        className={`contextual-tip-trigger ${className}`}
      >
        {children}
      </div>
      {shouldShow && (
        <FloatingPortal>
          {isOpen && (
            <div
              ref={refs.setFloating}
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                zIndex: 999,
                width: 'max-content',
                maxWidth: '250px',
                transformOrigin: `${placement === 'top' || placement === 'bottom' ? 'center' : placement === 'left' ? 'right' : 'left'} ${placement === 'left' || placement === 'right' ? 'center' : placement === 'top' ? 'bottom' : 'top'}`
              }}
              {...getFloatingProps()}
              className="bg-primary text-white text-xs rounded py-1.5 px-2.5 shadow-md animate-in fade-in duration-200"
            >
              <FloatingArrow
                ref={arrowRef}
                context={context}
                fill="currentColor"
                className="text-primary"
              />
              {content}
            </div>
          )}
        </FloatingPortal>
      )}
    </>
  );
}