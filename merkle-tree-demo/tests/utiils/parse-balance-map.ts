import { U64, equals, from, lessThan } from "@pacote/u64";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import invariant from "tiny-invariant";

import { BalanceTree } from "./balance-tree";

// This is the blob that gets distributed and pinned to IPFS.
// It is completely sufficient for recreating the entire merkle tree.
// Anyone can verify that all air drops are included in the tree,
// and the tree has no additional distributions.
export interface MerkleDistributorInfo {
  merkleRoot: Buffer;
  tokenTotal: string;
  claims: {
    [account: string]: {
      amount: U64;
      proof: Buffer[];
    };
  };
}

export type NewFormat = { address: string; earnings: string };

export function parseBalanceMap(balances: NewFormat[]): MerkleDistributorInfo {
  const dataByAddress = balances.reduce<{
    [address: string]: {
      amount: BN;
      flags?: { [flag: string]: boolean };
    };
  }>((memo, { address: account, earnings }) => {
    if (memo[account.toString()]) {
      throw new Error(`Duplicate address: ${account.toString()}`);
    }
    const parsedNum = from(earnings);
    if (equals(parsedNum, from(0)) || lessThan(parsedNum, from(0))) {
      throw new Error(`Invalid amount for account: ${account.toString()}`);
    }

    memo[account.toString()] = {
      amount: new BN(String(earnings), 10),
    };
    return memo;
  }, {});

  const sortedAddresses = Object.keys(dataByAddress).sort();

  // construct a tree
  const tree = new BalanceTree(
    sortedAddresses.map((address) => {
      const addressData = dataByAddress[address];
      invariant(addressData, "addressData");
      return {
        account: new PublicKey(address),
        amount: addressData.amount,
      };
    })
  );

  // generate claims
  const claims = sortedAddresses.reduce<{
    [address: string]: {
      amount: U64;
      proof: Buffer[];
      flags?: { [flag: string]: boolean };
    };
  }>((memo, address) => {
    const addressData = dataByAddress[address];
    invariant(addressData, "addressData");
    const { amount, flags } = addressData;
    memo[address] = {
      amount: from(amount.toString(10)),
      proof: tree.getProof(new PublicKey(address), amount),
      ...(flags ? { flags } : {}),
    };
    return memo;
  }, {});

  const tokenTotal: BN = sortedAddresses.reduce<BN>(
    (memo, key) => memo.add(dataByAddress[key]?.amount ?? new BN(0)),
    new BN(0)
  );

  return {
    merkleRoot: tree.getRoot(),
    tokenTotal: tokenTotal.toString(),
    claims,
  };
}
