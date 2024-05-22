import { clearLoginState } from "app/LoginStateReducer"
import { clearWax } from "app/loginWalletsState/loginWalletsSlice"
import { setPurchasedNfts } from "app/nftsState/nftsReducer"
import { clearUser } from "app/UserReducer"

export function disconnectUser(dispatch: any, disconnect: any) {
    dispatch(setPurchasedNfts([]))
    dispatch(clearLoginState())
    dispatch(clearUser())
    dispatch(clearWax())
    disconnect()
}