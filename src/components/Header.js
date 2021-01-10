import React, { useState, useEffect } from "react"
import Wallet from "./Wallet"
import { Button, Input, Icon, Image } from "semantic-ui-react"
import { Link, Redirect } from "react-router-dom"
import "./Header.css"
import "../global.css"

export default function Header({ config, setSearch }) {
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {}, [config])
  return (
    <>
      <header className="headerContainer">
        <Link className="brandContainer" to="/">
          <Image src={process.env.PUBLIC_URL + "/book-logo.png"} size="tiny" />
          <p className="brand applogo">Dounty</p>
        </Link>
        <div className="navbarContainer">
          <Wallet className="user" config={config} />
          <Link to="/publish">
            <Button primary>Publish Bounty</Button>
          </Link>
        </div>
      </header>
    </>
  )
}
