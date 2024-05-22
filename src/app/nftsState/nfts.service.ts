import axios from "app/axios"
import { createNftMarketTypes, mintNftApiType, sendPurchaseBodyType } from "./nftsTypes";

function getNft() {
  return axios.post(`https://wax-testnet.cryptolions.io/v1/chain/get_table_rows`,
    {
      json: true,
      code: 'delphioracle',
      table: 'datapoints',
      scope: 'waxpusd',
      reverse: false,
      show_payer: false,
      limit: 1
    },
    {
      headers: {
        'Content-Type': 'text/plain',
        'X-Requested-With': 'JSON'
      }
    }
  );
}

function getCurrencySet() {
  return axios.get(`https://data.binance.com/api/v3/ticker/price?symbols=[%22WAXPUSDT%22,%22ETHUSDT%22,%22LUNCUSDT%22,%22BNBUSDT%22]`)
}

function getPurchasedNfts(token: string) {
  return axios.get(`/api/transaction/listNft`,
    {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }
  )
}

function sendPurchase(token: string, body: sendPurchaseBodyType) {
  return axios.post(`/api/transaction/verifyTransaction`, body,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    }
  )
}
function sendWaxPurchase(token: string, body: JSON) {
  return axios.post(`/api/transaction/waxPurchase`, body,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    }
  )
}
function mintNft(token: string, body: mintNftApiType, isOpensea: boolean) {
  return axios.post(`/api/transaction/mintNft${isOpensea ? 'InOpensea' : ''}`, body,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json;charset=utf-8'
      }
    }
  )
}

function getRecentTransactionUser(title: string | undefined, userAccount: string,  token: string) {
  return axios.post(`/api/transaction/getRecentTransactionOf${title}`, 
    {
      "userAccount": userAccount
    },
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    }
  )
}

function getRecentTransactionAll(token: string) {
  return axios.get(`/api/transaction/getRecentSalesData`,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    }
  )
}

function getNftMarket() {
  return axios.get(`/api/nftMarket`)
}

function deleteNftMarket(token: string, id: string) {
  return axios.delete(`/api/nftMarket?id=${id}`,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    }
  )
}

function createNftMarket(token: string, body: createNftMarketTypes) {
  return axios.post(`/api/nftMarket`, body,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    }
  )
}

function editNftMarket(token: string, body: createNftMarketTypes) {
  return axios.put(`/api/nftMarket`, body,
    {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    }
  )
}

const NftsService = {
  getNft,
  getCurrencySet,
  getPurchasedNfts,
  sendPurchase,
  sendWaxPurchase,
  mintNft,
  getRecentTransactionUser,
  getRecentTransactionAll,
  getNftMarket,
  deleteNftMarket,
  createNftMarket,
  editNftMarket
}

export default NftsService