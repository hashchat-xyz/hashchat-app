import LitJsSdk from "lit-js-sdk";
import { ethers } from "ethers";
import { AuthState } from "@self.id/multiauth";
import {
  AppendCollection,
  Collection,
} from "@cbj/ceramic-append-collection/dist/index.js";
import { xc20pDirEncrypter, createJWE, JWE } from "did-jwt";
import { prepareCleartext } from "dag-jose-utils";
import { Core } from "@self.id/framework";
import axios from "axios";

const CHAIN = "polygon";
const WORKER_ENDPOINT = "https://hashchat-worker.codynhat.workers.dev";

export function setAccessControlConditions(toAddr: string) {
  return [
    {
      contractAddress: "",
      standardContractType: "",
      CHAIN,
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: toAddr,
      },
    },
  ];
}

export async function generateLitAuthSig(authState: AuthState): Promise<any> {
  if (authState.status === "authenticated") {
    let ethProvider = authState.auth.state.provider;
    const provider = new ethers.providers.Web3Provider(ethProvider);

    let authSig = localStorage.getItem("lit-auth-signature");
    if (!authSig) {
      console.log("signing auth message because sig is not in local storage");
      await LitJsSdk.signAndSaveAuthMessage({
        web3: provider,
        account: authState.auth.accountID.address,
      });
      authSig = localStorage.getItem("lit-auth-signature");
    }

    return JSON.parse(authSig || "{}");
  }
}

export async function encryptMsg(
  msg: Record<string, any>,
  key: Uint8Array
): Promise<JWE> {
  const dirEncrypter = xc20pDirEncrypter(key);
  const cleartext = await prepareCleartext(msg);
  const jwe = await createJWE(cleartext, [dirEncrypter]);
  return jwe;
}

export async function encryptAndAddMessageToCollection(
  collection: Collection,
  msg: string,
  key: Uint8Array
): Promise<Collection> {
  const jwe = await encryptMsg({ text: msg }, key);

  await collection.insert(jwe);

  return collection;
}

export async function postToInbox(user: string, streamId: string) {
  await axios.post(`${WORKER_ENDPOINT}/inbox/${user}/${streamId}`);
}
