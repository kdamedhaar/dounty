import React, { useState } from "react"
import { Form, Button, Dropdown, Accordion } from "semantic-ui-react"
import { useOcean, usePublish, usePricing } from "@oceanprotocol/react"
import { Link } from "react-router-dom"
import Spinner from "./Spinner"
import "./Publish.css"

import Confetti from "react-confetti"
import Exchange from "./Exchange"

export default function SubmitWork({ bounty, setButtonText }) {
  const [workUrl, setWorkUrl] = useState(null)
  const [sampleUrl, setSampleUrl] = useState(null)
  const [workComment, setWorkComment] = useState(null)
  const [showSubmitForm, setShowSubmitForm] = useState(false)
  const [enablePricing, setEnablePricing] = useState(false)

  const { publish, publishStepText, isLoading } = usePublish()
  const { accountId } = useOcean()

  const [ddo, setDdo] = useState(null)
  const [data, setData] = useState(null)

  const asset = {
    main: {
      type: "dataset", //dataset
      name: `Dounty Submission : ${bounty.name}`,
      dateCreated: new Date(Date.now()).toISOString().split(".")[0] + "Z", // remove milliseconds
      author: accountId,
      sampleUrl: sampleUrl,
      files: [
        {
          url: workUrl,
          checksum: "efb2c764274b745f5fc37f97c6b0e761",
          encoding: "UTF-8",
          contentLength: "4535431",
          contentType: "image/jpeg",
          compression: "zip"
        }
      ]
    },
    additionalInformation: {
      description: workComment
    }
  }

  async function submitWork() {
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
    setEnablePricing(true)
  }

  async function handleSubmitWork() {
    try {
      let workers = bounty.workers
      workers[accountId].status = "submitted"
      workers[accountId].workUrl = workUrl
      workers[accountId].sampleUrl = sampleUrl
      workers[accountId].workComment = workComment
      workers[accountId].ddo = ddo

      let res = await fetch(`${process.env.REACT_APP_SERVER_URL}/update`, {
        method: "POST",
        body: JSON.stringify({
          _id: bounty._id,
          status: "active",
          workers
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })

      console.log(res.status)
      if (res.status == 200) {
        setButtonText("Work Already Submitted")
      }
    } catch (err) {
      console.error(err)
      alert("Error : " + err.message)
    }
  }

  function renderLoader() {
    return <Spinner text={publishStepText} />
  }

  function renderSuccess() {
    return (
      <div style={{ paddingTop: 200 }}>
        <Confetti width={4000} height={400} />
        <h3 style={{ color: "#fafafa" }}>
          Your work submitted successfully 🎉🎉
        </h3>
        <Link to="/">
          <Button onClick={handleSubmitWork}>Okay</Button>
        </Link>
      </div>
    )
  }

  function renderForm() {
    return (
      <div className="registerContainer">
        <h2 style={{ color: "#f3f3f3" }}>Submit Your Work</h2>
        <Form className="registerForm">
          <Form.Field widths="equals">
            <label for="name">Submission For Bounty</label>
            <input id="name" readOnly value={bounty.name} />
          </Form.Field>
          <Form.Field widths="equals">
            <label for="workUrl">Work Url</label>
            <input
              id="workUrl"
              placeholder="https://drive.google.com/mywork.csv"
              value={workUrl}
              onChange={e => setWorkUrl(e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label for="name">Sample Url</label>
            <input
              id="name"
              placeholder="https://dropbox.com/sampledata.csv"
              value={sampleUrl}
              onChange={e => setSampleUrl(e.target.value)}
            />
          </Form.Field>
          <Form.Field widths="equals">
            <label for="workComment">Comment</label>
            <Form.TextArea
              name="workComment"
              placeholder="Tell us more about how to use your submitted data? What format is it? How many data points?"
              value={workComment}
              onChange={e => setWorkComment(e.target.value)}
            />
          </Form.Field>
          <Form.Button color="blue" onClick={e => submitWork(e)}>
            Submit Your Work
          </Form.Button>
        </Form>
      </div>
    )
  }
  return isLoading ? (
    renderLoader()
  ) : ddo ? (
    enablePricing ? (
      <Exchange ddo={ddo} price={bounty.reward} showLoader={setEnablePricing} />
    ) : (
      renderSuccess()
    )
  ) : (
    renderForm()
  )
}
