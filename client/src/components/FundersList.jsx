import React from "react"
import { ethers } from "ethers"

function FundersList({funders}) {
    return (
        <div className="funders-list">
            <h2>Funders List</h2>
            <table>
                <thead>
                    <tr>
                        <th style={{paddingRight: '50px'}}>Funder Address</th>
                        <th style={{paddingRight: '50px'}}>Amount Funded</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {funders.map((funder, index) => (
                        <tr key={index}>
                            <td style={{paddingRight: '50px'}} className="truncate">{funder.funderAddress}</td>
                            <td style={{paddingRight: '50px'}}>
                                {ethers.utils.formatEther(funder.amountFunded)}
                                &nbsp;Ether
                            </td>
                            <td>{funder.timeStamp.split("2023")[0]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default FundersList
