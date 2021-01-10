import React, { useEffect, useState } from "react"
import {
  useOcean,
  useConsume,
  usePricing,
  usePublish
} from "@oceanprotocol/react"

import {
  Grid,
  Image,
  Card,
  Label,
  Icon,
  Button,
  Accordion
} from "semantic-ui-react"
import Web3 from "web3"
import { useParams, Link } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import Spinner from "./Spinner"
import "./BountyDetails.css"
import Downloader from "./Downloader"
import SubmitWork from "./SubmitWork"
import fileDownload from "js-file-download"

export default function BountyDetails({ config }) {
  const { ocean, accountId } = useOcean()
  const [bounty, setBounty] = useState(null)
  const [address, setAddress] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)
  const [buttonText, setButtonText] = useState("Connect Wallet")
  const [showButton, setShowButton] = useState(false)
  const [btnDisabled, setBtnDisabled] = useState(false)
  const [showSubmitForm, setShowSubmitForm] = useState(false)
  const [activeIndex, setActiveIndex] = useState(null)
  const [workers, setWorkers] = useState(null)
  const [showDownloader, setShowDownloader] = useState(false)
  const [workToDownload, setWorkToDownload] = useState(null)
  const [spinnerText, setSpinnerText] = useState("Loading")
  const [ddo, setDdo] = useState(null)

  const BUTTON_TEXT = {
    START: "Start Work",
    SELF: "This is your bounty",
    SUBMIT: "Submit Work",
    SUBMITTED: "Work Already Submitted",
    CONNECT: "Connect Wallet"
  }

  let { id } = useParams()
  //DELETE
  const { publish, publishStepText } = usePublish()

  useEffect(() => {
    async function getBountyDetails(id) {
      setIsLoading(true)
      try {
        const url = `${process.env.REACT_APP_SERVER_URL}/bounty/${id}`

        let encodedUrl = encodeURI(url)
        const response = await fetch(encodedUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        })
        const res = await response.json()
        console.log(res)
        setBounty(res.data)
        setAddress(accountId)
        await getNextActionForButton(res.data)
        setWorkers(bounty.workers)
        await loadWeb3()
        setIsLoading(false)
      } catch (error) {
        console.log(error)
      }
    }

    getBountyDetails(id)
  }, [config, address])

  //DELETE
  async function downloadData(fileUrl) {
    setShowDownloader(true)
    const asset = {
      main: {
        type: "dataset", //dataset
        name: `Dounty Download`,
        dateCreated: new Date(Date.now()).toISOString().split(".")[0] + "Z", // remove milliseconds
        files: [
          {
            url: "https://nodata.com/nofile.pdf",
            checksum: "efb2c764274b745f5fc37f97c6b0e761",
            encoding: "UTF-8",
            contentLength: "4535431",
            contentType: "image/jpeg",
            compression: "zip"
          }
        ]
      }
    }
    let ranum = parseInt(Math.random() * 100)
    let dtOptions = {
      cap: "5000",
      symbol: "DOUNTY-" + ranum,
      name: "Dounty Token " + ranum
    }
    //   uncomment this below 2 lines
    const ddo = await publish(asset, "access", dtOptions)
    console.log(ddo)
    setDdo(ddo)
    setShowDownloader(false)
    let resp = await fetch(fileUrl)
    let data = await resp.text()
    fileDownload(data, "bounty-work.csv")
    setShowDownloader(false)
  }

  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
      const accounts = await window.web3.eth.getAccounts()

      //set Account
      setAddress(accounts[0])

      // event handler
      window.ethereum.on("accountsChanged", handleAccountsChanged)
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      )
    }
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      alert("Please connect to MetaMask.")
    } else if (accounts[0] !== address) {
      setAddress(accounts[0])
      console.log("Account Changed to - ", address)
    }
  }

  async function getNextActionForButton(bounty) {
    if (address == bounty.poster) {
      setShowButton(true)
      setBtnDisabled(true)
      setButtonText(BUTTON_TEXT.SELF)

      return
    } else if (bounty.status == "active") {
      if (!bounty.workers) {
        bounty.workers = {}
      } else {
        let workersAddress = Object.keys(bounty.workers)
        setShowButton(true)
        let index = workersAddress.indexOf(address)
        if (index < 0) {
          setBtnDisabled(false)
          setButtonText(BUTTON_TEXT.START)
        } else {
          if (bounty.workers[address].status == "working") {
            setBtnDisabled(false)
            setButtonText(BUTTON_TEXT.SUBMIT)
          } else if (bounty.workers[address].status == "submitted") {
            setBtnDisabled(true)
            setButtonText(BUTTON_TEXT.SUBMITTED)
          }
        }
      }
    } else if (bounty.status == "new") {
      setShowButton(true)
      setBtnDisabled(false)
      setButtonText(BUTTON_TEXT.START)
    } else {
      setShowButton(true)
      setBtnDisabled(false)
      setButtonText(BUTTON_TEXT.CONNECT)
    }
  }

  async function handleStatusUpdate(e) {
    try {
      let _workers = bounty.workers || {}

      console.log("BTN TEXT - " + e)

      if (buttonText == BUTTON_TEXT.START) {
        if (!_workers[address]) {
          _workers[address] = {}
        }
        _workers[address].status = "working"

        let res = await fetch(`${process.env.REACT_APP_SERVER_URL}/update`, {
          method: "POST",
          body: JSON.stringify({
            _id: bounty._id,
            status: "active",
            workers: _workers
          }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        })

        console.log(res.status)
        if (res.status == 200) {
          setButtonText(BUTTON_TEXT.SUBMIT)
          console.log("setting workers - " + _workers)
          setWorkers(_workers)
        }
      } else if (buttonText == BUTTON_TEXT.CONNECT) {
        setAddress(accountId)
        console.log(address)
        await getNextActionForButton(bounty)
      } else if (buttonText == BUTTON_TEXT.SUBMIT) {
        setShowSubmitForm(true)
      }
    } catch (err) {
      console.error(err)
      alert(err.message)
    }
  }

  function handleActiveIndexChange(e, titleProps) {
    const { index } = titleProps
    const newIndex = activeIndex === index ? -1 : index
    setActiveIndex(newIndex)
  }

  function handleDownloadUpdate(ddo) {
    setWorkToDownload(ddo)
    setShowDownloader(true)
  }

  function renderFeeds() {
    return (
      <Card>
        <h3 style={{ textAlign: "center", padding: 10 }}>Feeds</h3>
        <Accordion styled>
          {Object.keys(bounty.workers).map((worker, index) => {
            return (
              <>
                <Accordion.Title
                  active={activeIndex === index}
                  index={index}
                  onClick={handleActiveIndexChange}
                >
                  <Icon name="dropdown" />
                  {bounty.workers[worker].status == "working"
                    ? worker.substring(0, 5) +
                      "...." +
                      worker.substring(worker.length - 5, worker.length) +
                      " started working on this bounty"
                    : worker.substring(0, 5) +
                      "...." +
                      worker.substring(worker.length - 5, worker.length) +
                      " submitted work for this bounty"}
                </Accordion.Title>
                <Accordion.Content active={activeIndex === index}>
                  {bounty.workers[worker].status == "submitted" ? (
                    <>
                      <p>{bounty.workers[worker].workComment}</p>
                      <div className="ui two buttons">
                        <a
                          className="ui two buttons"
                          href={bounty.workers[worker].sampleUrl}
                          target="_blank"
                        >
                          <Button color="teal">View Sample</Button>
                        </a>
                        <Button
                          color="blue"
                          onClick={() =>
                            downloadData(bounty.workers[worker].workUrl)
                          }
                        >
                          Download
                        </Button>
                      </div>
                    </>
                  ) : (
                    <p>
                      {worker.substring(0, 5) +
                        "...." +
                        worker.substring(worker.length - 5, worker.length)}{" "}
                      is still working on this bounty
                    </p>
                  )}
                </Accordion.Content>
              </>
            )
          })}
        </Accordion>
      </Card>
    )
  }
  function renderLoader() {
    return <Spinner text={spinnerText} />
  }

  function renderContent() {
    return (
      <div className="detailsContainer">
        <Grid divided="vertically" className="container">
          <Grid.Row centered key={1} columns={2}>
            <Grid.Column width={4}>
              <Card>
                <Card.Content>
                  <>
                    <h2>Status</h2>
                    <p>{bounty.status.toUpperCase()}</p>
                    <h2>Reward</h2>
                    <p>{bounty.reward} OCEAN</p>
                    <h2>Workers</h2>
                    <p>{workers ? Object.keys(workers).length : 0}</p>
                    <h2>Posted By</h2>
                    <p>
                      {bounty.poster.substring(0, 6) +
                        "........" +
                        bounty.poster.substring(
                          bounty.poster.length - 4,
                          bounty.poster.length
                        )}
                    </p>
                  </>
                </Card.Content>
              </Card>
            </Grid.Column>

            <Grid.Column width={6}>
              <Card fluid className="cards">
                <Card.Content className="cardContent">
                  <Card.Header>{bounty.name}</Card.Header>
                  <Card.Meta>
                    <span>{bounty.license} License</span>
                  </Card.Meta>
                </Card.Content>

                <Card.Content>
                  <Card.Description>
                    <ReactMarkdown>{bounty.description}</ReactMarkdown>
                  </Card.Description>
                  <Card.Meta style={{ marginTop: 20, fontWeight: 600 }}>
                    Category : {bounty.category ? bounty.category : "N/A"}
                  </Card.Meta>
                  <Card.Meta style={{ fontWeight: 600 }}>
                    Reward : {bounty.reward + " $OCEAN"}
                  </Card.Meta>
                </Card.Content>
                {bounty.tags.length ? (
                  <Card.Content extra>
                    {bounty.tags.map((tag, i) => (
                      <Label key={i} as="a" color="teal" horizontal>
                        {tag}
                      </Label>
                    ))}
                  </Card.Content>
                ) : (
                  ""
                )}
                <Card.Content>
                  <div className="ui two buttons">
                    <Button
                      color="blue"
                      disabled={btnDisabled}
                      onClick={e => handleStatusUpdate(e.target.innerText)}
                    >
                      {buttonText}
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column width={6}>{renderFeeds()}</Grid.Column>
          </Grid.Row>
        </Grid>

        {showDownloader ? (
          <Downloader showDownloader={setShowDownloader} ddo={workToDownload} />
        ) : (
          ""
        )}
      </div>
    )
  }
  return isLoading && !bounty ? (
    renderLoader()
  ) : showSubmitForm ? (
    <SubmitWork bounty={bounty} setButtonText={setButtonText} />
  ) : (
    renderContent()
  )
}
