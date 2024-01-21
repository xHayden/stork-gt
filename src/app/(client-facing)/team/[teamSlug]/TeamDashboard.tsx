"use client"

import { Key, useEffect, useRef, useState } from 'react';
import { redirect } from 'next/navigation';
import { Combobox, useCombobox, TextInput } from '@mantine/core';
import { ObjectNotFoundError } from '@/app/types/errors';
import { DBStork, DBTeam, DBUser, User } from '@/app/types';
import { Roboto, Rubik_Mono_One } from 'next/font/google';
import { toast } from 'react-hot-toast';
import useSWR, { mutate } from 'swr';
import { ObjectId } from 'mongodb';
import { useSession } from 'next-auth/react';

const roboto = Roboto({ weight: "400", subsets: ["latin"] });
const rubik = Rubik_Mono_One({ weight: "400", subsets: ["latin"] });

interface TeamDashboardProps {
    params: {
        teamSlug: string
        team: string
    }
}

const TeamDashboard: React.FC<TeamDashboardProps> = ({ params }) => {
    const [user, setUser] = useState<DBUser | undefined>();
    const [stork, setStork] = useState<DBStork | undefined>();
    const [userSearch, setUserSearch] = useState('');
    const [userSearchData, setUserSearchData] = useState<DBUser[]>([]);
    const [userSearchError, setUserSearchError] = useState(false);
    const [storkSearch, setStorkSearch] = useState('');
    const [storkSearchData, setStorkSearchData] = useState<DBStork[]>([]);
    const [storkSearchError, setStorkSearchError] = useState(false);
    const prevMembersRef = useRef<DBUser[] | undefined>();
    const prevStorksRef = useRef<DBStork[] | undefined>();
    const prevTeamRef = useRef<DBTeam | undefined>();
    const session = useSession();

    const fetcher = async (urls: string | string[]) => {
        const isClient = typeof window !== 'undefined';
        const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
        const VERCEL_BASE_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : BASE_URL;
    
        const getFullUrl = (url: string) => isClient ? url : `${VERCEL_BASE_URL}${url}`;
    
        if (Array.isArray(urls)) {
            const responses = await Promise.all(urls.map(url => fetch(getFullUrl(url))));
            return Promise.all(responses.map(res => res.json()));
        } else {
            const response = await fetch(getFullUrl(urls));
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            return data;
        }
    };
            

    const { data: team, error: teamError } = useSWR<DBTeam>(`/api/v1/teams/name/${decodeURIComponent(params.teamSlug).toLowerCase()}`, fetcher);
    const { data: members, error: membersError } = useSWR<DBUser[]>(() => team?.members.map((member: ObjectId) => `/api/v1/users/id/${member.toString()}`), fetcher);
    const { data: storks, error: storksError } = useSWR<DBStork[]>(() => team?.storks.map((stork: ObjectId) => `/api/v1/storks/id/${stork.toString()}`), fetcher);
    // Handle errors
    if (teamError) redirect("/404");

    useEffect(() => {
        if (members && storks && team) {
            prevMembersRef.current = members
            prevStorksRef.current = storks;
            prevTeamRef.current = team;
        }
    }, [members, storks, team]);

    // todo: proper error handling for errors here, prob use suspense and error toast
    const teamData = JSON.parse(params.team) || team || prevTeamRef?.current;
    const membersList = members || prevMembersRef?.current;
    const storksList = storks || prevStorksRef?.current;

    return (teamData != undefined && !teamError) ? <div className='mx-2 flex w-full justify-center'>
        <div className='max-w-screen-lg w-full'>
            <h1 className={`text-4xl ${rubik.className} text-white text-center bg-amber-400 border-b-4 border-amber-600 p-2 mb-2`}>{teamData.name}</h1>
            <h2 className={`text-2xl w-max bg-amber-400 px-6 py-2 border-b-4 border-0 border-amber-600 text-orange-100 ${rubik.className}`}>Members:</h2>
            <ul className={`${roboto.className} border-2 w-full bg-white rounded-xl p-2 my-2 flex flex-col gap-2 divide-y-2`}>
                { membersList && !membersError ? membersList.map((member) => {
                    return <li key={member._id.toString()} className=''>
                        <p className='font'>{member.name}</p>
                        <p className='text-xs'>{member.email}</p>
                        <p className='text-xs'>{member.role}</p>
                        <p className='text-xs font-bold'>{new User(member).paidDues() ? "" : "Needs to pay dues."}</p>
                        </li>
                }) : <></> }
            </ul>
            {session.status == "authenticated" && (JSON.parse(params.team) as DBTeam).members.includes(session.data.user._id) ? <div className={`${roboto.className} flex gap-2 w-full items-center`}>
                <div className='w-full'>
                    <SearchCombobox 
                        setItem={setUser}
                        item={user}
                        itemSearch={userSearch}
                        itemSearchData={userSearchData} 
                        setItemSearchData={setUserSearchData} 
                        setItemSearch={setUserSearch} 
                        setItemSearchError={setUserSearchError} 
                        itemSearchError={userSearchError} 
                        nameRoute='/api/v1/users/name/'
                        allRoute='/api/v1/users/name/'
                        label='User'
                    />
                </div>
                <div className='gap-2 flex w-max mb-2'>
                    <button className='w-max highlight-button' onClick={(event: React.FormEvent<HTMLButtonElement>) => {
                        if (!user) {
                            console.log("Member not set");
                            return;
                        }
                        toast.promise(
                            createNotificationToAddMemberToTeam(userSearchData.find((data) => data._id == user._id), teamData),
                            {
                                loading: 'Requesting to add...',
                                success: `Request sent to add ${userSearch} to ${teamData.name}`,
                                error: 'Failed to request to add member to team',
                            }
                        );
                    }}>Add</button>
                    <button className='w-max highlight-button' onClick={(event: React.FormEvent<HTMLButtonElement>) => {
                        if (!user) {
                            console.log("Member not set");
                            return;
                        }
                        toast.promise(
                            removeMemberFromTeam(userSearchData.find((data) => data._id == user._id), teamData),
                            {
                                loading: 'Removing...',
                                success: `Removed ${storkSearch} from ${teamData.name}`,
                                error: 'Failed to remove member from team',
                            }
                        );
                    }}>Remove</button>
                </div>
            </div> : <></>}
            <h2 className={`text-2xl w-max bg-amber-400 px-6 py-2 border-b-4 border-0 border-amber-600 text-orange-100 ${rubik.className}`}>Storks:</h2>
            <ul className={`${roboto.className} border-2 w-full bg-white rounded-xl p-2 my-2`}>
                { (storksList && !storksError) ? storksList.map((stork) => {
                    return <li key={stork.name} className=''>
                        <p className='font'>{stork.name}</p>
                        </li>
                }) : <></> }
            </ul>
            {session.status == "authenticated" && (JSON.parse(params.team) as DBTeam).members.includes(session.data.user._id) ? <div className={`${roboto.className} flex gap-2 w-full items-center`}>
                <div className='w-full'>
                    <SearchCombobox 
                        setItem={setStork}
                        item={stork}
                        itemSearch={storkSearch}
                        itemSearchData={storkSearchData} 
                        setItemSearchData={setStorkSearchData} 
                        setItemSearch={setStorkSearch} 
                        setItemSearchError={setStorkSearchError} 
                        itemSearchError={storkSearchError} 
                        nameRoute='/api/v1/storks/name/'
                        allRoute='/api/v1/storks/alive/'
                        label='Stork'
                    />
                </div>
                <div className='gap-2 flex w-max'>
                    <button className='highlight-button w-max' onClick={(event: React.FormEvent<HTMLButtonElement>) => {
                        if (!stork) {
                            console.log("Stork not set");
                            return;
                        }
                        toast.promise(
                            addStorkToTeam(storkSearchData.find((data) => data._id == stork._id), teamData),
                            {
                                loading: 'Adding...',
                                success: `Added ${storkSearch} to ${teamData.name}`,
                                error: 'Failed to add stork to team',
                            }
                        );
                    }}>Add</button>
                    <button className='highlight-button w-max' onClick={(event: React.FormEvent<HTMLButtonElement>) => {
                        if (!stork) {
                            console.log("Stork not set");
                            return;
                        }
                        toast.promise(
                            removeStorkFromTeam(storkSearchData.find((data) => data._id == stork._id), teamData),
                            {
                                loading: 'Removing...',
                                success: `Removed ${storkSearch} from ${teamData.name}`,
                                error: 'Failed to remove stork from team',
                            }
                        );
                    }}>Remove</button>
                </div>
            </div> : <></>}
        </div>
    </div> : <p></p>
}

