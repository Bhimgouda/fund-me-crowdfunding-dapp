import React from 'react'
import { ethers } from "ethers"

function WithdrawsList({withdraws, owner}) {
  return (
    <div className="withdraws-list">
    <h2>Withdraws</h2>
    <table>
        <thead>
            <tr>
                <th style={{paddingRight: '50px'}}>Owner Address</th>
                <th style={{paddingRight: '50px'}}>Withdraw Amount</th>
                <th>Timing</th>
            </tr>
        </thead>
        <tbody>
            {withdraws.map((withdraw, index) => (
                <tr key={index}>
                    <td className='truncate' style={{paddingRight: '50px', }}>{owner}</td>
                    <td style={{paddingRight: '50px'}}>
                        {ethers.utils.formatEther(
                            withdraw.withdrawAmount
                        )}
                        &nbsp;Ether
                    </td>
                    <td>{withdraw.timeStamp.split("2023")[0]}</td>
                </tr>
            ))}
        </tbody>
    </table>
</div>
  )
}

export default WithdrawsList