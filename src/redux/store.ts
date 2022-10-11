import { StatusState } from './slices/minima/statusSlice';
import { configureStore, ThunkAction, AnyAction } from "@reduxjs/toolkit";
import { ToastState } from './slices/app/toastSlice';
import { MiningState } from "./slices/minima/miningSlice";
import { CoinState } from "./slices/minima/coinSlice";
import { BalanceState } from "./slices/minima/balanceSlice";
import coinReducer from "./slices/minima/coinSlice";
import toastReducer from './slices/app/toastSlice';
import miningReducer from './slices/minima/miningSlice';
import balanceReducer from './slices/minima/balanceSlice';
import statusReducer from './slices/minima/statusSlice';


export type RootState = {
    coins: CoinState;
    mining: MiningState;
    toast: ToastState;
    wallet: BalanceState;
    status: StatusState;
};

export const store = configureStore({
    reducer: {
        coins: coinReducer,
        mining: miningReducer,
        toast: toastReducer,
        wallet: balanceReducer,
        status: statusReducer,
    }
});

export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;