interface SearchComboboxProps {
    item: DBUser | DBStork | undefined;
    setItem: React.Dispatch<React.SetStateAction<DBUser | undefined>> | React.Dispatch<React.SetStateAction<DBStork | undefined>>;
    itemSearch: string;
    itemSearchData: DBUser[] | DBStork[];
    itemSearchError: boolean;
    setItemSearch: React.Dispatch<React.SetStateAction<string>>;
    setItemSearchData: React.Dispatch<React.SetStateAction<DBUser[]>> | React.Dispatch<React.SetStateAction<DBStork[]>>;
    setItemSearchError: React.Dispatch<React.SetStateAction<boolean>>;
    nameRoute: string;
    allRoute: string;
    label: string;
}

function SearchCombobox({
    itemSearch, 
    itemSearchData, 
    itemSearchError, 
    setItemSearch, 
    setItemSearchError, 
    setItemSearchData,
    nameRoute,
    allRoute,
    label,
    setItem,
    item,
}: SearchComboboxProps) {
    const itemCombobox = useCombobox({
        onDropdownOpen: () => itemCombobox.resetSelectedOption(),
        onDropdownClose: () => itemCombobox.updateSelectedOptionIndex('active')
    });
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        fetch(`${allRoute}`).then((items) => {
            items.json().then((itemData) => {
                setItemSearchData(itemData.error ? [] : itemData);
                setItemSearchError(itemData.error != undefined);
            })
        })
    }, [allRoute, setItemSearchData, setItemSearch, setItemSearchError])

    return isClient ? <Combobox
        store={itemCombobox}
        onOptionSubmit={(val) => {
            setItem(JSON.parse(val));
            setItemSearch(JSON.parse(val).name);
            itemCombobox.closeDropdown();
        }}
    >
        <Combobox.Target>
            <TextInput
                placeholder={"Select " + label}
                value={itemSearch}
                onChange={async (event: React.FormEvent<HTMLInputElement>) => {
                    setItemSearch(event.currentTarget.value);
                    let items;
                    if (event.currentTarget.value.length > 0) {
                        items = await fetch(`${nameRoute}${event.currentTarget.value.toLowerCase()}`);
                    } else {
                        items = await fetch(`${allRoute}`);
                    }
                    const itemData = await items.json();
                    setItemSearchData(itemData.error ? [] : itemData);
                    setItemSearchError(itemData.error != undefined);
                    if (!itemData.error && itemData.length > 0 && event.currentTarget) {
                        const item = itemData.find((item: (DBStork | DBUser)) => item.name == event.currentTarget.value);
                        if (item && item != -1 && item._id) {
                            setItem(item);
                        } 
                    }
                    itemCombobox.openDropdown();
                    itemCombobox.updateSelectedOptionIndex();
                }}
                onClick={() => itemCombobox.openDropdown()}
                onFocus={() => itemCombobox.openDropdown()}
                onBlur={() => itemCombobox.closeDropdown()}
            />
        </Combobox.Target>
        <Combobox.Dropdown>
            <Combobox.Options className={`flex flex-col ${roboto.className} max-h-48 overflow-y-auto`}>
                {itemSearchData.length === 0 ? <Combobox.Empty>Nothing found</Combobox.Empty> : 
                itemSearchData.map((item: DBStork | DBUser) => <Combobox.Option 
                    value={JSON.stringify(item)} 
                    key={item._id.toString() as Key}
                    className='hover:bg-amber-200'
                >
                    <p className='font'>{item.name}</p>
                    { hasEmail(item) ? <p className='text-xs'>{item.email}</p> : <></> }
                </Combobox.Option>)}
            </Combobox.Options>
        </Combobox.Dropdown>
    </Combobox> : <></>
}

