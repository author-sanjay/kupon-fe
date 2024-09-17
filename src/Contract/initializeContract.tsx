import { createThirdwebClient, getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";


const client = createThirdwebClient({
  clientId: "f3edf5c79f6a4a2bebd24df04149867e",
});


export const contract = getContract({
  client,
  chain: defineChain(11155111),
  address: "0xf3B5ceF2A8D8B03027D58bc6bd0362388c8310C9",
});
