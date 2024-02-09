"use client";

import { DBTeam } from "@/app/types";
import { Button, Select, TextInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const JoinTeamInput = () => {
  const session = useSession();
  const [teams, setTeams] = useState<DBTeam[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("");

  useEffect(() => {
    fetch("/api/v1/teams/")
      .then((response) => response.json())
      .then((data) => setTeams(data))
      .catch((error) => console.error("Error fetching teams:", error));
  }, []);

  const handleJoinTeam = async () => {
    if (!selectedTeam) {
      toast.error("Please select a team to join.");
      return;
    }
    const team = teams.find((t) => t._id.toString() === selectedTeam);
    if (!team) {
      toast.error("Selected team not found.");
      return;
    }

    const notificationData = {
      title: `Request to join ${team.name} from ${session.data?.user.name} (${session.data?.user.email})`,
      message: "Let me join your team!",
      user: team.captain,
      type: "info",
      confirmAction: JSON.stringify({
        type: "ACCEPT_INVITE",
        args: { teamId: team._id.toString() },
      }),
      rejectAction: JSON.stringify({
        type: "REJECT_INVITE",
        args: { teamId: team._id.toString() },
      }),
    };

    toast.promise(
      fetch("/api/v1/notifications/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify(notificationData),
      }).then((response) => {
        if (!response.ok) throw new Error("Network response was not ok.");
        return response.json();
      }).catch(e => { console.error(e); throw e; }),
      {
        loading: "Sending join request...",
        success: "Join request sent successfully!",
        error: "Failed to send join request.",
      }
    );
  };
  return (
    <div>
      <Select
        label="Select a team to join"
        placeholder="Choose a team"
        data={
          teams.length
            ? teams.map((team) => ({
                value: team._id.toString(),
                label: team.name,
              }))
            : []
        }
        value={selectedTeam}
        onChange={() => setSelectedTeam}
      />
      <Button
        onClick={handleJoinTeam}
        className="bg-amber-500 border-b-amber-700 border-b-4"
      >
        Join Team
      </Button>
    </div>
  );
};

export const CreateTeamInput = () => {
  const [teamName, setTeamName] = useState<string>("");
  const session = useSession();

  const handleCreateTeam = async () => {
    if (!teamName) {
      toast.error("Team name is required");
      return;
    }

    const teamData = {
      name: teamName,
      captain: session.data?.user?._id,
    };

    toast.promise(
      fetch("/api/v1/teams/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teamData),
      }).then((response) => {
        if (!response.ok) { 
            throw new Error("Network response was not ok.");
        }
        return response.json();
      }).catch(e => { console.error(e); throw e; }),
      {
        loading: "Creating team...",
        success: "Team created successfully!",
        error: "Error creating team.",
      }
    );
  };

  return (
    <div>
      <TextInput
        label="Team Name"
        placeholder="Enter team name"
        value={teamName}
        onChange={(event) => setTeamName(event.currentTarget.value)}
      />
      <Button
        onClick={handleCreateTeam}
        className="bg-amber-500 border-b-amber-700 border-b-4"
      >
        Create Team
      </Button>
    </div>
  );
};
