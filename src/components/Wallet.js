import React, { useCallback, useState } from "react"
import { useOcean } from "@oceanprotocol/react"
import { Button, Popup } from "semantic-ui-react"
import { useEffect } from "react"
import { Link } from "react-router-dom"

export default function Wallet({ config }) {
  const { ocean, connect, logout, accountId, balance } = useOcean()
  const conn = async () => {
    await connect()
  }

  const init = useCallback(async () => {
    if (ocean === undefined || accountId === undefined) return
    await ocean.assets.ownerAssets(accountId)
  }, [accountId, ocean])

  useEffect(() => {
    init()
  }, [ocean, accountId, init, config])

  return (
    <>
      {accountId ? (
        <div>
          <Link to="/account">
            <Popup
              content={
                config && config.network
                  ? `
              Network: ${config.network} |
              OCEAN: ${Number(balance.ocean).toFixed(2)} |
              ETH: ${Number(balance.eth).toFixed(2)}`
                  : "invalid network"
              }
              trigger={
                <Button
                  color="teal"
                  icon="user circle"
                  content={
                    accountId.substring(0, 6) +
                    "....." +
                    accountId.substring(accountId.length - 4, accountId.length)
                  }
                  readOnly
                  style={{ cursor: "pointer" }}
                />
              }
            />
          </Link>
        </div>
      ) : (
        <div>
          <Button onClick={conn}>Connect</Button>
        </div>
      )}
    </>
  )
}