function hasEmail(item: DBStork | DBUser): item is DBUser {
    return (item as DBUser).email !== undefined;
}

const addStorkToTeam = async (stork: DBStork | undefined, team: DBTeam) => {
    if (!stork || !stork._id) {
        throw new ObjectNotFoundError(`/api/v1/teams/id/${team._id}/storks/add`, DBStork);
    }
    try {
      const response = await fetch(`/api/v1/teams/id/${team._id}/storks/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({"id": stork._id}),
      });
  
      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error || "Error with request to add stork");
      } else {
        const newStorks: ObjectId[] = JSON.parse(JSON.stringify(team.storks));
        if (!newStorks.includes(stork._id)) newStorks.push(stork._id);
        const newTeam: DBTeam = JSON.parse(JSON.stringify(team));
        newTeam.storks = newStorks;
        await mutate(`/api/v1/teams/name/${decodeURIComponent(team.name).toLowerCase()}`, newTeam); 
        newStorks.map(async (item: ObjectId) => {
            await mutate(`/api/v1/storks/id/${item}`);
        });  
      }
      const data = await response.json();
      return data;
    } catch (error) {
        console.log(error)
      throw error;
    }
};

const createNotificationToAddMemberToTeam = async (member: DBUser | undefined, team: DBTeam) => {
    if (!member || !member._id) {
        throw new ObjectNotFoundError(`/api/v1/notifications/create`, DBStork);
    }
    try {
      const response = await fetch(`/api/v1/notifications/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(
            {
                title: "Invitation from " + team.name,
                message: "Join our team!",
                user: member._id,
                type: "info",
                confirmAction: JSON.stringify({ type: 'ACCEPT_INVITE', args: { teamId: team._id } }),
                rejectAction: JSON.stringify({ type: 'REJECT_INVITE', args: { teamId: team._id } }),
            }
        ),
      });
  
      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error || "Error with request to send request to add member");
      }
      const data = await response.json();
      return data;
    } catch (error) {
        console.log(error)
      throw error;
    }
};

