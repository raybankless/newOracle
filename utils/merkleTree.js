import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

export const generateMerkleTree = (allowlist) => {
  const leaves = allowlist.map((item) => keccak256(item.address));
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  return tree;
};

export const getMerkleProof = (tree, address) => {
  const leaf = keccak256(address);
  const proof = tree.getHexProof(leaf);
  return proof;
};