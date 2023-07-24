'use client'
import { useState } from 'react';
import { User } from "../types";

interface TeamManagerProps {
    members: [User];
}

const TeamManager = (props: TeamManagerProps) => {

}

const TeamCreator = () => {

}

export default function Admin() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    return <main>
        <div>
            <button>Create New Team</button>
            <button onClick={() => {
                const url = "/api/users/create";
                const userData = {
                  name: "Hayden Carpenter",
                  email: "hcarpenter30@gatech.edu"
                };
                
                fetch(url, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(userData)
                })
                .then(response => {
                  if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                  }
                  return response.json();
                })
                .then(data => console.log(data))
                .catch(error => console.error('There was a problem with your fetch operation:', error));
                
            }}>Create New User</button>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}></input>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}></input>
        </div>
    </main>
}