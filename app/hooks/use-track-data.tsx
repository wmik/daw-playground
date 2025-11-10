import {
  useState,
  type ReactNode,
  createContext,
  type Dispatch,
  type SetStateAction,
  useContext,
  type FC
} from 'react';

export type TrackDataPosition = {
  x?: number;
  y?: number;
};

export type TrackDataDimension = {
  width?: number;
  height?: number;
};

export type TrackDataState = {
  maximize?: boolean;
  minimize?: boolean;
  hidden?: boolean;
};

export type TrackDataRange = {
  width: [number, number];
  height: [number, number];
};

export type CustomComponentProps = Partial<ReturnType<typeof useCurrentTrack>>;
export type CustomComponent = FC<CustomComponentProps>;

export type TrackData = {
  id: string;
  title?: ReactNode | CustomComponent;
  children?: ReactNode | CustomComponent;
  position?: TrackDataPosition;
  dimension?: TrackDataDimension;
  state?: TrackDataState;
  range?: TrackDataRange;
};

const initialTracksData: TrackData[] = [
  {
    id: Math.random().toString(32).substring(2),
    title: 'Track 1',
    children: null,
    position: {
      x: 100,
      y: 100
    },
    dimension: {
      width: 800,
      height: 500
    },
    range: {
      width: [500, Infinity],
      height: [300, Infinity]
    }
  }
];

type TrackDataCtxProps = {
  tracks: TrackData[];
  setTracks: Dispatch<SetStateAction<TrackData[]>>;
};

let TrackDataCtx = createContext<TrackDataCtxProps | null>(null);

type TrackDataProviderProps = {
  children: ReactNode;
};

export function TrackDataProvider({ children }: TrackDataProviderProps) {
  let [tracks, setTracks] = useState<TrackData[]>(initialTracksData);

  return (
    <TrackDataCtx.Provider value={{ tracks, setTracks }} children={children} />
  );
}

export function useTrackData() {
  let ctx = useContext(TrackDataCtx);

  if (!ctx) {
    throw new Error('`useTrackData` must be used within TrackDataProvider');
  }

  return ctx;
}

export function useCurrentTrack(id: string) {
  let { tracks, setTracks } = useTrackData();
  let currentIndex = tracks?.findIndex(track => track.id === id);

  if (currentIndex === -1) {
    return null;
  }

  let current = tracks[currentIndex];

  function update(data: Partial<TrackData>) {
    let clone = {
      ...current,
      ...data,
      position: { ...current?.position, ...data?.position },
      dimension: { ...current?.dimension, ...data?.dimension },
      state: { ...current?.state, ...data?.state }
    };
    let next =
      tracks?.map(track => (track.id === current.id ? clone : track)) ?? [];

    return setTracks(next);
  }

  return {
    current,
    update
  };
}
