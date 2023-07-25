'use client'
import { useEffect, useState } from 'react';
import { User } from "../types";
import { toast, Toaster } from 'react-hot-toast';
import { Rubik_Mono_One, Roboto } from 'next/font/google'

const roboto = Roboto({ weight: "400", subsets: ["latin"] });
const rubik = Rubik_Mono_One({ weight: "400", subsets: ["latin"] });

const APIForm = ({ requestUrl, requestMethod, fields, buttonText }: any) => {
    const [response, setResponse] = useState("");
    const [formData, setFormData] = useState<{[key: string]: string}>({});

    useEffect(() => {
        setFormData(fields?.reduce((acc: any, field: any) => ({ ...acc, [field.name]: "" }), {}));
    }, [fields]);


    const handleChange = (e: any, field: any) => {
        setFormData({ ...formData, [field.name]: e.target.value });
    }

    const handleRequest = async () => {
        let newRequestURL = requestUrl;
        if (fields && newRequestURL.includes("{")) {
            // Use regular expression to find text between curly braces
            let regex = /\{(\w+)\}/g;
            let match;
        
            // Find each instance of a variable in the URL
            while (match = regex.exec(requestUrl)) {
                // Replace the found variable with the value from the fields object
                let variable = match[1];
                let fieldObject = fields.find((field: any) => field.name === variable);
                if (fieldObject && formData.hasOwnProperty(variable)) {
                    newRequestURL = newRequestURL.replace("{" + variable + "}", formData[variable]);
                }
            }
        }
        if (fields) {
            if(Object.values(formData).some(value => value === "")) {
                toast.error("All fields are required");
                return;
            }
        }
        let request;
        if (requestMethod == "GET") {
            request = fetch(newRequestURL, {
                method: requestMethod,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        } else {
            request = fetch(newRequestURL, {
                method: requestMethod,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
        }
        const response = await request;
        const data = await response.text();
        setResponse(data);
        if(response.ok) {
          toast.success("Request successfully completed!");
        } else {
          toast.error("Request failed: " + data);
        }
    }

    return (
        <div className="flex flex-col gap-2 bg-white p-4 border-b-8 border-teal-500">
            <div className='flex flex-col gap-2'>
              {fields?.map((field: any) => (
                  <div key={field.name}>
                      <input 
                          type={field.type} 
                          value={formData[field.name]} 
                          onChange={(e) => handleChange(e, field)} 
                          placeholder={field.placeholder}
                          className="px-1 py-2 w-full border-b-4 border-teal-500 border-2 text-black"
                      />
                  </div>
              ))}
            </div>
            <button 
                onClick={handleRequest}
                className="bg-teal-500 text-white"
            >
                {buttonText}
            </button>
            <div className='border-white'>
                { response ? <div>
                <textarea className="w-full text-black p-0 m-0" key={response}>{response}</textarea>
                </div> :  <></> }
            </div>
        </div>
    );
}

const AdminSectionFrame = (props: any) => {
    return <div className="flex gap-2 flex-col">
        <h1 className={`text-4xl bg-white w-max text-black px-4 py-2 ${rubik.className}`}>{props.title}</h1>
        <div className='grid grid-cols-3 gap-8'>
            { props.children }
        </div>
    </div>;
}

export default function Admin() {
    return (
        <main>
            <div><Toaster/></div>
            <div className="flex gap-4 flex-col">
                <AdminSectionFrame title="Storks">
                        <APIForm 
                            requestUrl='/api/storks/alive'
                            requestMethod='GET'
                            buttonText='Get Alive Storks'
                        />
                        <APIForm 
                            requestUrl='/api/storks/dead'
                            requestMethod='GET'
                            buttonText='Get Dead Storks'
                        />
                        <APIForm 
                            requestUrl='/api/storks/id/{storkId}'
                            requestMethod='GET'
                            buttonText='Get Stork By Id'
                            fields={[
                                {name: 'storkId', type: 'text', placeholder: 'Stork Id'}
                            ]}
                        />
                        <APIForm 
                            requestUrl='/api/storks/name/{storkName}'
                            requestMethod='GET'
                            buttonText='Get Stork By Name'
                            fields={[
                                {name: 'storkName', type: 'text', placeholder: 'Stork Name'}
                            ]}
                        />
                </AdminSectionFrame>
                <AdminSectionFrame title="Teams">
                    <APIForm 
                        requestUrl='/api/teams/create'
                        requestMethod='POST'
                        buttonText='Create New Team'
                        fields={[
                            {name: 'name', type: 'text', placeholder: 'Team Name'},
                            {name: 'captain', type: 'text', placeholder: 'Captain ID'}
                        ]}
                    />
                </AdminSectionFrame>
            </div>
        </main>
    )
}