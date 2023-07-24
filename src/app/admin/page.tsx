'use client'
import { useState } from 'react';
import { User } from "../types";
import { toast, Toaster } from 'react-hot-toast';
import { Space_Mono, Roboto } from 'next/font/google'

const roboto = Roboto({ weight: "400", subsets: ["latin"] });

interface TeamManagerProps {
    members: [User];
}

const TeamManager = (props: TeamManagerProps) => {
    // TODO: Implement TeamManager
}

const TeamCreator = () => {
    const [teamName, setTeamName] = useState("");
    const [teamCaptain, setTeamCaptain] = useState("");

    const handleCreateTeam = async () => {
        if (teamName === "" || teamCaptain === "") {
            toast.error("Both team name and captain ID are required");
            return;
        }

        const response = await fetch('/api/teams/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                captain: teamCaptain,
                name: teamName,
            }),
        });

        if(response.ok) {
          const data = await response.json();
          toast.success("Team successfully created!");
        } else {
          toast.error("Could not create team");
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <h2 className='text-3xl'>Create New Team</h2>
            <p className={`${roboto.className}`}>
              Create a team with a name, a captain, members, and storks.
            </p>
            <div className='flex gap-2 flex-col'>
              <p>Team Name</p>
              <input 
                  type="text" 
                  value={teamName} 
                  onChange={(e) => { setTeamName(e.target.value); } } 
                  placeholder="Team Name"
                  className="p-1 rounded text-black"
              />
              <p>Team Captain</p>
              <input 
                  type="text" 
                  value={teamCaptain} 
                  onChange={(e) => setTeamCaptain(e.target.value)} 
                  placeholder="Captain ID"
                  className="p-1 rounded text-black"
              />
            </div>
          
            <button 
                onClick={handleCreateTeam}
                className="p-1 rounded bg-teal-500 text-white"
            >
                Create New Team
            </button>
        </div>
    );
}

export default function Admin() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    return (
        <main>
            <div><Toaster/></div>
            <TeamCreator />
        </main>
    )
}