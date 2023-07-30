'use client'
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Rubik_Mono_One, Roboto } from 'next/font/google'
import APIForm from './APIForm';
import APINameCombobox from './APISearchCombobox';

const roboto = Roboto({ weight: "400", subsets: ["latin"] });
const rubik = Rubik_Mono_One({ weight: "400", subsets: ["latin"] });

export default function Admin() {
    const apiForms = [
        {
          name: 'Get Alive Storks',
          requestUrl: '/api/v1/storks/alive',
          requestMethod: 'GET',
          description: "Retrieves a list of all currently living storks, including their names, tracked locations, and other details.",
          buttonText: 'Run Get Alive Storks'
        },
        {
          name: 'Get Dead Storks',
          requestUrl: '/api/v1/storks/dead',
          requestMethod: 'GET',
          description: "Retrieves a list of all deceased storks, including their names and other details.",
          buttonText: 'Run Get Dead Storks'
        },
        {
          name: 'Get Stork By Id',
          requestUrl: '/api/v1/storks/id/{storkId}',
          requestMethod: 'GET',
          description: "Retrieves a specific stork's information using its unique ID.",
          buttonText: 'Run Get Stork By Id',
          fields: [
            { name: 'storkId', type: 'text', placeholder: 'Stork Id' }
          ]
        },
        {
          name: 'Get Stork By Name',
          requestUrl: '/api/v1/storks/name/{storkName}',
          requestMethod: 'GET',
          description: "Retrieves a specific stork's information using its name.",
          buttonText: 'Run Get Stork By Name',
          fields: [
            { name: 'storkName', type: 'text', placeholder: 'Stork Name' }
          ]
        },
        {
          name: 'Create New Team',
          requestUrl: '/api/v1/teams/create',
          requestMethod: 'POST',
          description: "Creates a new team with a given name and captain's ID.",
          buttonText: 'Run Create New Team',
          fields: [
            { name: 'name', type: 'text', placeholder: 'Team Name' },
            { name: 'captain', type: 'text', placeholder: 'Captain ID' }
          ]
        },
        {
          name: 'Add Team Member By Id',
          requestUrl: '/api/v1/teams/{teamId}/members/add',
          requestMethod: 'POST',
          description: "Adds a new member to a specified team using the member's unique ID.",
          buttonText: 'Run Add Team Member By Id',
          fields: [
            { name: 'id', type: 'text', placeholder: 'Member ID' },
            { name: 'teamId', type: 'text', placeholder: 'Team ID' }
          ]
        },
        {
          name: 'Get Team Members By Id',
          requestUrl: '/api/v1/teams/{teamId}/members/get',
          requestMethod: 'GET',
          description: "Retrieves all members of a specified team using the team's unique ID.",
          buttonText: 'Run Get Team Members By Id',
          fields: [
            { name: 'teamId', type: 'text', placeholder: 'Team ID' }
          ]
        },
        {
          name: 'Remove Team Member By Id',
          requestUrl: '/api/v1/teams/{teamId}/members/remove',
          requestMethod: 'POST',
          description: "Removes a member from a specified team using the member's unique ID.",
          buttonText: 'Run Remove Team Member By Id',
          fields: [
            { name: 'id', type: 'text', placeholder: 'Member ID' },
            { name: 'teamId', type: 'text', placeholder: 'Team ID' }
          ]
        },
        {
          name: 'Get Team By Name',
          requestUrl: '/api/v1/teams/name/{teamName}',
          requestMethod: 'GET',
          description: "Retrieves a specific team's information using its name.",
          buttonText: 'Run Get Team By Name',
          fields: [
            { name: 'teamName', type: 'text', placeholder: 'Team Name' }
          ]
        },
        {
          name: 'Get Team By Id',
          requestUrl: '/api/v1/teams/{teamId}',
          requestMethod: 'GET',
          description: "Retrieves a specific team's information using its unique ID.",
          buttonText: 'Run Get Team By Id',
          fields: [
            { name: 'teamId', type: 'text', placeholder: 'Team ID' }
          ]
        },
        {
          name: 'Create New User',
          requestUrl: '/api/v1/users/create',
          requestMethod: 'POST',
          description: "Creates a new user with a given name and email address.",
          buttonText: 'Run Create New User',
          fields: [
            { name: 'name', type: 'text', placeholder: 'User Name' },
            { name: 'email', type: 'text', placeholder: 'User Email' }
          ]
        },
        {
          name: 'Get User By Email',
          requestUrl: '/api/v1/users/{email}',
          requestMethod: 'GET',
          description: "Retrieves a specific user's information using their email address.",
          buttonText: 'Run Get User By Email',
          fields: [
            { name: 'email', type: 'text', placeholder: 'User Email' }
          ]
        }
    ];
    
      
    const [selectedAPI, setSelectedAPI] = useState();
    const [visibleAPIs, setVisibleAPIs] = useState(apiForms);
      
    return (
        <main className="">
            <div><Toaster/></div>
            <div className='flex w-full gap-4 p-4 4xl:w-2/3'>
                <div className='w-1/2 sm:w-1/4 md:w-1/5'>
                    <APINameCombobox elements={apiForms} setSelected={setSelectedAPI} selected={selectedAPI} visible={visibleAPIs} setVisible={setVisibleAPIs}/>
                </div>
                <div className='w-1/2 sm:w-3/4 md:w-4/5'>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {visibleAPIs.map((form, index) => (
                        <APIForm 
                            key={index}
                            requestUrl={form.requestUrl}
                            requestMethod={form.requestMethod}
                            buttonText={form.buttonText}
                            description={form.description}
                            fields={form.fields}
                        />
                    ))}
                    </div>
                </div>
            </div>
        </main>
    )
}