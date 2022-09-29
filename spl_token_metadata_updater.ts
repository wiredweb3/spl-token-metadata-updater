import * as mpl from "@metaplex-foundation/mpl-token-metadata";
import * as web3 from "@solana/web3.js";
import * as anchor  from '@project-serum/anchor';

export function loadWalletKey(keypairFile:string): web3.Keypair {
    const fs = require("fs");
    const loaded = web3.Keypair.fromSecretKey(
        new Uint8Array(JSON.parse(fs.readFileSync(keypairFile).toString())),
    );
    return loaded;
}

const INITIALIZE = false;

async function main(){
    console.log("Changing and updating metadata for your SPL token!");
    const myKeypair = loadWalletKey("REPLACE_WITH_KEYPAIR.json"); // Your KeyPair JSON file
    const mint = new web3.PublicKey("REPLACE_WITH_TOKEN_ADDRESS");    // Address of your token
    const seed1 = Buffer.from(anchor.utils.bytes.utf8.encode("metadata"));
    const seed2 = Buffer.from(mpl.PROGRAM_ID.toBytes());
    const seed3 = Buffer.from(mint.toBytes());
    const [metadataPDA, _bump] = web3.PublicKey.findProgramAddressSync([seed1, seed2, seed3], mpl.PROGRAM_ID);
    const accounts = {
        metadata: metadataPDA,
        mint,
        mintAuthority: myKeypair.publicKey,
        payer: myKeypair.publicKey,
        updateAuthority: myKeypair.publicKey,
    }
    const DataV2 = {
        name: "IPFSTEST",
        symbol: "IPFS",
        uri: "REPLACE_WITH_PERMAURL_TO_TOKEN_METADATA.json", // URL of JSON file with token metadata
        sellerFeeBasisPoints: 0,
        creators: null,
        collection: null,
        uses: null
    }
        const args = {
        createMetadataAccountArgsV2: {
        data: DataV2,
        isMutable: true
        }
    };
    const ix = mpl.createCreateMetadataAccountV2Instruction(accounts, args);
    const tx = new web3.Transaction();
    tx.add(ix);
    const connection = new web3.Connection("https://api.devnet.solana.com"); //URL of Solana clusetr (Mainnet/Devnet/Testnet)
    const txid = await web3.sendAndConfirmTransaction(connection, tx, [myKeypair]);
    console.log(txid);
    
}

main();