import React, { useState } from "react"
import { ConfigHelper } from "@oceanprotocol/lib"
import { OceanProvider, useOcean } from "@oceanprotocol/react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom"
import { NetworkMonitor } from "./components/NetworkMonitor"
import Header from "./components/Header"
import Bounties from "./components/Bounties"
import BountyDetails from "./components/BountyDetails"
import Publish from "./components/Publish"
import "./App.css"

const configRinkeby = new ConfigHelper().getConfig(
  process.env.REACT_APP_NETWORK
)

const providerOptions = {}

export const web3ModalOpts = {
  cacheProvider: true,
  providerOptions
}

function App() {
  const [config, setConfig] = useState(configRinkeby)

  return (
    <OceanProvider initialConfig={configRinkeby} web3ModalOpts={web3ModalOpts}>
      <NetworkMonitor setConfig={setConfig} />
      <Router>
        <Switch>
          <div className="App">
            <Header config={config} />
            <div className="divider"></div>
            <Route
              path="/bounty/:id"
              component={() => <BountyDetails config={config} />}
            />
            <Route
              path="/account"
              exact
              component={() => <Bounties config={config} myAssets={true} />}
            />
            <Route
              path="/publish"
              component={() => <Publish config={config} />}
            />
            <Route
              path="/bounties/:term"
              exact
              component={() => <Bounties config={config} myAssets={false} />}
            />
            <Route path="/" exact>
              <Redirect to="/bounties/home" />
            </Route>
          </div>
        </Switch>
      </Router>
    </OceanProvider>
  )
}

export default App
