import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';

import type { RootState, AppDispatch } from 'src/redux/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
