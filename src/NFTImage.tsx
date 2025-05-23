// src/components/NFTImage.tsx
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import abi from './abi.json';
import { usePublicClient } from 'wagmi';

const contractAddress = '0x8CAec4dC4fe4698A6a249fe5Baf62832880aE22C';

export default function NFTImage({ tokenId }: { tokenId: number }) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const publicClient = usePublicClient();

    useEffect(() => {
        const fetchImage = async () => {
            if (!publicClient) return;
            try {
                const provider = new ethers.JsonRpcProvider(publicClient.transport.url);
                const contract = new ethers.Contract(contractAddress, abi, provider);
                const uri = await contract.tokenURI(tokenId);
                const metadataUrl = uri.replace('ipfs://', 'https://nftstorage.link/ipfs/');
                const metadata = await fetch(metadataUrl).then(res => res.json());
                const image = metadata.image.replace('ipfs://', 'https://nftstorage.link/ipfs/');
                setImageUrl(image);
            } catch (err) {
                console.error(`Failed to load image for token ${tokenId}`, err);
            }
        };

        fetchImage();
    }, [tokenId, publicClient]);

    if (!imageUrl) return <p>Loading image...</p>;

    return <img
        src={imageUrl}
        alt={`NFT ${tokenId}`}
        style={{
            width: '100%',
            maxWidth: '400px',
            borderRadius: 16,
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
        }}
    />;
}
