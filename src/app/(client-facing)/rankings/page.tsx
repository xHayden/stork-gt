import React from "react";

interface RankingItemProps {
    rank: number
    name: string
}

const RankingItem: React.FC<RankingItemProps> = ({ rank, name }) => {
    return <div>
        
    </div>
}

export default function Rankings() {
    return <main>
        <div>
            {
                Array.from(5).map((index) => {
                    return <RankingItem key={index} rank={index} name="Test"></RankingItem>
                })
            }
        </div>
    </main>
}