import {
  useState,
  type ReactNode,
  createContext,
  type Dispatch,
  type SetStateAction,
  useContext,
  type FC
} from 'react';
import { ViewerTitle } from '~/components/viewer-toolbar';

export type ViewerDataPosition = {
  x: number;
  y: number;
};

export type ViewerDataDimension = {
  width: number;
  height: number;
};

export type ViewerDataState = {
  maximize?: boolean;
  minimize?: boolean;
  hidden?: boolean;
};

export type CustomComponentProps = Partial<ReturnType<typeof useCurrentViewer>>;
export type CustomComponent = FC<CustomComponentProps>;

export type ViewerData = {
  id: string;
  title?: ReactNode | CustomComponent;
  children?: ReactNode | CustomComponent;
  position: ViewerDataPosition;
  dimension: ViewerDataDimension;
  state?: ViewerDataState;
};

const initialViewersData: ViewerData[] = [
  {
    id: 'playlist',
    title: ViewerTitle,
    children: 'Drag/Resize viewer',
    position: {
      x: 0,
      y: 0
    },
    dimension: {
      width: 300,
      height: 200
    }
  }
];

type ViewerDataCtxProps = {
  viewers: ViewerData[];
  setViewers: Dispatch<SetStateAction<ViewerData[]>>;
};

let ViewerDataCtx = createContext<ViewerDataCtxProps | null>(null);

type ViewerDataProviderProps = {
  children: ReactNode;
};

export function ViewerDataProvider({ children }: ViewerDataProviderProps) {
  let [viewers, setViewers] = useState<ViewerData[]>(initialViewersData);

  return (
    <ViewerDataCtx.Provider
      value={{ viewers, setViewers }}
      children={children}
    />
  );
}

export function useViewerData() {
  let ctx = useContext(ViewerDataCtx);

  if (!ctx) {
    throw new Error('`useViewerData` must be used within ViewerDataProvider');
  }

  return ctx;
}

export function useCurrentViewer(id: string) {
  let { viewers, setViewers } = useViewerData();
  let currentIndex = viewers?.findIndex(viewer => viewer.id === id);

  if (currentIndex === -1) {
    return null;
  }

  let current = viewers[currentIndex];

  function update(data: Partial<ViewerData>) {
    let clone = {
      ...current,
      ...data,
      position: { ...current?.position, ...data?.position },
      dimension: { ...current?.dimension, ...data?.dimension },
      state: { ...current?.state, ...data?.state }
    };
    let next =
      viewers?.map(viewer => (viewer.id === current.id ? clone : viewer)) ?? [];

    return setViewers(next);
  }

  return {
    current,
    update
  };
}
