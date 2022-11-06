import { useEffect, useState } from "react";

export default function PrimaryNameForm({ onChange }) {
    
    const [primaryName, setPrimaryName] = useState('');

    useEffect(() => {
        onChange({
            primaryName,
        });
      }, [primaryName, onChange]);

    
      const handleSubmit = async (event) => {
        event.preventDefault();
        setPrimaryName('');
  
      // Get data from the form.
      const data = {
        primary_name: event.target.primary_name.value
      }
  
      const JSONdata = JSON.stringify(data)
  
      // API endpoint where we send form data.
      const endpoint = '/api/form'
  
      // Form the request for sending data to the server.
      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        body: JSONdata,
      }

      const response = await fetch(endpoint, options)
      const result = await response.json()
      
    }
    return (
      // We pass the event to the handleSubmit() function on submit.
      <form>
        <label htmlFor="primary_name">Primary Name</label>
        <input 
            type='text'
            id='primary_name'
            name='primary_name' required
            onChange={event => setPrimaryName(event.target.value)} 
            value={primaryName}
            placeholder='nftychat.eth'
        />
      </form>
    )
  }