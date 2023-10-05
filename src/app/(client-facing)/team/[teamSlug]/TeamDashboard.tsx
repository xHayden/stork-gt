"use client"

import { Key, useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { Combobox, useCombobox, TextInput } from '@mantine/core';
import { ObjectNotFoundError } from '@/app/types/errors';
import { DBStork, DBTeam, DBUser, User } from '@/app/types';
import { Roboto, Rubik_Mono_One } from 'next/font/google';
import { toast } from 'react-hot-toast';

const roboto = Roboto({ weight: "400", subsets: ["latin"] });
const rubik = Rubik_Mono_One({ weight: "400", subsets: ["latin"] });

interface TeamDashboardProps {
    params: {
        teamSlug: string
    }
}

const TeamDashboard: React.FC<TeamDashboardProps> = ({ params }) => {
    const [members, setMembers] = useState<DBUser[]>([]);
    const [storks, setStorks] = useState<DBStork[]>([]);
    const [team, setTeam] = useState<DBTeam>();
    const [userSearch, setUserSearch] = useState('');
    const [userSearchData, setUserSearchData] = useState<DBUser[]>([]);
    const [userSearchError, setUserSearchError] = useState(false);
    const [storkSearch, setStorkSearch] = useState('');
    const [storkSearchData, setStorkSearchData] = useState<DBStork[]>([]);
    const [storkSearchError, setStorkSearchError] = useState(false);

    useEffect(() => {
        async function fetchTeams() {
            const teamRes = await fetch(`/api/v1/teams/name/${params.teamSlug}`)
            let teamData = await teamRes.json();
            if (teamData.error) {
                redirect("/404")
            }
            let team: DBTeam = teamData;
            setTeam(team);
            
            setMembers(await Promise.all(team.members.map(async (member) => {
                const data = await fetch(`/api/v1/users/id/${member}`)
                const json = await data.json();
                if (json.error) {
                    throw new ObjectNotFoundError(`/team/${params.teamSlug}`, DBUser);
                }
                return json
            })));

            setStorks(await Promise.all(team.storks.map(async (stork) => {
                const data = await fetch(`/api/v1/storks/id/${stork}`)
                const json = await data.json();
                if (json.error) {
                    throw new ObjectNotFoundError(`/team/${params.teamSlug}`, DBStork);
                }
                return json
            })));
        }
        fetchTeams()
    }, [params.teamSlug])

    return (team != undefined && members != undefined) ? <div className='mx-2'>
        <div className='max-w-screen-lg'>
            <h1 className={`text-4xl ${rubik.className}`}>{team.name}</h1>
            <h2 className={`text-2xl w-max bg-red-400 px-6 py-2 border-b-4 border-0 border-red-600 text-orange-100 ${rubik.className}`}>Members:</h2>
            <ul className={`${roboto.className} border-2 w-full bg-white rounded-xl p-2 my-2`}>
                { members.map((member) => {
                    return <li key={member.name} className=''>
                        <p className='font'>{member.name}</p>
                        <p className='text-xs'>{member.email}</p>
                        <p className='text-xs'>{member.role}</p>
                        <p className='text-xs font-bold'>{new User(member).paidDues() ? "" : "Needs to pay dues."}</p>
                        </li>
                }) }
            </ul>
            <div className={`${roboto.className} flex gap-2 w-full items-center`}>
                <div className='w-full'>
                    <SearchCombobox 
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
                <div className='gap-2 flex w-max'>
                    <button className='w-max' onClick={(event: React.FormEvent<HTMLButtonElement>) => {
                        toast.success(`Sent invite to ${userSearch} to join ${team.name}`)
                    }}>Add</button>
                    <button className='w-max' onClick={(event: React.FormEvent<HTMLButtonElement>) => {
                        toast.success(`Removed ${userSearch} from team`)
                    }}>Remove</button>
                </div>
            </div>
            <h2 className={`text-2xl w-max bg-red-400 px-6 py-2 border-b-4 border-0 border-red-600 text-orange-100 ${rubik.className}`}>Storks:</h2>
            <ul className={`${roboto.className} border-2 w-full bg-white rounded-xl p-2 my-2`}>
                { storks.map((stork) => {
                    return <li key={stork.name} className=''>
                        <p className='font'>{stork.name}</p>
                        </li>
                }) }
            </ul>
            <div className={`${roboto.className} flex gap-2 w-full items-center`}>
                <div className='w-full'>
                    <SearchCombobox 
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
                    <button className='w-max' onClick={(event: React.FormEvent<HTMLButtonElement>) => {
                        toast.success(`Added ${storkSearch} to ${team.name}`)
                    }}>Add</button>
                    <button className='w-max' onClick={(event: React.FormEvent<HTMLButtonElement>) => {
                        toast.success(`Removed ${storkSearch} from team`)
                    }}>Remove</button>
                </div>
            </div>
        </div>
    </div> : <p></p>
}

interface SearchComboboxProps {
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
}: SearchComboboxProps) {
    const itemCombobox = useCombobox({
        onDropdownOpen: () => itemCombobox.resetSelectedOption(),
        onDropdownClose: () => itemCombobox.updateSelectedOptionIndex('active')
    });

    useEffect(() => {
        fetch(`${allRoute}`).then((items) => {
            items.json().then((itemData) => {
                setItemSearchData(itemData.error ? [] : itemData);
                setItemSearchError(itemData.error != undefined);
            })
        })
    }, [])

    useEffect(() => {
        // we need to wait for options to render before we can select first one
        itemCombobox.selectActiveOption()
      }, [itemSearch, itemCombobox]);

    return <Combobox
        store={itemCombobox}
        onOptionSubmit={(val) => {
            setItemSearch(val);
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
                    itemCombobox.openDropdown();
                    itemCombobox.updateSelectedOptionIndex();
                }}
                onClick={() => itemCombobox.openDropdown()}
                onFocus={() => itemCombobox.openDropdown()}
                onBlur={() => itemCombobox.closeDropdown()}
            />
        </Combobox.Target>
        <Combobox.Dropdown>
            <Combobox.Options className={`flex flex-col ${roboto.className}`}>
                {itemSearchData.length === 0 ? <Combobox.Empty>Nothing found</Combobox.Empty> : 
                itemSearchData.map((item: DBStork | DBUser) => <Combobox.Option value={item.name} key={item._id.toString() as Key}>
                    <p className='font'>{item.name}</p>
                    { hasEmail(item) ? <p className='text-xs'>{item.email}</p> : <></> }
                </Combobox.Option>)}
            </Combobox.Options>
        </Combobox.Dropdown>
    </Combobox>
}

function hasEmail(item: DBStork | DBUser): item is DBUser {
    return (item as DBUser).email !== undefined;
}

export default TeamDashboard;