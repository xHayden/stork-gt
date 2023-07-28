import { useState, useEffect } from "react";
import { HiOutlineX } from "react-icons/hi";
import { APINameComboboxProps, APIForm } from '@/app/types';


export default function APINameCombobox(props: APINameComboboxProps) {
    const [query, setQuery] = useState('');
  
    useEffect(() => {
      if (props.selected) { 
          setQuery(props.selected.name);
      }
    }, [props.selected]);
  
    useEffect(() => {
      props.setVisible(query === ''
          ? props.elements
          : props.elements.filter((apiForm: any): boolean => {
              return apiForm.name.toLowerCase().includes(query.toLowerCase())
      }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query])
  
    return (
      <div className="text-white bg-neutral-800 p-2 w-full rounded-lg">
            <div className="bg-neutral-800 mb-2 flex items-center border-b-2 border-neutral-600">
                <input type="text" 
                    className="bg-neutral-800 w-full text-neutral-300 focus:outline-none" 
                    onChange={(event) => setQuery(event.target.value)} 
                    placeholder='API Request'
                    value={query}
                />
                <span onClick={() => setQuery("")} className={query == "" ? 'hidden' : `cursor-pointer`}><HiOutlineX size={24} color="red"/></span>
            </div>
            <div className="gap-4 flex flex-col flex-wrap">
                {props.visible.map((apiForm: APIForm) => {
                    return <div key={apiForm.requestUrl} className="flex flex-col gap-0 hover:cursor-pointer flex-wrap"
                        onClick={() => {
                            props.setSelected(apiForm);
                        }}
                    >
                        <p className='leading-3 text-sm flex flex-wrap break-all'>
                            {apiForm.name}  
                        </p>
                        <p className="text-xs text-neutral-200 flex flex-wrap break-all">
                            {apiForm.requestUrl}
                        </p>
                        {/* <p className="text-xs">
                            {apiForm.description}
                        </p> */}
                        <div className={`w-full border-2 rounded-xl ${apiForm.requestMethod == "GET" ? "border-lime-400": "border-red-400"}`}></div>
                    </div>
                })}
            </div>
      </div>
    )
  }