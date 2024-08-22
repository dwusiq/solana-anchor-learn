import { percentAmount, generateSigner, signerIdentity, createSignerFromKeypair } from '@metaplex-foundation/umi'
import { TokenStandard, createAndMint, createFungible, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { get_SecretKey } from './helper_utils';

//metadata 属性值配置
const metadata = {
    name: "Token Qiang",
    symbol: "TQ",
    image: "https://bafkreig55mf3lazzbgndiqyqvdmchdsykvvebww7cqlws6ywgog5xfdzta.ipfs.nftstorage.link/",//ipfs或其他地方存储一个图片，然后复制链接到这里
    uri: "https://gateway.pinata.cloud/ipfs/QmShpuNthYqWLSwW6ZWcoFuVDgTwCWCn3vdp1aZemFC8ka"//metedata数据(真正是这里的内容生效到浏览器的名称)
};

const umi = createUmi('https://api.devnet.solana.com');//用rpc创建umi
const secretKey = get_SecretKey("/Users/qiang/.config/solana/DevTest01.json");//获取私钥
const userWallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));
const userWalletSigner = createSignerFromKeypair(umi, userWallet);

const mint = generateSigner(umi);
umi.use(signerIdentity(userWalletSigner));
umi.use(mplTokenMetadata())


//方式一：创建代币，不马上铸币
createFungible(umi, {
    mint,
    authority: umi.identity,//这里是自己的钱包
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
    sellerFeeBasisPoints: percentAmount(0),//不收铸币费
    decimals: 8,//精度
}).sendAndConfirm(umi)
    .then(() => {
        console.log("Successfully minted 1 million tokens (", mint.publicKey, ")");
    })
    .catch((err) => {
        console.error("Error minting tokens:", err);
    });




// //方式二：创建代币的同时铸造代币
// createAndMint(umi, {
//     mint,
//     authority: umi.identity,//这里是自己的钱包
//     name: metadata.name,
//     symbol: metadata.symbol,
//     uri: metadata.uri,
//     sellerFeeBasisPoints: percentAmount(0),//不收铸币费
//     decimals: 9,//精度
//     amount: 100 * 10 ** 9,//初始化代币数量，这里是100个，
//     tokenOwner: userWallet.publicKey,//这里是自己的钱包
//     tokenStandard: TokenStandard.Fungible,//代币标准
// }).sendAndConfirm(umi)
//     .then(() => {
//         console.log("Successfully minted 1 million tokens (", mint.publicKey, ")");
//     })
//     .catch((err) => {
//         console.error("Error minting tokens:", err);
//     });