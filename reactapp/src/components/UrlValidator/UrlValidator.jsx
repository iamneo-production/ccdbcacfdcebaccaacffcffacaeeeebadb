import React, { useEffect, useState } from 'react';
 
const UrlValidator = () => {
 
    let [disabled,setDisabled] = useState(false);
 
    const isValidateDomain = (d) => {
        if(d.startsWith("www.") && d.endsWith(".com")) {
            return true;
        }
        return false;
    }
 
    const convertToPath = (input) => {
        return '/' + input.split(" ").join("/");
    }
 
    const convertJson = (jsonString) => {
        const jsonObject = JSON.parse(jsonString);
        const params = "?" + Object.entries(jsonObject).map((e) => e.join("=")).join("&");
        return params;
    }
 
    const isValidJson = (jsonString) => {
        try {
            JSON.parse(jsonString);
            return true;
        } catch (e) {
            return false;
        }
    }
 
    const validateForm = (domain,path,method,body) => {
        if (!isValidateDomain(domain)) {
            console.log("went");
            return "Invalid URL! Please recheck your URL";
        }
        if (method === "GET") {
            if (Object.keys(body).length === 0 ) return "";
            if (!isValidJson(body)) return "Error in the Body of the Query Params";
        }
        if (method === "POST" || method === "PUT") {
            if(Object.keys(body).length === 0) 
                return "Error in the Body";
            if(!isValidJson(body)) {
                return "Error in the Body";
            }
        }
        return "";
    }
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        let domain = e.target[0].value;
        let path = e.target[1].value;
        let method = e.target[2].value;
        let body = e.target[3].value;
        let tmp_msg = validateForm(domain,path,method,body);
        console.log(tmp_msg)
        if(tmp_msg==="") {
            console.log("success");
            let link = domain + convertToPath(path)
            if (Object.keys(body).length != 0 && method === "GET") link = link + convertJson(body);
            console.log(typeof link);
            document.getElementById("message").textContent = link.trim();
            console.log(link.trim());
        }
        else {
            document.getElementById("message").textContent = tmp_msg;
        }
 
    }
    return (
        <div className="main-div">
            <div data-testid="message" id="message"></div>
            <form data-testid="submit" onSubmit={handleSubmit}>
 
                <label>
                    Domain:
                    <input data-testid="domain" type="text" />
                </label>
                <br />
                <label>
                    Path:
                    <input data-testid="path" type="text" />
                </label>
                <br />
                <label>
                    Method:
                    <select data-testid="method" defaultValue="GET" id="method" onChange={(e)=>{
                        console.log(e);
                        (document.getElementById("method").value==="DELETE") ? setDisabled(true) : setDisabled(false);
                    }}>
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                    </select>
                </label>
                <br />
                <label>
                    Body:
                    <textarea data-testid="body" 
                        disabled={disabled}  
                     />
                </label>
                <br />
                <button type="submit">Validate</button>
            </form>
        </div>
    );
}
 
export default UrlValidator;