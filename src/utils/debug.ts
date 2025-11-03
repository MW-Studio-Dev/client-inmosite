/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Sistema de Debug Avanzado para rastrear errores de React DOM
 * Especialmente útil para errores como "Cannot read properties of null (reading 'removeChild')"
 */

// Colores para los logs
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

interface DebugPoint {
  component: string;
  method: string;
  line?: number;
  file?: string;
  timestamp: number;
  data?: any;
}

class DebugTracker {
  private static instance: DebugTracker;
  private points: DebugPoint[] = [];
  private maxPoints = 100;
  private enabled = true;

  private constructor() {
    this.setupErrorHandler();
  }

  static getInstance(): DebugTracker {
    if (!DebugTracker.instance) {
      DebugTracker.instance = new DebugTracker();
    }
    return DebugTracker.instance;
  }

  private setupErrorHandler() {
    if (typeof window === 'undefined') return;

    // Capturar errores de React
    const originalError = console.error;
    console.error = (...args: any[]) => {
      // Detectar el error específico de removeChild
      const errorString = args.join(' ');
      if (errorString.includes('removeChild') || errorString.includes('Cannot read properties of null')) {
        console.group('🔴🔴🔴 CRITICAL ERROR DETECTED 🔴🔴🔴');
        console.error('Error:', ...args);
        console.log('📍 Last 20 execution points before error:');
        this.printLastPoints(20);
        console.groupEnd();
      }
      originalError.apply(console, args);
    };

    // Capturar errores no manejados
    window.addEventListener('error', (event) => {
      if (event.error?.message?.includes('removeChild')) {
        console.group('🔴 UNHANDLED ERROR - removeChild');
        console.error('Error:', event.error);
        console.log('File:', event.filename);
        console.log('Line:', event.lineno);
        console.log('Column:', event.colno);
        console.log('\n📍 Execution trace:');
        this.printLastPoints(30);
        console.groupEnd();
      }
    });
  }

  track(component: string, method: string, data?: any, file?: string, line?: number) {
    if (!this.enabled) return;

    const point: DebugPoint = {
      component,
      method,
      timestamp: Date.now(),
      data,
      file,
      line
    };

    this.points.push(point);

    // Mantener solo los últimos maxPoints
    if (this.points.length > this.maxPoints) {
      this.points.shift();
    }

    // Log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      const location = file && line ? ` [${file}:${line}]` : '';
      console.log(
        `%c▶ ${component}.${method}${location}`,
        'color: #4CAF50; font-weight: bold;',
        data || ''
      );
    }
  }

  printLastPoints(count: number = 20) {
    const lastPoints = this.points.slice(-count);

    console.log('\n📊 Execution Timeline:\n');

    lastPoints.forEach((point, index) => {
      const relativeTime = index > 0
        ? `+${point.timestamp - lastPoints[index - 1].timestamp}ms`
        : 'START';

      const location = point.file && point.line
        ? `${point.file}:${point.line}`
        : 'unknown';

      console.log(
        `${index + 1}. [${relativeTime.padStart(8)}] %c${point.component}%c.%c${point.method}%c @ ${location}`,
        'color: #2196F3; font-weight: bold',
        'color: #666',
        'color: #FF9800; font-weight: bold',
        'color: #666',
        point.data || ''
      );
    });
  }

  clear() {
    this.points = [];
  }

  getPoints() {
    return [...this.points];
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }
}

// Singleton instance
export const debugTracker = DebugTracker.getInstance();

// Helper functions para usar en componentes
export const trackMount = (componentName: string, file?: string, line?: number) => {
  debugTracker.track(componentName, 'MOUNT', undefined, file, line);
};

export const trackUnmount = (componentName: string, file?: string, line?: number) => {
  debugTracker.track(componentName, 'UNMOUNT', undefined, file, line);
};

export const trackRender = (componentName: string, data?: any, file?: string, line?: number) => {
  debugTracker.track(componentName, 'RENDER', data, file, line);
};

export const trackEffect = (componentName: string, effectName: string, data?: any, file?: string, line?: number) => {
  debugTracker.track(componentName, `useEffect[${effectName}]`, data, file, line);
};

export const trackNavigation = (from: string, to: string, file?: string, line?: number) => {
  debugTracker.track('Navigation', `${from} → ${to}`, undefined, file, line);
};

export const trackDOMOperation = (operation: string, element: string, file?: string, line?: number) => {
  debugTracker.track('DOM', operation, { element }, file, line);
};

// Macro para obtener el archivo y línea automáticamente (requiere babel plugin en producción)
export const createDebugger = (componentName: string) => {
  return {
    mount: (file?: string, line?: number) => trackMount(componentName, file, line),
    unmount: (file?: string, line?: number) => trackUnmount(componentName, file, line),
    render: (data?: any, file?: string, line?: number) => trackRender(componentName, data, file, line),
    effect: (name: string, data?: any, file?: string, line?: number) => trackEffect(componentName, name, data, file, line),
    track: (method: string, data?: any, file?: string, line?: number) =>
      debugTracker.track(componentName, method, data, file, line),
  };
};

// Pretty print para debugging
export const debugLog = (label: string, data: any) => {
  console.group(`🔍 ${label}`);
  console.log(data);
  console.groupEnd();
};

// Wrapper para componentes
export const withDebug = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
): React.ComponentType<P> => {
  return (props: P) => {
    const debug = createDebugger(componentName);

    React.useEffect(() => {
      debug.mount(__filename, new Error().stack?.split('\n')[2]?.match(/:(\d+):/)?.[1] as any);
      return () => {
        debug.unmount(__filename, new Error().stack?.split('\n')[2]?.match(/:(\d+):/)?.[1] as any);
      };
    }, []);

    debug.render();

    return React.createElement(Component, props);
  };
};

// Export del tracker para uso global
export default debugTracker;
