import { useEffect, useRef, useState, type ReactNode } from "react";

interface DeferredRenderProps {
  children: ReactNode;
  minHeight?: string;
  className?: string;
  id?: string;
}

const DeferredRender = ({ children, minHeight = "720px", className = "", id }: DeferredRenderProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || ready) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setReady(true);
      observer.disconnect();
    }, { rootMargin: "700px 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, [ready]);

  return (
    <div ref={ref} id={id} className={className} style={ready ? undefined : { minHeight }}>
      {ready ? children : null}
    </div>
  );
};

export default DeferredRender;