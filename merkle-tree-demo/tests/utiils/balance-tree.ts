import type { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { keccak_256 } from "js-sha3";

import { MerkleTree } from "./merkle-tree";

export class BalanceTree {
  private readonly _tree: MerkleTree;
  constructor(balances: { account: PublicKey; amount: BN }[]) {
    this._tree = new MerkleTree(
      balances.map(({ account, amount }) => {
        return BalanceTree.toNode(account, amount);
      })
    );
  }

  static verifyProof(
    account: PublicKey,
    amount: BN,
    proof: Buffer[],
    root: Buffer
  ): boolean {
    let pair = BalanceTree.toNode(account, amount);
    for (const item of proof) {
      pair = MerkleTree.combinedHash(pair, item);
    }

    return pair.equals(root);
  }

  // keccak256(abi.encode(index, account, amount))
  static toNode(account: PublicKey, amount: BN): Buffer {
    const buf = Buffer.concat([
      // new BN(String(index), 10).toArrayLike(Buffer, "le", 8),
      account.toBuffer(),
      amount.toArrayLike(Buffer, "le", 8),
    ]);
    return Buffer.from(keccak_256(buf), "hex");
  }

  getHexRoot(): string {
    return this._tree.getHexRoot();
  }

  // returns the hex bytes32 values of the proof
  getHexProof(account: PublicKey, amount: BN): string[] {
    return this._tree.getHexProof(BalanceTree.toNode(account, amount));
  }

  getRoot(): Buffer {
    return this._tree.getRoot();
  }

  getProof(account: PublicKey, amount: BN): Buffer[] {
    return this._tree.getProof(BalanceTree.toNode(account, amount));
  }
}
