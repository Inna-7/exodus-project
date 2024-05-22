import { isEmpty } from 'lodash'
import { WaxJS } from "@waxio/waxjs/dist";

import AnchorLinkBrowserTransport from 'anchor-link-browser-transport'
import AnchorLink, { ChainId, LinkSession } from 'anchor-link'
import { setAnchorIsLogged, setWax, setWaxIsLgged } from 'app/loginWalletsState/loginWalletsSlice';
import { store } from 'app/store';
import { setAnchorConnected, setWaxConnected, setWaxDisconnected } from 'app/LoginStateReducer';

/**
 * Class to manage user data; it will be saved on Login and deleted on Logout
 */
export class User {
    appName: string = 'Exodus Marketplace'
    static instance: User;
    /**
     * WAX configuration
    */
    // static rpcEndpoint = 'https://wax.greymass.com'
    static rpcEndpoint = 'https://testnet.wax.pink.gg'
    static wax: WaxJS | undefined = undefined;
    // Shows petition signing and current balance obtaining methods
    waxSession: WaxJS | undefined = undefined
    static anchorSession: LinkSession | null = null


    /**
     * 
     * FOR ANCHOR
     * 
     */
    static transport = new AnchorLinkBrowserTransport()
    static anchorLink = new AnchorLink({
        transport: User.transport,
        chains: [
            {
                chainId: 'f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12',
                // chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
                nodeUrl: 'https://wax-testnet.eosphere.io',
                // nodeUrl: 'https://eos.greymass.com',
            },
        ],
    })


    async waxLogin() {
        try {
            //if autologged in, this simply returns the userAccount w/no popup
            User.wax = new WaxJS({ rpcEndpoint: User.rpcEndpoint, tryAutoLogin: true });
            let userAccount: string = await User.wax?.login() || '';
            // let pubKeys = User.wax?.pubKeys;
            store.dispatch(setWaxConnected());
            return userAccount;
        } catch (e: any) {
            console.error(e.message);
        }
    }

    //this makes no sense now
    // isLogged() {
    //     const auth = !isEmpty(this.authName) && !isEmpty(User.wax)
    //     return auth
    // }
    async anchorConnect() {

        // Perform the login, which returns the users identity
        try {
            const identity = await User.anchorLink.login('mydapp')
            User.anchorSession = identity.session
            store.dispatch(setAnchorConnected())

            // this.waxLogin()
            return identity
        } catch (e) {
            console.error(e)
            return false
        }

        // Save the session within your application for future use
    }
    logout() {
        User.wax = undefined;
        store.dispatch(setWaxDisconnected())
        return true;
    }


    async getWaxBalance(waxAccount: string | undefined) {
        if (waxAccount === undefined) {
            return null
        } else {
            const balance = await User.wax?.rpc?.get_account(waxAccount)
            return balance?.core_liquid_balance
        }
    }
    static restoreWaxSession = async () => {
      console.log(66666666666666, store.getState())
        User.wax = new WaxJS({ rpcEndpoint: User.rpcEndpoint, tryAutoLogin: true });

        if (store.getState().logState.waxConnected) {
            console.log("wax wallet is connected")
            await User.wax.isAutoLoginAvailable().then(async autoLogin => {
                if (autoLogin) {
                    console.log("user's wax object");
                    console.log(User.wax);
                    store.dispatch(setWax({
                        waxAddress: User.wax!.userAccount,
                        waxBalance: await UserService.getWaxBalance(User.wax!.userAccount)
                    }))
                    store.dispatch(setWaxIsLgged())
                }
            });
        }
    }
    static restoreAnchorSession = async () => {
        if (store.getState().logState.anchorConnected) {

            User.anchorSession = await User.anchorLink.restoreSession('mydapp');
            console.log("anchor connection from the old::: ")
            console.log(User.anchorSession)
            if (User.anchorSession?.auth) {
                let waxAddress = User.anchorSession.auth.actor.toString();
                store.dispatch(setWax({
                    waxAddress: waxAddress,
                    waxBalance: await UserService.getWaxBalance(waxAddress)
                }))
                store.dispatch(setAnchorIsLogged())
            }
            // following is example of how to sign the transaction
            // then((session:any) => {
            //     console.log(`Session for ${session.auth} restored`)
            //     const action = {
            //         account: 'eosio',
            //         name: 'voteproducer',
            //         authorization: [session.auth],
            //         data: {
            //             voter: session.auth.actor,
            //             proxy: 'greymassvote',
            //             producers: [],
            //         },
            //     }
            // session.transact({action}).then(({transaction}) => {
            //     console.log(`Transaction broadcast! Id: ${transaction.id}`)
            // })
            // })
        }
    }
    static restoreMetaSession = () => {

    }
    // UserService init called to prepare UAL Login.
    static async init() {
        try {
            User.restoreWaxSession();
            User.restoreAnchorSession();


        } catch (e) {
            console.log(e)
        }

    }


    static new() {
        if (!User.instance) {
            User.instance = new User()
            // User.init()
        }

        return User.instance
    }
}

export const UserService = User.new()