const removeStorkFromTeam = async (stork: DBStork | undefined, team: DBTeam) => {
    if (!stork || !stork._id) {
        throw new ObjectNotFoundError(`/api/v1/teams/id/${team._id}/storks/remove`, DBStork);
    }
    try {
      const response = await fetch(`/api/v1/teams/id/${team._id}/storks/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({"id": stork._id}),
      });
  
      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error || "Error with request to remove stork");
      } else {
        const newStorks = team.storks.filter(item => stork._id != item);
        const newTeam: DBTeam = JSON.parse(JSON.stringify(team));
        newTeam.storks = newStorks;
        await mutate(`/api/v1/teams/name/${decodeURIComponent(team.name).toLowerCase()}`, newTeam);
      }
      const data = await response.json();
      return data;
    } catch (error) {
        console.log(error)
      throw error;
    }
};


const removeMemberFromTeam = async (member: DBUser | undefined, team: DBTeam) => {
    if (!member || !member._id) {
        throw new ObjectNotFoundError(`/api/v1/teams/id/${team._id}/members/remove`, DBStork);
    }
    try {
      const response = await fetch(`/api/v1/teams/id/${team._id}/members/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({"id": member._id}),
      });
  
      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error || "Error with request to remove member");
      } else {
        const newMembers = team.members.filter(item => member._id != item);
        const newTeam: DBTeam = JSON.parse(JSON.stringify(team));
        newTeam.members = newMembers;
        await mutate(`/api/v1/teams/name/${decodeURIComponent(team.name).toLowerCase()}`, newTeam);
      }
      const data = await response.json();
      return data;
    } catch (error) {
        console.log(error)
      throw error;
    }
};

export default TeamDashboard;