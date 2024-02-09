import { Autocomplete } from '@mantine/core';
import { Rubik_Mono_One } from 'next/font/google';

const rubik = Rubik_Mono_One({ weight: "400", subsets: ["latin"] });

const AdminButton = ({ callback, children }: { callback?: any, children: any }) => {
    return <button className='w-max highlight-button' onClick={callback}>{children}</button>
}

const AdminCategoryTitle = ({ children }: { children: any }) => {
    return <h1 className={`text-4xl text-amber-400 text-shadow py-2 ${rubik.className}`}>{children}</h1>
}

const AdminItemTitle = ({ children }: { children: any }) => {
    return <h2 className='text-base text-white font-semibold w-max bg-amber-500 px-2 py-1 rounded-md'>{children}</h2>
}

const AdminPanel = () => {
    return <div className='mx-12 gap-4 flex flex-col'>
        <div className=''>
            <AdminCategoryTitle>General</AdminCategoryTitle>
            <div className='gap-2 grid grid-cols-3'>
                <div className='flex flex-col gap-2'>
                    <AdminItemTitle>Sync Storks</AdminItemTitle>
                    <AdminButton>Start Sync</AdminButton>
                </div>
                <div className='flex flex-col gap-2'>
                    <AdminItemTitle>Lock Team Picks</AdminItemTitle>
                    <Autocomplete 
                        label="Locked"
                        placeholder='false'
                        data={[]}
                    />
                    <AdminButton>Change Team Picks Lock</AdminButton>
                </div>
            </div>
        </div>
        <div>
            <AdminCategoryTitle>Team Management</AdminCategoryTitle>
            <div className='gap-2 grid grid-cols-3'>
                <div className='flex flex-col gap-2'>
                    <AdminItemTitle>Remove User From Team</AdminItemTitle>
                    <Autocomplete 
                        label="Team"
                        placeholder='Team Name'
                        data={[]}
                    />
                    <Autocomplete 
                        label="User"
                        placeholder='User Name'
                        data={[]}
                    />
                    <AdminButton>Remove User From Team</AdminButton>
                </div>
                <div className='flex flex-col gap-2'>
                    <AdminItemTitle>Add User To Team</AdminItemTitle>
                    <Autocomplete 
                        label="Team"
                        placeholder='Team Name'
                        data={[]}
                    />
                    <Autocomplete 
                        label="User"
                        placeholder='User Name'
                        data={[]}
                    />
                    <AdminButton>Add User To Team</AdminButton>
                </div>
                <div className='flex flex-col gap-2'>
                    <AdminItemTitle>Create Team</AdminItemTitle>
                    <Autocomplete 
                        label="Team"
                        placeholder='Team Name'
                        data={[]}
                    />
                    <Autocomplete 
                        label="Captain"
                        placeholder='User Name'
                        data={[]}
                    />
                    <AdminButton>Create Team</AdminButton>
                </div>
                <div className='flex flex-col gap-2'>
                    <AdminItemTitle>Change Team Captain</AdminItemTitle>
                    <Autocomplete 
                        label="Team"
                        placeholder='Team Name'
                        data={[]}
                    />
                    <Autocomplete 
                        label="Captain"
                        placeholder='User Name'
                        data={[]}
                    />
                    <AdminButton>Change Team Captain</AdminButton>
                </div>
                <div className='flex flex-col gap-2'>
                    <AdminItemTitle>Delete Team</AdminItemTitle>
                    <Autocomplete 
                        label="Team Name"
                        placeholder='Team Name'
                        data={[]}
                    />
                    <AdminButton>Delete Team</AdminButton>
                </div>
            </div>
        </div>
        <div>
            <AdminCategoryTitle>User Management</AdminCategoryTitle>
            <div className='gap-2 grid grid-cols-3'>
                <div className='flex flex-col gap-2'>
                    <AdminItemTitle>Delete User</AdminItemTitle>
                    <Autocomplete 
                        label="User Name"
                        placeholder='User Name'
                        data={[]}
                    />
                    <AdminButton>Delete User</AdminButton>
                </div>
            </div>
        </div>
    </div>
}

export default AdminPanel;