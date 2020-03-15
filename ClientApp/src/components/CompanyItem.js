import React, { useState, useEffect  } from 'react';

export function CompanyItem(props) {

    const [canEdit, setCanEdit] = useState(props.initCanEdit);
    const [company, setCompany] = useState({ name: "", address: "", telephone: "", fax: "" });

    useEffect(() => {
        if (props.company != null) {
            setCompany(props.company);
        }
    }, [props.company]);

    function editClick() {
        setCanEdit(true);
    }

    function saveClick() {
        props.onEditDone(company);
    }

    function handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        var tmpCompany = JSON.parse(JSON.stringify(company));
        tmpCompany[name] = value;

        setCompany(tmpCompany);
    }

    if (!canEdit) {
        return (
            <tr>
                <td>{company.name}</td>
                <td>{company.address}</td>
                <td>{company.telephone}</td>
                <td>{company.fax}</td>
                <td>
                    <button onClick={editClick}>Edit</button>
                    {/*<button>Detail</button>*/}
                    {/*<button>Delete</button>*/}
                </td>
            </tr>
        );
    }
    else {
        return (
            <tr>
                <td>
                    <input name="name" value={company.name} onChange={handleInputChange} />
                </td>
                <td>
                    <input name="address" value={company.address} onChange={handleInputChange} />
                </td>
                <td>
                    <input name="telephone" value={company.telephone} onChange={handleInputChange} />
                </td>
                <td>
                    <input name="fax" value={company.fax} onChange={handleInputChange} />
                </td>
                <td>
                    <button onClick={saveClick}>Save</button>
                    {/*<button>Cancel</button>*/}
                </td>
            </tr>
        );
    }
}