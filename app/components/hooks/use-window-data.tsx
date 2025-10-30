import {
  useState,
  type ReactNode,
  createContext,
  type Dispatch,
  type SetStateAction,
  useContext,
  type FC
} from 'react';

export type WindowDataPosition = {
  x: number;
  y: number;
};

export type WindowDataDimension = {
  width: number;
  height: number;
};

type CustomComponent = FC<Partial<ReturnType<typeof useCurrentWindow>>>;

export type WindowData = {
  id: string;
  title?: ReactNode | CustomComponent;
  children?: ReactNode | CustomComponent;
  position: WindowDataPosition;
  dimension: WindowDataDimension;
};

const initialWindowsData: WindowData[] = [
  {
    id: 'drag-resize',
    title: props => {
      return (
        <span
          className='text-[10px] py-4 px-1'
          children={`Dimensions. (${props!.current?.dimension.width} x ${
            props!.current?.dimension.height
          })`}
        />
      );
    },
    children: 'Drag/Resize window',
    position: {
      x: 0,
      y: 0
    },
    dimension: {
      width: 200,
      height: 200
    }
  }
];

type WindowDataCtxProps = {
  windows: WindowData[];
  setWindows: Dispatch<SetStateAction<WindowData[]>>;
};

let WindowDataCtx = createContext<WindowDataCtxProps | null>(null);

type WindowDataProviderProps = {
  children: ReactNode;
};

export function WindowDataProvider({ children }: WindowDataProviderProps) {
  let [windows, setWindows] = useState<WindowData[]>(initialWindowsData);

  return (
    <WindowDataCtx.Provider
      value={{ windows, setWindows }}
      children={children}
    />
  );
}

export function useWindowData() {
  let ctx = useContext(WindowDataCtx);

  if (!ctx) {
    throw new Error('`useWindowData` must be used within WindowDataProvider');
  }

  return ctx;
}

export function useCurrentWindow(id: string) {
  let { windows, setWindows } = useWindowData();
  let currentIndex = windows?.findIndex(window => window.id === id);

  if (currentIndex === -1) {
    return null;
  }

  let current = windows[currentIndex];

  function setDimension(dimension: Partial<WindowDataDimension>) {
    let clone = {
      ...current,
      position: { ...current?.position },
      dimension: { ...current?.dimension, ...dimension }
    };
    let update =
      windows?.map(window => (window.id === current.id ? clone : window)) ?? [];

    return setWindows(update);
  }

  function setPosition(position: Partial<WindowDataPosition>) {
    let clone = {
      ...current,
      position: { ...current?.position, ...position },
      dimension: { ...current?.dimension }
    };
    let update =
      windows?.map(window => (window.id === current.id ? clone : window)) ?? [];

    return setWindows(update);
  }

  function setContent(children: ReactNode) {
    let clone = {
      ...current,
      children,
      position: { ...current?.position },
      dimension: { ...current?.dimension }
    };
    let update =
      windows?.map(window => (window.id === current.id ? clone : window)) ?? [];

    return setWindows(update);
  }

  return {
    current,
    setContent,
    setDimension,
    setPosition
  };
}
