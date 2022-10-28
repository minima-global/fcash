import { StatusState } from './slices/minima/statusSlice';
import { configureStore, ThunkAction, AnyAction } from "@reduxjs/toolkit";
import { ToastState } from './slices/app/toastSlice';
import { MiningState } from "./slices/minima/miningSlice";
import { CoinState, coinMiddleware } from "./slices/minima/coinSlice";
import { balanceMiddleware, BalanceState } from "./slices/minima/balanceSlice";
import { SendFormState } from './slices/app/sendFormSlice';
import { ClipboardState } from './slices/app/clipboardSlice';
import { FutureCoinState } from "./slices/app/futureCoinSlice";
import coinReducer from "./slices/minima/coinSlice";
import toastReducer from './slices/app/toastSlice';
import miningReducer from './slices/minima/miningSlice';
import balanceReducer from './slices/minima/balanceSlice';
import statusReducer from './slices/minima/statusSlice';
import sendFormReducer from './slices/app/sendFormSlice';
import futureCoinReducer from './slices/app/futureCoinSlice';
import clipboardReducer from './slices/app/clipboardSlice';


export type RootState = {
    coins: CoinState;
    mining: MiningState;
    toast: ToastState;
    wallet: BalanceState;
    status: StatusState;
    page: SendFormState;
    clipboard: ClipboardState
    futurepage: FutureCoinState
};

export const store = configureStore({
    reducer: {
        coins: coinReducer,
        mining: miningReducer,
        toast: toastReducer,
        wallet: balanceReducer,
        status: statusReducer,
        page: sendFormReducer,
        clipboard: clipboardReducer,
        futurepage: futureCoinReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(balanceMiddleware, coinMiddleware),
});

export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;
