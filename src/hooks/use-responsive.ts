import { useState, useEffect, RefObject } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export function useResponsive<T extends HTMLElement>(containerRef: RefObject<T | null>): DeviceType {
    const [device, setDevice] = useState<DeviceType>('desktop');

    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const width = entry.contentRect.width;
                if (width < 768) {
                    setDevice('mobile');
                } else if (width < 1024) {
                    setDevice('tablet');
                } else {
                    setDevice('desktop');
                }
            }
        });

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [containerRef]);

    return device;
}
