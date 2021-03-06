import WalletBalance from './WalletBalance'
import {useEffect, useState} from 'react'

import {ethers} from 'ethers'
import RabbitsCollection from './RabbitsCollection.json'
import Token from './OnboardToken.json'

const contractAddress = '0x42F1cf9BC9cEc7178b054b97eBC91235B0A46146'
const contractAddressToken = '0xa4D5C1E9Df153629190A451fA1e361531c0C8184'

const provider = new ethers.providers.Web3Provider(window.ethereum)

// get the end user
const signer = provider.getSigner()

const contract = new ethers.Contract(
    contractAddress,
    RabbitsCollection.abi,
    signer
)

const tokenContract = new ethers.Contract(
    contractAddressToken,
    Token.abi,
    signer
)

async function loadCollection() {
    try {
        const currAddr = await signer.getAddress()

        const mintedTokens = await contract.mintedForUser(currAddr)
        console.log(mintedTokens)
        const uris = []

        for (const idx of mintedTokens) {
            const uri = await contract.tokenURI(idx.toNumber())
            uris.push(uri)
        }

        return uris
    } catch (error) {
        console.log(error)
        return []
    }
}

function Home() {
    const [nfts, setNfts] = useState([])

    console.log('nfts', nfts)

    useEffect(() => {
        loadCollection().then((uris) => {
            console.log('uris', uris)
            setNfts(uris)
        })
    }, [])

    return (
        <div>
            <WalletBalance/>
            <div>
                <button
                    onClick={() => {
                        loadCollection().then((uris) => setNfts(uris))
                    }}
                >
                    load collection
                </button>
            </div>
            <div>
                <button
                    onClick={async () => {
                        // const currAddr = await signer.getAddress()
                        try {
                            await tokenContract.approve(
                                contractAddress,
                                10_000_000
                            )
                        } catch (error) {
                            console.log(error)
                        }
                    }}
                >
                    give NFT approve to mint
                </button>
            </div>
            <div>
                <button onClick={async () => {
                    try {
                        await contract.mint()
                    } catch (error) {
                        console.log(error)
                    }
                }}>
                    mint image
                </button>
            </div>
            <h1>NFT Collection</h1>
            <div className="container">
                <div className="row">
                    {nfts.map((url, i) => (
                        <div key={i + 1} className="col-sm">
                            <NFTImage url={url} tokenId={i + 1}/>
                        </div>
                    ))}
                    <NFTImage tokenId={0}/>
                </div>
            </div>
        </div>
    )
}

function NFTImage({url, tokenId}) {
    const contentId = 'QmfNStvEDBJNvsM2JbntWX6TXJMSQr498WjBhG8SEkSUH7'
    const metadataURI = `${contentId}/${tokenId}.json`
    const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`

    const [isMinted, setIsMinted] = useState(false)
    useEffect(() => {
        // getMintedStatus()
    }, [isMinted])

    const getMintedStatus = async () => {
        console.log(contract)
        const result = await contract.isContentOwned(metadataURI)
        console.log(result)
        setIsMinted(result)
    }

    const mintToken = async () => {
        try {
            await contract.mint()
        } catch (error) {
            console.log(error)
        }
    }

    async function getURI() {
        const uri = await contract.tokenURI(tokenId)
        alert(uri)
    }

    return (
        <>
            <div className="card" style={{width: '18rem'}}>
                <img
                    className="card-img-top"
                    // src={isMinted ? imageURI : 'img/placeholder.png'}
                    src={url || 'img/placeholder.png'}
                ></img>
                <div className="card-body">
                    <h5 className="card-title">ID #{tokenId}</h5>
                    {!isMinted ? (
                        <button className="btn btn-primary" onClick={mintToken}>
                            Mint
                        </button>
                    ) : (
                        <button className="btn btn-secondary" onClick={getURI}>
                            Taken! Show URI
                        </button>
                    )}
                </div>
            </div>
        </>
    )
}

export default Home
