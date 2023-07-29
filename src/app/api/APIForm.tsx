import fetchToCurl from "fetch-to-curl";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const APIForm = ({ requestUrl, requestMethod, fields, buttonText, description }: any) => {
    const [response, setResponse] = useState("");
    const initialFormData = fields ? fields.reduce((acc: any, field: any) => (
        { ...acc, [field.name]: "" }
    ), {}) : {};
    const [formData, setFormData] = useState<{[key: string]: string}>(initialFormData);
    const [curlCommand, setCurlCommand] = useState("");

    useEffect(() => {
        if (fields) {
            setFormData(
                fields.reduce((acc: any, field: any) => (
                    { ...acc, [field.name]: "" }
                ), {})
            );
        }
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
                // toast.error("All fields are required");
                return;
            }
        }
        let options;
        if (requestMethod == "GET") {
            options = {
                method: requestMethod,
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        } else {
            options = {
                method: requestMethod,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            }
        }
        let request = fetch(newRequestURL, options);
        const response = await request;
        const data = await response.text();
        setResponse(data);
        if(response.ok) {
          toast.success("Request successfully completed!");
        } else {
          toast.error("Request failed: " + data);
        }
    }

    const getCurl: any = () => {
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
        let options;
        if (requestMethod == "GET") {
            options = {
                method: requestMethod,
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        } else {
            options = {
                method: requestMethod,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            }
        }
        const prefix = window ? window.location.host : "stork.gt"
        return fetchToCurl(prefix + newRequestURL, options);
    }


    useEffect(() => {
        setCurlCommand(getCurl);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData])

    return (
        <div className='bg-neutral-800 border-b-4 border-neutral-800 rounded-xl p-4'>
            <div className='flex pb-2'>
                <span className={`border-2 ${requestMethod == "GET" ? "border-lime-400": "border-red-400"} rounded-full`}></span>
                <p className='px-2 py-1 rounded-lg text-xl break-all'>{requestUrl}</p>
            </div>
            { description ? <p className='text-sm'>{description}</p> : <></> }
            <div className="flex flex-col gap-4 justify-center pt-4">
                { fields && formData ? <div className='flex flex-col gap-4'>
                {fields?.map((field: any) => (
                    <div key={field.name}>
                        <input 
                            type={field.type} 
                            value={formData[field.name]} 
                            onChange={(e) => handleChange(e, field)} 
                            placeholder={field.placeholder}
                            className="px-4 py-2 w-full border-b-0 border-neutral-600 border-0 text-white bg-neutral-600 rounded-lg"
                        />
                    </div>
                ))}
                </div> : <></> }
                <button 
                    onClick={handleRequest}
                    className="bg-neutral-800 text-white border-2 border-teal-400 hover:bg-teal-600 hover:border-teal-600 rounded-xl"
                >
                    {buttonText}
                </button>
                <button 
                    onClick={(e) => {
                        navigator.clipboard.writeText(curlCommand);
                        toast.success("Copied cURL request to clipboard: " + curlCommand);
                    }}
                    className="bg-neutral-800 text-white border-2 border-neutral-600 rounded-xl hover:bg-neutral-700 hover:border-neutral-700"
                >
                    Get cURL
                </button>
                    { <div className='border-white'>
                        <p className="w-full break-all text-white p-0 m-0 bg-neutral-800 no-scrollbar max-h-40 overflow-scroll" contentEditable={true}>
                            {response}
                        </p>
                    </div>}
                </div>
        </div>
    );
}

export default APIForm;