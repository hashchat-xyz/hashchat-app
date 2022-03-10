import LitJsSdk from "lit-js-sdk";
import { ethers } from "ethers";
import { AuthState } from "@self.id/multiauth";

const CHAIN = "polygon";

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
